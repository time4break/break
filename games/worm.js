export function init(){
  var num_across, cell_width, init_cell, history, food,prev_dir, direction;
  var overlay = document.createElement("div");
  overlay.id = "overlay";
  document.body.appendChild(overlay);
  overlay.innerHTML = "hello world"
  num_across = 10;
  cell_width = canvas.width / num_across;
  init_cell = Math.floor((num_across*num_across)/2) + 1;
  history = [init_cell,init_cell+1];
  food = init_cell + 6;
  prev_dir = "right";
  direction = "right";
function getXY(cell){
    var x =  cell_width * (cell % num_across);
    var y =  cell_width * Math.floor(cell / num_across);
    return [x,y];
  }
  var shrink = cell_width*0.1;
  function draw(cell,col){
    var coords = getXY(cell);
    ctx.beginPath();
    ctx.rect(coords[0] + shrink,coords[1] + shrink,cell_width - shrink,cell_width - shrink);
    //ctx.arc(coords[0]+cell_width/2,coords[1]+cell_width/2,cell_width/2 * 0.98,0,Math.PI*2);
    col = "hsl("+Math.floor(cell*360/(num_across*num_across))+",50%,50%)";
    ctx.fillStyle = col;
    ctx.fill();
  }
  
  var render = function(){
    ctx.beginPath();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    var trueMove = false;
    if(direction == "up" && Math.floor(history[0]/num_across)){
      history.unshift(history[0] - num_across)
      trueMove = true;
    } else if(direction == "down" && Math.floor(history[0]/num_across) < num_across-1){
      history.unshift(history[0] + num_across);
      trueMove = true;
    } else if(direction == "left" && (history[0]%num_across)){
      history.unshift(history[0] - 1);
      trueMove = true;
    } else if(direction == "right" && ((history[0]+1)%num_across)){
      history.unshift(history[0] + 1);
      trueMove = true;
    }
    
    if(history[0] == food){
      var new_food = food;
      while(history.indexOf(new_food) > -1){
        new_food = Math.floor(Math.random()*num_across*num_across);
      }
      food = new_food;
    } else if(trueMove){
      history.pop();
    }
    draw(food,"blue");
    for(var i in history){
      draw(history[i],"white");
    }
    
    var collision = false;
    var checkCol = history.concat([]).sort();
    for(var i=0; i<checkCol.length-1; i++){
      if(checkCol[i] == checkCol[i+1]){
        collision = true;
      }
    }
    if(!collision){
      setTimeout(render,300);
    } else {
      overlay.style.opacity = "0.8";
      overlay.innerHTML = "GAME OVER<br><br>SCORE:"+history.length;
    }
  }
  render();
  var deg = {alpha:null,beta:null,gamma:null};
  window.addEventListener("deviceorientation",function(e){
    deg.alpha = e.alpha; deg.beta = e.beta; deg.gamma = e.gamma;
    var new_dir = direction;
    if(Math.abs(deg.beta) > Math.abs(deg.gamma)){
      if(Math.sign(deg.beta) == -1){
        new_dir = "up";
      } else {
        new_dir = "down";
      }
    } else {
      if(Math.sign(deg.gamma) == -1){
        new_dir = "left";
      } else {
        new_dir = "right";
      }
    }
    if(new_dir != direction){
      prev_dir = direction;
      direction = new_dir;
    }
    
    if((direction == "up" && prev_dir == "down") || (direction == "down" && prev_dir == "up") || (direction == "left" && prev_dir == "right") || (direction == "right" && prev_dir == "left")){
      history.reverse();
    }
  },false);
}