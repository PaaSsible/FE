import { ImageResize } from 'quill-image-resize-module-ts'
import {
  useMemo,
  forwardRef,
  useRef,
  useImperativeHandle,
  useCallback,
  useId,
  type ChangeEvent,
} from 'react'
import ReactQuill, { Quill } from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

Quill.register('modules/imageResize', ImageResize)

interface TextEditorProps {
  value: string
  onChange: (value: string) => void
  /** 파일을 받아 업로드하고, 최종 접근 가능한 URL을 반환해야 합니다. */
  onImageUpload?: (file: File) => Promise<string>
}

const toolbarOptions = [
  [{ header: [1, 2, 3, 4, 5, false] }],
  ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['link', 'image'],
  ['clean'],
]

const TextEditor = forwardRef<ReactQuill, TextEditorProps>(
  ({ value, onChange, onImageUpload }, ref) => {
    const internalRef = useRef<ReactQuill | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const inputId = useId()

    // ⚠️ 간단 해결: non-null 단언
    useImperativeHandle(ref, () => internalRef.current!, [])

    const handleImageButtonClick = useCallback(() => {
      if (!onImageUpload) return
      fileInputRef.current?.click()
    }, [onImageUpload])

    const handleFileChange = useCallback(
      async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file || !onImageUpload) {
          event.target.value = ''
          return
        }

        try {
          const url = await onImageUpload(file) // ← 업로드 API가 URL을 반환
          if (!url) throw new Error('업로드된 이미지 경로를 찾을 수 없습니다.')

          const quill = internalRef.current?.getEditor?.()
          if (quill) {
            const selection = quill.getSelection(true)
            const index = selection ? selection.index : quill.getLength()
            quill.insertEmbed(index, 'image', url, 'user')
            quill.setSelection(index + 1)
          }
        } catch (error) {
          console.error(error)
        } finally {
          // 같은 파일 다시 선택 가능하도록 리셋
          event.target.value = ''
        }
      },
      [onImageUpload],
    )

    const modules = useMemo(
      () => ({
        toolbar: {
          container: toolbarOptions,
          // onImageUpload가 있을 때만 툴바 이미지 버튼을 가로채서 파일 선택창을 엽니다.
          handlers: onImageUpload ? { image: handleImageButtonClick } : undefined,
        },
        imageResize: {
          parchment: Quill.import('parchment'),
          modules: ['Resize', 'DisplaySize', 'Toolbar'],
        },
      }),
      [handleImageButtonClick, onImageUpload],
    )

    return (
      <div className="text-editor">
        {/* 숨겨진 파일 입력 */}
        {onImageUpload && (
          <input
            id={`text-editor-upload-${inputId}`}
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => void handleFileChange(e)}
          />
        )}

        <ReactQuill
          ref={internalRef}
          value={value}
          onChange={onChange}
          modules={modules}
          theme="snow"
          className="custom-quill"
          style={{ height: '600px' }}
        />
      </div>
    )
  },
)
TextEditor.displayName = 'TextEditor'

export default TextEditor
