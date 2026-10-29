// 		start_redirect(); // use this function
/*
how to implement...  
copy below div tag... 
and modify as per your requirement.
 ---------------------------------------------------------------
  <div id="redirect-timer" class="timer"> 
    <span id="redirect-message"> </span><br/>
    <span id="redirect-url-path"> </span>
  <button id="t-go" onclick="Redirect_GO()"> go </button>
  <button id="t-stop" onclick="Redirect_STOP()"> stop </button>
  </div>
 ---------------------------------------------------------------
    <script src="../resources/default.js"></script>
    <script src="https://nkg26.github.io/NE/resources/redirect.js"></script>

	<script> 
		Redirect_InsertDefaultHTML(ID);
		Redirect_InitDefaultSetting();		
	    Redirect_setURL("https://www.yahoo.com");
		Redirect_setTime(5*1000);
	    Redirect_START(); 	
    </script>
 ---------------------------------------------------------------

*/


// window.location.href = "https://www.abc.com";
class Redirect{

  openPage(url){
  	window.location.href = url;
  }
  
  insertDefaultHTML(ID){
  	document.getElementById(ID).innerHTML = this.getDefaultHTML(); 
  }
  
  getDefaultHTML(){
  	return `<div id="redirect-timer" class="timer">
  				<span id="redirect-message"> </span><br/>
  				<span id="redirect-url-path"> </span>
  				<button id="t-go" onclick="this.GO()"> go </button>
  				<button id="t-stop" onclick="this.STOP()"> stop </button>
  			</div> `;
  }
  
  InitDefaultSetting(){
  	// hide stop button..
  	document.getElementById("t-stop").style.display="none";
  	document.getElementById("redirect-timer").style.display="none";
  	//document.getElementById("redirect-timer").style.border="5px solid red";
  }
  
  var redirect_URL = "https://nkg26.github.io/NE";
  var redirect_time = 60*1000;// 60 seconds
  var redirect_Interval_ID = null;
  var redirect_cnt_timer=0;
  	
  // start redirect timer
  // this will initiate all functions...
  START(){ 
  	this.deleteOldInterval(); // delete old Interval id
  	// setTimeout(this.GO, redirect_time);  // here you can skip..
  	// redirect_Interval_ID = setInterval(this.callInterval,1000);
  	this.createInterval();
  }
  
  // delete old redirect inverval id
  deleteOldInterval() {
  	if(redirect_Interval_ID !== null){
  		console.log(" << deleting old REDIRECT-INTERVAL-ID = "+ redirect_Interval_ID);
  		clearInterval(redirect_Interval_ID);
  		redirect_Interval_ID=null;
  	}
  }
  
  // delete old redirect inverval id
  createInterval() {
  	this.deleteOldInterval();
  	redirect_Interval_ID = setInterval(this.callInterval,1000);
  	console.log(" >> create new REDIRECT-INTERVAL-ID = "+ redirect_Interval_ID);
  	return redirect_Interval_ID;
  }
  
  
  // increament counter, for internal use only
  callInterval() {
  	 redirect_cnt_timer += 1;
  	 var timeLeft = (redirect_time/1000)-redirect_cnt_timer;
  	 
  	try{
  		this.updateHTML();
  	}catch (e){
  		console.log("clear Interval ID = "+ redirect_Interval_ID);
  		console.log("error = "+ e);
  		this.deleteOldInterval();
  	} 
  	 if (timeLeft<=0){
  		this.GO();
  	 }
  }
  	
  // for internal use only
  updateHTML() {
  	 var timeLeft = (redirect_time/1000)-redirect_cnt_timer;
  	document.getElementById("t-stop").style.color=((timeLeft%2)===0)?"Red":"green";
  	document.getElementById("t-stop").style.display=null;
  	document.getElementById("redirect-message").innerHTML = 'You will be redirect in '+timeLeft+"/"+(redirect_time/1000)+' seconds. ';
  	document.getElementById("redirect-url-path").innerHTML = redirect_URL;
  	if(redirect_cnt_timer>1) document.getElementById("redirect-timer").style.display=null;
  }
  	
  setTime(TIME){ 
  	redirect_time = TIME; 
  }
  setTimeCount(count){ 
  	redirect_cnt_timer = count; 
  }
  
  
  setURL(URL){ 
  	redirect_URL = URL; 
  }
  
  STOP(){ 
  	redirect_URL = null; 
  	document.getElementById("redirect-timer").innerHTML = ''; 
  }
  
  GO(){ 
  	if(redirect_URL !== null) {
  		clearInterval(redirect_Interval_ID);
  		document.getElementById("redirect-timer").innerHTML = 'now you are auto-move to new page...';
  		window.location.href = redirect_URL;
  	}
  }


}



///
