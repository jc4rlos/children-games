import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
} from '@boilerplate/ui'
import { type MenuItem, type MenuItemFormValues } from '../data/menu-service'

type MenuItemDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: MenuItemFormValues) => void
  isPending: boolean
  item?: MenuItem | null
  parentOptions: MenuItem[]
}

const DEFAULT_VALUES: MenuItemFormValues = {
  label: '',
  path: '',
  icon: '',
  parentId: null,
  sortOrder: 0,
  isActive: true,
}

export const MenuItemDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isPending,
  item,
  parentOptions,
}: MenuItemDialogProps) => {
  const isEdit = !!item

  const form = useForm<MenuItemFormValues>({
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (open) {
      form.reset(
        item
          ? {
              label: item.label,
              path: item.path,
              icon: item.icon ?? '',
              parentId: item.parentId,
              sortOrder: item.sortOrder,
              isActive: item.isActive,
            }
          : DEFAULT_VALUES
      )
    }
  }, [open, item, form])

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Editar ítem de menú' : 'Nuevo ítem de menú'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='label'
                rules={{ required: 'El label es requerido' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input placeholder='Ej: Sesiones de Juego' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='path'
                rules={{ required: 'La ruta es requerida' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ruta</FormLabel>
                    <FormControl>
                      <Input placeholder='/sessions' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='icon'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Icono{' '}
                      <span className='text-xs text-muted-foreground'>
                        (opcional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder='ShoppingCart' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='sortOrder'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orden</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={0}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='parentId'
                render={({ field }) => (
                  <FormItem className='sm:col-span-2'>
                    <FormLabel>
                      Padre{' '}
                      <span className='text-xs text-muted-foreground'>
                        (opcional — para submenús)
                      </span>
                    </FormLabel>
                    <Select
                      value={field.value ? String(field.value) : 'none'}
                      onValueChange={(v) =>
                        field.onChange(v === 'none' ? null : Number(v))
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Sin padre (ítem raíz)' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='none'>Sin padre (raíz)</SelectItem>
                        {parentOptions
                          .filter((p) => p.id !== item?.id)
                          .map((p) => (
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
                name='isActive'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 sm:col-span-2'>
                    <FormLabel className='cursor-pointer'>Activo</FormLabel>
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
            </div>

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type='submit' disabled={isPending}>
                {isPending ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear ítem'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
