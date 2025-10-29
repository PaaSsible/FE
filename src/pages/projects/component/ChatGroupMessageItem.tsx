import clsx from 'clsx'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import { File } from 'lucide-react'
import type { JSX } from 'react'

import type { GroupMessage } from '../ProjectChatRoomPage'

interface GroupMessageItemProps {
  item: GroupMessage
}

const GroupMessageItem = ({ item }: GroupMessageItemProps): JSX.Element => {
  dayjs.locale('ko') // 한글 오전/오후

  const downloadFileAs = async (url: string, saveAsName: string) => {
    try {
      const res = await fetch(url, { credentials: 'include' }) // 인증 필요시
      const blob = await res.blob()
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = saveAsName
      link.click()
      URL.revokeObjectURL(link.href)
    } catch (err) {
      console.error('파일 다운로드 실패', err)
    }
  }

  return (
    <div className={`flex ${item.isMine ? 'justify-end' : 'justify-start'} gap-3`}>
      {!item.isMine && <div className="h-10 w-10 shrink-0 rounded-full bg-zinc-300" />}

      <div className={clsx('flex flex-col gap-2', item.isMine ? 'items-end' : 'items-start')}>
        {!item.isMine && (
          <span className="text-sm font-semibold text-gray-700">{item.senderName}</span>
        )}

        {item.messages.map((msg) => (
          <div key={msg.id} className="flex items-end gap-2">
            {item.isMine && (
              <div>
                <span> </span>
                <span className="text-xs text-gray-500">
                  {dayjs(msg.createdAt).format('A HH:mm')}
                </span>
              </div>
            )}
            <div
              className={clsx(
                'flex max-w-[765px] rounded-2xl text-base leading-6',
                item.isMine
                  ? 'bg-locallit-red-500 rounded-tr-none text-end text-white'
                  : 'rounded-tl-none bg-gray-200 text-start text-black',
                msg.type === 'FILE' ? 'px-5 pt-5 pb-4' : 'px-4 py-3',
              )}
            >
              {msg.type === 'TEXT' && msg.content}
              {msg.type === 'IMAGE' && (
                <img className="max-h-60 max-w-60 object-contain" src={msg.content} />
              )}
              {msg.type === 'FILE' && (
                <div className="flex flex-col gap-2.5 text-start">
                  <div className="flex items-start gap-2.5 break-normal">
                    <File className="h-6 w-6 shrink-0 text-zinc-600" />
                    {msg.content}
                  </div>

                  <div className="flex items-center justify-end gap-1.5 text-base leading-6 font-medium text-zinc-600 underline underline-offset-4">
                    <button
                      className="cursor-pointer"
                      onClick={() => window.open(msg.content, '_blank')}
                    >
                      저장
                    </button>
                    <div className="h-1 w-1 rounded-full bg-zinc-600" />
                    <button
                      className="cursor-pointer"
                      onClick={() => window.open(msg.content, '_blank')}
                    >
                      다른이름으로 저장
                    </button>
                  </div>
                </div>
              )}
            </div>
            {!item.isMine && (
              <span className="text-xs text-gray-500">
                {dayjs(msg.createdAt).format('A HH:mm')}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
export default GroupMessageItem
