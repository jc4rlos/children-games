import { supabase } from '@/lib/supabase'
import { type AttendanceReportParams, type AttendanceReportRow } from './schema'

type DbEnrollment = {
  id: number
  child_id: number
  child: {
    full_name: string
    avatar: string | null
    code: string
    gender: 'MALE' | 'FEMALE'
  }
}

type DbAttendance = {
  enrollment_id: number
  attended: boolean
}

export const getAttendanceReport = async (
  params: AttendanceReportParams
): Promise<AttendanceReportRow[]> => {
  const { classId, dateFrom, dateTo } = params

  const { data: enrollments, error: enrollErr } = await supabase
    .from('class_enrollment')
    .select('id, child_id, child(full_name, avatar, code, gender)')
    .eq('class_id', classId)
    .eq('is_active', true)
    .order('child_id', { ascending: true })

  if (enrollErr) throw new Error(enrollErr.message)

  const typedEnrollments = enrollments as unknown as DbEnrollment[]
  if (typedEnrollments.length === 0) return []

  const enrollmentIds = typedEnrollments.map((e) => e.id)

  const { data: attendances, error: attErr } = await supabase
    .from('class_attendance')
    .select('enrollment_id, attended')
    .in('enrollment_id', enrollmentIds)
    .gte('class_date', dateFrom)
    .lte('class_date', dateTo)

  if (attErr) throw new Error(attErr.message)

  const attByEnrollment = new Map<
    number,
    { attended: number; absent: number }
  >()
  for (const att of attendances as unknown as DbAttendance[]) {
    const current = attByEnrollment.get(att.enrollment_id) ?? {
      attended: 0,
      absent: 0,
    }
    if (att.attended) {
      current.attended += 1
    } else {
      current.absent += 1
    }
    attByEnrollment.set(att.enrollment_id, current)
  }

  return typedEnrollments.map((enrollment) => {
    const counts = attByEnrollment.get(enrollment.id) ?? {
      attended: 0,
      absent: 0,
    }
    const total = counts.attended + counts.absent
    return {
      enrollmentId: enrollment.id,
      childId: enrollment.child_id,
      childName: enrollment.child.full_name,
      childAvatar: enrollment.child.avatar,
      childCode: enrollment.child.code,
      childGender: enrollment.child.gender,
      totalSessions: total,
      attendedCount: counts.attended,
      absentCount: counts.absent,
      attendanceRate:
        total > 0 ? Math.round((counts.attended / total) * 100) : 0,
    }
  })
}
