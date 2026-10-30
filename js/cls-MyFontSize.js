class MyFontSize{
  // Default size store karne ke liye variable
  DEFAULT_SIZE = 16;
  currentSize = DEFAULT_SIZE;
  MIN = 4;
  MAX = 30;
  STEP = 1;

  constructor(id){
    this.id = id;
  }
  
			
  resetFontSize() {
    const element = document.getElementById(this.id);
    this.currentSize = this.DEFAULT_SIZE;
    element.style.fontSize = this.DEFAULT_SIZE + "px";
  }

  zoomIn() {
    this.changeFontSize(this.STEP);
  }
  zoomOut() {
    this.changeFontSize(-this.STEP);
  }
	changeFontSize(steps){
		this.setFontSize(this.currentSize + steps);
	}
  normalizeFontSize(newFontSize) {
      // Safe Limits: Font ko bohot chhota (10px) ya bohot bada (30px) hone se rokne ke liye
      newFontSize = (newFontSize < this.MIN) ? this.MIN : newFontSize;
      newFontSize = (newFontSize > this.MAX) ? this.MAX : newFontSize;
      return newFontSize;
    }
	

  setFontSize(newFontSize, id=this.id) {
      newFontSize = this.normalizeFontSize(newFontSize);
      if(newFontSize !== this.currentSize){
        // 3. Style apply kiya ('px' ke sath)
        document.getElementById(id).style.fontSize = (this.currentSize = newFontSize) + "px";
      }
    }

	// this is currently depricated..
  setFontSize0(newFontSize) {
      // Safe Limits: Font ko bohot chhota (10px) ya bohot bada (30px) hone se rokne ke liye
      newFontSize = (newFontSize < this.MIN) ? this.MIN : newFontSize;
      newFontSize = (newFontSize > this.MAX) ? this.MAX : newFontSize;
      if(newFontSize !== this.currentSize){
        // 3. Style apply kiya ('px' ke sath)
        document.getElementById(this.id).style.fontSize = (this.currentSize = newFontSize) + "px";
      }
    }

	createHtmlButtons(){
		return `
		<div class="font-btn-container" style="display:inline-block;">
	        <button class="font-btn" onclick="zoomIn(1)">A+ </button>
	        <button class="font-btn" onclick="changeFontSize(-1)">A- </button>
	        <button class="font-btn" onclick="resetFontSize()">Reset</button>
			<script>
				// Default size store karne ke liye variable
				const DEFAULT_SIZE = 16;
				let currentSize = DEFAULT_SIZE;
				
				function resetFontSize() {
					const table = document.getElementById("productGrid");
					currentSize = DEFAULT_SIZE;
					table.style.fontSize = DEFAULT_SIZE + "px";
				}
	
				function changeFontSize(action) {
					// 1. Table element ko select kiya
					const table = document.getElementById("productGrid");
					
					// 2. Font size ko increment ya decrement kiya
					currentSize += action;
	
					// Safe Limits: Font ko bohot chhota (10px) ya bohot bada (30px) hone se rokne ke liye
					if (currentSize < 4) currentSize = 4;
					if (currentSize > 30) currentSize = 30;
	
					// 3. Style apply kiya ('px' ke sath)
					table.style.fontSize = currentSize + "px";
				}
	
			</script>
	    </div>		
		`;
	}

}



/////////...........

