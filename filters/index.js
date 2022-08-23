import { standardFilters, standardMessages } from './standard-filters'
import { localFilters, localMessages } from './local-filters'

export const filters = [
    ...localFilters,
    ...standardFilters
]

export const messages = {
    ...standardMessages,
    ...localMessages
}