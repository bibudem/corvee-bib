import { standardPlugins, standardMessages } from './standard-plugins'
import { localPlugins, localMessages } from './local-plugins'

export const plugins = [
    ...localPlugins,
    ...standardPlugins
]

export const messages = {
    ...standardMessages,
    ...localMessages
}