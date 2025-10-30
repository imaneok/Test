import { Inject, Singleton } from 'typescript-ioc'
import Viewporter from '../Viewporter'
import { Point, TextStyle } from 'pixi.js'

export default class TextConfig {
  @Inject
  private viewporter: Viewporter

  get position() {
    return {
      landscape: new Point(this.viewporter.WIDTH_LANDSCAPE / 2, this.viewporter.HEIGHT_LANDSCAPE / 2),
      portrait: new Point(this.viewporter.WIDTH_PORTRAIT / 2, this.viewporter.HEIGHT_PORTRAIT / 2),
    }
  }

  get maxWidth() {
    return {
      landscape: this.viewporter.WIDTH_LANDSCAPE,
      portrait: this.viewporter.WIDTH_PORTRAIT,
    }
  }

  readonly symbol = {
    fileName: 'yo.png',
    scale: 1,
    anchor: 0,
  }
  readonly fontStyle = new TextStyle({
    fontFamily: 'Arial',
    fontWeight: 'bold',
    fontSize: 26,
    fill: 0xffffff,
    align: 'center',
  })
  readonly maxFontSize = 220
  readonly minFontSize = 20
}
