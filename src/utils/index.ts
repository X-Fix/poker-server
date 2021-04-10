import { customAlphabet } from 'nanoid';
import dictionary from 'nanoid-dictionary/nolookalikes-safe';
import { Participant, Session } from '../definitions';

/**
 * ID Generators
 */
const nanoidSession = customAlphabet(dictionary, 6);
const nanoidParticipant = customAlphabet(dictionary, 10);

export const generateSessionId = (): string => nanoidSession().toUpperCase();
export const generateParticipantId = (): string => nanoidParticipant();

/**
 * Name Generators
 */
const sessionNames = [
  'The Menacing Phantom',
  'The Strike-Back Empire',
  'The Awaken Forces',
  'The Clones Attack',
  'Ring of the Lords',
  'The Tower Twins',
  'The King of the Return',
  'Good Hunting Will',
  "Tiffany's at Breakfast",
  'Prejudice and Pride',
  'The Stone Philosopher',
  'The Secret of Chambers',
  'The Fire Goblet',
  'The Phoenix of the Order',
];

const participantNames = [
  'Smarty Pants',
  'Fancy Pants',
  'Lazy Bones',
  'Frightened Pinapple',
  'Energetic Apple Sauce',
  'Cool Cucumber',
  'Titular Tomato',
  'Anonymous Artichoke',
];

// Stolen from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values_inclusive
export function getRandomInt(min: number, max: number): number {
  const ceilingMin = Math.ceil(min);
  const floorMax = Math.floor(max);
  return Math.floor(Math.random() * (floorMax - ceilingMin + 1) + ceilingMin); // The maximum is exclusive and the minimum is inclusive
}

export const generateSessionName = (): string =>
  `${sessionNames[getRandomInt(0, sessionNames.length - 1)]}`;
export const generateParticipantName = (): string =>
  `${
    participantNames[getRandomInt(0, participantNames.length - 1)]
  } #${getRandomInt(1, 100)}`;

/**
 * Response/socket payload parsing
 */
function getSafeParticipants(participants: Participant[]): Participant[] {
  const safeParticipants = participants.map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ socketId: _, ...participant }) => participant
  );

  return safeParticipants;
}

export function parseSafeSessionResponse(session: Session): Session {
  // eslint-disable-next-line no-param-reassign
  session.participants = getSafeParticipants(session.participants);

  return session;
}

export function parseSafeParticipantResponse(
  participants: Participant[]
): Participant[] {
  return getSafeParticipants(participants);
}

/**
 * Constants
 */
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
