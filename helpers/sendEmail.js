
const nodemailer = require("nodemailer");

exports.sendEmail = async (data) => {
    const { receiver, subject, html, text } = data

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'phantomatula@gmail.com', // generated ethereal user
            pass: 'Chinhlaanh@72', // generated ethereal password
        },
    });

    // send mail with defined transport object
    await transporter.sendMail({
        from: 'phantomatula@gmail.com',
        to: receiver, // list of receivers
        subject: subject, // Subject line
        html: html, // html body
        text: text
    }).then(
        console.log("sent mail")
    ).catch(err => {
        console.log(err)
    })
}