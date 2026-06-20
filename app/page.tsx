export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-base px-6 text-center">
      <h1 className="font-display text-5xl font-bold text-primary sm:text-7xl">
        Print Circuit
      </h1>
      <p className="font-body text-muted">
        <span className="text-cyan">Bringing</span>{" "}
        <span className="text-magenta">ideas</span>{" "}
        <span className="text-yellow">to print.</span>
      </p>
    </main>
  );
}
