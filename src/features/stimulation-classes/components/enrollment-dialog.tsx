import {
  Alert,
  AlertDescription,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@boilerplate/ui";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { ChildSessionPickerDialog } from "@/features/sessions/components/child-session-picker-dialog";
import type { ChildSelectOption } from "@/features/sessions/data/sessions-service";
import { useEnrollChild } from "../hooks/use-enrollment";
import { useAuthStore } from "@/stores/auth-store";

type EnrollmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classInfo: { id: number; name: string; capacity: number };
  enrolledCount: number;
};

export const EnrollmentDialog = ({
  open,
  onOpenChange,
  classInfo,
  enrolledCount,
}: EnrollmentDialogProps) => {
  const [pickerOpen, setPickerOpen] = useState(false);

  const enrollMutation = useEnrollChild(classInfo.id);
  const { auth } = useAuthStore();

  const isFull = enrolledCount >= classInfo.capacity;

  const handleSelectChild = (child: ChildSelectOption) => {
    enrollMutation.mutate(
      { childId: child.id, enrolledBy: auth.user?.employeeId ?? 0 },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Inscribir niño en {classInfo.name}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Inscritos: {enrolledCount} / {classInfo.capacity}
              </span>
            </div>

            {isFull && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Esta clase ya alcanzó su capacidad máxima.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() => setPickerOpen(true)}
                disabled={isFull || enrollMutation.isPending}
              >
                Seleccionar niño
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ChildSessionPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={handleSelectChild}
      />
    </>
  );
};
