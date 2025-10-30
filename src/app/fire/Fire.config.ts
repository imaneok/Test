import { Inject, Singleton } from 'typescript-ioc'
import Viewporter from '../Viewporter'
import { Point } from 'pixi.js'

export default class FireConfig {
  @Inject
  private viewporter: Viewporter

  get position() {
    return {
      landscape: new Point(this.viewporter.WIDTH_LANDSCAPE / 2, this.viewporter.HEIGHT_LANDSCAPE / 2 - 100),
      portrait: new Point(this.viewporter.WIDTH_PORTRAIT / 2, this.viewporter.HEIGHT_PORTRAIT / 2 - 100),
    }
  }

  readonly art = {
    lifetime: {
      min: 1,
      max: 1.3,
    },
    frequency: 0.01,
    emitterLifetime: -1,
    maxParticles: 200,
    addAtBack: false,
    pos: {
      x: 0,
      y: 0,
    },
    behaviors: [
      {
        type: 'alpha',
        config: {
          alpha: {
            list: [
              { value: 0.7, time: 0 },
              { value: 0, time: 1 },
            ],
          },
        },
      },
      {
        type: 'scale',
        config: {
          scale: {
            list: [
              { value: 0.8, time: 0 },
              { value: 0.2, time: 1 },
            ],
          },
          minMult: 0.5,
        },
      },
      {
        type: 'color',
        config: {
          color: {
            list: [
              { value: 'ffff00', time: 0 },
              { value: '000000', time: 1 },
            ],
          },
        },
      },
      {
        type: 'moveSpeed',
        config: {
          speed: {
            list: [
              { value: 70, time: 0 },
              { value: 120, time: 1 },
            ],
          },
        },
      },
      {
        type: 'rotationStatic',
        config: {
          min: 360,
          max: 380,
        },
      },
      {
        type: 'rotation',
        config: {
          accel: 0,
          minSpeed: 0,
          maxSpeed: 80,
          minStart: 250,
          maxStart: 275,
        },
      },
      {
        type: 'textureRandom',
        config: {
          textures: ['fire000.png', 'fire001.png', 'fire002.png', 'fire003.png', 'fire004.png'],
        },
      },
      {
        type: 'spawnShape',
        config: {
          type: 'circle',
          data: {
            x: 0,
            y: 0,
            radius: 3,
          },
        },
      },
    ],
  }

  readonly torch = {
    sprite: 'torch.png',
    position: new Point(7, 38),
    anchor: 0.5,
    scale: 1,
    rotation: -0.785398,
  }
}
