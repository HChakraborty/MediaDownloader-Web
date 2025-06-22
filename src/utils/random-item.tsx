const getRandomItem = <T,>(arr: T[]): T => {
  const value = arr[Math.floor(Math.random() * arr.length)];
  return value;
};

export default getRandomItem;
