export function init(){
  import ("../libraries/physics.js").then((module)=>{
    window.p = module;
    main();
  });
}


function main(){
  var boundary = new p.vector(canvas.width,canvas.height);
  var particle = new p.particle(new p.vector(100,100),10);
  particle.a = new p.vector(0,9.81);
  ctx.fillStyle = "white";
  function render(){
    var anim = requestAnimationFrame(render);
    var dt = Date.now() - t;
    t = Date.now();
    particle.update(dt/1000);
    
    var bound = boundary.sub(particle.l);
    if(bound[1] < particle.r){
      particle.v = particle.v.scale(-1);
    }
    
    ctx.beginPath();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.arc(particle.l.value[0],particle.l.value[1],particle.r,0,Math.PI*2);
    ctx.fill();
  }
  var t = Date.now();
  render();
}
