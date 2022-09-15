import { standardFilters, standardMessages } from './standard-filters.js'
import { localFilters, localMessages } from './local-filters.js'

export const filters = [
    ...localFilters,
    ...standardFilters
]

export const messages = {
    ...standardMessages,
    ...localMessages
}