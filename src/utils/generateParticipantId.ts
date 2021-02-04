import { customAlphabet } from 'nanoid';
import dictionary from 'nanoid-dictionary/nolookalikes-safe';

const nanoid = customAlphabet(dictionary, 10);

const generateParticipantId = (): string => nanoid();

export default generateParticipantId;
