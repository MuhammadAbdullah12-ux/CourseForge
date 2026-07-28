import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-12 md:py-20">
      {/* Pre-built Clerk Sign-In Widget */}
      <SignIn />
    </main>
  );
}
