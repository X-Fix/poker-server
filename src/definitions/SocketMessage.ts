import { Namespace, Socket } from 'socket.io';

interface SocketMessage<Payload> {
  handler: (payload: Payload, socket: Socket, namespace: Namespace) => void;
  message: string;
}

export default SocketMessage;
