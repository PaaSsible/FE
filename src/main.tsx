import { isCommonAssetRequest } from 'msw'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App'

const enableMocking = async () => {
  // const isDev = import.meta.env.DEV
  // if (!isDev) {
  //   return
  // }
  // const { worker } = await import('../mocks/browser')
  // return worker.start({
  //   onUnhandledRequest: (request) => {
  //     if (isCommonAssetRequest(request)) {
  //       return
  //     }
  //   },
  // })
}

enableMocking()
  .then(() => {
    createRoot(document.getElementById('root')!).render(<App />)
  })
  .catch((err) => {
    console.error('MSW initialization failed', err)
  })
