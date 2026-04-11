import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useNavigate } from '@tanstack/react-router'
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@boilerplate/ui'
import { Pencil, Trash2 } from 'lucide-react'
import { type Coupon } from '../data/schema'

type CouponRowActionsProps = {
  coupon: Coupon
  onDelete: (coupon: Coupon) => void
}

export const CouponRowActions = ({
  coupon,
  onDelete,
}: CouponRowActionsProps) => {
  const navigate = useNavigate()

  const handleEdit = () =>
    navigate({
      to: '/coupons/$couponId/edit',
      params: { couponId: String(coupon.id) },
    })

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Abrir menú</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-40'>
        <DropdownMenuItem onClick={handleEdit}>
          Editar
          <DropdownMenuShortcut>
            <Pencil size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='text-red-500!'
          onClick={() => onDelete(coupon)}
        >
          Eliminar
          <DropdownMenuShortcut>
            <Trash2 size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
