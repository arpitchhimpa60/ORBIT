
const API_URL = "http://127.0.0.1:9876";

// Send a request to the ORBIT backend
export async function apiRequest(endpoint, method, data, token) {
  const headers = {
    "Content-Type": "application/json",
  };

  // Add the JWT token when a protected route needs it
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: method,
    headers: headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  const result = await response.json();

  if (!response.ok) {
    const error = new Error(result.message || "Something went wrong");
    error.status = response.status;
    throw error;
  }

  return result;
}
