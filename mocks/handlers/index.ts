import type { HttpHandler } from 'msw'

import { boardHandlers } from './board.handler'

export const handlers: HttpHandler[] = [...boardHandlers]
