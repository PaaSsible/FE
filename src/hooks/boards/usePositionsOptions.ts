import { useEffect, useMemo, useState } from 'react'

import { getPositions } from '@/apis/recruit.api'
import { positionsArray } from '@/types/entities/recruit-post/recruitPost.schemas'

const DEFAULT_OPTION = '전체'

type PositionOption = {
  id: number
  label: string
}

type UsePositionsOptionsResult = {
  options: string[]
  isLoading: boolean
  getPositionIdByLabel: (label: string) => number | null
  getPositionLabelById: (id: number) => string | null
}

const DEFAULT_POSITIONS: PositionOption[] = positionsArray.map((label, index) => ({
  id: index + 1,
  label: label.trim(),
}))
const DEFAULT_OPTIONS = [DEFAULT_OPTION, ...DEFAULT_POSITIONS.map(({ label }) => label)]

export const usePositionsOptions = (): UsePositionsOptionsResult => {
  const [positions, setPositions] = useState<PositionOption[]>(DEFAULT_POSITIONS)
  const [options, setOptions] = useState<string[]>(DEFAULT_OPTIONS)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    const fetchPositions = async () => {
      setIsLoading(true)
      try {
        const response = await getPositions()

        if (!response.success) {
          throw new Error(response.message ?? '포지션 목록 응답이 올바르지 않습니다.')
        }

        const normalized = response.data.map(({ id, name }) => ({
          id,
          label: name.trim(),
        }))

        if (!cancelled) {
          setPositions(normalized)
          setOptions([DEFAULT_OPTION, ...normalized.map(({ label }) => label)])
        }
      } catch (error) {
        console.error('Failed to load positions', error)
        if (!cancelled) {
          setPositions(DEFAULT_POSITIONS)
          setOptions(DEFAULT_OPTIONS)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void fetchPositions()

    return () => {
      cancelled = true
    }
  }, [])

  const getPositionIdByLabel = useMemo(() => {
    const map = positions.reduce<Record<string, number>>((acc, { id, label }) => {
      acc[label] = id
      return acc
    }, {})

    return (label: string): number | null => map[label] ?? null
  }, [positions])

  const getPositionLabelById = useMemo(() => {
    const map = positions.reduce<Record<number, string>>((acc, { id, label }) => {
      acc[id] = label
      return acc
    }, {})

    return (id: number): string | null => map[id] ?? null
  }, [positions])

  return { options, isLoading, getPositionIdByLabel, getPositionLabelById }
}

export default usePositionsOptions
