import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import { Sessions } from "@/features/sessions";

const today = new Date().toLocaleDateString("sv-SE");

const sessionsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(20),
  date: z.string().optional().catch(today),
  status: z.array(z.string()).optional().catch(["ACTIVE"]),
});

export const Route = createFileRoute("/_authenticated/sessions/")({
  validateSearch: sessionsSearchSchema,
  component: Sessions,
});
