import { getAllCategories } from "@/api/queries/category.queries";
import { DateRangePicker } from "@/components/date-range.picker";
import { CategorySelect } from "@/components/category.select";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { api_v1_data } from "@/types/api-response.types";
import { ICategory } from "@/types/entities/category.interface";
import { IExpense, paymentMethods } from "@/types/entities/expense.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { CalendarIcon, Loader2, PlusSquare, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { createExpense, deleteExpense, fetchInfiniteExpenses } from "@/api/queries/expense.queries";
import { toast } from "sonner";

const formSchema = z.object({
    amount: z.string().min(1, "required").transform((amount) => Number(amount)).refine(val => val > 0, "Amount must be greater than 0"),
    description: z.string().optional(),
    category: z.string({ required_error: "required" }),
    date: z.date({
        required_error: "required",
    }),
    payment_method: z.nativeEnum(paymentMethods, { required_error: "required" }),
});

export const Expense = () => {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const expensesRef = useRef<IExpense[]>([])
    const [expenses, setExpenses] = useState<IExpense[]>([])

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: "",
            date: new Date(),
            payment_method: paymentMethods.CASH,
        },
        mode: 'onTouched'
    });

    const { data: categoryData } = useQuery<api_v1_data<ICategory[]>, AxiosError<api_v1_data>>({
        queryKey: ["categories"],
        queryFn: getAllCategories,
        retry: false,
    });

    const { mutate: mutateCreateExpense, isPending } = useMutation<api_v1_data<IExpense>, AxiosError<api_v1_data<null>>, IExpense>({
        mutationFn: createExpense,
        onSuccess(data, variables, context) {
            toast.success(data.message, {
                style: {
                    border: "1px solid var(--border)",
                    borderRadius: "0px"
                }
            })
            form.reset();
            refetch()
            setModalOpen(false)
        },
        onError(error, variables, context) {
            toast.error(error.response?.data.message, {
                style: {
                    border: "1px solid var(--color-border)",
                    borderRadius: "0"
                }
            })

        },
    })

    const { mutate: mutateDeleteExpense, isPending: deleteIsPending } = useMutation<api_v1_data<IExpense>, AxiosError<api_v1_data<null>>, string>({
        mutationFn: deleteExpense,
        onSuccess(data, variables, context) {
            toast.success(data.message, {
                style: {
                    border: "1px solid var(--border)",
                    borderRadius: "0px"
                }
            })
            refetch()
        },
        onError(error, variables, context) {
            toast.error(error.response?.data.message, {
                style: {
                    border: "1px solid var(--color-border)",
                    borderRadius: "0"
                }
            })
        },
    })

    const { data: expense, isFetching, fetchNextPage, hasNextPage, error, refetch } = useInfiniteQuery({
        queryKey: ["expenses", selectedCategory?._id],
        queryFn: ({ pageParam }) => fetchInfiniteExpenses(pageParam, selectedCategory?._id),
        getNextPageParam: (lastPage) => lastPage.nextPageParam,
        initialPageParam: 1,
    });


    if (error) {
        // @ts-ignore
        toast.error(error.response.data.message, {
            style: {
                border: "1px solid var(--color-border)",
                borderRadius: "0"
            }
        });
    }

    useEffect(() => {
        if (expense?.pages) {
            expensesRef.current = expense.pages.flatMap((page) => page.expenses);
            setExpenses(expensesRef.current);
        }
    }, [expense?.pages])

    const selectCategory = useCallback((category: string | null) => {
        const selected = categories.find((cat) => cat._id === category) || null;
        setSelectedCategory(selected);

    }, [categories]);

    useEffect(() => {
        if (categoryData) {
            setCategories(categoryData.body);
        }

        return () => {
            setCategories([]);
        };
    }, [categoryData]);

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        mutateCreateExpense({
            user_id: "null",
            ...values
        })
    }

    return (
        <div className="p-4 h-screen flex flex-col bg-secondary">
            {/* Transactions Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-medium">Transactions</h3>
                <div className="flex gap-4 items-center">
                    <CategorySelect categories={categories} onSelect={selectCategory} className="bg-background min-w-52" />
                    {/* <DateRangePicker className="w-full overflow-clip" /> */}
                    <Sheet open={modalOpen} onOpenChange={setModalOpen}>
                        <SheetTrigger asChild>
                            <Button
                                className="gap-2 min-w-48 py-2"
                                onClick={() => setModalOpen(prev => {
                                    form.clearErrors();
                                    return !prev
                                })}
                            >
                                <PlusSquare className="h-5 w-5" />
                                Add Expense
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="right" className="">
                            <SheetHeader>
                                <SheetTitle>Add Expense</SheetTitle>
                                <SheetDescription>Fill in the details to add a new expense.</SheetDescription>
                            </SheetHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <div className="space-y-4 p-4">

                                        <FormField
                                            name="amount"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem >
                                                    <FormLabel htmlFor="amount" className="mb-2 text-xs font-extralight text-muted">Amount</FormLabel>
                                                    <FormControl>
                                                        <Input id="amount" type="number" placeholder="120" {...field} />
                                                    </FormControl>
                                                    <FormMessage className="text-xs text-destructive" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="description"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem >
                                                    <FormLabel htmlFor="description" className="mb-2 text-xs font-extralight text-muted">Description</FormLabel>
                                                    <FormControl>
                                                        <Input id="description" type="text" placeholder="..." {...field} />
                                                    </FormControl>
                                                    <FormMessage className="text-xs text-destructive" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="category"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel htmlFor="category" className="mb-2 text-xs font-extralight text-muted">Category</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className=''>
                                                                <SelectValue placeholder="select category" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>

                                                            {
                                                                categories.map(cat => {
                                                                    return <SelectItem value={cat._id} key={cat._id}>
                                                                        {cat.name}
                                                                    </SelectItem>
                                                                })
                                                            }
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage className="text-xs text-destructive" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="date"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Date</FormLabel>
                                                    <Popover>
                                                        <PopoverTrigger>
                                                            <FormControl>
                                                                <Button
                                                                    variant="outline"
                                                                    className={cn(
                                                                        "w-full text-left font-normal self-start",
                                                                        !field.value && "text-muted-foreground"
                                                                    )}
                                                                >
                                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                </Button>
                                                            </FormControl>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={field.value}
                                                                onSelect={field.onChange}
                                                                disabled={(date) => date > new Date()}
                                                                initialFocus
                                                                className="bg-background border"
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            name="payment_method"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem >
                                                    <FormLabel htmlFor="payment_method" className="mb-2 text-xs font-extralight text-muted">Payment Method</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className=''>
                                                                <SelectValue placeholder="select payment method" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {Object.values(paymentMethods).map((method) => (
                                                                <SelectItem value={method} key={method}>
                                                                    {method.split("_").join(" ")}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage className="text-xs text-destructive" />
                                                </FormItem>
                                            )}
                                        />

                                        <SheetFooter className="p-0">
                                            <Button type="submit">
                                                {isPending && <Loader2 className="animate-spin" />}
                                                Save Expense
                                            </Button>
                                        </SheetFooter>
                                    </div>
                                </form>
                            </Form>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Content */}
            <div className="flex gap-4 flex-1">
                {/* Transactions List */}
                <div className="w-full bg-background p-4 rounded-lg shadow">
                    <div className="overflow-y-auto max-h-[80vh] scrollbar-thumb-only">
                        <ul className="space-y-2">
                            {
                                expenses.map((expense, i) => (
                                    <li key={expense._id} className="p-2 border-b border-border/10 flex justify-between">
                                        <span>{format(expense.date, "dd-MMM-yy")}</span>
                                        <span className="min-w-56">{expense.payment_method}</span>
                                        <span className="min-w-56">{categories.filter(cat => cat._id === expense.category)[0].name}</span>
                                        <span className="text-red-500 cursor-pointer" onClick={() => mutateDeleteExpense(expense._id!)}>
                                            <Trash2 />
                                        </span>
                                        <span className="text-red-500 min-w-20"> &#8377; {expense.amount}</span>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
