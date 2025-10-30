import { Container } from 'pixi.js'

export interface IScene extends Container {
  enter(): Promise<void>
  exit(): Promise<void>
}
