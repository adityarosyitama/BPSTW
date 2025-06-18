import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ReactNode } from "react";

interface SlideInProps {
  children: ReactNode;
}

const SlideIn = ({ children }: SlideInProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ x: -100, opacity: 0 }}
      animate={isInView ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="text-center text-xl"
    >
      {children}
    </motion.div>
  );
};

export default SlideIn;