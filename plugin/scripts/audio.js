var Audio = {}

var AudioContext = window.AudioContext || window.webkitAudioContext;
//

Audio.hasInit = false

Audio.init = function(){
  Audio.ac = new AudioContext();
  Audio.masterGain = Audio.ac.createGain();
  Audio.masterGain.gain.value = state.audio.masterGain;


  // TODO ... it hurts
  Audio.masterSampleGain = Audio.ac.createGain();
  Audio.masterSampleGain.gain.value = state.audio.masterGain/2; // quieter and sans reverb
  Audio.masterSampleGain.connect(Audio.ac.destination);

  Audio.masterReverb = Audio.ac.createConvolver()
  Audio.masterGain.connect(Audio.masterReverb)


  var request = new XMLHttpRequest();
  request.open('GET', chrome.runtime.getURL('assets/reverb2.wav'),true)
  request.responseType = 'arraybuffer'

  request.onload = function (e){
    Audio.ac.decodeAudioData(e.target.response, function(buffer){
      Audio.masterReverb.buffer = buffer
      Audio.masterReverb.connect(Audio.ac.destination);
      console.log("reverb loaded")
      Audio.hasInit = true
    })
  }
  request.send()

}

Audio.melody = new Melody(
  // [60,64,65,67,69,72,76,77,79,83,85,86],
  [60,64,65,67,69,72,76,79,86],
  [60,64,67],
  4,
  [0,4,7]
)

Audio.fileNames = ["bubbles.mp3", "clay.mp3", "confetti.mp3", "corona.mp3", "dotted-spiral.mp3", "flash-1.mp3", "flash-2.mp3", "flash-3.mp3", "glimmer.mp3", "moon.mp3", "pinwheel.mp3", "piston-1.mp3", "piston-2.mp3", "piston-3.mp3", "prism-1.mp3", "prism-2.mp3", "prism-3.mp3", "splits.mp3", "squiggle.mp3", "strike.mp3", "suspension.mp3", "timer.mp3", "ufo.mp3", "veil.mp3", "wipe.mp3", "zig-zag.mp3"]

Audio.keys = ["q" ,"w" ,"e" ,"r" ,"t" ,"y" ,"u" ,"i" ,"o" ,"p" ,"a" ,"s" ,"d" ,"f" ,"g" ,"h" ,"j" ,"k" ,"l" ,"z" ,"x" ,"c" ,"v" ,"b" ,"n" ,"m"]
Audio.keyMapping = {}

Audio.keyboardKeymap = {}

Audio.shuffleKeyMapping = function (){
  var keysShuffled = Util.shuffle(Audio.keys)
  for (let i =0; i<Audio.keys.length; i++){
    Audio.keyMapping[keysShuffled[i]] = Audio.fileNames[i]
    Audio.keyboardKeymap[keysShuffled[i]] = Audio.melody.scale[i%Audio.melody.scale.length];
  }
}
Audio.shuffleKeyMapping();

Audio.characters = []

Audio.buffers = {}
Audio.samplesLoaded = false;


Audio.optionsDom = function(){
  var container = Util.dom('div',{className:"mindful-audio-options"})
  var mode = Audio.modeSettings()

  var gain = Util.dom('input', {type:"range",min:0,max:0.9,step:0.05,value:state.audio.masterGain})

  gain.onchange = function(e){
    chrome.storage.local.get('state',function(result){
      state = result.state;
      state.audio.masterGain = e.target.value;
      chrome.storage.local.set({state:state});
      if(state.audio.on && Audio.hasInit){
        Audio.masterGain.gain.value = e.target.value;
        Audio.masterSampleGain.gain.value = e.target.value/2;
      }
    })
  }

  container.appendChild(Util.labelRow('mode',mode))
  container.appendChild(Util.labelRow('volume',gain))

  return container;
}

Audio.modeSettings = function(){
  var container = Util.dom('div', {classname:"audio-mode-settings"})
  var generative = Util.dom('option',{innerHTML:"generative melody",value:"generative",selected:state.audio.mode=="generative"})
  var keyboard = Util.dom('option',{innerHTML:"piano keyboard",value:"keyboard",selected:state.audio.mode=="keyboard"})
  var sample = Util.dom('option',{innerHTML:"samples",value:"sample",selected:state.audio.mode=="sample"})
  var select = Util.dom('select',{},[generative,keyboard,sample])
  select.addEventListener('change',function(e){
    chrome.storage.local.get('state',function(result){
      state = result.state
      state.audio.mode = e.target.value
      chrome.storage.local.set({state:state});
    })
  })
  container.appendChild(select)
  return container
}


Audio.setterDom = function (){
  var currentState = state
  var container = Util.dom("div")
  var top = Util.dom('div',{className:"top"},[Util.dom('div',{className:'title',innerHTML:"Music"})])
  var toggle = Util.toggle(currentState.audio.on, (event) => {
    currentState.audio.on = event.target.checked
    chrome.storage.local.set({'state':currentState}, (x)=>{console.log('audio '+event.target.checked?'on':'off')});
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
    var options = Audio.optionsDom()
    var domains = Util.domainsWidget(currentState.audio.domains,(x)=>{currentState.audio.domains=x;chrome.storage.local.set({"state":currentState})})
    container.appendChild(options);
    container.appendChild(Util.labelRow("Domains",domains));
  }

  if(currentState.audio.on){
    appendConfig();
  }

  return container;
}///////////////// End Setter Dom




Audio.synthsPlaying = {}

Audio.keyPressed = function(e){

  if(["audiovolumeup","audiovolumedown"].includes(e.key.toLowerCase())){
    return
  }

  switch(state.audio.mode){
    case "generative":
      Audio.generativeModeKeyPressed(e);
      break;
    case "sample":
      Audio.samplesModeKeyPressed(e);
      break;
    case "keyboard":
      Audio.keyboardModeKeyPressed(e);
      break;
    default:
      console.log('warning audio mode not recognized: '+state.audio.mode)
  }
}

Audio.keyboardModeKeyPressed = function (e){
  console.log(e)
  if(!Audio.hasInit){
    Audio.init()
  } else {

    if(["shift"].includes(e.key.toLowerCase())){
      return
    }

    if(Object.keys(Audio.synthsPlaying).includes(e.key.toLowerCase())){
      Audio.synthsPlaying[e.key.toLowerCase()].release(0.5)
    }


    var note;
    if (Object.keys(Audio.keyboardKeymap).includes(e.key.toLowerCase())){
      note = Audio.keyboardKeymap[e.key.toLowerCase()]
    } else {
      note = Audio.melody.notes[Math.floor(Audio.melody.notes.length*Math.random())]
    }
    note += e.shiftKey?(Math.random()>0.5?12:7):0

    if(e.key.toLowerCase()=="backspace"){
      note -=12
    }

    console.log(note)
    note = Audio.midicps(note)
    Audio.synthsPlaying[e.key.toLowerCase()] = Audio.synthKeyboard(note,0.0125)

  }
}

Audio.samplesModeKeyPressed = function(e){
  if(!Audio.hasInit){
    Audio.init()
  }

  // Load samples if not loaded, otherwise play sample
  if(!Audio.samplesLoaded){
    Audio.loadSamples()
  } else{
    if(Audio.keys.includes(e.key.toLowerCase())){
      Audio.playSample({name:Audio.keyMapping[e.key.toLowerCase()]})
    }
  }
}

Audio.generativeModeKeyPressed = function(e){
  if(!Audio.hasInit){
    Audio.init()
  }
  Audio.characters.push(e.key);
  Audio.characters = Audio.characters.slice(-10);

  if(Object.keys(Audio.synthsPlaying).includes(e.key.toLowerCase())){
    Audio.synthsPlaying[e.key.toLowerCase()].release(0.5)
  }

  var note = this.melody.getNote().note
  console.log(note)
  note = Audio.midicps(note)
  if (e.key==" "){
    Audio.synthsPlaying[" "] = Audio.synth2(note/4,0.0125)
    Audio.melody.mutate()
  } else{
    if(e.key.toUpperCase() == e.key){
      Audio.synth1stut(note,0.015,Math.random()*0.3+0.1)
    } else {
       Audio.synth1(note,0.005)
     }
  }
}

Audio.stut = function(input, times, vol, time){
  var masterGain = Audio.ac.createGain();
  var gainAmt = 1;
  input.connect(masterGain);
  for(let i =1; i<times; i++){
    var d = Audio.ac.createDelay(time*times+1)
    d.delayTime.value = time*i
    var g = Audio.ac.createGain()
    gainAmt = gainAmt*vol;
    console.log(gainAmt)
    console.log("t: "+time*i)
    g.gain.value = gainAmt;
    input.connect(d)
    d.connect(g)
    g.connect(masterGain)
  }
  return masterGain
}

Audio.keyReleased = function (e){
  switch (state.audio.mode){
    case "keyboard":
      console.log(Audio.synthsPlaying)
      if(Audio.synthsPlaying[e.key.toLowerCase()]){
        Audio.synthsPlaying[e.key.toLowerCase()].release();
        delete Audio.synthsPlaying[e.key.toLowerCase()]
      }
      break;
  }
  // if (e.key != " "){
  //   // Audio.synthsPlaying[e.key.toLowerCase()].release(2);
  //   delete Audio.synthsPlaying[e.key.toLowerCase()]
  // }
}


var maxDist = window.innerHeight+window.innerWidth;

Audio.mouseSynths = [];

Audio.draw = function (mouse){
  var l = mouse.x.values.length-1
  var dist = Math.abs(mouse.x.values[l]-mouse.x.values[l-1]) + Math.abs(mouse.y.values[l]-mouse.y.values[l-1]);

}

// WAAPI stuff
Audio.notes= [60,67,72,79,86].reverse()
Audio.notes.random = function(){
  return Audio.notes[Math.floor(Audio.notes.length*Math.random())]
}

Audio.midicps = function(midinote){
  return 440*Math.pow(2,(midinote-69)/12)
}


Audio.playSample = function (params){
  if(Audio.samplesLoaded){
    var node = Audio.ac.createBufferSource();
    node.buffer = Audio.buffers[params.name]
    var gain = Audio.ac.createGain()
    gain.gain.value = 0.05125
    node.connect(gain)
    gain.connect(Audio.masterSampleGain)
    node.start();
    setTimeout(x=>{node.disconnect();gain.disconnect()},node.buffer.duration*1000+1000);
  } else {
    Audio.loadSamples()
  }
}


Audio.synthKeyboard = function(freq,amp){
  var osc1 = Audio.ac.createOscillator();
  var type = "triangle"
  osc1.type = type
  osc1.frequency = freq;

  var osc2 = Audio.ac.createOscillator();
  osc2.type = type
  osc2.frequency.value = freq*1.001;

  var osc3 = Audio.ac.createOscillator();
  osc3.type = type
  osc3.frequency.value = freq*1.002;

  var osc4 = Audio.ac.createOscillator();
  osc4.type = type
  osc4.frequency.value = freq*1.003;

  var gain = Audio.ac.createGain();
  gain.gain.value = amp

  console.log("okay..")
  osc1.connect(gain)
  osc2.connect(gain);
  osc3.connect(gain);

  var filter = Audio.ac.createBiquadFilter();
  filter.type = "bandpass"
  filter.q = 2;
  filter.frequency.value = 400

  gain.connect(filter)

  var env = Audio.adsr(0.01,0.3,0.2,0.25);
  filter.connect(env);
  env.connect(Audio.masterGain);
  osc1.start();
  osc2.start();
  osc3.start();

  var release = function(){
    env.release();
    setTimeout(y=>{osc1.disconnect();osc2.disconnect();osc3.disconnect();gain.disconnect();env.disconnect();filter.disconnect()},5000)
  }

  var synth = {release:release,gain: gain}

  return synth
}


Audio.synth2 = function(freq, amp){
  var osc1 = Audio.ac.createOscillator();
  var type = "sawtooth"
  osc1.type = type
  osc1.frequency = freq;

  var osc2 = Audio.ac.createOscillator();
  osc2.type = type
  osc2.frequency.value = freq*1.001;

  var osc3 = Audio.ac.createOscillator();
  osc3.type = type
  osc3.frequency.value = freq*1.002;

  var osc4 = Audio.ac.createOscillator();
  osc4.type = type
  osc4.frequency.value = freq*1.003;

  var gain = Audio.ac.createGain();
  gain.gain.value = amp

  console.log("okay..")
  osc1.connect(gain)
  osc2.connect(gain);
  osc3.connect(gain);

  var filter = Audio.ac.createBiquadFilter();
  filter.type = "lowpass"
  filter.frequency.value = 400

  gain.connect(filter)

  var env = Audio.adsr(2,2,1,4);
  filter.connect(env);
  env.connect(Audio.masterGain);
  osc1.start();
  osc2.start();
  osc3.start();
  var synth = {release:env.release,gain: gain}

  setTimeout(x=>{
    env.release();
    setTimeout(y=>{osc1.disconnect();osc2.disconnect();osc3.disconnect();gain.disconnect();env.disconnect();filter.disconnect()},5000)
  },15000)
  return synth
}


Audio.synth1 = function(freq, amp){
  var osc1 = Audio.ac.createOscillator();
  osc1.type = "sine"
  osc1.frequency = freq;

  var osc2 = Audio.ac.createOscillator();
  osc2.type = "sine"
  osc2.frequency.value = freq*1.01;

  var osc3 = Audio.ac.createOscillator();
  osc3.type = "sine"
  osc3.frequency.value = freq*1.02;


  var gain = Audio.ac.createGain();
  gain.gain.value = amp

  console.log("okay..")
  osc1.connect(gain)
  osc2.connect(gain);
  osc3.connect(gain);

  var env = Audio.asr(0.01,0.03,1);
  gain.connect(env);
  env.connect(Audio.masterGain);
  osc1.start();
  osc2.start();
  osc3.start();
  setTimeout(x=>{osc1.disconnect();osc2.disconnect();osc3.disconnect();gain.disconnect();env.disconnect()},2000)
  return
}

Audio.synth1stut = function(freq, amp, t){
  var osc1 = Audio.ac.createOscillator();
  osc1.type = "sine"
  osc1.frequency = freq;

  var osc2 = Audio.ac.createOscillator();
  osc2.type = "sine"
  osc2.frequency.value = freq*1.01;

  var osc3 = Audio.ac.createOscillator();
  osc3.type = "sine"
  osc3.frequency.value = freq*1.02;


  var gain = Audio.ac.createGain();
  gain.gain.value = amp

  console.log("okay..")
  osc1.connect(gain)
  osc2.connect(gain);
  osc3.connect(gain);

  var env = Audio.asr(0.01,0.05,0.1);
  gain.connect(env);

  Audio.stut(env,5,0.8,t).connect(Audio.masterGain)
  osc1.start();
  osc2.start();
  osc3.start();
  setTimeout(x=>{osc1.disconnect();osc2.disconnect();osc3.disconnect();gain.disconnect();env.disconnect()},1000+5000*t)
  return
}


Audio.synth3 = function(freq, amp, dur){
  var osc1 = Audio.ac.createOscillator();
  osc1.type = "sine"
  osc1.frequency = freq;

  var osc2 = Audio.ac.createOscillator();
  osc2.type = "sine"
  osc2.frequency.value = freq*1.01;

  var osc3 = Audio.ac.createOscillator();
  osc3.type = "sine"
  osc3.frequency.value = freq*1.02;


  var gain = Audio.ac.createGain();
  gain.gain.value = amp

  console.log("okay..")
  osc1.connect(gain)
  osc2.connect(gain);
  osc3.connect(gain);

  var hpf = Audio.ac.createBiquadFilter();
  hpf.type = "highpass"
  hpf.frequency.value = freq/2;

  gain.connect(hpf);

  var env = Audio.asr(1,dur,1);
  hpf.connect(env);
  env.connect(Audio.masterGain);
  osc1.start();
  osc2.start();
  osc3.start();
  var s = {hpf:hpf}
  return
}

Audio.adsr = function(a,d,s,r){
  var gain = Audio.ac.createGain();
  gain.gain.value = 0;
  // gain.gain.linearRampToValueAtTime(0.125,Audio.ac.currentTime)
  // gain.gain.linearRampToValueAtTime(0.25,Audio.ac.currentTime+a*3/4)
  gain.gain.linearRampToValueAtTime(1,Audio.ac.currentTime+a)
  gain.gain.linearRampToValueAtTime(s,Audio.ac.currentTime+a+d)
  gain.release = function(){
    gain.gain.cancelAndHoldAtTime(Audio.ac.currentTime);
    gain.gain.linearRampToValueAtTime(0,Audio.ac.currentTime+r)
  }
  return gain;
}

Audio.asr = function(a,s,r){
  var gain = Audio.ac.createGain();
  gain.gain.linearRampToValueAtTime(1,Audio.ac.currentTime+a)
  gain.gain.linearRampToValueAtTime(1,Audio.ac.currentTime+a+s)
  gain.gain.linearRampToValueAtTime(0,Audio.ac.currentTime+a+s+r)
  return gain;
}


Audio.loadSamples = function() {

  for (let i in Audio.fileNames){
    Audio.loadSample(Audio.fileNames[i])
  }

  Audio.samplesLoaded = true;
}


Audio.masterGain;
Audio.loadSample = function (name){
  if(Audio.ac == undefined){
    Audio.ac = new AudioContext();
  }
  var request = new XMLHttpRequest();
  request.open('GET', chrome.runtime.getURL('assets/'+name),true)
  request.responseType = 'arraybuffer'

  request.onload = function (e){
    Audio.ac.decodeAudioData(e.target.response, function(buffer){
      Audio.buffers[name] = buffer
      console.log(name + " loaded")
    })
  }
  request.send()
}
