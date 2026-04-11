export type AttendanceReportRow = {
  enrollmentId: number
  childId: number
  childName: string
  childAvatar: string | null
  childCode: string
  childGender: 'MALE' | 'FEMALE'
  totalSessions: number
  attendedCount: number
  absentCount: number
  attendanceRate: number
}

export type AttendanceReportParams = {
  classId: number
  dateFrom: string
  dateTo: string
}
