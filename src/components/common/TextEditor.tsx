import { useMemo, forwardRef } from 'react'
import ReactQuill, { Quill } from 'react-quill-new'
import { ImageResize } from 'quill-image-resize-module-ts'
import 'react-quill-new/dist/quill.snow.css'

Quill.register('modules/imageResize', ImageResize)

interface TextEditorProps {
  value: string
  onChange: (value: string) => void
}

const TextEditor = forwardRef<ReactQuill, TextEditorProps>(({ value, onChange }, ref) => {
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean'],
      ],
      imageResize: {
        parchment: Quill.import('parchment'),
        modules: ['Resize', 'DisplaySize', 'Toolbar'],
      },
    }),
    [],
  )

  return (
    <div className="text-editor">
      <ReactQuill
        ref={ref}
        value={value}
        onChange={onChange}
        modules={modules}
        theme="snow"
        style={{
          height: '600px',
        }}
        className="custom-quill"
      />
    </div>
  )
})

export default TextEditor
