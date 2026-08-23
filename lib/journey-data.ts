// Camera framings measured directly against the pillar-mounted 3D model
// (orbit = "theta phi radius", target = local xyz, fov in degrees).
export const CAM = {
  spinA: { orbit: "320deg 80deg 13.0m", target: "0m 0.30m 0m", fov: "31deg" },
  spinB: { orbit: "210deg 78deg 11.0m", target: "0m 0.45m 0m", fov: "31deg" },
  spinC: { orbit: "90deg 76deg 9.2m", target: "0m 0.55m 0m", fov: "31deg" },
  reveal: { orbit: "-40deg 74deg 7.6m", target: "0m 0.62m 0m", fov: "31deg" },
  revealHold: { orbit: "-46deg 72deg 7.3m", target: "0m 0.62m 0m", fov: "31deg" },
  padsIn: { orbit: "-64deg 58deg 6.87m", target: "-0.35m 0.30m 0.01m", fov: "29deg" },
  pads: { orbit: "-88deg 46deg 2.88m", target: "-0.435m 0.516m 0.012m", fov: "28deg" },
  padsHold: { orbit: "-94deg 44deg 2.77m", target: "-0.44m 0.514m 0.012m", fov: "28deg" },
  backIn: { orbit: "-150deg 66deg 6.65m", target: "0.10m 0.90m -0.30m", fov: "30deg" },
  back: { orbit: "-210deg 84deg 6.20m", target: "0.28m 0.98m -0.55m", fov: "29deg" },
  backHold: { orbit: "-216deg 82deg 5.98m", target: "0.28m 0.97m -0.55m", fov: "29deg" },
  usbcIn: { orbit: "-300deg 96deg 6.87m", target: "-0.10m 0.80m 0.60m", fov: "29deg" },
  usbc: { orbit: "-368deg 103deg 3.77m", target: "-0.197m 0.728m 0.906m", fov: "28deg" },
  usbcHold: { orbit: "-374deg 105deg 3.66m", target: "-0.20m 0.725m 0.91m", fov: "28deg" },
  display: { orbit: "-330deg 100deg 3.10m", target: "0.31m 1.046m 0.322m", fov: "28deg" },
  displayHold: { orbit: "-326deg 99deg 2.99m", target: "0.31m 1.04m 0.325m", fov: "28deg" },
  outro: { orbit: "-400deg 74deg 8.2m", target: "0m 0.55m 0m", fov: "31deg" },
} as const;

export type Chapter = {
  p: number;
  cam: { orbit: string; target: string; fov: string };
  bg: [number, number, number];
  chapter: {
    eyebrow: string;
    title: string;
    copy?: string;
  } | null;
};

export const JOURNEY: Chapter[] = [
  { p: 0, cam: CAM.spinA, bg: [26, 24, 22], chapter: null },
  { p: 0.07, cam: CAM.spinB, bg: [23, 22, 22], chapter: null },
  { p: 0.13, cam: CAM.spinC, bg: [20, 21, 24], chapter: null },
  {
    p: 0.18,
    cam: CAM.reveal,
    bg: [17, 19, 24],
    chapter: { eyebrow: "FREZORA", title: "Meet Frezora.", copy: "A bladeless neck fan you wear, not hold." },
  },
  { p: 0.24, cam: CAM.revealHold, bg: [16, 18, 23], chapter: null },
  { p: 0.31, cam: CAM.padsIn, bg: [15, 17, 21], chapter: null },
  {
    p: 0.38,
    cam: CAM.pads,
    bg: [14, 16, 20],
    chapter: {
      eyebrow: "CONTACT PADS",
      title: "Your comfort is the whole point.",
      copy: "Contoured pads rest against your neck.",
    },
  },
  { p: 0.44, cam: CAM.padsHold, bg: [13, 15, 19], chapter: null },
  { p: 0.52, cam: CAM.backIn, bg: [12, 14, 18], chapter: null },
  {
    p: 0.58,
    cam: CAM.back,
    bg: [12, 14, 18],
    chapter: {
      eyebrow: "BLADELESS AIRFLOW",
      title: "Three speeds. No blades.",
      copy: "Air moves through the outlet, not past a spinning blade.",
    },
  },
  { p: 0.63, cam: CAM.backHold, bg: [12, 14, 19], chapter: null },
  { p: 0.7, cam: CAM.usbcIn, bg: [13, 15, 21], chapter: null },
  {
    p: 0.76,
    cam: CAM.usbc,
    bg: [13, 16, 22],
    chapter: {
      eyebrow: "USB-C",
      title: "Charge it with what you already own.",
      copy: "A full charge takes approximately 4.5 hours.",
    },
  },
  { p: 0.81, cam: CAM.usbcHold, bg: [12, 15, 21], chapter: null },
  {
    p: 0.88,
    cam: CAM.display,
    bg: [10, 12, 16],
    chapter: {
      eyebrow: "LED DISPLAY",
      title: "See your setting. See your power.",
      copy: "The display shows the selected airflow level and battery information.",
    },
  },
  { p: 0.93, cam: CAM.displayHold, bg: [10, 12, 16], chapter: null },
  {
    p: 1,
    cam: CAM.outro,
    bg: [18, 20, 25],
    chapter: { eyebrow: "THREE COLOURS", title: "One product. Built around your day." },
  },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function ease(e: number) {
  return e < 0.5 ? 4 * e * e * e : 1 - Math.pow(-2 * e + 2, 3) / 2;
}
function parseTriplet(s: string): [number, number, number] {
  const parts = s.split(" ").map((p) => parseFloat(p));
  return [parts[0], parts[1], parts[2]];
}

export function sampleJourney(p: number) {
  p = Math.max(0, Math.min(1, p));
  let i = 0;
  while (i < JOURNEY.length - 2 && p > JOURNEY[i + 1].p) i++;
  const a = JOURNEY[i];
  const b = JOURNEY[i + 1];
  const span = b.p - a.p || 1;
  const t = ease(Math.max(0, Math.min(1, (p - a.p) / span)));

  const ao = parseTriplet(a.cam.orbit.replace(/deg|m/g, ""));
  const bo = parseTriplet(b.cam.orbit.replace(/deg|m/g, ""));
  const at = parseTriplet(a.cam.target.replace(/m/g, ""));
  const bt = parseTriplet(b.cam.target.replace(/m/g, ""));
  const afov = parseFloat(a.cam.fov);
  const bfov = parseFloat(b.cam.fov);

  const orbit = [lerp(ao[0], bo[0], t), lerp(ao[1], bo[1], t), lerp(ao[2], bo[2], t)];
  const target = [lerp(at[0], bt[0], t), lerp(at[1], bt[1], t), lerp(at[2], bt[2], t)];
  const fov = lerp(afov, bfov, t);
  const bg: [number, number, number] = [
    Math.round(lerp(a.bg[0], b.bg[0], t)),
    Math.round(lerp(a.bg[1], b.bg[1], t)),
    Math.round(lerp(a.bg[2], b.bg[2], t)),
  ];

  return {
    cameraOrbit: `${orbit[0].toFixed(2)}deg ${orbit[1].toFixed(2)}deg ${orbit[2].toFixed(3)}m`,
    cameraTarget: `${target[0].toFixed(3)}m ${target[1].toFixed(3)}m ${target[2].toFixed(3)}m`,
    fieldOfView: `${fov.toFixed(2)}deg`,
    bg: `rgb(${bg[0]}, ${bg[1]}, ${bg[2]})`,
  };
}
