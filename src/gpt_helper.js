import * as dotenv from 'dotenv'
import process from 'process'
import { Configuration, OpenAIApi } from "openai";
import { trim } from './util.js'

dotenv.config()
const openai = new OpenAIApi(new Configuration({
  organization: "org-ExI5t9C50TnCP397RaYZJCRu",
  apiKey: process.env.OPENAI_API_KEY,
}));

export async function getDescription(productName) {
  try {
    const response = await openai.createCompletion({
      // model: "gpt-3.5-turbo",
      model: "text-davinci-003",
      prompt: `When does ${productName} usually expire? Please explain.`,
      max_tokens: 100,
    })
    const description = trim(response.data.choices[0].text)
    return description
  } catch (e) {
    console.log("Error getting GPT completion: ", e)
    throw e
  }
}