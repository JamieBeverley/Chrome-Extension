
var Painting = {}

Painting.palettes = [
  [{r:254,g:271,b:161}, {r:255,g:120,b:103}, {r:132,g:210,b:138}],
  [{r:255,g:202,b:15},  {r:253, g:143,b:82}, {r:18, g:99, b:161}],
  [{r:234,g:211,b:162}, {r:224,g:102, b:65}, {r:33,g:42,b:55}]
]

Painting.paletteIndex = Math.floor(Painting.palettes.length*Math.random());
Painting.currentPalette = Painting.palettes[Painting.paletteIndex]
console.log(Painting.currentPalette)
for (let i in Painting.currentPalette){
  console.log(Util.toHEX(Painting.currentPalette[i]))
}


Painting.optionsDom = function (){

  var container = Util.dom('div',{})
  var palettePicker = Painting.palettePickerDom()
  container.appendChild(Util.labelRow("colors", palettePicker))

  var clearToggle = Util.toggle(state.painting.clearEveryFrame,function(x){
    chrome.storage.local.get('state', function(result){
      state = result.state
      state.painting.clearEveryFrame = x.target.checked
      chrome.storage.local.set({'state':state})
    })
    if(x.target.checked){
      for(let i in Drawable.drawables){
        Drawable.drawables[i].sustain += (new Date()-Drawable.drawables[i].startTime)/1000
      }
    }
  })
  container.appendChild(Util.labelRow('clear canvas',clearToggle))

  var brushSettings = Painting.brushSettings();
  container.appendChild(Util.labelRow('brush type',brushSettings))

  return container
}

Painting.brushSettings = function (){
  var container = Util.dom('div', {classname:"brushSettings"})
  var options = []
  for (let i in Drawable.types){
    let t = Drawable.types[i]
    options.push(Util.dom('option',{selected:state.painting.brush==t,value:t, innerHTML:t}))
  }
  var select = Util.dom('select',{},options)
  select.addEventListener('change',function(e){
    chrome.storage.local.get('state',function(result){
      state = result.state
      state.painting.brush = e.target.value
      chrome.storage.local.set({state:state});
    })
  })
  container.appendChild(select)
  return container
}

Painting.palettePickerDom = function(){
  var container = Util.dom('div')
  var col1 = Util.dom('input',{type:"color",value:Util.toHEX(state.painting.currentPalette[0])})
  var col2 = Util.dom('input',{type:"color",value:Util.toHEX(state.painting.currentPalette[1])})
  var col3 = Util.dom('input',{type:"color",value:Util.toHEX(state.painting.currentPalette[2])})
  // TODO ... yuck gross
  function setColor (index){
    return (x)=>{
      chrome.storage.local.get('state', function(result){
        state = result.state
        state.painting.currentPalette[index] = Util.toRGB(x.target.value)
        chrome.storage.local.set({'state':state});
      })
    }
  }

  col1.addEventListener('change',setColor(0))
  col2.addEventListener('change',setColor(1))
  col3.addEventListener('change',setColor(2))

  container.appendChild(col1)
  container.appendChild(col2)
  container.appendChild(col3)
  return container;
}



Painting.setterDom = function (){
  var currentState = state
  var container = Util.dom("div")
  var top = Util.dom('div',{className:"top"},[Util.dom('div',{className:'title',innerHTML:"Painting"})])
  var toggle = Util.toggle(currentState.painting.on, (event) => {
    currentState.painting.on = event.target.checked
    chrome.storage.local.set({'state':currentState}, (x)=>{console.log('painting '+event.target.checked?'on':'off')});
    if(event.target.checked){
      appendConfig();
    } else {
      container.innerHTML = ""
      container.appendChild(top);
      container.appendChild(description)
    }
  });

  top.appendChild(toggle)
  container.appendChild(top);

  var description = Util.dom('div',{className:'description',innerHTML:Painting.descriptionText});
  container.appendChild(description)

  function appendConfig(){
    var options = Painting.optionsDom()
    var domains = Util.domainsWidget(currentState.painting.domains,(x)=>{currentState.painting.domains=x;chrome.storage.local.set({"state":currentState})})
    container.appendChild(options)
    container.appendChild(Util.labelRow("domains",domains));


  }

  if(currentState.painting.on){
    appendConfig();
  }

  return container;
}

Painting.descriptionText = "With painting mode enabled mouse movements, clicks, and scrolling will draw shapes overtop of your webpage. With the 'clear canvas' setting enabled, shapes will fade away after a short amount of time. With 'clear canvas' off, your drawings will persist (and can always be cleared by turning 'clear canvas' on again). Feel free to change up the colors and brush shape!"


Painting.keyPressed = function (e){
  if(e.key=="Shift"){
    // Painting.shiftPalette();
  }
}

Painting.mouseWheel = function(p,delta){
  // console.log(delta)''

  var size = 200
  for (let i =0; i<5; i++){

    new Drawable.constructors[state.painting.brush](
      {x:p.windowWidth*Math.random(),y:delta>0?p.windowHeight:-size/2}, //pos
      {w:Math.random()*size,h:Math.random()*size, radius:Math.random()*0.3*size, points:(Math.random()*5+3)}, // size
      delta>0?state.painting.currentPalette[1]:state.painting.currentPalette[0], // col
      5, //sustain
      {x:(Math.random()-0.5)*2*5,  y:Math.random()*(100)*(delta>0?(-1):1), expandRate: Math.random()*40} // momentum
    )
  }
}

Painting.mousePressed = function(p,mouse){
  var l = mouse.x.values.length-1

  new Drawable.constructors[state.painting.brush](
    {x:mouse.x.values[l], y:mouse.y.values[l]},
    {w:50,h:50,radius:20,points:Math.floor(Math.random()*8+3)},
    state.painting.currentPalette[Math.floor(state.painting.currentPalette.length*Math.random())],
     0.5,
     {x:(Math.random()-0.5)*2*400,y:(Math.random()-0.5)*2*400,expandRate:600}
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

    new Drawable.constructors[state.painting.brush](
      {x:mouse.x.values[l], y:mouse.y.values[l]},
      {w:Math.abs(mouse.x.values[l])>Math.abs(mouse.y.values[l])?20:50,  h:Math.abs(mouse.x.values[l])>Math.abs(mouse.y.values[l])?20:50, points:Math.floor(Math.random()*5+3), radius:(10-Painting.strokeLength+20)/2},
      state.painting.currentPalette[2],
       p.mouseDown?10:2,
       {x:mouse.x.values[l]-mouse.x.values[l-1],y:mouse.y.values[l]-mouse.y.values[l-1],expandRate:100}
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
