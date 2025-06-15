export const Categories = [
  "Money", "Love", "Fashion", "Food", "Games", "Speed", "Future",
 "Nature", "Ocean", "Fire", "Water", "Earth", "Rain", "Flower", "Mountain", "Forest", "Desert", "Snow", "Ice",
 "Dog", "Cat", "Fish", "Wolf", "Tiger", "Bear", "Horse", "Snake", "Bird", "Pets", "Mouse",
 "Computer", "Mobile", "Tech", "Cloud", "Cyber", "Code", "Hacker", "Matrix", "Neon", "Pixel",
  "Dragon", "Ghost", "Robot", "Alien", "Magic", "Sword", "Wizard", "Witch", "Vampire", "Zombie", "Samurai", "Ninja",
  "Moon", "Sun", "Sky", "Stars", "Planet", "Rocket", "Space",
  "USA", "India", "City", "Bridge", "Tower", "Castle", "Temple", "Village", "Cave", "Lake", "River",
  "Car", "Train", "Boat", "Plane",
  "Time", "Shadow", "Mirror", "Dream", "Light", "Dark", "Energy", "Vibe", "Noise", "Storm", "Smoke", "Lava", "Crystal",
];

export const ButtonLabels = Object.values(Categories).flat();

const imageModules = import.meta.glob("@/assets/images/*.webp", { eager: true });

export const images: string[] = Object.values(imageModules).map(
  (mod: any) => mod.default.toString()
);

export const message: string[] = [
  "Ask OpenImage Catalogue Anything",
  "Download High-Quality Images Easily",
  "Batch Download With One Click",
  "Edit And Enhance Images With AI",
  "Simple, Fast, And User-Friendly",
];

export const maxRetryError =
  "Max retries exceeded while fetching Openverse images.";

export const slowLoadingWarning =
  "First load may be slow due to Netlify free hosting. Please reload — we’ll fix this soon.";

export const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

export const httpRequestProcessWarning = "Unable to process your request!";
