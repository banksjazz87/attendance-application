/**
 * 
 * @param url string, of the needed api endpoint.
 * @param data object of type any, this data will be used to post.
 * @returns a promise.
 * @description makes a put request to the provided url with the provided object.
 */

async function putData(url: string, data: object): Promise<any> {
    const response: any = await fetch(url, {
      method: "PUT",
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
  
  export default putData;
  