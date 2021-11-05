import 'aframe'
import React, { Component } from 'react';
import Container from 'react-bootstrap/esm/Container';
import MyNavbar from './components/Navbar';
import ROSLIB from "roslib";


//import css
import "./css/XR.css";

//a-sky test image
import image_360_beach from './images/360_beach.jpeg';
import rover_2020 from './RoverModel2021(Scaled).gltf';


class XR extends Component {

  constructor(props) {
    super(props);

    this.state = {
      imu: {
        rotation: { x: 0, y: 0, z: 0 },
        position: { x: 0, y: -10, z: 0 },
      }
    };

    this.connectRosBridge("ws://localhost:9090");

    this.createListeners();
    // this.createPublishers();
    this.registerCallbacks();
  }

  registerCallbacks() {
    //Register ros callbacks
    this.ros.on("connection", () => {
      this.setState({
        status: "Connected"
      });
    });
    this.ros.on("error", error => {
      this.setState({
        status: "Error"
      });
    });
    this.ros.on("closed", () => {
      this.setState({
        status: "Closed"
      });
    });

    // Register listener callbacks
    // Handlers for when ROS messages have been received
    // Generally updates/sets state data which with re-render the UI with new data

    // IMU message handler
    if (this.imu_listener) {
      this.imu_listener.subscribe(m => {
        // let x = Math.cos(m.yaw) * Math.cos(m.pitch);
        // let y = Math.sin(m.yaw) * Math.cos(m.pitch);
        // let z = Math.sin(m.pitch);

        // Quaternian orientation
        let x = m.orientation.x;
        let y = m.orientation.y;
        let z = m.orientation.z;
        let w = m.orientation.w;

        let roll = null;
        let pitch = null;
        let yaw = null;


        // Convertions to Roll, Pitch, and Yaw
        // Roll
        let sinr_cosp = 2 * (w * x + y * z);
        let cosr_cosp = 1 - 2 * (x * x + y * y);
        roll = Math.atan2(sinr_cosp, cosr_cosp);

        // Pitch
        let sinp = 2 * (w * y - z * x);
        if (Math.abs(sinp) >= 1)
          if (sinp >= 0)
            pitch = Math.PI / 2; // use 90 degrees if out of range
          else
            pitch = -Math.PI / 2;
        else
          pitch = Math.asin(sinp);

        // Yaw
        let siny_cosp = 2 * (w * z + x * y);
        let cosy_cosp = 1 - 2 * (y * y + z * z);
        yaw = Math.atan2(siny_cosp, cosy_cosp);

        // Console Output
        console.log("Yaw: " + yaw);
        console.log("Pitch: " + pitch);
        console.log("Roll: " + roll);

        console.log(m);
        console.log(x, y, z);

        // Set State
        this.setState({ //setState() schedules an update to a component's state object. When state changes the component responds by re-rendering
          imu: {
            rotation: {
              x: -roll - Math.PI / 2,
              y: -pitch,
              z: yaw + Math.PI / 2
              // x: x - Math.PI/2,
              // y: y,
              //z: z + Math.PI/2
            },
            position: this.state.imu.position
          }
        });
      });
    }
  }

    // Creates ROS Topic objects for Listeners
    // Similar to Publishers, but includes throttle rate and queque for the incoming messages
    createListeners() {
      try {
        // this.antenna_listener = new ROSLIB.Topic({
        //   ros: this.ros,
        //   name: "/antenna",
        //   messageType: "fake_sensor_test/antenna",
        //   throttle_rate: this.THROTTLE_RATE,
        //   queue_length: this.QUEUE_LENGTH
        // });

        // this.rovergps_listener = new ROSLIB.Topic({
        //   ros: this.ros,
        //   name: "/rover_gnss",
        //   messageType: "telemetry/gps",
        //   throttle_rate: this.THROTTLE_RATE,
        //   queue_length: this.QUEUE_LENGTH
        // });

        // this.basegps_listener = new ROSLIB.Topic({
        //   ros: this.ros,
        //   //name: "/rover_gnss",
        //   //messageType: "telemetry/gps",
        //   throttle_rate: 10,
        //   queue_length: this.QUEUE_LENGTH
        // });

        // console.log(this.rovergps_listener);

        this.imu_listener = new ROSLIB.Topic({
          ros: this.ros,
          name: "/imu",
          messageType: "sensor_msgs/Imu",
          throttle_rate: this.THROTTLE_RATE,
          queue_length: this.QUEUE_LENGTH
        });

        // this.mobility_listener = new ROSLIB.Topic({
        //   ros: this.ros,
        //   name: "/mobility",
        //   messageType: "fake_sensor_test/mobility",
        //   throttle_rate: this.THROTTLE_RATE,
        //   queue_length: this.QUEUE_LENGTH
        // });

        // this.ultrasonic_listener = new ROSLIB.Topic({
        //   ros: this.ros,
        //   name: "/ultrasonic",
        //   messageType: "fake_sensor_test/ultrasonic",
        //   throttle_rate: this.THROTTLE_RATE,
        //   queue_length: this.QUEUE_LENGTH
        // });
      } catch (e) {
        //Fail to create ROS object
        this.setState({
          status: "Error"
        });
        console.log("Error: Failed to create ros listener");
      }
    }

    render() {
      return (
        <Container fluid={true} className="pt-2">
          <MyNavbar />

          <Container className="xr-container">
            <a-scene embedded>
              <a-assets>
                <img id="beach-test" src={image_360_beach} />
                <a-asset-item id="rover-model" src={rover_2020}></a-asset-item>
              </a-assets>

              <a-curvedimage
                color="#7BC8A4"
                position="0 1.5 -0.5"
                width="5"
                height="1.25"
                radius="2"
                theta-length="90"
                rotation="0 45 0"
              >
              </a-curvedimage>

              <a-curvedimage
                color="#7BC800"
                position="0 1.5 -0.5"
                width="5"
                height="1.25"
                radius="2"
                theta-length="90"
                rotation="0 135 0"
              >
              </a-curvedimage>

              <a-curvedimage
                color="#7BF000"
                position="0 1.5 -0.5"
                width="5"
                height="1.25"
                radius="2"
                theta-length="90"
                rotation="0 225 0"
              >
              </a-curvedimage>

              <a-curvedimage
                color="#5BC040"
                position="0 1.5 -0.5"
                width="5"
                height="1.25"
                radius="2"
                theta-length="90"
                rotation="0 315 0"
              >
              </a-curvedimage>

              <a-gltf-model src="#rover-model" scale="1 1 1" position={this.props.position} rotation={this.props.rotation}></a-gltf-model>

              <a-sky radius="10" src="#beach-test"></a-sky>
            </a-scene>
          </Container>

        </Container >
      );
    }
  }

  export default XR;