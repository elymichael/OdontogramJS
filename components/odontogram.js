function init(canvas, config) {    
    var ctx = canvas.getContext("2d");
    // clean context.
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    ctx.textAlign = "center";
    ctx.fillStyle = "#000000";
    ctx.font = "13px Arial";

    drawLine(ctx, config.line.x, config.line.y, config.line.x2, config.line.y2);
    
    let x = 50;
    for (let i = 0; i < 7; i++) {
      drawLine(ctx, x, 185, x, 235);        
      x += config.margin;
    }
    
    drawLine(ctx, x, 150, x, 270); //Center line.

    x = 365;
    for (let i = 0; i < 7; i++) {
        drawLine(ctx, x, 185, x, 235);    
        x += config.margin;
    }

    addImageReverse(ctx, config, 18, "sup", 10, 20, 200, config.arrPosSup);
    addImageNormal(ctx, config, 21, "sup", 10, 332, 200, config.arrPosSup);

    addImageReverse(ctx, config, 48, "inf", 320, 20, 230, config.arrPosInf);
    addImageNormal(ctx, config, 31, "inf", 320, 332, 230, config.arrPosInf);

    canvas.addEventListener(
        "mousedown",
        function(event) {
            const bounds = canvas.getBoundingClientRect();            
            captureEvent(ctx, config, event, bounds);
        },
        false
    );

    canvas.onmousemove = function (e) {        
        const bounds = canvas.getBoundingClientRect();        
        captureEvent(ctx, config, e, bounds);
     };
}

function fillObject(obj, x, y, arrX, arrY, config) {
    odon.imageInfo.push({
      name: obj.name,
      image: obj.src,
      x: x,
      y: y,
      arrX: arrX.slice(0),
      arrY: arrY.slice(0),
      recSize: config.recSize
    });
  };

  function addImageReverse(context, config, initial, prefix, position, pos, textposition, arrPos) {    
    const arr = [16, 28, 40, 28, 28];

    for (let i = initial; i > initial - 8; i--) {
      let image = new Image();
      image.src = `../img/teeth/dentadura-${prefix}-${i}.png`;
      
      image.onload = function() {
        context.drawImage(this, pos, position);
        context.fillText(i, pos + 12, textposition);

        fillObject(this, pos, position, arr, arrPos, config);

        pos += config.margin;
        for (let x = 0; x < 5; x++) {
          drawRect(context, config, arr[x], arrPos[x]);
          //toothInfo.rect.push({x: arr[x], y:arrPos[x]});
          arr[x] += config.margin;
        }
      };
    }
  };

  function addImageNormal(context, config, initial, prefix, position, pos, textposition, arrPos) {    
    var arr = [336, 348, 360, 348, 348];

    for (let i = initial; i < initial + 8; i++) {
      let image = new Image();
      image.src = "../img/teeth/dentadura-" + prefix + "-" + i + ".png";
      
      image.onload = function() {
        context.drawImage(this, pos, position);
        context.fillText(i, pos + 12, textposition);

        fillObject(this, pos, position, arr, arrPos, config);

        pos += config.margin;
        for (let x = 0; x < 5; x++) {
          drawRect(context, config, arr[x], arrPos[x]);
          //toothInfo.rect.push({x: arr[x], y:arrPos[x]});
          arr[x] += config.margin;
        }
      };
    }
  };

function drawLine(context, x, y, x2, y2) {
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x2, y2);    
    // set line color
    context.strokeStyle = '#000000';
    context.stroke();
  };
  
  function redrawRect(context, config, r, x, y) {
    for (let i = 0; i < 5; i++) {
      const rX = r.arrX[i];
      const rY = r.arrY[i];

      if (
        x > rX &&
        x <= rX + config.recSize &&
        y > rY &&
        y <= rY + config.recSize
      ) {
        context.fillStyle = config.colorselection;

        drawRect(context, config, rX, rY);
      }
    }
  };

  function drawRect(context, config, x, y) {
    context.beginPath();
    context.globalAlpha = 0.4;

    context.fillRect(x, y, config.recSize, config.recSize);

    context.globalAlpha = 1;
    context.restore();
  };

  function captureEvent(context, config, event, bounds) {
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    
    var result = odon.imageInfo.filter(
      c =>
        c.arrX.find(v => x > v && x <= v + config.recSize) &&
        c.arrY.find(v => y > v && y <= v + config.recSize)
    );
    
    if (result.length > 0) {
      redrawRect(context, config, result[0], x, y);
    }
  }

  // Get Context Canvas and initialize control.
  let canvas = document.getElementById("canvas");
  
  let config = {
    margin: 40,
    recSize: 10,
    colorselection: "#FF0000",
    arrPosSup: [128, 128, 128, 116, 140],
    arrPosInf: [278, 278, 278, 266, 290],
    line: {
        x: 10, y: 210, x2: 640, y2: 210
    }
  };

  var  odon = {
      imageInfo: []
    };
  
  init(canvas, config);  

  /*
  https://github.com/LeomarisReyes
  https://github.com/jsuarezruiz
  */