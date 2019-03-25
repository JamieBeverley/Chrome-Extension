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
