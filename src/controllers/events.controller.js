import Event from '../models/Event.js';

export const getEvents = (req, res) => {
    return res.status(200).json({
        status: 'success',
        payload: []
    });
};

export const createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            date,
            location,
            capacity,
            price,
            status
        } = req.body;

        const event = await Event.create({
            title,
            description,
            category,
            date,
            location,
            capacity,
            price,
            status,
            organizer: req.user.id
        });

        return res.status(201).json({
            status: 'success',
            payload: {
                id: event._id,
                title: event.title,
                description: event.description,
                category: event.category,
                date: event.date,
                location: event.location,
                capacity: event.capacity,
                price: event.price,
                status: event.status,
                organizer: event.organizer
            }
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                status: 'error',
                message: error.message
            });
        }

        return res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const event = req.event;

        const allowedFields = [
            'title',
            'description',
            'category',
            'date',
            'location',
            'capacity',
            'price',
            'status'
        ];

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                event[field] = req.body[field];
            }
        }

        await event.save();

        return res.status(200).json({
            status: 'success',
            payload: {
                id: event._id,
                title: event.title,
                description: event.description,
                category: event.category,
                date: event.date,
                location: event.location,
                capacity: event.capacity,
                price: event.price,
                status: event.status,
                organizer: event.organizer
            }
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                status: 'error',
                message: error.message
            });
        }

        return res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
};