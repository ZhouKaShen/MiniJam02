let pixelFont;
let bubbleImg;
let tela;
let efeito;
let faseTransicao = null;
let tempoInicioTransicao = 0;
let tempoInicioBubble;
let estadoBubble = "esperando"; // "esperando", "fadeIn", "ativo", "fadeOut"
let alphaBubble = 0;
let bubbleX, bubbleY;


function preload() {
  bubbleImg = loadImage('bubble.png');
    pixelFont = loadFont('pixelFont.ttf');
  efeito = loadImage('efeito.webp');
}

function lore() {
        fill(255,255,255,alphaLore)
      textFont('pixelFont.ttf')
      noStroke()
      text("Onde estou?", 400, 200)
      
}

function cookie() {
  image(bubbleImg, )
}


function setup() {
  createCanvas(800, 400);
    teste = createVector(400,200)
    testevel = createVector(-13,-13)
  tela = "menu";
  alphaCreditos = 0
  alphaPlay = 0
  alphaCookie = 0
  alphaLore = 0
  tempoInicioBubble = millis();
  
}



function creditos() {
   if (alphaCreditos < 255) {
    alphaCreditos += 4;
  }
  
  fill(255, alphaCreditos)
  rect(197.5,97.5,405,205, 10)
  fill(255,100,30);
  rect(200,100,400,200,10);
  fill(255, alphaCreditos);
  noStroke();
  textSize(20)
  textFont(pixelFont);
  text("Alunos: ", 320, 140)
  textSize(12)
  text("Pedro Antonio, Felipe Zhu", 230, 180)
  text("Gustavo Delinski, Zhou Ka Shen", 220, 210)  
  rect(320,250,150,30,10)
  fill(0, alphaCreditos)
  text("Voltar", 360, 272.5)

}

function mousePressed() {
  if (mouseX > 300 && mouseX < 500 && mouseY > 250 && mouseY < 315 && tela === "menu") {
    tela = "creditos";
    alphaCreditos = 0;
  } 
  else if (mouseX > 320 && mouseX < 480 && mouseY > 250 && mouseY < 280 && tela === "creditos") {
    tela = "menu";
  } 
  else if (mouseX > 300 && mouseX < 500 && mouseY > 150 && mouseY < 220 && tela === "menu") {
    tela = "jogo";
    alphaPlay = 0;
    faseTransicao = "in";
  }
  if (estadoBubble === "ativo") {
  let d = dist(mouseX, mouseY, bubbleX + 25, bubbleY + 25); // Considerando centro
  if (d < 25) {
    estadoBubble = "fadeOut";
  }
}
}

function titulo() {
    fill(255, 100,30)
  rect(300,150,200,70,10)
  rect(300,250,200,70,10)
  fill(255)
  noStroke()
  textFont(pixelFont);
  textSize(15)
  text("JOGAR", 360,195);
  text("CRÉDITOS", 340,295);
  textSize(25)
  text("Bubble Clicker", 240, 100)
 
  
}

function drawWaterBackground() {
  for (let i = 0; i < height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c = lerpColor(color(0, 60, 150), color(0, 130, 200), inter);
    stroke(c);
    line(0, i, width, i);
  }
}

function draw() {
  drawWaterBackground();

  if (tela === "menu") {
    titulo(); 
  } 
  else if (tela === "creditos") {
    creditos(); 
  } 
  else if (tela === "jogo") {
    image(efeito, teste.x, teste.y, 900, 900);
    teste.add(testevel);

    // Transição com fade
    fill(0, 0, 0, alphaPlay);
    rect(0, 0, width, height);

    if (faseTransicao === "in") {
      if (alphaPlay < 255) {
        alphaPlay += 3;
      } else {
        faseTransicao = "espera";
        tempoInicioTransicao = millis(); // Marca tempo para esperar
      }
    } 
    else if (faseTransicao === "espera") {
      if (millis() - tempoInicioTransicao > 1000) {
        faseTransicao = "out";
      }
    } 
    else if (faseTransicao === "out") {
      if (alphaPlay > 0) {
        alphaPlay -= 5;
      }
    }
    // Gerenciamento da bolha "especial"
let tempoAgora = millis();

if (estadoBubble === "esperando") {
  if (tempoAgora - tempoInicioBubble >= 40000) {
    // 40 segundos se passaram
    estadoBubble = "fadeIn";
    bubbleX = random(50, width - 50);
    bubbleY = random(50, height - 50);
  }
} else if (estadoBubble === "fadeIn") {
  if (alphaBubble < 255) {
    alphaBubble += 5;
  } else {
    estadoBubble = "ativo";
  }
} else if (estadoBubble === "fadeOut") {
  if (alphaBubble > 0) {
    alphaBubble -= 5;
  } else {
    estadoBubble = "esperando";
    tempoInicioBubble = millis(); // Reinicia o ciclo
  }
}

if (estadoBubble !== "esperando") {
  tint(255, alphaBubble);
  image(bubbleImg, bubbleX, bubbleY, 50, 50);
  noTint(); // Reseta o tint para outras imagens
}

  }
}
