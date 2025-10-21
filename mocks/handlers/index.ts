import { bypass, http, HttpResponse, passthrough, type HttpHandler } from 'msw'

import boardHandlers from './board.handler'
import contributionHandlers from './contribution.handler'
import { recruitHandlers } from './recruit.handler'
import taskHandlers from './task.handler'

export const handlers: HttpHandler[] = [
  http.get('chrome-extension://*', () => {
    console.log('Chrome extension request detected')
    return passthrough()
  }),
  http.get('http://localhost:5173/assets/*.svg', async ({ request }) => {
    console.log('Public asset request detected')
    const response = await fetch(bypass(request)).then((res) => res.arrayBuffer())
    return HttpResponse.arrayBuffer(response, { headers: { 'content-type': 'image/svg' } })
  }),
  http.get('http://localhost:5173/assets/*.png', async ({ request }) => {
    console.log('Public asset request detected')
    const response = await fetch(bypass(request)).then((res) => res.arrayBuffer())
    return HttpResponse.arrayBuffer(response, { headers: { 'content-type': 'image/png' } })
  }),
  http.get('http://localhost:5173/assets/*.woff2', async ({ request }) => {
    console.log('Public asset request detected')
    const response = await fetch(bypass(request)).then((res) => res.arrayBuffer())
    return HttpResponse.arrayBuffer(response, { headers: { 'content-type': 'font/woff2' } })
  }),
  ...boardHandlers,
  ...taskHandlers,
  ...contributionHandlers,
  ...recruitHandlers,
]
