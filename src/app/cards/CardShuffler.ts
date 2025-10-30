import { gsap } from 'gsap'
import { Container, DisplayObject, Point, Sprite } from 'pixi.js'
import CardsConfig from './Cards.config'

export default class CardShuffler {
  private shuffleTimeline: gsap.core.Timeline

  constructor(
    private cards: Sprite[],
    private secondStack: Container,
    private config: CardsConfig,
  ) {}

  public start(): void {
    this.shuffleTimeline = gsap.timeline({ delay: this.config.animation.delay })

    const reversedCards = [...this.cards].reverse()

    reversedCards.forEach((card, index) => {
      this.shuffleTimeline.add(() => this.shuffle(card, index), `>+${this.config.animation.delay}`)
    })
  }

  public onResize(): void {
    this.shuffleTimeline.pause()
    const activeTweens = gsap.getTweensOf(this.cards)
    activeTweens.forEach((tween) => tween.progress(1))
    this.shuffleTimeline.resume()
  }

  public destroy(): void {
    if (this.shuffleTimeline) {
      this.shuffleTimeline.kill()
    }
    gsap.killTweensOf(this.cards)
  }

  private shuffle(card: Sprite, index: number): void {
    const globalPos = card.getGlobalPosition(new Point(0, 0))
    this.secondStack.addChild(card as DisplayObject)
    card.position.copyFrom(this.secondStack.toLocal(globalPos))

    gsap.to(card, {
      x: 0,
      y: 0,
      rotation: this.config.card.rotation * index,
      duration: this.config.animation.time,
    })
  }
}
