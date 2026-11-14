class MyTable{

	findIndex(ARRAY, FIND){
	  try{
		  if(FIND !== null && FIND !== '' && ARRAY !== null && ARRAY !== undefined&& FIND !== undefined){
			for(let i=0;i<ARRAY.length;i++){
			  if(FIND === ARRAY[i]) return i;
			}
		  }
	  }catch(e){console.log(e);}
	  return -1;
	}

	findHeaderIndex(TABLE, FIND){
	  try{
		  return this.findIndex(TABLE[0],FIND);
	  }catch(e){console.log(e);}
	  return -1;
	}

	// convert text into 2D array
	splitToTable(content, trim=false){
		//console.log('   ---   convertToTableObject(content)');

		/*
		// Yeh regex sabhi tarah ke line breaks (\r\n, \n, \r) ko match karega
		const lines = text.split(/\r?\n|\r/);
		*/
		
		const lines = content.split(/\r?\n|\r/).filter(line => line.trim() !== '');
		// अगर कोई line नहीं तो बाहर निकलो
		if (lines.length === 0)   return null;
		// पहली line header मान लो (अगर comma separated है)
		const delimiter = this.detectDelimiter(lines[0]); // कॉमा, टैब, या पाइप
		//const headers = lines[0].split(delimiter).map(h => h.trim());
		let TABLE = [];
		if(trim) 
			for(let i=0;i<lines.length;i++)	TABLE = TABLE.concat([lines[i].split(delimiter).map(h => h.trim())]);
		else 
			for(let i=0;i<lines.length;i++)	TABLE = TABLE.concat([lines[i].split(delimiter)]);
		return TABLE;
	}
		
	// Delimiter पहचानने का सरल तरीका
	detectDelimiter(firstLine) {
	  // पहले टैब (	) चेक करो, फिर कॉमा, फिर पाइप (|)
	  if (firstLine.includes('	')) return '	';
	  if (firstLine.includes('|')) return '|';
	  return ','; // डिफ़ॉल्ट कॉमा
	}

	// create simplest html table data.
	generateBasicHtmlTable(TABULAR_DATA){
	  let TABLE = TABULAR_DATA;
	  let html = '';
	  html +="<table cellspacing=0 border=true class='simple_table' id='simple_table'>";
		if(TABLE.length>0){
		  let row = '';
		  for(let c=0; c<TABLE[0].length; c++) row += ('<th>'+TABLE[0][c]+'</th>');
		  html += row=='' ? '' : ("<thead><tr>"+row+"</tr></thead>");
		}
	  html +="<tbody>";
		for(let r=1; r<TABLE.length; r++){
		  let row = '';
		  for(let c=0; c<TABLE[r].length; c++) row += ('<td>'+TABLE[r][c]+'</td>');
		  html += row=='' ? '' : ("<tr>"+row+"</tr>");
		}
	  html +="<tbody>";
	  html +="</table>";
	  return html;
	}

	generateHighlightedHtmlTable(TABLE, highlightText, cssClassName){
		if(TABLE && highlightText && highlightText.length > 0 && TABLE.length > 0){
			cssClassName = (cssClassName===null || cssClassName===undefined || cssClassName==='') ? 'highlight' : cssClassName;
			let REPL = "<span class='"+cssClassName+"'>$1</span>";
			// create clone of original table data..
			let data = structuredClone(TABLE);
			let regex = new RegExp("(" + highlightText + ")", "gi");
			
			for(let i=1;i<data.length; i++)	for(let j=0;j<data[i].length; j++) data[i][j] = data[i][j].replace(regex,REPL);

			TABLE = data;
		}
		return this.generateBasicHtmlTable(TABLE);
	}
	
	

}
