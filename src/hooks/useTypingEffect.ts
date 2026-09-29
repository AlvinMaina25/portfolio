import { useEffect, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

interface TypingOptions {
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseAfterWord?: number;
  pauseBeforeType?: number;
}

/**
 * Types each word, pauses, deletes it, then moves to the next (looping). Timings are
 * the legacy ones. One setTimeout is pending at a time and it is cleared on unmount.
 * With reduced motion it returns the first word, fully typed, and never animates.
 */
export function useTypingEffect(
  words: readonly string[],
  {
    typingSpeed = 80,
    deletingSpeed = 40,
    pauseAfterWord = 1800,
    pauseBeforeType = 400,
  }: TypingOptions = {},
): string {
  const reducedMotion = useReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const wordsKey = words.join("|");

  useEffect(() => {
    if (reducedMotion || words.length === 0) return;
    const current = words[wordIndex % words.length];

    let delay: number;
    let step: () => void;

    if (!deleting && length < current.length) {
      delay = typingSpeed;
      step = () => setLength(length + 1);
    } else if (!deleting) {
      // fully typed: hold, then start deleting
      delay = pauseAfterWord;
      step = () => setDeleting(true);
    } else if (length > 0) {
      delay = deletingSpeed;
      step = () => setLength(length - 1);
    } else {
      // fully deleted: brief pause, then the next word
      delay = pauseBeforeType;
      step = () => {
        setDeleting(false);
        setWordIndex((wordIndex + 1) % words.length);
      };
    }

    const timer = window.setTimeout(step, delay);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `words` is tracked through wordsKey
  }, [reducedMotion, wordsKey, wordIndex, length, deleting, typingSpeed, deletingSpeed, pauseAfterWord, pauseBeforeType]);

  if (words.length === 0) return "";
  if (reducedMotion) return words[0];
  return words[wordIndex % words.length].slice(0, length);
}
