import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-12 md:py-20">
      {/* Pre-built Clerk Sign-Up Widget */}
      <SignUp />
    </main>
  );
}
