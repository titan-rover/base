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
<body>
<div class="card">
  <div class="card-body">
<div class="xbox-container">
    <div class="main1">


    </div>

<div class="side1">

</div>


<div class="side2">
    
</div>



<div class="main">

<div class="indent">
</div>
<div class="long"> </div>
<div class="circle"></div>
<div class="button1"><i class="fa fa-window-restore"></i></div>
<div class="button2"><i class="fa fa-navicon"></i></div>
<div class="buttony">Y</div>
<div class="buttonx">X</div>
<div class="buttona">A</div>
<div class="buttonb">B</div>
<div class="arrow1"></div>
<div class="arrow2"></div>
<div class="circle2">
    <div class="scroll"></div>
    <div class="inner">
        <div class="inner-inner"></div>


        <div class="circle3">
            <div class="scroll"></div>
            <div class="inner">
                <div class="inner-inner"></div>
        
    </div>
</div>
</div>


</div>
</div> 
</div>
</div>
</div>
</body>
    );
  }
}

export default XboxController;