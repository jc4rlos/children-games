import { useState } from 'react'
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
} from '@boilerplate/ui'
import { Minus, Plus, Search, ShoppingCart, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type ProductOption } from '@/features/products/data/products-service'
import { type PlaySession } from '../data/schema'
import {
  useAddConsumption,
  useProductsForConsumption,
  useRemoveConsumption,
  useSessionConsumptions,
} from '../hooks/use-consumption'

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(
    v
  )

type CartItem = { product: ProductOption; quantity: number }
type View = 'products' | 'cart'

type SessionConsumptionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  session: PlaySession
  initialView?: View
}

export const SessionConsumptionDialog = ({
  open,
  onOpenChange,
  session,
  initialView = 'products',
}: SessionConsumptionDialogProps) => {
  const [view, setView] = useState<View>(initialView)
  const [cart, setCart] = useState<CartItem[]>([])
  const [search, setSearch] = useState('')

  const { data: products = [] } = useProductsForConsumption(session.branchId)
  const { data: consumptions = [] } = useSessionConsumptions(session.id)
  const addMutation = useAddConsumption()
  const removeMutation = useRemoveConsumption(session.id)

  const filteredProducts = search.trim()
    ? products.filter((p) =>
        p.name.toLowerCase().includes(search.trim().toLowerCase())
      )
    : products

  const byCategory = filteredProducts.reduce<Record<string, ProductOption[]>>(
    (acc, p) => {
      const cat = p.categoryName || 'Sin categoría'
      ;(acc[cat] ??= []).push(p)
      return acc
    },
    {}
  )

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  const consumptionsTotal = consumptions.reduce((sum, c) => sum + c.subtotal, 0)
  const totalCount = consumptions.length + cart.length

  const setQty = (product: ProductOption, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.product.id !== product.id))
    } else {
      setCart((prev) => {
        const exists = prev.find((i) => i.product.id === product.id)
        if (exists)
          return prev.map((i) =>
            i.product.id === product.id ? { ...i, quantity: qty } : i
          )
        return [...prev, { product, quantity: qty }]
      })
    }
  }

  const getQty = (productId: number) =>
    cart.find((i) => i.product.id === productId)?.quantity ?? 0

  const handleConfirm = async () => {
    for (const item of cart) {
      await addMutation.mutateAsync({
        playSessionId: session.id,
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.product.price,
      })
    }
    setCart([])
    setView('cart')
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCart([])
      setSearch('')
      setView(initialView)
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='flex max-h-[90vh] max-w-3xl flex-col gap-0 p-0'>
        <DialogHeader className='border-b px-5 py-4'>
          <DialogTitle className='flex items-center gap-2 text-base'>
            <ShoppingCart size={18} />
            Consumos — {session.childName}
          </DialogTitle>
        </DialogHeader>

        {/* Tab bar */}
        <div className='flex border-b'>
          <button
            type='button'
            onClick={() => setView('products')}
            className={cn(
              'flex-1 px-5 py-2.5 text-sm font-medium transition-colors',
              view === 'products'
                ? 'border-b-2 border-teal-600 text-teal-600'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Productos
          </button>
          <button
            type='button'
            onClick={() => setView('cart')}
            className={cn(
              'flex-1 px-5 py-2.5 text-sm font-medium transition-colors',
              view === 'cart'
                ? 'border-b-2 border-teal-600 text-teal-600'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Carrito
            {totalCount > 0 && (
              <span className='ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-600 px-1.5 text-xs font-semibold text-white'>
                {totalCount}
              </span>
            )}
          </button>
        </div>

        {/* Products view */}
        {view === 'products' && (
          <div className='flex flex-1 flex-col overflow-hidden'>
            {/* Search */}
            <div className='border-b px-4 py-3'>
              <div className='relative'>
                <Search
                  size={15}
                  className='absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground'
                />
                <Input
                  placeholder='Buscar producto...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className='h-9 pl-8'
                />
              </div>
            </div>

            {/* Product list grouped by category */}
            <div className='flex-1 overflow-y-auto px-4 py-3'>
              {Object.keys(byCategory).length === 0 ? (
                <p className='py-8 text-center text-sm text-muted-foreground'>
                  No se encontraron productos.
                </p>
              ) : (
                Object.entries(byCategory).map(([category, items]) => (
                  <div key={category} className='mb-5'>
                    <p className='mb-2 flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase'>
                      <span className='flex-1 border-t' />
                      {category}
                      <span className='flex-1 border-t' />
                    </p>
                    <div className='grid gap-2 sm:grid-cols-2'>
                      {items.map((p) => {
                        const qty = getQty(p.id)
                        const outOfStock = p.stock === 0
                        return (
                          <div
                            key={p.id}
                            className={cn(
                              'flex items-center gap-3 rounded-lg border p-3 transition-colors',
                              qty > 0 &&
                                'border-teal-300 bg-teal-50/50 dark:border-teal-700 dark:bg-teal-950/30',
                              outOfStock && 'opacity-50'
                            )}
                          >
                            <div className='min-w-0 flex-1'>
                              <p className='truncate text-sm leading-tight font-medium'>
                                {p.name}
                              </p>
                              <p className='text-xs text-muted-foreground'>
                                {formatCurrency(p.price)}
                                {p.stock > 0 && p.stock <= 5 && (
                                  <span className='ml-1 text-amber-500'>
                                    · {p.stock} en stock
                                  </span>
                                )}
                              </p>
                            </div>
                            <div className='flex shrink-0 items-center gap-1.5'>
                              <button
                                disabled={outOfStock || qty === 0}
                                onClick={() => setQty(p, qty - 1)}
                                className='flex h-7 w-7 items-center justify-center rounded-full border bg-background hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40'
                              >
                                <Minus size={12} />
                              </button>
                              <span className='w-5 text-center text-sm font-semibold tabular-nums'>
                                {qty || ''}
                              </span>
                              <button
                                disabled={
                                  outOfStock || (p.stock > 0 && qty >= p.stock)
                                }
                                onClick={() => setQty(p, qty + 1)}
                                className='flex h-7 w-7 items-center justify-center rounded-full border bg-background hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40'
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Confirm bar */}
            <div className='border-t px-4 py-3'>
              {cart.length > 0 ? (
                <div className='flex items-center gap-3'>
                  <div className='flex-1 text-sm'>
                    <span className='text-muted-foreground'>
                      {cart.length} producto{cart.length !== 1 ? 's' : ''}{' '}
                      ·{' '}
                    </span>
                    <span className='font-semibold text-teal-600 dark:text-teal-400'>
                      {formatCurrency(cartTotal)}
                    </span>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setCart([])}
                  >
                    Limpiar
                  </Button>
                  <Button
                    size='sm'
                    onClick={handleConfirm}
                    disabled={addMutation.isPending}
                  >
                    {addMutation.isPending ? 'Agregando...' : 'Confirmar'}
                  </Button>
                </div>
              ) : (
                <p className='text-center text-sm text-muted-foreground'>
                  Usa + para agregar productos al carrito
                </p>
              )}
            </div>
          </div>
        )}

        {/* Cart view */}
        {view === 'cart' && (
          <div className='flex flex-1 flex-col overflow-hidden'>
            <div className='flex-1 overflow-y-auto px-4 py-3'>
              {/* Pending cart */}
              {cart.length > 0 && (
                <div className='mb-4'>
                  <p className='mb-2 text-xs font-semibold tracking-wider text-amber-600 uppercase dark:text-amber-400'>
                    Pendiente de confirmar
                  </p>
                  <div className='flex flex-col gap-1.5'>
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className='flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/50 px-3 py-2 dark:border-amber-800 dark:bg-amber-950/20'
                      >
                        <span className='flex-1 text-sm font-medium'>
                          {item.product.name}
                        </span>
                        <Badge variant='secondary' className='text-xs'>
                          x{item.quantity}
                        </Badge>
                        <span className='font-mono text-xs'>
                          {formatCurrency(item.product.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => setQty(item.product, 0)}
                          className='text-muted-foreground hover:text-destructive'
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                    <div className='flex justify-end border-t pt-1.5'>
                      <span className='text-xs font-semibold text-amber-600 dark:text-amber-400'>
                        Subtotal pendiente: {formatCurrency(cartTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Registered consumptions */}
              {consumptions.length > 0 ? (
                <div>
                  <p className='mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase'>
                    Ya registrado
                  </p>
                  <div className='flex flex-col gap-1.5'>
                    {consumptions.map((c) => (
                      <div
                        key={c.id}
                        className='flex items-center gap-2 rounded-lg border px-3 py-2'
                      >
                        <span className='flex-1 text-sm'>{c.productName}</span>
                        <Badge variant='secondary' className='text-xs'>
                          x{c.quantity}
                        </Badge>
                        <span className='font-mono text-xs'>
                          {formatCurrency(c.subtotal)}
                        </span>
                        <button
                          onClick={() => removeMutation.mutate(c.id)}
                          className='text-muted-foreground hover:text-destructive'
                          disabled={removeMutation.isPending}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : cart.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-12 text-muted-foreground'>
                  <ShoppingCart size={36} className='mb-2 opacity-30' />
                  <p className='text-sm'>El carrito está vacío</p>
                </div>
              ) : null}
            </div>

            {/* Total summary */}
            <div className='border-t px-4 py-3'>
              <div className='flex flex-col gap-1 text-sm'>
                {consumptions.length > 0 && (
                  <div className='flex justify-between text-muted-foreground'>
                    <span>Registrado</span>
                    <span className='font-mono'>
                      {formatCurrency(consumptionsTotal)}
                    </span>
                  </div>
                )}
                {cart.length > 0 && (
                  <div className='flex justify-between text-amber-600 dark:text-amber-400'>
                    <span>Pendiente</span>
                    <span className='font-mono'>
                      {formatCurrency(cartTotal)}
                    </span>
                  </div>
                )}
                {(consumptions.length > 0 || cart.length > 0) && (
                  <div className='flex justify-between border-t pt-1 font-semibold'>
                    <span>Total consumos</span>
                    <span className='font-mono text-teal-600 dark:text-teal-400'>
                      {formatCurrency(consumptionsTotal + cartTotal)}
                    </span>
                  </div>
                )}
              </div>
              {cart.length > 0 && (
                <div className='mt-3 flex gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex-1'
                    onClick={() => setCart([])}
                  >
                    Limpiar pendientes
                  </Button>
                  <Button
                    size='sm'
                    className='flex-1'
                    onClick={handleConfirm}
                    disabled={addMutation.isPending}
                  >
                    {addMutation.isPending
                      ? 'Confirmando...'
                      : 'Confirmar pendientes'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
