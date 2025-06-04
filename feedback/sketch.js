// Variables for circle properties
let x, y;                // Position
let xspeed, yspeed;      // Speed
let diameter = 40;       // Diameter
let circleColor;         // Color
let speedMultiplier = 2; // Speed multiplier
let jitterAmount = 0;    // Jitter amount
let trails = [];         // Array to store trail positions
let maxTrails = 200;     // Maximum number of trails (increased for longer trails)
let gravitationalStrength = 0; // Strength of gravitational pull to center (reduced for more orbital motion)
let centerX, centerY;    // Center point of the canvas
let colorAngle = 0;      // Angle for color oscillation

// Mouse interaction variables
let mouseTargetX, mouseTargetY; // Mouse click target position
let hasMouseTarget = false;     // Whether there's an active mouse target
let mouseTargetStrength = 0.3;  // Strength of mouse target attraction

// Variables for sliders
let diameterSlider, colorSlider, speedSlider, jitterSlider, trailSlider, gravitySlider;
let sliderLabels = ['Diameter', 'Color Speed', 'Speed', 'Jitter', 'Trail Length', 'Gravity'];

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Initialize circle position to center of canvas
  x = width / 2;
  y = height / 2;
  
  // Set the center point
  centerX = width / 2;
  centerY = height / 2;
  
  // Initialize random speed
  xspeed = random(-2, 2);
  yspeed = random(-2, 2);
  
  // Initialize color
  circleColor = color(255, 50, 50, 180);
  
  // Create sliders and parent them to their containers
  diameterSlider = createSlider(5, 100, diameter);
  diameterSlider.parent(select('.controls-content .slider-container:nth-child(1)'));
  
  colorSlider = createSlider(0, 10, 0);
  colorSlider.parent(select('.controls-content .slider-container:nth-child(2)'));
  
  speedSlider = createSlider(0.5, 5, speedMultiplier, 0.1);
  speedSlider.parent(select('.controls-content .slider-container:nth-child(3)'));
  
  jitterSlider = createSlider(0, 20, jitterAmount);
  jitterSlider.parent(select('.controls-content .slider-container:nth-child(4)'));
  
  trailSlider = createSlider(50, 500, maxTrails);
  trailSlider.parent(select('.controls-content .slider-container:nth-child(5)'));
  
  gravitySlider = createSlider(0, 0.5, 0, 0.01);
  gravitySlider.parent(select('.controls-content .slider-container:nth-child(6)'));
  
  // Add reset button functionality
  select('#reset-button').mousePressed(resetCanvas);
  
  // Add export button functionality
  select('#export-button').mousePressed(exportCanvas);
}

function resetCanvas() {
  // Clear the trails array
  trails = [];
  
  // Reset circle position to center
  x = width / 2;
  y = height / 2;
  
  // Reset speed to random values
  xspeed = random(-2, 2);
  yspeed = random(-2, 2);
  
  // Reset color angle
  colorAngle = 0;
  
  // Clear mouse target
  hasMouseTarget = false;
  
  // Force a clear background
  background(220);
}

function exportCanvas() {
  // Get current date and time for filename
  let now = new Date();
  let timestamp = now.getFullYear() + 
                  String(now.getMonth() + 1).padStart(2, '0') + 
                  String(now.getDate()).padStart(2, '0') + '_' +
                  String(now.getHours()).padStart(2, '0') + 
                  String(now.getMinutes()).padStart(2, '0') + 
                  String(now.getSeconds()).padStart(2, '0');
  
  // Save canvas as image with timestamp
  saveCanvas('orbital_visualization_' + timestamp, 'png');
}

function draw() {
  // Read slider values first
  diameter = diameterSlider.value();
  let colorSpeed = colorSlider.value();
  speedMultiplier = speedSlider.value();
  jitterAmount = jitterSlider.value();
  maxTrails = trailSlider.value();
  gravitationalStrength = gravitySlider.value();
  
  // Create feedback effect - when trail length is at max (500), trails never fade
  let backgroundOpacity = maxTrails >= 500 ? 0 : map(maxTrails, 50, 499, 15, 1);
  background(220, backgroundOpacity);
  
  // Update colorAngle based on slider (controls oscillation speed)
  colorAngle += colorSpeed * 0.01;
  
  // Update color based on sine oscillation
  let r = 127 * sin(colorAngle) + 128;
  let g = 127 * sin(colorAngle + PI/3) + 128;
  let b = 127 * sin(colorAngle + 2*PI/3) + 128;
  circleColor = color(r, g, b, 180);
  
  // Add current position to trails array
  trails.push({x, y, diameter, col: circleColor});
  
  // Keep trails array at max length
  if (trails.length > maxTrails) {
    trails.shift(); // Remove oldest trail
  }
  
  // Draw trails with fading effect
  for (let i = 0; i < trails.length; i++) {
    let trail = trails[i];
    let alpha = map(i, 0, trails.length, 0, 255); // Fade older trails
    let trailColor = color(red(trail.col), green(trail.col), blue(trail.col), alpha);
    fill(trailColor);
    noStroke();
    ellipse(trail.x, trail.y, trail.diameter * map(i, 0, trails.length, 0.2, 1));
  }
  
  // Draw current circle
  fill(circleColor);
  stroke(0);  // Black outline
  strokeWeight(1.5);  // Outline thickness
  ellipse(x, y, diameter);
  
  // Determine gravity target: mouse target takes priority over center
  let gravityTargetX, gravityTargetY;
  let useMouseTarget = hasMouseTarget && gravitationalStrength > 0;
  
  if (useMouseTarget) {
    // Use mouse target as gravity source
    gravityTargetX = mouseTargetX;
    gravityTargetY = mouseTargetY;
  } else {
    // Use center as gravity source
    gravityTargetX = centerX;
    gravityTargetY = centerY;
  }
  
  // Calculate gravitational pull to the active target
  let dx = gravityTargetX - x;
  let dy = gravityTargetY - y;
  let distanceToTarget = sqrt(dx*dx + dy*dy);
  
  // Apply gravitational force if target exists and gravity is enabled
  if (distanceToTarget > 0 && gravitationalStrength > 0) {
    let gravityForce = gravitationalStrength / (distanceToTarget * 0.01 + 1);
    xspeed += (dx / distanceToTarget) * gravityForce;
    yspeed += (dy / distanceToTarget) * gravityForce;
  }
  
  // Add periodic trajectory shifts for chaotic orbits (always active for center, disabled for mouse targets)
  if (!useMouseTarget) {
    let timeShift = frameCount * 0.01;
    let shiftForce = 0.02 * speedMultiplier;
    xspeed += sin(timeShift + x * 0.01) * shiftForce;
    yspeed += cos(timeShift + y * 0.01) * shiftForce;
  }
  
  // Apply speed limit to prevent extreme velocities but allow for more dynamic motion
  let maxSpeed = 3 + (2 * speedMultiplier);
  let currentSpeed = sqrt(xspeed*xspeed + yspeed*yspeed);
  if (currentSpeed > maxSpeed) {
    xspeed = (xspeed / currentSpeed) * maxSpeed;
    yspeed = (yspeed / currentSpeed) * maxSpeed;
  }
  
  // Update position with jitter
  x += xspeed + random(-jitterAmount, jitterAmount);
  y += yspeed + random(-jitterAmount, jitterAmount);
  
  // Wrap around edges instead of bouncing
  if (x > width) x = 0;
  if (x < 0) x = width;
  if (y > height) y = 0;
  if (y < 0) y = height;
  
  // Update value displays in the HTML
  select('#diameter-value').html(diameter);
  select('#color-value').html(colorSpeed);
  select('#speed-value').html(speedMultiplier.toFixed(1));
  select('#jitter-value').html(jitterAmount);
  select('#trail-value').html(maxTrails);
  select('#gravity-value').html(gravitationalStrength.toFixed(2));
}

// Mouse interaction functions
function mousePressed() {
  // Check if mouse is over the control panel
  let controlsPanel = select('#controls');
  let rect = controlsPanel.elt.getBoundingClientRect();
  
  // If mouse is not over the control panel, set/replace mouse target
  if (mouseX < rect.left || mouseX > rect.right || 
      mouseY < rect.top || mouseY > rect.bottom) {
    // Silently replace any existing target with new position
    mouseTargetX = mouseX;
    mouseTargetY = mouseY;
    hasMouseTarget = true;
  }
}

// Double-click to remove mouse target
function doubleClicked() {
  hasMouseTarget = false;
}

// Accordion functionality for both panels
document.addEventListener('DOMContentLoaded', function() {
  const controlsHeader = document.getElementById('controls-header');
  const controlsPanel = document.getElementById('controls');
  const infoHeader = document.getElementById('info-header');
  const infoPanel = document.getElementById('info');
  
  controlsHeader.addEventListener('click', function() {
    // If info is open, close it first
    if (!infoPanel.classList.contains('collapsed')) {
      infoPanel.classList.add('collapsed');
    }
    // Then toggle controls
    controlsPanel.classList.toggle('collapsed');
  });
  
  infoHeader.addEventListener('click', function() {
    // If controls is open, close it first
    if (!controlsPanel.classList.contains('collapsed')) {
      controlsPanel.classList.add('collapsed');
    }
    // Then toggle info
    infoPanel.classList.toggle('collapsed');
  });
});
