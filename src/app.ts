import './styles/app.scss'
import { Application, Assets, Container, DisplayObject } from 'pixi.js'
import { Inject } from 'typescript-ioc'
import Viewporter, { IViewportData } from './app/Viewporter'
import Menu from './app/menu/Menu'
import { ButtonID } from './app/menu/Menu.config'
import Fps from './app/Fps'
import SceneManager from './app/scenes/SceneManager'

class Game {
  private readonly app: Application
  @Inject
  private viewporter: Viewporter
  private menu: Menu
  private gameContainer: Container
  private sceneLayer: Container
  private uiLayer: Container
  private sceneManager: SceneManager

  constructor() {
    this.app = new Application({
      backgroundColor: 0x000000,
    })
    ;(globalThis as any).__PIXI_APP__ = this.app

    document.body.appendChild(this.app.view as HTMLCanvasElement)

    this.loadAssets()
  }

  private async loadAssets(): Promise<void> {
    Assets.add('sprite', 'assets/sprite.json')
    await Assets.load('sprite')
    this.setup()
  }

  private setup(): void {
    this.gameContainer = new Container()
    this.app.stage.addChild(this.gameContainer as DisplayObject)
    this.sceneLayer = new Container()
    this.gameContainer.addChild(this.sceneLayer as DisplayObject)
    this.uiLayer = new Container()
    this.gameContainer.addChild(this.uiLayer as DisplayObject)
    this.sceneManager = new SceneManager(this.sceneLayer)
    this.viewporter.init(this.app)
    this.viewporter.onResize.add(this.onResize, this)

    this.menu = this.createMenu()
    this.createFPS()
    this.menu.onClick.add(this.onMenuClick, this)

    this.viewporter.resize()
  }

  private onResize = (viewportData: IViewportData): void => {
    this.gameContainer.position.copyFrom(viewportData.position)
    this.gameContainer.scale.set(viewportData.scale)
  }

  private createMenu(): Menu {
    const menu = new Menu()
    this.uiLayer.addChild(menu as DisplayObject)
    return menu
  }

  private createFPS() {
    return new Fps()
  }

  private onMenuClick(buttonID: ButtonID): void {
    this.sceneManager.switchScene(buttonID)
  }
}

const game = new Game()
