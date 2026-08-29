import mongoose from 'mongoose';
import Event from '../models/Event.js';

export const authorizeEventOwner = async (req, res, next) => {
    try {
        const { eid } = req.params;

        if (!mongoose.Types.ObjectId.isValid(eid)) {
            return res.status(400).json({
                status: 'error',
                message: 'ID de evento inválido'
            });
        }

        const event = await Event.findById(eid);

        if (!event) {
            return res.status(404).json({
                status: 'error',
                message: 'Evento no encontrado'
            });
        }

        if (req.user.role === 'admin') {
            req.event = event;
            return next();
        }

        const isOwner = event.organizer.toString() === req.user.id.toString();

        if (!isOwner) {
            return res.status(403).json({
                status: 'error',
                message: 'No tenés permisos para modificar este evento'
            });
        }

        req.event = event;
        next();

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
};