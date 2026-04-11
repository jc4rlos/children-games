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
import { type Product } from '../data/schema'

type ProductRowActionsProps = {
  product: Product
  onDelete: (product: Product) => void
}

export const ProductRowActions = ({
  product,
  onDelete,
}: ProductRowActionsProps) => {
  const navigate = useNavigate()

  const handleEdit = () =>
    navigate({
      to: '/products/$productId/edit',
      params: { productId: String(product.id) },
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
          onClick={() => onDelete(product)}
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
