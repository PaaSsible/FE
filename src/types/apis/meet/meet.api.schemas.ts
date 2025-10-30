import z from 'zod'

export const attendeeSchema = z.object({
  userId: z.number().int().positive(),
  userName: z.string(),
  profileImageUrl: z.string().nullable(),
})

export const meetInfoSchema = z.object({
  meetId: z.number().int().positive(),
  participantCount: z.number().int().nonnegative(),
  attendees: z.array(attendeeSchema),
})

export const transferCandidateSchema = z.object({
  userId: z.number().int().positive(),
  nickname: z.string(),
})

export const meetingLeaveStatusSchema = z.enum(['LEFT', 'TRANSFER_REQUIRED', 'ENDED'])

export const meetingLeaveResponseSchema = z.object({
  status: meetingLeaveStatusSchema,
  candidates: z.array(transferCandidateSchema).optional().nullable(),
})

export const meetCreationSchema = z.object({
  meetId: z.number().int().positive(),
  boardId: z.number().int().positive(),
  hostId: z.number().int().positive(),
  participantId: z.number().int().positive(),
  status: z.string(),
  startTime: z.string(),
})

export const postMeetSchema = {
  body: z.object({
    boardId: z.number().int().positive(),
    startTime: z.string(),
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string().nullable(),
    data: meetCreationSchema,
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

export const getBoardMeetSchema = {
  path: z.object({
    boardId: z.number().int().positive(),
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string().nullable(),
    data: meetInfoSchema.nullable(),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

export const postMeetParticipantSchema = {
  path: z.object({
    meetId: z.number().int().positive(),
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string().nullable(),
    data: z.unknown().nullable(),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

export const deleteMeetParticipantSchema = {
  path: z.object({
    meetId: z.number().int().positive(),
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string().nullable(),
    data: meetingLeaveResponseSchema,
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

export const transferHostAndLeaveSchema = {
  path: z.object({
    meetId: z.number().int().positive(),
  }),
  body: z.object({
    newHostId: z.number().int().positive(),
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string().nullable(),
    data: meetingLeaveResponseSchema.optional().nullable(),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}

export const meetAttendanceSchema = {
  path: z.object({
    meetId: z.number().int().positive(),
  }),
  response: z.object({
    success: z.boolean(),
    message: z.string().nullable(),
    data: z
      .object({
        userId: z.number().int().positive(),
        userName: z.string(),
        profileImageUrl: z.string().nullable(),
        isHostUser: z.boolean(),
        presentMembers: z.array(attendeeSchema),
        absentMembers: z.array(attendeeSchema),
      })
      .nullable(),
    code: z.string(),
    errors: z.string().nullable(),
  }),
}
