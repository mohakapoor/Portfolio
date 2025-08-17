    "use client";

    export default function CaptchaOCRClient() {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="space-y-6">
                    {/* Live Demo Button */}
                    <div className="text-center">
                        <a
                            href="https://huggingface.co/spaces/mohakapoor/captchaOCR"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="spider-noir-button px-6 py-3 border-2 text-lg rounded-lg inline-block"
                        >
                            Live Demo
                        </a>
                    </div>

                    {/* Demo Notice */}
                    <div className="text-center p-4 bg-[var(--spider-red)]/10 rounded-lg border border-[var(--spider-red)]/30">
                        <p className="text-sm text-[var(--spider-red)]">
                            🚧 Embedding is under development. Click &quot;Live Demo&quot; for the real system!
                        </p>
                    </div>
                </div>
            </div>
        );
    }
