let pixelFont;
let bubbleImg;
let tela;

function preload() {
  bubbleImg = loadImage('bubble.png');
    pixelFont = loadFont('pixelFont.ttf');
}


function setup() {
  createCanvas(800, 400);
  tela = "menu";
}

function creditos() {
  fill(255)
  rect(197.5,97.5,405,205, 10)
  fill(255,100,30);
  rect(200,100,400,200,10);
  fill(255);
  noStroke();
  textSize(20)
  textFont(pixelFont);
  text("Alunos: ", 320, 140)
  textSize(12)
  text("Pedro Antonio, Felipe Zhu", 230, 180)
  text("Gustavo Delinski, Zhou Ka Shen", 220, 210)  
  rect(320,250,150,30,10)
  fill(0)
  text("Voltar", 360, 272.5)

}

function mousePressed() {
  if (mouseX > 300 && mouseX < 500 && mouseY > 250 && mouseY < 315 && tela === "menu") {
    tela = "creditos"
  }
  
  else if (mouseX > 320 && mouseX < 480 && mouseY > 250 && mouseY < 280 && tela === "creditos") {
    tela = "menu"
  }
  
  else if (mouseX > 300 && mouseX < 500 && mouseY > 150 && mouseY < 220 && tela === "menu") {
    tela = "jogo"
    
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
  
  
  if(tela === "menu") { titulo(); }
  else if(tela === "creditos") { creditos(); }
  else if (tela === "jogo") {
    
  }
 
  
  

}