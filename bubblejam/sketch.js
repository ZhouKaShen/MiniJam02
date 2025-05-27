let bubbleImg, fishImg, seahorseImg;
let fishImg2, fishImg3;
let pixelFont;
let bubbleX, bubbleY;
let bubbleSize = 100;
let floatOffset = 0;
let floatSpeed = 0.05;
let floatingTexts = [];


let seahorseCount = 0;
let seahorsePower = 5;
let seahorseUpgradeLevel = 1;
let seahorseArray = [];
let seahorseBubbles = [];

let score = 100000;
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
  fish2Img = loadImage('fish2.png');
  fish3Img = loadImage('fish3.png');
  pixelFont = loadFont('pixelFont.ttf');
  seahorseImg = loadImage('seahorse.png');
  
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
  drawFish(); // peixe atrás da bolha
  drawSeahorses(); // cavalos-marinhos com animação e bolhas
  updateSeahorseBubbles(); // rastro de bolhas
  drawFishUpgradePanel(); // agora por cima dos peixes            // peixe atrás da bolha
  drawBubble();
  drawUpgradePanel();     // direita
  drawBPS();
  autoClicker();
  drawFloatingTexts();

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
  let bps = fishCount * fishPower + seahorseCount * seahorsePower;
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

     // Seleciona a imagem com base no nível de upgrade
    let currentFishImg;
    if (fishUpgradeLevel === 1) {
      currentFishImg = fishImg;
    } else if (fishUpgradeLevel === 2) {
      currentFishImg = fish2Img;
    } else {
      currentFishImg = fish3Img;
    }

    // Desenha peixe com a imagem correta
    image(currentFishImg, f.x, f.y, 40, 20);

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
  textSize(8);
  text("CAVALOS MARINHOS: " + seahorseCount, 100, 90);
  text("MULTIPLICADOR: x" + seahorsePower, 100, 105);


  let upgradeLabel = "";
  let upgradeCost = 0;

  if (fishUpgradeLevel === 1) {
    upgradeLabel = "UPGRADE PEIXE x1.5";
    upgradeCost = 500;
  } else if (fishUpgradeLevel === 2) {
    upgradeLabel = "UPGRADE PEIXE x2";
    upgradeCost = 1000;
  } else {
    upgradeLabel = "MÁXIMO ALCANÇADO";
  }

  if (fishUpgradeLevel <= 2) {
    drawPixelButton(20, 130, 160, 40, upgradeLabel, upgradeCost);
  } else {
    fill(255);
    textSize(8);
    drawPixelButton(20, 130, 160, 40, upgradeLabel);
  }
  
  
  let seahorseUpgradeLabel = "";
  let seahorseUpgradeCost = 0;

  if (seahorseUpgradeLevel === 1) {
    seahorseUpgradeLabel = "UPGRADE CM x10";
    seahorseUpgradeCost = 1500;
  } else if (seahorseUpgradeLevel === 2) {
    seahorseUpgradeLabel = "UPGRADE CM x15";
    seahorseUpgradeCost = 2500;
  } else if (seahorseUpgradeLevel === 3) {
    seahorseUpgradeLabel = "UPGRADE CM  x20";
    seahorseUpgradeCost = 5000;
  } else {
    seahorseUpgradeLabel = "MÁXIMO ALCANÇADO";
  }

  if (seahorseUpgradeLevel <= 3) {
    drawPixelButton(20, 190, 160, 30, seahorseUpgradeLabel, seahorseUpgradeCost);
  } else {
    drawPixelButton(20, 190, 160, 40, seahorseUpgradeLabel);
  }
}

// Área upgrades clique e compra peixes (canto direito)
function drawUpgradePanel() {
  fill(0, 0, 50, 180);
  noStroke();
  rect(600, 0, 200, height);

  fill(255);
  textSize(12);
  text("COMPRAR", 700, 30);
  textSize(10);
  text("Clique: " + clickPower, 700, 55);

  // Botão upgrade clique
  let upgradeCost = clickPower * 10;
  drawPixelButton(620, 100, 150, 40, "COMPRAR CLIQUES", upgradeCost);

  // Comprar peixe
  let fishCost = 50 + fishCount * 25;
  drawPixelButton(620, 160, 150, 40, "COMPRAR PEIXE", fishCost);
  
  let seahorseCost = 150 + seahorseCount * 75;
  drawPixelButton(620, 220, 150, 40, "COMPRAR CAVALO-MARINHO", seahorseCost);
}

// Auto clique dos peixes
function autoClicker() {
  let gain = (fishCount * fishPower + seahorseCount * seahorsePower) / 60;
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

function drawFloatingTexts() {
  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    let ft = floatingTexts[i];
    fill(255, ft.alpha);
    textSize(12);
    text("+ " + ft.value, ft.x, ft.y);

    ft.y -= 0.5;         // sobe
    ft.alpha -= 3;       // fade out

    if (ft.alpha <= 0) {
      floatingTexts.splice(i, 1); // remove quando some
    }
  }
}

function mousePressed() {
  // Clique na bolha
  if (dist(mouseX, mouseY, bubbleX, bubbleY + floatOffset) < bubbleSize / 2) {
    score += clickPower;
    isPopping = true;
    popTimer = 5;

  // Adiciona texto flutuante
  floatingTexts.push({
    x: bubbleX,
    y: bubbleY + floatOffset - 20,
    value: clickPower,
    alpha: 255
  });
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

   // Upgrade dos peixes (esquerda)
  if (mouseX > 20 && mouseX < 180 && mouseY > 130 && mouseY < 170 && fishUpgradeLevel <= 2) {
    let upgradeCost = fishUpgradeLevel === 1 ? 500 : 1000;
    if (score >= upgradeCost) {
      score -= upgradeCost;
      fishUpgradeLevel++;
      if (fishUpgradeLevel === 2) {
        fishPower = 1.5;
      } else if (fishUpgradeLevel === 3) {
        fishPower = 2;
      }
    }
  }

  // Upgrade dos cavalos-marinhos (esquerda)
  if (mouseX > 20 && mouseX < 180 && mouseY > 190 && mouseY < 220 && seahorseUpgradeLevel <= 3) {
    let seahorseUpgradeCost = 0;
    if (seahorseUpgradeLevel === 1) {
      seahorseUpgradeCost = 1500;
    } else if (seahorseUpgradeLevel === 2) {
      seahorseUpgradeCost = 2500;
    } else if (seahorseUpgradeLevel === 3) {
      seahorseUpgradeCost = 5000;
    }

    if (score >= seahorseUpgradeCost) {
      score -= seahorseUpgradeCost;
      seahorseUpgradeLevel++;
      if (seahorseUpgradeLevel === 2) {
        seahorsePower = 10;
      } else if (seahorseUpgradeLevel === 3) {
        seahorsePower = 15;
      } else if (seahorseUpgradeLevel === 4) {
        seahorsePower = 20;
      }
    }
  }

  // Comprar cavalo-marinho (direita)
  if (mouseX > 620 && mouseX < 770 && mouseY > 220 && mouseY < 260) {
    let seahorseCost = 150 + seahorseCount * 75;
    if (score >= seahorseCost) {
      score -= seahorseCost;
      seahorseCount++;
      addSeahorse();
    }
  }
}

// Adiciona cavalo-marinho com posição e animação
function addSeahorse() {
  seahorseArray.push({
    x: width + random(50, 150),
    y: random(50, height - 50),
    speed: random(0.5, 1),
    offset: random(TWO_PI) // Offset aleatório para o movimento de flutuação
  });
}

// Desenha os cavalos-marinhos e anima
function drawSeahorses() {
  for (let i = 0; i < seahorseArray.length; i++) {
    let s = seahorseArray[i];

    // Calcula o deslocamento vertical com base no tempo e em um offset único para cada cavalo-marinho
    let yOffset = sin(frameCount * 0.05 + s.offset) * 10;

    // Desenha o cavalo-marinho com o deslocamento vertical
    image(seahorseImg, s.x, s.y + yOffset, 40, 40);

    // Move o cavalo-marinho para a esquerda
    s.x -= s.speed;

    // Adiciona bolhas periodicamente
    if (frameCount % 15 === 0) {
      seahorseBubbles.push({ x: s.x, y: s.y + yOffset, size: 5, alpha: 255 });
    }

    // Se o cavalo-marinho sair da tela, reposiciona à direita
    if (s.x < -50) {
      s.x = width + random(100, 200);
      s.y = random(50, height - 50);
      s.speed = random(0.5, 1);
      s.offset = random(TWO_PI); // Garante um novo offset para variar o movimento
    }
  }
}

// Bolhas flutuando dos cavalos-marinhos
function updateSeahorseBubbles() {
  for (let i = seahorseBubbles.length - 1; i >= 0; i--) {
    let b = seahorseBubbles[i];
    fill(200, 200, 255, b.alpha);
    noStroke();
    ellipse(b.x, b.y, 10);
    b.y -= 1;
    b.alpha -= 2;
    if (b.alpha <= 0) {
      seahorseBubbles.splice(i, 1);
    }
  }
}