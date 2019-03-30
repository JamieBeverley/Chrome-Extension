var Spotlight = {}

Spotlight.optionsDom = function(){
  var container = Util.dom('div',{className:'mindful-spotlight-options'});

  var width = Util.dom('input',{type:'range',value:state.spotlight.width,max:1000,min:10});
  var height = Util.dom('input',{type:'range',value:state.spotlight.height,max:1000,min:10});
  var color = Util.dom('input',{type:"color",value:Util.toHEX(state.spotlight.col),width:100})

  width.addEventListener('change',(x)=>{
    chrome.storage.local.get('state',function(result){
      state = result.state
      state.spotlight.width = parseInt(x.target.value);
      chrome.storage.local.set({'state':state});
    })
  });

  height.addEventListener('change',(x)=>{
    chrome.storage.local.get('state',function(result){
      state = result.state
      state.spotlight.height = parseInt(x.target.value);
      chrome.storage.local.set({'state':state});
    })
  });

  color.addEventListener('change',(x)=>{
    chrome.storage.local.get('state',function(result){
      state = result.state
      state.spotlight.col = Util.toRGB(x.target.value);
      chrome.storage.local.set({'state':state});
    })
  });
  container.appendChild(Util.labelRow("width",width))
  container.appendChild(Util.labelRow("height",height))
  container.appendChild(Util.labelRow("color",color));

  return container
}

Spotlight.setterDom = function(currentState){

  var container = Util.dom("div")
  var top = Util.dom('div',{className:"top"},[Util.dom('div',{className:'title',innerHTML:"Spotlight"})])
  var toggle = Util.toggle(currentState.spotlight.on, (event) => {
    currentState.spotlight.on = event.target.checked
    chrome.storage.local.set({'state':currentState}, (x)=>{console.log('spotlight '+event.target.checked?'on':'off')});
    if(event.target.checked){
      appendConfig();
    } else {
      container.innerHTML = ""
      container.appendChild(top);
    }
  });

  top.appendChild(toggle)
  container.appendChild(top);

  function appendConfig(){
    var domains = Util.domainsWidget(currentState.spotlight.domains,(x)=>{currentState.spotlight.domains=x;chrome.storage.local.set({"state":currentState})})
    container.appendChild(Spotlight.optionsDom());
    container.appendChild(Util.labelRow("Domains",domains));
  }

  if(currentState.spotlight.on){
    appendConfig();
  }

  return container;
}

Spotlight.config = {
  w:400,
  h:300,
  col:{r:255,g:255,b:255},
  boxes:4,
  boxWidth:5
}

Spotlight.draw  = function (p, x, y){
  var boxes = Spotlight.config.boxes;
  var boxWidth = 20;
  var rgb = state.spotlight.col;
  var w = state.spotlight.width;
  var h = state.spotlight.height;
  if(isNaN(boxes)){
    boxes = 3
  }
  if(isNaN(boxWidth)){
    boxWidth=5
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
