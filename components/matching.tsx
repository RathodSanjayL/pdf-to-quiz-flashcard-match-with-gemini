import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RefreshCw, FileText, Check, X } from "lucide-react";
import { MatchingItem } from "@/lib/schemas";

type MatchingProps = {
  matchingItems: MatchingItem[];
  clearPDF: () => void;
  title: string;
};

export default function Matching({
  matchingItems,
  clearPDF,
  title = "Matching Exercise",
}: MatchingProps) {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [shuffledRight, setShuffledRight] = useState<Array<{ id: string; content: string }>>([]);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // Shuffle the right side items
  useEffect(() => {
    if (!matchingItems || matchingItems.length === 0) return;
    
    const rightItems = matchingItems.map(item => ({
      id: item.id,
      content: item.right
    }));
    setShuffledRight(shuffleArray([...rightItems]));
  }, [matchingItems]);

  // Check if all items are matched
  useEffect(() => {
    if (Object.keys(matches).length === matchingItems.length) {
      setCompleted(true);
      // Calculate score
      let correctMatches = 0;
      Object.entries(matches).forEach(([leftId, rightId]) => {
        if (leftId === rightId) {
          correctMatches++;
        }
      });
      setScore(correctMatches);
    }
  }, [matches, matchingItems]);

  const handleLeftSelect = (id: string) => {
    if (id in matches) return; // Already matched
    setSelectedLeft(id);
    if (selectedRight) {
      // Make a match
      setMatches(prev => ({
        ...prev,
        [id]: selectedRight
      }));
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  };

  const handleRightSelect = (id: string) => {
    if (Object.values(matches).includes(id)) return; // Already matched
    setSelectedRight(id);
    if (selectedLeft) {
      // Make a match
      setMatches(prev => ({
        ...prev,
        [selectedLeft]: id
      }));
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  };

  const handleReset = () => {
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatches({});
    setCompleted(false);
    setScore(0);
    setShuffledRight(shuffleArray([...shuffledRight]));
  };

  // Fisher-Yates shuffle algorithm
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  if (!matchingItems || matchingItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] p-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <h1 className="text-2xl font-bold">No Matching Exercise Available</h1>
          <p className="text-muted-foreground">
            There was an issue generating the matching exercise. Please try again.
          </p>
          <Button onClick={clearPDF} variant="outline" className="w-full">
            <FileText className="mr-2 h-4 w-4" />
            Upload New PDF
          </Button>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] p-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <h1 className="text-2xl font-bold">Exercise Completed!</h1>
          <div className="text-xl">
            Your Score: {score} / {matchingItems.length}
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Correct Answers:</h2>
            <div className="space-y-2">
              {matchingItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 rounded-lg border">
                  <div className="font-medium">{item.left}</div>
                  <div className="text-muted-foreground">{item.right}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col space-y-4">
            <Button onClick={handleReset} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
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

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] p-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="text-sm text-muted-foreground">
            Matched: {Object.keys(matches).length} / {matchingItems.length}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Terms</h2>
            {matchingItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleLeftSelect(item.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  item.id in matches
                    ? "border-green-500 bg-green-500/10"
                    : selectedLeft === item.id
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-primary/20 hover:border-primary/40"
                }`}
              >
                <div className="font-medium">{item.left}</div>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Definitions</h2>
            {shuffledRight.map((item) => (
              <div
                key={item.id}
                onClick={() => handleRightSelect(item.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  Object.values(matches).includes(item.id)
                    ? "border-green-500 bg-green-500/10"
                    : selectedRight === item.id
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-primary/20 hover:border-primary/40"
                }`}
              >
                <div>{item.content}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-center text-muted-foreground">
          Click on a term and then click on its matching definition
        </p>

        <div className="flex justify-center">
          <Button onClick={handleReset} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
} 