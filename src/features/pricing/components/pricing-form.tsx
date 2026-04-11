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
} from '@boilerplate/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Resolver, useForm } from 'react-hook-form'
import type { BranchOption } from '@/features/branches/data/branches-service'
import {
  type PricingConfigFormValues,
  pricingConfigFormSchema,
} from '../data/schema'

type PricingFormProps = {
  defaultValues: PricingConfigFormValues
  branches: BranchOption[]
  onSubmit: (values: PricingConfigFormValues) => void
  onCancel: () => void
  isPending: boolean
  submitLabel?: string
}

export const PricingForm = ({
  defaultValues,
  branches,
  onSubmit,
  onCancel,
  isPending,
  submitLabel = 'Guardar',
}: PricingFormProps) => {
  const form = useForm<PricingConfigFormValues>({
    resolver: zodResolver(
      pricingConfigFormSchema
    ) as Resolver<PricingConfigFormValues>,
    defaultValues,
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid gap-4 sm:grid-cols-2'>
          <FormField
            control={form.control}
            name='branchId'
            render={({ field }) => (
              <FormItem className='sm:col-span-2'>
                <FormLabel>Sucursal</FormLabel>
                <Select
                  value={field.value ? String(field.value) : ''}
                  onValueChange={(val) => field.onChange(Number(val))}
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
            name='description'
            render={({ field }) => (
              <FormItem className='sm:col-span-2'>
                <FormLabel>Descripción (opcional)</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    placeholder='Agrega una descripción...'
                    className='resize-none'
                    {...field}
                    value={field.value ?? ''}
                    maxLength={50}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='pricePerHour'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio por hora (S/)</FormLabel>
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
            name='minimumCharge'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cargo mínimo (S/)</FormLabel>
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
            name='validFrom'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Válido desde</FormLabel>
                <FormControl>
                  <Input type='datetime-local' {...field} />
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
                  <Input
                    type='datetime-local'
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
    </Form>
  )
}
