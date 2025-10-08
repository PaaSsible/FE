import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  isLoggedIn: boolean
}

const Layout: React.FC<LayoutProps> = ({ isLoggedIn }) => (
  <div className="font-pretendard flex min-h-screen flex-col">
    <Header isLoggedIn={isLoggedIn} />
    <main className="flex-1 bg-gray-50">
      <Outlet />
    </main>
    <Footer />
  </div>
)

export default Layout
