import PaaSsibleMeet from '@/config/interceptors/meet.interceptor'
import * as meetAPISchemas from '@/types/apis/meet/meet.api.schemas'
import type * as MeetAPITypes from '@/types/apis/meet/meet.api.types'

export const postMeet = async (
  body: MeetAPITypes.PostMeet['Body'],
): Promise<MeetAPITypes.PostMeet['Response']> => {
  const parsedBody = meetAPISchemas.postMeetSchema.body.parse(body)
  const res = await PaaSsibleMeet.post('/meets', parsedBody)
  return meetAPISchemas.postMeetSchema.response.parse(res.data)
}

export const getBoardMeet = async (
  path: MeetAPITypes.GetBoardMeet['Path'],
): Promise<MeetAPITypes.GetBoardMeet['Response']> => {
  const parsedPath = meetAPISchemas.getBoardMeetSchema.path.parse(path)
  const res = await PaaSsibleMeet.get(`/meets/boards/${parsedPath.boardId}`)
  return meetAPISchemas.getBoardMeetSchema.response.parse(res.data)
}

export const postMeetParticipant = async (
  path: MeetAPITypes.PostMeetParticipant['Path'],
): Promise<MeetAPITypes.PostMeetParticipant['Response']> => {
  const parsedPath = meetAPISchemas.postMeetParticipantSchema.path.parse(path)
  const res = await PaaSsibleMeet.post(`/meets/${parsedPath.meetId}/participants`)
  return meetAPISchemas.postMeetParticipantSchema.response.parse(res.data)
}

export const deleteMeetParticipant = async (
  path: MeetAPITypes.DeleteMeetParticipant['Path'],
): Promise<MeetAPITypes.DeleteMeetParticipant['Response']> => {
  const parsedPath = meetAPISchemas.deleteMeetParticipantSchema.path.parse(path)
  const res = await PaaSsibleMeet.delete(`/meets/${parsedPath.meetId}/participants`)
  return meetAPISchemas.deleteMeetParticipantSchema.response.parse(res.data)
}

export const postTransferHostAndLeave = async (
  path: MeetAPITypes.TransferHostAndLeave['Path'],
  body: MeetAPITypes.TransferHostAndLeave['Body'],
): Promise<MeetAPITypes.TransferHostAndLeave['Response']> => {
  const parsedPath = meetAPISchemas.transferHostAndLeaveSchema.path.parse(path)
  const parsedBody = meetAPISchemas.transferHostAndLeaveSchema.body.parse(body)
  const res = await PaaSsibleMeet.post(`/meets/${parsedPath.meetId}/transfer-and-leave`, parsedBody)
  return meetAPISchemas.transferHostAndLeaveSchema.response.parse(res.data)
}

export const getMeetAttendance = async (
  path: MeetAPITypes.GetMeetAttendance['Path'],
): Promise<MeetAPITypes.GetMeetAttendance['Response']> => {
  const parsedPath = meetAPISchemas.meetAttendanceSchema.path.parse(path)
  const res = await PaaSsibleMeet.get(`/meets/${parsedPath.meetId}/attendance`)
  return meetAPISchemas.meetAttendanceSchema.response.parse(res.data)
}
