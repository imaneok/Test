import { Inject, Singleton } from 'typescript-ioc'
import Viewporter from '../Viewporter'
import { Point, TextStyle } from 'pixi.js'

export default class MenuConfig {
  @Inject
  private viewporter: Viewporter

  get position() {
    return {
      landscape: new Point(this.viewporter.WIDTH_LANDSCAPE / 2, this.viewporter.HEIGHT_LANDSCAPE),
      portrait: new Point(this.viewporter.WIDTH_PORTRAIT / 2, this.viewporter.HEIGHT_PORTRAIT),
    }
  }

  readonly fileName = 'button.png'
  readonly anchor = new Point(0.5, 0.5)
  readonly scale = 0.8
  readonly buttons = [
    {
      id: ButtonID.CARDS,
      text: 'Cards',
      position: {
        landscape: new Point(-420, -110),
        portrait: new Point(0, -360),
      },
    },
    {
      id: ButtonID.TEXT,
      text: 'Text',
      position: {
        landscape: new Point(0, -110),
        portrait: new Point(0, -240),
      },
    },
    {
      id: ButtonID.FIRE,
      text: 'Fire',
      position: {
        landscape: new Point(420, -110),
        portrait: new Point(0, -120),
      },
    },
  ]
  readonly text = {
    style: new TextStyle({
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fontSize: 60,
      fill: 0xffffff,
      align: 'center',
    }),
    position: new Point(0, -11),
    anchor: 0.5,
  }
}

export enum ButtonID {
  CARDS,
  TEXT,
  FIRE,
}

export interface IButtonConfig {
  id: number
  text: string
  position: { portrait: Point; landscape: Point }
}
