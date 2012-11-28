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
      fill: "#A5A5A5"
  });

  var line = new Kinetic.Line({
      points: [0, 0, 0, 0],
      stroke: "black"
  });

  setStage(); 

  // Add Places Event Listener
  document.getElementById("place").addEventListener("click", function() {
    $.ajax({
      url: "/petri_nets/" + petri_net_id + "/places",
      type: "POST",
      data: { place: { petri_net_id: petri_net_id,
                      x: midX,
                      y: midY,
                       }},
    }).done(function(data) { 
      console.log(data); 
      gon.places.push(data);
      setStage();
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
    }).done(function(data) { 
      console.log(data); 
      gon.transitions.push(data);
      setStage();
    });   
  }, false);
  
  // functions 
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

    var delButton = new Kinetic.Circle({
      x: posX-22,
      y: posY-20,
      radius: 4,
      fill: '#FF0000',
      stroke: '#000',
      strokeWidth: 2,
      draggable: true
    });
   
    group.add(place);
    group.add(arcButton);
    group.add(delButton);

    // draw tokens
    if(num_of_tokens > 0){
      drawToken(posX, posY, num_of_tokens, group);
    }    

    var moving = false;

    delButton.on("mousedown", function() {
      if(confirm('Are you sure you want to delete this?')) {
        $.ajax({
          url: "/petri_nets/" + petri_net_id + "/places/" + id,
          type: "DELETE",
        }).done(function() { 
          location.reload();
        });  
      }    
    });

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
      setStage();
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
                                    transitionY: v.y  }}
          }).done(function(data) { 
            console.log(data); 
            gon.arcs.push(data);
            setStage();
          });        
        }
      });
    });

    place.on("click", function() {
        $.ajax({
          url: "/petri_nets/" + petri_net_id + "/places/" + id,
          type: "PUT",
          data: { id: id, place: { num_of_tokens: num_of_tokens+1 }} 
        }).done(function(data) { 
          console.log(data); 
          updatePlace(data.x, data.y, data.num_of_tokens, data.id);
          setStage();
        });
    });

    group.on("dragend", function() {
      var x = place.getAbsolutePosition().x;
      var y = place.getAbsolutePosition().y;
      
      $.ajax({
        url: "/petri_nets/" + petri_net_id + "/places/" + id,
        type: "PUT",
        data: { id: id, place: { 
                        x: place.getAbsolutePosition().x,
                        y: place.getAbsolutePosition().y }}
      }).done(function(data) { 
          console.log(data); 
          location.reload();
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

    var delButton = new Kinetic.Circle({
      x: posX,
      y: posY,
      radius: 4,
      fill: '#FF0000',
      stroke: '#000',
      strokeWidth: 2,
      draggable: true
    });
    group.add(transition);
    group.add(arcButton);
    group.add(delButton);

    delButton.on("mousedown", function() {
      if(confirm('Are you sure you want to delete this?')) {
        $.ajax({
          url: "/petri_nets/" + petri_net_id + "/transitions/" + id,
          type: "DELETE",
        }).done(function() { 
          location.reload();
        });  
      }    
    });

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
                                    output: true  }}
          }).done(function(data) { 
            console.log(data); 
            gon.arcs.push(data);
            setStage();
          });         
        }
      });
    });

    group.on("dragend", function() {
      var x = transition.getAbsolutePosition().x;
      var y = transition.getAbsolutePosition().y;
      updateTransition(x, y, id);
      $.ajax({
        url: "/petri_nets/" + petri_net_id + "/transitions/" + id ,
        type: "PUT",
        data: { id: id, transition: { 
                        x: transition.getAbsolutePosition().x,
                        y: transition.getAbsolutePosition().y }}
      });
      location.reload();
    }); 

    transition.on("click", function() {
      $.ajax({
        url: "/petri_nets/" + petri_net_id,
        type: "PUT",
        data: { id: petri_net_id, transition_id: id }
      }).done(function(data) { 
          location.reload();
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
  function setArc(placeX, placeY, transitionX, transitionY, layer, output, id)
  { 
    transitionX += 15;
    transitionY += 15;
    var angle = calcAngle(placeX, transitionX, placeY, transitionY);
    if(output){
      angle += 180;
    }
    var group = new Kinetic.Group({
      id: id
    });
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
    var delButton = new Kinetic.Circle({
      x: (transitionX+placeX)/2,
      y: (transitionY+placeY)/2,
      radius: 4,
      fill: '#FF0000',
      stroke: '#000',
      strokeWidth: 2,
      draggable: true
    });
    group.add(delButton);

    delButton.on("mousedown", function() {
      if(confirm('Are you sure you want to delete this?')) {
        $.ajax({
          url: "/petri_nets/" + petri_net_id + "/arcs/" + id,
          type: "DELETE",
        }).done(function() { 
          location.reload();
        });  
      }    
    });

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

  function drawToken(x, y, num, group) {
    if(num == 1){
      var token = new Kinetic.Circle({
        x: x,
        y: y,
        radius: 4,
        fill: '#000',
        stroke: 'black',
        strokeWidth: 2,
      });
      group.add(token);
    } else if (num > 1 && num < 5) {
      for(i=1; i < num+1; i++) {
        if(i%2 == 0) {
          var token = new Kinetic.Circle({
            x: x + (i*6)-6,
            y: y,
            radius: 4,
            fill: '#000',
            stroke: 'black',
            strokeWidth: 2,
          });
        } else {
          var token = new Kinetic.Circle({
            x: x - (i*6),
            y: y,
            radius: 4,
            fill: '#000',
            stroke: 'black',
            strokeWidth: 2,
          });
        }      
        group.add(token);
      } 
    } else if (num > 4 && num < 10) {
      var simpleText = new Kinetic.Text({
        x: x-5,
        y: y-3,
        text: num,
        fontSize: 10,
        fontFamily: 'Calibri',
        textFill: 'white'
      });
      var token = new Kinetic.Circle({
        x: x,
        y: y,
        radius: 12,
        fill: '#000',
        stroke: 'black',
        strokeWidth: 2,
      });
      group.add(token);
      group.add(simpleText);
    } else {
      var simpleText = new Kinetic.Text({
        x: x-8,
        y: y-3,
        text: num,
        fontSize: 10,
        fontFamily: 'Calibri',
        textFill: 'white'
      });
      var token = new Kinetic.Circle({
        x: x,
        y: y,
        radius: 12,
        fill: '#000',
        stroke: 'black',
        strokeWidth: 2,
      });
      group.add(token);
      group.add(simpleText);
    }
  }

  function setStage() {
  clearStage();
  background = new Kinetic.Rect({
      x: 0, 
      y: 0, 
      width: stage.getWidth(),
      height: stage.getHeight(),
      fill: "#A5A5A5"
  });

  line = new Kinetic.Line({
      points: [0, 0, 0, 0],
      stroke: "black"
  });
  
  drawLayer.add(background);
  drawLayer.add(line); 

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
    setArc(v.placeX, v.placeY, v.transitionX, v.transitionY, drawLayer, v.output, v.id);
  });  
    
  stage.add(drawLayer);
  stage.add(placeLayer);
  stage.add(transitionLayer);
  }

  function clearStage() {
    stage.removeChildren();
    placeLayer.removeChildren();
    transitionLayer.removeChildren();
    drawLayer.removeChildren();
  }

  function updatePlace(x, y, num_of_tokens, id) {
    $(gon.places).each(function(k, v){
      if(v.id == id) {
        v.x = x;
        v.y = y;
        v.num_of_tokens = num_of_tokens;
      }
    });
  }

  function updateTransition(x, y, id) {
    $(gon.transitions).each(function(k, v){
      if(v.id == id) {
        v.x = x;
        v.y = y;
      }
    });
  }

  // function updateArc(placeX, placeX, transitionX, transitionY, id) {
  //   $(gon.arcs).each(function(k, v){
  //     if(v.id == id) {
  //       v.placeX = placeX;
  //       v.placeY = placeY;
  //       v.transitionX = transitionX;
  //       v.transitionY = transitionY;
  //     }
  //   });
  // }
});

