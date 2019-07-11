interface FbMessageEntry {
  readonly object: string;
  readonly entry: FbEntry[];
}

interface FbEntry {
  readonly id: string;
  readonly time: number;
  readonly messaging: FbMessage[];
}

interface FbMessage {
  readonly sender: { id: string };
  readonly recipient: { id: string };
  readonly message?: { mid: string; text: string; quick_reply?: { payload: string } };
}

interface FbReply {
  message: {
    text: string;
    quick_replies?: FbQuickReply[];
  };
}

interface FbQuickReply {
  content_type: string;
  title: string;
  payload: string;
}

export { FbMessageEntry, FbEntry, FbMessage, FbReply, FbQuickReply };
