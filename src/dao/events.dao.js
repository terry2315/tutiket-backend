import Event from '../models/Event.js';

export const create = async (data) => {
    return await Event.create(data);
};

export const findById = async (id) => {
    return await Event.findById(id);
};

export const find = async (
    filter,
    {
        skip = 0,
        limit = 10,
        sort = { date: 1 }
    } = {}
) => {
    return await Event.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit);
};

export const count = async (filter) => {
    return await Event.countDocuments(filter);
};

export const save = async (event) => {
    return await event.save();
};