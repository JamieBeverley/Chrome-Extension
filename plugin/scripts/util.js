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

Util.mean = function(l,n){
  r = 0
  var end = typeof n == "undefined" ? l.length : n
  for (var i = 0; i<end; i++){
    r += l[i]
  }
  return r/end
}

Util.mouseWindows = function(x, y, windowSizes){
  var xSum = 0;
  var ySum = 0;
  var r = {
    x:{short:0,medium:0,long:0},
    y:{short:0,medium:0,long:0},
  }

  for (let i =0; i<windowSizes.long; i++){
    xSum += x[i]
    ySum += y[i]

    if(i==windowSizes.short-1){
      r.x.short = xSum/windowSizes.short;
      r.y.short = ySum/windowSizes.short;
    } else if (i==windowSizes.medium-1){
      r.x.medium = xSum/windowSizes.medium;
      r.y.medium = ySum/windowSizes.medium;
    }
  }

  r.x.long = xSum/windowSizes.long;
  r.y.long = ySum/windowSizes.long;

  return r;
}


Util.clip = function (num,min,max){
  return Math.max(min,Math.min(num,max))
}
