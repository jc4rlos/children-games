import { supabase } from '@/lib/supabase'
import { type DbClassEnrollment } from './class-mapper'
import { type ClassAttendanceRecord } from './schema'

const ENROLLMENT_SELECT = [
  'id, class_id, child_id, enrolled_at, is_active',
  'child(full_name, avatar, gender, birth_date, code)',
  'enrolledEmployee:employee!class_enrollment_enrolled_by_fkey(first_name, last_name)',
].join(', ')

type DbAttendance = {
  id: number
  enrollment_id: number
  class_date: string
  attended: boolean
  noted_by: number | null
  created_at: string
}

export const getAttendanceSheet = async (
  classId: number,
  date: string
): Promise<ClassAttendanceRecord[]> => {
  const { data: enrollments, error: enrollError } = await supabase
    .from('class_enrollment')
    .select(ENROLLMENT_SELECT)
    .eq('class_id', classId)
    .eq('is_active', true)
    .order('enrolled_at', { ascending: true })

  if (enrollError) throw new Error(enrollError.message)

  const typedEnrollments = enrollments as unknown as DbClassEnrollment[]
  const enrollmentIds = typedEnrollments.map((e) => e.id)

  if (enrollmentIds.length === 0) return []

  const { data: attendances, error: attError } = await supabase
    .from('class_attendance')
    .select('id, enrollment_id, class_date, attended')
    .in('enrollment_id', enrollmentIds)
    .eq('class_date', date)

  if (attError) throw new Error(attError.message)

  const attendanceMap = new Map<number, DbAttendance>()
  for (const att of attendances as unknown as DbAttendance[]) {
    attendanceMap.set(att.enrollment_id, att)
  }

  return typedEnrollments.map((enrollment) => {
    const att = attendanceMap.get(enrollment.id)
    return {
      enrollmentId: enrollment.id,
      childId: enrollment.child_id,
      childName: enrollment.child.full_name,
      childAvatar: enrollment.child.avatar,
      childGender: enrollment.child.gender,
      childBirthDate: enrollment.child.birth_date,
      childCode: enrollment.child.code,
      attendanceId: att?.id ?? null,
      attended: att?.attended ?? null,
    }
  })
}

export const upsertAttendance = async (
  enrollmentId: number,
  classDate: string,
  attended: boolean,
  notedBy?: number
): Promise<void> => {
  const { error } = await supabase.from('class_attendance').upsert(
    {
      enrollment_id: enrollmentId,
      class_date: classDate,
      attended,
      noted_by: notedBy ?? null,
    },
    { onConflict: 'enrollment_id,class_date' }
  )

  if (error) throw new Error(error.message)
}

export const saveAttendanceBatch = async (
  records: { enrollmentId: number; classDate: string; attended: boolean }[]
): Promise<void> => {
  await Promise.all(
    records.map((r) =>
      upsertAttendance(r.enrollmentId, r.classDate, r.attended)
    )
  )
}
