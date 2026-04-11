import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@boilerplate/ui'
import { Search, UserCheck } from 'lucide-react'
import { getAvatarUrl } from '@/features/children/data/avatar-utils'
import { useChildrenForPicker } from '../hooks/use-sessions'
import { calculateAge } from '../data/schema'
import { type ChildSelectOption } from '../data/sessions-service'

const PAGE_SIZE = 8

const genderLabel: Record<'MALE' | 'FEMALE', string> = {
  MALE: 'Niño',
  FEMALE: 'Niña',
}

type ChildSessionPickerDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (child: ChildSelectOption) => void
}

export const ChildSessionPickerDialog = ({
  open,
  onOpenChange,
  onSelect,
}: ChildSessionPickerDialogProps) => {
  const [page, setPage] = useState(1)
  const [nameInput, setNameInput] = useState('')
  const [appliedName, setAppliedName] = useState('')

  const { data, isLoading } = useChildrenForPicker(appliedName, page)
  const total = data?.total ?? 0
  const pageCount = Math.ceil(total / PAGE_SIZE)
  const children = data?.data ?? []

  const handleSearch = () => {
    setPage(1)
    setAppliedName(nameInput)
  }

  const handleReset = () => {
    setNameInput('')
    setAppliedName('')
    setPage(1)
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) handleReset()
    onOpenChange(next)
  }

  const handleSelect = (child: ChildSelectOption) => {
    onSelect(child)
    handleReset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Seleccionar Niño</DialogTitle>
        </DialogHeader>

        <div className='flex flex-col gap-4'>
          <div className='flex gap-2'>
            <Input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder='Buscar por nombre...'
              className='h-9'
            />
            <Button size='sm' onClick={handleSearch} className='h-9 shrink-0'>
              <Search size={14} className='me-1' />
              Buscar
            </Button>
          </div>

          <div className='overflow-hidden rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='w-10' />
                  <TableHead>Nombre</TableHead>
                  <TableHead>Edad</TableHead>
                  <TableHead className='hidden sm:table-cell'>Género</TableHead>
                  <TableHead className='w-10' />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className='h-8 w-8 rounded-full' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-4 w-40' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-4 w-12' />
                      </TableCell>
                      <TableCell className='hidden sm:table-cell'>
                        <Skeleton className='h-4 w-16' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-8 w-8 rounded-md' />
                      </TableCell>
                    </TableRow>
                  ))
                ) : children.length > 0 ? (
                  children.map((child) => {
                    const src =
                      child.avatar ?? getAvatarUrl(child.code, child.gender)
                    const age = calculateAge(child.birthDate)
                    return (
                      <TableRow
                        key={child.id}
                        className='cursor-pointer hover:bg-muted/50'
                        onClick={() => handleSelect(child)}
                      >
                        <TableCell>
                          <img
                            src={src}
                            alt={child.fullName}
                            className='h-8 w-8 rounded-full object-cover'
                          />
                        </TableCell>
                        <TableCell className='font-medium'>
                          {child.fullName}
                        </TableCell>
                        <TableCell className='text-sm text-muted-foreground'>
                          {age} años
                        </TableCell>
                        <TableCell className='hidden text-sm text-muted-foreground sm:table-cell'>
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              child.gender === 'MALE'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200'
                            }`}
                          >
                            {genderLabel[child.gender]}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            size='icon'
                            variant='ghost'
                            className='h-8 w-8'
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSelect(child)
                            }}
                          >
                            <UserCheck size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className='h-20 text-center text-muted-foreground'
                    >
                      No se encontraron niños.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className='flex items-center justify-between text-sm text-muted-foreground'>
            <span>
              {total > 0
                ? `${total} niño${total === 1 ? '' : 's'} encontrado${total === 1 ? '' : 's'}`
                : ''}
            </span>
            {pageCount > 1 && (
              <div className='flex items-center gap-1'>
                <Button
                  size='sm'
                  variant='outline'
                  className='h-8'
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Anterior
                </Button>
                <span className='px-2'>
                  {page} / {pageCount}
                </span>
                <Button
                  size='sm'
                  variant='outline'
                  className='h-8'
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  disabled={page === pageCount}
                >
                  Siguiente
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
