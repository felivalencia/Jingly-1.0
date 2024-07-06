// ../utils/openai.js
import axios from "axios";
import keys from "../env.js";

const model = "gpt-4o"; // GPT-3.5 Turbo model
const openAiApiUrl = "https://api.openai.com/v1/chat/completions";
const apiKey = keys.OPEN_AI_KEY; // Replace with your actual key

export const getToneJSScript = async (prompt) => {
  try {
    const response = await axios.post(
      openAiApiUrl,
      {
        model: model,
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant specializing in creating Tone.js scripts for generating music. The returned response should ONLY have the code, it shpuld start with a const and end with a }, it shouldnt contain the word javascript anywhere make sure of it",
          },
          {
            role: "user",
            content: `Create a Tone.js script based on the following prompt: ${prompt}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const toneScript = response.data.choices[0].message.content.trim();
    return toneScript;
  } catch (error) {
    console.error("Error generating Tone.js script:", error);
    throw new Error("Could not generate Tone.js script.");
  }
};
