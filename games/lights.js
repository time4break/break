export function init(){
  var round, cell_width,grid, moves;
  var deg = 0;
  var moveElem = document.createElement("div");
  moveElem.id = "moveElem";
  moves = 0;
  document.body.appendChild(moveElem);
  round = 1;
  
  function setRound(){
    cell_width = canvas.width/round;
    grid = [];
    for(var i=0; i<round*round; i++){
      grid.push(0);
    }
    localStorage.setItem("lights_grid",grid.join(""));
  }
  
  function draw(){
    ctx.beginPath();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.beginPath();
    for(var i=0; i<round; i++){
      ctx.strokeStyle = "white";
      ctx.moveTo(i*cell_width,0);
      ctx.lineTo(i*cell_width,canvas.width);
      ctx.moveTo(0,i*cell_width);
      ctx.lineTo(canvas.width,i*cell_width);
    }
    ctx.stroke();
    for(var i=0; i<round*round; i++){
      if(grid[i] == 1){
        var x = i%round * cell_width;
        var y = Math.floor(i/round) * cell_width;
        ctx.beginPath();
        ctx.moveTo(x,y);
        ctx.rect(x,y,cell_width,cell_width);
        var hue = (Math.floor(i*360/(round*round)) + deg)%360;
        ctx.fillStyle = "hsl("+hue+",50%,50%)";
        ctx.fill();
      }
    }
  }
  
  canvas.addEventListener("touchend",function(e){
    moves++;
    var x = e.changedTouches[0].clientX - canvas.offsetLeft;
    var y = e.changedTouches[0].clientY - canvas.offsetTop;
    var c = Math.floor(x/cell_width) + Math.floor(y/cell_width)*round;
    grid[c] = 1 - grid[c];
    if(c%round != 0){
      grid[c-1] = 1 - grid[c-1];
    }
    if((c+1)%round != 0){
      grid[c+1] = 1 - grid[c+1]
    }
    if((c-round) >= 0){
      grid[c-round] = 1 - grid[c-round]
    }
    if((c + round) < round*round){
      grid[c+round] = 1 - grid[c+round];
    }
    if(grid.reduce((a,b)=>{return a+b}) == grid.length){
      setTimeout(function(){
        round++; setRound();
      },500);
    }
    moveElem.innerHTML = "moves: "+moves;
    localStorage.setItem("lights_round",round);
    localStorage.setItem("lights_grid",grid.join(""));
    localStorage.setItem("lights_moves",moves);
  },false);
  setRound();
  if(localStorage.getItem("lights_round") != null){
    round = Number(localStorage.getItem("lights_round"));
    grid = localStorage.getItem("lights_grid").split("").map(Number);
    moves = Number(localStorage.getItem("lights_moves"));
    cell_width = canvas.width/round;
    moveElem.innerHTML = "moves: "+moves;
  }
  
window.addEventListener("deviceorientation",function(e){
  deg = e.gamma * 2;
  deg = Math.floor(deg*10)/10;
},false);
  var anim;
  var render = function(){
    anim = requestAnimationFrame(render);
    draw();
  }
  render();
}