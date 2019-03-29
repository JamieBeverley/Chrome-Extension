
var Drawable = function(position, size, col, sustain, momentum){
  this.startTime = new Date();
  this.position = position;
  this.size = size;
  this.col = col;
  this.sustain = sustain;
  this.momentum = momentum

}


Drawable.drawables = []

var Rect = function (position, size, col, sustain, momentum){
  Drawable.call(this, position, size, col, sustain, momentum)
  this.type = "rectangle"

  Drawable.drawables.push(this)
}

Rect.prototype.draw = function(p, t) {
  var age = (t-this.startTime)
  if (age<this.sustain*1000){
    p.noStroke();
    this.col.alpha = 255-(255*age/this.sustain/1000)
    p.fill(this.col.r,this.col.g, this.col.b, this.col.alpha);
    p.rect(this.position.x+age*this.momentum.x/1000,this.position.y+age*this.momentum.y/1000,this.size.w,this.size.h)
    // p.rect(this.position.x,this.position.y,this.size.w,this.size.h)
  }
}


// size: radius
var Circle = function (position,size,col,sustain,momentum){
  Drawable.call(this,position,size,col,sustain,momentum);
  this.type = "circle"
  Drawable.drawables.push(this)
}

Circle.prototype.draw = function(p,t){
  var age = (t-this.startTime)
  if (age<this.sustain*1000){
    p.noStroke();
    this.col.alpha = 255-(255*age/this.sustain/1000)
    p.fill(this.col.r,this.col.g, this.col.b, this.col.alpha);
    p.circle(this.position.x+age*this.momentum.x/1000,this.position.y+age*this.momentum.y/1000,this.size.radius);
  }
}




// size: npoints, radius
var Polygon = function(position,size,col,sustain,momentum){
  Drawable.call(this,position,size,col,sustain,momentum);
  this.type = "polygon"
  Drawable.drawables.push(this)
}

Polygon.prototype.draw = function(p,t){
  var age = (t-this.startTime)
  if (age<this.sustain*1000){
    p.noStroke();
    this.col.alpha = 255-(255*age/this.sustain/1000)
    p.fill(this.col.r,this.col.g, this.col.b, this.col.alpha);
    let angle = Math.PI*2/this.size.points
    p.beginShape();
    for(let a =0; a< Math.PI*2; a+= angle){
      let sx = this.position.x + this.momentum.x*age/1000 + Math.cos(a)*this.size.radius
      let sy = this.position.y + this.momentum.y*age/1000 + Math.sin(a)*this.size.radius
      p.vertex(sx,sy)
    }
    p.endShape(p.CLOSE);
  }
}


var ExpandingBox = function (position, size, col, sustain, momentum){
  Drawable.call(this, position, size, col, sustain, momentum)
  this.type = "expandingbox"
  // console.log("new thing")
  Drawable.drawables.push(this)
}

ExpandingBox.prototype.draw = function(p,t){
  var age = (t-this.startTime)
  if (age<this.sustain*1000){
    // p.noStroke();
    this.col.alpha = 255-(255*age/this.sustain/1000)
    // p.fill(this.col.r,this.col.g, this.col.b, this.col.alpha);
    p.fill(255,255,255,0)
    p.stroke(this.col.r,this.col.g, this.col.b, this.col.alpha);
    p.strokeWeight(5);


    p.rect(
      this.position.x-(this.size.w+age*this.momentum.expandRate/this.sustain/1000)/2 + age*this.momentum.x/1000,
      this.position.y-(this.size.h+age*this.momentum.expandRate/this.sustain/1000)/2 + age*this.momentum.y/1000,
      this.size.w+age*this.momentum.expandRate/this.sustain/1000,
      this.size.h+age*this.momentum.expandRate/this.sustain/1000
    )
  }
}


Drawable.types = ["rectangle","circle","polygon","expandingbox"]
Drawable.constructors = {
  "rectangle":Rect,
  "circle":Circle,
  "polygon":Polygon,
  "expandingbox":ExpandingBox
}
