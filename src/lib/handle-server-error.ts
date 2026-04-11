import { toast } from 'sonner'

export function handleServerError(error: unknown) {
  // biome-ignore lint/suspicious/noConsole: Required for debugging
  console.log(error)

  let errMsg = 'Something went wrong!'

  if (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    Number(error.status) === 204
  ) {
    errMsg = 'Content not found.'
  }

  if (error instanceof Error) {
    errMsg = error.message
  }

  toast.error(errMsg)
}
