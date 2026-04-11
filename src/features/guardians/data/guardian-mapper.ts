import type { Database } from '@/lib/database.types'
import type { Guardian, GuardianFormValues } from './schema'

type DbGuardian = Database['public']['Tables']['guardian']['Row']
type DbGuardianInsert = Database['public']['Tables']['guardian']['Insert']
type DbGuardianUpdate = Database['public']['Tables']['guardian']['Update']

export const toGuardian = (row: DbGuardian): Guardian => ({
  id: row.id,
  fullName: row.full_name,
  documentNumber: row.document_number,
  phone: row.phone,
  email: row.email,
})

export const toDbInsert = (values: GuardianFormValues): DbGuardianInsert => ({
  full_name: values.fullName,
  document_number: values.documentNumber,
  phone: values.phone || null,
  email: values.email || null,
  created_by: 'system',
})

export const toDbUpdate = (values: GuardianFormValues): DbGuardianUpdate => ({
  full_name: values.fullName,
  document_number: values.documentNumber,
  phone: values.phone || null,
  email: values.email || null,
  updated_at: new Date().toISOString(),
})
