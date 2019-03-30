var Timeout = {}

Timeout.optionsDom = function(){
  var container = Util.dom('div',{className:"mindful-timeout-options"})

  var frequency = Util.dom("input",{type:"number",value:state.spotlight.frequency});
  frequency.addEventListener('change',function(e){
    chrome.storage.local.get('state',function(result){
      state = result.state
      state.timeout.frequency = parseFloat(e.target.value);
      chrome.storage.local.set({state:state});
    })
  })

  container.appendChild(Util.labelRow("avg. frequency (in minutes)",frequency));

  return container
}

Timeout.setterDom = function(){
  var container = Util.dom("div")
  var top = Util.dom('div',{className:"top"},[Util.dom('div',{className:'title',innerHTML:"Timeout"})])
  var toggle = Util.toggle(state.timeout.on, (event) => {
    state.timeout.on = event.target.checked
    chrome.storage.local.set({'state':state}, (x)=>{console.log('timeoute'+event.target.checked?'on':'off')});
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
    var options = Timeout.optionsDom()
    var domains = Util.domainsWidget(state.spotlight.domains,(x)=>{state.timeout.domains=x;chrome.storage.local.set({"state":state})})
    container.appendChild(options);
    container.appendChild(Util.labelRow("Domains",domains));
  }

  if(state.timeout.on){
    appendConfig();
  }

  return container;

}
