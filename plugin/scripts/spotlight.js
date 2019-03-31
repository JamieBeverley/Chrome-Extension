var Spotlight = {}

Spotlight.optionsDom = function(){
  var container = Util.dom('div',{className:'mindful-spotlight-options'});
  console.log(state.spotlight.width)
  var width = Util.dom('input',{type:'range',max:1000,min:10});
  width.value = state.spotlight.width;
  var height = Util.dom('input',{type:'range',max:1000,min:10});
  height.value = state.spotlight.height
  var color = Util.dom('input',{type:"color",value:Util.toHEX(state.spotlight.col),width:100})

  width.addEventListener('change',(x)=>{
    console.log("changed")
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

Spotlight.setterDom = function(){

  var container = Util.dom("div")
  var top = Util.dom('div',{className:"top"},[Util.dom('div',{className:'title',innerHTML:"Spotlight"})])
  var toggle = Util.toggle(state.spotlight.on, (event) => {
    state.spotlight.on = event.target.checked
    chrome.storage.local.set({'state':state}, (x)=>{console.log('spotlight '+event.target.checked?'on':'off')});
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

  var description = Util.dom('div',{className:'description',innerHTML:Spotlight.descriptionText});
  container.appendChild(description)

  function appendConfig(){
    container.appendChild(Spotlight.optionsDom());
    var domains = Util.domainsWidget(state.spotlight.domains,(x)=>{state.spotlight.domains=x;chrome.storage.local.set({"state":state})})
    container.appendChild(Util.labelRow("domains",domains));
  }

  if(state.spotlight.on){
    appendConfig();
  }

  return container;
}

Spotlight.descriptionText = "With spotlight enabled, your webpage will hidden behind an opaque curtain except for a rectangular window (with configurable dimensions) that slowly follows your mouse."

Spotlight.config = {
  w:400,
  h:300,
  col:{r:255,g:255,b:255},
  boxes:4,
  boxWidth:5
}

Spotlight.draw  = function (p, x, y, w, h){
  var boxes = Spotlight.config.boxes;
  var boxWidth = 20;
  var rgb = state.spotlight.col;
  // var h = state.spotlight.height;
  // var w = state.spotlight.width;
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
