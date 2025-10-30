import { Emitter } from '@pixi/particle-emitter'
import { Inject } from 'typescript-ioc'
import FireConfig from './Fire.config'
import Viewporter from '../Viewporter'
import { TweenLite } from 'gsap'
import { Container, DisplayObject, IDestroyOptions, Sprite, Ticker } from 'pixi.js'
import { IScene } from '../scenes/IScene'
import { MiniSignalBinding } from 'mini-signals'

export default class Fire extends Container implements IScene {
  @Inject
  protected config: FireConfig
  private emitter: Emitter | null
  private torch: Sprite
  @Inject
  private viewporter: Viewporter
  private emitterContainer: Container
  private gamma: number = 0
  private interval: gsap.TweenLite
  private elapsed: number = Date.now()
  private resizeBinding: MiniSignalBinding

  constructor() {
    super()
  }

  public async enter(): Promise<void> {
    this.init()
    this.resizeBinding = this.viewporter.onResize.add(this.onResize, this)
    this.onResize()
    this.detectGyroskope()
    Ticker.shared.add(this.update, this)
  }

  public async exit(): Promise<void> {
    this.resizeBinding.detach()

    Ticker.shared.remove(this.update, this)
    window.removeEventListener('deviceorientation', this.updateGamma, true)

    if (this.emitter) {
      this.emitter.destroy()
      this.emitter = null
    }
    if (this.interval) {
      this.interval.kill()
    }
  }

  destroy(options?: boolean | IDestroyOptions): void {
    super.destroy(options)
  }

  private init(): void {
    this.torch = this.createTorch()
    this.addChild(this.torch as DisplayObject)
    this.emitterContainer = new Container()
    this.addChild(this.emitterContainer as DisplayObject)
    this.emitterContainer.position.set(-10, -65)
    this.emitterContainer.scale.set(2.2)
    this.emitter = this.createEmitter()
  }

  private createEmitter(): Emitter {
    const emitter = new Emitter(this.emitterContainer, this.config.art)
    return emitter
  }

  private createTorch(): Sprite {
    const torch = Sprite.from(this.config.torch.sprite)
    torch.position.copyFrom(this.config.torch.position)
    torch.anchor.set(this.config.torch.anchor)
    torch.scale.set(this.config.torch.scale)
    torch.rotation = this.config.torch.rotation
    return torch
  }

  private onResize(): void {
    if (this.destroyed) return

    if (this.viewporter.isLandscape) {
      this.position.copyFrom(this.config.position.landscape)
      return
    }
    this.position.copyFrom(this.config.position.portrait)
  }

  private detectGyroskope() {
    if (!window.DeviceOrientationEvent) return

    window.addEventListener('deviceorientation', this.updateGamma, true)

    this.interval = TweenLite.delayedCall(0.1, () => {
      this.interval.restart(true)
    })
  }

  private updateGamma = (event: DeviceOrientationEvent) => {
    this.gamma = event.gamma ?? 0
  }

  private update(): void {
    if (!this.emitter) return

    const now = Date.now()
    this.emitter.update((now - this.elapsed) * 0.001)
    this.elapsed = now
  }
}
