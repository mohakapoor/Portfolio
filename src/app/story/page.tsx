import GitHubContributions from "@/components/GitHubContributions";

export default function StoryPage() {
  return (
    <main className="min-h-screen px-6 py-16">
      <section className="max-w-5xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="newspaper-headline text-5xl md:text-6xl">The Full Story</h1>
          <p className="text-dust-gray mt-2">A case file in the Spider‑Man Noir universe</p>
        </header>

        <article className="space-y-10 leading-relaxed text-lg">
          <section className="glass-card p-6">
            <h2 className="newspaper-headline text-3xl mb-2">Who I Am</h2>
            <p className="text-dust-gray">
              Mohak Kapoor — ML/DevOps practitioner. I turn messy data into clear signals:
              forecasting indices, predicting generation, and shipping reliable, production‑ready systems.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="tag">Time‑Series</span>
              <span className="tag">Regression</span>
              <span className="tag">Classification</span>
              <span className="tag">TensorFlow</span>
              <span className="tag">scikit‑learn</span>
              <span className="tag">Pandas</span>
              <span className="tag">NumPy</span>
              <span className="tag">Polars</span>
              <span className="tag">Docker</span>
              <span className="tag">GitHub Actions</span>
              <span className="tag">PostgreSQL</span>
              <span className="tag">REST APIs</span>
            </div>
          </section>

          <section>
            <h2 className="newspaper-headline text-3xl mb-4">Featured Investigations</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="glass-card p-5">
                <h3 className="text-xl mb-2">CMFM v1.0 — Cross‑Market Index Forecasting</h3>
                <p className="text-dust-gray mb-3">
                  Deep learning model predicting bid‑open prices using 7M rows of 1‑minute Dukascopy data.
                  MAPE: 3.1% (JP), 4.2% (UK), 12% (US) on 2025 test data.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="tag">Python</span>
                  <span className="tag">Polars</span>
                  <span className="tag">TensorFlow</span>
                  <span className="tag">CNN‑LSTM</span>
                  <span className="tag">Self‑Attention</span>
                </div>
              </div>

              <div className="glass-card p-5">
                <h3 className="text-xl mb-2">
                  <a href="https://github.com/mohakapoor/Nifty50TrendPrediction" target="_blank" rel="noreferrer noopener">
                    Nifty50 Trend Prediction
                  </a>
                </h3>
                <p className="text-dust-gray mb-3">Random Forest classifier predicting short‑term market trends using historical Yahoo Finance data.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="tag">Python</span>
                  <span className="tag">scikit‑learn</span>
                  <span className="tag">Pandas</span>
                  <span className="tag">NumPy</span>
                  <span className="tag">yfinance</span>
                </div>
              </div>

              <div className="glass-card p-5">
                <h3 className="text-xl mb-2">
                  <a href="https://github.com/mohakapoor/Solar-Energy-Generation-Prediction" target="_blank" rel="noreferrer noopener">
                    Solar Power Generation Predictor
                  </a>
                </h3>
                <p className="text-dust-gray mb-3">Weather‑aware ML to predict hourly generation, surfaced via a Django web front‑end for user inputs.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="tag">TensorFlow</span>
                  <span className="tag">scikit‑learn</span>
                  <span className="tag">Pandas</span>
                  <span className="tag">NumPy</span>
                  <span className="tag">Django</span>
                  <span className="tag">OpenWeatherMap API</span>
                </div>
              </div>

              <div className="glass-card p-5">
                <h3 className="text-xl mb-2">
                  <a
                    href="https://github.com/mohakapoor/HermesGPT"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    HermesGPT — Automated Internship Outreach Bot
                  </a>
                </h3>
                <p className="text-dust-gray mb-3">AI‑powered personalized cold emails with Gmail API, email verification, and PostgreSQL tracking.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="tag">Python</span>
                  <span className="tag">Gmail API</span>
                  <span className="tag">Gemini AI</span>
                  <span className="tag">PostgreSQL</span>
                  <span className="tag">SMTP</span>
                  <span className="tag">Automation</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="newspaper-headline text-3xl mb-4">Experience</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="glass-card p-5">
                <h3 className="text-xl mb-1">HumanizeIQ — DevOps & Backend Intern</h3>
                <ul className="list-disc pl-5 text-dust-gray space-y-1">
                  <li>Built CI/CD pipelines with GitHub Actions and Docker.</li>
                  <li>Developed webhook APIs backed by PostgreSQL with robust data handling.</li>
                  <li>Filtered 88k+ incoming records to 5.1k valid; archived the rest for audit.</li>
                  <li>Contributed to Helm‑based container orchestration.</li>
                </ul>
              </div>
              <div className="glass-card p-5">
                <h3 className="text-xl mb-1">JPMorgan Chase & Co. — Quant Research Virtual</h3>
                <p className="text-dust-gray">Analyzed a loan book to estimate probability of default; transformed FICO scores into categorical features with dynamic programming.</p>
              </div>
              <div className="glass-card p-5">
                <h3 className="text-xl mb-1">OSDC — Member</h3>
                <p className="text-dust-gray">Organized hackathons and open‑source events; collaborated on OSS contributions.</p>
              </div>
              <div className="glass-card p-5">
                <h3 className="text-xl mb-1">Social Media — Strategy & Marketing</h3>
                <p className="text-dust-gray">Led strategy for two Instagram pages (55k & 17k followers), increasing engagement by 167%.</p>
              </div>
            </div>
          </section>

	      

          <section>
            <h2 className="newspaper-headline text-3xl mb-4">GitHub</h2>
            <div className="glass-card p-5">
              <div className="grid md:grid-cols-[220px,1fr] gap-6 items-center">
                <a
                  href="https://github.com/mohakapoor"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex flex-col items-center text-center"
                >
                  <img
                    src="https://github.com/mohakapoor.png?size=240"
                    alt="GitHub avatar of mohakapoor"
                    className="w-40 h-40 md:w-52 md:h-52 rounded-lg border border-[var(--spider-red)]/40 object-cover"
                  />
                  <span className="mt-3 underline">github.com/mohakapoor</span>
                </a>
                <GitHubContributions username="mohakapoor" />
              </div>
            </div>
          </section>

          <section className="glass-card p-6">
            <h2 className="newspaper-headline text-3xl mb-2">Contact</h2>
            <p className="text-dust-gray">Want the full dossier? Download from the homepage or reach out at <span className="underline">contact.mohakapoor@gmail.com</span>.</p>
          </section>
        </article>
      </section>
    </main>
  );
}


