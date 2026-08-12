/**
 * ShootingStars — Crimson Terminal animated background
 * Red shooting stars / particles falling diagonally across the full viewport.
 */
import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  width: number;
}

interface ShootingStarsProps {
  count?: number;
  speedMultiplier?: number;
  lengthMin?: number;
  lengthMax?: number;
  opacityMin?: number;
  opacityMax?: number;
  widthMin?: number;
  widthMax?: number;
}

export default function ShootingStars({
  count = 35,
  speedMultiplier = 1,
  lengthMin = 40,
  lengthMax = 120,
  opacityMin = 0.3,
  opacityMax = 0.7,
  widthMin = 0.5,
  widthMax = 1.5,
}: ShootingStarsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const stars: Star[] = [];
    const NUM_STARS = count;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const createStar = (): Star => ({
      x: Math.random() * (window.innerWidth + 200) - 100,
      y: Math.random() * window.innerHeight,
      length: Math.random() * (lengthMax - lengthMin) + lengthMin,
      speed: (Math.random() * 3 + 1.5) * speedMultiplier,
      opacity: Math.random() * (opacityMax - opacityMin) + opacityMin,
      width: Math.random() * (widthMax - widthMin) + widthMin,
    });

    for (let i = 0; i < NUM_STARS; i++) {
      const s = createStar();
      // spread initial positions across the screen
      s.y = Math.random() * window.innerHeight;
      stars.push(s);
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const star of stars) {
        // Move diagonally: down-left
        star.x -= star.speed * 0.5;
        star.y += star.speed;

        // Reset when off screen
        if (star.y > canvas.height + 50 || star.x < -200) {
          Object.assign(star, createStar());
        }

        // Draw trail
        const angle = Math.atan2(star.speed, -star.speed * 0.5);
        const tailX = star.x - Math.cos(angle) * star.length;
        const tailY = star.y - Math.sin(angle) * star.length;

        const gradient = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
        gradient.addColorStop(0, `rgba(220, 38, 38, 0)`);
        gradient.addColorStop(0.6, `rgba(220, 38, 38, ${star.opacity * 0.4})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${star.opacity})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(star.x, star.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = star.width;
        ctx.lineCap = "round";
        ctx.stroke();

        // Bright head dot
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.width * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 200, 200, ${star.opacity})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "transparent" }}
    />
  );
}
