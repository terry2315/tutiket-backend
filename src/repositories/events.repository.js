import * as eventDao from '../dao/events.dao.js';

export const createEvent = async (data) => {
    return await eventDao.create(data);
};

export const findEventById = async (id) => {
    return await eventDao.findById(id);
};

export const findEvents = async (filter, options) => {
    return await eventDao.find(filter, options);
};

export const countEvents = async (filter) => {
    return await eventDao.count(filter);
};

export const saveEvent = async (event) => {
    return await eventDao.save(event);
};