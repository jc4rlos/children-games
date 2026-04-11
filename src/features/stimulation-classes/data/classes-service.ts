import { supabase } from '@/lib/supabase'
import {
  type DbClassEnrollment,
  type DbStimulationClass,
  toClassEnrollment,
  toStimulationClass,
} from './class-mapper'
import { type ClassFormValues, type StimulationClass } from './schema'

const SELECT_FIELDS = [
  'id, branch_id, teacher_id, name, description',
  'age_min_months, age_max_months, capacity, price',
  'day_of_week, start_time, end_time, is_active, created_at',
  'branch(name)',
  'teacher:employee!stimulation_class_teacher_id_fkey(first_name, last_name)',
].join(', ')

export type ClassesParams = {
  page: number
  pageSize: number
  branchId?: number
  isActive?: string[]
  name?: string
}

export type PaginatedClasses = {
  data: StimulationClass[]
  total: number
}

export type EmployeeOption = {
  id: number
  name: string
}

export const getClasses = async (
  params: ClassesParams
): Promise<PaginatedClasses> => {
  const { page, pageSize, branchId, isActive, name } = params
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('stimulation_class')
    .select(SELECT_FIELDS, { count: 'exact' })
    .order('name', { ascending: true })
    .range(from, to)

  if (name) query = query.ilike('name', `%${name}%`)
  if (branchId) query = query.eq('branch_id', branchId)
  if (isActive?.length === 1)
    query = query.eq('is_active', isActive[0] === 'true')

  const { data, error, count } = await query
  if (error) throw new Error(error.message)

  return {
    data: (data as unknown as DbStimulationClass[]).map(toStimulationClass),
    total: count ?? 0,
  }
}

export const getClassById = async (id: number): Promise<StimulationClass> => {
  const { data, error } = await supabase
    .from('stimulation_class')
    .select(SELECT_FIELDS)
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return toStimulationClass(data as unknown as DbStimulationClass)
}

export const createClass = async (
  values: ClassFormValues
): Promise<StimulationClass> => {
  const { data, error } = await supabase
    .from('stimulation_class')
    .insert({
      branch_id: values.branchId,
      teacher_id: values.teacherId ?? null,
      name: values.name,
      description: values.description || null,
      age_min_months: values.ageMinMonths,
      age_max_months: values.ageMaxMonths,
      capacity: values.capacity,
      price: values.price,
      day_of_week: values.daysOfWeek,
      start_time: values.startTime,
      end_time: values.endTime,
      is_active: values.isActive,
      created_by: 'system',
    })
    .select(SELECT_FIELDS)
    .single()

  if (error) throw new Error(error.message)
  return toStimulationClass(data as unknown as DbStimulationClass)
}

export const updateClass = async (
  id: number,
  values: ClassFormValues
): Promise<StimulationClass> => {
  const { data, error } = await supabase
    .from('stimulation_class')
    .update({
      branch_id: values.branchId,
      teacher_id: values.teacherId ?? null,
      name: values.name,
      description: values.description || null,
      age_min_months: values.ageMinMonths,
      age_max_months: values.ageMaxMonths,
      capacity: values.capacity,
      price: values.price,
      day_of_week: values.daysOfWeek,
      start_time: values.startTime,
      end_time: values.endTime,
      is_active: values.isActive,
    })
    .eq('id', id)
    .select(SELECT_FIELDS)
    .single()

  if (error) throw new Error(error.message)
  return toStimulationClass(data as unknown as DbStimulationClass)
}

export const deleteClass = async (id: number): Promise<void> => {
  const { data: enrollments, error: enrollErr } = await supabase
    .from('class_enrollment')
    .select('id')
    .eq('class_id', id)

  if (enrollErr) throw new Error(enrollErr.message)

  if (enrollments && enrollments.length > 0) {
    const enrollmentIds = (enrollments as { id: number }[]).map((e) => e.id)

    const { error: attErr } = await supabase
      .from('class_attendance')
      .delete()
      .in('enrollment_id', enrollmentIds)

    if (attErr) throw new Error(attErr.message)

    const { error: delEnrollErr } = await supabase
      .from('class_enrollment')
      .delete()
      .eq('class_id', id)

    if (delEnrollErr) throw new Error(delEnrollErr.message)
  }

  const { error } = await supabase
    .from('stimulation_class')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export type ClassOption = {
  id: number
  name: string
  branchName: string
}

export const getClassesForSelect = async (): Promise<ClassOption[]> => {
  const { data, error } = await supabase
    .from('stimulation_class')
    .select('id, name, branch(name)')
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) throw new Error(error.message)

  return (data as unknown as { id: number; name: string; branch: { name: string } }[]).map(
    (r) => ({ id: r.id, name: r.name, branchName: r.branch.name })
  )
}

export const getTeachersForSelect = async (): Promise<EmployeeOption[]> => {
  const { data, error } = await supabase
    .from('employee')
    .select('id, first_name, last_name')
    .is('deleted_at', null)
    .eq('is_active', true)
    .order('first_name', { ascending: true })

  if (error) throw new Error(error.message)

  return (data as { id: number; first_name: string; last_name: string }[]).map(
    (e) => ({ id: e.id, name: `${e.first_name} ${e.last_name}` })
  )
}

export const getEnrolledCounts = async (
  classIds: number[]
): Promise<Map<number, number>> => {
  if (classIds.length === 0) return new Map()

  const { data, error } = await supabase
    .from('class_enrollment')
    .select('class_id')
    .in('class_id', classIds)
    .eq('is_active', true)

  if (error) throw new Error(error.message)

  const counts = new Map<number, number>()
  for (const row of (data as unknown as { class_id: number }[])) {
    counts.set(row.class_id, (counts.get(row.class_id) ?? 0) + 1)
  }
  return counts
}

export { toClassEnrollment }
export type { DbClassEnrollment }
