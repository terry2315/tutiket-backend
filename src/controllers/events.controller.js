import * as eventService from '../services/events.services.js';

const handleError = (res, error) => {
    return res.status(error.statusCode || 500).json({
        status: 'error',
        message: error.statusCode ? error.message : 'Error interno del servidor'
    });
};

export const getEvents = async (req, res) => {
    try {
        const result = await eventService.getEvents(req.query);
        return res.status(200).json(result);
    } catch (error) {
        return handleError(res, error);
    }
};

export const getEventById = async (req, res) => {
    try {
        const event = await eventService.getEventById(req.params.id);
        return res.status(200).json({ status: 'success', payload: event });
    } catch (error) {
        return handleError(res, error);
    }
};

export const createEvent = async (req, res) => {
    try {
        const event = await eventService.createEvent(req.body, req.user);
        return res.status(201).json({ status: 'success', payload: event });
    } catch (error) {
        return handleError(res, error);
    }
};

export const updateEvent = async (req, res) => {
    try {
        const event = await eventService.updateEvent(req.params.id, req.body, req.user);
        return res.status(200).json({ status: 'success', payload: event });
    } catch (error) {
        return handleError(res, error);
    }
};

export const changeEventStatus = async (req, res) => {
    try {
        const event = await eventService.changeEventStatus(
            req.params.id,
            req.body.status,
            req.user
        );

        return res.status(200).json({ status: 'success', payload: event });
    } catch (error) {
        return handleError(res, error);
    }
};