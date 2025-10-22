import BoardsPageHeader from '@/components/feature/boards/BoardsPageHeader'
// import ApplicantList from '@/components/feature/boards/applicants/ApplicantList'

export default function ApplicantsPage() {
  const handleBackClick = () => {
    window.history.back()
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 px-[144px] py-[44px] text-start">
      {/* 상단 헤더 */}
      <BoardsPageHeader title="지원자 확인" onBackClick={handleBackClick} />

      <div className="mt-10">{/* <ApplicantList /> */}</div>
    </div>
  )
}
