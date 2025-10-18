import { type JSX } from 'react'
import '@/styles/App.css'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Toaster } from 'react-hot-toast'

// Public
import AuthCallBackPage from './pages/AuthCallBackPage'
import HomePage from './pages/HomePage'
import StartPage from './pages/StartPage'

// Boards
import BoardsPage from './pages/boards/BoardsPage'
import BoardNewPage from './pages/boards/BoardNewPage'
import BoardDetailPage from './pages/boards/BoardDetailPage'
import BoardEditPage from './pages/boards/BoardEditPage'
import ApplicantsPage from './pages/boards/ApplicantsPage'
import MyBoardsPage from './pages/boards/MyBoardsPage'

// Projects
import ProjectsPage from './pages/projects/ProjectsPage'
import ProjectNewPage from './pages/projects/ProjectNewPage'
import ProjectDetailPage from './pages/projects/ProjectDetailPage'
import ProjectEditPage from './pages/projects/ProjectEditPage'
import ProjectBoardPage from './pages/projects/ProjectBoardPage'
import ProjectStatusPage from './pages/projects/ProjectStatusPage'
import ProjectMeetingPage from './pages/projects/ProjectMeetingPage'
import ProjectChatPage from './pages/projects/ProjectChatPage'
import Layout from './components/common/Layout'
import LandingPage from './pages/LandingPage'
import TermsPage from './pages/policy/TermsPage'
import PrivacyPage from './pages/policy/PrivacyPage'

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        containerStyle={{
          top: '100px',
          right: '40px',
        }}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#FFFFFF',
            color: '#000000',
            borderRadius: '4px',
            boxShadow: '0px 0px 20px 0px #00000026',
            fontSize: '14px',
            padding: '12px 16px',
          },
        }}
      />

      <Routes>
        {/* Public */}
        <Route element={<Layout isLoggedIn={false} />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        <Route element={<Layout isLoggedIn={true} />}>
          <Route path="/policy/privacy" element={<PrivacyPage />}></Route>
          <Route path="/policy/terms" element={<TermsPage />}></Route>
          {/* Boards */}
          <Route path="/boards" element={<BoardsPage />} />
          <Route path="/boards/:category" element={<BoardsPage />} />
          <Route path="/boards/new" element={<BoardNewPage />} />
          <Route path="/boards/:category/:postId" element={<BoardDetailPage />} />
          <Route path="/boards/:category/:postId/edit" element={<BoardEditPage />} />
          <Route path="/boards/:category/:postId/applicants" element={<ApplicantsPage />} />
          <Route path="/boards/mine" element={<MyBoardsPage />} />

          {/* Projects */}
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/new" element={<ProjectNewPage />} />
          <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
          <Route path="/projects/:projectId/edit" element={<ProjectEditPage />} />
          <Route path="/projects/:projectId/board" element={<ProjectBoardPage />} />
          <Route path="/projects/:projectId/status" element={<ProjectStatusPage />} />
          <Route path="/projects/:projectId/meeting" element={<ProjectMeetingPage />} />
          <Route path="/projects/:projectId/meeting/:roomId" element={<ProjectMeetingPage />} />
          <Route path="/projects/:projectId/chat" element={<ProjectChatPage />} />
        </Route>

        <Route path="/start" element={<StartPage />} />
        <Route path="/login/oauth2/code/google" element={<AuthCallBackPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
