import { WorkoutUpdateModel } from "../dtos/workout/WorkoutUpdateModel";
import OpenAI from "openai";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY ?? "";
const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true,
});

export const getBotResponse = async (
  workout: WorkoutUpdateModel,
  setAiResponse: (response: string) => void,
  setShowModal: (show: boolean) => void,
  setLoading: (loading: boolean) => void
) => {
  setLoading(true);
  const prompt = `This is a workout a user built: ${JSON.stringify(
    workout
  )}. Act as a professional trainer and give feedback on whether this workout is good or bad and why. Give response in paragraph form and brief.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    if (response.choices[0].message.content) {
      setAiResponse(response.choices[0].message.content);
    } else {
      setAiResponse("No content received from AI.");
    }
    setShowModal(true);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching response:", error);
    setAiResponse("An error occurred while validating the workout.");
    setShowModal(true);
    setLoading(false);
  }
};
