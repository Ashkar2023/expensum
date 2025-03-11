import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ICategory } from "@/types/entities/category.interface"

interface CategorySelectProps {
    categories: ICategory[]
    onSelect: (categoryId: string | null) => void
    disableCategoryAll?: boolean
    className?: string,
}

export function CategorySelect({ categories, onSelect, className, disableCategoryAll = false }: CategorySelectProps) {
    return (
        <Select onValueChange={(value) => onSelect(value === "all" ? null : value)} defaultValue={disableCategoryAll ? undefined : "all"  }>
            <SelectTrigger className={className}>
                <SelectValue placeholder="select category" />
            </SelectTrigger>
            <SelectContent>
                {
                    disableCategoryAll ?
                        null :
                        <SelectItem value="all">
                            All
                        </SelectItem>
                }
                {
                    categories.map(cat => {
                        return <SelectItem value={cat._id} key={cat._id}>
                            {cat.name}
                        </SelectItem>
                    })
                }
            </SelectContent>
        </Select>
    )
}