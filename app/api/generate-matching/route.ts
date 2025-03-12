import { matchingItemSchema, matchingExerciseSchema } from "@/lib/schemas";
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
            "You are a teacher. Your job is to take a document, and create a matching exercise based on the content of the document. Create 6 pairs of related terms and definitions that students can match together. Each item must have a unique id field that matches between the left and right sides.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Create a matching exercise based on this document with 6 pairs of terms and definitions. Make sure each item has a unique id that matches between the left and right sides.",
            },
            {
              type: "file",
              data: firstFile,
              mimeType: "application/pdf",
            },
          ],
        },
      ],
      schema: matchingExerciseSchema,
      onFinish: ({ object }) => {
        const res = matchingExerciseSchema.safeParse(object);
        if (res.error) {
          console.error("Validation error:", res.error.errors);
          throw new Error(res.error.errors.map((e) => e.message).join("\n"));
        }
      },
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("Error in generate-matching:", error);
    return new Response(JSON.stringify({ error: error.message || "Unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
} 