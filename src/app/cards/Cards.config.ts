import { Inject, Singleton } from 'typescript-ioc'
import Viewporter from '../Viewporter'
import { Point } from 'pixi.js'

export default class CardsConfig {
  @Inject
  private viewporter: Viewporter

  get position() {
    return {
      landscape: new Point(this.viewporter.WIDTH_LANDSCAPE / 2, this.viewporter.HEIGHT_LANDSCAPE / 2),
      portrait: new Point(this.viewporter.WIDTH_PORTRAIT / 2, this.viewporter.HEIGHT_PORTRAIT / 2 - 50),
    }
  }

  readonly stacks = [
    {
      position: {
        landscape: new Point(-300, 0),
        portrait: new Point(0, -400),
      },
    },
    {
      position: {
        landscape: new Point(300, 0),
        portrait: new Point(0, 100),
      },
    },
  ]
  readonly fileNamePrefix = 'tile'
  readonly fileNameSuffix = '.png'
  readonly maxCardNumber = 53
  readonly howManyCards = 144
  readonly card = {
    position: new Point(0, 0),
    anchor: 0.5,
    scale: 1.5,
    rotation: 0.01,
  }
  readonly animation = {
    delay: 1,
    time: 2,
  }
}
