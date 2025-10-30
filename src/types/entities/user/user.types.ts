import type z from 'zod'

import {
  notificationSchema,
  type interestSchema,
  type notificationTypeArray,
  type portfolioSchema,
  type userSchema,
} from './user.schemas'

export type Interest = z.infer<typeof interestSchema>
export type Portfolio = z.infer<typeof portfolioSchema>
export type User = z.infer<typeof userSchema>
export type NotificationTypeEnum = (typeof notificationTypeArray)[number]
export type Notification = z.infer<typeof notificationSchema>
