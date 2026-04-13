import { AuthLayout } from '../../layout/auth-layout'
import { Gamepad2 } from 'lucide-react'
import { Link, useSearch } from '@tanstack/react-router'
import { UserAuthForm } from './components/user-auth-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@boilerplate/ui'

export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })

  return (
    <AuthLayout>
      <Card className='gap-4 border-2 shadow-xl'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-3 flex size-16 items-center justify-center rounded-full bg-linear-to-br from-teal-400 to-teal-600 shadow-lg'>
            <Gamepad2 className='size-8 text-white' />
          </div>
          <CardTitle className='text-2xl tracking-tight'>
            ¡Bienvenido de vuelta! 🎈
          </CardTitle>
          <CardDescription className='text-base'>
            Ingresa tus credenciales para administrar el centro de juegos
          </CardDescription>
        </CardHeader>
        <CardContent className='px-6'>
          <UserAuthForm redirectTo={redirect} />
        </CardContent>
        <CardFooter>
          <Link
            to='/forgot-password'
            className='mx-auto text-sm text-muted-foreground underline-offset-4 hover:text-teal-600 hover:underline'
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
