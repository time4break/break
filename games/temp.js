export function init(){
  import ("../libraries/physics.js").then((module)=>{
    window.p = module;
    main();
  });
}


function main(){
  var anim;
  var boundary = new p.vector(canvas.width,canvas.height);
  var particle = new p.particle();
  particle.l.x = 100;
  particle.l.y = 100;
  particle.r = 10;
  particle.v = new p.vector(0,0);
  
  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";
  function render(){
    
    var dt = Date.now() - t;
    t = Date.now();
    //debugger;
    particle.addForce(new p.vector(0,0.1));
    particle.update(canvas,dt * 60/1000);
    particle.bounceOffEdges(canvas);
   
    
    ctx.beginPath();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.arc(particle.l.x,particle.l.y,particle.r,0,Math.PI*2);
    ctx.fill();
    ctx.moveTo(0,100);
    ctx.lineTo(canvas.width,100);
    ctx.stroke();
    anim = requestAnimationFrame(render);
  }
  var t = Date.now();
  render();
}
