
// document.getElementById("audio-on").addEventListener('change', (event) => {
//
//   chrome.storage.local.get('state', function(result){
//     console.log(result)
//     result.state.audio.on = event.target.checked
//     chrome.storage.local.set({'state':result.state}, (x)=>{console.log('music '+event.target.checked?'on':'off')});;
//   })
// })

chrome.storage.local.get('state',function(result){
  document.getElementById("spotlight").appendChild(Spotlight.setterDom(result.state));
  document.getElementById("audio").appendChild(Audio.setterDom(result.state));
  document.getElementById('painting').appendChild(Painting.setterDom(result.state));

})
