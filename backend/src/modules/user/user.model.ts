import { Model, Schema, model } from 'mongoose';
import { IUser } from '../../shared/types/entities/user.interface.js';

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        trim:true
    }
}, {
    timestamps: true
});

export const userModel: Model<IUser> = model<IUser>("User", userSchema, "users")