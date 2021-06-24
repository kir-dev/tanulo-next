import { Response } from 'express'

type MessageType = 'danger' | 'success' | 'warning'

const sendMessage = (res: Response, message: string, type: MessageType = 'danger') => {
  res.cookie('message', JSON.stringify({
    mes: message,
    type: type,
  }), { path: '/' })
}
export default sendMessage
