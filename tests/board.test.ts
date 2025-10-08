import { test, expect, describe } from 'vitest'

import { getBoardList } from '@/apis/board.api'

describe('보드 목록 조회 API', () => {
  test('전체 조회', async () => {
    const response = await getBoardList({})

    expect(response.success).toBe(true)
    expect(response.data.length).toBeGreaterThan(0)
    expect(response.data[0]).toHaveProperty('boardId')
    expect(response.data[0]).toHaveProperty('content')
  })

  test('status 쿼리로 필터링', async () => {
    const response = await getBoardList({ status: 'ONGOING' })

    expect(response.data.every((b) => b.status === 'ONGOING')).toBe(true)
  })

  test('keyword 쿼리로 필터링', async () => {
    const response = await getBoardList({ keyword: '보드2' })

    expect(response.data.every((b) => b.name.includes('보드2'))).toBe(true)
  })
})
