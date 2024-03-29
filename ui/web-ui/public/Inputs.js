var haveEvents = 'GamepadEvent' in window;
var haveWebkitEvents = 'WebKitGamepadEvent' in window;
var controllers = {};
let buttonMapping = ["aButton", "bButton", "xButton", "yButton", "leftBumper", "rightBumper",
                    "leftTrigger", "rightTrigger", "back", "start", "joyStickLeft", "joyStickRight",
                    "dPadUp", "dPadDown", "dPadLeft", "dPadRight", "holder"]
var rAF = window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.requestAnimationFrame;

function connecthandler(e) {
  addgamepad(e.gamepad);
}
function addgamepad(gamepad) {
  controllers[gamepad.index] = gamepad; var d = document.createElement("div");
  d.setAttribute("id", "controller" + gamepad.index);
  // var t = document.createElement("h1");
  // t.appendChild(document.createTextNode("gamepad: " + gamepad.id));
  // d.appendChild(t);
  var b = document.createElement("div");
  b.className = "buttons";
  for (var i=0; i<gamepad.buttons.length; i++) {
    // if (i == 10 || i == 11 || i == 16) {
    //   continue
    // }
    var e = document.createElement("span");
    e.className = "buttonCon" + " " + buttonMapping[i];
    //e.id = "b" + i;
    // e.innerHTML = i;
    b.appendChild(e);
  }
  // d.appendChild(b);
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

  let joyStickLeft = document.getElementById('joyStickLeft');
  let joyStickRight = document.getElementById('joyStickRight');
  joyStickLeft.style.visibility = "visible"
  joyStickRight.style.visibility = "visible"
  b.append(joyStickLeft)
  b.append(joyStickRight)
  d.append(b)
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
    //   console.log(b.className + " " + i)
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
}
// } else {
//   setInterval(scangamepads, 500);
// }