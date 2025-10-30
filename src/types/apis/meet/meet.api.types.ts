import z from 'zod'

import type {
  getBoardMeetSchema,
  deleteMeetParticipantSchema,
  meetCreationSchema,
  meetingLeaveResponseSchema,
  meetInfoSchema,
  meetAttendanceSchema,
  postMeetParticipantSchema,
  postMeetSchema,
  transferHostAndLeaveSchema,
} from './meet.api.schemas'

export type MeetingInfo = z.infer<typeof meetInfoSchema>
export type MeetCreation = z.infer<typeof meetCreationSchema>
export type MeetingLeaveResponse = z.infer<typeof meetingLeaveResponseSchema>

export type PostMeet = {
  Body: z.infer<typeof postMeetSchema.body>
  Response: z.infer<typeof postMeetSchema.response>
}

export type GetBoardMeet = {
  Path: z.infer<typeof getBoardMeetSchema.path>
  Response: z.infer<typeof getBoardMeetSchema.response>
}

export type PostMeetParticipant = {
  Path: z.infer<typeof postMeetParticipantSchema.path>
  Response: z.infer<typeof postMeetParticipantSchema.response>
}

export type DeleteMeetParticipant = {
  Path: z.infer<typeof deleteMeetParticipantSchema.path>
  Response: z.infer<typeof deleteMeetParticipantSchema.response>
}

export type TransferHostAndLeave = {
  Path: z.infer<typeof transferHostAndLeaveSchema.path>
  Body: z.infer<typeof transferHostAndLeaveSchema.body>
  Response: z.infer<typeof transferHostAndLeaveSchema.response>
}

export type GetMeetAttendance = {
  Path: z.infer<typeof meetAttendanceSchema.path>
  Response: z.infer<typeof meetAttendanceSchema.response>
}
