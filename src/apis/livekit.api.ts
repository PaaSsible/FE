import PaaSsibleMeet from '@/config/interceptors/meet.interceptor'
import * as livekitSchemas from '@/types/apis/livekit/livekit.api.schemas'
import type * as livekitTypes from '@/types/apis/livekit/livekit.api.types'

export const postLivekitToken = async (
  body: livekitTypes.PostLivekitToken['Body'],
): Promise<livekitTypes.LivekitTokenPayload> => {
  const parsedBody = livekitSchemas.postLivekitTokenSchema.body.parse(body)
  const response = await PaaSsibleMeet.post('/api/livekit/token', parsedBody)
  const parsedResponse = livekitSchemas.postLivekitTokenSchema.response.parse(response.data)

  if ('success' in parsedResponse) {
    if (!parsedResponse.success) {
      throw new Error(parsedResponse.message ?? 'LiveKit 토큰 발급에 실패했습니다.')
    }

    if (!parsedResponse.data) {
      throw new Error('LiveKit 토큰 정보가 비어 있습니다.')
    }

    return parsedResponse.data
  }

  return parsedResponse
}
