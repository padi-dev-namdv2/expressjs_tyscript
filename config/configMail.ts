const nodemailer =  require('nodemailer');
export const transporter = () =>  nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'davidmillie2000@gmail.com',
        pass: 'eitoehwkiaunvouz'
    },
    tls: {
        rejectUnauthorized: false
    }
});