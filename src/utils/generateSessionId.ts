import { customAlphabet } from 'nanoid';
import dictionary from 'nanoid-dictionary/nolookalikes-safe';

const nanoid = customAlphabet(dictionary, 6);

const generateSessionId = (): string => nanoid().toUpperCase();

export default generateSessionId;
