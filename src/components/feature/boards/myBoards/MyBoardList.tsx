import MyBoardItem from './MyBoardItem'

interface MyBoardListProps {
  onDeleteBoard: () => void
}

const mockBoards = [
  {
    id: 1,
    title: '팀 프로젝트 React 기반 프론트엔드 개발자 1명 구합니다',
    createdAt: '2시간 전',
    deadline: '2025-07-31',
    position: '프론트엔드',
    tags: ['React', '요구스택', '조건예시'],
    views: 133,
    applicants: 3,
  },
  {
    id: 2,
    title: '팀 프로젝트 React 기반 프론트엔드 개발자 1명 구합니다',
    createdAt: '2시간 전',
    deadline: '2025-07-31',
    position: '프론트엔드',
    tags: ['React', '요구스택', '조건예시'],
    views: 133,
    applicants: 3,
  },
]

export default function MyBoardList({ onDeleteBoard }: MyBoardListProps) {
  return (
    <section>
      <p className="mb-4 font-medium text-gray-500">내 모집글 {mockBoards.length}건</p>

      <div className="flex flex-col gap-4">
        {mockBoards.map((board) => (
          <MyBoardItem key={board.id} {...board} onDeleteClick={onDeleteBoard} />
        ))}
      </div>
    </section>
  )
}
