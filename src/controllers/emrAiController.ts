import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const model = process.env.OPENAI_GPT_MODEL as string;
// Get all patients
export const askMedicalQuestion = async (question: string) => {
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
