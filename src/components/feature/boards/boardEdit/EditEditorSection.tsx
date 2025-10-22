import { useRef } from 'react'
import type ReactQuill from 'react-quill-new'

import TextEditor from '@/components/common/TextEditor'
import BoardsPageHeader from '@/components/feature/boards/BoardsPageHeader'
import { useBoardFormStore } from '@/stores/boardFormStore'

interface EditEditorSectionProps {
  showTitleError?: boolean
  showContentError?: boolean
}

export default function EditEditorSection({
  showTitleError = false,
  showContentError = false,
}: EditEditorSectionProps) {
  const editorRef = useRef<ReactQuill>(null)
  const { title, setTitle, content, setContent } = useBoardFormStore()

  return (
    <section className="flex flex-col gap-6">
      <BoardsPageHeader title="모집글 수정" />

      {/* 제목 */}
      <div className="mb-4 flex flex-col gap-3">
        <span className="text-b2-medium">제목</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력해 주세요."
          className="text-b4-medium w-full rounded-lg bg-gray-200 px-4 py-3 placeholder:text-gray-500 focus:outline-none"
        />
        {showTitleError && !title.trim() && (
          <span className="text-b5-medium text-red-500">* 제목을 작성해 주세요.</span>
        )}
      </div>

      {/* 본문 */}
      <div className="mb-10 flex flex-col gap-3">
        <span className="text-b2-medium">본문</span>
        <div className="block">
          <TextEditor ref={editorRef} value={content} onChange={(value) => setContent(value)} />
        </div>
        {showContentError && (
          <span className="text-b5-medium text-red-500">* 본문을 작성해 주세요.</span>
        )}
      </div>
    </section>
  )
}
