import BoardsPageHeader from '@/components/feature/boards/BoardsPageHeader'
import MyBoardList from '@/components/feature/boards/myBoards/MyBoardList'

export default function MyBoardsPage() {
  const handleBackClick = () => {
    window.history.back()
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 px-[144px] py-[44px] text-start">
      {/* 상단 헤더 */}
      <BoardsPageHeader title="내 모집글 관리" onBackClick={handleBackClick} />

      <div className="mt-10">
        <MyBoardList />
      </div>
    </div>
  )
}
