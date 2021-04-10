import { generateSessionId } from '../utils';
import Participant from './Participant';

class Session {
  public id: string;
  public name?: string;
  public ownerId: string;
  public participants: Participant[];
  public cardSequence: string[];
  public topic?: string;
  public phase: 'lobby' | 'voting' | 'result'; // There is a 4th 'newTopic' phase but this is reserved for sessionOwners to privately set themselves to
  public cleanUp?: Date;

  constructor(owner: Participant, cardSequence: string[], name?: string) {
    this.id = generateSessionId();
    this.name = name;
    this.ownerId = owner.id;
    this.participants = [owner];
    this.cardSequence = cardSequence;
    this.phase = 'lobby';
  }

  public hasVotingFinished(): boolean {
    return Boolean(
      this.participants.filter(({ vote }) => Boolean(vote)).length
    );
  }
}

export default Session;
