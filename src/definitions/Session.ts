import { generateSessionId } from '../utils';
import Participant from './Participant';

class Session {
  public id: string;
  public name?: string;
  public ownerId: string | undefined;
  public participants: Participant[];

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
