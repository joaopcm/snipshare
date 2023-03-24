import { Configuration, OpenAIApi } from 'openai'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

if (OPENAI_API_KEY == null) {
  throw new Error('Define the OPENAI_API_KEY environmental variable')
}

let cachedConfiguration: Configuration
let cachedApi: OpenAIApi

const MAX_TOKENS = 100
const MODEL = 'text-davinci-003'

export async function askAI(codeSnippet: string) {
  const prompt = `Explain the following code snippet:

  \`\`\`
  ${codeSnippet}
  \`\`\

  What does this code do? Explain in a friendly way. Answer with max ${MAX_TOKENS} tokens.
  `

  if (cachedApi && cachedConfiguration) {
    return cachedApi.createCompletion({
      model: MODEL,
      prompt,
      temperature: 0,
      max_tokens: MAX_TOKENS,
    })
  }

  cachedConfiguration = new Configuration({
    apiKey: OPENAI_API_KEY,
  })
  cachedApi = new OpenAIApi(cachedConfiguration)

  return cachedApi.createCompletion({
    model: MODEL,
    prompt,
    temperature: 0,
    max_tokens: MAX_TOKENS,
  })
}
