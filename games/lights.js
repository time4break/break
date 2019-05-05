export function init(){
  var round, cell_width,grid, moves, dgrid;
  var deg = 0;
  var resetRound = document.createElement("button"); resetRound.innerHTML = "clear round";
  var resetGame = document.createElement("button"); resetGame.innerHTML = "reset game";
  document.body.appendChild(resetRound);
  document.body.appendChild(resetGame);
  dgrid = [];//for animations
  round = 1;
  
  function setRound(){
    cell_width = canvas.width/round;
    grid = [];
    for(var i=0; i<round*round; i++){
      grid.push(0);
      dgrid.push(0);
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
    var i=dgrid.length;
    while(i--){
      var o = dgrid[i];
      var w = cell_width*o;
      var of = cell_width - w;
      var x = i%round * cell_width + of/2;
      var y = Math.floor(i/round) * cell_width + of/2;
      ctx.beginPath();
      ctx.moveTo(x,y);
      ctx.rect(x,y,w,w);
      var hue = (Math.floor(i*360/(round*round)) + deg)%360;
      ctx.fillStyle = "hsl("+hue+",50%,50%)";
      ctx.fill();
      
      if(Math.abs(grid[i]-dgrid[i]) >= 0.01){
        //dgrid.splice(c,1);
        dgrid[i]+=0.03*Math.sign(grid[i]-dgrid[i]);
      }
    }
  }
  
  canvas.addEventListener("touchend",function(e){
    var x = e.changedTouches[0].clientX - canvas.offsetLeft;
    var y = e.changedTouches[0].clientY - canvas.offsetTop;
    var c = Math.floor(x/cell_width) + Math.floor(y/cell_width)*round;
    grid[c] = 1 - grid[c];
    if(c%round != 0){
      grid[c-1] = 1 - grid[c-1];
      //dgrid.push([c-1,1 - grid[c-1]]);
    }
    if((c+1)%round != 0){
      grid[c+1] = 1 - grid[c+1];
      //dgrid.push([c+1,1 - grid[c+1]]);
    }
    if((c-round) >= 0){
      grid[c-round] = 1 - grid[c-round];
     // dgrid.push([c-round,1 - grid[c-round]]);
    }
    if((c + round) < round*round){
      grid[c+round] = 1 - grid[c+round];
     // dgrid.push([c+round,1 - grid[c+round]]);
    }
    if(grid.reduce((a,b)=>{return a+b}) == grid.length){
      setTimeout(function(){
        round++; setRound();
      },500);
    }
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
  
  resetRound.addEventListener("click",setRound,false);
  resetGame.addEventListener("click",function(){
    round = 1;
    setRound();
  },false);
}