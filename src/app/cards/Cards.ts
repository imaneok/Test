import { Inject } from 'typescript-ioc'
import CardsConfig from './Cards.config'
import Viewporter from '../Viewporter'
import { Container, DisplayObject, Sprite } from 'pixi.js'
import CardShuffler from './CardShuffler'
import { IScene } from '../scenes/IScene'
import { MiniSignalBinding } from 'mini-signals'

export default class Cards extends Container implements IScene {
  @Inject
  protected config: CardsConfig
  @Inject
  private viewporter: Viewporter
  private firstStack: Container
  private secondStack: Container
  private cards: Sprite[] = []
  private shuffler: CardShuffler
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

    if (this.shuffler) {
      this.shuffler.destroy()
    }
  }

  destroy(): void {
    super.destroy({ children: true })
  }

  private init(): void {
    this.firstStack = new Container()
    this.addChild(this.firstStack as DisplayObject)
    this.secondStack = new Container()
    this.addChild(this.secondStack as DisplayObject)
    this.createCards()

    this.shuffler = new CardShuffler(this.cards, this.secondStack, this.config)
    this.shuffler.start()
  }

  private createCards(): void {
    for (let i = 0; i < this.config.howManyCards; i++) {
      const card = this.createCard(i)
      this.firstStack.addChild(card as DisplayObject)
      this.cards.push(card)
    }
  }

  private createCard(index: number): Sprite {
    const card = Sprite.from(
      `${this.config.fileNamePrefix}${this.getFileNameNumber(index)}${this.config.fileNameSuffix}`,
    )
    card.position.copyFrom(this.config.card.position)
    card.anchor.set(this.config.card.anchor)
    card.scale.set(this.config.card.scale)
    card.rotation = this.config.card.rotation * index
    return card
  }

  private getFileNameNumber(index: number, size: number = 3): string {
    let cardNumber = index
    if (index > this.config.maxCardNumber) {
      const div = Math.floor(index / (this.config.maxCardNumber + 1))
      cardNumber = Math.abs(this.config.maxCardNumber * div - index) - 1
    }
    let sNumber = String(cardNumber)
    while (sNumber.length < size) sNumber = `0${sNumber}`
    return sNumber
  }

  private onResize(): void {
    if (this.destroyed) return

    this.shuffler.onResize()

    if (this.viewporter.isLandscape) {
      this.position.copyFrom(this.config.position.landscape)
      this.firstStack.position.copyFrom(this.config.stacks[0].position.landscape)
      this.secondStack.position.copyFrom(this.config.stacks[1].position.landscape)
      return
    }
    this.position.copyFrom(this.config.position.portrait)
    this.firstStack.position.copyFrom(this.config.stacks[0].position.portrait)
    this.secondStack.position.copyFrom(this.config.stacks[1].position.portrait)
  }
}
