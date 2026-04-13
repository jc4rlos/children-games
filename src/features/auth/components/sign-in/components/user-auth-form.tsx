import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@boilerplate/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { PasswordInput } from "@/components/password-input";
import { cn } from "@/lib/utils";
import { useSignIn } from "../hooks/useSignIn";
import { type FormValues, formSchema } from "./user-auth-form.schema";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string;
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const { isLoading, signIn } = useSignIn({ redirectTo });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(signIn)}
        className={cn("grid gap-4", className)}
        {...props}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Correo electrónico</FormLabel>
              <FormControl>
                <Input
                  placeholder="tu@email.com"
                  type="email"
                  autoComplete="email"
                  className="h-11 rounded-lg"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-medium">Contraseña</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="h-11 rounded-lg"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="mt-2 h-12 gap-2 rounded-lg bg-linear-to-r from-teal-500 to-teal-600 text-base font-semibold text-white shadow-md transition-all hover:from-teal-600 hover:to-teal-700 hover:shadow-lg disabled:opacity-70"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <>
              <LogIn className="size-5" />
              Ingresar al sistema
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
