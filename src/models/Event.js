import mongoose from 'mongoose';

const { Schema } = mongoose;

const EventSchema = new Schema(

    {

        title: {
            type: String,
            required: [true, 'El titulo es obligatorio'],
            trim: true
        },

        description: {
            type: String,
            required: [true, 'La descripcion es obligatoria'],
            trim: true
        },

        category: {
            type: String,
            required: [true, 'La categoria es obligatoria'],
            trim: true
        },

        date: {
            type: Date,
            required: [true, 'La fecha y hora del evento son obligatorias']
        },

        location: {
            type: String,
            required: [true, 'El lugar del evento es obligatorio.'],
            trim: true
        },

        capacity: {
            type: Number,
            required: true,
            min: [1, 'La capacidad debe ser al menos una persona'],
        },

        price: {
            type: Number,
            required: true,
            min: [0, 'El precio no puede ser un numero negativo']
        },

        status: {
            type: String,
            enum: [
                'draft',
                'published',
                'cancelled',
                'finished'
            ],
            default: 'draft',
            index: true
        },

        organizer: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            index: true
        },

    },
    {
        timestamps: true,
    }

);

export default mongoose.model('Event', EventSchema, 'events');