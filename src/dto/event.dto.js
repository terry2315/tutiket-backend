const getValue = (event, field) => event?.[field];

export const toEventDTO = (event) => {
    if (!event) return null;

    return {
        _id: getValue(event, '_id'),
        title: getValue(event, 'title'),
        description: getValue(event, 'description'),
        category: getValue(event, 'category'),
        date: getValue(event, 'date'),
        location: getValue(event, 'location'),
        capacity: getValue(event, 'capacity'),
        price: getValue(event, 'price'),
        status: getValue(event, 'status'),
        organizer: getValue(event, 'organizer'),
        createdAt: getValue(event, 'createdAt'),
        updatedAt: getValue(event, 'updatedAt'),
        __v: getValue(event, '__v')
    };
};

export const toEventsDTO = (events) => {
    return events.map(toEventDTO);
};

export const toPaginatedEventsDTO = (result) => ({
    status: 'success',
    data: toEventsDTO(result.data),
    page: result.page,
    limit: result.limit,
    total: result.total,
    totalPages: result.totalPages
});