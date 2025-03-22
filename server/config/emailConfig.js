import nodemailer from 'nodemailer';


export let transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email provider
    auth: {
        user: "YOUR EMAIL",
        pass: "djfj xnyg ocxz ysph",
    }
});




export let mailOptions = {
    from: 'YOUR EMAIL',
    to: 'RECIEVER EMAIL HERE',
    subject: 'Test Email from Auth Project',
    text: 'Hey saad, This is a test email for my learning, so please ignore it.',
    html: '<b>Baander Parh ley thora, khelta na rha kr</b>'
};



transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(`Error: ${error}`);
    }
    console.log(`Message Sent: ${info.response}`);
});