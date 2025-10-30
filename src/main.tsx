import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { isCommonAssetRequest } from 'msw'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App'

const queryClient = new QueryClient()
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
    createRoot(document.getElementById('root')!).render(
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>,
    )
  })
  .catch((err) => {
    console.error('MSW initialization failed', err)
  })
