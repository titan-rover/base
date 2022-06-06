// Author: Khang Pham

import React, {Component} from "react";
import ROSLIB from "roslib";

// Commonjs style of importing ros3d
const ROS3D = require('ros3d');

// class that creates the 3d graph
class RosVisualization extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ros: this.props.ros,
      viewer: null,
      tfClient: null,
      urdfClient: null
    }



   }
   componentDidMount() {
     const createGraph = async () => {
       await this.CreateViewer();
       await this.CreateTfClient();
       await this.CreateUrdfClient();
       // await this.CreateMarkerClient();
     }
     createGraph();
   }



   CreateViewer() {
      let viewer = new ROS3D.Viewer({
        divID : 'urdf',
        width : 800,
        height : 600,
        background: '#444444',
        antialias : true,
      });
      viewer.addObject(new ROS3D.Grid());

      this.setState({
        viewer: viewer
      });

   }

   CreateTfClient() {
     let tfClient = new ROSLIB.TFClient({
      ros : this.state.ros,
      angularThres : 0.01,
      transThres : 0.01,
      rate : 10.0,
      fixedFrame: '/odom'
    });

    this.setState({
      tfClient: tfClient
    });

   }

    CreateUrdfClient() {

     let urdfClient = new ROS3D.UrdfClient({
      ros : this.state.ros,
      tfClient : this.state.tfClient,
      path : 'http://localhost:4020/',
      rootObject : this.state.viewer.scene,
      loader : ROS3D.COLLADA_LOADER_2
    });

    this.setState({
      urdfClient: urdfClient
    });

   }

   // CreateMarkerClient() {
   //   var markerClient = new ROS3D.MarkerClient({
   //   ros : this.state.ros,
   //   tfClient : this.state.tfClient,
   //   topic : '/visualization_marker',
   //   rootObject : this.state.viewer.scene
   //  });
   // }

  render() {

    return (
      <div id='urdf' />

    );
  }


}


export default RosVisualization;
