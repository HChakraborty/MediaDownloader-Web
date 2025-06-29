const getRandomSortedItems: <T>(arr: T[]) => T[] = (arr) => {
  return [...arr].sort(() => 0.5 - Math.random());
};

export default getRandomSortedItems;
