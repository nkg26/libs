class MyFile {
    // 1. Constructor: Jaise Java mein hota hai, variables initialize karne ke liye
    constructor(filePath) {
        this.filePath = filePath;
        this.fileContent = null; // Yeh variable file ka data store karega
        this.dataLoaded = false;
        this.dataError = null;
    }

    // 2. Method: File ko fetch karne ke liye (Async method)
    async loadFile() {
        try {
            const response = await fetch(this.filePath);
            if (!response.ok) throw new Error("File nahi mili.");
            
            // File ka data class ke variable (property) mein store ho gaya
            this.fileContent = await response.text();
            this.dataLoaded = true;
            console.log("Class variable mein data save ho gaya!");
        } catch (error) {
            console.error("Error:", error);
            this.dataError = error;
            this.dataLoaded = true;
        }
    }

    // 3. Method: Final output return ya display karne ke liye
    getFinalOutput() {
        return this.fileContent;
    }
    // 3. Method: Final output return ya display karne ke liye
    isDataLoaded() {
        return this.dataLoaded;
    }
}

/*
async loadAndCallback(filePath, callbackFunction) {
    let response = await fetch(filePath);
    let data = await response.text();
    
    // Kaam khatam hone par runtime function call karein
    if (typeof callbackFunction === 'function') {
        callbackFunction(data);
    }
}
*/



/*

// --- Class Ko Use Kaise Karein (Object Creation) ---
// Step 1: Java ki tarah 'new' keyword se object banayein
const myFileObj = new FileHandler('mydata.txt');

// Step 2: Method ko call karke file load karein
// Kyuki loadFile async hai, hum .then() use kar rahe hain taaki load hone ke baad check kar sakein
myFileObj.loadFile().then(() => {
    
    // Step 3: Object ke method se final output variable access karein
    const finalData = myFileObj.getFinalOutput();
    console.log("Final Output:", finalData);
});


*/
