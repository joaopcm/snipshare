import { OpenAI } from 'langchain/llms/openai'
import { PromptTemplate } from 'langchain/prompts'

const PROMPT_TEMPLATE =
  PromptTemplate.fromTemplate(`Explain the following code snippet:
\`\`\`
{codeSnippet}
\`\`\

What does this code do? Explain in a friendly way.`)

export async function askAI(codeSnippet: string) {
  const model = new OpenAI({
    modelName: 'gpt-3.5-turbo-instruct',
    temperature: 0.7,
  })
  const chain = PROMPT_TEMPLATE.pipe(model)

  const explanation = (
    await chain.invoke({
      codeSnippet,
    })
  )
    .trim()
    .replace(/"/g, '')

  return explanation
}
