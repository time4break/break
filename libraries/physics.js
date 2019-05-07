export Math.constrain = function(n,a,b){
  if(n < a){
    n = a;
  } else if(n > b){
    n = b;
  }
  return n;
}

Vector = function(x,y){
	if(typeof x != "object"){
		this.x = (typeof x !== "undefined")? x : 0;
		this.y = (typeof y !== "undefined")? y : 0;
	} else {
		this.x = x.x;
		this.y = x.y;
	}
	
	if(isNaN(this.x)){
		this.x = 0;
	}
	if(isNaN(this.y)){
		this.y = 0;
	}
}
Vector.sub = function(p,q){
	return new Vector(q.x - p.x,q.y - p.y)
}
Vector.add = function(p,q){
	return new Vector(q.x + p.x,q.y + p.y)
}
Vector.dot = function(a,b){
  return a.x*b.x + a.y*b.y;
}
Vector.mult = function(v,n){
	return new Vector(v.x * n, v.y * n);
}
Vector.fromAngle = function(ang){
	return new Vector(Math.cos(ang),Math.sin(ang));
}
Vector.prototype.add = function(v){
	this.x += v.x;
	this.y += v.y;
}
Vector.prototype.sub = function(v){
	this.x -= v.x;
	this.y -= v.y;
}
Vector.prototype.floor = function(){
	this.x = Math.floor(this.x);
	this.y = Math.floor(this.y);
}
Vector.prototype.mult = function(n){
	this.x = this.x * n;
	this.y = this.y * n;
}
Vector.prototype.fix = function(n){
	this.x = Number(this.x.toFixed(n));
	this.y = Number(this.y.toFixed(n));
}
Vector.prototype.mag = function(){
	return Math.sqrt(this.x*this.x + this.y*this.y)
}
Vector.prototype.normalize = function(){
	if(this.mag() != 0){
		this.mult(1/this.mag());
	}
}
Vector.prototype.angle = function(){
	return Math.atan2(this.y,this.x);
}
Vector.prototype.copy = function(){
	return new Vector(this.x,this.y);
}
Vector.prototype.fromAngle = function(ang){
	var mag = this.mag();
	this.x = Math.cos(ang);
	this.y = Math.sin(ang);
	this.mult(mag);
}


Particle = function(){
	var self = this;
	self.l = new Vector;
	self.v = new Vector;
	self.a = new Vector;
	self.m = 1;
	self.r = 20;
	self.collideOnEdges = true;
	self.drag_const = 1;
	self.static = false;
}
Particle.prototype.update = function(canvas,t){
	var time = t / 1000;
	var self = this;
	
	var dy = 0;
	var dx = 0;
	var changey = 0;
	var changex = 0;
	
	//self.a.x += dx;
		//self.v.y -= dy/self.a.y;
	//self.l.floor();
	
		var prevSign = Math.sign(self.v.y);
	//self.a.mult(time);
	
		self.v.add(self.a);
		var artificial = false;
	
	if(!artificial){
			
		//	self.v.fix(5);
		self.v.mult(self.drag_const);
		self.l.add(self.v);
	//self.l.fix(5);
		}
		
	self.a = new Vector(0,0);
	if(dy != 0){
		
	}
	var postSign = Math.sign(self.v.y);
	
	
	//self.v.x -= dx; self.v.y -= dy;
}


Particle.prototype.addForce = function(obj){
	this.a.x += obj.x / this.m;
	this.a.y += obj.y / this.m;
}
Particle.prototype.repel = function(p,strength){
	var strength = (typeof strength != "undefined")? strength : 40;
  var f = Vector.sub(this.l,p.l);
  f.mult(1);
  var d = Math.constrain(f.mag(),30,Infinity);
  f.normalize();
  var strength = (strength*this.m*p.m)/(d*d);
  f.mult(strength);
  return f;
}
Particle.prototype.attract = function(p,strength){
	var strength = (typeof strength != "undefined")? strength : 40;
  var f = Vector.sub(this.l,p.l);
  f.mult(-1);
  var d = Math.constrain(f.mag(),30,Infinity);
  f.normalize();
  var strength = (strength*this.m*p.m)/(d*d);
  f.mult(strength);
  return f;
}

Particle.prototype.drag = function(drg){
  var v = this.v.mag();
  var dragMag = v*v*drg;
  var drag = new Vector(this.v)
  drag.mult(-1);
  drag.normalize();
  drag.mult(dragMag);
  this.addForce(drag);
}
Particle.prototype.enterSurface = function(obj,type){
	/* types: 0:solid(bounce) 1:liquid/gaseous */
	var withinX = ((this.l.x + this.r + this.v.x >= obj.start.x) && (this.l.x - this.r + this.v.x <= obj.start.x + obj.size.x));
	var withinY = ((this.l.y + this.r + this.v.y >= obj.start.y) && (this.l.y - this.r + this.v.y <= obj.start.y + obj.size.y));
	if(withinX && withinY){
		if(type == 0){
			//this.l.x -= this.a.x;
			//this.l.y -= this.a.y;
			this.v.x += this.a.x;
			this.v.y += this.a.y;
			var gradient = obj.size.y / obj.size.x;
			var obj_angle = 0;//Math.atan2(obj.size.y,obj.size.x);
			var ang = this.v.angle();
			var fromNinety = Math.PI/2 - ang;
			this.v.fromAngle((ang + fromNinety*2) - Math.PI);
			
		}
	}
}


Particle.prototype.bindTo = function(p,dist,min,max){
	var min = (typeof min != "undefined")? min : 0;
	var max = (typeof max != "undefined")? max : Infinity;
	var d = dist + this.r + p.r;
	var dVec = Vector.sub(this.l,p.l);
	var mag = dVec.mag();
	var between = (mag > min && mag < max);
	if(mag < dist && between){
		this.addForce(p.repel(this));
	} else if (mag > dist && between) {
		this.addForce(p.attract(this));
	}
}

Particle.prototype.deflect = function(p){
	var ret = undefined;
  if(p !== null){
  var d = Vector.sub(this.l,p.l);
  var dm = d.mag();
  var normal = d.copy();
  
  
  if(dm < this.r + p.r){
    d.normalize();
    d.mult(this.r + p.r);
    var oldLocal = this.l.copy();
    this.l = Vector.sub(d,p.l);
    p.l = Vector.add(oldLocal,d);
    this.AP(p);
		ret = [this,p];
  }
  }
	return ret;
}


Particle.prototype.AP = function(p){
  var dv = Vector.sub(p.v,this.v);
  var dx = Vector.sub(p.l,this.l);
  var m22 = p.m * 2;
  var first = m22/(this.m+p.m);
  var second = Vector.dot(dv,dx);
  var third = dx.mag()*dx.mag();
  var fourth = second * (first/third);
  var fifth = Vector.mult(dx,fourth);
  var sixth = Vector.sub(fifth,this.v);
  var thisv = sixth;
  
  var dv = Vector.sub(this.v,p.v);
  var dx = Vector.sub(this.l,p.l);
  var m22 = this.m * 2;
  var first = m22/(this.m+p.m);
  var second = Vector.dot(dv,dx);
  var third = dx.mag()*dx.mag();
  var fourth = second * (first/third);
  var fifth = Vector.mult(dx,fourth);
  var sixth = Vector.sub(fifth,p.v);
  var pv = sixth;
  if(this.static == false){
  this.v = thisv;
  } else {
    this.v = new Vector(0,0);
   //this.l = this.l;
  }
  if(p.static == false){
  p.v = pv;
  } else {
    p.v = new Vector(0,0);
  }
  return [first, second, third, fourth, fifth, sixth];
  
}

Particle.prototype.bounceOffEdges = function(canvas){
var self = this;
var ret = false;
	if((self.l.y - self.r) + self.v.y < 0){
		self.v.y *= -1;
		artificial = true;
		ret = "top";
	} else if((self.l.y + self.r) + self.v.y >= canvas.height) {
		artificial = true;
		self.v.y *= -1;
		ret = "bottom"
	}
	
	if((self.l.x - self.r) + self.v.x < 0){
		self.v.x *= -1;
		artificial = true;
		ret = "left";
	} else if((self.l.x + self.r) + self.v.x > canvas.width) {
		self.v.x *= -1;
		artificial = true;
		ret = "right";
	}
	return ret;
}