import Participant from './Participant';

class ChatMessage {
  public senderId: string;
  public senderName: string;
  public text: string;
  public dateMillis: number;

  constructor(participant: Participant, text: string) {
    this.senderId = participant.id;
    this.senderName = participant.name;
    this.text = text;
    this.dateMillis = Date.now();
  }
}

export default ChatMessage;
