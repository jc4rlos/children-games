import { type ClassDay, type ClassEnrollment, type StimulationClass } from './schema'

export type DbStimulationClass = {
  id: number
  branch_id: number
  teacher_id: number | null
  name: string
  description: string | null
  age_min_months: number
  age_max_months: number
  capacity: number
  price: number
  day_of_week: string[]
  start_time: string
  end_time: string
  is_active: boolean
  created_at: string
  branch: { name: string }
  teacher: { first_name: string; last_name: string } | null
}

export type DbClassEnrollment = {
  id: number
  class_id: number
  child_id: number
  enrolled_at: string
  is_active: boolean
  child: {
    full_name: string
    avatar: string | null
    gender: 'MALE' | 'FEMALE'
    birth_date: string
    code: string
  }
  enrolledEmployee: { first_name: string; last_name: string } | null
}

export const toStimulationClass = (row: DbStimulationClass): StimulationClass => ({
  id: row.id,
  branchId: row.branch_id,
  branchName: row.branch.name,
  teacherId: row.teacher_id,
  teacherName: row.teacher
    ? `${row.teacher.first_name} ${row.teacher.last_name}`
    : null,
  name: row.name,
  description: row.description,
  ageMinMonths: row.age_min_months,
  ageMaxMonths: row.age_max_months,
  capacity: row.capacity,
  price: Number(row.price),
  daysOfWeek: row.day_of_week as ClassDay[],
  startTime: row.start_time.slice(0, 5),
  endTime: row.end_time.slice(0, 5),
  isActive: row.is_active,
  createdAt: row.created_at,
})

export const toClassEnrollment = (row: DbClassEnrollment): ClassEnrollment => ({
  id: row.id,
  classId: row.class_id,
  childId: row.child_id,
  childName: row.child.full_name,
  childAvatar: row.child.avatar,
  childGender: row.child.gender,
  childBirthDate: row.child.birth_date,
  childCode: row.child.code,
  enrolledAt: row.enrolled_at,
  enrolledByName: row.enrolledEmployee
    ? `${row.enrolledEmployee.first_name} ${row.enrolledEmployee.last_name}`
    : null,
  isActive: row.is_active,
})
