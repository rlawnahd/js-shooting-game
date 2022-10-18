//캔버스 세팅
let canvas;
let ctx;
canvas = document.createElement("canvas");  
ctx = canvas.getContext("2d");
canvas.width=400;
canvas.height=700;
document.body.appendChild(canvas);

let backgroundImage,spaceshipImage,bulletImage,enemyImage,gameOverImage;
let gameOver=false;
let score = 0;

//우주선 좌표
let spaceshipX = canvas.width/2-32;
let spaceshipY = canvas.height-64;

//총알 좌표
let bulletList = []; // 총알들을 저장하는 배열
function Bullet(){
    this.x=0;
    this.y=0;
    this.init=function(){
        this.x = spaceshipX + 22;
        this.y = spaceshipY - 10;
        this.alive=true // true면 살아있는 총알
        bulletList.push(this);
    };
    this.update = function(){
        this.y -= 7;
    };

    this.checkHit=()=>{
        for(let i=0; i < enemyList.length; i++){
            if(this.y <= enemyList[i].y && this.x >= enemyList[i].x && this.x <= enemyList[i].x +60){
            score++;
            this.alive = false;
            enemyList.splice(i ,1);
            }
        }
    }
}

function genenrateRandomValue(min, max){
    let randomNum = Math.floor(Math.random()*(max-min+1));
    return randomNum;
}
let enemyList=[];
function Enemy(){
    this.x=0;
    this.y=0;
    this.init = function(){
        this.y=0;
        this.x=genenrateRandomValue(0,canvas.width-48);
        enemyList.push(this);
    };
    this.update=()=>{
        this.y += 1;//적군 속도조절
        if(this.y >= canvas.height - 64){
            gameOver = true;
            console.log("gameover");
        }
    }

    //this.y >= canvas.height - 48 ? console.log("gameover") : console.log("gameover2");
   
}

function loadImage(){
    backgroundImage = new Image();
    backgroundImage.src="images/background.gif";

    spaceshipImage = new Image();
    spaceshipImage.src="images/spaceship.png";

    bulletImage = new Image()
    bulletImage.src = "images/bullet.png";

    enemyImage = new Image()
    enemyImage.src = "images/enemy.png";

    gameOverImage = new Image()
    gameOverImage.src = "images/gameover.png";
}

let keysDown = {};
function setupKeyboardListener(){
    document.addEventListener("keydown",function(e){
        keysDown[event.keyCode] = true;
        
    });
    document.addEventListener("keyup",function(e){
        delete keysDown[event.keyCode];
        
        if(event.keyCode == 32){
            createBullet()
        }
    });
}

function createBullet(){
    let b = new Bullet();
    b.init()
    console.log("새로운 총알 리스트",bulletList);
}

function createEnemy(){
    const interval = setInterval(()=> {
        let e = new Enemy();
        e.init();
    },1000);
}

//우주선 이동 
function update(){
    if(39 in keysDown){
        spaceshipX += 5; // 우주선의 속도
    } //오른쪽으로 이동
     else if(37 in keysDown){
        spaceshipX -= 5; //왼쪽으로 이동
    }else if(38 in keysDown){
        spaceshipY -= 5; // 위로 이동
    }else if(40 in keysDown){
        spaceshipY += 5; // 아래로 이동
    }

    //우주선이 경기장 밖으로 못나가게 업데이트
    if(spaceshipX <= 0){
        spaceshipX = 0;
    }
    if(spaceshipX >= canvas.width-64){
        spaceshipX = canvas.width-64;
    }
    if(spaceshipY <= 0){
        spaceshipY = 0;
    }
    if(spaceshipY >= canvas.height-64){
        spaceshipY = canvas.height-64;
    }
    //총알 업데이트 함수 호출
    for(let i = 0; i<bulletList.length; i++){
        if(bulletList[i].alive){
        bulletList[i].update();
        bulletList[i].checkHit();
        };
    }
    for(let i = 0; i<enemyList.length; i++){
        enemyList[i].update()
    }
}


function render(){
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
    ctx.fillText(`Score:${score}`,20 , 20);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    for(let i = 0; i<bulletList.length; i++){
        if(bulletList[i].alive){
        ctx.drawImage(bulletImage,bulletList[i].x, bulletList[i].y);
        }
    }
    //적군 호출
    for(let i = 0; i<enemyList.length; i++){
        ctx.drawImage(enemyImage,enemyList[i].x,enemyList[i].y);
    }
}

function main(){
    if(!gameOver){
        update();
        render();
        requestAnimationFrame(main);
    }else{
        ctx.drawImage(gameOverImage,10,100,390,390);
    }
   
}
loadImage();
setupKeyboardListener();

createEnemy();
main();