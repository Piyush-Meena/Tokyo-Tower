import { SVG } from "https://cdn.skypack.dev/@svgdotjs/svg.js@3.1.1";
import tinycolor from "https://cdn.skypack.dev/tinycolor2@1.4.2";
import gsap from "https://cdn.skypack.dev/gsap@3.9.1";
import "https://cdn.skypack.dev/@svgdotjs/svg.filter.js@3.0.8";

console.clear();

const random = gsap.utils.random;

let colors, colorPalette, draw, hexagonGroup, hexagonDef, rotation;

const gap = 9;
const hexHeight = 86.6;
const hexWidth = 100;

const hexagonPath =
  "M100 43.3013L75 86.6026H25L0 43.3013L25 0L75 2.18557e-06L100 43.3013Z";

/* 
Pattern functions
*/

function drawNested(x, y) {
  const group = draw.group();
  gsap.utils.shuffle(colorPalette);

  for (let k = 4; k > 0; k--) {
    group
      .use(hexagonDef)
      .fill(random(colorPalette))
      .move(x, y)
      .scale(0.2 * k);
  }
  return group;
}

function drawHorizontal(x, y) {
  const group = draw.group();
  const randomOffset = random(0, 5, 1);
  gsap.utils.shuffle(colorPalette);

  for (let k = 5; k > 0; k--) {
    group
      .rect(hexWidth, hexHeight * 0.2 * k)
      .fill(
        colorPalette[gsap.utils.wrap(0, colorPalette.length, k + randomOffset)]
      )
      .center(x + hexWidth / 2, y + hexHeight / 2);
  }
  return group;
}

function drawVertical(x, y) {
  const group = draw.group();
  const rectWidth = hexWidth / 8;
  const randomOffset = random(0, 5, 1);
  gsap.utils.shuffle(colorPalette);
  for (let k = 0; k < 8; k++) {
    group
      .rect(rectWidth, hexHeight)
      .fill(
        colorPalette[gsap.utils.wrap(0, colorPalette.length, k + randomOffset)]
      )
      .move(x + rectWidth * k, y);
    // .center(x + hexWidth / 2, y + hexHeight / 2)
    // .transform({ origin: "center", rotate: 90 });
  }
  return group;
}

function drawHexagon(x, y) {
  // Get base color
  const bg = random(colorPalette);

  const group = draw.group();
  group.use(hexagonDef).fill(bg).move(x, y);

  const styleOptions = [drawNested, drawHorizontal, drawVertical];
  // Get unique function Indexes
  const [firstIndex, secondIndex] = getTwoUniqueInRange(
    0,
    styleOptions.length - 1
  );

  // Create First Half
  const firstHalfStyle = styleOptions[firstIndex];
  const firstHalf = firstHalfStyle(x, y);

  // Mask to top half
  const topMaskRect = group
    .rect(hexWidth, hexHeight / 2)
    .fill("white")
    .move(x, y);

  const topMask = group.mask().add(topMaskRect);
  firstHalf.maskWith(topMask);

  firstHalf.addTo(group);

  // Create Second Half
  const secondHalfStyle = styleOptions[secondIndex];
  const secondHalf = secondHalfStyle(x, y);

  // Mask to bottom half
  const bottomMaskRect = group
    .rect(hexWidth, hexHeight / 2)
    .fill("white")
    .move(x, y + hexHeight / 2);

  const bottomMask = group.mask().add(bottomMaskRect);
  secondHalf.maskWith(bottomMask);

  secondHalf.addTo(group);

  const hexagonForMask = group.use(hexagonDef).fill("white").move(x, y);
  const hexMask = group.mask().add(hexagonForMask);
  group.maskWith(hexMask);

  const rotationOffset = random([0, 60, 120, 180, 240, 300, 360]);
  group.transform({
    rotate: rotation + rotationOffset,
    origin: "center"
  });

  // Make cool pattern stuff
  group.addTo(hexagonGroup);
}

function generateNewGrid() {
  // Choose new Color palette
  colorPalette = gsap.utils.random(colors);

  const bg = makeBackgroundColor();
  gsap.to("body", {
    "--background": bg,
    duration: 0.3
  });

  // Fade out SVG
  gsap.to(".container > svg > g > g, .texture", {
    opacity: 0,
    scale: 0.8,
    y: "-=50",
    ease: "power2.out",
    // rotate: 130,
    // transformOrigin:'center',
    duration: 0.5,
    stagger: { amount: 0.5, from: "start" },
    onComplete: () => {
      // Remove previous SVG from DOM
      document.querySelector(".container").innerHTML = "";
      // Start new SVG creation
      drawGrid();
    }
  });
}

function drawGrid() {
  // Set rotation
  rotation = random(-20, 20);

  // Draw New SVG
  draw = SVG().addTo(".container").fill("red");
  hexagonDef = draw.defs().path(hexagonPath);
  hexagonGroup = draw.group();

  // Draw all hexagons
  for (let i = -1; i < 20; i++) {
    for (let j = -1; j < 10; j++) {
      const offset = i % 2 === 0 ? 0 : 83;
      const xPos = j * (hexWidth + hexWidth / 2 + gap * 2) + offset;
      const yPos = i * (hexHeight / 2 + gap);
      drawHexagon(xPos, yPos);
    }
  }

  const texture = draw.rect(1000, 1000).addClass("texture");
  texture.filterWith(function (add) {
    add.turbulence(64.24, 4, 5, "stitch", "fractalNoise");
  });

  gsap.fromTo(
    ".container > svg > g > g, .texture",
    { opacity: 0, scale: 0.8, y: "-=50" },
    {
      opacity: 1,
      scale: 1,
      ease: "power2.in",
      duration: 0.5,
      stagger: { amount: 0.5, from: "end" }
    }
  );
}

function makeBackgroundColor() {
  const bg = tinycolor
    .mix(colorPalette[0], colorPalette[1], 50)
    .desaturate(10)
    .toString();

  return bg;
}

function getTwoUniqueInRange(min, max) {
  let first, second;
  first = random(min, max, 1);
  do {
    second = random(min, max, 1);
  } while (first === second);
  return [first, second];
}

async function init() {
  // Get color palettes
  colors = await fetch(
    "https://unpkg.com/nice-color-palettes@3.0.0/100.json"
  ).then((response) => response.json());

  generateNewGrid();
  document.addEventListener("click", generateNewGrid);
}

init();
