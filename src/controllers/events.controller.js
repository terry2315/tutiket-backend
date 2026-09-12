import * as eventService from '../services/events.services.js';

import {
    toEventDTO,
    toPaginatedEventsDTO
} from '../dto/event.dto.js';

export const getEvents = async (req, res, next) => {
    try {
        const result = await eventService.getEvents(req.query);

        return res.status(200).json(
            toPaginatedEventsDTO(result)
        );
    } catch (error) {
        next(error);
    }
};

export const getEventById = async (req, res, next) => {
    try {
        const event = await eventService.getEventById(
            req.params.id
        );

        return res.status(200).json({
            status: 'success',
            payload: toEventDTO(event)
        });
    } catch (error) {
        next(error);
    }
};

export const createEvent = async (req, res, next) => {
    try {
        const event = await eventService.createEvent(
            req.body,
            req.user
        );

        return res.status(201).json({
            status: 'success',
            payload: toEventDTO(event)
        });
    } catch (error) {
        next(error);
    }
};

export const updateEvent = async (req, res, next) => {
    try {
        const event = await eventService.updateEvent(
            req.params.id,
            req.body,
            req.user
        );

        return res.status(200).json({
            status: 'success',
            payload: toEventDTO(event)
        });
    } catch (error) {
        next(error);
    }
};

export const changeEventStatus = async (req, res, next) => {
    try {
        const event = await eventService.changeEventStatus(
            req.params.id,
            req.body.status,
            req.user
        );

        return res.status(200).json({
            status: 'success',
            payload: toEventDTO(event)
        });
    } catch (error) {
        next(error);
    }
};