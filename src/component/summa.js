import { useInView } from "react-intersection-observer";




export function useAnimation(type = "") {
  const { ref, inView } = useInView({ threshold: 0.1 });

  const classname = `${type} ${inView ? "show" : ""}`;

  return { ref, classname };
}

