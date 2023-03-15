import { useEffect, useRef } from "react";

const colors = ["", "orange", "yellow", "green", "blue", "indigo", "violet"];

export default function Rubik() {
  const rubik = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rubik.current && window) {
      const fn = (e: MouseEvent) => {
        // normalise touch/mouse
        e.preventDefault();
        let pos = [e.clientX, e.clientY];
        const h = window.innerHeight;
        const w = window.innerWidth;
        const ratioY = 60 / w;
        const ratioX = 60 / h;
        const rotY = pos[0] * ratioY - 30;
        const rotX = pos[1] * ratioX - 30;
        const transform = `
        transition: transform 0.5s ease-out;
        transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateZ(0deg) skew(0deg, 0deg)
          rotateX(${-rotX}deg)
          rotateY(${rotY}deg)
        `;
        if (rubik.current) {
          rubik.current.setAttribute("style", transform);
        }
      };

      const fnMouseOut = () => {
        if (rubik.current) {
          rubik.current.setAttribute("style", "");
        }
      };

      window.addEventListener("mousemove", fn);
      window.addEventListener("mouseout", fnMouseOut);
      return () => {
        window.removeEventListener("mousemove", fn);
        window.removeEventListener("mouseout", fnMouseOut);
      };
    }
  }, [rubik]);

  return (
    <div className="rubik-wrapper">
      <div className="rubik-layout" ref={rubik}>
        {Array(49)
          .fill(0)
          .map((_, idx) => {
            return (
              <div key={idx} className="rubik-cell">
                {colors.map((v) => (
                  <div key={v} className={`rubik-cell-color ${v}`}></div>
                ))}
              </div>
            );
          })}
      </div>
    </div>
  );
}
