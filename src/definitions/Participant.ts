import { generateParticipantId } from '../utils';

class Participant {
  public id: string;
  public name: string;
  public vote: number;

  constructor(name: string) {
    this.id = generateParticipantId();
    this.name = name;
    this.vote = 0;
  }
}

export default Participant;
