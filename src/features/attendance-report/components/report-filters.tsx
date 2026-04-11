import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@boilerplate/ui'
import { RotateCcw } from 'lucide-react'
import { type ClassOption } from '@/features/stimulation-classes/data/classes-service'

type ReportFiltersProps = {
  classes: ClassOption[]
  classId: number
  dateFrom: string
  dateTo: string
  isFiltered: boolean
  onClassChange: (id: number) => void
  onDateFromChange: (date: string) => void
  onDateToChange: (date: string) => void
  onReset: () => void
}

export const ReportFilters = ({
  classes,
  classId,
  dateFrom,
  dateTo,
  isFiltered,
  onClassChange,
  onDateFromChange,
  onDateToChange,
  onReset,
}: ReportFiltersProps) => {
  return (
    <div className='flex flex-wrap items-end gap-3'>
      <div className='flex flex-col gap-1.5'>
        <label className='text-sm font-medium'>Clase</label>
        <Select
          value={classId > 0 ? String(classId) : ''}
          onValueChange={(v) => onClassChange(Number(v))}
        >
          <SelectTrigger className='w-64'>
            <SelectValue placeholder='Seleccionar clase...' />
          </SelectTrigger>
          <SelectContent>
            {classes.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                <span>{c.name}</span>
                <span className='ml-2 text-xs text-muted-foreground'>
                  {c.branchName}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='flex flex-col gap-1.5'>
        <label className='text-sm font-medium'>Desde</label>
        <input
          type='date'
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          className='flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none'
        />
      </div>

      <div className='flex flex-col gap-1.5'>
        <label className='text-sm font-medium'>Hasta</label>
        <input
          type='date'
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          className='flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none'
        />
      </div>

      {isFiltered && (
        <Button variant='ghost' size='sm' onClick={onReset} className='gap-1'>
          <RotateCcw size={14} />
          Restablecer
        </Button>
      )}
    </div>
  )
}
