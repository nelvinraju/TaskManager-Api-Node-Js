const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)



const sendWelcomeEmail =(email,name) =>{

    sgMail.send({
        to:email,
        from: 'nelvin4u17@gmail.com',
        subject: 'Welcome to Task Manager App',
        text: `Hi ${name} your Account is up. Enjoy the functions....`,
        //html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    })

}

const sendCancellationEmail =(email,name) =>{

    sgMail.send({
        to:email,
        from: 'nelvin4u17@gmail.com',
        subject: 'Account cancellation of Task Manager App',
        text: `Hi ${name} your Account is removed.Please come back soon`,
        //html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    })

}

module.exports ={
    sendWelcomeEmail,
    sendCancellationEmail
}