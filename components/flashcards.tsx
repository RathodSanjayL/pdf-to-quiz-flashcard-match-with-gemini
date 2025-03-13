import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RefreshCw, FileText } from "lucide-react";
import { Flashcard } from "@/lib/schemas";

type FlashcardsProps = {
  flashcards: Flashcard[];
  clearPDF: () => void;
  title: string;
};

export default function Flashcards({
  flashcards,
  clearPDF,
  title = "Flashcards",
}: FlashcardsProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleNextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setFlipped(false);
    } else {
      setCompleted(true);
    }
  };

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setFlipped(false);
    }
  };

  const handleReset = () => {
    setCurrentCardIndex(0);
    setFlipped(false);
    setCompleted(false);
  };

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] p-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <h1 className="text-2xl font-bold">Flashcards Completed!</h1>
          <p className="text-muted-foreground">
            You&apos;ve gone through all the flashcards.
          </p>
          <div className="flex flex-col space-y-4">
            <Button onClick={handleReset} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Start Over
            </Button>
            <Button onClick={clearPDF} variant="outline" className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              Upload New PDF
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] p-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <h1 className="text-2xl font-bold">No Flashcards Available</h1>
          <p className="text-muted-foreground">
            There was an issue generating flashcards. Please try again.
          </p>
          <Button onClick={clearPDF} variant="outline" className="w-full">
            <FileText className="mr-2 h-4 w-4" />
            Upload New PDF
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="text-sm text-muted-foreground">
            {currentCardIndex + 1} / {flashcards.length}
          </div>
        </div>

        <div 
          onClick={handleFlip}
          className="w-full aspect-[3/2] cursor-pointer perspective-1000"
        >
          <motion.div
            className="relative w-full h-full"
            initial={false}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div 
              className={`absolute w-full h-full flex items-center justify-center p-6 rounded-lg border-2 border-primary/20 bg-card backface-hidden`}
            >
              <h2 className="text-xl font-semibold text-center">
                {flashcards[currentCardIndex].term}
              </h2>
            </div>
            <div 
              className={`absolute w-full h-full flex items-center justify-center p-6 rounded-lg border-2 border-primary/20 bg-card backface-hidden`}
              style={{ transform: "rotateY(180deg)" }}
            >
              <p className="text-center">
                {flashcards[currentCardIndex].definition}
              </p>
            </div>
          </motion.div>
        </div>

        <p className="text-sm text-center text-muted-foreground">
          Click the card to flip it
        </p>

        <div className="flex justify-between">
          <Button
            onClick={handlePreviousCard}
            disabled={currentCardIndex === 0}
            variant="outline"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button onClick={handleNextCard}>
            {currentCardIndex === flashcards.length - 1 ? "Finish" : "Next"}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
} 