// components/Hero.tsx
export default function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center h-[85vh] px-6">

      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 blur-3xl" />

      <h1 className="text-5xl md:text-6xl font-bold mb-6 z-10">
        Approval Workflow Engine
      </h1>

      <p className="text-gray-400 max-w-2xl z-10">
        Replace manual approval processes with a seamless digital workflow —
        from Teacher → HOD → Principal with real-time tracking.
      </p>

      <div className="mt-8 flex gap-4 z-10">
        <a
          href="/signup"
          className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-500 transition shadow-lg shadow-blue-500/20"
        >
          Get Started
        </a>

        <a
          href="/login"
          className="px-6 py-3 border border-white/20 rounded-lg hover:bg-white/10 transition"
        >
          Login
        </a>
      </div>
    </section>
  );
}