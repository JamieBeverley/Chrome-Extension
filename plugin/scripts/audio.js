var Audio = {}

var AudioContext = window.AudioContext || window.webkitAudioContext;
//
Audio.ac = new AudioContext();

Audio.fileNames = ["bubbles.mp3", "clay.mp3", "confetti.mp3", "corona.mp3", "dotted-spiral.mp3", "flash-1.mp3", "flash-2.mp3", "flash-3.mp3", "glimmer.mp3", "moon.mp3", "pinwheel.mp3", "piston-1.mp3", "piston-2.mp3", "piston-3.mp3", "prism-1.mp3", "prism-2.mp3", "prism-3.mp3", "splits.mp3", "squiggle.mp3", "strike.mp3", "suspension.mp3", "timer.mp3", "ufo.mp3", "veil.mp3", "wipe.mp3", "zig-zag.mp3"]

Audio.keys = ["q" ,"w" ,"e" ,"r" ,"t" ,"y" ,"u" ,"i" ,"o" ,"p" ,"a" ,"s" ,"d" ,"f" ,"g" ,"h" ,"j" ,"k" ,"l" ,"z" ,"x" ,"c" ,"v" ,"b" ,"n" ,"m"]
Audio.keyMapping = {}

var keysShuffled = Util.shuffle(Audio.keys)
for (let i =0; i<Audio.keys.length; i++){
  Audio.keyMapping[keysShuffled[i]] = Audio.fileNames[i]
}

Audio.buffers = {}
Audio.loaded = false;

Audio.setterDom = function (currentState){
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
    var domains = Util.domainsWidget(currentState.audio.domains,(x)=>{currentState.audio.domains=x;chrome.storage.local.set({"state":currentState})})
    container.appendChild(Util.labelRow("Domains",domains));
  }

  if(currentState.audio.on){
    appendConfig();
  }

  return container;
}///////////////// End Setter Dom


Audio.synthsPlaying = {}

Audio.keyPressed = function(e){
  if(Object.keys(Audio.synthsPlaying).includes(e.key.toLowerCase())){
    Audio.synthsPlaying[e.key.toLowerCase()].release(0.5)
  }
  var note = Audio.midicps(Audio.notes[Math.floor(Audio.notes.length*Math.random())])
  Audio.synthsPlaying[e.key.toLowerCase()] = Audio.synth2(note,0.05)
}

Audio.keyReleased = function (e){
  Audio.synthsPlaying[e.key.toLowerCase()].release(0.5);
  delete Audio.synthsPlaying[e.key.toLowerCase()]
}


var maxDist = window.innerHeight+window.innerWidth;

Audio.mouseSynths = [];

Audio.draw = function (mouse){
  var l = mouse.x.values.length-1
  var dist = Math.abs(mouse.x.values[l]-mouse.x.values[l-1]) + Math.abs(mouse.y.values[l]-mouse.y.values[l-1]);

  if(dist>200){
    var note = Audio.notes[Math.floor(mouse.y.values[l]*(Audio.notes.length)/window.innerHeight)];
    console.log(note)
    var dur = dist*6/maxDist;
    Audio.synth3(Audio.midicps(note),0.1,dur)

  }

}

// WAAPI stuff
Audio.notes= [60,67,72,79,86].reverse()
Audio.notes.random = function(){
  return Audio.notes[Math.floor(Audio.notes.length*Math.random())]
}

Audio.midicps = function(midinote){
  return 440*Math.pow(2,(midinote-69)/12)
}





Audio.synth2 = function(freq, amp){
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

  var env = Audio.adsr(1,0.5,0.5,0.5);
  gain.connect(env);
  env.connect(Audio.ac.destination);
  osc1.start();
  osc2.start();
  osc3.start();
  var synth = {release:env.release,gain: gain}
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

  var env = Audio.asr(0.05,0.5,0.1);
  gain.connect(env);
  env.connect(Audio.ac.destination);
  osc1.start();
  osc2.start();
  osc3.start();
  // return
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
  env.connect(Audio.ac.destination);
  osc1.start();
  osc2.start();
  osc3.start();
  var s = {hpf:hpf}
  return
}

Audio.adsr = function(a,d,s,r){
  var gain = Audio.ac.createGain();
  gain.gain.value = 0;
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

  Audio.loaded = true;
}


Audio.play = function (params){
  if(Audio.loaded){
    var node = Audio.ac.createBufferSource();
    node.buffer = Audio.buffers[params.name]
    node.connect(Audio.ac.destination)
    node.start();
  } else {
    Audio.loadSamples()
  }
}

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
