var Timeout = {}

Timeout.optionsDom = function(){
  var container = Util.dom('div',{className:"mindful-timeout-options"})

  var frequency = Util.dom("input",{type:"number",value:state.timeout.frequency});
  frequency.addEventListener('change',function(e){
    chrome.storage.local.get('state',function(result){
      state = result.state
      state.timeout.frequency = parseFloat(e.target.value);
      chrome.storage.local.set({state:state});
    })
  })

  container.appendChild(Util.labelRow("avg. frequency (in minutes)",frequency));

  return container
}

Timeout.setterDom = function(){
  var container = Util.dom("div")
  var top = Util.dom('div',{className:"top"},[Util.dom('div',{className:'title',innerHTML:"Timeout"})])
  var toggle = Util.toggle(state.timeout.on, (event) => {
    state.timeout.on = event.target.checked
    chrome.storage.local.set({'state':state}, (x)=>{console.log('timeoute'+event.target.checked?'on':'off')});
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

  var description = Util.dom('div',{className:'description',innerHTML:Timeout.descriptionText});
  container.appendChild(description)

  function appendConfig(){
    var options = Timeout.optionsDom()
    var domains = Util.domainsWidget(state.timeout.domains,(x)=>{state.timeout.domains=x;chrome.storage.local.set({"state":state})})
    container.appendChild(options);
    container.appendChild(Util.labelRow("domains",domains));
  }

  if(state.timeout.on){
    appendConfig();
  }

  return container;

}

Timeout.descriptionText = "After a configurable number of minutes, the next webpage you visit will fade into a blank canvas with 'painting' and 'music' mode enabled for free improvisation."

Timeout.startTimeout = function(p){
  var frame = 0;
  var a = document.getElementById('options')
  if(a){a.remove()}
  var options = Util.floatingSettingsWidget()
  var container = Util.dom('div',{className:"options-content"})
  container.hasFocus = true;
  container.appendChild(Util.dom('div',{innerHTML:"Painting",className:"title"}))
  container.appendChild(Painting.optionsDom())
  container.appendChild(Util.dom('div',{innerHTML:"Music",className:"title"}))
  container.appendChild(Audio.optionsDom());
  options.append(container);
  document.lastChild.appendChild(options);

  p.draw = function(){
    if (frame<255*2){
      frame++;
      p.fill(255,255,255,frame/2);
      p.rect(0,0,p.width,p.height);
      if(frame>=255*2){
        var canvas = document.querySelector('p5Canvs')
        console.log(p.canvas)
        p.canvas.style.background.color = "rgb(255,255,255)";

        p.canvas.className = "timeout"
      }
    } else{

      if(state.painting.clearEveryFrame){
        p.clear()
      }

      mouse.x.values.push(p.mouseX)
      mouse.y.values.push(p.mouseY)
      mouse.x.values = mouse.x.values.slice(-1*windowSizes.long)
      mouse.y.values = mouse.y.values.slice(-1*windowSizes.long)

      if(mouse.x.values.length>=windowSizes.long-1){
        mouse = Util.mouseWindows(mouse, windowSizes)
      }

      var delta = Math.abs(mouse.x.medium-mouse.x.long) + Math.abs(mouse.y.medium-mouse.y.long)
      Painting.draw(p,mouse)
    }
  }

  p.mousePressed = function(){
    Painting.mousePressed(p,mouse)
    p.mouseDown = true;
  }

  p.mouseReleased = function(e){
    p.mouseDown = false;
  }

  p.mouseWheel = function(e){
    console.log('wheel')
    Painting.mouseWheel(p,e.delta);
  }

  p.keyPressed = function(e){
    Audio.keyPressed(e)
  }

  p.keyReleased = function(e){
    Audio.keyReleased(e)
  }


  console.log('TIMEOUT STARTED')
}

Timeout.check = function(p){
  var t = new Date()


  if (state.timeout.nextTimeout>t){
    console.log('timeout is in future')
  } else{
    console.log('timeout is now: ')

    Timeout.startTimeout(p)
    chrome.storage.local.get('state',function(result){
      state = result.state
      state.timeout.nextTimeout = Date.now() + state.timeout.frequency*1000*60
      chrome.storage.local.set({state:state});
    })
  }

}
