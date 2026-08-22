import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema(

    {
        first_name: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true,
            minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
            maxlength: [50, 'El nombre no puede superar los 50 caracteres']
        },

        last_name: {
            type: String,
            required: true,
            trim: true,
            minlength: [2, 'El apellido debe tenner al menos 2 caracteres'],
            maxlength: [50, 'El apellido no puede superar los 50 caracteres'],
        },

        email: {
            type: String,
            required: [true, 'El email es obligatorio'],
            trim: true,
            unique: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                'El email no tiene el formato valido'
            ]
        },

        password: {
            type: String,
            required: true,
            select: false
        },

        role: {
            type: String,
            enum: ['user', 'organizer', 'admin'],
            default: 'user'
        }
    }

);

export default mongoose.model('User', UserSchema, 'users');