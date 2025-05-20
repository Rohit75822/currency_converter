import React, { useEffect, useRef } from "react";

export const BackgroundBeams = () => {
  const beamsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!beamsRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!beamsRef.current) return;
      
      const { clientX, clientY } = e;
      const x = Math.round((clientX / window.innerWidth) * 100);
      const y = Math.round((clientY / window.innerHeight) * 100);
      
      beamsRef.current.style.setProperty("--x", `${x}%`);
      beamsRef.current.style.setProperty("--y", `${y}%`);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={beamsRef}
      className="beams absolute inset-0 opacity-40"
      style={{
        background: "radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(0, 128, 255, 0.15) 0%, rgba(0, 128, 255, 0) 60%)",
      }}
    >
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(17, 24, 39, 0.8) 50%, rgba(0, 0, 0, 0) 100%)",
          transform: "translateY(-50%)",
          top: "50%",
          animation: "rotate 5s linear infinite",
        }}
      />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(17, 24, 39, 0.8) 50%, rgba(0, 0, 0, 0) 100%)",
          transform: "translateY(-50%) rotate(60deg)",
          top: "50%",
          animation: "rotate 5s linear infinite",
          animationDelay: "-2s",
        }}
      />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(17, 24, 39, 0.8) 50%, rgba(0, 0, 0, 0) 100%)",
          transform: "translateY(-50%) rotate(120deg)",
          top: "50%",
          animation: "rotate 5s linear infinite",
          animationDelay: "-4s",
        }}
      />
    </div>
  );
};