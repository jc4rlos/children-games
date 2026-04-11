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
import { type Resolver, useForm } from 'react-hook-form'
import type { BranchOption } from '@/features/branches/data/branches-service'
import {
  type CouponFormValues,
  couponFormSchema,
  discountTypeLabels,
  discountTypes,
} from '../data/schema'

type CouponFormProps = {
  defaultValues: CouponFormValues
  branches: BranchOption[]
  onSubmit: (values: CouponFormValues) => void
  onCancel: () => void
  isPending: boolean
  submitLabel?: string
}

export const CouponForm = ({
  defaultValues,
  branches,
  onSubmit,
  onCancel,
  isPending,
  submitLabel = 'Guardar',
}: CouponFormProps) => {
  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponFormSchema) as Resolver<CouponFormValues>,
    defaultValues,
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid gap-4 sm:grid-cols-2'>
          <FormField
            control={form.control}
            name='code'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input
                    placeholder='PROMO2024'
                    autoComplete='off'
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                  />
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
            name='branchId'
            render={({ field }) => (
              <FormItem className='sm:col-span-2'>
                <FormLabel>Sucursal (opcional)</FormLabel>
                <Select
                  value={field.value != null ? String(field.value) : 'all'}
                  onValueChange={(val) =>
                    field.onChange(val === 'all' ? null : Number(val))
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Todas las sedes' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='all'>Todas las sedes</SelectItem>
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
            name='description'
            render={({ field }) => (
              <FormItem className='sm:col-span-2'>
                <FormLabel>Descripción (opcional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Describe el propósito del cupón...'
                    rows={2}
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
            name='discountType'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de descuento</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Selecciona tipo' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {discountTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {discountTypeLabels[type]}
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
            name='discountValue'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor del descuento</FormLabel>
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
            name='maxUses'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usos máximos (vacío = ilimitado)</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    min={1}
                    step={1}
                    placeholder='Ilimitado'
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
            name='validFrom'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Válido desde</FormLabel>
                <FormControl>
                  <Input type='date' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='validUntil'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Válido hasta (opcional)</FormLabel>
                <FormControl>
                  <Input type='date' {...field} value={field.value ?? ''} />
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
