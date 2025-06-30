import { Gamepad, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useCallback } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import api from "@/core/api";
import { toast } from "sonner";

interface ResponseErrorData {
  email?: string;
  username?: string;
}

const signUpFormSchema = z
  .object({
    email: z.string().email(),
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    },
  );

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();

  const signUpForm = useForm({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "m@example.com",
      username: "nikita",
      password: "password123",
      confirmPassword: "password123",
    },
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof signUpFormSchema>) => {
      api
        .signUp({
          email: values.email,
          username: values.username,
          password: values.password,
        })
        .then(() => {
          toast.success("SignUp success", {
            description: "Registration complete, start play!",
          });
          navigate("/");
        })
        .catch(
          (error: {
            response: {
              data: ResponseErrorData;
            };
          }) => {
            if (error.response.data.email) {
              signUpForm.setError("email", {
                message: error.response.data.email as string,
              });
            }

            if (error.response.data.username) {
              signUpForm.setError("username", {
                message: error.response.data.username as string,
              });
            }
          },
        );
    },
    [signUpForm, navigate],
  );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...signUpForm}>
        <form onSubmit={signUpForm.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-md">
                <Gamepad className="size-6" />
              </div>

              <h1 className="text-xl font-bold">The last of guss game.</h1>
              <div className="text-center text-sm">
                Enter your email below to create your account
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <FormField
                control={signUpForm.control}
                name="email"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={signUpForm.control}
                name="username"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={signUpForm.control}
                name="password"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input placeholder="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={signUpForm.control}
                rules={{ required: true }}
                name="confirmPassword"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <Input placeholder="confirmPassword" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <Button type="submit" className="w-full">
                SignUp
              </Button>
            </div>
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-background text-muted-foreground relative z-10 px-2">
                Or
              </span>
            </div>
            <div className="grid gap-4">
              <Link to={"/login"}>
                <Button variant="outline" type="button" className="w-full">
                  <User />
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </form>
      </Form>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
