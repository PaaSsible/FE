import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs'
import { useEffect, useRef, useState } from 'react'

import { getAccessToken, getAuthUser } from '@/utils/authToken'

type MessageHandler = (message: IMessage) => void

interface MeetingWebSocketOptions {
  meetId?: number
  enabled?: boolean
  onStatusMessage?: MessageHandler
  onHostMessage?: MessageHandler
  onRandomPickMessage?: MessageHandler
  onPrivateChatMessage?: MessageHandler
  onPublicChatMessage?: MessageHandler
  onTimerMessage?: MessageHandler
  onErrorMessage?: MessageHandler
  onSilentMessage?: MessageHandler
}

interface MeetingWebSocketResult {
  client: Client | null
  isConnected: boolean
}

const noop: MessageHandler = () => {
  /* no-op */
}

export const useMeetingWebSocket = ({
  meetId,
  enabled = true,
  onStatusMessage,
  onHostMessage,
  onRandomPickMessage,
  onPrivateChatMessage,
  onPublicChatMessage,
  onTimerMessage,
  onErrorMessage,
  onSilentMessage,
}: MeetingWebSocketOptions): MeetingWebSocketResult => {
  const clientRef = useRef<Client | null>(null)
  const subscriptionsRef = useRef<StompSubscription[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!enabled) {
      return
    }

    if (typeof window === 'undefined') {
      return
    }

    if (!meetId) {
      console.warn('[MeetingWS] Cannot activate websocket without meetId')
      return
    }

    const authUser = getAuthUser()
    const accessToken = getAccessToken()

    if (!authUser || !accessToken) {
      console.warn('[MeetingWS] Missing authentication context for websocket')
      return
    }

    const client = new Client({
      brokerURL: import.meta.env.VITE_WS_MEET_URL,
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: (message) => {
        if (import.meta.env.DEV) {
          console.debug('[MeetingWS]', message)
        }
      },
    })

    const clearSubscriptions = () => {
      subscriptionsRef.current.forEach((subscription) => {
        try {
          subscription.unsubscribe()
        } catch (error) {
          console.error('[MeetingWS] Failed to unsubscribe', error)
        }
      })
      subscriptionsRef.current = []
    }

    client.onConnect = () => {
      console.log('WebSocket 연결 성공!')
      setIsConnected(true)

      clearSubscriptions()

      subscriptionsRef.current = [
        client.subscribe(`/topic/meet/${meetId}/status`, onStatusMessage ?? noop),
        client.subscribe(`/topic/meet/${meetId}/host`, onHostMessage ?? noop),
        client.subscribe(`/topic/meet/${meetId}/random-pick`, onRandomPickMessage ?? noop),
        client.subscribe(`/topic/meet/${meetId}/silent`, onSilentMessage ?? noop),
        client.subscribe('/user/queue/chat', onPrivateChatMessage ?? noop),
        client.subscribe(`/topic/meet/${meetId}/chat/public`, onPublicChatMessage ?? noop),
        client.subscribe(`/topic/meet/${meetId}/timer`, onTimerMessage ?? noop),
        client.subscribe('/user/queue/errors', onErrorMessage ?? noop),
      ]
    }

    client.onDisconnect = () => {
      setIsConnected(false)
      clearSubscriptions()
    }

    client.onStompError = (frame) => {
      console.error('[MeetingWS] STOMP error', frame.headers['message'], frame.body)
    }

    client.onWebSocketError = (event) => {
      console.error('[MeetingWS] WebSocket error', event)
    }

    client.onWebSocketClose = () => {
      setIsConnected(false)
    }

    client.activate()
    clientRef.current = client

    return () => {
      clearSubscriptions()

      if (client.active) {
        void client.deactivate()
      }

      clientRef.current = null
      setIsConnected(false)
    }
  }, [
    enabled,
    meetId,
    onErrorMessage,
    onHostMessage,
    onRandomPickMessage,
    onPrivateChatMessage,
    onPublicChatMessage,
    onStatusMessage,
    onTimerMessage,
    onSilentMessage,
  ])

  return {
    client: clientRef.current,
    isConnected,
  }
}
