export function init(){
  import ("../libraries/physics.js").then((module)=>{
    window.p = module;
    main();
  });
}


function main(){
  var anim;
  var boundary = new p.vector(canvas.width,canvas.height);
  var particle = new p.particle(new p.vector(100,100),10);
  particle.v = new p.vector(0,1);
  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";
  function render(){
    
    var dt = Date.now() - t;
    t = Date.now();
    //debugger;
    if(particle.l.value[1] + particle.r > canvas.height){
      particle.v = particle.v.scale(-1);
      particle.l = new p.vector(particle.l.value[0],canvas.height-particle.r);
    }
    if(particle.l.value[1] - particle.r < 0){
      particle.v = particle.v.scale(-1);
      particle.l = new p.vector(particle.l.value[0],particle.r);
    }
    particle.update(dt * 60/1000);
    
   
    
    ctx.beginPath();
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.arc(particle.l.value[0],particle.l.value[1],particle.r,0,Math.PI*2);
    ctx.fill();
    ctx.moveTo(0,100);
    ctx.lineTo(canvas.width,100);
    ctx.stroke();
    anim = requestAnimationFrame(render);
  }
  var t = Date.now();
  render();
}
