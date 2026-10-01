import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Set to true if your car image points right instead of left. */
const CAR_FACES_RIGHT = false;

const STATS = [
  { value: 90, label: "faster page loads" },
  { value: 85, label: "better usability scores" },
  { value: 95, label: "clients who come back" },
];

const SERVICES = [
  ["Websites", "Fast, responsive sites built around how people actually browse."],
  ["Motion", "Scroll and page interactions that explain, not just decorate."],
  ["Web apps", "Dashboards and tools your team can rely on every day."],
];

const fonts = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@600;800&family=Manrope:wght@400;500;600&display=swap');
.f-display{font-family:'Unbounded','Arial Black',sans-serif}
.f-body{font-family:'Manrope',system-ui,sans-serif}
.outline-text{color:transparent;-webkit-text-stroke:1.5px rgba(236,232,225,.35)}
.road{background-image:repeating-linear-gradient(90deg,rgba(236,232,225,.55) 0 48px,transparent 48px 96px);background-size:96px 2px;background-repeat:repeat-x;background-position:0 50%}
@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}
`;

function App() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const q = gsap.utils.selector(root);
        const dir = CAR_FACES_RIGHT ? 1 : -1;

        // Single load moment: headline lifts in, then the car rolls up.
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(q("[data-load='head']"), { yPercent: 100, duration: 1, stagger: 0.08 })
          .from(q("[data-load='fade']"), { opacity: 0, y: 16, duration: 0.7, stagger: 0.1 }, "-=0.5")
          .from(q("[data-car]"), { xPercent: -dir * 40, opacity: 0, duration: 1.2 }, "-=0.9");

        // The scroll moment: pinned hero, car drives along the road
        // and fills in the headline behind it.
        const counters = q("[data-count]").map((el) => ({
          el,
          target: +el.dataset.count,
          obj: { v: 0 },
        }));

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: q("[data-hero]")[0],
            start: "top top",
            end: "+=140%",
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          },
        });

        tl.to(q("[data-car]"), { x: () => dir * window.innerWidth * 0.55, ease: "none", duration: 1 }, 0)
          .to(q("[data-road]"), { backgroundPositionX: () => -dir * 700, ease: "none", duration: 1 }, 0)
          .fromTo(
            q("[data-fill]"),
            { clipPath: dir < 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" },
            { clipPath: "inset(0 0 0 0%)", ease: "none", duration: 1 },
            0
          )
          .to(q("[data-hint]"), { opacity: 0, duration: 0.15 }, 0);

        counters.forEach(({ el, target, obj }) => {
          tl.to(
            obj,
            { v: target, ease: "none", duration: 0.8, onUpdate: () => (el.textContent = Math.round(obj.v)) },
            0.1
          );
        });
      }, root);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <main ref={root} className="f-body bg-[#0E0F12] text-[#ECE8E1] antialiased">
      <style>{fonts}</style>

      {/* ============ HERO ============ */}
      <section data-hero className="relative h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_85%,rgba(47,91,255,0.22),transparent_55%)]" />

        <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-6 md:px-12">
          <span className="f-display text-base font-extrabold tracking-tight">itzfizz</span>
          <a
            href="#work"
            className="rounded-full border border-[#ECE8E1]/30 px-4 py-2 text-sm font-medium transition-colors hover:bg-[#ECE8E1] hover:text-[#0E0F12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F5BFF]"
          >
            See our work
          </a>
        </header>

        {/* Giant headline: outline layer + solid layer revealed by the car */}
        <div className="absolute inset-x-0 top-[22%] z-10 px-6 md:px-12">
          <p data-load="fade" className="mb-5 max-w-sm text-sm text-[#ECE8E1]/60 md:text-base">
            We build websites that load fast, move well and turn visitors into customers.
          </p>
          <div className="relative">
            <h1
              className="f-display outline-text select-none whitespace-nowrap text-[17vw] font-extrabold leading-[0.9] tracking-tighter"
              aria-label="ITZFIZZ"
            >
              <span className="block overflow-hidden">
                <span data-load="head" className="block">ITZFIZZ</span>
              </span>
            </h1>
            <h1
              data-fill
              aria-hidden="true"
              className="f-display pointer-events-none absolute inset-0 select-none whitespace-nowrap text-[17vw] font-extrabold leading-[0.9] tracking-tighter text-[#ECE8E1]"
              style={{ clipPath: "inset(0 0 0 100%)" }}
            >
              <span className="block overflow-hidden">
                <span className="block">ITZFIZZ</span>
              </span>
            </h1>
          </div>
        </div>

        {/* Stats */}
        <dl className="absolute left-6 top-[58%] z-20 grid grid-cols-3 gap-6 md:left-12 md:gap-14">
          {STATS.map((s) => (
            <div key={s.label} data-load="fade">
              <dt className="sr-only">{s.label}</dt>
              <dd className="f-display text-3xl font-semibold md:text-5xl">
                <span data-count={s.value}>0</span>
                <span className="text-[#2F5BFF]">%</span>
              </dd>
              <p className="mt-2 max-w-[9rem] text-xs text-[#ECE8E1]/55 md:text-sm">{s.label}</p>
            </div>
          ))}
        </dl>

        {/* Road + car */}
        <div className="absolute inset-x-0 bottom-0 z-20 h-[34%]">
          <div data-road className="road absolute inset-x-0 bottom-[14%] h-[2px]" />
          <div className="absolute inset-x-0 bottom-[14%] h-px bg-[#ECE8E1]/15" />
          <div
            data-car
            className={`absolute bottom-[13%] w-[62%] max-w-[860px] md:w-[46%] ${CAR_FACES_RIGHT ? "left-[4%]" : "right-[4%]"
              }`}
          >
            <div className="absolute inset-x-[8%] -bottom-3 h-6 rounded-full bg-[#2F5BFF]/50 blur-xl" />
            <img
              src="/images/hero-car.png"
              alt="ITZFIZZ futuristic car"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        <p data-hint className="absolute bottom-5 left-6 z-30 text-xs text-[#ECE8E1]/50 md:left-12">
          Scroll to drive
        </p>
      </section>

      {/* ============ SERVICES ============ */}
      <section id="work" className="mx-auto max-w-5xl px-6 py-28 md:px-12 md:py-40">
        <h2 className="f-display max-w-2xl text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
          Built with React, Tailwind and GSAP.
        </h2>
        <ul className="mt-16 divide-y divide-[#ECE8E1]/15 border-y border-[#ECE8E1]/15">
          {SERVICES.map(([title, text]) => (
            <li key={title} className="grid gap-2 py-8 md:grid-cols-[1fr_1.4fr] md:gap-12">
              <h3 className="f-display text-xl font-semibold">{title}</h3>
              <p className="max-w-md text-[#ECE8E1]/65">{text}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;