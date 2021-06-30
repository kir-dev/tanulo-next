import errorHandler from 'errorhandler'

import app from './app'
import { ENVIRONMENT } from './util/secrets'
import { agenda } from './util/agendaJobs'

/**
 * Error Handler. Provides full stack - remove for production
 */
if (!(ENVIRONMENT === 'production')) {
  app.use(errorHandler())
}

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log(
    '  App is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env')
  )
  console.log('  Press CTRL-C to stop\n')
  agenda.start()
})
