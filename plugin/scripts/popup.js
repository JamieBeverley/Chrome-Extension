
document.getElementById('settings').onclick = function(){
  chrome.tabs.create({url:chrome.runtime.getURL('html/settings.html')})
}
