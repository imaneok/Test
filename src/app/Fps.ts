import Stats from 'stats.js'

export default class Fps {
  private readonly div: HTMLDivElement
  private stats: Stats

  constructor() {
    this.stats = new Stats()
    this.stats.showPanel(0)

    this.div = document.createElement('div')
    this.div.id = 'stats'
    this.div.appendChild(this.stats.dom)
    document.body.appendChild(this.div)

    const animate = () => {
      this.stats.begin()
      this.stats.end()
      requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }
}
