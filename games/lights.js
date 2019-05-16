export function init(){
 var round, cell_width,grid, dgrid, maxRound, moves, minMoves;
  var deg = 0;
  
  /* Put Elements */
  var header = document.createElement("div"); header.id="header";
  var roundCounter = document.createElement("div"); roundCounter.innerHTML="0"; roundCounter.id="roundCounter";
  var moveCounter = document.createElement("div"); moveCounter.innerHTML = "0"; moveCounter.id= "moveCounter";
  var currMoveCounter = document.createElement("div"); currMoveCounter.innerHTML = "0"; currMoveCounter.id= "currMoveCounter";
  var helpIcon = document.createElement("div"); helpIcon.innerHTML="?"; helpIcon.id="helpIcon";helpIcon.innerHTML="?";
  
  var resetRound = document.createElement("button"); resetRound.innerHTML = "clear round";
  var resetGame = document.createElement("button"); resetGame.innerHTML = "reset game";resetGame.id="resetGame";
  var buttonWrap = document.createElement("div"); buttonWrap.innerHTML = "<div>&lt;</div><div>&gt;</div>"; buttonWrap.id="buttonWrap";
  
  var instructions = document.createElement("div"); instructions.id="instructions"; instructions.classList.add("disabled");
  
  
  document.body.insertBefore(header,canvas);
  header.appendChild(roundCounter);
  header.appendChild(moveCounter);header.appendChild(helpIcon);
   document.body.appendChild(currMoveCounter);
  document.body.appendChild(resetRound);
  document.body.appendChild(resetGame);
  document.body.appendChild(buttonWrap);
  document.body.appendChild(instructions);
  
  instructions.innerHTML="<h1>lights💡</h1><ol><li>every square is a light💡</li><li>Dark squares are switched <b>off</b>.<br>Tap a light to turn it <b>on</b></li><li>when you tap a light, the lights above, below, left and right of it are <b>toggled</b>.<li>light up all the lights!</li><li>BONUS: go back and try light up the screen in the lowest number of moves (min-moves)</li></ol><i>tap to close this dialogue</i>";
    if(window.localStorage.getItem("lights_initInstructions") == null){
    instructions.classList.remove("disabled");
      localStorage.setItem("lights_initInstructions",true);
  }
  
  /* ----------- */
  
  canvas.style.background = "hsla(0,0%,0%,0)";
  dgrid = [];//for animations
  round = 1;
  var offset =2;
  function setRound(){
    localStorage.setItem("lights_round",round);
    localStorage.setItem("lights_minMoves",JSON.stringify(minMoves));
    localStorage.setItem("lights_maxRound",maxRound);
    cell_width = (canvas.width/round);
    grid = [];
    moves = 0;
    currMoveCounter.innerHTML = moves;
    moveCounter.innerHTML = minMoves[round-1];
    roundCounter.innerHTML = round;
    for(var i=0; i<round*round; i++){
      grid.push(0);
      dgrid.push(1);
    }
    
    if(round == 1){
      buttonWrap.children[0].className = "disabled";
    } else {
      buttonWrap.children[0].className = "";
    }
    if(round == maxRound){
      buttonWrap.children[1].className = "disabled";
    } else {
      buttonWrap.children[1].className = "";
    }
  }
  
  function draw(t){
    ctx.beginPath();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    var i=grid.length;
    ctx.fillStyle = "hsla(0,0%,0%,0.5)";
    while(i--){
      var x = i%round * cell_width + offset/2;
      var y = Math.floor(i/round) * cell_width + offset/2;
      ctx.moveTo(x,y);
      ctx.rect(x,y,cell_width-offset,cell_width-offset);
    }
     ctx.fill();
    i=dgrid.length;
    while(i--){
      var o = dgrid[i];
      var w = Math.max(cell_width*o - offset,0);
      var of = cell_width * (1-o);
      var x = (i%round * cell_width) + of/2 + offset/2;
      var y = Math.floor(i/round) * (cell_width) + of/2 + offset/2;
      ctx.beginPath();
      ctx.moveTo(x,y);
      ctx.rect(x,y,w,w);
      var hue = (Math.floor(i*360/(round*round)) + deg)%360;
      ctx.fillStyle = "hsl("+hue+",50%,50%)";
      ctx.fill();
      
      if(Math.abs(grid[i]-dgrid[i]) >= 0.01){
        dgrid[i]+=(t*(60/1000)*0.1*Math.sign(grid[i]-dgrid[i]));
        dgrid[i] = Math.ceil(dgrid[i]*1000)/1000;
        if(dgrid[i] > 1){
          dgrid[i] = 1;
        }
        if(dgrid[i] < 0){
          dgrid[i] = 0;
        }
      }
    }
    
  }
  
  canvas.addEventListener("touchend",function(e){
    var x = e.changedTouches[0].clientX - canvas.offsetLeft;
    var y = e.changedTouches[0].clientY - canvas.offsetTop;
    var c = Math.floor(x/cell_width) + Math.floor(y/cell_width)*round;
    moves++;
    currMoveCounter.innerHTML = moves;
    grid[c] = 1 - grid[c];
    if(c%round != 0){
      grid[c-1] = 1 - grid[c-1];
    }
    if((c+1)%round != 0){
      grid[c+1] = 1 - grid[c+1];
    }
    if((c-round) >= 0){
      grid[c-round] = 1 - grid[c-round];
    }
    if((c + round) < round*round){
      grid[c+round] = 1 - grid[c+round];
    }
    if(grid.reduce((a,b)=>{return a+b}) == grid.length){
      if(moves < minMoves[round-1]){minMoves[round-1] = moves};
      if(round == maxRound){
        maxRound++; minMoves.push(Infinity);
      }
      setTimeout(function(){
        round++; setRound();
      },500);
    }
  },false);
  
  if(localStorage.getItem("lights_round") != null){
    round = Number(localStorage.getItem("lights_round"));
    cell_width = canvas.width/round;
  }
  
  
  if(window.localStorage.getItem("lights_maxRound") != null){
    maxRound = Number(localStorage.getItem("lights_maxRound"));
  } else {
    maxRound = round;
  }
  
  if(localStorage.getItem("lights_minMoves") != null){
    minMoves = JSON.parse(localStorage.getItem("lights_minMoves"));
    for(var i in minMoves){
      if(minMoves[i] == null){
        minMoves[i] = Infinity;
      }
    }
  } else {
    minMoves = [];
    for(var i=0; i<maxRound; i++){
      minMoves.push(Infinity);
    }
  }
  setRound();
  
window.addEventListener("deviceorientation",function(e){
  deg = e.gamma * 2;
  deg = Math.floor(deg*10)/10;
},false);
  var anim;
  var render = function(){
    anim = requestAnimationFrame(render);
    var dt = Date.now() - t;
    t = Date.now();
    draw(dt);
  }
  var t = Date.now();
  render();
  
  resetRound.addEventListener("click",setRound,false);
  resetGame.addEventListener("click",function(){
    round = 1;
    setRound();
  },false);
  
  helpIcon.onclick=()=>{instructions.classList.remove("disabled")};
  instructions.onclick=()=>{instructions.classList.add("disabled")};
  buttonWrap.children[0].onclick=(e)=>{
    if(e.target.className != "disabled"){
      round--;
      setRound();
    }
  }
  buttonWrap.children[1].onclick=(e)=>{
    if(e.target.className != "disabled"){
      round++;
      setRound();
    }
  }
}