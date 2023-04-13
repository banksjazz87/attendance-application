async function postData(url: string, data: object): Promise<any> {
  const response: any = await fetch(url, {
    method: "Post",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });

  return response.json();
}

export default postData;
