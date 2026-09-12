import mongoose from 'mongoose';
import * as eventRepository from '../repositories/events.repository.js';
import { createError } from '../utils/app.error.js';

const VALID_STATUS = ['draft', 'published', 'cancelled', 'finished'];

const validateEventId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createError('ID de evento inválido', 400);
    }
};

const validateCapacity = (capacity) => {
    if (capacity !== undefined && Number(capacity) <= 0) {
        throw createError('La capacidad debe ser mayor a 0', 400);
    }
};

const validatePrice = (price) => {
    if (price !== undefined && Number(price) < 0) {
        throw createError('El precio no puede ser negativo', 400);
    }
};

const validateFutureDate = (date) => {
    const eventDate = new Date(date);

    if (Number.isNaN(eventDate.getTime()) || eventDate <= new Date()) {
        throw createError('La fecha del evento debe ser futura', 400);
    }
};

const validateOwnership = (event, user) => {
    if (user.role === 'admin') return;

    const isOwner = event.organizer.toString() === user.id.toString();

    if (!isOwner) {
        throw createError('No tenés permisos para modificar este evento', 403);
    }
};

export const createEvent = async (data, user) => {
    const {
        title,
        description,
        category,
        date,
        location,
        capacity,
        price
    } = data;

    if (
        !title ||
        !description ||
        !category ||
        !date ||
        !location ||
        capacity === undefined ||
        price === undefined
    ) {
        throw createError('Faltan campos obligatorios', 400);
    }

    validateFutureDate(date);
    validateCapacity(capacity);
    validatePrice(price);

    return await eventRepository.createEvent({
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        date,
        location: location.trim(),
        capacity,
        price,
        organizer: user.id
    });
};

export const getEventById = async (id) => {
    validateEventId(id);

    const event = await eventRepository.findEventById(id);

    if (!event) {
        throw createError('Evento no encontrado', 404);
    }

    return event;
};

export const getEvents = async (query) => {
    const {
        status,
        category,
        location,
        dateFrom,
        dateTo,
        sort = 'date'
    } = query;

    const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);

    const limit = Math.min(
        Math.max(Number.parseInt(query.limit, 10) || 10, 1),
        100
    );

    const filter = {};

    if (status) {
        if (!VALID_STATUS.includes(status)) {
            throw createError('Estado de evento inválido', 400);
        }

        filter.status = status;
    }

    if (category) filter.category = category;
    if (location) filter.location = location;

    if (dateFrom || dateTo) {
        filter.date = {};

        if (dateFrom) {
            const from = new Date(dateFrom);

            if (Number.isNaN(from.getTime())) {
                throw createError('dateFrom inválido', 400);
            }

            filter.date.$gte = from;
        }

        if (dateTo) {
            const to = new Date(dateTo);

            if (Number.isNaN(to.getTime())) {
                throw createError('dateTo inválido', 400);
            }

            filter.date.$lte = to;
        }

        if (
            filter.date.$gte &&
            filter.date.$lte &&
            filter.date.$gte > filter.date.$lte
        ) {
            throw createError(
                'dateFrom no puede ser posterior a dateTo',
                400
            );
        }
    }

    const allowedSortFields = ['date', 'price', 'capacity', 'title'];
    const sortDirection = sort.startsWith('-') ? -1 : 1;
    const sortField = sort.startsWith('-') ? sort.slice(1) : sort;

    if (!allowedSortFields.includes(sortField)) {
        throw createError('Campo de ordenamiento inválido', 400);
    }

    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
        eventRepository.findEvents(filter, {
            skip,
            limit,
            sort: { [sortField]: sortDirection }
        }),
        eventRepository.countEvents(filter)
    ]);

    return {
        data: events,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
    };
};

export const updateEvent = async (id, data, user) => {
    const event = await getEventById(id);

    validateOwnership(event, user);

    if (event.status === 'cancelled') {
        throw createError('Un evento cancelado no puede modificarse', 400);
    }

    if (data.capacity !== undefined) validateCapacity(data.capacity);
    if (data.price !== undefined) validatePrice(data.price);
    if (data.date !== undefined) validateFutureDate(data.date);

    const allowedFields = [
        'title',
        'description',
        'category',
        'date',
        'location',
        'capacity',
        'price'
    ];

    for (const field of allowedFields) {
        if (data[field] !== undefined) {
            event[field] = data[field];
        }
    }

    return await eventRepository.saveEvent(event);
};

export const changeEventStatus = async (id, newStatus, user) => {
    const event = await getEventById(id);

    validateOwnership(event, user);

    if (!VALID_STATUS.includes(newStatus)) {
        throw createError('Estado de evento inválido', 400);
    }

    if (event.status === 'cancelled') {
        throw createError(
            'Un evento cancelado no puede cambiar de estado',
            400
        );
    }

    if (newStatus === 'published' && event.status === 'finished') {
        throw createError(
            'Un evento finalizado no puede publicarse',
            400
        );
    }

    event.status = newStatus;

    return await eventRepository.saveEvent(event);
};