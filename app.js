const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");
const cWidth = c.width;
const cHeight = c.height;
// 可以獲取canvas與相對於視窗的位置
const canvasRect = c.getBoundingClientRect();

// 按F5回到cover
window.addEventListener("keydown", (e) => {
  if (e.key == "F5") {
    e.preventDefault();
    window.location.href = document.getElementById("myCover").href;
  }
  if (e.code == "KeyR" && e.metaKey) {
    e.preventDefault();
    window.location.href = document.getElementById("myCover").href;
  }
});

// 設置球的x,y初始座標和x,y的運行速度
let circleX = 160;
let circleY = 220;
let xSpeed = 20;
let ySpeed = 20;
let radius = 10;

// 設置地板的x,y初始組標與高度
let groundX = 100;
let groundY = 490;
let groundHeight = 10;

// 設置磚頭
let brickWidth = 60;
let brickHeight = 30;
let spacing = 5;
let numRows = 5; // 計算要生成幾列磚塊
let colors = ["#00C897", "#FFE162"]; // 磚塊的顏色列表
// 計算要生成幾行磚塊
let numCols = Math.floor((cWidth - 30 + spacing) / (brickWidth + spacing));
let brickArray = []; // 用來儲存所有磚塊的陣列

// 設置分數
let highestScore;
loadHighestScore();
let count = 0;
// 設置分數
document.getElementById("myScore2").innerHTML = count;
document.getElementById("highestScore2").innerHTML = highestScore;

class Brick {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.width = brickWidth;
    this.height = brickHeight;
    this.color = color;
    this.visible = true;
  }

  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  }

  touchingBall(ballX, ballY) {
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY >= this.y - radius &&
      ballY <= this.y + this.height + radius
    );
  }
}

class Circle {
  constructor(x, y) {
    this.x = circleX;
    this.y = circleY;
    this.radius = radius;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
  }

  // 畫球
  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(circleX, circleY, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#F5F5F5";
    ctx.fill();
  }
  // canvas背景
  background() {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "#181818";
    ctx.fillRect(0, 0, cWidth, cHeight);
    ctx.restore();
  }
}

class Ground {
  constructor(x, y) {
    this.x = groundX;
    this.y = groundY;
    this.height = groundHeight;
  }

  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, 150, this.height, [5, 5, 5, 5]);
    ctx.fillStyle = "#335DD1";
    ctx.fill();
    ctx.restore();
  }
}

let myCircle = new Circle();
let myGround = new Ground();
// 製作多個磚頭
for (let i = 0; i < numRows; i++) {
  for (let j = 0; j < numCols; j++) {
    let x = 35 + (brickWidth + spacing) * j;
    let y = 30 + (brickHeight + spacing) * i;
    let color = colors[(i + j) % colors.length];
    brickArray.push(new Brick(x, y, color));
  }
}

// 讓牆與滑鼠一起動：clientX
c.addEventListener("mousemove", (e) => {
  // 使用 e.clientX 減去 canvas 的左側位移，得到在 canvas 內的正確滑鼠位置
  let tempX = e.clientX - canvasRect.left;
  // 確保地板的右側座標不超出 canvas 的寬度
  myGround.x = Math.min(tempX, cWidth - 150);
});

// 檢查球與磚塊限制，讓球碰磚塊回彈
function brickCheck() {
  brickArray.forEach((brick) => {
    if (brick.visible) {
      const ballLeft = circleX - radius;
      const ballRight = circleX + radius;
      const ballTop = circleY - radius;
      const ballBottom = circleY + radius;

      const brickLeft = brick.x;
      const brickRight = brick.x + brick.width;
      const brickTop = brick.y;
      const brickBottom = brick.y + brick.height;

      if (
        ballRight >= brickLeft &&
        ballLeft <= brickRight &&
        ballBottom >= brickTop &&
        ballTop <= brickBottom
      ) {
        // 如果碰撞，反彈
        if (circleX > brickLeft - radius && circleX < brickRight + radius) {
          ySpeed *= -1;
        } else {
          xSpeed *= -1;
        }
        brick.visible = false; // 磚塊消失
        count++; // 計分
        console.log(count);
        setHighestScore(count);
        document.getElementById("myScore2").innerHTML = count;
        document.getElementById("highestScore2").innerHTML = highestScore;

        if (count == 55) {
          alert("遊戲結束");
          clearInterval(game);
        }
      }
    }
  });
}

// 檢查球與地板的限制，讓球碰地板回彈
function groundCheck() {
  if (
    circleX >= myGround.x - radius &&
    circleX <= myGround.x + 150 + radius &&
    circleY >= myGround.y - groundHeight - radius &&
    circleY <= myGround.y + groundHeight + radius
  ) {
    // 如果Y是正數，-50，如是負數+50，讓回彈更大
    if (ySpeed > 0) {
      circleY -= 50;
    } else {
      circleY += 50;
    }
    ySpeed *= -1;
    // 碰撞後將球移回地板的上方，避免"黏"在地板上
    circleY = Math.min(myGround.y - groundHeight - radius, circleY);
  }
}

// 邊界檢查，球與牆的限制，不讓球離開牆
function boundaryCheck() {
  // 確認右邊牆
  if (circleX >= cWidth - radius * 1.5) {
    xSpeed *= -1;
  }
  // 確認左邊牆
  else if (circleX <= radius * 1.5) {
    xSpeed *= -1;
  }
  // 確認下面牆
  else if (circleY >= cHeight + radius) {
    circleY = 500;
    alert("遊戲結束");
    clearInterval(game);
  }
  // 確認上方牆
  else if (circleY <= radius * 2) {
    ySpeed *= -1;
  }
  // 確保圓球的 x 和 y 座標不超出 canvas 的範圍
  circleX = Math.max(radius, Math.min(circleX, cWidth - radius));
  circleY = Math.max(radius, Math.min(circleY, cHeight - radius));
}

function move() {
  // 磚頭碰球計分，牆消失

  // 磚頭與球的限制，讓球回彈
  brickCheck();
  // 地板與球的限制，讓球回彈
  groundCheck();
  // 牆與球的限制，不讓球離開牆
  boundaryCheck();

  // 更改座標讓球動起來
  circleX += xSpeed;
  circleY += ySpeed;

  // 重置背景
  myCircle.background();

  // 畫磚塊
  brickArray.forEach((brick) => {
    if (brick.visible) {
      brick.draw();
    }
  });

  // 畫球
  myCircle.draw();

  // 畫牆
  myGround.draw();
}

function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setHighestScore(count) {
  if (count > highestScore) {
    localStorage.setItem("highestScore", count);
    highestScore = count;
  }
}

let game = setInterval(move, 100);
