import { deleteCategory, getAllCategories, editCategory, createCategory } from "@/api/queries/category.queries";
import { ToastStyle } from "@/lib/toast.styles";
import { api_v1_data } from "@/types/api-response.types";
import { ICategory } from "@/types/entities/category.interface";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import useUserStore from "@/stores/user.store";
import CreateCategoryPopover from "@/components/create-category.popover";

const formSchema = z.object({
    name: z.string().min(1, "Name is required").refine(val => val.toLowerCase() !== "other", "Cannot edit 'other'. static category"),
});

export const Category = () => {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const userId = useUserStore(state => state._id)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
        mode: 'onTouched'
    });

    const { data, isLoading, error } = useQuery<api_v1_data<ICategory[]>, AxiosError<api_v1_data>>({
        queryKey: ["categories"],
        queryFn: getAllCategories,
        retry: false,
    });

    const { mutate: mutateDeleteCategory } = useMutation<api_v1_data<ICategory>, AxiosError<api_v1_data>, string>({
        mutationFn: deleteCategory,
        onSuccess(data, variables, context) {
            setCategories(prev => {
                return prev.filter(cat => cat._id !== data.body._id);
            });
            toast.success(data.message, {
                style: {
                    ...ToastStyle
                }
            });
        },
        onError(error, variables, context) {
            toast.error(error.response?.data.message, {
                style: {
                    ...ToastStyle
                }
            });
        },
    });

    const { mutate: mutateEditCategory, isPending } = useMutation<api_v1_data<ICategory>, AxiosError<api_v1_data>, { categoryId: string, name: string, user_id: string }>({
        mutationFn: editCategory,
        onSuccess(data, variables, context) {
            setCategories(prev => prev.map(cat => cat._id === data.body._id ? data.body : cat));

            toast.success(data.message, {
                style: {
                    ...ToastStyle
                }
            });
            form.reset();
            setIsEditing(false);
        },
        onError(error, variables, context) {
            toast.error(error.response?.data.message, {
                style: {
                    ...ToastStyle
                }
            });
        },
    });
  
    useEffect(() => {
        if (selectedCategory) {
            setSelectedCategory(categories.find(cat => cat._id === selectedCategory._id) || null);
        }
    }, [categories]);
    

    useEffect(() => {
        if (data?.body) {
            setCategories(data.body);
        }
        return () => setCategories([]);
    }, [data]);

    const handleCategoryDelete = (id: string, name: string) => {
        if (name.toLowerCase() === "other") {
            return toast.error("Cannot delete readonly category", {
                style: {
                    ...ToastStyle
                }
            });
        }
        mutateDeleteCategory(id);
    };

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (selectedCategory?.name === "other") {
            return form.setError("name", {
                message: "category 'other' is not editable"
            })
        }

        if (selectedCategory) {
            mutateEditCategory({ categoryId: selectedCategory._id, ...values, user_id: userId! });
        }
    };

    const { mutate: mutateCreateCategory, isPending: isCreating } = useMutation<api_v1_data<ICategory>, AxiosError<api_v1_data>, Pick<ICategory, "name" | "user_id">>({
        mutationFn: createCategory,
        onSuccess(data, variables, context) {
            setCategories(prev => [...prev, data.body]);
            toast.success(data.message, {
                style: {
                    ...ToastStyle
                }
            });
            form.reset();
        },
        onError(error, variables, context) {
            toast.error(error.response?.data.message, {
                style: {
                    ...ToastStyle
                }
            });
        },
    });

    const handleCreateCategory = (values: z.infer<typeof formSchema>) => {
        mutateCreateCategory({ ...values, user_id: userId! });
    };

    return (
        <div className="p-4 h-screen flex gap-4 bg-secondary">
            {/* Categories List */}
            <div className="w-2/4 p-4 flex flex-col bg-background">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-normal">Categories</h2>
                    
                    <CreateCategoryPopover setCategories={setCategories}/>
                </div>

                {/* Scrollable container */}
                <div className="flex-1 overflow-y-auto border-y p-2 scrollbar-thumb-only">
                    <ul className="space-y-4">
                        {categories.map((cat) => (
                            <li
                                key={cat._id || cat.name} // Ensure unique key with _id fallback
                                className={`p-3 flex text-center justify-between border-b mb-0 border-border/10 font-extralight text-sm cursor-pointer ${selectedCategory?._id === cat._id ? "bg-accent text-white" : "hover:bg-accent/20"
                                    }`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat.name}
                                <Trash2
                                    size={15}
                                    onClick={() => handleCategoryDelete(cat._id, cat.name)}
                                    className="text-secondary hover:text-red-600"
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Category Details */}
            <div className="flex-grow p-4">
                <h2 className="text-lg font-normal mb-4">Category Details</h2>
                <div className="space-y-3">
                    <div>
                        <p className="text-xs font-light text-center">Category Name</p>
                        <p className="p-2 border-b text-center">{selectedCategory?.name || "-"}</p>
                    </div>
                    <div>
                        <p className="text-xs font-light text-center">Budget</p>
                        <p className="p-2 border-b text-center">-</p>
                    </div>
                    <div>
                        <p className="text-xs font-light text-center">Description</p>
                        <p className="p-2 border-b text-center">-</p>
                    </div>
                </div>
                <div className="w-full mt-3">

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className="block ml-auto" >
                                <Button
                                    disabled={!selectedCategory}
                                    onClick={() => {
                                        !isEditing ?
                                            (
                                                form.clearErrors(),
                                                form.setValue("name", selectedCategory?.name || ""),
                                                setIsEditing(true)
                                            ) :
                                            (
                                                form.reset(),
                                                setIsEditing(false)
                                            )
                                    }}
                                >
                                    {!isEditing ? "Edit Category" : "Close edit"}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>select a category</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                {isEditing && (
                    <div className="mt-4 animate-in fade-in duration-300">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="space-y-4 p-4">
                                    <FormField
                                        name="name"
                                        control={form.control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor="name" className="mb-2 text-xs font-extralight text-muted">Name</FormLabel>
                                                <FormControl>
                                                    <Input id="name" type="text" placeholder="Category Name" {...field} />
                                                </FormControl>
                                                <FormMessage className="text-xs text-red-400" />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit">
                                        {isPending && <Loader2 className="animate-spin" />}
                                        Save Category
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                )}
            </div>
        </div>
    );
};
