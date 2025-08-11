import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Hero } from "./hero";
import { RainbowButton } from "./magicui/rainbow-button";

export function SignedOut() {
  return (
    <div className="min-h-screen flex flex-col gap-3 items-center justify-center">
      <Hero />
      <SignInButton mode="modal">
        <RainbowButton className="text-white rounded-full font-medium text-sm sm:text-base h-6 w-[200px] sm:h-12 px-4 sm:px-5 cursor-pointer">
          Sign In
        </RainbowButton>
      </SignInButton>
      <SignUpButton mode="modal">
        <RainbowButton className="text-white rounded-full font-medium text-sm sm:text-base h-6 w-[200px] sm:h-12 px-4 sm:px-5 cursor-pointer">
          Sign Up
        </RainbowButton>
      </SignUpButton>
    </div>
  );
}
