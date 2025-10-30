import { Container, Scope } from 'typescript-ioc'
import Viewporter from './Viewporter'
import CardsConfig from './cards/Cards.config'
import TextConfig from './text/Text.config'
import FireConfig from './fire/Fire.config'
import MenuConfig from './menu/Menu.config'

Container.bind(Viewporter).to(Viewporter).scope(Scope.Singleton)
Container.bind(CardsConfig).to(CardsConfig).scope(Scope.Singleton)
Container.bind(TextConfig).to(TextConfig).scope(Scope.Singleton)
Container.bind(FireConfig).to(FireConfig).scope(Scope.Singleton)
Container.bind(MenuConfig).to(MenuConfig).scope(Scope.Singleton)

export default Container
