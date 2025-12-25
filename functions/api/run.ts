export const onRequestPost: PagesFunction = async ({ request, env }) => {
  try {
    const body = await request.json();
    const prompt = body.prompt || "A solitary figure in tall grass.";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a cinematic visual director. Break the idea into three stages: scene intent, cinematic expansion, and final shot.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();
    const text = data.choices[0].message.content || "";
    const parts = text.split("\n\n");

    return new Response(
      JSON.stringify({
        scene_intent: parts[0] || "",
        cinematic_expansion: parts[1] || "",
        final_shot: parts[2] || "",
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    return new Response(e.message || "error", { status: 500 });
  }
};

