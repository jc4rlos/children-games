import { supabase } from '@/lib/supabase'
import { type DbClassEnrollment, toClassEnrollment } from './class-mapper'
import type { ClassEnrollment } from './schema'

const ENROLLMENT_SELECT = [
  'id, class_id, child_id, enrolled_at, is_active',
  'child(full_name, avatar, gender, birth_date, code)',
  'enrolledEmployee:employee!class_enrollment_enrolled_by_fkey(first_name, last_name)',
].join(', ')

export const getEnrollments = async (
  classId: number
): Promise<ClassEnrollment[]> => {
  const { data, error } = await supabase
    .from('class_enrollment')
    .select(ENROLLMENT_SELECT)
    .eq('class_id', classId)
    .eq('is_active', true)
    .order('enrolled_at', { ascending: true })

  if (error) throw new Error(error.message)
  return (data as unknown as DbClassEnrollment[]).map(toClassEnrollment)
}

export const enrollChild = async (
  classId: number,
  childId: number,
  enrolledBy: number | null
): Promise<ClassEnrollment> => {
  const { data, error } = await supabase
    .from('class_enrollment')
    .insert({
      class_id: classId,
      child_id: childId,
      enrolled_by: enrolledBy ?? null,
      is_active: true,
    })
    .select(ENROLLMENT_SELECT)
    .single()

  if (error) throw new Error(error.message)
  return toClassEnrollment(data as unknown as DbClassEnrollment)
}

export const unenrollChild = async (enrollmentId: number): Promise<void> => {
  const { error } = await supabase
    .from('class_enrollment')
    .update({ is_active: false })
    .eq('id', enrollmentId)

  if (error) throw new Error(error.message)
}
