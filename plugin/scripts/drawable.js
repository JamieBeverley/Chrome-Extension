
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
  this.type = "rect"

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

var ExpandingBox = function (position, size, col, sustain, momentum){
  Drawable.call(this, position, size, col, sustain, momentum)
  this.type = "ExpandingBox"
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
      this.position.x-(this.size.w+age*this.momentum/this.sustain/1000)/2,
      this.position.y-(this.size.h+age*this.momentum/this.sustain/1000)/2,
      this.size.w+age*this.momentum/this.sustain/1000,
      this.size.h+age*this.momentum/this.sustain/1000
    )
  }
}
