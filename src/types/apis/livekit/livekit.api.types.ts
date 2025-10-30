import z from 'zod'

import type {
  livekitTokenEnvelopeSchema,
  livekitTokenPayloadSchema,
  postLivekitTokenSchema,
} from './livekit.api.schemas'

export type LivekitTokenPayload = z.infer<typeof livekitTokenPayloadSchema>
export type LivekitTokenEnvelope = z.infer<typeof livekitTokenEnvelopeSchema>

export type PostLivekitToken = {
  Body: z.infer<typeof postLivekitTokenSchema.body>
  Response: z.infer<typeof postLivekitTokenSchema.response>
}
