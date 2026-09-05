import mongoose from 'mongoose';

const { Schema } = mongoose;

const TicketSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['confirmed', 'pending', 'cancelled'],
        default: 'confirmed',
        index: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'La cantidad debe ser mayor a 0']
    },
    reservationCode: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    cancelledAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

TicketSchema.index({ user: 1, event: 1 });

export default mongoose.model('Ticket', TicketSchema, 'tickets');