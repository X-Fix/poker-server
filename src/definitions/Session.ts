import { generateSessionId } from '../utils';
import Participant from './Participant';

class Session {
  public id: string;
  public name: string;
  public ownerId: string;
  public participants: Participant[];
  public cardSequence: string[];
  public phase: 'lobby' | 'voting' | 'result'; // There is a 4th 'newTopic' phase but this is reserved for sessionOwners to privately set themselves to
  public topic?: string;
  public cleanUp?: Date;

  constructor(owner: Participant, cardSequence: string[], name: string) {
    this.id = generateSessionId();
    this.name = name;
    this.ownerId = owner.id;
    this.participants = [owner];
    this.cardSequence = cardSequence;
    this.phase = 'lobby';
  }
}

export default Session;
