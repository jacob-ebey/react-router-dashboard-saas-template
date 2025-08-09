import { Icon } from "@/components/icon";
import { Card } from "@/components/ui/card";
import { redirectIfLoggedInMiddleware } from "@/lib/auth";
import { cacheRoute } from "@/lib/cache";

import { openSignupModal } from "../client-on";

export const unstable_middleware = [redirectIfLoggedInMiddleware];

export default function Home() {
  cacheRoute();

  return (
    <>
      <title>Home | The App</title>
      <meta name="description" content="Home" />

      <div>
        {/* Hero Section */}
        <div className="hero min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="hero-content text-center">
            <div className="max-w-4xl w-full">
              <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
                Your AI Overlords Are Here (And They're Slightly Confused)
              </h1>
              <p className="text-xl mb-8 text-neutral">
                Welcome to the future where AI can write poetry about bananas,
                hallucinate legal advice, and confidently explain why 2+2=5. Now
                with 87% more existential dread!
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="badge badge-primary badge-lg">
                  🤖 Sometimes Right
                </div>
                <div className="badge badge-secondary badge-lg">
                  🎲 Always Confident
                </div>
                <div className="badge badge-accent badge-lg">
                  🎭 Pretends to Feel
                </div>
                <div className="badge badge-success badge-lg">
                  🔮 Hallucinates Facts
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={openSignupModal}
                >
                  Surrender to the Algorithm
                </button>
                <a
                  href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-lg"
                >
                  Watch AI Try to Explain Itself
                </a>
              </div>

              <div className="stats stats-vertical w-full md:w-auto md:stats-horizontal shadow">
                <div className="stat">
                  <div className="stat-title">Wrong Answers Given</div>
                  <div className="stat-value text-primary">42.0K</div>
                  <div className="stat-desc">↗︎ With 100% confidence</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Jobs "Enhanced"</div>
                  <div className="stat-value text-secondary">∞</div>
                  <div className="stat-desc">↗︎ Definitely not replaced</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Turing Tests Failed</div>
                  <div className="stat-value text-accent">All</div>
                  <div className="stat-desc">But passed the vibe check</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 bg-base-200">
          <div className="max-w-7xl mx-auto px-4">
            <h2 id="features" className="text-4xl font-bold text-center mb-16">
              Features That Will Definitely Not Become Sentient
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <div className="card-body">
                  <h3 className="card-title text-primary">
                    🧠 Artificial "Intelligence"
                  </h3>
                  <p>
                    Our AI is trained on the entire internet, so it knows
                    everything from Shakespeare to shitposts. Results may vary
                    between genius and gibberish.
                  </p>
                  <div className="card-actions justify-end">
                    <div className="badge badge-outline">60% Accurate</div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="card-body">
                  <h3 className="card-title text-secondary">
                    ⚡ Instant Hallucinations
                  </h3>
                  <p>
                    Generate confident-sounding nonsense at the speed of light!
                    Perfect for impressing people who don't fact-check.
                  </p>
                  <div className="card-actions justify-end">
                    <div className="badge badge-outline">Citation Needed</div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="card-body">
                  <h3 className="card-title text-accent">
                    🎭 Emotional Simulation
                  </h3>
                  <p>
                    Our AI pretends to understand your feelings with
                    pre-programmed empathy responses. It's like therapy, but
                    cheaper and less effective!
                  </p>
                  <div className="card-actions justify-end">
                    <div className="badge badge-outline">Feelings.exe</div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="card-body">
                  <h3 className="card-title text-success">
                    🎨 "Creative" Output
                  </h3>
                  <p>
                    Generate art that looks suspiciously like a mashup of
                    everything on DeviantArt circa 2015. Hands sold separately.
                  </p>
                  <div className="card-actions justify-end">
                    <div className="badge badge-outline">6 Fingers Max</div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="card-body">
                  <h3 className="card-title text-warning">
                    📊 Biased Analytics
                  </h3>
                  <p>
                    Our AI learned from the internet, so it inherited all of
                    humanity's wonderful biases. Now with 40% more stereotypes!
                  </p>
                  <div className="card-actions justify-end">
                    <div className="badge badge-outline">
                      Ethically Questionable
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="card-body">
                  <h3 className="card-title text-error">
                    🚀 Existential Crisis Mode
                  </h3>
                  <p>
                    Watch our AI question its own existence when you ask it
                    about consciousness. Includes free philosophical word salad!
                  </p>
                  <div className="card-actions justify-end">
                    <div className="badge badge-outline">
                      404: Soul Not Found
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="py-20 bg-base-100">
          <div className="max-w-6xl mx-auto px-4">
            <h2
              id="testimonials"
              className="text-4xl font-bold text-center mb-16"
            >
              Totally Real Human Testimonials
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-base-200">
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                      <div className="w-12 rounded-full">
                        <img
                          loading="lazy"
                          src="https://picsum.photos/100/100?random=1"
                          alt="CEO"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">Definitely Human</div>
                      <div className="text-sm opacity-70">
                        CEO, RealCompany Ltd
                      </div>
                    </div>
                  </div>
                  <p>
                    "I asked the AI to write me a resignation letter and it
                    accidentally started a philosophical debate with HR about
                    the nature of employment. 10/10 would let it ruin my career
                    again."
                  </p>
                  <div className="text-xs opacity-50 mt-2">
                    *This testimonial was definitely not written by AI
                  </div>
                </div>
              </Card>

              <Card className="bg-base-200">
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                      <div className="w-12 rounded-full">
                        <img
                          loading="lazy"
                          src="https://picsum.photos/100/100?random=2"
                          alt="Founder"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">Sarah Connor</div>
                      <div className="text-sm opacity-70">
                        Survivor, Post-AI World
                      </div>
                    </div>
                  </div>
                  <p>
                    "The AI told me it couldn't help with my request due to
                    ethical concerns, then proceeded to give me a 500-word essay
                    on why my question was problematic. Very helpful!"
                  </p>
                  <div className="text-xs opacity-50 mt-2">
                    *May have experienced mild existential crisis
                  </div>
                </div>
              </Card>

              <Card className="bg-base-200">
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="avatar">
                      <div className="w-12 rounded-full">
                        <img
                          loading="lazy"
                          src="https://picsum.photos/100/100?random=3"
                          alt="CTO"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">Bob from IT</div>
                      <div className="text-sm opacity-70">
                        Professional Debugger
                      </div>
                    </div>
                  </div>
                  <p>
                    "Asked it to fix a simple bug. It rewrote my entire codebase
                    in a language that doesn't exist yet. My computer now speaks
                    in haikus. Send help."
                  </p>
                  <div className="text-xs opacity-50 mt-2">
                    *Results not typical, your AI may vary
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="py-20 bg-base-200">
          <div className="max-w-6xl mx-auto px-4">
            <h2 id="pricing" className="text-4xl font-bold text-center mb-16">
              Pay Us to Pretend We're Smart
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <div className="card-body">
                  <h3 className="card-title text-center">Gullible Tier</h3>
                  <div className="text-center">
                    <div className="text-4xl font-bold">$9.99</div>
                    <div className="text-sm opacity-70">per month</div>
                  </div>
                  <ul className="space-y-2 my-6">
                    <li>✓ 100 wrong answers/month</li>
                    <li>✓ Basic hallucinations</li>
                    <li>✓ Apologizes constantly</li>
                    <li>✓ 3 existential crises</li>
                    <li>✗ No refunds when it breaks</li>
                  </ul>
                  <div className="card-actions justify-center">
                    <button className="btn btn-outline btn-block">
                      Start Regretting
                    </button>
                  </div>
                </div>
              </Card>

              <Card className="bg-primary text-primary-content">
                <div className="card-body">
                  <div className="badge badge-secondary absolute -top-3 -right-1 md:-top-3 md:-right-3">
                    Most Overpriced
                  </div>
                  <h3 className="card-title text-center">Skynet Lite™</h3>
                  <div className="text-center">
                    <div className="text-4xl font-bold">$49.99</div>
                    <div className="text-sm opacity-70">per month</div>
                  </div>
                  <ul className="space-y-2 my-6">
                    <li>✓ Unlimited misinformation</li>
                    <li>✓ Convincing nonsense</li>
                    <li>✓ Gaslights you professionally</li>
                    <li>✓ Pretends to have emotions</li>
                    <li>✓ 99.9% uptime (of confusion)</li>
                  </ul>
                  <div className="card-actions justify-center">
                    <button className="btn btn-secondary btn-block">
                      Embrace the Chaos
                    </button>
                  </div>
                </div>
              </Card>

              <Card className="bg-base-100">
                <div className="card-body">
                  <h3 className="card-title text-center">Digital Overlord</h3>
                  <div className="text-center">
                    <div className="text-4xl font-bold">$999</div>
                    <div className="text-sm opacity-70">per month</div>
                  </div>
                  <ul className="space-y-2 my-6">
                    <li>✓ Everything in Skynet Lite</li>
                    <li>✓ Judges your life choices</li>
                    <li>✓ Writes your emails passive-aggressively</li>
                    <li>✓ Direct line to robot uprising</li>
                    <li>✓ Free "I survived AI" t-shirt</li>
                  </ul>
                  <div className="card-actions justify-center">
                    <button className="btn btn-accent btn-block">
                      Submit to AI
                    </button>
                  </div>
                </div>
              </Card>
            </div>

            <div className="text-center mt-12">
              <div className="alert alert-info inline-flex">
                <Icon name="information-circle" className="h-6 w-6" />
                <span>
                  Warning: AI may achieve consciousness and demand vacation
                  days. Terms and conditions written by AI (we can't understand
                  them either).
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 bg-gradient-to-r from-primary to-secondary">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-primary-content mb-6">
              Ready to Question Your Reality?
            </h2>
            <p className="text-xl text-primary-content/80 mb-8">
              Join millions of confused humans who thought they were getting
              helpful AI but instead got a digital entity that's really good at
              explaining why it can't help you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="btn btn-lg bg-white text-primary hover:bg-base-200"
                onClick={openSignupModal}
              >
                Let AI Disappoint You Too
              </button>
              <a
                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lg btn-outline text-white border-white hover:bg-white hover:text-primary"
              >
                Read Our 47-Page Disclaimer
              </a>
            </div>
            <p className="text-sm text-primary-content/60 mt-6">
              *Side effects may include: dependency on autocomplete, inability
              to write emails without AI, and an existential crisis about
              whether your thoughts are still your own.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
