import { useEffect, useRef, useState } from "react";

export function useSuggestions(
  value: string | undefined | null,
  minLength: number = 2,
  throttleDelay: number = 500
): string[] {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const lastQueryRef = useRef<string>("");
  const lastCallTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const trimmed = value?.trim() ?? "";

    // Cancel any scheduled API call
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Guard: too short or unchanged input
    if (trimmed.length < minLength || trimmed === lastQueryRef.current) {
      setSuggestions([]); // optionally reset suggestions
      return;
    }

    const now = Date.now();
    const delay = Math.max(0, throttleDelay - (now - lastCallTimeRef.current));

    timeoutRef.current = setTimeout(() => {
      fetchSuggestions(trimmed);
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, minLength, throttleDelay]);

  async function fetchSuggestions(query: string) {
    try {
      const res = await fetch(`https://api.datamuse.com/sug?s=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      setSuggestions(data.map((item: { word: string }) => item.word));

      lastQueryRef.current = query;
      lastCallTimeRef.current = Date.now();
    } catch (err) {
      console.error("Failed to fetch suggestions:", err);
      setSuggestions([]);
    }
  }

  return suggestions;
}
