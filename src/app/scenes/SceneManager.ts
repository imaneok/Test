import { Container, DisplayObject } from 'pixi.js'
import { IScene } from './IScene'
import Cards from '../cards/Cards'
import Text from '../text/Text'
import Fire from '../fire/Fire'
import { ButtonID } from '../menu/Menu.config'

export type SceneID = ButtonID

export default class SceneManager {
  private sceneContainer: Container
  private currentScene: IScene | null = null
  private sceneRegistry: Record<SceneID, new () => IScene> = {} as any

  constructor(container: Container) {
    this.sceneContainer = container
    this.registerScenes()
  }

  private registerScenes(): void {
    this.sceneRegistry[ButtonID.CARDS] = Cards
    this.sceneRegistry[ButtonID.TEXT] = Text
    this.sceneRegistry[ButtonID.FIRE] = Fire
  }

  public async switchScene(sceneId: SceneID): Promise<void> {
    if (this.currentScene) {
      await this.currentScene.exit()
      this.sceneContainer.removeChild(this.currentScene as DisplayObject)
      this.currentScene.destroy({ children: true })
      this.currentScene = null
    }

    const SceneClass = this.sceneRegistry[sceneId]
    if (SceneClass) {
      this.currentScene = new SceneClass()
      this.sceneContainer.addChild(this.currentScene as DisplayObject)
      await this.currentScene.enter()
    }
  }
}
