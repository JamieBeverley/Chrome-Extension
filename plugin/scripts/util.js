var Util ={};



Util.dom = function(type, properties,children){
  var r = document.createElement(type);
  for (var i in properties){
    r[i] = properties[i]
  }

  for (var i in children){
    r.appendChild(children[i])
  }
  return r
};


Util.arraysEqual = function(a1,a2){
  if (a1.length!= a2.length){
    return false;
  }
  var ar1 = a1.sort()
  var ar2 = a2.sort();
  for(let i = 0; i<ar1.length; i++){
      if(ar1[i]!=ar2[i]){
        return false;
      }
  }
  return true;
}


Util.floatingSettingsWidget = function(){
  var container = Util.dom('div',{className:"mindful-painting-settings"})
  container.style.top = "20px"
  container.style.left = "20px";
  container.ondrag = function(e){
    // e.preventDefault()
    if(e.clientY!=0){
      container.style.top= e.clientY+"px";
      container.style.left = e.clientX+"px";
    }
  }

  var icon = Util.dom('img', {className:"mindful-painting-settings-img","src":chrome.runtime.getURL("/icons/settings.png")})
  icon.onclick = function(){
    console.log('test')
    console.log("mindful-painting-settings")
    if(container.classList.contains("expanded")){
      container.classList.remove("expanded")
    } else {
      container.classList.add("expanded")
    }
  }
  container.appendChild(icon);
  return container
}


Util.closeButton = function(f){
  var container = Util.dom('div',{className:"closeButton",innerHTML:"close"});
  container.addEventListener('click',f)
  return container;
}

Util.domainsWidget = function(ival, onchange){
  var container = Util.dom('div')
  console.log(ival)
  console.log("a")
  var all = Util.dom('option',{innerHTML:"All pages",value:"all",selected:ival.length==0})
  var select = Util.dom('option',{innerHTML:"Select pages",value:"select", selected:ival.length!=0})
  var dd = Util.dom('select');
  dd.appendChild(all);
  dd.appendChild(select);

  container.appendChild(dd);

  function showTextArea (bool){
    if(bool){
      var textArea = Util.dom('textarea',{value:ival.join("\n"),rows:6,cols:30})
      textArea.addEventListener('input',(x)=>{onchange(x.target.value.split("\n"))});
      // textArea.onchange = (x)=>{console.log(onchange);console.log('kk...');onchange(x.target.value.split("\n"))};
      // textArea.addEventListener('change',(x)=>{console.log(onchange);console.log('kk...');onchange(x.target.value.split("\n"))});
      container.appendChild(Util.dom('div',{},[textArea]));
    } else{
      container.innerHTML = ""
      container.appendChild(dd);
    }
  }

  dd.addEventListener('change',function(e){
    if(e.target.value == "all"){
      showTextArea(false)
      onchange([])
    } else{
      showTextArea(true)
    }

  })

  showTextArea(ival.length!=0);

  return container;
}



Util.toRGB = function(hex){
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {r: parseInt(result[1], 16),g: parseInt(result[2], 16),b: parseInt(result[3], 16)} : null;
}



Util.toHEX = function(rgb){

    function componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }
    return "#" + componentToHex(rgb.r) + componentToHex(rgb.g) + componentToHex(rgb.b);
}

Util.dumpState = function(){
  chrome.storage.local.get("state",function(result){console.log(result.state)})
}

Util.toggle = function(isOn, onChange){

  var on = Util.dom("label",{className:"switch"});
  var checkbox = Util.dom("input",{type:"checkbox",checked:isOn});
  on.appendChild(checkbox)
  on.appendChild(Util.dom("span",{className:"slider round"}));

  checkbox.addEventListener('change',onChange);
  return on
}

Util.labelRow = function(label, child){
  var container = Util.dom('div',{className:"labelRow"})
  var label = Util.dom('label',{innerHTML:label})
  container.appendChild(label)
  container.appendChild(child)
  return container
}

Util.shuffle = function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

Util.mean = function(l,n){
  r = 0
  var end = typeof n == "undefined" ? l.length : n
  for (var i = 0; i<end; i++){
    r += l[i]
  }
  return r/end
}

Util.mouseWindows = function(mouse, windowSizes){
  var xSum = 0;
  var ySum = 0;
  // mouse = {
  //   x:{short:0,medium:0,long:0,values:mouse.x.values},
  //   y:{short:0,medium:0,long:0,values:mouse.y.values},
  // }

  for (let i =0; i<windowSizes.long; i++){
    xSum += mouse.x.values[i]
    ySum += mouse.y.values[i]

    if(i==windowSizes.short-1){
      mouse.x.short = xSum/windowSizes.short;
      mouse.y.short = ySum/windowSizes.short;
    } else if (i==windowSizes.medium-1){
      mouse.x.medium = xSum/windowSizes.medium;
      mouse.y.medium = ySum/windowSizes.medium;
    }
  }

  mouse.x.long = xSum/windowSizes.long;
  mouse.y.long = ySum/windowSizes.long;

  return mouse;
}


Util.clip = function (num,min,max){
  return Math.max(min,Math.min(num,max))
}
