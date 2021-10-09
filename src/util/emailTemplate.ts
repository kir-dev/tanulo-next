import { User } from '@prisma/client'
import { Email } from './sendEmail'

const styles = {
  body: `"min-height: 50vh;
        color: rgba(31, 41, 55, 1);
        background: rgb(191,219,254);
        background: linear-gradient(180deg, rgba(191,219,254,1)
        0%, rgba(221,214,254,1) 100%);
        font-family: Arial, Helvetica, sans-serif;"`,
  titleDiv: `"margin-bottom: 2rem;
        margin-right: 1rem;"`,
  title: `"display: inline-block;
        width: auto;
        padding: 0.75rem 1.5rem 0.75rem 1.5rem;
        margin-bottom: 0px;
        margin-left: -1rem;
        font-size: 1.5rem;
        line-height: 2rem;
        font-weight: 700;
        background-color: rgba(249, 250, 251, 1);"`,
  container: `"text-align: center;
        padding: 1.5rem 2rem 2rem 2rem;
        margin: 0rem 1.5rem 1.5rem 1.5rem;
        border-radius: 1rem;
        background-color: rgba(249, 250, 251,1);
        box-shadow: 4px 0px 4px rgba(0, 0, 0, 0.1);"`,
  greeting: '"margin: 0.5rem;"',
  button: `"font-size: 1.125rem;
        line-height: 1.75rem;
        padding: 0.5rem 1rem 0.5rem 1rem;
        border-style: none;
        border-radius: 9999px;
        background-color: rgba(220, 38, 38, 1);
        color: rgba(255, 255, 255,1);
        text-decoration: none;
        width: max-content;"`,
  smallText: `"font-size: 12px;
        margin-top:2rem;
        margin-bottom: 0px;"`
}

export const generateEmailHTML = (user: User, email: Email): string => {
  return `<html>
  <body style=${styles.body}>
      <div style=${styles.titleDiv}>
          <h1 style=${styles.title}>TanulóSCH</h1>
      </div>
      <div style=${styles.container}>
          <h2 style=${styles.greeting}>Kedves ${user.name}!</h2>
          <p>${email.body}</p>
          <a style=${styles.button} href=https://tanulo.sch.bme.hu${email.link || ''}>
            ${email.linkTitle || 'TanulóSCH'}
          </a>
          <p style=${styles.smallText}>
            Ez egy automatikusan gerenált üzenet, kérjük ne válaszolj rá! <br>
             Ha nem szeretnél több emailt kapni, akkor ezt a
             <a href="https://tanulo.sch.bme.hu/users/${user.id}"> profilodon</a> beállíthatod. <br>
             Kérdés esetén írj a <a href="mailto:kir-dev@sch.bme.hu">kir-dev@sch.bme.hu</a> címre!
          </p>
      </div>
  </body>
  </html>`
}
