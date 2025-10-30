import { Inject } from 'typescript-ioc'
import MenuConfig, { IButtonConfig } from './Menu.config'
import Viewporter from '../Viewporter'
import * as MiniSignal from 'mini-signals'
import * as PIXI from 'pixi.js'
import { DisplayObject } from 'pixi.js'

export default class Menu extends PIXI.Container {
  onClick: MiniSignal = new MiniSignal()
  @Inject
  protected config: MenuConfig
  @Inject
  private viewporter: Viewporter
  private buttons: PIXI.Container[] = []
  private alreadyClicked: boolean

  constructor() {
    super()
    this.createButtons()
    this.viewporter.onResize.add(this.onResize, this)
    this.onResize()
  }

  private createButtons(): void {
    this.config.buttons.forEach((buttonConfig) => {
      const button = this.createButton(buttonConfig)
      this.addChild(button as DisplayObject)
      this.buttons.push(button)
    })
  }

  private createButton(buttonConfig: IButtonConfig): PIXI.Container {
    const buttonContainer = new PIXI.Container()
    const buttonSprite = PIXI.Sprite.from(this.config.fileName)
    buttonSprite.anchor.copyFrom(this.config.anchor)
    buttonSprite.scale.set(this.config.scale)

    const buttonText = this.createText(buttonConfig)

    buttonContainer.addChild(buttonSprite as DisplayObject)
    buttonContainer.addChild(buttonText as DisplayObject)
    buttonContainer.eventMode = 'static'
    buttonContainer.cursor = 'pointer'
    buttonContainer.on('pointerdown', () => {
      this.alreadyClicked = true
      this.onClick.dispatch(buttonConfig.id)
      this.onResize()
    })

    return buttonContainer
  }

  private createText(buttonConfig: IButtonConfig): PIXI.Text {
    const newText = new PIXI.Text(buttonConfig.text, this.config.text.style)
    newText.position.copyFrom(this.config.text.position)
    newText.anchor.set(this.config.text.anchor)
    return newText
  }

  private onResize(): void {
    if (this.destroyed) return

    this.buttons.forEach((button, index) => {
      if (this.viewporter.isLandscape) {
        button.position.copyFrom(this.config.buttons[index].position.landscape)
      } else {
        button.position.copyFrom(this.config.buttons[index].position.portrait)
      }
    })

    if (this.viewporter.isLandscape) {
      this.position.copyFrom(this.config.position.landscape)
      if (!this.alreadyClicked) {
        this.position.y = this.viewporter.HEIGHT_LANDSCAPE / 2 + 50
      }
      return
    }
    this.position.copyFrom(this.config.position.portrait)
    if (!this.alreadyClicked) {
      this.position.y = this.viewporter.HEIGHT_PORTRAIT / 2 + 150
    }
  }
}
