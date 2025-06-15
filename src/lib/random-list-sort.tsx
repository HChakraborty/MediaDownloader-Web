import { useMemo } from "react";

const getSortedItems: <T>(arr: T[]) => T[] = (arr) => {
  return [...arr].sort(() => 0.5 - Math.random());
};

const getRandomSortedItems: <T>(arr: T[]) => T[] = (arr) => {
  return useMemo(() => getSortedItems(arr), [arr]);
};

export default getRandomSortedItems;
