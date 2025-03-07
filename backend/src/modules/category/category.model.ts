import { Schema, model, Document } from 'mongoose';
import { ICategory } from '../../shared/types/entities/category.interface';

const CategorySchema = new Schema<ICategory>({
    user_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    readonly: {
        type: Boolean,
        required: true
    }
});

CategorySchema.index({ user_id: 1 });

// make a compound index if on admin side, and wants to search for top categories

const Category = model<ICategory>('Category', CategorySchema);

export default Category;