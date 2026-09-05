import * as ticketDao from '../dao/tickets.dao.js';

export const createTicket = async (data) => {
    return await ticketDao.create(data);
};

export const findTicketById = async (id) => {
    return await ticketDao.findById(id);
};

export const findActiveTicket = async (userId, eventId) => {
    return await ticketDao.findOne({
        user: userId,
        event: eventId,
        status: { $in: ['confirmed', 'pending'] }
    });
};

export const findUserTickets = async (userId) => {
    return await ticketDao.findWithEvent({ user: userId });
};

export const findEventTickets = async (eventId) => {
    return await ticketDao.find({ event: eventId });
};

export const getReservedQuantity = async (eventId) => {
    return await ticketDao.getReservedQuantity(eventId);
};

export const saveTicket = async (ticket) => {
    return await ticketDao.save(ticket);
};