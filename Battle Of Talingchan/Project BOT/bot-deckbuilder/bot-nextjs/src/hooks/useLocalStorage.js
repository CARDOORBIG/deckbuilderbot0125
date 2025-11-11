// src/hooks/useLocalStorage.js

import { useState, useEffect } from "react";

export function useLocalStorage(key, initial) {
  const [v, s] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw || raw === "[]" || raw === "null") return initial;
      return JSON.parse(raw);
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {}
  }, [key, v]);

  return [v, s];
}