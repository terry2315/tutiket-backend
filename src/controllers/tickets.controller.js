import * as ticketService from '../services/tickets.services.js';

const handleError = (res, error) => {
    return res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.statusCode
            ? error.message
            : 'Error interno del servidor'
    });
};

export const createTicket = async (req, res) => {
    try {
        const ticket = await ticketService.createTicket(
            req.params.eid,
            req.body.quantity,
            req.user
        );

        return res.status(201).json({
            status: 'success',
            payload: ticket
        });
    } catch (error) {
        return handleError(res, error);
    }
};

export const getMyTickets = async (req, res) => {
    try {
        const tickets = await ticketService.getMyTickets(req.user.id);

        return res.status(200).json({
            status: 'success',
            payload: tickets
        });
    } catch (error) {
        return handleError(res, error);
    }
};

export const getEventTickets = async (req, res) => {
    try {
        const tickets = await ticketService.getEventTickets(
            req.params.eid,
            req.user
        );

        return res.status(200).json({
            status: 'success',
            payload: tickets
        });
    } catch (error) {
        return handleError(res, error);
    }
};

export const cancelTicket = async (req, res) => {
    try {
        const ticket = await ticketService.cancelTicket(
            req.params.tid,
            req.user
        );

        return res.status(200).json({
            status: 'success',
            payload: ticket
        });
    } catch (error) {
        return handleError(res, error);
    }
};