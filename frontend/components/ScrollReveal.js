import { useEffect, useRef } from 'react';

export default function ScrollReveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transitionDelay = `${delay}ms`;
    el.classList.add('animate-fade-in');
  }, [delay]);

  return (
    <div ref={ref} className={className} data-aos="fade-up" data-aos-delay={delay}>
      {children}
    </div>
  );
}
