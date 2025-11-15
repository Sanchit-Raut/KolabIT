// Interface for message data
export interface MessageData {
  id: string;
  content: string;
  senderId: string;
  recipientId: string;
  createdAt: Date;
  updatedAt: Date;
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    isVerified: boolean;
  };
  recipient?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    isVerified: boolean;
  };
}

// Create message data
export interface CreateMessageData {
  content: string;
}