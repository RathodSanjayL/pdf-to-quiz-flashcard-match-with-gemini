import { flashcardSchema, flashcardsSchema } from "@/lib/schemas";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { files } = await req.json();
    const firstFile = files[0].data;

    const result = streamObject({
      model: google("gemini-1.5-pro-latest"),
      messages: [
        {
          role: "system",
          content:
            "You are a teacher. Your job is to take a document, and create a set of 8 flashcards based on the content of the document. Each flashcard should have a term and its definition. Make sure to create exactly 8 flashcards.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Create a set of 8 flashcards based on this document. Each flashcard should have a term and its definition.",
            },
            {
              type: "file",
              data: firstFile,
              mimeType: "application/pdf",
            },
          ],
        },
      ],
      schema: flashcardsSchema,
      onFinish: ({ object }) => {
        const res = flashcardsSchema.safeParse(object);
        if (res.error) {
          console.error("Validation error:", res.error.errors);
          throw new Error(res.error.errors.map((e) => e.message).join("\n"));
        }
      },
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("Error in generate-flashcards:", error);
    return new Response(JSON.stringify({ error: error.message || "Unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
} 