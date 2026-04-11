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
import { useState } from 'react'
import type { Guardian } from '@/features/guardians/data/schema'
import { useGuardians } from '@/features/guardians/hooks/use-guardians'

const PAGE_SIZE = 8

type GuardianPickerDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (guardian: Guardian) => void
}

export const GuardianPickerDialog = ({
  open,
  onOpenChange,
  onSelect,
}: GuardianPickerDialogProps) => {
  const [page, setPage] = useState(1)
  const [nameInput, setNameInput] = useState('')
  const [docInput, setDocInput] = useState('')
  const [appliedName, setAppliedName] = useState('')
  const [appliedDoc, setAppliedDoc] = useState('')

  const { data, isLoading } = useGuardians({
    page,
    pageSize: PAGE_SIZE,
    name: appliedName || undefined,
    documentNumber: appliedDoc || undefined,
  })

  const total = data?.total ?? 0
  const pageCount = Math.ceil(total / PAGE_SIZE)
  const guardians = data?.data ?? []

  const handleSearch = () => {
    setPage(1)
    setAppliedName(nameInput)
    setAppliedDoc(docInput)
  }

  const handleReset = () => {
    setNameInput('')
    setDocInput('')
    setAppliedName('')
    setAppliedDoc('')
    setPage(1)
  }

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      handleReset()
    }
    onOpenChange(next)
  }

  const handleSelect = (guardian: Guardian) => {
    onSelect(guardian)
    handleReset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Seleccionar Apoderado</DialogTitle>
        </DialogHeader>

        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2 sm:flex-row'>
            <Input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder='Buscar por nombre...'
              className='h-9'
            />
            <Input
              value={docInput}
              onChange={(e) => setDocInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder='Buscar por DNI...'
              className='h-9 sm:w-48'
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
                  <TableHead>Nombre</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead className='hidden sm:table-cell'>
                    Teléfono
                  </TableHead>
                  <TableHead className='hidden sm:table-cell'>Email</TableHead>
                  <TableHead className='w-10' />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className='h-4 w-40' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-4 w-24' />
                      </TableCell>
                      <TableCell className='hidden sm:table-cell'>
                        <Skeleton className='h-4 w-24' />
                      </TableCell>
                      <TableCell className='hidden sm:table-cell'>
                        <Skeleton className='h-4 w-36' />
                      </TableCell>
                      <TableCell>
                        <Skeleton className='h-8 w-8 rounded-md' />
                      </TableCell>
                    </TableRow>
                  ))
                ) : guardians.length > 0 ? (
                  guardians.map((guardian) => (
                    <TableRow
                      key={guardian.id}
                      className='cursor-pointer hover:bg-muted/50'
                      onClick={() => handleSelect(guardian)}
                    >
                      <TableCell className='font-medium'>
                        {guardian.fullName}
                      </TableCell>
                      <TableCell className='font-mono text-sm text-muted-foreground'>
                        {guardian.documentNumber}
                      </TableCell>
                      <TableCell className='hidden text-sm text-muted-foreground sm:table-cell'>
                        {guardian.phone ?? '—'}
                      </TableCell>
                      <TableCell className='hidden text-sm text-muted-foreground sm:table-cell'>
                        {guardian.email ?? '—'}
                      </TableCell>
                      <TableCell>
                        <Button
                          size='icon'
                          variant='ghost'
                          className='h-8 w-8'
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelect(guardian)
                          }}
                        >
                          <UserCheck size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className='h-20 text-center text-muted-foreground'
                    >
                      No se encontraron apoderados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className='flex items-center justify-between text-sm text-muted-foreground'>
            <span>
              {total > 0
                ? `${total} apoderado${total === 1 ? '' : 's'} encontrado${total === 1 ? '' : 's'}`
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
