export const HTTP_STATUS = {
  BAD_REQUEST: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
};

export const TIMEOUT = {
  ROOM_ACTIVITY: 3600000,
};

export const DISCONNECT_REASON = {
  IO_SERVER_DISCONNECT: 'io server disconnect',
  IO_CLIENT_DISCONNECT: 'io client disconnect',
  PING_TIMEOUT: 'ping timeout',
  TRANSPORT_CLOSE: 'transport close',
  TRANSPORT_ERROR: 'transport error',
};
