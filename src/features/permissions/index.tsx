import {
  Badge,
  Button,
  Checkbox,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@boilerplate/ui'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, PlusCircle, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { Main } from '@/components/layout/main'
import { MenuItemDialog } from './components/menu-item-dialog'
import {
  createMenuItem,
  deleteMenuItem,
  getAllMenuItemsWithPermissions,
  type MenuItem,
  type MenuItemFormValues,
  type MenuItemWithPermissions,
  updateMenuItem,
  upsertRolePermission,
} from './data/menu-service'

const ROLES: { value: string; label: string }[] = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'SUPERVISOR', label: 'Supervisor' },
  { value: 'RECEPTIONIST', label: 'Recepción' },
  { value: 'TEACHER', label: 'Maestro' },
]

const QUERY_KEY = ['menu-items-permissions']

export default function PermissionsPage() {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [deletingItem, setDeletingItem] =
    useState<MenuItemWithPermissions | null>(null)

  const { data: items = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getAllMenuItemsWithPermissions,
  })

  const { mutate: toggle } = useMutation({
    mutationFn: ({
      menuItemId,
      role,
      enabled,
    }: {
      menuItemId: number
      role: string
      enabled: boolean
    }) => upsertRolePermission(menuItemId, role, enabled),
    onMutate: async ({ menuItemId, role, enabled }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY })
      const previous =
        queryClient.getQueryData<MenuItemWithPermissions[]>(QUERY_KEY)
      queryClient.setQueryData<MenuItemWithPermissions[]>(
        QUERY_KEY,
        (old = []) =>
          old.map((item) =>
            item.id !== menuItemId
              ? item
              : {
                  ...item,
                  permissions: item.permissions.some((p) => p.role === role)
                    ? item.permissions.map((p) =>
                        p.role === role ? { ...p, enabled } : p
                      )
                    : [...item.permissions, { role, enabled }],
                }
          )
      )
      return { previous }
    },
    onError: (err: Error, _, context) => {
      if (context?.previous) {
        queryClient.setQueryData(QUERY_KEY, context.previous)
      }
      toast.error(`Error al actualizar permiso: ${err.message}`)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })

  const createMutation = useMutation({
    mutationFn: (values: MenuItemFormValues) => createMenuItem(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      setDialogOpen(false)
      toast.success('Ítem creado.')
    },
    onError: (e: Error) => toast.error(`Error: ${e.message}`),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: MenuItemFormValues }) =>
      updateMenuItem(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      setDialogOpen(false)
      setEditingItem(null)
      toast.success('Ítem actualizado.')
    },
    onError: (e: Error) => toast.error(`Error: ${e.message}`),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteMenuItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      setDeletingItem(null)
      toast.success('Ítem eliminado.')
    },
    onError: (e: Error) => toast.error(`Error: ${e.message}`),
  })

  const handleOpenCreate = () => {
    setEditingItem(null)
    setDialogOpen(true)
  }

  const handleOpenEdit = (item: MenuItemWithPermissions) => {
    setEditingItem(item)
    setDialogOpen(true)
  }

  const handleSubmit = (values: MenuItemFormValues) => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, values })
    } else {
      createMutation.mutate(values)
    }
  }

  const isPendingForm = createMutation.isPending || updateMutation.isPending

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            Permisos de Menú
          </h2>
          <p className='text-muted-foreground'>
            Administra los ítems del menú y los accesos por rol.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className='gap-1.5'>
          <PlusCircle size={16} />
          Nuevo ítem
        </Button>
      </div>

      <div className='overflow-auto rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='min-w-40'>Ítem</TableHead>
              <TableHead className='min-w-36'>Ruta</TableHead>
              <TableHead className='w-16 text-center'>Orden</TableHead>
              <TableHead className='w-20 text-center'>Estado</TableHead>
              {ROLES.map((role) => (
                <TableHead key={role.value} className='w-24 text-center'>
                  {role.label}
                </TableHead>
              ))}
              <TableHead className='w-20 text-center'>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 4 + ROLES.length + 2 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className='h-4 w-full' />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4 + ROLES.length + 2}
                  className='py-10 text-center text-sm text-muted-foreground'
                >
                  No hay ítems de menú registrados.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className='flex flex-col gap-0.5'>
                      <span className='leading-tight font-medium'>
                        {item.label}
                      </span>
                      {item.icon && (
                        <span className='text-xs text-muted-foreground'>
                          {item.icon}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className='font-mono text-xs text-muted-foreground'>
                    {item.path}
                  </TableCell>
                  <TableCell className='text-center text-sm text-muted-foreground'>
                    {item.sortOrder}
                  </TableCell>
                  <TableCell className='text-center'>
                    {item.isActive ? (
                      <Badge className='bg-teal-100 text-teal-700 hover:bg-teal-100 dark:bg-teal-900/40 dark:text-teal-300'>
                        Activo
                      </Badge>
                    ) : (
                      <Badge variant='secondary'>Inactivo</Badge>
                    )}
                  </TableCell>
                  {ROLES.map((role) => {
                    const perm = item.permissions.find(
                      (p) => p.role === role.value
                    )
                    const enabled = perm?.enabled ?? false
                    return (
                      <TableCell key={role.value} className='text-center'>
                        <Checkbox
                          checked={enabled}
                          onCheckedChange={(checked) =>
                            toggle({
                              menuItemId: item.id,
                              role: role.value,
                              enabled: !!checked,
                            })
                          }
                        />
                      </TableCell>
                    )
                  })}
                  <TableCell>
                    <div className='flex items-center justify-center gap-1'>
                      <Button
                        size='icon'
                        variant='ghost'
                        className='h-7 w-7'
                        onClick={() => handleOpenEdit(item)}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        size='icon'
                        variant='ghost'
                        className='h-7 w-7 text-destructive hover:text-destructive'
                        onClick={() => setDeletingItem(item)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <MenuItemDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setEditingItem(null)
        }}
        onSubmit={handleSubmit}
        isPending={isPendingForm}
        item={editingItem}
        parentOptions={items}
      />

      {deletingItem && (
        <ConfirmDialog
          open={!!deletingItem}
          onOpenChange={(open) => {
            if (!open) setDeletingItem(null)
          }}
          handleConfirm={() => deleteMutation.mutate(deletingItem.id)}
          disabled={deleteMutation.isPending}
          title='Eliminar ítem de menú'
          desc={
            <p>
              ¿Eliminar{' '}
              <span className='font-semibold'>{deletingItem.label}</span>? Esto
              también eliminará todos sus permisos de rol asociados.
            </p>
          }
          confirmText={deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
          destructive
        />
      )}
    </Main>
  )
}
