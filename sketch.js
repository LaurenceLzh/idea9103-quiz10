let song;

function preload() {
  // Fill in the url for your audio asset
  song = loadSound("sample-visualisation.mp3");
}

function setup() {
  cnv = createCanvas(window.innerWidth, window.innerHeight);
  // Create a new FFT analysis object
  fft = new p5.FFT();
  // Add the song (sample) into the FFT's input
  song.connect(fft);
}

function draw() {
  // Give the user a hint on how to interact with the sketch
  if (getAudioContext().state !== 'running') {
  background(220);
  text('tap here to play some sound!', 10, 20, width - 20);
  // Early exit of the draw loop
  return;
  }
  let centroidplot = 0.0;
  let spectralCentroid = 0;

  background(0);
  translate(windowWidth / 2, windowHeight / 2);

  // Request fresh data from the FFT analysis
  let spectrum = fft.analyze();

  var bass = fft.getEnergy(100, 150);
  var treble = fft.getEnergy(150, 250);
  var mid = fft.getEnergy("mid");

  var mapMid = map(mid, 0, 255, -100, 200);
  var scaleMid = map(mid, 0, 255, 1, 1.5);

  var mapTreble = map(treble, 0, 255, 200, 350);
  var scaleTreble = map(treble, 0, 255, 0, 1);

  var mapbass = map(bass, 0, 255, 50, 200);
  var scalebass = map(bass, 0, 255, 0.05, 1.2);

  mapMouseX = map(mouseX, 0, width, 1, 50);
  mapMouseXbass = map(mouseX, 0, width, 1, 5);
  mapMouseY = map(mouseY, 0, height, 2, 6);

  pieces = 20;
  radius = 100;

  for (i = 0; i < pieces; i += 0.1) {
    rotate(TWO_PI / (pieces / 2));
    noFill();

    // Bass
    push();
    stroke('yellow');
    rotate(frameCount * 0.002);
    strokeWeight(0.5);
    polygon(mapbass + i, mapbass - i, mapMouseXbass * i, 3);
    pop();

    // Bass 1
    push();
    stroke('#393684');
    rotate(frameCount * 0.002);
    strokeWeight(1);
    rotate((mouseX * 0.002));
    scale(mouseX * 0.002);
    polygon(mapbass + i, mapbass - i, mapMouseXbass * i / 3, 5);
    pop();

    // Bass Scale
    push();
    stroke('#5cadff');
    rotate(frameCount * 0.002);
    strokeWeight(0.1);
    polygon(scaleMid + i, scaleMid - i, mapMouseXbass * i, 5);
    pop();


    // MID
    push();
    stroke("#2d8cf0");
    strokeWeight(0.2);
    polygon(mapMid + i / 2, mapMid - i * 2, mapMouseX * i, 7);
    pop();

    // MID Scale
    push();
    stroke("purple");
    strokeWeight(0.2);
    polygon(scaleTreble + i / 2, scaleTreble - i * 2, mapMouseX * i, 10);
    pop();


    // TREMBLE
    push();
    stroke("#19be6b");
    strokeWeight(0.6);
    scale(mouseX * 0.0005);
    rotate((mouseX * 0.002));
    circle(mapTreble + i / 2, mapTreble - i / 2, 50)
    pop();
  }
}

// Toggle playback on or off with a mouse click
function mousePressed() {
  if (song.isPlaying()) {
    // .isPlaying() returns a boolean
    song.stop();
    background(255, 0, 0);
  } else {
    song.play();
    background(0, 255, 0);
  }
}

function polygon(x, y, radius, npoints) {
  let angle = TWO_PI / npoints;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

let nyquist = 22050;

// get the centroid
spectralCentroid = fft.getCentroid();

// The mean_freq_index calculation is for the display.
let mean_freq_index = spectralCentroid / (nyquist / spectrum.length);

// Use a log scale to match the energy per octave in the FFT display
centroidplot = map(log(mean_freq_index), 0, log(spectrum.length), 0, width);

stroke(255, 0, 0); // the line showing where the centroid is will be red

rect(centroidplot, 0, width / spectrum.length, height)
noStroke();
fill(255, 255, 255);  // text is white
text('centroid: ', 10, 20);
text(round(spectralCentroid) + ' Hz', 10, 40);
