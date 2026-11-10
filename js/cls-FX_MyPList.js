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
	
	}
