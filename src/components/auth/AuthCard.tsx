                  "use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, Loader2, Mail, X } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { UserRole, useUserRole } from "@/contexts/UserRoleContext";

interface AuthCardProps {
  onAuthSuccess?: () => void;
}

export function AuthCard({ onAuthSuccess }: AuthCardProps) {
  const { signIn } = useAuth();
  const [step, setStep] = useState<"userType" | "signIn" | { email: string }>("userType");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setRole } = useUserRole();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get("email") as string;
      const { error } = await signIn("email-otp", { email });
      if (error) throw error;
      setStep({ email });
      setIsLoading(false);
    } catch (error) {
      console.error("Email sign-in error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to send verification code. Please try again."
      );
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const email = (step as { email: string }).email;
      const { error } = await signIn("email-otp", { email, code: otp });
      if (error) throw error;
      
      if (onAuthSuccess) {
        onAuthSuccess();
      }
      
      router.push("http://localhost:3000/protected");
      
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("The verification code you entered is incorrect.");
      setIsLoading(false);
      setOtp("");
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await signIn("google", {});
      if (error) throw error;
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to sign in with Google. Please try again."
      );
      setIsLoading(false);
    }
  };
  const handleSelectRole = (role: UserRole) => {
    setRole(role);
    setStep("signIn");
  };

  return (
    <>
      <div className="flex items-center justify-center h-full flex-col">
        <Card className="min-w-[350px] pb-0 border shadow-md">
          {step === "signIn" ? (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Get Started</CardTitle>
                <CardDescription>
                  Sign in or sign up to continue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <Image
                    src="./auth.svg"
                    alt="Lock Icon"
                    width={200}
                    height={200}
                    className="rounded-lg -mt-4"
                  />
                </div>
                <div className="space-y-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Image
                        src="/google.svg"
                        alt="Google"
                        width={20}
                        height={20}
                        className="mr-2"
                      />
                    )}
                    Continue with Google
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Or continue with email
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleEmailSubmit}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <div className="relative flex-1">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            name="email"
                            placeholder="name@example.com"
                            type="email"
                            className="pl-9"
                            disabled={isLoading}
                            required
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          "Continue with Email"
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
                {error && (
                  <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
                )}
              </CardContent>
            </>
          ) : step === 'userType' ? 
          
          <>
            <CardContent className="text-center">
              <CardTitle className="text-2xl font-bold">Choose Your Role</CardTitle>
              <CardDescription className="text-muted-foreground mt-2 mb-8">
                Select how you'll be using Florence
              </CardDescription>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center h-50 w-50 transition-all hover:scale-[1.02] active:scale-[0.98] hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white"
                  onClick={() => handleSelectRole("healthcareProvider")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>

                  <span className="text-lg font-medium">Healthcare Provider</span>
                  <span className="text-sm mt-1 ">I provide healthcare services</span>
                </Button>

                <Button
                  variant="outline" 
                  className="flex flex-col items-center justify-center h-50 w-50 transition-all hover:scale-[1.02] active:scale-[0.98] hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white"
                  onClick={() => handleSelectRole("customer")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                  <span className="text-lg font-medium">Customer</span>
                  <span className="text-sm mt-1">I own Florence cameras</span>
                </Button>
              </div>
            </CardContent>
          </>
          
          : (
            <>
              <CardHeader className="text-center mt-4">
                <CardTitle>Check your email</CardTitle>
                <CardDescription>
                  We've sent a code to {step.email}
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleOtpSubmit}>
                <CardContent className="pb-4">
                  <div className="flex justify-center">
                    <InputOTP
                      value={otp}
                      onChange={setOtp}
                      maxLength={6}
                      disabled={isLoading}
                    >
                      <InputOTPGroup>
                        {Array.from({ length: 6 }).map((_, index) => (
                          <InputOTPSlot key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-500 text-center">
                      {error}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground text-center mt-4">
                    Didn't receive a code?{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto"
                      onClick={() => setStep("signIn")}
                    >
                      Try again
                    </Button>
                  </p>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify code
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep("signIn")}
                    disabled={isLoading}
                    className="w-full"
                  >
                    Use different email
                  </Button>
                </CardFooter>
              </form>
            </>
          )}

          <div className="py-4 px-6 text-xs text-center text-muted-foreground bg-muted border-t rounded-b-lg">
            Florence © 2025
          </div>
        </Card>
      </div>
    </>
  );
}
