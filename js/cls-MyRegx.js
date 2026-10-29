class MyRegx {

// return value only if 'searchVal' has regular expression as like java..
// else return null;
	toRegxAuto(searchVal) {
		if(searchVal === null || searchVal === '' || searchVal === undefined) null;
		searchVal = searchVal.toLowerCase().trim();
		
		// agar humne pehle se he regx di hai..
		if(searchVal.startsWith('^(')){
			return searchVal;
		} 

		const OR = searchVal.includes('||');
		const AND = searchVal.includes('&&');

		if(OR && AND){
			// this is regular expression area..
			var A = toComplexRegxPattern(searchVal);
			//console.log(" A1 = "+A);
			A = normRegxOR(A);
			//console.log("     A2 = "+A);
			return (A.includes('|') || A.includes('(?=.*'))? A: null;
		}
		
		if(!OR && AND){
			var A = toComplexRegxPattern(searchVal);
//			console.log("     AND 1 = "+searchVal);
//			console.log("     AND 2 = "+A);
			return  A.includes('(?=.*') ? A : null;
		}
		
		if(OR && !AND){
			var A = normRegxOR(searchVal);
			//console.log("     OR 1 = "+searchVal);
			//console.log("     OR 2 = "+A);
			return  A.includes('|') ? A : null;
		}
		
		return null;
	}
	
	// this will remove only OR operator at the end and starting.
	toNormalAuto(searchVal) {
		if(searchVal === null || searchVal === '' || searchVal === undefined) null;
		
		// agar humne pehle se he regx di hai..
		if(searchVal.startsWith('^(')){
			return searchVal;
		}
		
		if(searchVal.includes('||')){
			var A = normRegxOR(searchVal);
			//console.log("     OR 1 = "+searchVal);
			//console.log("     OR 2 = "+A);
			return  A.includes('|') ? A : null;
		}
		
		return searchVal;
	}
	
	// bcoz OR regx is simple..
	normRegxOR(A){
		A = A.replaceAll("||","|").trim();
		A = A.includes(" |")?A.replaceAll(" |","|"):A;
		A = A.includes("| ")?A.replaceAll("| ","|"):A;
		A = A.includes("| |")?A.replaceAll("| |","|"):A;
		A = A.includes("| |")?A.replaceAll("| |","|"):A;
		
		A = A.startsWith("|")?A.substring(1).trim():A;
		A = A.endsWith("|")?A.substring(0,A.length-1).trim():A;
		return A;
	}


    /**
     * Yeh user ki logical string ko RegEx Pattern mein convert karta hai
     * Input Example: "(Anil && Kumar) || (sunil && sharma)"
     */
    toComplexRegxPattern(queryString) {
	
        // Step 1: Saare extra spaces ko clean karein
        let query = queryString.trim();

        // Step 2: Pehle individual AND groups (brackets ke andar) ko process karte hain
        // Yeh regex un brackets ko dhundega jinke andar && symbols hain
        // Jaise: (Anil && Kumar) -> (?=.*Anil)(?=.*Kumar)
        query = query.replace(/\(([^)]+)\)/g, (match, groupContent) => {
            // Brackets ke andar ke words ko '&&' se split karein
            let words = groupContent.split('&&').map(w => w.trim());
            // Har word ko lookahead format (?=.*word) mein convert karein
            return '(' + words.map(w => `(?=.*${w})`).join('') + ')';
        });

        // Step 3: Agar brackets ke bahar bhi kuch akele words && ke sath hain, unhe convert karein
        // Step 4: Logic ke '||' (OR) ko RegEx ke pipe '|' mein badlein
        query = query.replace(/\|\|/g, '|');

        // Step 5: Agar final string mein multiple options hain (OR ke sath), toh shuru mein '^' lagayein
        let finalPattern = `^(?:${query})`;
		
		return finalPattern;

        // Final Regular Expression Object return karein (Case-Insensitive 'i' flag ke sath)
        // return new RegExp(finalPattern, 'i');
    }
}



/*

// ---- TESTING WITH DIFFERENT PATTERNS ----

const databaseText = "Mera naam Anil Kumar hai. Mujhe JavaScript framework pasand hai.";
const searcher = new DynamicSearcher(databaseText);

console.log(searcher.search("([a-z] && [A-Z])||(Anil && shyam)")); 



// Test Case 1: Standard Group Condition (Jo aapne pucha tha)
let query1 = "(Anil && Kumar) || (sunil && sharma)";
//console.log("Result 1:", searcher.search(query1)); 
// Output: true (Kyuki Anil & Kumar match ho gaya)

// Test Case 2: Pattern Change - Agar user sirf single AND group de
let query2 = "(JavaScript && Kumar)";
//console.log("Result 2:", searcher.search(query2)); 
// Output: true (Kyuki dono words text mein hain)

// Test Case 3: Pattern Change - Kuch alag naam ya 3 words ka group
let query3 = "(Rahul && sharma) || (Anil && Kumar && JavaScript)";
//console.log("Result 3:", searcher.search(query3)); 
// Output: true (Kyuki right side wale teeno words text mein hain)

// Test Case 4: Fail Scenario
let query4 = "(Python && Kumar) || (sunil)";
//console.log("Result 4:", searcher.search(query4)); 
// Output: false (Na Python mila, na sunil mila)

/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////


let text1 = "Mujhe JavaScript aur Python dono aati hain.";
let text2 = "Mujhe sirf Python aati hai.";

// Pattern: JavaScript AND Python dono hone chahiye
let regexAND = /(?=.*JavaScript)(?=.*Python)/i;

// test() true/false return karta hai
console.log(regexAND.test(text1)); // Output: true  (Kyuki dono hain)
console.log(regexAND.test(text2)); // Output: false (Kyuki JavaScript nahi hai)



let text = "Mujhe Python aur JavaScript seekhna pasand hai.";

// /pattern/gi -> 'g' ka matlab Global (poore text mein dhoodho) 
// 'i' ka matlab Case-Insensitive (small/capital farq nahi padega)
let regexOR = /Java|JavaScript|Python/gi; 

// match() matching words ki array return karta hai
let result = text.match(regexOR); 
console.log(result); // Output: ['Python', 'JavaScript']

/*

💡 RegEx Flags Quick Cheat Sheet:

• /pattern/i (Case-Insensitive): A aur a ko same manega.
• /pattern/g (Global): Pehla match milne par rukega nahi, pure text ke saare matches nikalega.

*/




/*


1. OR Condition (| Pipe Symbol)

RegEx mein OR condition lagana sabse aasan hai. Iske liye pipe | symbol ka use hota hai.
• Jaise agar aapko search karna hai: "Java" OR "JavaScript" OR "Python"
let regexOR = /Java|JavaScript|Python/gi; 

2. AND Condition ((?=.*word)) — Lookahead Assertion

RegEx mein direct koi & symbol nahi hota AND condition ke liye. Kyuki text mein ek word pehle aur doosra baad mein ho sakta hai, isliye hum Positive Lookahead (?=...) ka use karte hain.
• Formula: /^(?=.*word1)(?=.*word2)/i
• Iska matlab hai: "Line ke shuru se check karo ki kya word1 bhi hai AND word2 bhi hai (chahe unka order kuch bhi ho)."


*/
