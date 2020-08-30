import { User } from '../components/users/user'
import { sendMail } from '../util/email'

export default async () => {
  const admins = await User.query().where({ admin: true })

  for await (const admin of admins) {
    /* eslint-disable max-len */
    const message = `
      <p>Kedves ${admin.name}!</p>
      <p>Új hibajegy lett feladva a TanulóSCH oldalon, amit <a href="https://tanulo.sch.bme.hu/tickets" target="_blank">itt</a> tudsz megtekinteni.</p>
      <br />
      TanulóSCH
      `
    /* eslint-enable max-len */
    await sendMail(admin.email, 'Új hibajegy', message)
  }
}
