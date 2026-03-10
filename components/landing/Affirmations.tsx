const affirmations = [
  "I will succeed.",
  "I will execute.",
  "I am capable, strong, and worthy.",
  "Nothing can stop me.",
  "My discipline is stronger than my emotions.",
  "I control my mind — it does not control me.",
  "Action kills fear.",
  "I am becoming unstoppable.",
];

export function Affirmations() {
  return (
    <section className="border-t border-border bg-dark px-8 py-24 text-center">
      <div className="mx-auto max-w-[700px]">
        <h2 className="mb-10 font-bebas text-[clamp(2.5rem,5vw,3.5rem)] tracking-[2px] text-phase3">
          Daily Affirmations
        </h2>
        <div className="space-y-0">
          {affirmations.map((affirmation) => (
            <div
              key={affirmation}
              className="border-b border-border py-4 font-serif text-2xl italic transition-colors duration-300 last:border-b-0 hover:text-accent"
            >
              {affirmation}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
