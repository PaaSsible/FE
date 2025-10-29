import { Outlet } from 'react-router-dom'

import MypageSidebar from '@/components/common/MypageSidebar'

export default function MypageLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <MypageSidebar />

      <section className="flex-1 overflow-y-auto">
        <Outlet />
      </section>
    </div>
  )
}
