import { z } from "zod";

export const questionSchema = z.object({
  question: z.string(),
  options: z
    .array(z.string())
    .length(4)
    .describe(
      "Four possible answers to the question. Only one should be correct. They should all be of equal lengths.",
    ),
  answer: z
    .enum(["A", "B", "C", "D"])
    .describe(
      "The correct answer, where A is the first option, B is the second, and so on.",
    ),
});

export type Question = z.infer<typeof questionSchema>;

export const questionsSchema = z.array(questionSchema).length(4);

// Flashcard schema
export const flashcardSchema = z.object({
  term: z.string().describe("The key term or concept from the document"),
  definition: z.string().describe("The definition or explanation of the term"),
});

export type Flashcard = z.infer<typeof flashcardSchema>;

export const flashcardsSchema = z.array(flashcardSchema).length(8);

// Matching exercise schema
export const matchingItemSchema = z.object({
  id: z.string().describe("Unique identifier for this matching item"),
  left: z.string().describe("The term or concept on the left side"),
  right: z.string().describe("The matching definition or related concept on the right side"),
});

export type MatchingItem = z.infer<typeof matchingItemSchema>;

export const matchingExerciseSchema = z.array(matchingItemSchema).length(6);
