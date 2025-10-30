import { AxiosError } from 'axios'
import { useEffect, useState, type JSX } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ZodError } from 'zod'

import { getBoardDetail, postBoard, putBoard } from '@/apis/board.api'
import Button from '@/components/atoms/Button'
import Chip from '@/components/atoms/Chip'
import Tab from '@/components/atoms/Tab'
import Modal from '@/components/common/Modal'
import ProjectHeader from '@/components/feature/projects/ProjectHeader'
import ProjectNewLabel from '@/components/feature/projects/ProjectNewLabel'
import { RichTextEditor } from '@/components/feature/projects/RichTextEditor'
import Separator from '@/components/feature/projects/Separator'
import { activityTypeToDetailTypeMap } from '@/config/converters/activityTypeDetailTypeMap'
import { activityTypeEngToKorMap } from '@/config/converters/activityTypeEngToKorMap'
import { detailTypeEngToKorMap } from '@/config/converters/detailTypeEngToKorMap'
import type { PutBoard } from '@/types/apis/board/board.api.types'
import { activityTypeArray } from '@/types/entities/board/board.entities.schemas'
import type { ActivityType, DetailType } from '@/types/entities/board/board.entitites.types'

export default function ProjectEditPage(): JSX.Element {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const [selectedActivityType, setSelectedActivityType] = useState<ActivityType>('CONTEST')
  const [selectedDetailType, setSelectedDetailType] = useState<DetailType>('CONTEST_PLANNING')
  const [title, setTitle] = useState<PutBoard['Body']['name']>('')
  const [content, setContent] = useState<PutBoard['Body']['content']>('')

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getBoardDetail({ boardId: Number(projectId) })
        setTitle(response.data.name)
        setContent(response.data.content)
        setSelectedActivityType(response.data.activityType)
        setSelectedDetailType(response.data.detailType)
      } catch (error) {
        if (error instanceof ZodError) console.log('타입에러', error)
        else if (error instanceof AxiosError) console.log('네트워크 에러', error)
        else console.log('기타에러', error)
      }
    }
    void getData()
  }, [projectId])

  const onEditButton = async () => {
    try {
      if (title && content) {
        console.log('projectId:', projectId)
        console.log('Number(projectId):', Number(projectId))
        const body: PutBoard['Body'] = {
          name: title,
          content: content,
          activityType: selectedActivityType,
          detailType: selectedDetailType,
        }
        const path: PutBoard['Path'] = {
          boardId: Number(projectId),
        }
        await putBoard(path, body)
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
          수정취소
        </Button>
        <Button variant="primary" onClick={() => void onEditButton()}>
          수정하기
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
