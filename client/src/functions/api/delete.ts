async function deleteData(url: string): Promise<any> {
    const response: any = await fetch(url, {
      method: "DELETE",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    });
  
    return response.json();
  }
  
  export default deleteData;