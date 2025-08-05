import { SignupForm } from "@/components/auth-forms";
import { PreserveRedirectLink } from "@/components/preserve-redirect-link";

export default function Signup() {
  return (
    <>
      <title>Signup | The App</title>
      <meta name="description" content="Signup" />

      <main className="max-w-lg mx-auto px-4 py-8 min-h-full flex flex-col items-center justify-center">
        <div className="w-full">
          <div className="prose prose-sm mb-4">
            <h1>Signup</h1>
            <p>
              Get started with your free trial, or{" "}
              <PreserveRedirectLink to="/login" className="link link-primary">
                login
              </PreserveRedirectLink>
              .
            </p>
          </div>
          <SignupForm />
        </div>
      </main>
    </>
  );
}
