$(document).ready(function() {
  var stage = new Kinetic.Stage({
    container: 'canvas',
    width: 940,
    height: 600,
  });

  var layer = new Kinetic.Layer();
  var arcLayer = new Kinetic.Layer();
  var placeLayer = new Kinetic.Layer();
  var transitionLayer = new Kinetic.Layer();
  var petri_net_id = $('#petri_net_id').html();

  var midX = stage.getWidth() / 2 - 50;
  var midY = stage.getHeight() / 2 - 25;

  // set all places
  $(gon.places).each(function(k, v){
    setPlace(v.x, v.y, v.id, v.num_of_tokens);
  });

  // set all transitions
  $(gon.transitions).each(function(k, v){
    setTransition(v.x, v.y, v.id);
  });

  // set all arcs
  $(gon.arcs).each(function(k, v){
    setArc(v.beginX, v.beginY, v.endX, v.endY, v.id);
  });

  background = new Kinetic.Rect({
      x: 0, 
      y: 0, 
      width: stage.getWidth(),
      height: stage.getHeight(),
      fill: "#D5D5D5"
  });

  line = new Kinetic.Line({
    points: [0, 0, 0, 0],
    strokeWidth: 4,
    stroke: "black"
  });

  layer.add(background);
  layer.add(line);
  stage.add(layer);
  stage.add(arcLayer);
  stage.add(placeLayer);
  stage.add(transitionLayer);  



moving = false;

  stage.on("mousedown", function(){
    if (moving){
        moving = false;layer.draw();
    } else {
        var mousePos = stage.getMousePosition();
        //start point and end point are the same
        line.getPoints()[0].x = mousePos.x;
        line.getPoints()[0].y = mousePos.y;
        line.getPoints()[1].x = mousePos.x;
        line.getPoints()[1].y = mousePos.y;

        moving = true;    
        layer.drawScene();            
    }
  }); 
  stage.on("mousemove", function(){
    if (moving) {
        var mousePos = stage.getMousePosition();
        var x = mousePos.x;
        var y = mousePos.y;
        line.getPoints()[1].x = mousePos.x;
        line.getPoints()[1].y = mousePos.y;
        moving = true;
        layer.drawScene();
    }
  });
  stage.on("mouseup", function(){
    moving = false; 
  }); 

// Add Places Event
  document.getElementById("place").addEventListener("click", function() {
    $.ajax({
      url: "/petri_nets/" + petri_net_id + "/places",
      type: "POST",
      data: {place: { petri_net_id: petri_net_id,
                      x: midX,
                      y: midY,
                       }},
      success: function(data) {
        alert("how can I get data here?");
      }
    });   
  }, false);

// Add Transitions Event
  document.getElementById("transition").addEventListener("click", function() {
    $.ajax({
      url: "/petri_nets/" + petri_net_id + "/transitions",
      type: "POST",
      data: {transition: { petri_net_id: petri_net_id,
                      x: midX,
                      y: midY,
                       }},
    });  
  }, false);

// Add Arc Event
  document.getElementById("arc").addEventListener("click", function() {
    $.ajax({
      url: "/petri_nets/" + petri_net_id + "/arcs",
      type: "POST",
      data: {arc: { petri_net_id: petri_net_id,
                      beginX: midX-20,
                      beginY: midY-20,
                      endX: midX+20,
                      endY: midY+20,
                       }}
    });      
  }, false); 

  // fuctions 
  function setPlace(posX, posY, id, num_of_tokens)
  {
    var group = new Kinetic.Group({
        draggable: true,
        id: id
      });
    var place = new Kinetic.Circle({
      x: posX,
      y: posY,
      radius: 30,
      fill: '#67A969',
      stroke: 'black',
      strokeWidth: 2,
      shadow: {
            offset: 3,
            color: 'black',
            blur: 5,
            opacity: 0.5
          }
    });

    group.add(place);

    // draw tokens
    for (var i=0;i<num_of_tokens;i++)
    {
      var tempX = posX;
      var tempY = posY;
      if(i == 4) {
        tempY -= 15;
      }
      else if (i == 3) {
        tempY += 15;
      }
      else {
        tempX = tempX-(i*15)+15;
      }

      var token = new Kinetic.Circle({
        x: tempX,
        y: tempY,
        radius: 5,
        fill: '#000',
        stroke: 'black',
        strokeWidth: 2,
      });

      group.add(token);
    }

    group.on("click", function() {
      if(num_of_tokens < 5) {
        $.ajax({
          url: "/petri_nets/" + petri_net_id + "/places/" + id,
          type: "PUT",
          data: { id: id, place: { num_of_tokens: num_of_tokens+1 }} 
        });
      }
    });

    group.on("dragend", function() {
      var mousePos = stage.getMousePosition();
      $.ajax({
        url: "/petri_nets/" + petri_net_id + "/places/" + id,
        type: "PUT",
        data: { id: id, place: { 
                        x: mousePos.x,
                        y: mousePos.y }}
      });
    });

    group.on("mouseover", function() {
      document.body.style.cursor = "pointer";
    });

    group.on("mouseout", function() {
      document.body.style.cursor = "default";
    });

    placeLayer.add(group);  
    stage.add(placeLayer);
  }

  function setTransition(posX, posY, id)
  {
    var transition = new Kinetic.Rect({
      x: posX,
      y: posY,
      width: 30,
      height: 30,
      fill: '#5584A4',
      stroke: 'black',
      strokeWidth: 2,
      id: id,
      shadow: {
            offset: 3,
            color: 'black',
            blur: 5,
            opacity: 0.5
          }
    });

    transition.on("dragend", function() {
      var mousePos = stage.getMousePosition();
      $.ajax({
        url: "/petri_nets/" + petri_net_id + "/transitions/" + id ,
        type: "PUT",
        data: { id: id, transition: { 
                        x: mousePos.x,
                        y: mousePos.y }}
      });
    });

    transition.on("click", function() {
      $.ajax({
        url: "/petri_nets/" + petri_net_id + "/transitions/" + id ,
        type: "PUT",
        data: { id: id, transition: { 
                        x: mousePos.x,
                        y: mousePos.y }}
      });
    });    

    transition.on("mouseover", function() {
      transition.setDraggable(true);
      document.body.style.cursor = "pointer";
    });

    transition.on("mouseout", function() {
      transition.setDraggable(false);
      document.body.style.cursor = "default";
    });

    transitionLayer.add(transition);
    stage.add(transitionLayer);
  }

  // fuctions 
  function setArc(beginX, beginY, endX, endY, id)
  {
    var arc = new Kinetic.Line({      
      strokeWidth: 3,
      stroke: "black",
      lineCap: "round",
      id: "arc",
      shadow: {
            offset: 3,
            color: 'black',
            blur: 5,
            opacity: 0.5
          }
    });

    arcLayer.arc = {
      start: buildBeginArc(arcLayer, beginX, beginY, id),
      end: buildEndArc(arcLayer, endX, endY, id)
    };

    arcLayer.beforeDraw(function() {
      updateLines(arcLayer);
    });

    arcLayer.add(arc);
    stage.add(arcLayer);
  }

  function buildBeginArc(layer, x, y, id) {
    var anchor = new Kinetic.Circle({
      x: x,
      y: y,
      radius: 8,
      stroke: "#666",
      fill: '#000',
      strokeWidth: 2,
      draggable: true
    });

    anchor.on("dragend", function() {
      var mousePos = stage.getMousePosition();
        $.ajax({
          url: "/petri_nets/" + petri_net_id + "/arcs/" + id ,
          type: "PUT",
          data: { id: id, arc: { 
                          beginX: mousePos.x,
                          beginY: mousePos.y }},
          success: checkPlaceConnection(x, y, id)
        });
    });

    // add hover styling
    anchor.on("mouseover", function() {
      document.body.style.cursor = "pointer";
      this.setStrokeWidth(4);
      layer.draw();
    });
    anchor.on("mouseout", function() {
      document.body.style.cursor = "default";
      this.setStrokeWidth(2);
      layer.draw();
    });

    layer.add(anchor);
    return anchor;
  }

  function buildEndArc(layer, x, y, id) {
    var anchor = new Kinetic.RegularPolygon({
      x: x,
      y: y,
      sides: 3,
      radius: 8,
      fill: "black",
      stroke: "black",
      strokeWidth: 2,
      name: name,
      draggable: true
    });

    anchor.on("dragend", function() {
      var mousePos = stage.getMousePosition();
      $.ajax({
        url: "/petri_nets/" + petri_net_id + "/arcs/" + id ,
        type: "PUT",
        data: { id: id, arc: { 
                        endX: mousePos.x,
                        endY: mousePos.y }},
        success: checkTransitionConnection(x, y, id)
      });
    });
    
    // add hover styling
    anchor.on("mouseover", function() {
      document.body.style.cursor = "pointer";
      this.setStrokeWidth(4);
      layer.draw();
    });
    anchor.on("mouseout", function() {
      document.body.style.cursor = "default";
      this.setStrokeWidth(2);
      layer.draw();
    });

    layer.add(anchor);
    return anchor;
  }

  function updateLines(layer) {
    var a = layer.arc;
    var arcLine = layer.get('#arc')[0];
    arcLine.setPoints([a.start.attrs.x, a.start.attrs.y, a.end.attrs.x, a.end.attrs.y]);
  }

  function checkPlaceConnection(x, y, id)
  {
    $(gon.places).each(function(k, v) {
      if((Math.abs(v.x - x) < 15) && (Math.abs(v.y - y) < 15)) {        
        $.ajax({
          url: "/petri_nets/" + petri_net_id + "/arcs/" + id ,
          type: "PUT",
          data: { id: id, arc: { place_id: v.id }},
          success: alert("Arc Connected")
        });        
      }
    });
  }

  function checkTransitionConnection(x, y, id)
  {
    $(gon.transitions).each(function(k, v) {
      if((Math.abs(v.x - x) < 15) && (Math.abs(v.y - y) < 15)) {        
        $.ajax({
          url: "/petri_nets/" + petri_net_id + "/arcs/" + id ,
          type: "PUT",
          data: { id: id, arc: { transition_id_id: v.id }},
          success: alert("Arc Connected")
        });
      }
    });
  }
});

