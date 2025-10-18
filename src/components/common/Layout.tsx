import { Outlet } from 'react-router-dom'

import Footer from './Footer'
import Header from './Header'

interface LayoutProps {
  isLoggedIn: boolean
}

const Layout: React.FC<LayoutProps> = ({ isLoggedIn }: LayoutProps) => (
  <div className="font-pretendard flex min-h-screen flex-col">
    <Header isLoggedIn={isLoggedIn} />
    <main className="flex-1 bg-gray-50">
      <Outlet />
    </main>
    <Footer />
  </div>
)

export default Layout
