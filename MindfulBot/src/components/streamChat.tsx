// src/utils/streamChat.ts
export async function streamChatResponse(
    message: string,
    onToken: (token: string) => void,
    onDone: () => void,
    model: string = "gpt-3.5-turbo"
  ) {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        model,
        stream: true, // optional, for flexibility
      }),
    });
  
    const reader = response.body?.getReader();
    const decoder = new TextDecoder("utf-8");
  
    if (!reader) return;
  
    let done = false;
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      const chunk = decoder.decode(value);
      onToken(chunk); // append chunk to chat
    }
  
    onDone(); // signal completion
  }
  