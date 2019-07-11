import { ChatState } from "./app.state";

interface History {
  id: string;
  data: UserData;
  state: ChatState;
}

interface UserData {
  firstName: string;
  birthDate: Date;
}

interface Message {
  id: string;
  historyId: string;
  text: string;
}

export { History, UserData, Message };
