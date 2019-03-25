var Spotlight = {}


Spotlight.draw  = function (p, x, y, w, h, rgb, boxes, boxWidth){

  if(isNaN(boxes)){
    boxes = 3
  }
  if(isNaN(boxWidth)){
    boxWidth=5
  }
  if(rgb==undefined){
    rgb = {r:255,g:255,b:255}
  }

  p.fill(255,255,255,0)
  p.strokeWeight(boxWidth+1)

  for (var i = 1; i<=boxes; i+=1){
    p.stroke(p.color(rgb.r,rgb.g,rgb.b,(255*i/boxes)))
    p.rect(
      x-w/2-(i*boxWidth)-1,
      y-h/2-i*boxWidth,
      w+2*i*boxWidth,
      h+2*i*boxWidth);
  }

  p.stroke(p.color(rgb.r,rgb.g,rgb.b,255));
  var bigger = 5000; // should probably be the max of p.height or p.width, but safe to assume 5000 pixels is big enough
  p.strokeWeight(bigger);
  p.rect(
    x-w/2-(boxWidth*(boxes+1))-bigger/2+boxWidth/2,
    1+y-h/2-boxWidth*(boxes+1)-bigger/2+boxWidth/2,
    bigger+boxWidth*boxes*2+boxWidth+w-1,
    bigger+boxWidth*boxes*2+boxWidth+h-1)
}
