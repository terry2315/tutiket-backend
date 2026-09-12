import * as ticketService from '../services/tickets.services.js';

import {
    toTicketDTO,
    toTicketsDTO
} from '../dto/ticket.dto.js';

export const createTicket = async (req, res, next) => {
    try {
        const ticket = await ticketService.createTicket(
            req.params.eid,
            req.body.quantity,
            req.user
        );

        return res.status(201).json({
            status: 'success',
            payload: toTicketDTO(ticket)
        });
    } catch (error) {
        next(error);
    }
};

export const getMyTickets = async (req, res, next) => {
    try {
        const tickets = await ticketService.getMyTickets(
            req.user.id
        );

        return res.status(200).json({
            status: 'success',
            payload: toTicketsDTO(tickets)
        });
    } catch (error) {
        next(error);
    }
};

export const getEventTickets = async (req, res, next) => {
    try {
        const tickets = await ticketService.getEventTickets(
            req.params.eid,
            req.user
        );

        return res.status(200).json({
            status: 'success',
            payload: toTicketsDTO(tickets)
        });
    } catch (error) {
        next(error);
    }
};

export const cancelTicket = async (req, res, next) => {
    try {
        const ticket = await ticketService.cancelTicket(
            req.params.tid,
            req.user
        );

        return res.status(200).json({
            status: 'success',
            payload: toTicketDTO(ticket)
        });
    } catch (error) {
        next(error);
    }
};