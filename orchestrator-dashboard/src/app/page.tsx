export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <p>you are currently on the home page.</p>
      <div>
        <a className="text-sky-500" href="/dashboard">
          dashboard
        </a>
      </div>
    </main>
  );
}
