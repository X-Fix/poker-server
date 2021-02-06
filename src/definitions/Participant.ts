import { generateParticipantId } from '../utils';

class Participant {
  public id: string;
  public name: string;
  public socketId?: string;
  public vote?: number;

  constructor(name: string) {
    this.id = generateParticipantId();
    this.name = name;
  }
}

export default Participant;
