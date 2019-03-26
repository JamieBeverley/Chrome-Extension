
var Painting = {}


Painting.mouseWheel = function(p,delta){
  // console.log(delta)''

  var size = 200
  for (let i =0; i<5; i++){
    var r = new Rect(

      {x:p.windowWidth*Math.random(),y:delta>0?p.windowHeight:-size},
      {w:Math.random()*size,h:Math.random()*size},
      delta>0?globalColor.secondary:globalColor.primary,
      5,
      // {x:(Math.random()-0.5)*2*5,y:Math.random()*-300(delta>0?(-1):1)})
      {x:(Math.random()-0.5)*2*5,y:Math.random()*delta*10*-1})
    // console.log(r)
  }
}

Painting.mousePressed = function(p,mouse){
  var l = mouse.x.values.length-1

  new ExpandingBox(
    {x:mouse.x.values[l], y:mouse.y.values[l]},
    {w:1,h:1},
    {r:150*Math.random(),g:240,b:350*Math.random()},
     0.5,
     600
  )
}

Painting.strokeLength = 0

Painting.draw = function (p, mouse){
  var t = new Date ();
  var l = mouse.x.values.length-1

  if (Math.abs(mouse.x.values[l]-mouse.x.values[l-1])>20|| Math.abs(mouse.y.values[l]-mouse.y.values[l-1])>20){
    Painting.strokeLength = 10;
  } else {
    Painting.strokeLength = Math.max(Painting.strokeLength-1, 0)
  }

  if (Painting.strokeLength > 0 || p.mouseDown){
  // if(Math.abs(mouse.x.values[l]-mouse.x.values[l-1])>20|| Math.abs(mouse.y.values[l]-mouse.y.values[l-1])>20 ){
      new Rect(
        {x:mouse.x.values[l],y:mouse.y.values[l]},
        {w:Math.abs(mouse.x.values[l])>Math.abs(mouse.y.values[l])?20:50,h:Math.abs(mouse.x.values[l])>Math.abs(mouse.y.values[l])?20:50},
        globalColor.primary,
        p.mouseDown?Infinity:2,
        {x:mouse.x.values[l]-mouse.x.values[l-1],y:mouse.y.values[l]-mouse.y.values[l-1]}
      )
    }

  // Draw the drawables
  var removeList = []
  for (let i in Drawable.drawables){
    var drawable = Drawable.drawables[i];
    if (t - drawable.startTime < drawable.sustain*1000){
      Drawable.drawables[i].draw(p, new Date());
    } else {
      removeList.push(i)
    }
  }
  // Remove dead/expired ones
  for (let i in removeList){
    Drawable.drawables.splice(removeList[i],1)
  }
}
