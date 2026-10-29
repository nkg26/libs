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
    this.setFontSize(this.currentSize + this.STEP);
  }
  zoomOut() {
    this.setFontSize(this.currentSize - this.STEP);
  }
			
  setFontSize(newFontSize) {
      // Safe Limits: Font ko bohot chhota (10px) ya bohot bada (30px) hone se rokne ke liye
      newFontSize = (newFontSize < this.MIN) ? this.MIN : newFontSize;
      newFontSize = (newFontSize > this.MAX) ? this.MAX : newFontSize;
      if(newFontSize !== this.currentSize){
        // 3. Style apply kiya ('px' ke sath)
        document.getElementById(this.id).style.fontSize = (this.currentSize = newFontSize) + "px";
      }
    }

}



/////////...........

