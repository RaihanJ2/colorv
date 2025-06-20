export async function handler(event) {
  try {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    // Forward the request to Colormind API
    const response = await fetch("http://colormind.io/api/", {
      method: "POST",
      body: event.body,
    });

    // Get the response data
    const data = await response.json();

    // Return the response
    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error("Error fetching from Colormind API:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch from Colormind API" }),
    };
  }
}
