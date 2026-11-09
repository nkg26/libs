// JavaScript me await tabhi kaam karta hai jab uski parent line (ya function) ke aage async likha ho.
/*
	// Parent function normal hai ❌
	function processData() {
	    // ❌ ERROR: Kyunki iska parent function 'async' nahi hai!
	    let data = await fetch('https://example.com'); 
	}
	
	// Parent function ke aage 'async' laga diya ✅
	async function processData() {
	    // ✅ PERFECT: Kyunki iska parent (main function) ab async hai
	    let data = await fetch('https://example.com'); 
	}

*/
class IO{
	
	async readMultipleFilesParallel(filePaths) {
		// Files ke paths ki array
		//const filePaths = ['file1.txt', 'file2.txt', 'file3.txt'];
		
		try {
			const fs = require('fs').promises;
			console.log("Saari files background threads me read hona shuru ho gayi hain...");
			// Map se har file ke liye ek independent async read promise banega
			const readPromises = filePaths.map(path => fs.readFile(path, 'utf8'));
		
			// Promise.all saare background threads ke complete hone ka wait karega
			const allFilesData = await Promise.all(readPromises);
		
			console.log("✅ Saari files successfully read ho chuki hain!");
			//console.log("File 1 Data:", allFilesData[0]);
			//console.log("File 2 Data:", allFilesData[1]);
			return allFilesData;
		
		} catch (error) {
			console.error("❌ Kisi ek file me dikkat aayi ya file exist nahi karti:", error);
		}
	}

	
	
  async readFile(filePath) {
    let response = await fetch(filePath);
    return await ((!response.ok) || (response.status === 404))?null: response.text();
  }


  
  
  async fetchDataFromServer(filePath) {
    let response = await fetch(filePath);
   // Step 1: Check karein ki status code 200-299 range me hai ya nahi
    if (!response.ok) {
      // Agar status 404 hai, to directly handle karein
      if (response.status === 404) {
        console.log("❌ File Exist nahi karti (404 Not Found)!");
      } else {
        console.log(`❌ Koi aur error aayi hai. Status: ${response.status}`);
      }
      return; // Yahan se bahar nikal jayein, aage ki file read na karein
    }
    return await response.text();
  }
  

    // here callbackFunctionName use without any quotes and not with "asd()"
    async readAndCallback(filePath, callbackFunctionName) {
      console.log("filePath="+filePath);
      console.log("callbackFunctionName="+callbackFunctionName);
  
      let response = await fetch(filePath);
      let data = await response.text();
      
      // Kaam khatam hone par runtime function call karein
      if (typeof callbackFunctionName === 'function') {
          callbackFunctionName(data);
      }
  }


}



