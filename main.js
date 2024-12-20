let particles = [];
let lineThickness = 5; // Number of lines for each section
let particleSize = 5; // Size of each particle
let cursorEffectRadius = 50; // Radius of the cursor's effect
let cursorForce = 5; // Strength of the cursor's effect
let reformationSpeed = 0.1; // Speed of particles reforming into the "N"
let gridSpacing = 15; // Spacing between particles

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("mainSection","mainSectionAbout");

  // Apply canvas styles
  canvas.style("position", "absolute");
  canvas.style("z-index", "0");
  canvas.style("top", "0");
  canvas.style("left", "0");
  canvas.style("pointer-events", "none");

  // Check if screen width is small (below 1024px)
  if (windowWidth < 1024) {
    canvas.hide(); // Hide canvas on small screens
  } else {
    createLetterN(); // Show letter "N" on larger screens
  }
}

function createLetterN() {
  let startX = width / 5; // Starting X position (adjusted for smaller size)
  let startY = height / 3; // Starting Y position (adjusted for smaller size)
  let letterHeight = height / 3; // Height of the "N" (reduced for smaller size)
  let letterWidth = width / 8; // Width of the "N" (reduced for smaller size)

  // Left vertical bar (multiple lines)
  for (let t = 0; t < lineThickness; t++) {
    for (let y = 0; y < letterHeight; y += gridSpacing) {
      particles.push({
        x: startX + t * gridSpacing,
        y: startY + y,
        targetX: startX + t * gridSpacing,
        targetY: startY + y,
        dx: 0,
        dy: 0,
      });
    }
  }

  // Diagonal bar (multiple lines)
  for (let t = 0; t < lineThickness; t++) {
    for (let step = 0; step < letterHeight; step += gridSpacing) {
      let x = startX + (step * letterWidth) / letterHeight + t * gridSpacing;
      let y = startY + step;
      particles.push({
        x: x,
        y: y,
        targetX: x,
        targetY: y,
        dx: 0,
        dy: 0,
      });
    }
  }

  // Right vertical bar (multiple lines)
  for (let t = 0; t < lineThickness; t++) {
    for (let y = 0; y < letterHeight; y += gridSpacing) {
      particles.push({
        x: startX + letterWidth + t * gridSpacing,
        y: startY + y,
        targetX: startX + letterWidth + t * gridSpacing,
        targetY: startY + y,
        dx: 0,
        dy: 0,
      });
    }
  }
}

function draw() {
  clear();
  background(0, 0, 0, 0); // Transparent background
  noStroke();

  fill(204, 51, 20, 90); // Particle color

  for (let p of particles) {
    // Apply physics when the cursor is near
    let d = dist(mouseX, mouseY, p.x, p.y);
    if (d < cursorEffectRadius) {
      let angle = atan2(p.y - mouseY, p.x - mouseX); // Direction away from cursor
      p.dx += cos(angle) * cursorForce;
      p.dy += sin(angle) * cursorForce;
    } else {
      // Reunite particles to their original positions
      p.x += (p.targetX - p.x) * reformationSpeed;
      p.y += (p.targetY - p.y) * reformationSpeed;
    }

    // Update particle positions
    p.x += p.dx;
    p.y += p.dy;

    // Reset forces
    p.dx *= 0.95; // Dampen horizontal motion
    p.dy *= 0.95; // Dampen vertical motion

    // Draw particle
    ellipse(p.x, p.y, particleSize);
  }
}

// Update the particle canvas visibility based on screen resizing
function windowResized() {
  if (windowWidth < 1024) {
    select("canvas").hide(); // Hide canvas on small screens
  } else {
    select("canvas").show(); // Show canvas on larger screens
  }
}
