export type ConsultationMessage = {
  id: string;
  sender: "member" | "admin" | "ayla";
  body: string;
  createdAt: string;
};

export type ConsultationPayload = {
  kind: "consultation" | "coach";
  subject: string;
  messages: ConsultationMessage[];
};

export function readSupportConversation(value: unknown): ConsultationPayload | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  if ((record.kind !== "consultation" && record.kind !== "coach") || typeof record.subject !== "string" || !Array.isArray(record.messages)) return null;

  const messages = record.messages.flatMap((message): ConsultationMessage[] => {
    if (!message || typeof message !== "object" || Array.isArray(message)) return [];
    const item = message as Record<string, unknown>;
    if ((item.sender !== "member" && item.sender !== "admin" && item.sender !== "ayla") || typeof item.id !== "string" || typeof item.body !== "string" || typeof item.createdAt !== "string") return [];
    return [{ id: item.id, sender: item.sender, body: item.body, createdAt: item.createdAt }];
  });

  return { kind: record.kind, subject: record.subject, messages };
}

export function readConsultation(value: unknown): ConsultationPayload | null {
  const conversation = readSupportConversation(value);
  return conversation?.kind === "consultation" ? conversation : null;
}

export function lastConsultationActivity(conversation: ConsultationPayload, fallback: Date) {
  const lastMessage = conversation.messages.at(-1);
  const timestamp = lastMessage ? Date.parse(lastMessage.createdAt) : fallback.getTime();
  return Number.isNaN(timestamp) ? fallback.toISOString() : new Date(timestamp).toISOString();
}
