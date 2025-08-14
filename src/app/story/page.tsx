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
              Mohak Kapoor — ML practitioner and builder. I turn messy data into
              clear signals: forecasting markets, predicting generation, and
              shipping simple, production‑ready systems.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="tag">Time‑Series</span>
              <span className="tag">Regression</span>
              <span className="tag">Classification</span>
              <span className="tag">TensorFlow</span>
              <span className="tag">scikit‑learn</span>
              <span className="tag">Pandas</span>
              <span className="tag">NumPy</span>
              <span className="tag">Docker</span>
              <span className="tag">GitHub Actions</span>
            </div>
          </section>

          <section>
            <h2 className="newspaper-headline text-3xl mb-4">Featured Investigations</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="glass-card p-5">
                <h3 className="text-xl mb-2">Nifty50 Trend Prediction</h3>
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
                <h3 className="text-xl mb-2">Solar Power Generation Predictor</h3>
                <p className="text-dust-gray mb-3">Weather‑aware ML to predict hourly generation. Deployed with a Django frontend for user inputs.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="tag">TensorFlow</span>
                  <span className="tag">scikit‑learn</span>
                  <span className="tag">Pandas</span>
                  <span className="tag">NumPy</span>
                  <span className="tag">Django</span>
                  <span className="tag">OpenWeatherMap API</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="newspaper-headline text-3xl mb-4">Experience</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="glass-card p-5">
                <h3 className="text-xl mb-1">JPMorgan Chase & Co. — Quant Research Virtual</h3>
                <p className="text-dust-gray">Analyzed a loan book to estimate probability of default; transformed FICO scores into categorical features with dynamic programming.</p>
              </div>
              <div className="glass-card p-5">
                <h3 className="text-xl mb-1">OSDC — Member</h3>
                <p className="text-dust-gray">Helped organize hackathons and open‑source events; collaborated on OSS contributions.</p>
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


