import type { JSX } from 'react'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { taskStatusEngToKorMap } from '@/config/converters/taskStatusEngToKorMap'
import { taskStatusArray } from '@/types/entities/board/board.entities.schemas'
import type { TaskStatus } from '@/types/entities/board/board.entitites.types'

interface TaskStatusRadioGroupProps {
  currentTaskStatus: TaskStatus
  onChange: (status: TaskStatus) => void
}
export function TaskStatusRadioGroup({
  currentTaskStatus,
  onChange,
}: TaskStatusRadioGroupProps): JSX.Element {
  return (
    <RadioGroup
      defaultValue={currentTaskStatus}
      className="flex"
      onValueChange={(value: TaskStatus) => onChange(value)}
    >
      {taskStatusArray.map((status, index) => (
        <div key={index} className="flex items-center gap-3">
          <RadioGroupItem value={status} id="r1" />
          <Label htmlFor="r1" className="text-md !font-normal">
            {taskStatusEngToKorMap[status]}
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}
