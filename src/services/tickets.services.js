import mongoose from 'mongoose';
import { randomUUID } from 'crypto';
import { sendTicketConfirmation } from './mail.services.js';

import * as ticketRepository from '../repositories/tickets.repositories.js';
import * as eventRepository from '../repositories/events.repository.js';
import { createError } from '../utils/app.error.js';

const validateId = (id, entity = 'recurso') => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createError(`ID de ${entity} inválido`, 400);
    }
};

const validateQuantity = (quantity) => {
    if (!Number.isInteger(quantity) || quantity <= 0) {
        throw createError('La cantidad debe ser un número mayor a 0', 400);
    }
};

const getEvent = async (eventId) => {
    validateId(eventId, 'evento');

    const event = await eventRepository.findEventById(eventId);

    if (!event) {
        throw createError('Evento no encontrado', 404);
    }

    return event;
};

export const createTicket = async (eventId, quantity, user) => {
    validateQuantity(quantity);

    const event = await getEvent(eventId);

    if (event.status !== 'published') {
        throw createError(
            'El evento no está disponible para inscripciones',
            400
        );
    }

    const existingTicket = await ticketRepository.findActiveTicket(
        user.id,
        eventId
    );

    if (existingTicket) {
        throw createError(
            'Ya tenés una inscripción activa para este evento',
            409
        );
    }

    const reservedQuantity =
        await ticketRepository.getReservedQuantity(eventId);

    const availableCapacity = event.capacity - reservedQuantity;

    if (availableCapacity < quantity) {
        throw createError(
            `Cupos insuficientes. Disponibles: ${availableCapacity}`,
            400
        );
    }

    const ticket = await ticketRepository.createTicket({
        user: user.id,
        event: eventId,
        quantity,
        status: 'confirmed',
        reservationCode: `TKT-${randomUUID()}`
    });

    await sendTicketConfirmation({
        to: user.email,
        event,
        ticket
    });

    return ticket;
};

export const getMyTickets = async (userId) => {
    return await ticketRepository.findUserTickets(userId);
};

export const getEventTickets = async (eventId, user) => {
    const event = await getEvent(eventId);

    if (
        user.role !== 'admin' &&
        event.organizer.toString() !== user.id.toString()
    ) {
        throw createError(
            'No tenés permisos para consultar los tickets de este evento',
            403
        );
    }

    return await ticketRepository.findEventTickets(eventId);
};

export const cancelTicket = async (ticketId, user) => {
    validateId(ticketId, 'ticket');

    const ticket = await ticketRepository.findTicketById(ticketId);

    if (!ticket) {
        throw createError('Ticket no encontrado', 404);
    }

    if (
        user.role !== 'admin' &&
        ticket.user.toString() !== user.id.toString()
    ) {
        throw createError(
            'No tenés permisos para cancelar este ticket',
            403
        );
    }

    if (ticket.status === 'cancelled') {
        throw createError('El ticket ya está cancelado', 400);
    }

    ticket.status = 'cancelled';
    ticket.cancelledAt = new Date();

    return await ticketRepository.saveTicket(ticket);
};