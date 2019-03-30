var palettes = [
  [{r:254,g:271,b:161}, {r:255,g:120,b:103}, {r:132,g:210,b:138}],
  [{r:255,g:202,b:15},  {r:253, g:143,b:82}, {r:18, g:99, b:161}],
  [{r:234,g:211,b:162}, {r:224,g:102, b:65}, {r:33,g:42,b:55}]
]

var paletteIndex = Math.floor(palettes.length*Math.random());
var currentPalette = palettes[paletteIndex]


var defaultState = {
  audio:{
    on:true,
    masterGain:0.2,
    mode:"keyboard",
    domains:[],
  },
  painting:{
    on:true,
    clearEveryFrame:true,
    brush:"rectangle",
    currentPalette:currentPalette,
    domains:[]
  },
  spotlight:{
    on:false,
    width:400,
    height:300,
    col:{r:255,g:255,b:255},
    domains:[]
  },
  timeout:{
    on:false,
    domains:[]
  }
}


chrome.runtime.onInstalled.addListener(function(){
  console.log('installed')
  chrome.storage.local.set({'state':defaultState},function(){console.log('default state set')} )
})



chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  // var request = new XMLHttpRequest();
  // request.open('GET', 'assets/bubble.mp3',true)
  // request.responseType = 'arraybuffer'
  //
  // request.onload = function (e){
  //   console.log('worked? ')
  //   console.log(e)
  // }
  // request.send()
  chrome.browserAction.enable(tabId,(x)=>{console.log('enabled')})
})


chrome.runtime.onMessage.addListener(function(message,sender,reply){

})
