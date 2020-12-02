import email from '../config/email';
import { createTransport } from 'nodemailer'
import { api as link } from '../config/config';
const transporter = createTransport(email);

module.exports = ({user, recovery}, callback) => {
    const message = `
        <h1 style="text-align: center;"> Recuperação de Senha </h1>
        <br/>
        
        <p>Aqui está o link para recuperar sua senha.</p>
        
        <a href="${link}/usuario/senha-recuperada?token=${recovery.token}"> 
            ${link}/usuario/senha-recuperada?token=${recovery.token}
        </a>
        <br/>
        <hr/>
        <p>Obs.: Se você não soliticou a redefinição, ignore esse email.</p>
    `
    const emailOptions = {
        from: 'naoresponder@ecommercelw',
        to: user.email,
        subject: "Redifinição de Senha",
        html: message
    };

    if(process.env.NODE_ENV === 'production'){
        transporter.sendMail(emailOptions, (error, info) => {
            if (error) return callback("Algo de errado aconteceu :(");
            else return callback(null, "Link para seu email foi enviado com sucesso");
        })
    }else {
        console.log(emailOptions);
        return callback(null, "Link para seu email foi enviado com sucesso");
    }
};



