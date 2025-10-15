import z from 'zod'

import type {
  patchUserTermsSchema,
  postLoginSchema,
  postLogoutSchema,
  postReissueSchema,
} from './user.api.schemas'

export type PostLogin = {
  Body: z.infer<typeof postLoginSchema.body>
  Response: z.infer<typeof postLoginSchema.response>
}

export type PostLogout = {
  Response: z.infer<typeof postLogoutSchema.response>
}

export type PostReissue = {
  Response: z.infer<typeof postReissueSchema.response>
}

export type PatchUserTerms = {
  Response: z.infer<typeof patchUserTermsSchema.response>
}
