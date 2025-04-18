export async function authenticatedFetch(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem("access_token");
  
    const headers = {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    };
  
    const response = await fetch(url, {
      ...options,
      headers,
    });
  
    return response;
  }