import { DISCONNECT_REASON } from '../utils';

const {
  IO_SERVER_DISCONNECT,
  IO_CLIENT_DISCONNECT,
  PING_TIMEOUT,
  TRANSPORT_CLOSE,
  TRANSPORT_ERROR,
} = DISCONNECT_REASON;

type DisconnectPayload =
  | typeof IO_SERVER_DISCONNECT
  | typeof IO_CLIENT_DISCONNECT
  | typeof PING_TIMEOUT
  | typeof TRANSPORT_CLOSE
  | typeof TRANSPORT_ERROR;

export default DisconnectPayload;
