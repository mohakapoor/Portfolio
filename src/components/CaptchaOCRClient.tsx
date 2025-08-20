    "use client";

    export default function CaptchaOCRClient() {
      return (
        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {/* Demo Notice */}
            <div className="text-center p-4 bg-[var(--spider-red)]/10 rounded-lg border border-[var(--spider-red)]/30">
              <p className="text-sm text-[var(--spider-red)]">
                🚧 Embedding is under development. Click "Live Demo" for the real system!
              </p>
            </div>

            {/* Direct Hugging Face Space Integration */}
            <div className="glass-card p-6" style={{ transform: 'none' }}>
              <style jsx>{`
                .glass-card:hover {
                  transform: none !important;
                  scale: none !important;
                }
              `}</style>
              <h3 className="text-xl mb-4 text-[var(--vintage-white)] text-center">
                Interactive CAPTCHA Demo
              </h3>
              <p className="text-[var(--dust-gray)] mb-6 text-center">
                Try out the CAPTCHA recognition system directly on this page!
              </p>
              
              {/* Hugging Face Space iframe */}
              <div className="text-center">
                <iframe
                  src="https://mohakapoor-captchaocr.hf.space"
                  frameBorder="0"
                  width="850"
                  height="450"
                  className="mx-auto"
                ></iframe>
              </div>
              
              <div className="text-center mt-4 text-sm text-[var(--dust-gray)]">
                <p>This embeds your complete Hugging Face Space interface directly on the page</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
