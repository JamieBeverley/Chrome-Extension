console.log('background')




chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  var request = new XMLHttpRequest();
  request.open('GET', 'assets/bubble.mp3',true)
  request.responseType = 'arraybuffer'

  request.onload = function (e){
    console.log('worked? ')
    console.log(e)
  }
  request.send()
})


chrome.runtime.onMessage.addListener(function(message,sender,reply){

})
