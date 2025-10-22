import { useEffect, useMemo, useState } from 'react'

import { getStacks } from '@/apis/recruit.api'
import { stacksArray } from '@/types/entities/recruit-post/recruitPost.schemas'

type StackOption = {
  id: number
  label: string
}

type UseStacksOptionsResult = {
  options: string[]
  isLoading: boolean
  getStackIdByLabel: (label: string) => number | null
  getStackLabelById: (id: number) => string | null
}

const DEFAULT_STACKS: StackOption[] = stacksArray.map((label, index) => ({
  id: index + 1,
  label: label.trim(),
}))

export default function useStacksOptions(): UseStacksOptionsResult {
  const [stacks, setStacks] = useState<StackOption[]>(DEFAULT_STACKS)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    const fetchStacks = async () => {
      setIsLoading(true)
      try {
        const response = await getStacks()

        if (!response.success) {
          throw new Error(response.message ?? '기술 스택 목록 응답이 올바르지 않습니다.')
        }

        const normalized = response.data.map(({ id, name }) => ({
          id,
          label: name.trim(),
        }))

        if (!cancelled) {
          setStacks(normalized)
        }
      } catch (error) {
        console.error('Failed to load stack options', error)
        if (!cancelled) {
          setStacks(DEFAULT_STACKS)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void fetchStacks()

    return () => {
      cancelled = true
    }
  }, [])

  const options = useMemo(() => stacks.map(({ label }) => label), [stacks])

  const getStackIdByLabel = useMemo(() => {
    const map = stacks.reduce<Record<string, number>>((acc, { id, label }) => {
      acc[label] = id
      return acc
    }, {})

    return (label: string): number | null => map[label] ?? null
  }, [stacks])

  const getStackLabelById = useMemo(() => {
    const map = stacks.reduce<Record<number, string>>((acc, { id, label }) => {
      acc[id] = label
      return acc
    }, {})

    return (id: number): string | null => map[id] ?? null
  }, [stacks])

  return {
    options,
    isLoading,
    getStackIdByLabel,
    getStackLabelById,
  }
}
