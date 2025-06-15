import { useMemo } from "react";

const randomItemGenerator: <T>(arr: T[], count?: number) => T[] = (
  arr,
  count = 10
) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getRandomItems: <T>(arr: T[], count?: number) => T[] = (
  arr,
  count = 10
) => {
  return useMemo(() => randomItemGenerator(arr, count), [arr]);
};

export default getRandomItems;
