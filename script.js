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
}
window.onload = init;