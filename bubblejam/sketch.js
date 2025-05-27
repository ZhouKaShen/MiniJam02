let bubbleImg, fishImg;
let pixelFont;
let bubbleX, bubbleY;
let bubbleSize = 100;
let floatOffset = 0;
let floatSpeed = 0.05;

let score = 0;
let clickPower = 1;

let fishCount = 0;
let fishPower = 1;
let fishUpgradeLevel = 1; // 1 = normal, 2 = x1.5, 3 = x2

let fishArray = [];

let isPopping = false;
let popTimer = 0;

// Pixel font em estilo retrô (você pode trocar para sua fonte pixel)
function preload() {
   bubbleImg = loadImage('bubble.png');
  fishImg = loadImage('fish.png');
  pixelFont = loadFont('pixelFont.ttf');
}

function setup() {
  createCanvas(800, 400);
  textFont(pixelFont); // fonte pixelada básica
  textAlign(CENTER, CENTER);
  imageMode(CENTER);

  bubbleX = width / 2;
  bubbleY = height / 2;
}

function drawPixelButton(x, y, w, h, label, cost = null) {
  stroke(255);
  strokeWeight(2);
  noFill();
  rect(x, y, w, h);

  noStroke();
  fill(255);
  textSize(8);  // reduzido para caber melhor
  text(label, x + w / 2, y + h / 2 - 6);

  if (cost !== null) {
    textSize(7);
    text("Custo: " + cost, x + w / 2, y + h / 2 + 8);
  }
}

function draw() {
  drawWaterBackground();
  floatOffset = sin(frameCount * floatSpeed) * 10;

  drawScore();
  drawFish();             // peixe atrás da bolha
  drawFishUpgradePanel(); // agora por cima dos peixes            // peixe atrás da bolha
  drawBubble();
  drawUpgradePanel();     // direita
  drawBPS();
  autoClicker();

  if (isPopping) {
    popTimer--;
    if (popTimer <= 0) {
      isPopping = false;
    }
  }
}

// Fundo azul água com gradiente simples
function drawWaterBackground() {
  for (let i = 0; i < height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c = lerpColor(color(0, 60, 150), color(0, 130, 200), inter);
    stroke(c);
    line(0, i, width, i);
  }
}

// Texto do score no topo centralizado
function drawScore() {
  fill(255);
  textSize(14);  // menor que antes
  text("BOLHAS: " + floor(score), width / 2, 20);
}

// Mostra bolhas por segundo embaixo do score
function drawBPS() {
  fill(255);
  textSize(10);  // menor que antes
  let bps = fishCount * fishPower;
  text("Bolhas por segundo: " + nf(bps, 1, 1), width / 2, 45);
}

// Bolha flutuante no centro, clicável
function drawBubble() {
  push();
  translate(bubbleX, bubbleY + floatOffset);
  if (isPopping) {
    scale(1.2);
  }
  image(bubbleImg, 0, 0, bubbleSize, bubbleSize);
  pop();
}

// Peixes nadando da direita para esquerda, atrás da bolha
function drawFish() {
  for (let i = 0; i < fishArray.length; i++) {
    let f = fishArray[i];

    // Desenha peixe virado para a esquerda corretamente
    image(fishImg, f.x, f.y, 40, 20);

    // Movimento da direita para a esquerda
    f.x -= f.speed;

    // Quando o peixe sai completamente da tela à esquerda, reaparece à direita
    if (f.x < -50) {
      f.x = width + random(100, 200);  // reaparece fora da tela à direita
      f.y = random(50, height - 50);   // nova altura aleatória
      f.speed = random(1, 2);          // nova velocidade aleatória
    }
  }
}

// Área de upgrade dos peixes (canto esquerdo)
function drawFishUpgradePanel() {
  fill(0, 0, 50, 180);
  noStroke();
  rect(0, 0, 200, height);

  fill(255);
  textSize(10);
  text("UPGRADES MARÍTIMOS", 100, 30);

  textSize(8);  // menor para alinhar melhor com botão
  text("PEIXES: " + fishCount, 100, 55);
  text("MULTIPLICADOR: x" + fishPower, 100, 70);

  let upgradeLabel = "";
  let upgradeCost = 0;

  if (fishUpgradeLevel === 1) {
    upgradeLabel = "UPGRADE PEIXES x1.5";
    upgradeCost = 500;
  } else if (fishUpgradeLevel === 2) {
    upgradeLabel = "UPGRADE PEIXES x2";
    upgradeCost = 1000;
  } else {
    upgradeLabel = "MÁXIMO ALCANÇADO";
  }

  if (fishUpgradeLevel <= 2) {
    drawPixelButton(20, 100, 160, 40, upgradeLabel, upgradeCost);
  } else {
    fill(255);
    textSize(8);
    text(upgradeLabel, 100, 120);
  }
}

// Área upgrades clique e compra peixes (canto direito)
function drawUpgradePanel() {
  fill(0, 0, 50, 180);
  noStroke();
  rect(600, 0, 200, height);

  fill(255);
  textSize(12);
  text("UPGRADES", 700, 30);
  textSize(10);
  text("Clique: " + clickPower, 700, 55);

  // Botão upgrade clique
  let upgradeCost = clickPower * 10;
  drawPixelButton(620, 100, 150, 40, "UPGRADE CLIQUE", upgradeCost);

  // Comprar peixe
  let fishCost = 50 + fishCount * 25;
  drawPixelButton(620, 160, 150, 40, "COMPRAR PEIXE", fishCost);
}

// Auto clique dos peixes
function autoClicker() {
  let gain = fishCount * fishPower / 60; // frameRate ~60, assim distribui por frame
  score += gain;
}

// Adiciona peixe no array
function addFish() {
  fishArray.push({
    x: 600 + random(50, 200),     // começa do lado direito da área central
    y: random(50, height - 50),
    speed: random(1, 2)
  });
}

function mousePressed() {
  // Clique na bolha
  if (dist(mouseX, mouseY, bubbleX, bubbleY + floatOffset) < bubbleSize / 2) {
    score += clickPower;
    isPopping = true;
    popTimer = 5;
  }

  // Botão upgrade de clique (direita)
  if (mouseX > 620 && mouseX < 770 && mouseY > 100 && mouseY < 140) {
    let upgradeCost = clickPower * 10;
    if (score >= upgradeCost) {
      score -= upgradeCost;
      clickPower++;
    }
  }

  // Comprar peixe (direita)
  if (mouseX > 620 && mouseX < 770 && mouseY > 160 && mouseY < 200) {
    let fishCost = 50 + fishCount * 25;
    if (score >= fishCost) {
      score -= fishCost;
      fishCount++;
      addFish();
    }
  }

  // Upgrade único de peixe (esquerda)
  if (mouseX > 20 && mouseX < 180 && mouseY > 100 && mouseY < 140) {
    if (fishUpgradeLevel === 1 && score >= 500) {
      score -= 500;
      fishPower = 1.5;
      fishUpgradeLevel = 2;
    } else if (fishUpgradeLevel === 2 && score >= 1000) {
      score -= 1000;
      fishPower = 2;
      fishUpgradeLevel = 3;
    }
  }
}