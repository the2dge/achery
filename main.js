var svg = document.querySelector("svg");
var cursor = svg.createSVGPoint();
var arrows = document.querySelector(".arrows");
var randomAngle = 0;

// Game stats
var score = 0;
var arrowsLeft = 10;

// center of target
var target = {
  x: 900,
  y: 249.5
};

// target intersection line segment
var lineSegment = {
  x1: 875,
  y1: 280,
  x2: 925,
  y2: 220
};

// bow rotation point
var pivot = {
  x: 100,
  y: 250
};
// Create logo with URL link
function createLogo() {
  // Create a group for the logo
  var logoGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  logoGroup.setAttribute("id", "logo");
  logoGroup.style.cursor = "pointer";
  
  // Create a link element
  var link = document.createElementNS("http://www.w3.org/2000/svg", "a");
  link.setAttributeNS('http://www.w3.org/1999/xlink', 'href', "https://theislandedge.com/");
  link.setAttribute("target", "_blank");
  
  // Create a rectangle as background (optional)
  var logoBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  logoBg.setAttribute("x", "820");
  logoBg.setAttribute("y", "20");
  logoBg.setAttribute("width", "160");
  logoBg.setAttribute("height", "60");
  logoBg.setAttribute("rx", "5");
  logoBg.setAttribute("fill", "#fff");
  logoBg.setAttribute("opacity", "0.8");
  
  // Create an image element for the logo
  var logoImage = document.createElementNS("http://www.w3.org/2000/svg", "image");
  logoImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', "logo.png");
  logoImage.setAttribute("x", "830");
  logoImage.setAttribute("y", "25");
  logoImage.setAttribute("width", "140");
  logoImage.setAttribute("height", "50");
  
  // Add tooltip text
  var titleText = document.createElementNS("http://www.w3.org/2000/svg", "title");
  titleText.textContent = "Visit our website";
  
  // Append elements
  link.appendChild(logoBg);
  link.appendChild(logoImage);
  link.appendChild(titleText);
  logoGroup.appendChild(link);
  svg.appendChild(logoGroup);
  
  // Add a text label below the logo (optional)
  var logoText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  logoText.setAttribute("x", "900");
  logoText.setAttribute("y", "95");
  logoText.setAttribute("text-anchor", "middle");
  logoText.setAttribute("fill", "#333");
  logoText.setAttribute("font-size", "12");
  logoText.textContent = "歡迎點擊Logo訪問我們的網站";
  
  svg.appendChild(logoText);
}

// Create scoreboard
function createScoreboard() {
  var scoreboardGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  scoreboardGroup.setAttribute("id", "scoreboard");
  
  var scoreboardBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  scoreboardBg.setAttribute("x", "20");
  scoreboardBg.setAttribute("y", "20");
  scoreboardBg.setAttribute("width", "150");
  scoreboardBg.setAttribute("height", "70");
  scoreboardBg.setAttribute("rx", "5");
  scoreboardBg.setAttribute("fill", "#333");
  scoreboardBg.setAttribute("opacity", "0.7");
  
  var scoreText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  scoreText.setAttribute("id", "score-text");
  scoreText.setAttribute("x", "35");
  scoreText.setAttribute("y", "50");
  scoreText.setAttribute("fill", "#fff");
  scoreText.setAttribute("font-size", "20");
  scoreText.textContent = "Score: 0";
  
  var arrowsText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  arrowsText.setAttribute("id", "arrows-text");
  arrowsText.setAttribute("x", "35");
  arrowsText.setAttribute("y", "75");
  arrowsText.setAttribute("fill", "#fff");
  arrowsText.setAttribute("font-size", "20");
  arrowsText.textContent = "Arrows: 10";
  
  scoreboardGroup.appendChild(scoreboardBg);
  scoreboardGroup.appendChild(scoreText);
  scoreboardGroup.appendChild(arrowsText);
  
  svg.appendChild(scoreboardGroup);
}

// Update scoreboard
function updateScoreboard() {
  document.getElementById("score-text").textContent = "Score: " + score;
  document.getElementById("arrows-text").textContent = "Arrows: " + arrowsLeft;
}

// Create reset button
function createResetButton() {
  var resetGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  resetGroup.setAttribute("id", "reset-button");
  resetGroup.style.cursor = "pointer";
  
  var resetBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  resetBg.setAttribute("x", "20");
  resetBg.setAttribute("y", "100");
  resetBg.setAttribute("width", "150");
  resetBg.setAttribute("height", "40");
  resetBg.setAttribute("rx", "5");
  resetBg.setAttribute("fill", "#88ce02");
  
  var resetText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  resetText.setAttribute("x", "40");
  resetText.setAttribute("y", "125");
  resetText.setAttribute("fill", "#fff");
  resetText.setAttribute("font-size", "18");
  resetText.textContent = "Reset Game";
  
  resetGroup.appendChild(resetBg);
  resetGroup.appendChild(resetText);
  resetGroup.addEventListener("click", resetGame);
  
  svg.appendChild(resetGroup);
}

// Reset game
function resetGame() {
  score = 0;
  arrowsLeft = 10;
  updateScoreboard();
  
  // Remove all arrows
  while (arrows.firstChild) {
    arrows.removeChild(arrows.firstChild);
  }
  
  // Hide any messages
  TweenMax.set(".miss", { autoAlpha: 0 });
  TweenMax.set(".hit", { autoAlpha: 0 });
  TweenMax.set(".bullseye", { autoAlpha: 0 });
  
  // Enable drawing
  window.addEventListener("mousedown", draw);
}

// Initialize game
function initGame() {
  createScoreboard();
  createResetButton();
  createLogo();
  aim({
    clientX: 320,
    clientY: 300
  });
}

// Call init function
initGame();

// set up start drag event
window.addEventListener("mousedown", draw);

function draw(e) {
  // Check if there are arrows left
  if (arrowsLeft <= 0) {
    return;
  }
  
  // pull back arrow
  randomAngle = (Math.random() * Math.PI * 0.03) - 0.015;
  TweenMax.to(".arrow-angle use", 0.3, {
    opacity: 1
  });
  window.addEventListener("mousemove", aim);
  window.addEventListener("mouseup", loose);
  aim(e);
}

function aim(e) {
  // get mouse position in relation to svg position and scale
  var point = getMouseSVG(e);
  point.x = Math.min(point.x, pivot.x - 7);
  point.y = Math.max(point.y, pivot.y + 27);
  var dx = point.x - pivot.x;
  var dy = point.y - pivot.y;
  // Make it more difficult by adding random angle each time
  var angle = Math.atan2(dy, dx) + randomAngle;
  var bowAngle = angle - Math.PI;
  var distance = Math.min(Math.sqrt((dx * dx) + (dy * dy)), 50);
  var scale = Math.min(Math.max(distance / 30, 1), 2);
  TweenMax.to("#bow", 0.3, {
    scaleX: scale,
    rotation: bowAngle + "rad",
    transformOrigin: "right center"
  });
  var arrowX = Math.min(pivot.x - ((1 / scale) * distance), 88);
  TweenMax.to(".arrow-angle", 0.3, {
    rotation: bowAngle + "rad",
    svgOrigin: "100 250"
  });
  TweenMax.to(".arrow-angle use", 0.3, {
    x: -distance
  });
  TweenMax.to("#bow polyline", 0.3, {
    attr: {
      points: "88,200 " + Math.min(pivot.x - ((1 / scale) * distance), 88) + ",250 88,300"
    }
  });

  var radius = distance * 9;
  var offset = {
    x: (Math.cos(bowAngle) * radius),
    y: (Math.sin(bowAngle) * radius)
  };
  var arcWidth = offset.x * 3;

  TweenMax.to("#arc", 0.3, {
    attr: {
      d: "M100,250c" + offset.x + "," + offset.y + "," + (arcWidth - offset.x) + "," + (offset.y + 50) + "," + arcWidth + ",50"
    },
      autoAlpha: distance/60
  });
}

function loose() {
  // Decrement arrows left
  arrowsLeft--;
  updateScoreboard();
  
  // release arrow
  window.removeEventListener("mousemove", aim);
  window.removeEventListener("mouseup", loose);

  TweenMax.to("#bow", 0.4, {
    scaleX: 1,
    transformOrigin: "right center",
    ease: Elastic.easeOut
  });
  TweenMax.to("#bow polyline", 0.4, {
    attr: {
      points: "88,200 88,250 88,300"
    },
    ease: Elastic.easeOut
  });
  // duplicate arrow
  var newArrow = document.createElementNS("http://www.w3.org/2000/svg", "use");
  newArrow.setAttributeNS('http://www.w3.org/1999/xlink', 'href', "#arrow");
  arrows.appendChild(newArrow);

  // animate arrow along path
  var path = MorphSVGPlugin.pathDataToBezier("#arc");
  TweenMax.to([newArrow], 0.5, {
    force3D: true,
    bezier: {
      type: "cubic",
      values: path,
      autoRotate: ["x", "y", "rotation"]
    },
    onUpdate: hitTest,
    onUpdateParams: ["{self}"],
    onComplete: onMiss,
    ease: Linear.easeNone
  });
  TweenMax.to("#arc", 0.3, {
    opacity: 0
  });
  //hide previous arrow
  TweenMax.set(".arrow-angle use", {
    opacity: 0
  });
  
  // Check if game over
  if (arrowsLeft <= 0) {
    setTimeout(showGameOver, 1500);
  }
}

function hitTest(tween) {
  // check for collisions with arrow and target
  var arrow = tween.target[0];
  var transform = arrow._gsTransform;
  var radians = transform.rotation * Math.PI / 180;
  var arrowSegment = {
    x1: transform.x,
    y1: transform.y,
    x2: (Math.cos(radians) * 60) + transform.x,
    y2: (Math.sin(radians) * 60) + transform.y
  }

  var intersection = getIntersection(arrowSegment, lineSegment);
  if (intersection.segment1 && intersection.segment2) {
    tween.pause();
    var dx = intersection.x - target.x;
    var dy = intersection.y - target.y;
    var distance = Math.sqrt((dx * dx) + (dy * dy));
    var selector = ".hit";
    var points = 5;
    
    if (distance < 7) {
      selector = ".bullseye";
      points = 10;
    }
    
    // Add points to score
    score += points;
    updateScoreboard();
    
    showMessage(selector);
  }
}

function onMiss() {
  // Damn!
  showMessage(".miss");
}

function showMessage(selector) {
  // handle all text animations by providing selector
  TweenMax.killTweensOf(selector);
  TweenMax.killChildTweensOf(selector);
  TweenMax.set(selector, {
    autoAlpha: 1
  });
  TweenMax.staggerFromTo(selector + " path", .5, {
    rotation: -5,
    scale: 0,
    transformOrigin: "center"
  }, {
    scale: 1,
    ease: Back.easeOut
  }, .05);
  TweenMax.staggerTo(selector + " path", .3, {
    delay: 2,
    rotation: 20,
    scale: 0,
    ease: Back.easeIn
  }, .03);
}

function showGameOver() {
  // Create game over message
  var gameOverGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  gameOverGroup.setAttribute("id", "game-over");
  
  var gameOverBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  gameOverBg.setAttribute("x", "300");
  gameOverBg.setAttribute("y", "150");
  gameOverBg.setAttribute("width", "400");
  gameOverBg.setAttribute("height", "100");
  gameOverBg.setAttribute("rx", "10");
  gameOverBg.setAttribute("fill", "#333");
  gameOverBg.setAttribute("opacity", "0.9");
  
  var gameOverText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  gameOverText.setAttribute("x", "500");
  gameOverText.setAttribute("y", "190");
  gameOverText.setAttribute("text-anchor", "middle");
  gameOverText.setAttribute("fill", "#fff");
  gameOverText.setAttribute("font-size", "30");
  gameOverText.textContent = "遊戲結束!";
  
  var finalScoreText = document.createElementNS("http://www.w3.org/2000/svg", "text");
  finalScoreText.setAttribute("x", "500");
  finalScoreText.setAttribute("y", "230");
  finalScoreText.setAttribute("text-anchor", "middle");
  finalScoreText.setAttribute("fill", "#fff");
  finalScoreText.setAttribute("font-size", "24");
  finalScoreText.textContent = "最終得分: " + score;
  
  gameOverGroup.appendChild(gameOverBg);
  gameOverGroup.appendChild(gameOverText);
  gameOverGroup.appendChild(finalScoreText);
  
  svg.appendChild(gameOverGroup);
  
  // Animate in
  TweenMax.from(gameOverGroup, 0.5, {
    opacity: 0,
    y: -50,
    ease: Back.easeOut
  });
  
  // Remove after 4 seconds
  setTimeout(function() {
    if (gameOverGroup.parentNode) {
      svg.removeChild(gameOverGroup);
    }
  }, 4000);
}

function getMouseSVG(e) {
  // normalize mouse position within svg coordinates
  cursor.x = e.clientX;
  cursor.y = e.clientY;
  return cursor.matrixTransform(svg.getScreenCTM().inverse());
}

function getIntersection(segment1, segment2) {
  // find intersection point of two line segments and whether or not the point is on either line segment
  var dx1 = segment1.x2 - segment1.x1;
  var dy1 = segment1.y2 - segment1.y1;
  var dx2 = segment2.x2 - segment2.x1;
  var dy2 = segment2.y2 - segment2.y1;
  var cx = segment1.x1 - segment2.x1;
  var cy = segment1.y1 - segment2.y1;
  var denominator = dy2 * dx1 - dx2 * dy1;
  if (denominator == 0) {
    return null;
  }
  var ua = (dx2 * cy - dy2 * cx) / denominator;
  var ub = (dx1 * cy - dy1 * cx) / denominator;
  return {
    x: segment1.x1 + ua * dx1,
    y: segment1.y1 + ua * dy1,
    segment1: ua >= 0 && ua <= 1,
    segment2: ub >= 0 && ub <= 1
  };
}