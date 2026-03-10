interface MessageBannerProps {
  message: string;
  tone?: "success" | "error";
}

const toneClasses = {
  success: "border-phase4 bg-phase4/10 text-phase4",
  error: "border-phase2 bg-phase2/10 text-phase2",
};

export function MessageBanner({
  message,
  tone = "success",
}: MessageBannerProps) {
  return (
    <div className={`border px-4 py-3 text-sm ${toneClasses[tone]}`}>
      {message}
    </div>
  );
}
