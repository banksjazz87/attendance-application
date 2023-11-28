/**
 * 
 * @param url string
 * @returns a Promise with a type of any
 * @description delete method to make a delete request.
 */


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