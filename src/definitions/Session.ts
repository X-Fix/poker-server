import { generateSessionId } from '../utils';
import Participant from './Participant';

class Session {
  public id: string;
  public name?: string;
  public ownerId: string;
  public participants: Participant[];
  public topic?: string;
  public cleanUp?: Date;

  constructor(owner: Participant, name?: string) {
    this.id = generateSessionId();
    this.name = name;
    this.ownerId = owner.id;
    this.participants = [owner];
  }

  public hasVotingFinished(): boolean {
    return Boolean(
      this.participants.filter(({ vote }) => Boolean(vote)).length
    );
  }
}

export default Session;
