import { LoginForm } from "@/components/auth-forms";
import { PreserveRedirectLink } from "@/components/preserve-redirect-link";

export default function Login() {
  return (
    <>
      <title>Login | The App</title>
      <meta name="description" content="Login" />

      <main className="max-w-lg mx-auto px-4 py-8 min-h-full flex flex-col items-center justify-center">
        <div className="w-full">
          <div className="prose prose-sm mb-4">
            <h1>Login</h1>
            <p>
              Welcome back! Please enter your details, or{" "}
              <PreserveRedirectLink to="/signup" className="link link-primary">
                sign up
              </PreserveRedirectLink>
              .
            </p>
          </div>
          <LoginForm />
        </div>
      </main>
    </>
  );
}
