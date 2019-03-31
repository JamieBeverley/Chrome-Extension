
console.log("woot")


var paintingContainer = Util.dom('div', {id:"paintingContainer"})


var windowSizes = {short:20, medium:30, long:50}
var mouse;
var state = {}

var globalColor = {
  r:10,
  g:10,
  b:25,
  primary:{r:100,g:140,b:155},
  secondary:{r:240,g:200,b:255},
  white:{r:255,g:255,b:255}
};

function init(){
  chrome.storage.local.get('state',function(result){
    console.log("start state: ")
    console.log(result.state)
    state = result.state;
    Spotlight.config = state.spotlight;
    Audio.config = state.audio;
    Painting.config = state.painting;

    var spotlightGo = Spotlight.config.on && (Spotlight.config.domains.includes(location.hostname) || Spotlight.config.domains.length==0)
    var audioGo = Audio.config.on && (Audio.config.domains.includes(location.hostname) || Audio.config.domains.length==0)
    var paintingGo = Painting.config.on && (Painting.config.domains.includes(location.hostname) || Painting.config.domains.length==0)
    var timeoutGo = state.timeout.on && (state.timeout.domains.includes(location.hostname) || state.timeout.domains.length==0)

    if (spotlightGo || paintingGo || audioGo || timeoutGo){
      startP5();

      if (audioGo){
        document.addEventListener('visibilitychange',(x)=>{
          if (document.hidden){
            for (let i in Audio.synthsPlaying){
              Audio.synthsPlaying[i].release();
            }
          }
        });
      }

    }
  })
}
init()


function startP5 (){
  var mindfulP5 = new p5 ((p)=>{

    p.setup = function (){
      // p.createCanvas(document.body.clientWidth, document.body.clientHeight);
      p.createCanvas(window.innerWidth, window.innerHeight);
      p.canvas.id = "surfeur-canvas"
      p.canvas.className = "surfeur-canvas"
      p.mouseDown = false;
      p.frame = 0;
      mouse = {
        x:{
          values:Array(windowSizes.long).fill(p.width/2),
          short:p.width/2,
          medium:p.width/2,
          long:p.width/2
        },
        y:{
          values:Array(windowSizes.long).fill(p.height/2),
          short:p.height/2,
          medium:p.height/2,
          long:p.height/2
        }
      }
    }// End Setup



    p.mousePressed = function(){
      if(state.painting.on){
        Painting.mousePressed(p,mouse)
      }
      p.mouseDown = true;
    }

    p.mouseReleased = function(e){
      p.mouseDown = false;
    }

    p.mouseWheel = function (e){
      if(state.painting.on){
        Painting.mouseWheel(p,e.delta)
      }
    }

    p.keyPressed = function (e){

      if(state.painting.on){
        Painting.keyPressed(e)
      }

      if(state.audio.on){
        Audio.keyPressed(e)
      }
    }

    p.keyReleased = function(e){
      if (state.audio.on){
        Audio.keyReleased(e)
      }
    }

    p.draw = function(){
      p.frame = (p.frame+1)%255

      // console.log(state.spotligh)
      if(state.spotlight.on){
        p.clear()
      } else{
        if(state.painting.on && state.painting.clearEveryFrame){
          p.clear()
        }
      }

      mouse.x.values.push(p.mouseX)
      mouse.y.values.push(p.mouseY)
      mouse.x.values = mouse.x.values.slice(-1*windowSizes.long)
      mouse.y.values = mouse.y.values.slice(-1*windowSizes.long)

      if(mouse.x.values.length>=windowSizes.long-1){
        mouse = Util.mouseWindows(mouse, windowSizes)
      }

      var delta = Math.abs(mouse.x.medium-mouse.x.long) + Math.abs(mouse.y.medium-mouse.y.long)

      if(state.spotlight.on){
        Spotlight.draw(p, mouse.x.long, mouse.y.long, state.spotlight.width+delta, state.spotlight.height+delta)
      }

      if(state.painting.on){
        Painting.draw(p,mouse)
      }
    }

    document.lastChild.appendChild(paintingContainer);
    if(state.painting.on || state.audio.on || state.spotlight.on){
      var options = Util.floatingSettingsWidget()
      options.id = "options"
      var container = Util.dom('div',{className:"options-content"})
      if(state.painting.on){
        container.appendChild(Util.dom('div',{innerHTML:"Painting",className:"title"}))
        container.appendChild(Painting.optionsDom())
      }
      if(state.audio.on){
        container.appendChild(Util.dom('div',{innerHTML:"Music",className:"title"}))
        container.appendChild(Audio.optionsDom());
      }
      if(state.spotlight.on){
        container.appendChild(Util.dom('div',{innerHTML:"Spotlight",className:'title'}))
        container.appendChild(Spotlight.optionsDom())
      }
      options.append(container);
      document.lastChild.appendChild(options);
    }

    if (state.timeout.on){

      if(state.timeout.nextTimeout=='inf'){
        console.log('is inf fuck')
        chrome.storage.local.get('state',function(result){
          state = result.state
          state.timeout.nextTimeout = Date.now() + state.timeout.frequency*60*1000
          chrome.storage.local.set({state:state});
          Timeout.check(p)
        })
      } else{
        Timeout.check(p)
      }

    }
  }, paintingContainer);


  // paintingContainer.querySelector('canvas')[0].class = "mindful-browsing-canvas"

}
