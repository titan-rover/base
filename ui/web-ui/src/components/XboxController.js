import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import  '../css/XboxController.css'
class XboxController extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
<>
<div className="card">
  <div className="card-body">
<div className="xbox-container">
    <div className="main1">


    </div>

<div className="side1">

</div>


<div className="side2">

</div>



<div className="main">

<div className="indent">
</div>
<div className="long"> </div>
<div className="circle"></div>
<div className="button1"><i className="fa fa-window-restore"></i></div>
<div className="button2"><i className="fa fa-navicon"></i></div>
<div className="buttony">Y</div>
<div className="buttonx">X</div>
<div className="buttona">A</div>
<div className="buttonb">B</div>
<div className="arrow1"></div>
<div className="arrow2"></div>
<div className="circle2">
    <div className="scroll"></div>
    <div className="inner">
        <div className="inner-inner"></div>


        <div className="circle3">
            <div className="scroll"></div>
            <div className="inner">
                <div className="inner-inner"></div>

    </div>
</div>
</div>


</div>
</div>
</div>
</div>
</div>
</>
    );
  }
}

export default XboxController;
