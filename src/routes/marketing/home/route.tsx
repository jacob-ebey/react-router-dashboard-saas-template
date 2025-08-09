import { Icon } from "@/components/icon";
import { Card } from "@/components/ui/card";

import { openSignupModal } from "../client-on";
import { data, type HeadersFunction } from "react-router";

export const loader = () =>
  data(null, {
    headers: {
      "CDN-Cache-Control": "public, s-maxage=60",
      "Vercel-CDN-Cache-Control": "public, s-maxage=60",
    },
  });

export const headers: HeadersFunction = ({ loaderHeaders }) => loaderHeaders;

export default function Home() {
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
                Revolutionize Your Productivity with AI-Powered Synergy
              </h1>
              <p className="text-xl mb-8 text-neutral">
                The only platform you'll ever need to disrupt your workflow,
                leverage cutting-edge blockchain synergies, and scale your
                mindset in the cloud. Now with 10x more AI!
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="badge badge-primary badge-lg">
                  🚀 10x Productivity
                </div>
                <div className="badge badge-secondary badge-lg">
                  🤖 AI-Powered
                </div>
                <div className="badge badge-accent badge-lg">
                  ☁️ Cloud-Native
                </div>
                <div className="badge badge-success badge-lg">
                  🔒 Blockchain-Secured
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={openSignupModal}
                >
                  Start Your Journey to Excellence
                </button>
                <a
                  href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-lg"
                >
                  Watch 47-Minute Demo
                </a>
              </div>

              <div className="stats stats-vertical w-full md:w-auto md:stats-horizontal shadow">
                <div className="stat">
                  <div className="stat-title">Unicorn Startups Using Us</div>
                  <div className="stat-value text-primary">1,337</div>
                  <div className="stat-desc">↗︎ 420% increase</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Lives Changed</div>
                  <div className="stat-value text-secondary">2.4M</div>
                  <div className="stat-desc">↗︎ Mindsets disrupted</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Coffee Saved</div>
                  <div className="stat-value text-accent">89K</div>
                  <div className="stat-desc">Cups per day</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 bg-base-200">
          <div className="max-w-7xl mx-auto px-4">
            <h2 id="features" className="text-4xl font-bold text-center mb-16">
              Game-Changing Features That Will Disrupt Your Industry
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <div className="card-body">
                  <h3 className="card-title text-primary">
                    🧠 AI Thought Leadership
                  </h3>
                  <p>
                    Our proprietary algorithms will think your thoughts before
                    you think them, leveraging machine learning to optimize your
                    cognitive bandwidth.
                  </p>
                  <div className="card-actions justify-end">
                    <div className="badge badge-outline">Revolutionary</div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="card-body">
                  <h3 className="card-title text-secondary">
                    ⚡ Quantum Productivity
                  </h3>
                  <p>
                    Harness the power of quantum computing to be productive in
                    multiple dimensions simultaneously. Now with 50% more
                    quantum!
                  </p>
                  <div className="card-actions justify-end">
                    <div className="badge badge-outline">Quantum-Ready</div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="card-body">
                  <h3 className="card-title text-accent">
                    🔗 Blockchain Synergy
                  </h3>
                  <p>
                    Every task is immutably recorded on our proprietary
                    blockchain, ensuring your productivity is decentralized and
                    Web3-native.
                  </p>
                  <div className="card-actions justify-end">
                    <div className="badge badge-outline">Crypto-Enabled</div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="card-body">
                  <h3 className="card-title text-success">
                    🌐 Metaverse Integration
                  </h3>
                  <p>
                    Attend virtual meetings with your AI avatar while your real
                    self practices mindfulness in the productivity pod.
                  </p>
                  <div className="card-actions justify-end">
                    <div className="badge badge-outline">Metaverse-Ready</div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="card-body">
                  <h3 className="card-title text-warning">
                    📊 Disruption Analytics
                  </h3>
                  <p>
                    Track how much you're disrupting traditional workflows with
                    real-time disruption metrics and paradigm shift indicators.
                  </p>
                  <div className="card-actions justify-end">
                    <div className="badge badge-outline">Data-Driven</div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="card-body">
                  <h3 className="card-title text-error">
                    🚀 Scale-as-a-Service
                  </h3>
                  <p>
                    Automatically scale your ambitions based on market
                    conditions and motivational quotes from successful
                    entrepreneurs.
                  </p>
                  <div className="card-actions justify-end">
                    <div className="badge badge-outline">Scalable</div>
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
              What Thought Leaders Are Saying
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
                      <div className="font-bold">Chad Disruptor</div>
                      <div className="text-sm opacity-70">CEO, UnicornCorp</div>
                    </div>
                  </div>
                  <p>
                    "This platform literally changed my DNA. I'm now 47% more
                    synergized and my chakras are perfectly aligned with my
                    KPIs."
                  </p>
                  <div className="rating rating-sm">
                    <input
                      type="radio"
                      name="rating-1"
                      className="mask mask-star"
                      defaultChecked
                    />
                    <input
                      type="radio"
                      name="rating-1"
                      className="mask mask-star"
                      defaultChecked
                    />
                    <input
                      type="radio"
                      name="rating-1"
                      className="mask mask-star"
                      defaultChecked
                    />
                    <input
                      type="radio"
                      name="rating-1"
                      className="mask mask-star"
                      defaultChecked
                    />
                    <input
                      type="radio"
                      name="rating-1"
                      className="mask mask-star"
                      defaultChecked
                    />
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
                      <div className="font-bold">Sophia Innovate</div>
                      <div className="text-sm opacity-70">
                        Founder, DisruptTech
                      </div>
                    </div>
                  </div>
                  <p>
                    "I went from zero to thought leader in just 3 days. My
                    LinkedIn engagement is through the roof and VCs are sliding
                    into my DMs."
                  </p>
                  <div className="rating rating-sm">
                    <input
                      type="radio"
                      name="rating-2"
                      className="mask mask-star"
                      defaultChecked
                    />
                    <input
                      type="radio"
                      name="rating-2"
                      className="mask mask-star"
                      defaultChecked
                    />
                    <input
                      type="radio"
                      name="rating-2"
                      className="mask mask-star"
                      defaultChecked
                    />
                    <input
                      type="radio"
                      name="rating-2"
                      className="mask mask-star"
                      defaultChecked
                    />
                    <input
                      type="radio"
                      name="rating-2"
                      className="mask mask-star"
                      defaultChecked
                    />
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
                      <div className="font-bold">Alex Blockchain</div>
                      <div className="text-sm opacity-70">CTO, Web3Future</div>
                    </div>
                  </div>
                  <p>
                    "Before this platform, I was just a regular developer. Now
                    I'm a full-stack blockchain ninja with quantum computing
                    skills."
                  </p>
                  <div className="rating rating-sm">
                    <input
                      type="radio"
                      name="rating-3"
                      className="mask mask-star"
                      defaultChecked
                    />
                    <input
                      type="radio"
                      name="rating-3"
                      className="mask mask-star"
                      defaultChecked
                    />
                    <input
                      type="radio"
                      name="rating-3"
                      className="mask mask-star"
                      defaultChecked
                    />
                    <input
                      type="radio"
                      name="rating-3"
                      className="mask mask-star"
                      defaultChecked
                    />
                    <input
                      type="radio"
                      name="rating-3"
                      className="mask mask-star"
                      defaultChecked
                    />
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
              Investment Plans for Your Success Journey
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <div className="card-body">
                  <h3 className="card-title text-center">Aspiring Disruptor</h3>
                  <div className="text-center">
                    <div className="text-4xl font-bold">$99</div>
                    <div className="text-sm opacity-70">per month</div>
                  </div>
                  <ul className="space-y-2 my-6">
                    <li>✓ Basic AI Thoughts</li>
                    <li>✓ 5 Disruptions/month</li>
                    <li>✓ Email support</li>
                    <li>✓ LinkedIn template</li>
                    <li>✗ Quantum features</li>
                  </ul>
                  <div className="card-actions justify-center">
                    <button className="btn btn-outline btn-block">
                      Start Disrupting
                    </button>
                  </div>
                </div>
              </Card>

              <Card className="bg-primary text-primary-content">
                <div className="card-body">
                  <div className="badge badge-secondary absolute -top-3 -right-1 md:-top-3 md:-right-3">
                    Most Popular
                  </div>
                  <h3 className="card-title text-center">Thought Leader Pro</h3>
                  <div className="text-center">
                    <div className="text-4xl font-bold">$499</div>
                    <div className="text-sm opacity-70">per month</div>
                  </div>
                  <ul className="space-y-2 my-6">
                    <li>✓ Advanced AI Synergy</li>
                    <li>✓ Unlimited disruptions</li>
                    <li>✓ Quantum productivity</li>
                    <li>✓ Personal success coach</li>
                    <li>✓ Blockchain certificates</li>
                  </ul>
                  <div className="card-actions justify-center">
                    <button className="btn btn-secondary btn-block">
                      Become a Leader
                    </button>
                  </div>
                </div>
              </Card>

              <Card className="bg-base-100">
                <div className="card-body">
                  <h3 className="card-title text-center">Unicorn Founder</h3>
                  <div className="text-center">
                    <div className="text-4xl font-bold">$1,337</div>
                    <div className="text-sm opacity-70">per month</div>
                  </div>
                  <ul className="space-y-2 my-6">
                    <li>✓ Everything in Pro</li>
                    <li>✓ Metaverse office</li>
                    <li>✓ Personal brand building</li>
                    <li>✓ VC introductions</li>
                    <li>✓ Quantum entanglement</li>
                  </ul>
                  <div className="card-actions justify-center">
                    <button className="btn btn-accent btn-block">
                      Join the Elite
                    </button>
                  </div>
                </div>
              </Card>
            </div>

            <div className="text-center mt-12">
              <div className="alert alert-info inline-flex">
                <Icon name="information-circle" className="h-6 w-6" />
                <span>
                  All plans include our revolutionary 47-day money-back
                  guarantee!
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 bg-gradient-to-r from-primary to-secondary">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-primary-content mb-6">
              Ready to Disrupt Your Industry?
            </h2>
            <p className="text-xl text-primary-content/80 mb-8">
              Join thousands of thought leaders who have already transformed
              their mindset and leveraged synergistic productivity optimization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="btn btn-lg bg-white text-primary hover:bg-base-200"
                onClick={openSignupModal}
              >
                Start Your Free Trial Now
              </button>
              <button className="btn btn-lg btn-outline text-white border-white hover:bg-white hover:text-primary">
                Schedule a Synergy Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
