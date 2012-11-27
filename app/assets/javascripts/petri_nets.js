$(document).ready(function() {
  var stage = new Kinetic.Stage({
    container: 'canvas',
    width: 940,
    height: 600,
  });

  var layer = new Kinetic.Layer();
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
  // $(gon.arcs).each(function(k, v){
  //   setArc(v.beginX, v.beginY, v.endX, v.endY, v.id);
  // });

  background = new Kinetic.Rect({
      x: 0, 
      y: 0, 
      width: stage.getWidth(),
      height: stage.getHeight(),
      fill: "#D5D5D5"
  });

  line = new Kinetic.Line({
      points: [0, 0, 0, 0],
      stroke: "black"
  });

  layer.add(background);
  layer.add(line);
  stage.add(layer);
  // stage.add(arcLayer);
  stage.add(placeLayer);
  stage.add(transitionLayer);

  // moving = false;

  // stage.on("mousedown", function(){
  //     if (moving){
  //         moving = false;layer.draw();
  //     } else {
  //         var mousePos = stage.getMousePosition();
  //         //start point and end point are the same
  //         line.getPoints()[0].x = mousePos.x;
  //         line.getPoints()[0].y = mousePos.y;
  //         line.getPoints()[1].x = mousePos.x;
  //         line.getPoints()[1].y = mousePos.y;
  //         moving = true;    
  //         layer.drawScene();            
  //     }

  // });

  // stage.on("mousemove", function(){
  //     if (moving) {
  //         var mousePos = stage.getMousePosition();
  //         var x = mousePos.x;
  //         var y = mousePos.y;
  //         line.getPoints()[1].x = mousePos.x;
  //         line.getPoints()[1].y = mousePos.y;
  //         moving = true;
  //         layer.drawScene();
  //     }
  // });

  // stage.on("mouseup", function(){
  //     moving = false; 
  // });

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

  // fuctions 
  function setPlace(posX, posY, id, num_of_tokens)
  {
    var group = new Kinetic.Group({
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
    var arcButton = new Kinetic.Circle({
      x: posX+22,
      y: posY-20,
      radius: 4,
      fill: '#5584A4',
      stroke: '#000',
      strokeWidth: 2,
      draggable: true
    });
    var line = new Kinetic.Line({
      points: [0, 0, 0, 0],
      stroke: "black"
    });
    group.add(line);
    group.add(place);
    group.add(arcButton);

    // draw tokens
    for (var i=0;i<num_of_tokens;i++)
    {
      var tempX = posX;
      var tempY = posY;
      // if(i == 4) {
      //   tempY -= 15;
      // }
      // else if (i == 3) {
      //   tempY += 15;
      // }
      // else {
      //   tempX = tempX-(i*15)+15;
      // }

      var token = new Kinetic.Circle({
        x: tempX,
        y: tempY,
        radius: 8,
        fill: '#000',
        stroke: 'black',
        strokeWidth: 2,
      });

      group.add(token);
    }
    var moving = false;
    var restoreX;
    var restoreY;

    arcButton.on("mousedown", function() {
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

    arcButton.on("mousemove", function(){
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

    arcButton.on("mouseup", function(){
      moving = false; 
      arcButton.setX(posX+22);
      arcButton.setY(posY-20);
      line.getPoints()[0].x = 0;
      line.getPoints()[0].y = 0;
      line.getPoints()[1].x = 0;      
      line.getPoints()[1].y = 0;
      layer.drawScene();
      placeLayer.drawScene();
    });

    arcButton.on("dragend", function() {
      //alert("TODO");
    });

    place.on("click", function() {
      if(num_of_tokens < 5) {
        $.ajax({
          url: "/petri_nets/" + petri_net_id + "/places/" + id,
          type: "PUT",
          data: { id: id, place: { num_of_tokens: num_of_tokens+1 }} 
        });
      }
    });

    place.on("dragend", function() {
      var mousePos = stage.getMousePosition();
      $.ajax({
        url: "/petri_nets/" + petri_net_id + "/places/" + id,
        type: "PUT",
        data: { id: id, place: { 
                        x: mousePos.x,
                        y: mousePos.y }}
      });
    });

    place.on("mouseover", function() {
      group.setDraggable(true);
      document.body.style.cursor = "pointer";
    });

    group.on("mouseout", function() {
      group.setDraggable(false);
      document.body.style.cursor = "default";
    });

    placeLayer.add(group);  
    stage.add(placeLayer);
  }

  function setTransition(posX, posY, id)
  {
    var group = new Kinetic.Group({
        id: id
      });
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

    var arcButton = new Kinetic.Circle({
      x: posX+30,
      y: posY,
      radius: 4,
      fill: '#67A969',
      stroke: '#000',
      strokeWidth: 2,
      draggable: true
    });

    group.add(transition);
    group.add(arcButton);

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
      group.setDraggable(true);
      document.body.style.cursor = "pointer";
    });

    transition.on("mouseout", function() {
      group.setDraggable(false);
      document.body.style.cursor = "default";
    });

    transitionLayer.add(group);
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

    arcLayer.add(arc);
    stage.add(arcLayer);
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

