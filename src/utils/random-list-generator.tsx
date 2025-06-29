const getRandomItems = <T,>(arr: T[], count = 10): T[] => {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error("array must not be empty");
  }

  const safeCount = Math.min(count, arr.length);
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, safeCount);
};



export default getRandomItems;
