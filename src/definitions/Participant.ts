import { generateParticipantId } from '../utils';

class Participant {
  public id: string;
  public name: string;
  public socketId?: string;
  public vote?: number;
  public isActive: boolean;

  constructor(name: string) {
    this.id = generateParticipantId();
    this.name = name;
    this.isActive = true;
  }
}

export default Participant;
