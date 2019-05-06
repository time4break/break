export function vector(){//takes in either an array or two arguments: x, y; or takes an angle (radians) and returns a normalised vector
  if(Array.isArray(arguments[0])){
    this.value = arguments[0];
  } else if(arguments.length > 1) {
    this.value = [arguments[0],arguments[1]];
  } else {
    this.value = [Math.cos(arguments[0]),Math.sin(arguments[0])];
  }
  return this;
}

vector.prototype.mag = function(){
  return (this.value[0]**2 + this.value[1]**2)**0.5;
}

vector.prototype.angle = function(){
  return Math.atan2(this.value[1],this.value[0]);
}

vector.prototype.sum = function(){
  var v = new vector(this.value);
  for(var i=0; i<arguments.length; i++){
    if(Array.isArray(arguments[i])){//array
      v.value[0] += arguments[i][0];
      v.value[1] += arguments[i][1];
    } else {//vector
      v.value[0] += arguments[i].value[0];
      v.value[1] += arguments[i].value[1];
    }
  }
  return v;
}

vector.prototype.sub = function(){
  var v = new vector(this.value);
  for(var i=0; i<arguments.length; i++){
    if(Array.isArray(arguments[i])){//array
      v.value[0] -= arguments[i][0];
      v.value[1] -= arguments[i][1];
    } else {//vector
      v.value[0] -= arguments[i].value[0];
      v.value[1] -= arguments[i].value[1];
    }
  }
  return v;
}

vector.prototype.scale = function(n){
  return new vector(this.value.map((a)=>{return a*n}));
}

vector.prototype.dot = function(v){
  return new vector(this.value[0]*v.value[0],this.value[1]*v.value[1]);
}


export function particle(l,r){//location {vector}, radius {scalar}
  this.l = l;
  this.r = r;
  this.v = new vector(0,0);
  this.a = new vector(0,0);
}


particle.prototype.update = function(t){//takes in time (in seconds)
  this.v = this.v.sum(this.a.scale(t));
  this.l = this.l.sum(this.v.scale(t));
}