	class FX_MyPList{

/*
	// Saari keys nikalne ke liye
	const keys = Object.keys(plist[0]);
*/
			
			// agar list item ki value me specified value exist karti hai.
			filterByValue(pList, KEY, INCLUDES_VALUE){
				return pList.filter(item => {
					return (item[KEY] !== undefined) && item[KEY].includes(INCLUDES_VALUE);
				});
			}

			// agar list item ki value me specified value exist karti hai.
			filterByValue_LC(pList, KEY, INCLUDES_VALUE){
				INCLUDES_VALUE = INCLUDES_VALUE.toLowerCase();
				return pList.filter(item => {
					return (item[KEY] !== undefined) && item[KEY].toLowerCase().includes(INCLUDES_VALUE);
				});
			}

			// agar list item ki value me specified value exist karti hai.
			filterByValue_LC_NOT(pList, KEY, INCLUDES_VALUE){
				INCLUDES_VALUE = INCLUDES_VALUE.toLowerCase();
				return pList.filter(item => {
					return !((item[KEY] !== undefined) && item[KEY].toLowerCase().includes(INCLUDES_VALUE));
				});
			}

			/* 2 map-array objects ke data ko kisi attribute-key ki condition se merge karna..*/
			/* data MAIN_P_LIST me add hoga.. */
			mergeLists(MAIN_P_LIST, ADD_P_LIST, KEY_NAME){
			  const A = MAIN_P_LIST;
			  const B = ADD_P_LIST;
			  
			  if(A===null || B === null || KEY_NAME===undefined){
				console.log(' undefined or null merge key...');
				return;
			  }
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
						
			// specified key ki values ki list get karna
			extractListOfKey(pList, KEY){
				let out=[];
				pList.filter(item => { out.push(item[KEY]); });
				return out;
			}
			
			// specified KEY k according unique list get karna..
			getUniqueListByKey(plist, KEY){
				let out = [];
				for(let i=0; i<plist.length; i++){
					if(plist[i] !==undefined  && pList[i][KEY] !== undefined){
						let V1 = pList[i][KEY] === ''? null : pList[i][KEY];
						
						if(V1 !== null){
							for(let j=0; j<out.length; j++){
								if(V1 === out[j][KEY]){
									V1 = null;
									break;
								}
							}
						}
						if(V1 !== null){
							out.push(plist[i]);
						}
					}
				}
				return out;
			}
	
			/* not tabular plain text, its 2D-Array*/
			/* convert tabuler data into array of [{h1:v1, h2:v2, ...}, {...}, ...]*/
			toPList(TABULAR_DATA){
				const [headers, ...rows] = TABULAR_DATA;
				  if (!headers) return [];
				  return rows.map(row => Object.fromEntries(headers.map((header, i) => [header, row[i]])));
			}

		getUniqueKeys(plist){
			//let keys = Object.keys(plist[1]);
			// सभी unique keys निकालना
			const uniqueKeys = [...new Set(plist.flatMap(obj => Object.keys(obj)))];
			return uniqueKeys;
		}
		
		norm(val){ return val === undefined ? '' : val;	}

		toHtmlTable(plist, keys){
			keys = (keys===null || keys === undefined || keys.length<1) ? this.getUniqueKeys(plist):keys;
			for(let c=0; c<keys.length; c++)  keys[c] = this.norm(keys[c]); 


			
			let html = "<table border=true cellspacing=0 class='pTable'>";
			let row='';
			for(let c=0; c<keys.length; c++) row += `<th class='C${c}'>${keys[c]}</th>`; 
			html += "<thead> <tr>"+row+"</tr> </thead>";
			
			html += "<tbody>";
			for(let i=0; i<plist.length; i++){
				row='';
				for(let c=0; c<keys.length; c++) row += (`<td class='C${c}'>${this.norm(plist[i][keys[c]])} </td>`); 
				html += "<tr>"+row+"</tr>";
			}
			return html += "</tbody></table>";
		}
		
		// isme plist ko 2D-Array (Tablular data) me convert karte hai..
		toTablularData(plist, keys){
			keys = (keys===null || keys === undefined || keys.length<1) ? this.getUniqueKeys(plist):keys;
			let out = new Array(plist.length+1);
			let row = new Array(keys.length);
			for(let i=0; i<keys.length; i++) row[i]=this.norm(keys[i]); 
			out[0]= row;
			for(let r=0; r<plist.length; r++){
				row = new Array(keys.length);
				for(let i=0; i<keys.length; i++) row[i]=this.norm(plist[r][keys[i]]); 
				out[r+1] = row;
			}
			return out;
		}
	
		delKey(plist, delKeyName){
			for(let i=0; i<plist.length; i++) delete plist[i][delKeyName];
		}
		
		delKeys(plist, delKeyNames){
			for(let i=0; i<plist.length; i++)	
				for(let j=0; j<delKeyNames.length; j++)	
					delete plist[i][delKeyNames[j]];
		}
		
		// we will merge columns...
		mergePValues(plist, newKeyName, keyNames, seprator=" | "){
			for(let i=0; i<plist.length; i++)	{
				let val = '';
				for(let j=0; j<keyNames.length; j++)	val += ((j===0?'':seprator) + (plist[i][keyNames[j]]));
				plist[i][newKeyName] =  val;
			}
		}
		
		renameKey(plist, oldKeyName, newKeyName){
			for(let i=0; i<plist.length; i++)	{
				plist[i][newKeyName] = plist[i][oldKeyName];
				delete plist[i][oldKeyName];
			}
		}	
	
	}
