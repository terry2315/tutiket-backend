const getId = (user) => {
    return user?._id?.toString() || user?.id?.toString();
};

export const toAuthUserDTO = (user) => ({
    id: getId(user),
    email: user.email,
    role: user.role
});

export const toUserDTO = (user) => ({
    id: getId(user),
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role
});

export const toUsersDTO = (users) => {
    return users.map(toUserDTO);
};