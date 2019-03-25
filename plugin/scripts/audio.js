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
