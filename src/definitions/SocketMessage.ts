import { Namespace, Socket } from 'socket.io';
import { Session } from '.';

interface SocketMessage<Payload> {
  handler: (
    payload: Payload,
    socket: Socket,
    namespace: Namespace,
    callback: (cbPayload: string | Session) => void
  ) => void;
  message: string;
}

export default SocketMessage;
