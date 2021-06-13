import { Response } from 'express'

// type can be danger, success, or warning, as per public/js/main.js displayMessage()
const sendMessage = (res: Response, message: string, type = 'danger') => {
  res.cookie('message', JSON.stringify({
    mes: message, 
    type: type,
  }), {path: '/'})
}
export default sendMessage
