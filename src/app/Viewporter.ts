import * as MiniSignal from 'mini-signals'
import { Singleton } from 'typescript-ioc'
import { Application, Point, Renderer } from 'pixi.js'

export interface IViewportData {
  scale: number
  position: Point
}

@Singleton
export default class Viewporter {
  onResize: MiniSignal = new MiniSignal()
  readonly WIDTH_LANDSCAPE: number = 1280
  readonly HEIGHT_LANDSCAPE: number = 720
  readonly WIDTH_PORTRAIT: number = 720
  readonly HEIGHT_PORTRAIT: number = 1280

  private renderer: Renderer
  private orientation: Orientation
  private areaWidth: number
  private areaHeight: number

  init(application: Application): void {
    this.renderer = application.renderer as Renderer

    window.addEventListener('resize', this.resize)
    window.addEventListener('orientationchange', this.resize)
  }

  public resize = (): void => {
    const innerWidth = window.innerWidth
    const innerHeight = window.innerHeight

    if (innerWidth > innerHeight) {
      this.setLandscapeOrientation()
    } else {
      this.setPortraitOrientation()
    }

    this.renderer.resize(innerWidth, innerHeight)

    const scale = Math.min(innerWidth / this.areaWidth, innerHeight / this.areaHeight)

    const x = innerWidth / 2.0 - (this.areaWidth / 2.0) * scale
    const y = innerHeight / 2.0 - (this.areaHeight / 2.0) * scale

    this.onResize.dispatch({ scale, position: new Point(x, y) })
  }

  get isLandscape(): boolean {
    return this.orientation === Orientation.LANDSCAPE
  }

  private setLandscapeOrientation(): void {
    this.orientation = Orientation.LANDSCAPE
    this.areaWidth = this.WIDTH_LANDSCAPE
    this.areaHeight = this.HEIGHT_LANDSCAPE
  }

  private setPortraitOrientation(): void {
    this.orientation = Orientation.PORTRAIT
    this.areaWidth = this.WIDTH_PORTRAIT
    this.areaHeight = this.HEIGHT_PORTRAIT
  }
}

export enum Orientation {
  PORTRAIT,
  LANDSCAPE,
}
