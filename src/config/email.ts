import nodemailer from 'nodemailer'

//const transporter = nodemailer.createTransport({
//  host: 'mail.sch.bme.hu',
//  port: 80,
//  secure: true,
//  auth: {
//    user: 'noreply@tanulo.sch.bme.hu',
//    pass: process.env.EMAIL_PWD
//  },
//  tls: {
//    ciphers:'SSLv3'
//  }
//})
//
const transporter = nodemailer.createTransport({
  host: 'mail.sch.bme.hu',
  port: 993,
  secure: false,
  auth: {
    user: 'noreply@tanulo.sch.bme.hu',
    pass: process.env.EMAIL_PWD
  },
  tls: {
    ciphers:'SSLv3'
  }
})


export default transporter
