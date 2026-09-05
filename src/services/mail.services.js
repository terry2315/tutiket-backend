import nodemailer from 'nodemailer';

const getTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: Number(process.env.MAIL_PORT) === 465,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });
};

export const sendTicketConfirmation = async ({ to, event, ticket }) => {
    const transporter = getTransporter();

    await transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject: `Confirmación de inscripción - ${event.title}`,
        text: [
            `Tu inscripción fue confirmada.`,
            `Evento: ${event.title}`,
            `Fecha: ${event.date}`,
            `Lugar: ${event.location}`,
            `Cantidad: ${ticket.quantity}`,
            `Código de reserva: ${ticket.reservationCode}`
        ].join('\n')
    });
};