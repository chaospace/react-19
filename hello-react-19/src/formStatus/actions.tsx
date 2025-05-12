

async function submitForm(query: FormData) {
  await new Promise(res => {
    setTimeout(res, 2000)
  });
}

export {
  submitForm
}