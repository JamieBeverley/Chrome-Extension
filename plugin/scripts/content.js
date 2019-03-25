
console.log("woot")


var paintingContainer = Util.dom('div', {id:"paintingContainer"})


// var windowSizes = {short:40, medium:80, long:120}   // Used this in making spotlight
var windowSizes = {short:10, medium:20, long:40}
// var windowSizes = {short:1, medium:5, long:10}
var mouse;

var spotlight = false;
var painting = false;
var audio = true;


var globalColor = {
  r:200,
  g:240,
  b:255,
  primary:{r:200,g:240,b:255},
  secondary:{r:240,g:200,b:255}
};

var test = {
  x:{
    values:[1,2,3,4,5,6,7,8,9],
    short:0,
    medium:0,
    long:0
  },
  y:{
    values:[1,2,3,4,5,6,7,8,9],
    short:0,
    medium:0,
    long:0
  }
}

var mindfulP5 = new p5 ((p)=>{


  // p.preload = function(){
  // }

  //Setup
  p.setup = function (){
    p.createCanvas(document.body.clientWidth, document.body.clientHeight);
    p.mouseDown = false;
    // Audio.buffers['bubbles.mp3'].play();
    p.frame = 0;
    mouse = {
      x:{
        values:Array(windowSizes.long).fill(p.mouseX),
        short:p.mouseX,
        medium:p.mouseX,
        long:p.mouseX
      },
      y:{
        values:Array(windowSizes.long).fill(p.mouseY),
        short:p.mouseY,
        medium:p.mouseY,
        long:p.mouseY
      }
    }
  }// End Setup



  p.mousePressed = function(){
    if(painting){
      Painting.mousePressed(p,mouse)
    }
    p.mouseDown = true;
  }

  p.mouseReleased = function(e){
    p.mouseDown = false;
  }

  p.mouseWheel = function (e){
    if(painting){
      Painting.mouseWheel(p,e.delta)
    }
  }

  p.keyPressed = function (e){

    if(audio){
      console.log("okay")
      if(Audio.keys.includes(e.key.toLowerCase())){
        console.log("okay2")

        Audio.play({name:Audio.keyMapping[e.key.toLowerCase()]})

        // Audio.play({name:Object.keys(Audio.buffers)[Math.floor(Math.random()*Object.keys(Audio.buffers).length)]})
      }
    }
  }

  p.draw = function(){
    p.clear()
    p.frame = (p.frame+1)%255
    mouse.x.values.push(p.mouseX)
    mouse.y.values.push(p.mouseY)
    mouse.x.values = mouse.x.values.slice(-1*windowSizes.long)
    mouse.y.values = mouse.y.values.slice(-1*windowSizes.long)

    if(mouse.x.values.length>=windowSizes.long-1){
      mouse = Util.mouseWindows(mouse, windowSizes)
    }

    var delta = Math.abs(mouse.x.medium-mouse.x.long) + Math.abs(mouse.y.medium-mouse.y.long)

    if(spotlight){
      Spotlight.draw(p, mouse.x.long, mouse.y.long, 300+delta, 400+delta,{r:240,g:245,b:255},255,1)
    }

    if(painting){
      Painting.draw(p,mouse)
    }

  }
}, paintingContainer);

// paintingContainer.querySelector('canvas')[0].class = "mindful-browsing-canvas"
document.lastChild.appendChild(paintingContainer)
