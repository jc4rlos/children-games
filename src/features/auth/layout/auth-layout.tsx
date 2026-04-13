import type { FC, PropsWithChildren } from 'react'
import { Baby, Gamepad2, Star, Trees } from 'lucide-react'
import { Logo } from '@/assets/logo'

const decorations = [
  { Icon: Baby, className: 'top-12 left-8 text-teal-300/30 size-10' },
  { Icon: Gamepad2, className: 'top-20 right-16 text-teal-300/25 size-12' },
  { Icon: Star, className: 'bottom-32 left-16 text-yellow-300/30 size-8' },
  { Icon: Trees, className: 'bottom-20 right-12 text-teal-300/25 size-10' },
  { Icon: Star, className: 'top-1/3 left-1/4 text-pink-300/20 size-6' },
  { Icon: Baby, className: 'top-1/2 right-1/4 text-purple-300/20 size-8' },
]

export const AuthLayout: FC<PropsWithChildren> = ({ children }) => (
  <div className='relative grid h-svh overflow-hidden'>
    {/* Decorative background */}
    <div className='absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-teal-50'>
      <div
        className='absolute inset-0 opacity-[0.03]'
        style={{
          backgroundImage:
            'radial-gradient(circle, rgb(20 184 166) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {decorations.map(({ Icon, className }, i) => (
        <Icon
          key={i}
          className={`absolute rotate-12 ${className}`}
          strokeWidth={1.5}
        />
      ))}
    </div>

    {/* Content */}
    <div className='relative z-10 flex items-center justify-center px-2'>
      <div className='mx-auto flex w-full max-w-sm flex-col justify-center space-y-2 py-8 sm:w-[28rem]'>
        <div className='mb-2 flex items-center justify-center gap-3'>
          <Logo className='size-10' />
          <h1 className='text-xl font-semibold tracking-tight text-teal-700'>
            Children Games
          </h1>
        </div>
        {children}
      </div>
    </div>
  </div>
)
