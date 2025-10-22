import { bypass, http, HttpResponse, passthrough, type HttpHandler } from 'msw'

import boardHandlers from './board.handler'
import contributionHandlers from './contribution.handler'
import { recruitHandlers } from './recruit.handler'
import taskHandlers from './task.handler'

export const handlers: HttpHandler[] = [
  http.get('chrome-extension://*', () => {
    return passthrough()
  }),
  http.get('*.svg', async ({ request }) => {
    console.log('svg static file detected')
    const response = await fetch(bypass(request)).then((res) => res.arrayBuffer())
    return HttpResponse.arrayBuffer(response, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    })
  }),
  http.get('*.png', async ({ request }) => {
    console.log('png static file detected')
    const response = await fetch(bypass(request)).then((res) => res.arrayBuffer())
    return HttpResponse.arrayBuffer(response, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
      },
    })
  }),
  http.get('*.jpg', async ({ request }) => {
    console.log('png static file detected')
    const response = await fetch(bypass(request)).then((res) => res.arrayBuffer())
    return HttpResponse.arrayBuffer(response, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpg',
      },
    })
  }),
  http.get('*.woff2', async ({ request }) => {
    console.log('woff2 static file detected')
    const response = await fetch(bypass(request)).then((res) => res.arrayBuffer())
    return HttpResponse.arrayBuffer(response, {
      status: 200,
      headers: {
        'Content-Type': 'font/woff2',
      },
    })
  }),
  ...boardHandlers,
  ...taskHandlers,
  ...contributionHandlers,
  ...recruitHandlers,
]
