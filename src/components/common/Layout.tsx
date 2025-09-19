import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

const Layout = () => (
  <div className="flex min-h-screen flex-col">
    <Header isLoggedIn={true} />
    <main className="flex-1">
      <Outlet /> {/* 여기서 하위 라우트가 바뀜 */}
    </main>
    <Footer />
  </div>
)

export default Layout
