

async function submitForm(query: FormData) {
  console.log('query', query);
  await new Promise(res => setTimeout(res, 2000));
}

export {
  submitForm
}