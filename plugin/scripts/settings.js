
// document.getElementById("audio-on").addEventListener('change', (event) => {
//
//   chrome.storage.local.get('state', function(result){
//     console.log(result)
//     result.state.audio.on = event.target.checked
//     chrome.storage.local.set({'state':result.state}, (x)=>{console.log('music '+event.target.checked?'on':'off')});;
//   })
// })

chrome.storage.local.get('state',function(result){

  var okay = Spotlight.setterDom(result.state);
  console.log(okay)
  document.getElementById("spotlight").appendChild(okay);


})
