import { type JSX } from 'react'
import '@/styles/App.css'
import { BrowserRouter, Route, Routes } from 'react-router'

import AuthCallBackPage from './pages/AuthCallBackPage'
import HomePage from './pages/HomePage'
import StartPage from './pages/StartPage'

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/start" element={<StartPage />} />
        <Route path="/login/oauth2/code/google" element={<AuthCallBackPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
