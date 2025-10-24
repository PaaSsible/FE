import { type JSX } from 'react'
import '@/styles/App.css'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Toaster as ShadcnToaster } from '@/components/ui/sonner'

// Public
import Layout from './components/common/Layout'
import MypageLayout from './components/common/MypageLayout'
import ProjectsLayout from './components/common/ProjectsLayout'
import AuthCallBackPage from './pages/AuthCallBackPage'
import LandingPage from './pages/LandingPage'
import StartPage from './pages/StartPage'
// Boards
import ApplicantsPage from './pages/boards/ApplicantsPage'
import BoardDetailPage from './pages/boards/BoardDetailPage'
import BoardEditPage from './pages/boards/BoardEditPage'
import BoardNewPage from './pages/boards/BoardNewPage'
import BoardsPage from './pages/boards/BoardsPage'
import MyBoardsPage from './pages/boards/MyBoardsPage'
// Mypage
import MypageApplicationsPage from './pages/mypage/MypageApplicationsPage'
import MypageNotificationsPage from './pages/mypage/MypageNotificationsPage'
import MypagePortfolioPage from './pages/mypage/MypagePortfolioPage'
import MypageProfilePage from './pages/mypage/MypageProfilePage'
import PrivacyPage from './pages/policy/PrivacyPage'
import TermsPage from './pages/policy/TermsPage'
// Projects
import ProjectBoardPage from './pages/projects/ProjectBoardPage'
import ProjectChatPage from './pages/projects/ProjectChatPage'
import ProjectDetailPage from './pages/projects/ProjectDetailPage'
import ProjectEditPage from './pages/projects/ProjectEditPage'
import ProjectLayout from './pages/projects/ProjectLayout'
import ProjectMeetingPage from './pages/projects/ProjectMeetingPage'
import ProjectNewPage from './pages/projects/ProjectNewPage'
import ProjectStatusPage from './pages/projects/ProjectStatusPage'
import ProjectTaskPage from './pages/projects/ProjectTaskPage'
import ProjectsPage from './pages/projects/ProjectsPage'

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
      <ShadcnToaster position="top-right" />
      <Routes>
        {/* Public */}
        <Route element={<Layout isLoggedIn={false} />}>
          <Route index element={<LandingPage />} />
        </Route>

        <Route element={<Layout isLoggedIn={true} />}>
          {/* Policy */}
          <Route path="policy/privacy" element={<PrivacyPage />} />
          <Route path="policy/terms" element={<TermsPage />} />

          {/* Boards */}
          <Route path="boards" element={<BoardsPage />} />
          <Route path="boards/new" element={<BoardNewPage />} />
          <Route path="boards/mine" element={<MyBoardsPage />} />
          <Route path="boards/:postId" element={<BoardDetailPage />} />
          <Route path="boards/:postId/edit" element={<BoardEditPage />} />
          <Route path="boards/:postId/applicants" element={<ApplicantsPage />} />

          {/* Projects */}
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/new" element={<ProjectNewPage />} />

          <Route path="projects/:projectId" element={<ProjectsLayout />}>
            <Route index element={<ProjectDetailPage />} />
            <Route path="edit" element={<ProjectEditPage />} />
            <Route path="board" element={<ProjectBoardPage />} />
            <Route path="board/:taskId" element={<ProjectTaskPage />} />

            <Route path="status" element={<ProjectStatusPage />} />
            <Route path="meeting" element={<ProjectMeetingPage />} />
            <Route path="meeting/:roomId" element={<ProjectMeetingPage />} />
            <Route path="chat" element={<ProjectChatPage />} />
          </Route>

          <Route path="mypage" element={<MypageLayout />}>
            <Route index element={<MypageProfilePage />} />
            <Route path="portfolio" element={<MypagePortfolioPage />} />
            <Route path="applications" element={<MypageApplicationsPage />} />
            <Route path="notifications" element={<MypageNotificationsPage />} />
          </Route>
        </Route>

        <Route path="start" element={<StartPage />} />
        <Route path="login/oauth2/code/google" element={<AuthCallBackPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
