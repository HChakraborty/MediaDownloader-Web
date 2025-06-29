import Button from "@/ui/button";
import {
  Card,
  CardAction,
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

const AuthenticationCard = () => {
  return (
    <Card className="w-full max-w-sm bg-zinc-100 border border-zinc-200 shadow-lg">
      <CardHeader>
        <CardTitle>{loginTitle}</CardTitle>
        <CardDescription>{emailDescription}</CardDescription>
        <CardAction>
          <Button variant="link">{signUp}</Button>
        </CardAction>
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
