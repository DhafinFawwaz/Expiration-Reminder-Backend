import process from 'process'
import { Configuration, OpenAIApi } from "openai";

const openai = new OpenAIApi(new Configuration({
  organization: "org-ExI5t9C50TnCP397RaYZJCRu",
  apiKey: process.env.OPENAI_API_KEY,
}));

export async function getDescription(productName) {
  try {

    const response = await openai.createCompletion({
      // model: "gpt-3.5-turbo",
      model: "text-davinci-003",
      prompt: `When does ${productName} usually expire?`,
    })

    return response.data.choices[0].text
  } catch (e) {
    console.log("Error getting GPT completion: ", e)
    throw e
  }
}