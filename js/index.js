window.onload = () => {
    const myObstacles = [];
    const myExtraPoints = [];
    let myWinPoint = 0;
    
    let swSong = new Audio();
    swSong.src = '../songs/28. FrontEnd Credits 01.mp3'

    let swLose = new Audio();
    swLose.src = '../songs/92. Hoth Battles Imperial Lose 01a.mp3'

  // Configuração da Área do Canvas 
    const myGameArea = {
      canvas: document.getElementById('canvas'),
      context: this.canvas.getContext('2d'),
      drawSpace: function () {
        const spaceImg = new Image();
        spaceImg.src = `images/spaceBlack.png`;
        const that = this;
        that.context.drawImage(spaceImg, 0, 0, 500, 700);
      },

      frames: 0,

      start: function () {
        this.interval = requestAnimationFrame(updateGameArea);
      },

      clear: function () {
        this.context.clearRect(0, 0, 500, 700);
      },

      stop: function () {
        cancelAnimationFrame(this.interval);
      },

      score: function () {
        const points = Math.floor(this.frames / 20) + myWinPoint;
        this.context.font = '24px Starjedi';
        this.context.fillStyle = 'yellow';
        this.context.fillText(`Score: ${points}`, 320, 60);
      },
    }   

    // Class Animation que cria um construtor para os movimentos da Millennium Falcon e sua imagem.
    
    class AnimationObjects {
      constructor(width, height, color, x, y, isMillennium = false, isAward = false, isObstacle = false) {
        this.width = width;
        this.height = height;
        this.color = color;
        this.x = x;
        this.y = y;
        this.speedX = 0;
        this.speedY = 0;
        this.isMillennium = isMillennium;
        this.isAward = isAward;
        this.isObstacle = isObstacle;
      }

      // update() - Método para chamar as imagens dos obstaculos e prêmios.
      update() {
        const ctx = myGameArea.context;
        if (this.isMillennium) {
          const millenniumImg = new Image();
          millenniumImg.src = "images/millenniumFalcon7.png";
          ctx.drawImage(millenniumImg, this.x, this.y, 68, 80);
        } else {
          ctx.fillStyle = this.color;
          ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        if (this.isAward){
            const masterYodaImg = new Image();
            masterYodaImg.src = "images/masterYoda.png";
            ctx.drawImage(masterYodaImg, this.x, this.y, 80, 80)
        }
        if (this.isObstacle){
            const tieImg = new Image();
            tieImg.src = "images/tieFighterBlue.png"; 
            ctx.drawImage(tieImg, this.x, this.y, 80, 80)
        }
      }
      // Atualiza a posição da Millennium Falcon
      newPos() {
        this.x += this.speedX;
        this.y += this.speedY;
      }
  
      left() {
        return this.x;
      }
      right() {
        return this.x + this.width;
      }
      top() {
        return this.y;
      }
      bottom() {
        return this.y + this.height;
      }
      // Colisão da millennium Falcon com os obstaculos
      crashWith(obstacle) {
        return !(this.bottom() < obstacle.top() || this.top() > obstacle.bottom() || this.right() < obstacle.left() || this.left() > obstacle.right());
      }
    }
    // Chama a função starGame();
    document.getElementById('start-button').onclick = () => {
      startGame();
    };
  
    const millennium = new AnimationObjects(60, 60,'red', 210, 500, true, false);
    // const masterYoda = new AnimationObjects(30, 30,'blue', 210, 500, false, true);
  
    function startGame() {
      console.log('start yo!');
      myGameArea.start();
      swSong.play();
    }

  
    
  
    // console.log(myGameArea, AnimationObjects);

    //Chamada dos  botões para  controlar a millennium Falcon.
    document.addEventListener('keydown', (e) => {
      switch (e.keyCode) {
        case 38: // up arrow
          millennium.speedY -= 10;
          break;
        case 40: // down arrow
          millennium.speedY += 10;
          break;
        case 37: // left arrow
          millennium.speedX -= 10;
          break;
        case 39: // right arrow
          millennium.speedX += 10;
          break;
      }
    });
  
    document.addEventListener('keyup', (e) => {
      millennium.speedX = 0;
      millennium.speedY = 0;
    });

    //Atualiza os obstaculos + prêmio + suas velocidades.
    function updateObstacles() {
        
        for (let i = 0; i < myObstacles.length; i += 1) {
            myObstacles[i].y += 3.5;
            myObstacles[i].update();
        }

        for (let i = 0; i < myExtraPoints.length; i += 1) {
            myExtraPoints[i].y += 6.5;
            myExtraPoints[i].update();
            }
        
        myGameArea.frames += 1;

        if (myGameArea.frames % 50 === 0) {
            // let x = myGameArea.canvas.width;
        let y = 0;
        let x = Math.floor(Math.random() * 500);
        // AnimationObjects(width, height, color, x, y)
        myObstacles.push(new AnimationObjects(60, 60, 'transparent',(x + 20), y, false, false, true));
      }

      if (myGameArea.frames % 120 === 0) {
        // let x = myGameArea.canvas.width;
        let y = 0;
        let x = Math.floor(Math.random() * 500);
        // AnimationObjects(width, height, color, x, y)
        myExtraPoints.push(new AnimationObjects(50, 50, 'transparent',x, y,false, true, false));
      }
    }

    function extraPoints() {
        const collectAward = myExtraPoints.some( award => millennium.crashWith(award));
        if (collectAward){
            myWinPoint += 50;
            return console.log("Collected!!"), myExtraPoints.pop();
        }
    }


    function checkGameOver() {
      const crashed = myObstacles.some(function (obstacle) {
        return millennium.crashWith(obstacle)
      });
      
      const ctx = myGameArea.context;
      if (crashed) {
         console.log(`Game Over`)
        myGameArea.stop();
        swSong.pause();
        swLose.play(); 
        return function (){
          const gameOverImg = new Image();
          gameOverImg.src = `images/palpatineHappy.png`;
          ctx.drawImage(gameOverImg, this.x, this.y, 200, 200);
      }
      } 
    }

    /* const ctx = myGameArea.context;
        if (this.isMillennium) {
          const millenniumImg = new Image();
          millenniumImg.src = "../images/millenniumFalcon7.png";
          ctx.drawImage(millenniumImg, this.x, this.y, 68, 80); */


    document.getElementById('restart-button').onclick = () => {
        restartGame();
        swLose.pause();
      };
  
      function restartGame(){
        window.location.reload();
        updateGameArea();
      
      }

  // Function para atualizar a área do jogo a cada execução
  function updateGameArea() {
    console.log('loop');
    myGameArea.clear();
    myGameArea.drawSpace();
    millennium.newPos();
    millennium.update();
    updateObstacles();
    extraPoints();
    myGameArea.interval = requestAnimationFrame(updateGameArea);
    checkGameOver();
    myGameArea.score();
  }
  
};  

