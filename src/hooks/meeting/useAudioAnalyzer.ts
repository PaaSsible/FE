import { useEffect, useRef, useState } from 'react'

export function useAudioAnalyzer(stream: MediaStream | null, isMicOn: boolean) {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!stream || !isMicOn) {
      setIsSpeaking(false)
      return
    }

    const AudioContextConstructor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext

    if (!AudioContextConstructor) {
      console.error('AudioContext not supported')
      return
    }

    const ctx = new AudioContextConstructor()

    const source = ctx.createMediaStreamSource(stream)
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 2048
    analyser.smoothingTimeConstant = 0.8

    source.connect(analyser)
    audioCtxRef.current = ctx
    analyserRef.current = analyser

    const buffer = new Float32Array(analyser.fftSize)
    const SPEAK_ON_RMS = 0.03
    const SPEAK_OFF_RMS = 0.015
    const HOLD_MS = 200
    let speaking = false
    let lastAboveTs = 0
    let lastBelowTs = 0

    const loop = (ts: number) => {
      analyser.getFloatTimeDomainData(buffer)
      let sum = 0
      for (let i = 0; i < buffer.length; i++) sum += buffer[i] * buffer[i]
      const rms = Math.sqrt(sum / buffer.length)

      if (!speaking && rms >= SPEAK_ON_RMS) {
        lastAboveTs = lastAboveTs || ts
        if (ts - lastAboveTs > HOLD_MS) {
          speaking = true
          setIsSpeaking(true)
        }
      } else if (speaking && rms <= SPEAK_OFF_RMS) {
        lastBelowTs = lastBelowTs || ts
        if (ts - lastBelowTs > HOLD_MS) {
          speaking = false
          setIsSpeaking(false)
        }
      } else {
        if (rms < SPEAK_ON_RMS) lastAboveTs = 0
        if (rms > SPEAK_OFF_RMS) lastBelowTs = 0
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      void ctx.close()
    }
  }, [stream, isMicOn])

  return isSpeaking
}
