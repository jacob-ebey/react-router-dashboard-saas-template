import { Link, Outlet, redirect, type LoaderFunctionArgs } from "react-router";

import { LoginForm, LogoutForm, SignupForm } from "@/components/auth-forms";
import { GloablLoader } from "@/components/global-loader";
import { ScrollRestoration } from "@/components/scroll-restoration";
import { getUser } from "@/lib/auth";

import { openLoginModal, openSignupModal } from "./client";

declare global {
  var login_modal: HTMLDialogElement;
  var signup_modal: HTMLDialogElement;
}

export function loader({ request }: LoaderFunctionArgs) {
  const user = getUser();
  const url = new URL(request.url);

  if (user && url.pathname === "/") {
    throw redirect("/app");
  }
}

export default function MarketingLayout() {
  const user = getUser();

  const loggedIn = Boolean(user);

  return (
    <>
      <div className="bg-base-100 min-h-screen grid grid-rows-[auto_1fr_auto]">
        <div className="bg-base-200 shadow-sm sticky top-0 z-50">
          <header
            className="navbar max-w-screen-xl mx-auto"
            aria-label="Navbar"
          >
            <div className="navbar-start">
              <Link to="/" className="text-xl font-bold">
                ✨ The App
              </Link>
            </div>
            <nav className="navbar-center hidden lg:flex">
              <ul
                className="menu menu-horizontal px-1"
                role="menu"
                aria-orientation="horizontal"
              >
                <li role="presentation">
                  <Link role="menuitem" to="/#features">
                    Features
                  </Link>
                </li>
                <li role="presentation">
                  <Link role="menuitem" to="/#testimonials">
                    Testimonials
                  </Link>
                </li>
                <li role="presentation">
                  <Link role="menuitem" to="/#pricing">
                    Pricing
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="navbar-end gap-2">
              <GloablLoader />
              {loggedIn ? (
                <LogoutForm />
              ) : (
                <>
                  <Link
                    to="/login"
                    className="btn btn-ghost"
                    onClick={openLoginModal}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="btn btn-secondary"
                    onClick={openSignupModal}
                  >
                    Start Free Trial
                  </Link>
                </>
              )}
            </div>
          </header>
        </div>

        <div>
          <Outlet />
        </div>

        <div>
          <footer className="footer p-10 bg-base-300 text-base-content grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <span className="footer-title">The App</span>
              <a className="link link-hover">About our mission</a>
              <a className="link link-hover">Thought leadership</a>
              <a className="link link-hover">Disruption blog</a>
              <a className="link link-hover">Synergy careers</a>
            </div>
            <div>
              <span className="footer-title">Solutions</span>
              <a className="link link-hover">AI Integration</a>
              <a className="link link-hover">Quantum Scaling</a>
              <a className="link link-hover">Blockchain Synergy</a>
              <a className="link link-hover">Metaverse Ready</a>
            </div>
            <div>
              <span className="footer-title">Resources</span>
              <a className="link link-hover">Disruption Guide</a>
              <a className="link link-hover">API Documentation</a>
              <a className="link link-hover">Success Stories</a>
              <a className="link link-hover">Mindset Optimization</a>
            </div>
            <div>
              <span className="footer-title">Legal</span>
              <a className="link link-hover">Terms of Disruption</a>
              <a className="link link-hover">Privacy Policy</a>
              <a className="link link-hover">Cookie Policy</a>
              <a className="link link-hover">Quantum Compliance</a>
            </div>
          </footer>

          <div className="footer footer-center p-4 bg-base-300 text-base-content border-t border-base-200">
            <div>
              <p>
                Copyright © 2024 - The App™ - Disrupting productivity since last
                Tuesday
              </p>
            </div>
          </div>
        </div>
      </div>

      {!loggedIn && (
        <>
          <dialog
            id="login_modal"
            className="modal modal-end"
            aria-labelledby="login-modal-title"
            aria-describedby="login-modal-description"
          >
            <div className="modal-box max-w-lg w-full">
              <form method="dialog">
                <button
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                  type="submit"
                  aria-label="Close login dialog"
                >
                  ✕
                </button>
              </form>
              <h3 className="text-lg font-bold mb-4" id="login-modal-title">
                Login
              </h3>
              <p className="my-4" id="login-modal-description">
                Welcome back! Please enter your details.
              </p>
              <LoginForm />
            </div>
          </dialog>
          <dialog
            id="signup_modal"
            className="modal modal-end"
            aria-labelledby="signup-modal-title"
            aria-describedby="signup-modal-description"
          >
            <div className="modal-box max-w-lg w-full">
              <form method="dialog">
                <button
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                  type="submit"
                  aria-label="Close signup dialog"
                >
                  ✕
                </button>
              </form>
              <h3 className="text-lg font-bold" id="signup-modal-title">
                Signup
              </h3>
              <p className="my-4" id="signup-modal-description">
                Get started with your free trial.
              </p>
              <SignupForm />
            </div>
          </dialog>
        </>
      )}

      <ScrollRestoration />
    </>
  );
}
