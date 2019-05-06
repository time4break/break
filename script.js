init = function(){
  canvas = document.querySelector("#canvas");
  ctx = canvas.getContext("2d");
  canvas.width = canvas.height = Math.min(window.innerWidth,window.innerHeight);
  canvas.style.background = "black";
  gameFile = "./games/"+window.location.hash.substring(1) + ".js";
  styleFile = "./games/"+window.location.hash.substring(1)+".css";
  style = document.createElement("link");
  style.href = styleFile;
  style.rel = "stylesheet";
  document.head.appendChild(style);
  import(gameFile).then((game)=>game.init());
  
  window.addEventListener("deviceorientation",function(e){
    var g = e.gamma * 5; g = Math.floor(g*10)/10;
    var b = e.beta * 5; b = Math.floor(b*10)/10;
    document.body.style.backgroundPositionX = "calc(-50vw + "+e.gamma+"px)";
    document.body.style.backgroundPositionY = "calc(-50vw + "+e.beta+"px)";
  },false);
}
window.onload = init;