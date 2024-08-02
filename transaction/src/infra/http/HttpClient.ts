import axios, { AxiosResponse } from "axios";

export interface HttpClient {
  get(url: string): Promise<any>;
  post(url: string, body: any): Promise<any>;
}

export class AxiosAdapter implements HttpClient {
  async get(url: string): Promise<AxiosResponse> {
    const response = await axios.get(url);
    return response.data;
  }

  async post(url: string, body: any): Promise<AxiosResponse> {
    const response = await axios.post(url, body);
    return response.data;
  }
}

export class FetchAdapter implements HttpClient {
  async get(url: string): Promise<any> {
    const response = await fetch(url);
    return response.json();
  }

  async post(url: string, body: any): Promise<any> {
    const response = await fetch(url, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return response.json();
  }
}
