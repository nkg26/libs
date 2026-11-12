		const SCRIPTS = [
			{src:"https://nkg26.github.io/ifb/res/sapcodes/cls-MyIFB.js"},
			{src:"https://nkg26.github.io/ifb/MyIFB_ABC.js"},
			{src:"https://nkg26.github.io/libs/js/cls-FX_MyPList.js"},
			{src:"https://nkg26.github.io/libs/js/cls-IO.js"},	
			{src:"https://nkg26.github.io/ifb/cls-IFB.js"},	
			{src:"https://nkg26.github.io/libs/js/cls-MyFile.js"},	
			{src:"https://nkg26.github.io/libs/js/cls-MyTable.js"},	
			{src:"https://nkg26.github.io/libs/js/cls-MyFontSize.js"},	
			{src:"https://nkg26.github.io/libs/js/cls-PlainTable.js"}
		];
		
		function unloadCompleteScript(url) {
			  // 1. पहले DOM से <script> टैग हटाएं
			  const script = document.querySelector(`script[src="${url}"]`);
			  if (script) script.remove();
		  }
		  
		function loadSimpleScript(url, callback) {
			const script = document.createElement("script");
			script.src = url;
			script.onload = function () { console.log("Script loaded! "+ url); if (callback) callback(); };
			document.body.appendChild(script);
		}		
		
		for(let i=0; i<SCRIPTS.length; i++){
			//loadSimpleScript(SCRIPTS[i].src,null);
		}
		
