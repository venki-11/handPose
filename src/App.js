// 1. Install dependencies DONE
// 2. Import dependencies DONE
// 3. Setup webcam and canvas DONE
// 4. Define references to those DONE
// 5. Load handpose DONE
// 6. Detect function DONE
// 7. Drawing utilities DONE
// 8. Draw functions DONE
import React, { useRef } from "react";
// import logo from './logo.svg';
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import Webcam from "react-webcam";
import "./App.css";
import { Component } from "react";
import { drawHand, pred, det } from "./utilities";
import { render } from "react-dom";
var webcamRef;
var canvasRef;
var hand;
var arr = ["rock", "paper", "scissor"];
var asciiArr = [ "fa-hand-back-fist","fa-hand" , "fa-hand-scissors" ]

const runHandpose = async () => {
  const net = await handpose.load();
  console.log("Handpose model loaded.");
  //  Loop and detect hands
  setInterval(() => {
    detect(net);
  }, 100);
};
class App extends React.Component {
  yscore = 0;
  cscore = 0;
  draw = 0;
  round = 0;
  you = 0;
  interval = 0;
  interval321 = 0 ;

  constructor(props) {
    
    super(props);
    this.state = {
      userScore:0, 
      botScore:0, 
      userChoice:0, 
      draw:0,
      stateNo:0,
      boolValue:true,
      currentValue:null,
      computer :"rock",
      logArr :[],
      logState:0
    }
    this.outerFuncLoop = this.outerFuncLoop.bind(this);
    this.innerFunc = this.innerFunc.bind(this);
    this.display321 = this.display321.bind(this);
    this.listLog = this.listLog.bind(this)
    webcamRef = React.createRef(null);
    canvasRef = React.createRef(null)
    runHandpose();
  }
  
  render() {
    
    return (
      <div className="App ">
        <div style={{ boxShadow: "0px -10px 50px  lightgray" }}>
          <header className="App-eader d-flex ">
            <div className=" p-4 col-4 d-block mx-auto text-center">
              ROUND {this.round}
            </div>
          </header>
          
        </div>
        <div className=" col-sm-11 col-md-10 mt-5 pb-5 col-lg-9 d-flex mx-auto  flex-wrap justify-content-around" >
        <div className="justify-content-between row  col-12">
            <div className="p-4 col-4 d-flex flex-wrap"style={{boxShadow:"0px 5px 30px lightgray",borderRadius:30}}>
              <span className="text-secondary col-12">SCORE</span>
              <span className="col-12">{this.state.userScore}</span>
              <div
          className="frame col-12 d-flex mt-3 "
          style={{ position: "relative",alignItems: "center",minHeight:1 }}
        >
          <Webcam
            id="webcam"
            ref={webcamRef} className="col-12 "
            style={{ position: "absolute", zindex: 0,left:0,height:"100%"}}
          ></Webcam>
          <canvas
            ref={canvasRef} className="col-12"
            style={{ position: "relative", zindex: 20,left:0,width:"100%"}}
          />
        </div>
            </div>
            <div className="p-4 col-3 d-flex flex-column justify-center flex-wrap">
              <span className="text-secondary col-12">Draw</span>
              <span className="col-12">{this.state.draw}</span>
              <span className="d-block my-md-2 " style={{ fontSize: 20 }}>
              {fun1(this.state.stateNo)}
            </span>
            <span className="log">
            
              {this.listLog(this.state.logArr)}
             
        </span>
            <button
              name="formBtn"
              id="playbtn"
              className={!this.state.boolValue ? "d-none":"mt-5 btn btn-success px-sm-2 px-lg-4"} 
              onClick={this.onstart.bind(this)}
            >
              Play
            </button>
            <button
              name="formBtn"
              id="playbtn"
              className={this.state.boolValue ? "d-none":"mt-5 btn btn-danger px-sm-2 px-lg-4"} 
              onClick={this.stop.bind(this)}
            >
              Stop
            </button>
            </div>
            <div className="p-4 col-4 d-flex justify-center flex-column"style={{boxShadow:"0px 5px 30px lightgray",borderRadius:30}}>
              <span className="text-secondary col-12">SCORE</span>
              <span className="col-12">{this.state.botScore}</span>
              <img src={require("./"+Number(arr.indexOf(this.state.computer)*2+1)+".png")} style={{animation:"rotation 1s linear 0s infinite alternate"}}/> 
              <div className="mt-5">{this.state.computer.toUpperCase()}</div>
            </div>
          </div>
        </div>

        
       
      </div>
    );
  }
  game(you) {
    this.state.computer = this.com();
    this.round++;
    console.log("c" + this.state.computer);
    console.log("y" + you);
    var r = this.check(you, this.state.computer);
    console.log(r);
    if(clearInterval(this.interval321) != undefined){
      clearInterval(this.interval321)
    }
    console.log(this.state.logArr,"array")
    var array2 = this.state.logArr 
    if (r == -1) {
      array2[this.state.logArr.length] = [you,"draw",this.state.computer]
      this.setState({draw:this.state.draw+1,stateNo:7,logArr:array2 })
      
    } else if (r == 0) {
      array2[this.state.logArr.length] = [you,"lose",this.state.computer]
      this.setState({botScore:this.state.botScore+1,stateNo:6,logArr:array2 })
    } else if (r == 1) {
      array2[this.state.logArr.length] = [you,"won",this.state.computer]
      this.setState({userScore:this.state.userScore +1,stateNo:5,logArr:array2});
    }
  }
  com() {
    
    return arr[Math.floor(Math.random() * arr.length)];
  }
  check(you, computer) {
    if (you == computer) return -1;

    if (you == "rock" && computer == "paper") return 0;
    else if (you == "paper" && computer == "rock") return 1;

    if (you == "rock" && computer == "scissor") return 1;
    else if (you == "scissor" && computer == "rock") return 0;

    if (you == "paper" && computer == "scissor") return 0;
    else if (you == "scissor" && computer == "paper") return 1;
  }
  
   
  
 display321() {
    if (this.state.stateNo == 0 || this.state.stateNo == 5 || this.state.stateNo == 6 ||  this.state.stateNo == 7) {
      console.log(3)
      this.setState({stateNo :1})
    }
    else if (this.state.stateNo ==1) {
      console.log(2)
      this.setState({stateNo :this.state.stateNo +1})
    }
    else if (this.state.stateNo == 2) {
      console.log(1)
      this.setState({stateNo :this.state.stateNo +1})
    }else if (this.state.stateNo == 3) {
      console.log("Show your hand")
      this.setState({stateNo :this.state.stateNo +1})
    }
    else {
      this.setState({stateNo :0})
      clearInterval(this.interval321)
    }
  }
  onstart() {
    this.setState({boolValue: false })
    console.log(this.state.boolValue)
    
   this.interval = setInterval(this.outerFuncLoop, 9000);
  }
  async outerFuncLoop (){
    
    console.log("Ready");
    this.interval321 = setInterval(this.display321,1000) 

     setTimeout(this.innerFunc, 6000);
    
  }
innerFunc() {
  this.you = det(hand);
  console.log(this.you)
  this.setState({currentValue:this.you})
  if (this.you == "stop"||this.state.boolValue) {
    console.log("stoped")
    this.setState({stateNo:0})
    this.stop();
    clearInterval(this.interval);
  } else {
    this.game(this.you);
  }

}

stop() {
  if(clearInterval(this.interval321) != undefined){
    clearInterval(this.interval321)
  }
    this.setState({boolValue:true,stateNo:0})
  }
mouseEnter (a){
  this.setState({logState:a})
}
  mouseLeave(a) {
    this.setState({logState:0})
  }
  listLog(logAr) {
     this.state.logArr.reverse()
   return (
    <ul>
    {
      this.state.logArr.map((item,k) =>{
        var ky = k + 1;
        return (<li key={ky} onMouseEnter={() => this.mouseEnter(ky)} onMouseLeave={()=>this.mouseLeave(ky)}><span  className={`bullet ${(this.state.logState == (ky-1)|| this.state.logState ==(ky+1) ) ? "sty1":""}`}>{this.state.logArr.length+1 -ky}</span><div className={`txt-scroll ${(this.state.logState == (ky - 1) || this.state.logState == (ky+1))?"sty2":""}`} ><i className={`fa-solid `+ asciiArr[arr.indexOf(item[0])] }></i>&nbsp;&nbsp;&nbsp;&nbsp; {item[1]} &nbsp;&nbsp;&nbsp;&nbsp;<i className={`fa-solid ` +asciiArr[arr.indexOf(item[2])] }></i></div></li>)
  }
    )     
  }
  
  </ul> )
}
}

const detect = async (net) => {
  // Check data is available
  if (
    typeof webcamRef.current !== "undefined" &&
    webcamRef.current !== null &&
    webcamRef.current.video.readyState === 4
  )
  {
    // Get Video Properties
    const video = webcamRef.current.video;
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    // Set video width
    webcamRef.current.video.width = videoWidth;
    webcamRef.current.video.height = videoHeight;

    // Set canvas height and width
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    // Make Detections
    hand = await net.estimateHands(video);

    // Draw mesh
    const ctx = canvasRef.current.getContext("2d");
    drawHand(hand, ctx);
    pred(hand, ctx);
  }

};
function fun1 (key) {
  switch (key) {
    case 0:
      return (
        <div className="msg"></div>
      )
    case 1:
      return (
        <div className ="msg no">3</div>
      )
    case 2 :
      return (
        <div className ="msg no">2</div>

      )
    case 3 :
      return (
        <div className ="msg no">1</div>

      )
    case 4 :
      return (
        <div className ="msg fail">Show Your Hand</div>

      )
    case 5 :
      return (
        <div className ="msg suc">You Won</div>

      )
    case 6 :
      return (
        <div className ="msg fail">You Loose</div>
  
      )
    case 7 :
      return (
        <div className ="msg draw">Draw</div>
    
      )
    default:
      break;
  }
  
}
export default App;
