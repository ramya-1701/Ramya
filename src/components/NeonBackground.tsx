import { motion } from 'motion/react';

export default function NeonBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-sleek-black">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.1)_0%,_#050505_100%)]" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(34,211,238,0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(34,211,238,0.2) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Atmospheric Glows */}
      <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-neon-blue/5 blur-[120px]" />
      <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-neon-pink/5 blur-[120px]" />
    </div>
  );
}
