import z from 'zod'

export const boardSchema = z.object({
  id: z.bigint(),
  name: z.string(),
  activityType: z.string().nullable(),
  detailType: z.string().nullable(),
  status: z.string().nullable(),
})

export const linkSchema = z.object({ id: z.bigint(), title: z.string(), url: z.url() })

export const taskStatusArray = ['PENDING', 'ONGOING', 'COMPLETED']
export const taskSchema = z.object({
  id: z.bigint(),
  title: z.string(),
  description: z.string().nullable(),
  dueDate: z.preprocess(
    (val) => (val instanceof Date ? val : val ? new Date(val as string) : null),
    z.date().nullable(),
  ),
  status: z.enum(taskStatusArray),
})
export const meetingSchema = z.object({ id: z.bigint(), title: z.string(), content: z.string() })
