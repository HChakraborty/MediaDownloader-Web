import { IconHome, IconMessage, IconUser } from "@tabler/icons-react";
import bridge from "@/assets/images/bridge.avif";
import deer from "@/assets/images/deer.avif";
import forest from "@/assets/images/forest.avif";
import { cva } from "class-variance-authority";

export const categoriesButtonLabel: string[] = [
  "Money",
  "Love",
  "Fashion",
  "Food",
  "Games",
  "Speed",
  "Future",
  "Nature",
  "Ocean",
  "Fire",
  "Water",
  "Earth",
  "Rain",
  "Flower",
  "Mountain",
  "Forest",
  "Desert",
  "Snow",
  "Ice",
  "Dog",
  "Cat",
  "Fish",
  "Wolf",
  "Tiger",
  "Bear",
  "Horse",
  "Snake",
  "Bird",
  "Pets",
  "Mouse",
  "Computer",
  "Mobile",
  "Tech",
  "Cloud",
  "Cyber",
  "Code",
  "Hacker",
  "Matrix",
  "Neon",
  "Pixel",
  "Dragon",
  "Ghost",
  "Robot",
  "Alien",
  "Magic",
  "Sword",
  "Wizard",
  "Witch",
  "Vampire",
  "Zombie",
  "Samurai",
  "Ninja",
  "Moon",
  "Sun",
  "Sky",
  "Stars",
  "Planet",
  "Rocket",
  "Space",
  "USA",
  "India",
  "City",
  "Bridge",
  "Tower",
  "Castle",
  "Temple",
  "Village",
  "Cave",
  "Lake",
  "River",
  "Car",
  "Train",
  "Boat",
  "Plane",
  "Time",
  "Shadow",
  "Mirror",
  "Dream",
  "Light",
  "Dark",
  "Energy",
  "Vibe",
  "Noise",
  "Storm",
  "Smoke",
  "Lava",
  "Crystal",
];

export const messages: string[] = [
  "Ask  OpenImage  catalogue  anything",
  "Download  high-quality  images  easily",
  "Search  optimized  for  different  formats",
  //"Batch  download  with  one  click",
  //"Edit and enhance images with AI",
  "Simple,  fast,  and  user-friendly",
];

export const productName: string = "OpenImage";

export const maxRetryError: string =
  "Max retries exceeded while fetching Openverse images.";

export const slowLoadingWarning: string =
  "First load may be slow due to Netlify free hosting. Please reload — we’ll fix this soon.";

export const breakpointColumnsObj: Record<number, number> & {
  default: number;
} = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

export const httpRequestProcessWarning: string =
  "Unable to process your request!";

export const extensions: string[] = [
  "all",
  "png",
  "jpg",
  "jpeg",
  "gif",
  "svg",
  "webp",
  "tiff",
  "bmp",
];

export const navItems = [
  {
    name: "Home",
    link: "/",
    icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
  {
    name: "About",
    link: "/about",
    icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
  {
    name: "Contact",
    link: "/contact",
    icon: <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
];

export const buttonLabels = {
  Join: { name: "Join" },
  Upload: { name: "Upload" },
  Login: { name: "Login" },
};

export const searchSectionimages = [bridge, deer, forest];

export const loginTitle = "Login to your account";
export const emailDescription =
  "Enter your email below to login to your account";
export const signUp = "Sign Up";
export const email = "Email";
export const password = "Password";
export const forgotPassword = "Forgot your password?";
export const login = "Login";
export const googleLogin = "Login with Google";

export const buttonVariants = cva(
  // Base classes shared across all variants
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all shadow-xs outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:border-ring aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-green-500 text-white hover:bg-green-600",
        mini: "px-3 py-1.5 bg-gray-500 text-white hover:text-gray-300 hover:bg-gray-400 active:bg-white active:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
        extension:
          "text-md px-4 py-2 bg-transparent hover:bg-gray-200 hover:text-black active:bg-gray-500 active:shadow active:text-white focus-visible:outline-2 focus-visible:outline-ring",
        arrow:
          "relative overflow-hidden transition cursor-pointer shadow-lg hover:bg-gray-300/60 p-2 rounded-full bg-white/60 backdrop-blur-sm border border-black/10 dark:border-white/20",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 px-6 has-[>svg]:px-4",
        icon: "size-9 p-0",
      },
      rounded: {
        sm: "rounded-sm",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "md",
    },
  }
);

export const textPlaceholder = "Search for Images";
