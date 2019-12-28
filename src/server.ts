import errorHandler from 'errorhandler'
import { createConnection } from 'typeorm'

import app from './app'
import { ENVIRONMENT } from './util/secrets'

createConnection().then(() => {

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
  })
})
