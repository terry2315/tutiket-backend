const toPopulatedEventDTO = (event) => {
    if (!event || typeof event !== 'object' || !event.title) {
        return event;
    }

    return {
        _id: event._id,
        title: event.title,
        date: event.date,
        location: event.location
    };
};

export const toTicketDTO = (ticket) => {
    if (!ticket) return null;

    return {
        _id: ticket._id,
        user: ticket.user,
        event: toPopulatedEventDTO(ticket.event),
        status: ticket.status,
        quantity: ticket.quantity,
        reservationCode: ticket.reservationCode,
        cancelledAt: ticket.cancelledAt,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
        __v: ticket.__v
    };
};

export const toTicketsDTO = (tickets) => {
    return tickets.map(toTicketDTO);
};