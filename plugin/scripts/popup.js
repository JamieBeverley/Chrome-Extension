
chrome.storage.local.get('state',function(result){

  var spotlight = document.getElementById('spotlight')
  spotlight.checked = result.state.spotlight.on
  spotlight.addEventListener('change',(x)=>{
    result.state.spotlight.on=x.target.checked;chrome.storage.local.set({state:result.state})
    document.getElementById('refresh').style.display = "inline-block"
  });


  var audio = document.getElementById('audio')
  audio.checked = result.state.audio.on
  audio.addEventListener('change',(x)=>{
    result.state.audio.on=x.target.checked;chrome.storage.local.set({state:result.state})
    document.getElementById('refresh').style.display = "inline-block"

  });


  var painting = document.getElementById('painting')
  painting.checked = result.state.painting.on
  painting.addEventListener('change',(x)=>{
    result.state.painting.on=x.target.checked;chrome.storage.local.set({state:result.state})
    document.getElementById('refresh').style.display = "inline-block"
  });


  var timeout = document.getElementById('timeout')
  timeout.checked = result.state.timeout.on
  timeout.addEventListener('change',(x)=>{
    result.state.timeout.on=x.target.checked;
    chrome.storage.local.set({state:result.state})
    document.getElementById('refresh').style.display = "inline-block"
  });


})


document.getElementById('settings').onclick = function(){
  chrome.tabs.create({url:chrome.runtime.getURL('html/settings.html')})
}
