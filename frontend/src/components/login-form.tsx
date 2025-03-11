import { Loader2, ReceiptIndianRupee } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { useMutation } from "@tanstack/react-query"
import { loginUser, signupUser } from "@/api/queries/user.queries"
import useUserStore from "@/stores/user.store"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { toast } from "sonner"
import { api_v1_data } from "@/types/api-response.types"
import { IUser } from "@/types/entities/user.interface"
import { AxiosError } from "axios"

const loginSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

const signupSchema = loginSchema
    .extend({
        confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    })

// login component
export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
    const [login, setLogin] = useState(true);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const setUser = useUserStore(state => state.setUser);
    const navigate = useNavigate()

    const { mutate, isPending } = useMutation<api_v1_data<IUser>, AxiosError<api_v1_data>, z.infer<typeof loginSchema | typeof signupSchema>>({
        mutationKey: [login ? "login" : "signup"],
        mutationFn: login ? loginUser : signupUser,
        onSuccess(data, variables, context) {
            setUser({ ...data.body });
        },
        onError(error) {
            toast.error(error.response?.data.message ?? "Internal server error", {
                style: {
                    border: "0.1px solid var(--color-border)",
                    borderRadius: "0"
                }
            })
        },
        retry: false,
    })


    const form = useForm<z.infer<typeof loginSchema> | z.infer<typeof signupSchema>>({
        resolver: zodResolver(login ? loginSchema : signupSchema),
        defaultValues: {
            email: "",
            password: "",
            ...(login ? {} : { confirmPassword: "" }),
        },
        mode: "onTouched"
    })

    function onSubmit(values: z.infer<typeof loginSchema> | z.infer<typeof signupSchema>) {
        mutate(values)
    }

    useEffect(() => {
        let timer = setTimeout(() => {
            form.reset()
        }, 350)

        const visibilityTimer = setTimeout(
            () => {
                setShowConfirmPassword(!login)
            },
            login ? 300 : 0,
        )

        return () => {
            clearTimeout(timer)
            clearTimeout(visibilityTimer)
        }
    }, [login])

    return (
        <div className={cn("flex flex-col gap-6", className, "min-w-[350px]")} {...props}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} noValidate >
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col items-center gap-2">
                            <a
                                href="#"
                                className="flex flex-col items-center gap-2 font-medium"
                            >
                                <div className="flex items-center justify-center rounded-md">
                                    <ReceiptIndianRupee className="text-brand" size={"4rem"} />
                                </div>
                                <span className="sr-only">Expensum.</span>
                            </a>
                            <h1 className="text-2xl font-extrabold jetbrains-mono text-center"><span className="font-light text-xl">Welcome to </span><br />Expensum.</h1>
                        </div>
                        <div className="flex flex-col gap-5">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="grid gap-2">
                                        <FormLabel htmlFor="email">Email</FormLabel>
                                        <FormControl>
                                            <Input id="email" type="email" placeholder="m@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-xs text-destructive" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="grid gap-2">
                                        <FormLabel htmlFor="password">Password</FormLabel>
                                        <FormControl>
                                            <Input id="password" type="password" placeholder="********" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-xs text-destructive" />
                                    </FormItem>
                                )}
                            />
                            <div
                                className="overflow-x-visible transition-[max-height] duration-300 ease-in-out"
                                style={{ maxHeight: login ? "0px" : "100px" }}
                            >
                                <div className={cn(
                                    "flex flex-col gap-3 transition-all duration-300 ease-in-out",
                                    login ? "opacity-0 -translate-y-3" : "opacity-100 translate-y-0"
                                )}>
                                    {showConfirmPassword && (
                                        <FormField
                                            control={form.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem className="grid gap-2">
                                                    <FormLabel htmlFor="confirmPassword">Re-Enter Password</FormLabel>
                                                    <FormControl>
                                                        <Input id="confirmPassword" type="password" placeholder="********" {...field} />
                                                    </FormControl>
                                                    <FormMessage className="text-xs text-destructive" />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button type="submit"
                                className="w-full "
                                disabled={isPending}
                            >
                                {isPending && <Loader2 className="animate-spin" />}
                                {login ? "Login" : "Signup"}
                            </Button>
                        </div>

                        {/* Auth type Switch */}
                        <div className="text-center text-xs opacity-40">
                            {
                                login ?
                                    "Don't have an account? " :
                                    "Already have an account? "
                            }
                            <span
                                onClick={() => setLogin(prev => !prev)}
                                className="cursor-pointer underline underline-offset-4"
                            >
                                {
                                    login ? "signup" : "login"
                                }
                            </span>
                        </div>
                        {/* <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                        <span className="bg-background text-muted-foreground relative z-10 px-2">
                            Or
                        </span>
                    </div> */}
                        {/* <div className="grid gap-4 sm:grid-cols-2">
                        <Button variant="outline" type="button" className="w-full">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path
                                    d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                                    fill="currentColor"
                                />
                            </svg>
                            Continue with Apple
                        </Button>
                        <Button variant="outline" type="button" className="w-full">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path
                                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                    fill="currentColor"
                                />
                            </svg>
                            Continue with Google
                        </Button>
                    </div> */}
                    </div>
                </form >
            </Form>

            {/* <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue,<br /> you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </div> */}
        </div >
    )
}
