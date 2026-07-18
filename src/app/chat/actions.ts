"use server";

export async function checkHealth() {
  try {
    const res = await fetch("http://127.0.0.1:5000/api/health", {
      method: "GET",
      headers: {
        accept: "application/json",
      },
      // Short timeout to not hang the UI if it's completely down
      signal: AbortSignal.timeout(3000), 
    });
    
    return { ok: res.ok };
  } catch (error) {
    return { ok: false };
  }
}

export async function sendChatMessage(query: string) {
  try {

    const token = process.env.TOKEN2 ;
    
    const res = await fetch("http://127.0.0.1:5000/api/chat", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
