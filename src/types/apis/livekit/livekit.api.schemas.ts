import z from 'zod'

export const livekitTokenPayloadSchema = z.object({
  url: z.string().min(1),
  room: z.string().min(1),
  token: z.string().min(1),
})

export const livekitTokenEnvelopeSchema = z.object({
  success: z.boolean(),
  message: z.string().nullable().optional(),
  data: livekitTokenPayloadSchema.nullable().optional(),
  code: z.string().optional(),
  errors: z.string().nullable().optional(),
})

export const postLivekitTokenSchema = {
  body: z.object({
    meetId: z.number().int().positive(),
    displayName: z.string().min(1),
  }),
  response: z.union([livekitTokenPayloadSchema, livekitTokenEnvelopeSchema]),
}
