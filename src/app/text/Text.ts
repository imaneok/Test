import { Inject } from 'typescript-ioc'
import { TweenLite } from 'gsap'
import TextConfig from './Text.config'
import Viewporter from '../Viewporter'
import { Container, DisplayObject, Sprite, Text as PixiText } from 'pixi.js'
import { IScene } from '../scenes/IScene'
import { MiniSignalBinding } from 'mini-signals'

export default class Text extends Container implements IScene {
  @Inject
  protected config: TextConfig
  @Inject
  private viewporter: Viewporter
  private interval: gsap.TweenLite
  private fontSize: number
  private resizeBinding: MiniSignalBinding

  constructor() {
    super()
  }

  public async enter(): Promise<void> {
    this.init()
    this.resizeBinding = this.viewporter.onResize.add(this.onResize, this)
    this.onResize()
  }

  public async exit(): Promise<void> {
    this.resizeBinding.detach()

    if (this.interval) {
      this.interval.kill()
    }
  }

  destroy(): void {
    super.destroy({ children: true })
  }

  private init(): void {
    this.autoFitText()
    this.interval = TweenLite.delayedCall(2, () => {
      this.interval.restart(true)
      this.autoFitText()
    })
  }

  private autoFitText(): void {
    const originalText = this.generateText()
    this.removeChildren()
    const text = new PixiText(originalText, this.config.fontStyle)
    this.addChild(text as DisplayObject)

    text.style.fontSize = Math.floor(Math.random() * this.config.maxFontSize) + this.config.minFontSize

    while (text.width > this.getMaxWidth()) {
      text.style.fontSize = (text.style.fontSize as number) - 1
    }
    const fontSize = text.style.fontSize as number
    this.fontSize = fontSize

    this.removeChildren()
    const textArr = originalText.split('{{symbol}}')

    textArr.forEach((t: string, index: number) => {
      const newText = new PixiText(t, this.config.fontStyle)
      newText.style.fontSize = fontSize
      newText.position.x = this.width
      this.addChild(newText as DisplayObject)

      if (index !== textArr.length - 1) {
        this.addSymbol()
      }
    })

    this.pivot.x = this.width / 2
    this.pivot.y = this.height / 2
  }

  private generateText(): string {
    return `${this.generatePartText()}${this.generatePartText()}${this.generatePartText()}`
  }

  private generatePartText(): string {
    const possibilities = [' text ', '{{symbol}}']
    return possibilities[Math.floor(Math.random() * 2)]
  }

  private addSymbol(): void {
    const symbol = Sprite.from(this.config.symbol.fileName)
    symbol.scale.set(this.fontSize / this.config.maxFontSize)
    symbol.anchor.set(this.config.symbol.anchor)
    symbol.position.x = this.width
    this.addChild(symbol as DisplayObject)
  }

  private getMaxWidth(): number {
    return this.viewporter.isLandscape ? this.config.maxWidth.landscape : this.config.maxWidth.portrait
  }

  private onResize(): void {
    if (this.destroyed) return

    if (this.viewporter.isLandscape) {
      this.position.copyFrom(this.config.position.landscape)
      return
    }
    this.position.copyFrom(this.config.position.portrait)
  }
}
