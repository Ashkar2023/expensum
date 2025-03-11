import { Schema, model } from 'mongoose';
import { ICategory } from '../../shared/types/entities/category.interface.js';

const CategorySchema = new Schema<ICategory>({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        index: 1
    },
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    readonly: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});


CategorySchema.index({ user_id: 1, name: 1 }, { unique: true });

// make a compound index if on admin side, and wants to search for top categories

const CategoryModel = model<ICategory>('Category', CategorySchema, "categories");

export default CategoryModel;