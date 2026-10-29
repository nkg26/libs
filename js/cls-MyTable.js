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
		const lines = content.split('\n').filter(line => line.trim() !== '');
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

	/* convert tabuler data into array of [{h1:v1, h2:v2, ...}, {...}, ...]*/
	toKeyMapObjectList(TABULAR_DATA){
		const [headers, ...rows] = TABULAR_DATA;
		  if (!headers) return [];
		  return rows.map(row => Object.fromEntries(headers.map((header, i) => [header, row[i]])));
	}

	/* convert tabuler data into array of [{h1:v1, h2:v2, ...}, {...}, ...]*/
	convertTableToScriptArrayObject_old(data){
		let out = [];
		for(let i=1;i<data.length;i++) out.push(Object.fromEntries(data[0].map((key, j) => [key, data[i][j]])));
		return out;
	}

	/* 2 map-array objects ke data ko kisi attribute-key ki condition se merge karna..*/
	/* data MAIN_LIST me add hoga.. */
	merge_KeyMapObjects(MAIN_LIST, ADD_DATA, KEY_NAME){
	  if(KEY_NAME===null || KEY_NAME===undefined){
		console.log(' undefined or null merge key...');
		return;
	  }
	  const A = MAIN_LIST;
	  const B = ADD_DATA;
		for(let i=0; i<A.length; i++){
			let VAL = A[i][KEY_NAME];
			for(let j=0; j<B.length; j++){
				if(VAL === B[j][KEY_NAME]){
					Object.assign(A[i], B[j]); // merge both data and assign to A.
					break;
				}
			}
		}
	}

}
