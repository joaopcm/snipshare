export async function save() {
  const response = await fetch('/api/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code: 'console.log("Hello World")',
    }),
  }).then((res) => res.json())

  console.log(response)
}
