import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
} from '@boilerplate/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { Search, X } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { Guardian } from '@/features/guardians/data/schema'
import { useGuardian } from '@/features/guardians/hooks/use-guardians'
import {
  type ChildFormValues,
  childFormSchema,
  genderLabels,
  genderValues,
} from '../data/schema'
import { useBranchesForChild } from '../hooks/use-children'
import { GuardianPickerDialog } from './guardian-picker-dialog'

type ChildFormProps = {
  defaultValues: ChildFormValues
  onSubmit: (values: ChildFormValues) => void
  onCancel: () => void
  isPending: boolean
  submitLabel?: string
}

export const ChildForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  isPending,
  submitLabel = 'Guardar',
}: ChildFormProps) => {
  const form = useForm<ChildFormValues>({
    resolver: zodResolver(childFormSchema),
    defaultValues,
  })

  const [pickerOpen, setPickerOpen] = useState(false)
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(
    null
  )

  // eslint-disable-next-line react-hooks/incompatible-library
  const guardianId = form.watch('guardianId')
  const { data: loadedGuardian } = useGuardian(
    !selectedGuardian && guardianId > 0 ? guardianId : 0
  )
  const displayGuardian = selectedGuardian ?? loadedGuardian ?? null

  const { data: branches = [] } = useBranchesForChild()

  const handleGuardianSelect = (guardian: Guardian) => {
    setSelectedGuardian(guardian)
    form.setValue('guardianId', guardian.id, { shouldValidate: true })
    setPickerOpen(false)
  }

  const handleClearGuardian = () => {
    setSelectedGuardian(null)
    form.setValue('guardianId', undefined as unknown as number, {
      shouldValidate: true,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid gap-4 sm:grid-cols-2'>
          <FormField
            control={form.control}
            name='fullName'
            render={({ field }) => (
              <FormItem className='sm:col-span-2'>
                <FormLabel>Nombre completo</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Ana García López'
                    autoComplete='off'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='guardianId'
            render={() => (
              <FormItem className='sm:col-span-2'>
                <FormLabel>Apoderado</FormLabel>
                <FormControl>
                  <div className='flex gap-2'>
                    <div className='flex min-h-9 flex-1 items-center rounded-md border bg-background px-3 py-2 text-sm'>
                      {displayGuardian ? (
                        <span className='flex-1'>
                          {displayGuardian.fullName}{' '}
                          <span className='text-muted-foreground'>
                            — {displayGuardian.documentNumber}
                          </span>
                        </span>
                      ) : (
                        <span className='flex-1 text-muted-foreground'>
                          Sin apoderado seleccionado
                        </span>
                      )}
                      {displayGuardian && (
                        <button
                          type='button'
                          onClick={handleClearGuardian}
                          className='ms-2 text-muted-foreground hover:text-foreground'
                          aria-label='Quitar apoderado'
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      className='h-9 shrink-0'
                      onClick={() => setPickerOpen(true)}
                    >
                      <Search size={14} className='me-1' />
                      Buscar
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='branchId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sucursal</FormLabel>
                <Select
                  onValueChange={(v) => field.onChange(Number(v))}
                  value={field.value ? String(field.value) : ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecciona una sucursal' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {branches.map((b) => (
                      <SelectItem key={b.id} value={String(b.id)}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='gender'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Género</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecciona el género' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {genderValues.map((g) => (
                      <SelectItem key={g} value={g}>
                        {genderLabels[g]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='birthDate'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de nacimiento</FormLabel>
                <FormControl>
                  <Input type='date' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='isActive'
            render={({ field }) => (
              <FormItem className='flex h-11 flex-row items-start justify-between self-end rounded-lg border p-3 shadow-sm sm:col-span-2'>
                <FormLabel>Activo</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className='h-5'
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='notes'
            render={({ field }) => (
              <FormItem className='sm:col-span-2'>
                <FormLabel>Notas</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Alergias, condiciones médicas u observaciones...'
                    className='resize-none'
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex justify-end gap-3'>
          <Button type='button' variant='outline' onClick={onCancel}>
            Cancelar
          </Button>
          <Button type='submit' disabled={isPending}>
            {isPending ? 'Guardando...' : submitLabel}
          </Button>
        </div>
      </form>

      <GuardianPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={handleGuardianSelect}
      />
    </Form>
  )
}
