import { Schema, model, Document } from 'mongoose';
import { IUser } from '../../shared/types/entities/user.interface';

// Define the User type


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
    }
}, {
    timestamps: true
});

// Create the User model
const UserModel = model<IUser>('User', userSchema, "users");

export default UserModel;