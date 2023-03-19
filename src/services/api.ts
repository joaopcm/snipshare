export async function save(requestBody: {
  html: string
  codeSnippet: string
}): Promise<{ id: string }> {
  const response = await fetch('/api/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  }).then((res) => res.json())

  return response
}

export async function get(
  id: string,
): Promise<{ html: string; codeSnippet: string }> {
  const response = await fetch(`/api/${id}`).then((res) => res.json())

  return response
}
