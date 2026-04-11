import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Alert,
  AlertDescription,
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
} from '@boilerplate/ui'
import { AlertTriangle, Clock, Gift, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getAvatarUrl } from '@/features/children/data/avatar-utils'
import { LoyaltyStampsGrid } from '@/features/loyalty/components/loyalty-stamps-grid'
import { useLoyaltyCard } from '@/features/loyalty/hooks/use-loyalty'
import {
  calculateAge,
  durationOptions,
  sessionFormSchema,
  type SessionFormValues,
} from '../data/schema'
import { type ChildSelectOption } from '../data/sessions-service'
import {
  useBranchesForSession,
  useCouponsForBranch,
  useEmployeesForSession,
  usePricingConfigsForBranch,
} from '../hooks/use-sessions'
import { ChildSessionPickerDialog } from './child-session-picker-dialog'

type SessionFormProps = {
  defaultValues: SessionFormValues
  onSubmit: (values: SessionFormValues) => void
  onCancel: () => void
  isPending: boolean
  submitLabel?: string
}

const genderLabel: Record<'MALE' | 'FEMALE', string> = {
  MALE: 'Niño',
  FEMALE: 'Niña',
}

export const SessionForm = ({
  defaultValues,
  onSubmit,
  onCancel,
  isPending,
  submitLabel = 'Guardar',
}: SessionFormProps) => {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [selectedChild, setSelectedChild] = useState<ChildSelectOption | null>(
    null
  )

  const { data: loyaltyCard } = useLoyaltyCard(selectedChild?.id ?? null)

  const form = useForm({
    resolver: zodResolver(sessionFormSchema),
    defaultValues,
  })

  const branchId = useWatch({ control: form.control, name: 'branchId' })
  const pricingId = useWatch({ control: form.control, name: 'pricingId' })
  const durationMinutes = useWatch({
    control: form.control,
    name: 'durationMinutes',
  })
  const isFreeSession = useWatch({
    control: form.control,
    name: 'isFreeSession',
  })

  const { data: branches = [] } = useBranchesForSession()
  const { data: pricingOptions = [] } = usePricingConfigsForBranch(branchId)
  const { data: couponOptions = [] } = useCouponsForBranch(branchId)
  const { data: employees = [] } = useEmployeesForSession()

  const selectedPricing = pricingOptions.find((p) => p.id === pricingId)
  const estimatedCost =
    selectedPricing && durationMinutes > 0
      ? Math.max(
          selectedPricing.minimumCharge,
          (durationMinutes / 60) * selectedPricing.pricePerHour
        )
      : null

  const handleChildSelect = (child: ChildSelectOption) => {
    setSelectedChild(child)
    form.setValue('childId', child.id)
    form.setValue('branchId', child.branchId)
    form.setValue('pricingId', 0)
    form.setValue('couponId', null)
  }

  const handleClearChild = () => {
    setSelectedChild(null)
    form.setValue('childId', 0)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid gap-4 sm:grid-cols-2'>
          <FormField
            control={form.control}
            name='childId'
            render={({ fieldState }) => (
              <FormItem className='sm:col-span-2'>
                <FormLabel>Niño</FormLabel>
                {selectedChild ? (
                  <div className='flex items-center gap-3 rounded-lg border p-3'>
                    <img
                      src={
                        selectedChild.avatar ??
                        getAvatarUrl(selectedChild.code, selectedChild.gender)
                      }
                      alt={selectedChild.fullName}
                      className='h-10 w-10 rounded-full object-cover'
                    />
                    <div className='flex-1'>
                      <p className='font-medium'>{selectedChild.fullName}</p>
                      <p className='text-sm text-muted-foreground'>
                        {calculateAge(selectedChild.birthDate)} años ·{' '}
                        {genderLabel[selectedChild.gender]}
                      </p>
                    </div>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 shrink-0'
                      onClick={handleClearChild}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ) : (
                  <Button
                    type='button'
                    variant='outline'
                    className='w-full justify-start gap-2'
                    onClick={() => setPickerOpen(true)}
                  >
                    <Search size={16} />
                    Buscar niño...
                  </Button>
                )}
                {fieldState.error && (
                  <p className='text-sm text-destructive'>
                    {fieldState.error.message}
                  </p>
                )}
              </FormItem>
            )}
          />

          {loyaltyCard && (
            <div className='space-y-2 sm:col-span-2'>
              <LoyaltyStampsGrid card={loyaltyCard} />
              {isFreeSession && loyaltyCard.freeSessions <= 0 && (
                <Alert variant='destructive'>
                  <AlertTriangle className='h-4 w-4' />
                  <AlertDescription>
                    Este niño no tiene sesiones gratuitas disponibles.
                  </AlertDescription>
                </Alert>
              )}
              {isFreeSession && loyaltyCard.freeSessions > 0 && (
                <Alert className='border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200'>
                  <Gift className='h-4 w-4' />
                  <AlertDescription>
                    Se usará 1 sesión gratuita ({loyaltyCard.freeSessions}{' '}
                    disponible{loyaltyCard.freeSessions !== 1 ? 's' : ''}).
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <FormField
            control={form.control}
            name='branchId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sucursal</FormLabel>
                <Select
                  value={field.value ? String(field.value) : ''}
                  onValueChange={(val) => {
                    field.onChange(Number(val))
                    form.setValue('pricingId', 0)
                    form.setValue('couponId', null)
                  }}
                  disabled={!!selectedChild}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecciona sucursal' />
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
            name='pricingId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tarifa</FormLabel>
                <Select
                  value={field.value ? String(field.value) : ''}
                  onValueChange={(val) => field.onChange(Number(val))}
                  disabled={!branchId || pricingOptions.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          !branchId
                            ? 'Selecciona sucursal primero'
                            : pricingOptions.length === 0
                              ? 'Sin tarifas disponibles'
                              : 'Selecciona tarifa'
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {pricingOptions.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.label}
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
            name='durationMinutes'
            render={({ field, fieldState }) => (
              <FormItem className='sm:col-span-2'>
                <FormLabel className='flex items-center gap-1.5'>
                  <Clock size={14} />
                  Duración
                </FormLabel>
                <div className='flex flex-wrap gap-2'>
                  {durationOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type='button'
                      onClick={() => field.onChange(opt.value)}
                      className={cn(
                        'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                        field.value === opt.value
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {fieldState.error && (
                  <p className='text-sm text-destructive'>
                    {fieldState.error.message}
                  </p>
                )}
                {estimatedCost !== null && !isFreeSession && (
                  <p className='text-sm font-semibold text-teal-600 dark:text-teal-400'>
                    Total estimado:{' '}
                    {new Intl.NumberFormat('es-PE', {
                      style: 'currency',
                      currency: 'PEN',
                    }).format(estimatedCost)}
                  </p>
                )}
                {isFreeSession && durationMinutes > 0 && (
                  <p className='text-sm font-semibold text-purple-600 dark:text-purple-400'>
                    Sesión gratuita — sin cobro
                  </p>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='registeredById'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registrado por</FormLabel>
                <Select
                  value={field.value ? String(field.value) : ''}
                  onValueChange={(val) => field.onChange(Number(val))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecciona empleado' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {employees.map((e) => (
                      <SelectItem key={e.id} value={String(e.id)}>
                        {e.name}
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
            name='couponId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cupón (opcional)</FormLabel>
                <Select
                  value={field.value != null ? String(field.value) : 'none'}
                  onValueChange={(val) =>
                    field.onChange(val === 'none' ? null : Number(val))
                  }
                  disabled={!branchId || couponOptions.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Sin cupón' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='none'>Sin cupón</SelectItem>
                    {couponOptions.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.code} —{' '}
                        {c.discountType === 'PERCENTAGE'
                          ? `${c.discountValue}%`
                          : `S/ ${c.discountValue}`}
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
            name='isFreeSession'
            render={({ field }) => (
              <FormItem className='flex h-11 flex-row items-start justify-between self-end rounded-lg border p-3 shadow-sm sm:col-span-2'>
                <FormLabel>Sesión gratuita (canje de lealtad)</FormLabel>
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
                <FormLabel>Notas (opcional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Observaciones adicionales...'
                    rows={2}
                    {...field}
                    value={field.value ?? ''}
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

      <ChildSessionPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={handleChildSelect}
      />
    </Form>
  )
}
