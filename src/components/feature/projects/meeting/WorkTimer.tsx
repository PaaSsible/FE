'use client'

import clsx from 'clsx'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from 'react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useMeetingStore } from '@/stores/meetingStore'

interface WorkTimerProps {
  isHost: boolean
  onStart: (durationSeconds: number) => void
  onPause: () => void
  onResume: () => void
  onEnd: () => void
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export default function WorkTimer({
  isHost,
  onStart,
  onPause,
  onResume,
  onEnd,
}: WorkTimerProps): ReactElement | null {
  // Select primitives individually to preserve proper typing and avoid
  // unnecessary re-renders / equality function issues.
  const status = useMeetingStore((state) => state.timerState.status)
  const remainingSeconds = useMeetingStore((state) => state.timerState.remainingSeconds)
  const remainingSecondsSynced = useMeetingStore((state) => state.timerState.remainingSecondsSynced)
  const serverStartTime = useMeetingStore((state) => state.timerState.serverStartTime)

  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [phase, setPhase] = useState<'edit' | 'ready' | 'running' | 'paused'>('ready')
  const [activeField, setActiveField] = useState<'minutes' | 'seconds' | null>(null)
  const pendingActionRef = useRef<'start' | 'pause' | 'resume' | 'end' | null>(null)
  const autoEndTriggeredRef = useRef(false)
  const [nowTs, setNowTs] = useState(() => Date.now())
  const [viewerEndAcknowledged, setViewerEndAcknowledged] = useState(false)

  const serverRemainingSeconds = useMemo(() => {
    const now = nowTs

    if (status !== 'running') {
      return Math.max(0, remainingSeconds)
    }

    if (!serverStartTime) {
      return Math.max(0, remainingSeconds)
    }

    const elapsed = Math.max(0, (now - Date.parse(serverStartTime)) / 1000)
    return Math.max(0, remainingSecondsSynced - elapsed)
  }, [nowTs, remainingSeconds, remainingSecondsSynced, serverStartTime, status])

  useEffect(() => {
    if (status !== 'running') return

    const intervalId = window.setInterval(() => {
      setNowTs(Date.now())
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [status])

  useEffect(() => {
    const nextPhase: typeof phase =
      status === 'running' ? 'running' : status === 'paused' ? 'paused' : 'ready'

    setPhase((prev) => {
      if (pendingActionRef.current) {
        const pending = pendingActionRef.current
        if (
          (pending === 'start' && status === 'running') ||
          (pending === 'pause' && status === 'paused') ||
          (pending === 'resume' && status === 'running') ||
          (pending === 'end' && status !== 'running' && status !== 'paused')
        ) {
          pendingActionRef.current = null
          return prev === nextPhase ? prev : nextPhase
        }
      }

      if (pendingActionRef.current) {
        return prev
      }

      if (prev === 'edit' && nextPhase === 'ready') {
        return prev
      }

      return prev === nextPhase ? prev : nextPhase
    })

    if (status === 'running' || status === 'paused') {
      const totalSeconds = status === 'running' ? serverRemainingSeconds : remainingSeconds
      const safeSeconds = totalSeconds > 0 ? Math.ceil(totalSeconds) : 0
      const nextMinutes = Math.floor(safeSeconds / 60)
      const nextSeconds = safeSeconds % 60

      if (phase !== 'edit') {
        setMinutes((prev) => (prev === nextMinutes ? prev : nextMinutes))
        setSeconds((prev) => (prev === nextSeconds ? prev : nextSeconds))
      }
    } else if (phase !== 'edit' && phase !== 'running' && phase !== 'paused') {
      setMinutes((prev) => (prev === 0 ? prev : 0))
      setSeconds((prev) => (prev === 0 ? prev : 0))
    }
  }, [phase, remainingSeconds, serverRemainingSeconds, status])

  const format = (n: number) => n.toString().padStart(2, '0')

  const adjustValue = (type: 'inc' | 'dec', field: 'minutes' | 'seconds') => {
    if (field === 'minutes') {
      setMinutes((m) => clamp(type === 'inc' ? m + 1 : m - 1, 0, 59))
    } else {
      setSeconds((s) => clamp(type === 'inc' ? s + 1 : s - 1, 0, 59))
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'minutes' | 'seconds',
  ) => {
    const numeric = Number(e.target.value.replace(/\D/g, ''))
    if (field === 'minutes') setMinutes(clamp(numeric, 0, 59))
    else setSeconds(clamp(numeric, 0, 59))
  }

  const guardHostAction = useCallback(
    (action: () => void, pendingKey: 'start' | 'pause' | 'resume' | 'end') => {
      if (!isHost) {
        toast.error('호스트만 사용할 수 있는 기능입니다.')
        return
      }
      pendingActionRef.current = pendingKey
      action()
    },
    [isHost],
  )

  const handleStart = () => {
    const totalSeconds = minutes * 60 + seconds
    if (totalSeconds <= 0) {
      toast.error('1초 이상의 시간을 설정해 주세요.')
      return
    }
    guardHostAction(() => onStart(totalSeconds), 'start')
    setPhase('running')
  }

  const handlePause = () => {
    guardHostAction(onPause, 'pause')
    setPhase('paused')
  }

  const handleResume = () => {
    guardHostAction(onResume, 'resume')
    setPhase('running')
  }

  const handleEnd = useCallback(() => {
    autoEndTriggeredRef.current = true
    guardHostAction(onEnd, 'end')
    setMinutes(0)
    setSeconds(0)
    setPhase('ready')
    setActiveField(null)
  }, [guardHostAction, onEnd])

  useEffect(() => {
    if (!isHost) return

    if (status !== 'running') {
      autoEndTriggeredRef.current = false
      return
    }

    const remaining = serverRemainingSeconds
    if (remaining <= 0 && !autoEndTriggeredRef.current) {
      autoEndTriggeredRef.current = true
      handleEnd()
    }
  }, [handleEnd, isHost, serverRemainingSeconds, status])

  useEffect(() => {
    if (isHost) return
    if (status === 'running' || status === 'paused') {
      setViewerEndAcknowledged(false)
    }
  }, [isHost, status])

  const canEdit = isHost && phase === 'edit'
  const isTimerFinished = status === 'ended' && minutes === 0 && seconds === 0
  const timerColor = isTimerFinished
    ? 'text-locallit-red-500 font-bold'
    : phase === 'paused'
      ? 'text-locallit-red-500'
      : 'text-black'

  if (!isHost) {
    if (status === 'running' || status === 'paused') {
      return (
        <Card className="absolute bottom-6 left-6 w-[300px] rounded-xl border-none bg-white py-0 shadow-xl">
          <CardContent className="flex items-center justify-center px-4">
            <div className="font-digital flex w-[180px] items-center justify-center text-[65px] tracking-widest">
              <div className="relative flex flex-col items-center justify-center">
                <input
                  type="text"
                  value={format(minutes)}
                  disabled
                  className={clsx('w-[75px] bg-transparent text-center outline-none', timerColor)}
                />
              </div>

              <span className={clsx('mx-1', timerColor)}>:</span>

              <div className="relative flex flex-col items-center justify-center">
                <input
                  type="text"
                  value={format(seconds)}
                  disabled
                  className={clsx('w-[75px] bg-transparent text-center outline-none', timerColor)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    if (status === 'ended' && !viewerEndAcknowledged) {
      return (
        <Card className="absolute bottom-6 left-6 w-[300px] rounded-xl border-none bg-white py-0 shadow-xl">
          <CardContent className="flex items-center justify-between px-4">
            <div className="font-digital text-locallit-red-500 flex w-[180px] items-center justify-center text-[65px] tracking-widest">
              <div className="relative flex flex-col items-center justify-center">
                <span>00</span>
              </div>
              <span className="text-locallit-red-500 mx-1">:</span>
              <div className="relative flex flex-col items-center justify-center">
                <span>00</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 border-l border-gray-200 pl-3">
              <Button
                className="h-[27px] w-[70px] rounded-[28px] bg-gray-200 text-gray-600 hover:bg-gray-300"
                onClick={() => setViewerEndAcknowledged(true)}
              >
                확인
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    }

    return null
  }

  return (
    <Card className="absolute bottom-6 left-6 w-[300px] rounded-xl border-none bg-white py-0 shadow-xl">
      <CardContent
        className={clsx('flex items-center px-4', isHost ? 'justify-between' : 'justify-center')}
      >
        <div className="font-digital flex w-[180px] items-center justify-center text-[65px] tracking-widest">
          <div className="relative flex flex-col items-center justify-center">
            {activeField === 'minutes' && canEdit && (
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => adjustValue('inc', 'minutes')}
                className="bg-locallit-red-500 pointer-events-auto absolute -top-3 z-20 flex h-[30px] w-[30px] items-center justify-center rounded-full text-white shadow"
              >
                <ChevronUp size={24} />
              </button>
            )}
            <input
              type="text"
              value={format(minutes)}
              disabled={!canEdit}
              onFocus={() => setActiveField('minutes')}
              onBlur={() => setActiveField(null)}
              onChange={(e) => handleInputChange(e, 'minutes')}
              className={clsx(
                'w-[75px] bg-transparent text-center transition outline-none',
                timerColor,
                activeField === 'minutes' && canEdit
                  ? 'ring-locallit-red-400 rounded-sm ring-1'
                  : 'ring-0',
              )}
            />
            {activeField === 'minutes' && canEdit && (
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => adjustValue('dec', 'minutes')}
                className="pointer-events-auto absolute -bottom-3 z-20 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-gray-300 text-gray-700 shadow"
              >
                <ChevronDown size={24} />
              </button>
            )}
          </div>

          <span className={clsx('mx-1', timerColor)}>:</span>

          <div className="relative flex flex-col items-center justify-center">
            {activeField === 'seconds' && canEdit && (
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => adjustValue('inc', 'seconds')}
                className="bg-locallit-red-500 pointer-events-auto absolute -top-3 z-20 flex h-[30px] w-[30px] items-center justify-center rounded-full text-white shadow"
              >
                <ChevronUp size={24} />
              </button>
            )}
            <input
              type="text"
              value={format(seconds)}
              disabled={!canEdit}
              onFocus={() => setActiveField('seconds')}
              onBlur={() => setActiveField(null)}
              onChange={(e) => handleInputChange(e, 'seconds')}
              className={clsx(
                'w-[75px] bg-transparent text-center transition outline-none',
                timerColor,
                activeField === 'seconds' && canEdit
                  ? 'ring-locallit-red-400 rounded-sm ring-1'
                  : 'ring-0',
              )}
            />
            {activeField === 'seconds' && canEdit && (
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => adjustValue('dec', 'seconds')}
                className="pointer-events-auto absolute -bottom-3 z-20 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-gray-300 text-gray-700 shadow"
              >
                <ChevronDown size={24} />
              </button>
            )}
          </div>
        </div>

        {/* 제어 부분 (호스트 전용) */}
        {isHost && (
          <div className="flex flex-col items-center gap-2 border-l border-gray-200 pl-3">
            {phase === 'edit' && (
              <>
                <Button
                  className="h-[27px] w-[70px] rounded-[28px] bg-gray-200 text-gray-600 hover:bg-gray-300"
                  onClick={() => {
                    setPhase('ready')
                    setActiveField(null)
                  }}
                >
                  취소
                </Button>
                <Button
                  className="bg-locallit-red-500 hover:bg-locallit-red-600 h-[27px] w-[70px] rounded-[28px] text-white"
                  onClick={handleStart}
                >
                  시작
                </Button>
              </>
            )}

            {phase === 'ready' && (
              <>
                <Button
                  className="h-[27px] w-[70px] rounded-[28px] bg-gray-200 text-gray-600 hover:bg-gray-300"
                  onClick={() => {
                    setPhase('edit')
                    setActiveField(null)
                  }}
                >
                  수정
                </Button>
                <Button
                  className="bg-locallit-red-500 hover:bg-locallit-red-600 h-[27px] w-[70px] rounded-[28px] text-white"
                  onClick={handleStart}
                >
                  시작
                </Button>
              </>
            )}

            {phase === 'running' && (
              <>
                <Button
                  variant="secondary"
                  className="h-[27px] w-[70px] rounded-[28px] bg-gray-200 text-gray-600 hover:bg-gray-300"
                  onClick={handleEnd}
                >
                  끝내기
                </Button>
                <Button
                  className="bg-locallit-red-500 hover:bg-locallit-red-600 h-[27px] w-[70px] rounded-[28px] text-white"
                  onClick={handlePause}
                >
                  멈춤
                </Button>
              </>
            )}

            {phase === 'paused' && (
              <>
                <Button
                  variant="secondary"
                  className="h-[27px] w-[70px] rounded-[28px] bg-gray-200 text-gray-600 hover:bg-gray-300"
                  onClick={handleEnd}
                >
                  끝내기
                </Button>
                <Button
                  className="bg-locallit-red-500 hover:bg-locallit-red-600 h-[27px] w-[70px] rounded-[28px] text-white"
                  onClick={handleResume}
                >
                  이어서
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
