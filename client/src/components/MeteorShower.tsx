import { useEffect, useRef } from "react";

interface Meteor {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  width: number;
  drift: number;
}

export default function MeteorShower() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const meteors: Meteor[] = [];
    const NUM_METEORS = 65;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const createMeteor = (): Meteor => ({
      x: Math.random() * (window.innerWidth + 300) - 150,
      y: -Math.random() * 300 - 50,
      length: Math.random() * 220 + 100,
      speed: Math.random() * 4 + 3.5,
      opacity: Math.random() * 0.6 + 0.35,
      width: Math.random() * 2 + 1.25,
      drift: Math.random() * 0.7 + 0.3,
    });

    for (let i = 0; i < NUM_METEORS; i++) {
      const meteor = createMeteor();
      meteor.y = Math.random() * window.innerHeight;
      meteors.push(meteor);
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const meteor of meteors) {
        meteor.x -= meteor.drift;
        meteor.y += meteor.speed;

        if (meteor.y > canvas.height + 80 || meteor.x < -250) {
          Object.assign(meteor, createMeteor());
        }

        const tailX = meteor.x + meteor.length * 0.8;
        const tailY = meteor.y - meteor.length * 0.4;

        const gradient = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${meteor.opacity})`);
        gradient.addColorStop(0.4, `rgba(255, 160, 128, ${meteor.opacity * 0.55})`);
        gradient.addColorStop(1, `rgba(220, 38, 38, 0)`);

        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = meteor.width;
        ctx.lineCap = "round";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, meteor.width * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${meteor.opacity})`;
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
