import { deleteCategory, getAllCategories } from "@/api/queries/category.queries";
import { ToastStyle } from "@/lib/toast.styles";
import { api_v1_data } from "@/types/api-response.types";
import { ICategory } from "@/types/entities/category.interface";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Category = () => {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

    const { data, isLoading, error } = useQuery<api_v1_data<ICategory[]>, AxiosError<api_v1_data>>({
        queryKey: ["categories"],
        queryFn: getAllCategories,
        retry: false,
    });

    const { mutate: mutateDeleteCategory, } = useMutation<api_v1_data<ICategory>, AxiosError<api_v1_data>, string>({
        mutationFn: deleteCategory,
        onSuccess(data, variables, context) {
            setCategories(prev => {
                return prev.filter(cat => cat._id !== data.body._id);
            })
            toast.success(data.message, {
                style: {
                    ...ToastStyle
                }
            })
        },
        onError(error, variables, context) {
            toast.error(error.response?.data.message, {
                style: {
                    ...ToastStyle
                }
            })
        },
    })

    useEffect(() => {
        if (data?.body) {
            setCategories(data.body);
        }
        return () => setCategories([]);
    }, [data]);

    const handleCategoryDelete = (id:string, name:string)=>{
        if(name === "other"){
            return toast.error("cannot delete readonly category",{
                style:{
                    ...ToastStyle
                }
            })
        }

        mutateDeleteCategory(id)
    }

    return (
        <div className="p-4 h-screen flex gap-4 bg-secondary">
            {/* Categories List */}
            <div className="w-2/4 p-4 flex flex-col bg-background">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-normal">Categories</h2>
                </div>

                {/* Scrollable container */}
                <div className="flex-1 overflow-y-auto border-y p-2 scrollbar-thumb-only">
                    <ul className="space-y-4">
                        {categories.map((cat) => (
                            <>
                                <li
                                    key={cat._id || cat.name} // Ensure unique key with _id fallback
                                    className={`p-3 flex text-center justify-between border-b mb-0 border-border/10 font-extralight text-sm cursor-pointer ${selectedCategory?._id === cat._id ? "bg-accent text-white" : "hover:bg-accent/20"
                                        }`}
                                    onClick={() => setSelectedCategory(cat)}
                                >
                                    {cat.name}
                                    <Trash2
                                        size={15}
                                        onClick={()=>handleCategoryDelete(cat._id, cat.name)}
                                        className="text-secondary hover:text-red-600"
                                    />
                                </li>
                            </>
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
            </div>
        </div>
    );
};
