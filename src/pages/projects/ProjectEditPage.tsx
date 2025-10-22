import { AxiosError } from 'axios'
import { useEffect, useState, type JSX } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ZodError } from 'zod'

import { getBoardDetail, postBoard } from '@/apis/board.api'
import Button from '@/components/atoms/Button'
import Chip from '@/components/atoms/Chip'
import Tab from '@/components/atoms/Tab'
import Modal from '@/components/common/Modal'
import { activityTypeToDetailTypeMap } from '@/config/converters/activityTypeDetailTypeMap'
import { activityTypeEngToKorMap } from '@/config/converters/activityTypeEngToKorMap'
import { detailTypeEngToKorMap } from '@/config/converters/detailTypeEngToKorMap'
import type { GetBoardDetail, PostBoard, PutBoard } from '@/types/apis/board/board.api.types'
import { activityTypeArray } from '@/types/entities/board/board.entities.schemas'
import type { ActivityType, Board, DetailType } from '@/types/entities/board/board.entitites.types'

import ProjectHeader from './components/ProjectHeader'
import ProjectNewLabel from './components/ProjectNewLabel'
import { RichTextEditor } from './components/RichTextEditor'
import Separator from './components/Separator'

export default function ProjectEditPage(): JSX.Element {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const [selectedActivityType, setSelectedActivityType] = useState<ActivityType>('CONTEST')
  const [selectedDetailType, setSelectedDetailType] = useState<DetailType>('CONTEST_PLANNING')
  const [title, setTitle] = useState<PostBoard['Body']['name']>('')
  const [content, setContent] = useState<PostBoard['Body']['content']>('')

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [project, setProject] = useState<Board | undefined>()

  const getData = async () => {}
  useEffect(() => {
    void getData()
  }, [])

  const onEditButton = async () => {
    try {
      if (title && content) {
        const body: PutBoard['Body'] = {
          name: title,
          content: content,
          activityType: selectedActivityType,
          detailType: selectedDetailType,
        }
        await postBoard(body)
        void navigate(-1)
      }
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('Type Error', error)
      } else if (error instanceof AxiosError) {
        console.error('Axios Error', error)
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col px-[144px] py-[44px] text-start">
      <ProjectHeader title="프로젝트 보드 수정" className="mb-[3.375rem]" />
      <div className="mb-6 flex items-center justify-start gap-6">
        {activityTypeArray.map((type, index) => (
          <Tab
            key={index}
            label={activityTypeEngToKorMap[type]}
            selected={selectedActivityType === type}
            onClick={() => setSelectedActivityType(type)}
          />
        ))}
      </div>
      <Separator />
      {activityTypeToDetailTypeMap[selectedActivityType].length > 0 && (
        <>
          <div className="my-[1.0625rem] flex gap-2">
            {activityTypeToDetailTypeMap[selectedActivityType].map((detailType, index) => (
              <Chip
                key={index}
                label={detailTypeEngToKorMap[detailType]}
                selected={selectedDetailType === detailType}
                onClick={() => setSelectedDetailType(detailType)}
              />
            ))}
          </div>
          <Separator />
        </>
      )}
      <div className="mt-[3.375rem] mb-[2.375rem] flex flex-1 flex-col">
        <ProjectNewLabel label="제목" />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력해 주세요."
          className="mt-3 flex flex-1 bg-gray-200 px-5 py-3.5 text-lg leading-7 font-medium text-black outline-none"
        />
      </div>

      <div className="flex flex-1 flex-col">
        <ProjectNewLabel label="프로젝트 설명" />
        <div className="flex">
          <RichTextEditor content={content} setContent={setContent} />
        </div>
      </div>

      <div className="mt-[1.4375rem] flex gap-[0.6875rem] self-end">
        <Button variant="secondary" onClick={() => setIsModalVisible(!isModalVisible)}>
          생성취소
        </Button>
        <Button variant="primary" onClick={() => void onEditButton()}>
          생성하기
        </Button>
      </div>

      <Modal
        isOpen={isModalVisible}
        title={'프로젝트 보드 수정을 취소하시겠어요?'}
        description={'변경된 내용은 저장되지 않습니다. 그래도 나가시겠어요?'}
        cancelLabel={'취소'}
        confirmLabel={'계속 수정하기'}
        onCancel={() => void navigate(-1)}
        onConfirm={() => setIsModalVisible(!isModalVisible)}
      />
    </div>
  )
}
