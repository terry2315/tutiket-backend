import User from '../models/User.js';

export const findOne = async (filter) => {
    return await User.findOne(filter);
};

export const findOneWithPassword = async (filter) => {
    return await User.findOne(filter).select('+password');
};

export const findAll = async () => {
    return await User.find();
};

export const create = async (data) => {
    return await User.create(data);
};