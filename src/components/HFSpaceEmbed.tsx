"use client";

type Props = {
  spaceUrl: string;
  height?: number | string;
};

export default function HFSpaceEmbed({ spaceUrl, height = 760 }: Props) {
  // Convert huggingface.co/spaces URLs to hf.space embed mirror URLs
  // This avoids X-Frame-Options: deny issues
  const hfSpaceUrl = spaceUrl.replace('huggingface.co/spaces/', 'hf.space/embed/');
  const src = `${hfSpaceUrl}?__theme=dark`;

  return (
    <div className="relative w-full rounded-lg overflow-hidden">
      <iframe
        src={src}
        title="CaptchaOCR Live Demo"
        style={{ border: 0, width: "100%", height }}
        allow="accelerometer; camera; microphone; geolocation; encrypted-media; gyroscope; autoplay; clipboard-write; fullscreen"
        loading="lazy"
      />
    </div>
  );
}
