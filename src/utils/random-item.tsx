const getRandomItem = <T,>(arr: T[]): T => {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error("getRandomItem: array must not be empty");
  }
  return arr[Math.floor(Math.random() * arr.length)];
};

export default getRandomItem;
