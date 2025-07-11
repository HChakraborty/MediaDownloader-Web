import Button from "@/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/card";
import Input from "@/ui/input";
import { Label } from "@radix-ui/react-label";
import google from "@/assets/icons/google.svg";
import {
  email,
  emailDescription,
  forgotPassword,
  googleLogin,
  login,
  loginTitle,
  password,
  signUp,
} from "@/constants/constants";
import { X } from "lucide-react";

type AuthenticationProp = {
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthenticationCard = (props: AuthenticationProp) => {
  return (
    <Card className="w-full max-w-sm bg-zinc-100 border border-zinc-200 shadow-lg relative">
      <CardHeader className="relative">
        {/* Close + Sign Up in top-right corner */}
        <div className="absolute top-0 right-0 flex items-center gap-2">
          <a
            href="#"
            className="text-sm underline-offset-4 hover:underline whitespace-nowrap"
          >
            {signUp}
          </a>
          <div className="-mt-3 sm:-mt-2 mr-2">
            <button
              className="text-neutral-500 hover:text-neutral-700 bg-white dark:bg-black rounded-full p-2 shadow"
              onClick={() => props.setShowLogin(false)}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <CardTitle>{loginTitle}</CardTitle>
        <CardDescription>{emailDescription}</CardDescription>
      </CardHeader>

      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">{email}</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">{password}</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  {forgotPassword}
                </a>
              </div>
              <Input id="password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          {login}
        </Button>
        <Button variant="outline" className="w-full">
          <img src={google} alt="Google" className="h-4 w-4 mr-2" />
          {googleLogin}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuthenticationCard;
