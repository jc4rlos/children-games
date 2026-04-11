import { getRouteApi, useNavigate } from '@tanstack/react-router'
import {
  Button,
  Card,
  CardContent,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@boilerplate/ui'
import { ArrowLeft, Pencil } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { AttendanceTab } from './components/attendance-tab'
import { EnrolledChildrenTab } from './components/enrolled-children-tab'
import { classDayLabels } from './data/schema'
import { useClassById, useEnrolledCounts } from './hooks/use-classes'

const route = getRouteApi('/_authenticated/stimulation-classes/$classId/')

export const ClassDetail = () => {
  const { classId } = route.useParams()
  const id = Number(classId)
  const navigate = useNavigate()

  const { data: cls, isLoading, isError } = useClassById(id)
  const { data: enrolledCounts } = useEnrolledCounts(id > 0 ? [id] : [])
  const enrolledCount = enrolledCounts?.get(id) ?? 0

  const handleEdit = () =>
    navigate({
      to: '/stimulation-classes/$classId/edit',
      params: { classId },
    })

  const handleBack = () => navigate({ to: '/stimulation-classes' })

  return (
    <Main className='flex flex-1 flex-col gap-6'>
      <div className='flex items-center gap-3'>
        <Button
          variant='ghost'
          size='icon'
          onClick={handleBack}
          aria-label='Volver'
        >
          <ArrowLeft size={18} />
        </Button>
        <div className='flex-1'>
          {isLoading ? (
            <Skeleton className='h-7 w-60' />
          ) : (
            <h2 className='text-2xl font-bold tracking-tight'>
              {cls?.name ?? 'Clase'}
            </h2>
          )}
          <p className='text-sm text-muted-foreground'>
            Detalle de la clase de estimulación temprana
          </p>
        </div>
        {cls && (
          <Button variant='outline' size='sm' onClick={handleEdit}>
            <Pencil size={16} className='me-1' />
            Editar
          </Button>
        )}
      </div>

      {isError && (
        <p className='text-sm text-destructive'>No se pudo cargar la clase.</p>
      )}

      {isLoading ? (
        <Card>
          <CardContent className='space-y-3 pt-6'>
            <Skeleton className='h-5 w-48' />
            <Skeleton className='h-4 w-64' />
            <Skeleton className='h-4 w-56' />
            <Skeleton className='h-4 w-40' />
          </CardContent>
        </Card>
      ) : cls ? (
        <>
          <Card>
            <CardContent className='pt-6'>
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                <div>
                  <p className='text-xs tracking-wide text-muted-foreground uppercase'>
                    Sucursal
                  </p>
                  <p className='font-medium'>{cls.branchName}</p>
                </div>
                <div>
                  <p className='text-xs tracking-wide text-muted-foreground uppercase'>
                    Maestro
                  </p>
                  <p className='font-medium'>
                    {cls.teacherName ?? 'Sin maestro'}
                  </p>
                </div>
                <div>
                  <p className='text-xs tracking-wide text-muted-foreground uppercase'>
                    Horario
                  </p>
                  <p className='font-medium'>
                    {cls.daysOfWeek.map((d) => classDayLabels[d]).join(', ')}{' '}
                    {cls.startTime} - {cls.endTime}
                  </p>
                </div>
                <div>
                  <p className='text-xs tracking-wide text-muted-foreground uppercase'>
                    Rango de edad
                  </p>
                  <p className='font-medium'>
                    {cls.ageMinMonths} - {cls.ageMaxMonths} meses
                  </p>
                </div>
                <div>
                  <p className='text-xs tracking-wide text-muted-foreground uppercase'>
                    Precio
                  </p>
                  <p className='font-medium'>
                    {new Intl.NumberFormat('es-PE', {
                      style: 'currency',
                      currency: 'PEN',
                    }).format(cls.price)}
                  </p>
                </div>
                <div>
                  <p className='text-xs tracking-wide text-muted-foreground uppercase'>
                    Capacidad
                  </p>
                  <div className='space-y-1'>
                    <p className='font-medium'>
                      {enrolledCount} / {cls.capacity} inscritos
                    </p>
                    <div className='h-2 w-full overflow-hidden rounded-full bg-muted'>
                      <div
                        className='h-full rounded-full bg-primary transition-all'
                        style={{
                          width: `${Math.min(100, (enrolledCount / cls.capacity) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {cls.description && (
                <div className='mt-4 border-t pt-4'>
                  <p className='text-xs tracking-wide text-muted-foreground uppercase'>
                    Descripción
                  </p>
                  <p className='mt-1 text-sm'>{cls.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue='inscritos'>
            <TabsList>
              <TabsTrigger value='inscritos'>Inscritos</TabsTrigger>
              <TabsTrigger value='asistencia'>Asistencia</TabsTrigger>
            </TabsList>

            <TabsContent value='inscritos' className='mt-4'>
              <EnrolledChildrenTab
                classInfo={{
                  id: cls.id,
                  name: cls.name,
                  capacity: cls.capacity,
                }}
              />
            </TabsContent>

            <TabsContent value='asistencia' className='mt-4'>
              <AttendanceTab classId={cls.id} />
            </TabsContent>
          </Tabs>
        </>
      ) : null}
    </Main>
  )
}
