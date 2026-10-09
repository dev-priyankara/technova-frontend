
export default function AnimatedTechBackground() {
  return (
    <div
      className="animated-tech-background"
      aria-hidden="true"
    >
      <div className="tech-grid" />

      <div className="tech-glow tech-glow-one" />
      <div className="tech-glow tech-glow-two" />
      <div className="tech-glow tech-glow-three" />

      <div className="tech-circuit tech-circuit-one">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="tech-circuit tech-circuit-two">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="tech-scan-line" />

      <div className="tech-particles">
        {Array.from({ length: 18 }, (_, index) => (
          <span
            key={index}
            className={`tech-particle particle-${index + 1}`}
          />
        ))}
      </div>

      <div className="tech-vignette" />
    </div>
  );
}
