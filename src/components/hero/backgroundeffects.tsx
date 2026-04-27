export default function BackgroundEffects() {
  return (
    <>
      {/* Base background */}
      <div className="absolute inset-0 bg-black" />

      {/* Purple/blue glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.2),transparent_60%)] blur-3xl" />

      {/* Bottom dotted grid */}
      <div className="absolute bottom-0 w-full h-40 bg-grid" />
    </>
  );
}