// let joyStickLeft = document.getElementById('joyStickLeft');
// let joyStickRight = document.getElementById('joyStickRight');
console.log("hi")
// // //joystick with simple line 
// // let leftJoyStick1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
// // leftJoyStick1.setAttribute("cx", 100);
// // leftJoyStick1.setAttribute("cy", 100);
// // leftJoyStick1.setAttribute("r", 50);
// // JoyStick.appendChild(leftJoyStick1);
// // let stick1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
// // stick1.setAttribute("x1", 100);
// // stick1.setAttribute("y1", 100);
// // stick1.setAttribute("x2", 100);
// // stick1.setAttribute("y2", 100);
// // stick1.setAttribute("stroke", "yellow");
// // JoyStick.appendChild(stick1);


// // //joystick with beizer curve
// // let leftJoyStick2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
// // leftJoyStick2.setAttribute("cx", 300);
// // leftJoyStick2.setAttribute("cy", 100);
// // leftJoyStick2.setAttribute("r", 50);
// // JoyStick.appendChild(leftJoyStick2);
// // let stick2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
// // stick2.setAttribute("fill", "yellow");
// // stick2.setAttribute("d", "M 275 100");
// // JoyStick.appendChild(stick2);


// //joystick with circle
// let leftJoyStick3 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
// leftJoyStick3.setAttribute("cx", 50);
// leftJoyStick3.setAttribute("cy", 50);
// leftJoyStick3.setAttribute("r", 50);
// joyStickLeft.appendChild(leftJoyStick3);

// let leftJoyStickInnerCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
// leftJoyStickInnerCircle.setAttribute("cx", 50);
// leftJoyStickInnerCircle.setAttribute("cy", 50);
// leftJoyStickInnerCircle.setAttribute("r", 25);
// leftJoyStickInnerCircle.setAttribute("fill", "yellow");
// joyStickLeft.appendChild(leftJoyStickInnerCircle);

// let rightJoyStick = document.createElementNS("http://www.w3.org/2000/svg", "circle");
// rightJoyStick.setAttribute("cx", 50);
// rightJoyStick.setAttribute("cy", 50);
// rightJoyStick.setAttribute("r", 50);
// joyStickRight.appendChild(rightJoyStick);

// let rightJoyStickInnerCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
// rightJoyStickInnerCircle.setAttribute("cx", 50);
// rightJoyStickInnerCircle.setAttribute("cy", 50);
// rightJoyStickInnerCircle.setAttribute("r", 25);
// rightJoyStickInnerCircle.setAttribute("fill", "yellow");
// joyStickRight.appendChild(rightJoyStickInnerCircle);

// var rAF = window.mozRequestAnimationFrame ||
//   window.webkitRequestAnimationFrame ||
//   window.requestAnimationFrame;

// var rAFStop = window.mozCancelRequestAnimationFrame ||
//   window.webkitCancelRequestAnimationFrame ||
//   window.cancelRequestAnimationFrame;


// let gamepads = {};

// function gamepadHandler(event, connecting) {
//   let gamepad = event.gamepad;
//   // Note:
//   // gamepad === navigator.getGamepads()[gamepad.index]

//   if (connecting) {
//     gamepads[gamepad.index] = gamepad;
//   } else {
//     delete gamepads[gamepad.index];
//   }
// }

// function buttonPressed(b) {
//   if (typeof(b) == "object") {
//     return b.pressed;
//   }
//   return b == 1.0;
// }

// function gameLoop() {
//   var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
//   if (!gamepads)
//     return;

//   var gp = gamepads[0];

//   //if statement like this makes it so that x and square cannot be pressed at the same time but x and o or triangle can.
//   if (buttonPressed(gp.buttons[0])) {
//     console.log('x was pressed');
//   } else if (buttonPressed(gp.buttons[2])) {
//     console.log('square was pressed');
//   }


//   if(buttonPressed(gp.buttons[1])) {
//     console.log('o pressed');
//   } else if(buttonPressed(gp.buttons[3])) {
//     console.log('triangle button pressed');
//   }

  

    
    
//     let leftJoyStickLeftRight = gp.axes[0];
//     let leftJoyStickUpDown = gp.axes[1];
    
    
//     let rightJoyStickLeftRight = gp.axes[2];
//     let rightJoyStickUpDown= gp.axes[3];
    
    
//     // stick1.setAttribute("x1", 100);
//     // stick1.setAttribute("y1", 100);
//     // stick1.setAttribute("x2", leftJoyStickLeftRight * 50 + 100);
//     // stick1.setAttribute("y2", leftJoyStickUpDown * 50 + 100);


//     // //random offset by 0.2 is necessary
//     // stick2.setAttribute("d", `M 275 100 q ${100 * (leftJoyStickLeftRight + 0.2)} ${100 * leftJoyStickUpDown} 50 0`);

//     leftJoyStickInnerCircle.setAttribute("cx", leftJoyStickLeftRight* 25 + 50 );
//     leftJoyStickInnerCircle.setAttribute("cy", leftJoyStickUpDown* 25 + 50);

//     rightJoyStickInnerCircle.setAttribute("cx", rightJoyStickLeftRight* 25 + 50 );
//     rightJoyStickInnerCircle.setAttribute("cy", rightJoyStickUpDown* 25 + 50);

//   var start = rAF(gameLoop);
// };

var haveEvents = 'GamepadEvent' in window;
var haveWebkitEvents = 'WebKitGamepadEvent' in window;
var controllers = {};
let buttonMapping = ["aButton", "bButton", "xButton", "yButton", "leftTrigger", "leftBumper",
                    "rightTrigger", "rightBumper", "back", "start", "joyStickLeft", "joyStickRight",
                    "dPadUp", "dPadRight", "dPadDown", "dPadLeft", "holder"]
var rAF = window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.requestAnimationFrame;

function connecthandler(e) {
  addgamepad(e.gamepad);
}
function addgamepad(gamepad) {
  controllers[gamepad.index] = gamepad; var d = document.createElement("div");
  d.setAttribute("id", "controller" + gamepad.index);
  var t = document.createElement("h1");
  t.appendChild(document.createTextNode("gamepad: " + gamepad.id));
  d.appendChild(t);
  var b = document.createElement("div");
  b.className = "buttons";
  for (var i=0; i<gamepad.buttons.length; i++) {
    // if (i == 10 || i == 11 || i == 16) {
    //   continue
    // }
    var e = document.createElement("span");
    e.className = "buttonCon" + " " + buttonMapping[i];
    //e.id = "b" + i;
    e.innerHTML = i;
    b.appendChild(e);
  }
  d.appendChild(b);
  // var a = document.createElement("div");
  // a.className = "axes";
  // for (i=0; i<gamepad.axes.length; i++) {
  //   e = document.createElement("meter");
  //   e.className = "axis";
  //   //e.id = "a" + i;
  //   e.setAttribute("min", "-1");
  //   e.setAttribute("max", "1");
  //   e.setAttribute("value", "0");
  //   e.innerHTML = i;
  //   a.appendChild(e);
  // }
  // d.appendChild(a);
  document.getElementById("start").style.display = "none";
  document.body.appendChild(d);
  rAF(updateStatus);
}

function disconnecthandler(e) {
  removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
  var d = document.getElementById("controller" + gamepad.index);
  document.body.removeChild(d);
  delete controllers[gamepad.index];
}

function updateStatus() {
  scangamepads();
  for (j in controllers) {
    var controller = controllers[j];
    var d = document.getElementById("controller" + j);
    var buttons = d.getElementsByClassName("buttonCon");
    for (var i=0; i<controller.buttons.length; i++) {
      // if (i == 10 || i == 11 || i == 16) {
      //   continue
      // }
      // else if (i > 16) {
      //   break
      // }
      var b = buttons[i];
      var val = controller.buttons[i];
      var pressed = val == 1.0;
      var touched = false;
      if (typeof(val) == "object") {
        pressed = val.pressed;
        if ('touched' in val) {
          touched = val.touched;
        }
        val = val.value;
      }
      console.log(b.className + " " + i)
      var pct = Math.round(val * 100) + "%";
      // b.style.backgroundSize = pct + " " + pct;
      b.className = "buttonCon" + " " + buttonMapping[i];
      if (pressed) {
        b.className += " pressed";
      }
      if (touched) {
        b.className += " touched";
      }
    }

    // var axes = d.getElementsByClassName("axis");
    // for (var i=0; i<controller.axes.length; i++) {
    //   var a = axes[i];
    //   a.innerHTML = i + ": " + controller.axes[i].toFixed(4);
    //   a.setAttribute("value", controller.axes[i]);
    // }
  }
  rAF(updateStatus);
}

function scangamepads() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i] && (gamepads[i].index in controllers)) {
      controllers[gamepads[i].index] = gamepads[i];
    }
  }
}

if (haveEvents) {
  window.addEventListener("gamepadconnected", connecthandler);
  window.addEventListener("gamepaddisconnected", disconnecthandler);
} else if (haveWebkitEvents) {
  window.addEventListener("webkitgamepadconnected", connecthandler);
  window.addEventListener("webkitgamepaddisconnected", disconnecthandler);
} else {
  setInterval(scangamepads, 500);
}