import React from "react";
import { useMutation } from "@tanstack/react-query";
import { createCategory } from "@/api/queries/category.queries";
import { ICategory } from "@/types/entities/category.interface";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { api_v1_data } from "@/types/api-response.types";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { ToastStyle } from "@/lib/toast.styles";
import useUserStore from "@/stores/user.store";
import { Button } from "@/components/ui/button";
import { Label } from "./ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface CreateCategoryPopoverProps {
    setCategories: React.Dispatch<React.SetStateAction<ICategory[]>>;
}

// ✅ Define form validation schema using `zod`
const formSchema = z.object({
    name: z.string().min(1, "Category name is required"),
});

const CreateCategoryPopover: React.FC<CreateCategoryPopoverProps> = ({ setCategories }) => {
    const userId = useUserStore(state => state._id);

    // ✅ React Hook Form
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    // ✅ Mutation for category creation
    const createCategoryMutation = useMutation<api_v1_data<ICategory>, AxiosError<api_v1_data>, Pick<ICategory, "name" | "user_id">>({
        mutationFn: createCategory,
        onSuccess: (data) => {
            setCategories((prev) => [...prev, data.body]);
            toast.success("Category created successfully!", { style: ToastStyle });
            form.reset();
        },
        onError: (error) => {
            toast.error(error.response?.data.message || "Failed to create category.", { style: ToastStyle });
        },
    });

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        createCategoryMutation.mutate({ name: values.name, user_id: userId! });
    };

    return (
        <Popover>
            <PopoverTrigger>
                <Button>Create Category</Button>
            </PopoverTrigger>
            <PopoverContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <Label htmlFor="name">Name</Label>
                                    <FormControl>
                                        <Input type="text" id="name" placeholder="Category Name" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-xs text-destructive"/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={createCategoryMutation.isPending}>
                            {createCategoryMutation.isPending ? "Creating..." : "Create"}
                        </Button>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
    );
};

export default CreateCategoryPopover;
