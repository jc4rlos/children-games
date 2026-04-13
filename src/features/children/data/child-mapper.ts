import type { Database } from "@/lib/database.types";
import { getAvatarUrl } from "./avatar-utils";
import type { Child, ChildFormValues } from "./schema";

type DbChild = Database["public"]["Tables"]["child"]["Row"];
type DbChildInsert = Database["public"]["Tables"]["child"]["Insert"];
type DbChildUpdate = Database["public"]["Tables"]["child"]["Update"];

const generateCode = (): string => {
  const num = Math.floor(Math.random() * 900000) + 100000;
  return `KIDS-${num}`;
};

export const toChild = (row: DbChild): Child => ({
  id: row.id,
  guardianId: row.guardian_id,
  branchId: row.branch_id,
  fullName: row.full_name,
  gender: row.gender,
  avatar: row.avatar,
  birthDate: row.birth_date,
  code: row.code,
  notes: row.notes,
  isActive: row.is_active,
});

export const toChildWithLoyalty = (
  row: DbChild & {
    loyalty_card: {
      stamps_count: number;
      stamps_required: number;
      free_sessions: number;
    } | null;
  },
): Child => ({
  ...toChild(row),
  loyaltyStampsCount: row.loyalty_card?.stamps_count ?? null,
  loyaltyStampsRequired: row.loyalty_card?.stamps_required ?? null,
  loyaltyFreeSessions: row.loyalty_card?.free_sessions ?? null,
});

export const toDbInsert = (values: ChildFormValues): DbChildInsert => {
  const code = generateCode();
  return {
    guardian_id: values.guardianId,
    branch_id: values.branchId,
    full_name: values.fullName,
    gender: values.gender,
    birth_date: values.birthDate,
    code,
    avatar: getAvatarUrl(code, values.gender),
    notes: values.notes || null,
    is_active: values.isActive,
    created_by: "system",
  };
};

export const toDbUpdate = (
  values: ChildFormValues,
  code: string,
): DbChildUpdate => ({
  guardian_id: values.guardianId,
  branch_id: values.branchId,
  full_name: values.fullName,
  gender: values.gender,
  birth_date: values.birthDate,
  avatar: getAvatarUrl(code, values.gender),
  notes: values.notes || null,
  is_active: values.isActive,
  updated_at: new Date().toLocaleDateString("sv-SE"),
});
