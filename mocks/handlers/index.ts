import type { HttpHandler } from 'msw'

import boardHandlers from './board.handler'
import contributionHandlers from './contribution.handler'
import { recruitHandlers } from './recruit.handler'
import taskHandlers from './task.handler'

export const API_URL = import.meta.env.VITE_API_BOARD_URL
export const handlers: HttpHandler[] = [
  ...boardHandlers,
  ...taskHandlers,
  ...contributionHandlers,
  ...recruitHandlers,
]
