import mongoose from 'mongoose';
import Ticket from '../models/Ticket.js';

export const create = async (data) => {
    return await Ticket.create(data);
};

export const findById = async (id) => {
    return await Ticket.findById(id);
};

export const findOne = async (filter) => {
    return await Ticket.findOne(filter);
};

export const find = async (filter) => {
    return await Ticket.find(filter);
};

export const findWithEvent = async (filter) => {
    return await Ticket.find(filter)
        .populate('event', 'title date location');
};

export const getReservedQuantity = async (eventId) => {
    const result = await Ticket.aggregate([
        {
            $match: {
                event: new mongoose.Types.ObjectId(eventId),
                status: { $in: ['confirmed', 'pending'] }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$quantity' }
            }
        }
    ]);

    return result[0]?.total || 0;
};

export const save = async (ticket) => {
    return await ticket.save();
};