const getRandomPageNumber = (PAGE_SIZE: number): number => {
  return Math.floor(Math.random() * PAGE_SIZE) + 1;
};

export default getRandomPageNumber;