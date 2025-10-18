import { useState } from 'react'
// import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'

import Button from '@/components/atoms/Button'
import Modal from '@/components/common/Modal'
import BoardsPageHeader from '@/components/feature/boards/BoardsPageHeader'
import BoardsDetailBody from '@/components/feature/boards/boardDetail/BoardsDetailBody'
import BoardsDetailComments from '@/components/feature/boards/boardDetail/BoardsDetailComments'
import BoardsDetailMeta from '@/components/feature/boards/boardDetail/BoardsDetailMeta'

export default function BoardDetailPage() {
  const navigate = useNavigate()
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)

  /**
   * 📌 실제 API 응답 형태(data) 기준에 맞춘 목업
   * - recruits 배열: position, stacks 포함
   * - createdAt, updatedAt: 메타 표시용
   */
  const mockPost = {
    postId: 33,
    title:
      '팀 프로젝트 React 기반 프론트엔드 개발자 1명 구합니다. 만약 제목이 이렇게 길어지면 아래로 내려가면 될 것 같아요.',
    content: `
안녕하세요 🙌  
현재 3인 팀의 PM 겸 기획자로 프로젝트를 진행하고 있습니다.  
디자인과 백엔드는 개발이 어느 정도 완료되어 있으며, React 프론트엔드 담당을 추가로 모집합니다.  

✅ 주요 업무  
- 기존 백엔드 API 연동  
- 반응형 UI 작업  
- 상태 관리 로직 개선 (Zustand / Recoil 사용 예정)

💡 예상 기간  
- 8월 말까지 진행되는 단기 프로젝트

🧑‍💻 모집 포지션  
- React 기반 프론트엔드 개발자 1명

⭐️ 자격 요건  
- Git 협업 경험이 있으신 분  
- React 경험 6개월 이상  
- 컴포넌트 설계 및 상태 관리 경험

💬 참고  
- 코드 리뷰와 회고를 통해 함께 성장하는 팀 분위기입니다.
`,
    mainCategory: 'SIDE_PROJECT', // 실제 enum 값
    subCategory: 'DEVELOPMENT', // 실제 enum 값
    writerId: 1,
    writerName: '최서영',
    createdAt: '2025.08.12 12:34',
    updatedAt: '2025.08.12 16:55',
    deadline: '2025.08.26',
    projectDuration: 'UNDEFINED', // 'UNDEFINED' → '미정'으로 표시
    viewCount: 133,
    applicationCount: 3,
    recruits: [
      {
        position: '프론트엔드 개발자',
        stacks: ['React', 'Next.js', 'TypeScript'],
      },
      {
        position: '백엔드 개발자',
        stacks: ['Spring', 'MySQL', 'AWS'],
      },
    ],
    comments: [
      {
        id: 1,
        author: '이윤지',
        content:
          '이런 스택이 없으면 어려울까요? 이런 질문이 달리겠죠? 제가 단 댓글은 지울 수도 수정할 수도 있고요.',
        createdAt: '2시간 전',
        replies: [
          {
            id: 101,
            author: '이윤지',
            content: '내 답글입니다',
            createdAt: '2시간 전',
          },
        ],
      },
      {
        id: 2,
        author: '김선화',
        content: '타인의 댓글은 이렇게 보이고요',
        createdAt: '19일 전',
      },
      {
        id: 3,
        author: '오민재',
        content: '지원하고 싶습니다! 혹시 지금도 모집 중인가요?',
        createdAt: '5분 전',
      },
    ],
  }

  const handleBackClick = () => {
    if (window.history.length > 1) {
      void navigate(-1)
    } else {
      void navigate('/boards')
    }
  }

  const handleApplyClick = () => {
    setIsApplyModalOpen(true)
  }

  const handleApplyCancel = () => {
    setIsApplyModalOpen(false)
  }

  const handleApplyConfirm = () => {
    setIsApplyModalOpen(false)
    //toast.success('지원이 완료되었습니다.')
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 px-[144px] py-[44px] text-start">
      {/* 상단 헤더 */}
      <BoardsPageHeader title={mockPost.title} onBackClick={handleBackClick} />

      {/* 메타 정보 */}
      <BoardsDetailMeta post={mockPost} />

      {/* 본문 */}
      <BoardsDetailBody content={mockPost.content} />

      {/* 지원 버튼 */}
      <div className="mt-8 w-full">
        <Button className="w-full" onClick={handleApplyClick}>
          지원하기
        </Button>
      </div>

      {/* 댓글 */}
      <BoardsDetailComments comments={mockPost.comments} />

      <Modal
        isOpen={isApplyModalOpen}
        title="이 모집글에 지원하시겠어요?"
        description={
          <p>
            지원 시 작성자가 회원님의 프로필 정보를 확인할 수 있습니다.
            <br />
            지원 후에는 지원 취소가 불가능합니다.
          </p>
        }
        cancelLabel="취소"
        confirmLabel="지원하기"
        onCancel={handleApplyCancel}
        onConfirm={handleApplyConfirm}
      />
      {/* <Modal
        isOpen={isApplyModalOpen}
        title="프로필 설정이 완료되지 않았습니다."
        description={
          <p>
            지원을 위해 프로필의 필수 항목을 모두 입력해야 합니다.
            <br />
            프로필을 수정한 후 다시 시도해주세요.
          </p>
        }
        cancelLabel="취소"
        confirmLabel="프로필 설정하러 가기"
        onCancel={handleApplyCancel}
        onConfirm={handleApplyConfirm}
      /> */}
    </div>
  )
}
