import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { cn } from '@/lib/utils'
import { type BranchOption } from '@/features/branches/data/branches-service'
import { type EmployeeOption } from '../data/classes-service'
import {
  classFormSchema,
  classDayLabels,
  classDays,
  type ClassFormValues,
} from '../data/schema'
import { useBranchesForClass, useTeachersForClass } from '../hooks/use-classes'

type ClassFormProps = {
  defaultValues: ClassFormValues
  onSubmit: (values: ClassFormValues) => void
  onCancel: () => void
  isPending: boolean
  submitLabel?: string
}

export const ClassForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  isPending,
  submitLabel = 'Guardar',
}: ClassFormProps) => {
  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema) as Resolver<ClassFormValues>,
    defaultValues,
    mode: 'onChange',
  })

  const { data: branches = [] } = useBranchesForClass()
  const { data: teachers = [] } = useTeachersForClass()

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          onSubmit as (data: ClassFormValues) => void
        )}
        className='space-y-6'
      >
        <div className='grid gap-4 sm:grid-cols-2'>
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
                      <SelectValue placeholder='Seleccionar sucursal' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(branches as BranchOption[]).map((b) => (
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
            name='teacherId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maestro</FormLabel>
                <Select
                  onValueChange={(v) =>
                    field.onChange(v === 'none' ? null : Number(v))
                  }
                  value={field.value ? String(field.value) : 'none'}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Sin maestro' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='none'>Sin maestro</SelectItem>
                    {(teachers as EmployeeOption[]).map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        {t.name}
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
            name='name'
            render={({ field }) => (
              <FormItem className='sm:col-span-2'>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Estimulación temprana 0-12 meses'
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
            name='description'
            render={({ field }) => (
              <FormItem className='sm:col-span-2'>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Descripción de la clase...'
                    rows={3}
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='ageMinMonths'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Edad mínima (meses)</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    min={0}
                    max={120}
                    placeholder='0'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='ageMaxMonths'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Edad máxima (meses)</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    min={0}
                    max={120}
                    placeholder='36'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='capacity'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacidad</FormLabel>
                <FormControl>
                  <Input type='number' min={1} placeholder='10' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio (S/)</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    min={0}
                    step='0.01'
                    placeholder='0.00'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='daysOfWeek'
            render={({ field }) => (
              <FormItem className='sm:col-span-2'>
                <FormLabel>Días de la semana</FormLabel>
                <FormControl>
                  <div className='flex flex-wrap gap-2'>
                    {classDays.map((day) => {
                      const selected = field.value?.includes(day)
                      return (
                        <button
                          key={day}
                          type='button'
                          onClick={() => {
                            const current = field.value ?? []
                            field.onChange(
                              selected
                                ? current.filter((d) => d !== day)
                                : [...current, day]
                            )
                          }}
                          className={cn(
                            'rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
                            selected
                              ? 'border-teal-600 bg-teal-600 text-white'
                              : 'border-input bg-background text-foreground hover:bg-muted'
                          )}
                        >
                          {classDayLabels[day]}
                        </button>
                      )
                    })}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='isActive'
            render={({ field }) => (
              <FormItem className='flex h-11 flex-row items-start justify-between self-end rounded-lg border p-3 shadow-sm'>
                <FormLabel>Activa</FormLabel>
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
            name='startTime'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora de inicio</FormLabel>
                <FormControl>
                  <input
                    type='time'
                    className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='endTime'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora de fin</FormLabel>
                <FormControl>
                  <input
                    type='time'
                    className='flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
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
    </Form>
  )
}
