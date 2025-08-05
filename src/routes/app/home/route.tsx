import { Link } from "react-router";

import { closeSidebar } from "../client";
import { defineHandle } from "../handle";

export const handle = defineHandle({
  SidebarContent() {
    return (
      <nav>
        <ul className="menu w-full">
          <li>
            <Link to="#" onClick={closeSidebar}>
              🧠 AI Thoughts
            </Link>
          </li>
          <li>
            <Link to="#" onClick={closeSidebar}>
              ⚡ Quantum Tasks
            </Link>
            <ul>
              <li>
                <Link to="#" onClick={closeSidebar}>
                  🚀 Disruption Metrics
                </Link>
              </li>
              <li>
                <Link to="#" onClick={closeSidebar}>
                  🌐 Metaverse Meetings
                </Link>
              </li>
              <li>
                <Link to="#" onClick={closeSidebar}>
                  🔗 Blockchain Logs
                </Link>
                <ul>
                  <li>
                    <Link to="#" onClick={closeSidebar}>
                      📊 Synergy Analytics
                    </Link>
                  </li>
                  <li>
                    <Link to="#" onClick={closeSidebar}>
                      🎯 Mindset Tracking
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            <Link to="#" onClick={closeSidebar}>
              🏆 Thought Leadership
            </Link>
          </li>
        </ul>
      </nav>
    );
  },
});

export default function AppHome() {
  return (
    <>
      <title>Dashboard | The App</title>
      <meta name="description" content="Dashboard" />

      <main className="p-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Welcome back, Thought Leader! 🚀
          </h1>
          <p className="text-base-content/70">
            Your AI has been thinking your thoughts while you were away. Here's
            what you missed:
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-figure text-primary">
              <div className="text-3xl">🧠</div>
            </div>
            <div className="stat-title">AI Thoughts Generated</div>
            <div className="stat-value text-primary">1,337</div>
            <div className="stat-desc">↗︎ 420% more than yesterday</div>
          </div>

          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-figure text-secondary">
              <div className="text-3xl">⚡</div>
            </div>
            <div className="stat-title">Quantum Tasks Completed</div>
            <div className="stat-value text-secondary">47</div>
            <div className="stat-desc">In parallel dimensions</div>
          </div>

          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-figure text-accent">
              <div className="text-3xl">🔗</div>
            </div>
            <div className="stat-title">Blockchain Synergies</div>
            <div className="stat-value text-accent">89</div>
            <div className="stat-desc">Immutable productivity</div>
          </div>

          <div className="stat bg-base-200 rounded-lg">
            <div className="stat-figure text-success">
              <div className="text-3xl">🏆</div>
            </div>
            <div className="stat-title">Thought Leadership Score</div>
            <div className="stat-value text-success">9.9/10</div>
            <div className="stat-desc">Almost a unicorn</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Thoughts Panel */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-primary">
                  🧠 Your AI's Latest Thoughts
                </h2>
                <div className="space-y-4">
                  <div className="chat chat-start">
                    <div className="chat-bubble chat-bubble-primary">
                      "I've been thinking about your productivity while you
                      slept. You should definitely pivot to blockchain-based
                      synergy optimization."
                    </div>
                  </div>
                  <div className="chat chat-start">
                    <div className="chat-bubble chat-bubble-secondary">
                      "Your LinkedIn post about disruption was 47% more
                      synergistic than the industry average. Consider adding
                      more buzzwords."
                    </div>
                  </div>
                  <div className="chat chat-start">
                    <div className="chat-bubble chat-bubble-accent">
                      "I've scheduled 3 quantum meetings for tomorrow. Your
                      avatar will attend while you meditate in the productivity
                      pod."
                    </div>
                  </div>
                </div>
                <div className="card-actions justify-end mt-4">
                  <button className="btn btn-primary btn-sm">
                    Generate More Thoughts
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-accent">🏆 Leadership Goals</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <progress
                      className="progress progress-accent w-full"
                      value="85"
                      max="100"
                    ></progress>
                    <span className="text-sm">Thought Leadership</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <progress
                      className="progress progress-primary w-full"
                      value="67"
                      max="100"
                    ></progress>
                    <span className="text-sm">Disruption Level</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <progress
                      className="progress progress-secondary w-full"
                      value="93"
                      max="100"
                    ></progress>
                    <span className="text-sm">Synergy Score</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <progress
                      className="progress progress-info w-full"
                      value="74"
                      max="100"
                    ></progress>
                    <span className="text-sm">Vision Alignment</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <progress
                      className="progress progress-warning w-full"
                      value="58"
                      max="100"
                    ></progress>
                    <span className="text-sm">Innovation Index</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="mt-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-success">📈 Recent Activities</h2>
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Activity</th>
                      <th>Synergy Level</th>
                      <th>Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>🧠 AI generated 47 thoughts about blockchain</td>
                      <td>
                        <div className="badge badge-primary">High</div>
                      </td>
                      <td>2 minutes ago</td>
                      <td>
                        <div className="badge badge-success">Completed</div>
                      </td>
                    </tr>
                    <tr>
                      <td>⚡ Quantum task: Disrupt traditional workflows</td>
                      <td>
                        <div className="badge badge-secondary">Quantum</div>
                      </td>
                      <td>5 minutes ago</td>
                      <td>
                        <div className="badge badge-warning">In Progress</div>
                      </td>
                    </tr>
                    <tr>
                      <td>🌐 Metaverse meeting with AI avatar</td>
                      <td>
                        <div className="badge badge-accent">Virtual</div>
                      </td>
                      <td>10 minutes ago</td>
                      <td>
                        <div className="badge badge-success">Completed</div>
                      </td>
                    </tr>
                    <tr>
                      <td>🔗 Blockchain synergy recorded</td>
                      <td>
                        <div className="badge badge-info">Immutable</div>
                      </td>
                      <td>15 minutes ago</td>
                      <td>
                        <div className="badge badge-success">Completed</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="mt-8">
          <div className="alert alert-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>
              <strong>Today's Synergy Tip:</strong> "The best time to disrupt
              your industry was yesterday. The second best time is now, but with
              10x more AI and blockchain synergy."
            </span>
          </div>
        </div>
      </main>
    </>
  );
}
