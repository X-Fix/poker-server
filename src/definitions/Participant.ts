import { generateParticipantId } from '../utils';

class Participant {
  public id: string;
  public name: string;
  public socketId?: string; // presence or absence indicates isConnected
  public vote?: string;
  public isActive: boolean;
  public isConnected: boolean;

  constructor(name: string) {
    this.id = generateParticipantId();
    this.name = name;
    this.isActive = true;
    this.isConnected = false;
  }
}

export default Participant;
