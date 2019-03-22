
console.log("woot")


var paintingContainer = Util.dom('div', {id:"paintingContainer"})

var mouseX = []
var mouseY = []


new p5 ((p)=>{

  var i =0;

  p.setup = function (){
    p.createCanvas(document.body.clientWidth, document.body.clientHeight);
    mouseX = [p.mouseX]
    mouseY = [p.mouseY]
    // p.noStroke();
    // p.blendMode(p.LIGHTEST)
    // p.loadPixels();
    // p.pixels = Array(p.width*p.height*4).fill(0)
  }

  function enclosedBox (x, y, w, h, t, col){
    p.fill(col);
    p.rect(x-w/2-t,y-h/2-t,w+2*t,t)
    p.rect(x-w/2-t,y+h/2,w+2*t,t)
    p.rect(x-w/2-t,y-h/2-1,t,h+2)
    p.rect(x+w/2,y-h/2-1,t,h+2)
  }

  function gradientEllipse(x,y,w,h,rgb, fadeRate){
    if (rgb == undefined){
      rgb = {r:0,g:0,b:0}
    }
    if (fadeRate == undefined){
      fadeRate = 1
    }
    p.fill(255,255,255,0);
    var c = 0;
    while(c<255){
      p.stroke(p.color(0,0,0,c))
      p.ellipse(x,y,w,h)
      // enclosedBox(x,y,w,h,1,p.color(rgb.r,rgb.g,rgb.b,Util.clip((c),0,255)))
      w++;
      h++;
      c+= fadeRate;
    }

  }


  function gradientBox (x,y, w,h, rgb, fadeRate){

    if (rgb == undefined){
      rgb = {r:0,g:0,b:0}
    }
    if (fadeRate == undefined){
      fadeRate = 1
    }
    var c = 0;
    while(c<255){

      enclosedBox(x,y,w,h,1,p.color(rgb.r,rgb.g,rgb.b,Util.clip((c),0,255)))
      w++;
      h++;
      c+= fadeRate;
    }
    enclosedBox(x,y,w,h,Math.max(p.width,p.height),p.color(rgb.r,rgb.g,rgb.b,255))
  }

  function crudeGradientBox(x,y,w,h,rgb, boxes, boxWidth){

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

  p.draw = function(){

    var windowSizes = {short:40, medium:80, long:120}

    mouseX.push(p.mouseX)
    mouseY.push(p.mouseY)
    mouseX = mouseX.splice(-1*windowSizes.long)
    mouseY = mouseY.splice(-1*windowSizes.long)

    var mouse = Util.mouseWindows(mouseX, mouseY, windowSizes)

    var delta = Math.abs(mouse.x.medium-mouse.x.long) + Math.abs(mouse.y.medium-mouse.y.long)
    // var delta = (Math.abs(shortWindowX-meanX) + Math.abs(shortWindowY-meanY))

    // if (mouseX[0]!=mouseX[1] || mouseY[0] != mouseY[1]){
    p.clear()

    var h = 200+delta
    var w = 300+delta

      // var h = 300;
      // var w = 400;
    if(spotlight){
      crudeGradientBox(mouse.x.long, mouse.y.long, w,h,{r:240,g:245,b:255},255,1)
    }

      // crudeGradientBox(Util.mean(mouseX), Util.mean(mouseY), 400,300,{r:235,g:245,b:255},1)
    // }
  }
}, paintingContainer);


document.lastChild.appendChild(paintingContainer)
