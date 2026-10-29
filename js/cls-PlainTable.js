// import 

		class PlainTable{
			FX_TABLE = new MyTable();
			table_data = [];
			
			getTabularData(){
				return this.table_data;
			}
			
			loadAndShowFileData(path){
				var myfile = new MyFile(path);
				myfile.loadFile().then(() => {
					this.analyzeData(myfile.getFinalOutput());
				});
			}
			
			analyzeData(RAW_DATA){
				this.table_data = this.FX_TABLE.splitToTable(RAW_DATA);
				try{
					//showFinalData(this.getTabularData()); comment 
					show_filtered_products();
				}catch{
					console.log(' showFinalData(this.getTabularData()); is either not implemented or any other reasion..');
				}
			}
			
			filterByText(text){
				return this.filterTabularDataByText(this.table_data, text);			
			}
		
		// isme header always return hoga..
			filterTabularDataByText(table_data, text){
				text = text.toLowerCase();
				return table_data.filter((row, rowIndex) => {
				        if (rowIndex === 0) return true; // header always chaheye..
						for(let i=0; i<row.length; i++){
							if((row[i] === null || row[i] === undefined)?false:row[i].toLowerCase().includes(text)) return true;
						}
						
					return false;
				});			
			}
		
		}
