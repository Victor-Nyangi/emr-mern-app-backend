import OpenAI from "openai";

// Constructed on first use, not at module load -- so a missing key fails
// the one request that needs it instead of taking down the whole API.
// The SDK's own guard only fires for a truly undefined key, not an empty
// string, so this checks explicitly rather than relying on it.
let client: OpenAI | undefined;

const getClient = (): OpenAI => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY is not configured; the AI assistant is unavailable.",
    );
  }
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
};

export const askMedicalQuestion = async (question: string) => {
  const openai = getClient();
  // TODO: Manage and preupdate gpt tokens
  // Log quota limit exceeds
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful medical assistant..." },
      { role: "user", content: question },
    ],
    temperature: 0.3,
  });

  return response.choices[0].message.content;
};
