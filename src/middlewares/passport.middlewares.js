import passport from 'passport';

export const authenticateRegister = (req, res, next) => {
    passport.authenticate(
        'register',
        { session: false },
        (error, user, info, status) => {

            if (error) {
                const statusCode = error.statusCode || 500;

                return res.status(statusCode).json({
                    status: 'error',
                    message:
                        statusCode === 500
                            ? 'Error interno del servidor'
                            : error.message
                });
            }

            if (!user) {
                return res.status(status || 400).json({
                    status: 'error',
                    message: 'Faltan campos obligatorios'
                });
            }

            req.user = user;

            next();
        }
    )(req, res, next);
};

export const authenticateLogin = (req, res, next) => {
    passport.authenticate(
        'login',
        { session: false },
        (error, user) => {
            if (error) {
                const statusCode = error.statusCode || 500;

                return res.status(statusCode).json({
                    status: 'error',
                    message:
                        statusCode === 500
                            ? 'Error interno del servidor'
                            : error.message
                });
            }

            if (!user) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Credenciales inválidas'
                });
            }

            req.user = user;
            next();
        }
    )(req, res, next);
};

export const authenticateCurrent = (req, res, next) => {
    passport.authenticate(
        'current',
        { session: false },
        (error, user) => {
            if (error || !user) {
                return res.status(401).json({
                    status: 'error',
                    message: 'No autenticado'
                });
            }

            req.user = user;
            next();
        }
    )(req, res, next);
};