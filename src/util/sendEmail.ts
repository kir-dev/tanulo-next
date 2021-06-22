import transporter from '../config/email'
import { User } from '../components/users/user'

interface Email {
  subject: string
  body: string
  link?: string
  linkTitle?: string
}

export const sendEmail = (recipients: User[], email: Email) => {
  if (process.env.NODE_ENV === 'production') {
    recipients.forEach(user => {
      transporter.sendMail({
        from: `TanulóSCH <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: email.subject,
        text: email.body,
        html: `<html>
                  <body style="min-height: 50vh;color: rgba(31, 41, 55, 1);
                              background: rgb(191,219,254);
                              background: linear-gradient(180deg, rgba(191,219,254,1)
                               0%, rgba(221,214,254,1) 100%);
                              font-family: Arial, Helvetica, sans-serif;">
                      <div style="
                                  margin-bottom: 2rem;margin-right: 1rem;">
                          <h1 style="display: inline-block; width: auto; padding-left: 1.5rem;
                                     padding-right: 1.5rem; padding-top:0.75rem;
                                     padding-bottom: 0.75rem; margin-bottom: 0px;
                                     font-size: 1.5rem; line-height: 2rem; font-weight: 700;
                                      background-color: rgba(249, 250, 251, 1);
                                      margin-left: -1rem;">TanulóSCH</h1>
                      </div>
                      <div style="text-align: center;
                                padding-left: 2rem;
                                padding-right: 2rem;padding-top: 1.5rem;padding-bottom: 2rem;
                                margin-left: 1.5rem;margin-right: 1.5rem;border-radius: 1rem;
                                background-color: rgba(249, 250, 251,1);
                                --tw-shadow: 0px 4px 32px rgba(0, 0, 0, 0.3),
                                 4px 0px 4px rgba(0, 0, 0, 0.1);
                                box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
                                 var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);">
                          <h2 style="margin: 0.5rem;">Kedves ${user.name}!</h2>
                          <p>${email.body}</p>
                          <a style="font-size: 1.125rem;
                                    line-height: 1.75rem;padding-left: 1rem;
                                    padding-right: 1rem;padding-top: 0.5rem;
                                    padding-bottom: 0.5rem;border-style: none;border-radius: 9999px;
                                    background-color: rgba(220, 38, 38, 1);
                                    color: rgba(255, 255, 255,1);text-decoration: none;
                                    width: max-content;"
                           href=https://tanulo.sch.bme.hu${email.link || ''}>
                            ${email.linkTitle || 'TanulóSCH'}
                          </a>
                          <p style="font-size: 12px;margin-top:2rem;margin-bottom: 0px;">
                            Kérjük, ne válaszolj erre az emailre.
                          </p>
                      </div>
                  </body>
              </html>`
      }, (err) => {
        if (err) {
          console.log(err)
        }
      })
    })
  }
}
