var defaultState = {
  audio:{
    on:false,
    domains:[],
  },
  painting:{
    on:false,
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
