$(document).ready(function() {
  var stage = new Kinetic.Stage({
    container: 'canvas',
    width: 940,
    height: 600,
  });

  // Initialize global variables
  var drawLayer = new Kinetic.Layer();
  var placeLayer = new Kinetic.Layer();
  var transitionLayer = new Kinetic.Layer();
  var petri_net_id = $('#petri_net_id').html();
  var midX = stage.getWidth() / 2 - 50;
  var midY = stage.getHeight() / 2 - 25;

  var background = new Kinetic.Rect({
      x: 0, 
      y: 0, 
      width: stage.getWidth(),
      height: stage.getHeight(),
      fill: "#D5D5D5"
  });

  var line = new Kinetic.Line({
      points: [0, 0, 0, 0],
      stroke: "black"
  });

  drawLayer.add(background);
  drawLayer.add(line);
  

  // Add Places Event Listener
  document.getElementById("place").addEventListener("click", function() {
    $.ajax({
      url: "/petri_nets/" + petri_net_id + "/places",
      type: "POST",
      data: { place: { petri_net_id: petri_net_id,
                      x: midX,
                      y: midY,
                       }},
      success: function(data) {
        //alert(data);
      }
    });   
  }, false);

  // Add Transitions Event Listener
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

  // set all places
  $(gon.places).each(function(k, v){
    setPlace(v.x, v.y, v.id, v.num_of_tokens, placeLayer);
  });

  // set all transitions
  $(gon.transitions).each(function(k, v){
    setTransition(v.x, v.y, v.id, transitionLayer);
  });

  //set all arcs
  $(gon.arcs).each(function(k, v){
    setArc(v.placeX, v.placeY, v.transitionX+15, v.transitionY+15, drawLayer, v.output);
  });  
    
  stage.add(drawLayer);
  stage.add(placeLayer);
  stage.add(transitionLayer);

  // fuctions 
  function setPlace(posX, posY, id, num_of_tokens, layer)
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

    arcButton.on("mousedown", function() {
      if (moving){
          moving = false;
          drawLayer.draw();
      } else {
          var mousePos = stage.getMousePosition();
          //start point and end point are the same
          line.getPoints()[0].x = mousePos.x;
          line.getPoints()[0].y = mousePos.y;
          line.getPoints()[1].x = mousePos.x;
          line.getPoints()[1].y = mousePos.y;
          moving = true;    
          drawLayer.drawScene();            
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
          drawLayer.drawScene();
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
      drawLayer.drawScene();
    });

    arcButton.on("dragend", function() {
      var x = arcButton.getAbsolutePosition().x;
      var y = arcButton.getAbsolutePosition().y;
      $(gon.transitions).each(function(k, v) {
        if((Math.abs(v.x - x) < 25) && (Math.abs(v.y - y) < 25)) {           
          $.ajax({
            url: "/petri_nets/" + petri_net_id + "/arcs/",
            type: "POST",
            data: { id: id, arc: {  petri_net_id: petri_net_id,
                                    place_id: id, 
                                    placeX: posX, 
                                    placeY: posY,
                                    transition_id: v.id,
                                    transitionX: v.x,
                                    transitionY: v.y  }},
            success: alert("Arc Connected To Transition")
          });        
        }
      });
    });

    place.on("click", function() {
      if(num_of_tokens < 1) {
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
                        x: place.getAbsolutePosition().x,
                        y: place.getAbsolutePosition().y }}
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

    layer.add(group);  
  }

  function setTransition(posX, posY, id, layer)
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

    var moving = false;

    arcButton.on("mousedown", function() {
      if (moving){
          moving = false;
          drawLayer.draw();
      } else {
          var mousePos = stage.getMousePosition();
          //start point and end point are the same
          line.getPoints()[0].x = mousePos.x;
          line.getPoints()[0].y = mousePos.y;
          line.getPoints()[1].x = mousePos.x;
          line.getPoints()[1].y = mousePos.y;
          moving = true;    
          drawLayer.drawScene();            
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
          drawLayer.drawScene();
      }
    });

    arcButton.on("mouseup", function(){
      moving = false; 
      arcButton.setX(posX+30);
      arcButton.setY(posY);
      line.getPoints()[0].x = 0;
      line.getPoints()[0].y = 0;
      line.getPoints()[1].x = 0;      
      line.getPoints()[1].y = 0;
      drawLayer.drawScene();
    });

    arcButton.on("dragend", function() {
      var mousePos = stage.getMousePosition();
      var x = mousePos.x;
      var y = mousePos.y;
      $(gon.places).each(function(k, v) {
        if((Math.abs(v.x - x) < 30) && (Math.abs(v.y - y) < 30)) {               
          $.ajax({
            url: "/petri_nets/" + petri_net_id + "/arcs/",
            type: "POST",
            data: { id: id, arc: {  petri_net_id: petri_net_id,
                                    place_id: v.id, 
                                    placeX: v.x, 
                                    placeY: v.y,
                                    transition_id: id,
                                    transitionX: posX,
                                    transitionY: posY,
                                    output: true  }},
            success: alert("Arc Connected To Place")
          });        
        }
      });
    });

    group.on("dragend", function() {
      var mousePos = stage.getMousePosition();
      $.ajax({
        url: "/petri_nets/" + petri_net_id + "/transitions/" + id ,
        type: "PUT",
        data: { id: id, transition: { 
                        x: transition.getAbsolutePosition().x,
                        y: transition.getAbsolutePosition().y }}
      });
    }); 

    transition.on("click", function() {
      $.ajax({
        url: "/petri_nets/" + petri_net_id,
        type: "PUT",
        data: { id: petri_net_id, transition_id: id }
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

    layer.add(group);
  }

  // fuctions 
  function setArc(placeX, placeY, transitionX, transitionY, layer, output)
  { 
    var angle = calcAngle(placeX, transitionX, placeY, transitionY);
    if(output){
      angle += 180;
    }
    var group = new Kinetic.Group();
    var arc = new Kinetic.Line({
      points: [placeX, placeY, transitionX, transitionY],
      stroke: "black"
    });
    group.add(arc);
    var arrow = new Kinetic.RegularPolygon({
      x: (transitionX+placeX)/2,
      y: (transitionY+placeY)/2,
      sides: 3,
      rotationDeg: angle,
      radius: 8,
      stroke: "black",
      strokeWidth: 2,
    });    
    group.add(arrow);

    layer.add(group);
  }

  function calcAngle(x1, x2, y1, y2)
  {
    var calcAngle = Math.atan2(x1-x2,y1-y2)*(180/Math.PI);  
    if(calcAngle < 0) {
      calcAngle = Math.abs(calcAngle);
    } else {
      calcAngle = 360 - calcAngle; 
    }   
    return calcAngle;
  }
});

