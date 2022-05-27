import React, {Component} from "react";

// Commonjs style of importing ros3d
const ROS3D = require('ros3d');

// class that creates the 3d graph
class RosVisualization extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ros: this.props.ros
    }



   }
   componentDidUpdate() {
     this.CreateViewer();

   }


   CreateViewer() {
      let viewer = new ROS3D.Viewer({
        divID : 'urdf',
        width : 800,
        height : 600,
        antialias : true
      });
      viewer.addObject(new ROS3D.Grid());
   }
   // CreateTfClient() {
   //   var tfClient = new ROSLIB.TFClient({
   //    ros : ros,
   //    angularThres : 0.01,
   //    transThres : 0.01,
   //    rate : 10.0
   //  });
   // }
   // CreateUrdfClient() {
   //   var urdfClient = new ROS3D.UrdfClient({
   //    ros : ros,
   //    tfClient : tfClient,
   //    path : 'http://resources.robotwebtools.org/',
   //    rootObject : viewer.scene,
   //    loader : ROS3D.COLLADA_LOADER_2
   //  });
   // }

  render() {

    return (
      <div id='urdf' />

    );
  }


}


export default RosVisualization;
