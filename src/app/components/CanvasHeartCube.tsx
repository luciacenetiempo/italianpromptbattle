import React, { useRef, useEffect } from 'react';

const CanvasHeartCube: React.FC<{ size?: number }> = ({ size = 300 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new window.Image();
    img.src = '/assets/SVG/cube-1.svg';

    const width = size;
    const height = size;
    canvas.width = width;
    canvas.height = height;

    const r = Math.floor(Math.min(width, height) * 0.7);
    const x = (width - r) / 2;
    const y = (height - r) / 2;
    let rotation = Math.random() * Math.PI * 2;
    const rotationSpeed = 0.01 + Math.random() * 0.01;
    let t = 0;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      const offsetX = Math.sin(t / 40) * 10;
      const offsetY = Math.cos(t / 60) * 10;
      ctx.translate(x + r / 2 + offsetX, y + r / 2 + offsetY);
      ctx.rotate(rotation);
      ctx.drawImage(img, -r / 2, -r / 2, r, r);
      ctx.restore();
    }

    function animate() {
      t++;
      rotation += rotationSpeed;
      draw();
      requestAnimationFrame(animate);
    }

    img.onload = () => {
      animate();
    };

    return () => {
      // cleanup
    };
  }, [size]);

  return <canvas ref={canvasRef} style={{ width: size, height: size, display: 'block' }} />;
};

export default CanvasHeartCube; 