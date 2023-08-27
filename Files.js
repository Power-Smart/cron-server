const fs = require('fs');
const path = require('path');

export class Files {
    constructor(){
        this.createEntry = this.createEntry.bind(this);
        this.deleteEntry = this.deleteEntry.bind(this);
        this.readEntry = this.readEntry.bind(this);
    }

    createEntry(id, directory, data){

        try{

            if(directory != "startJobs" || directory != "stopJobs"){
                throw new Error("directory mismatched!");
            }else{

                // const fpath = './public/startJobs';
                const fpath = ((dir) => (dir === "startJobs"?'./public/startJobs':'./public/stopJobs'))(directory);
                const fileName = id+".json"

                const jsonData = JSON.stringify(data, null, 2);
                const filePath = path.join(fpath, fileName);

                if (!fs.existsSync(path)) {
                    throw new Error("Directory doesn't exists");
                }else{
                    fs.writeFileSync(filePath, jsonData, 'utf-8');

                    console.log("Entry created");

                    return true;
                }

            }

        }catch(error){
            return(false);
        }

    }

    deleteEntry(id, directory){

        try{

            if(directory != "startJobs" || directory != "stopJobs"){
                throw new Error("directory mismatched!");
            }else{

                const fpath = ((dir) => (dir === "startJobs"?'./public/startJobs':'./public/stopJobs'))(directory);
                const fileName = id+".json"
                const filePath = path.join(fpath, fileName);

                if (!fs.existsSync(path)) {
                    throw new Error("Directory doesn't exists");
                }else{
                    fs.unlink(filePath, (error) => {
                        if (error) {
                          console.error('Error deleting the file:', error);
                        } else {
                          console.log('File deleted successfully.');
                        }
                      });
                    
                    return true;
                }

            }

        }catch(error){
            return(false);
        }

    }


    readEntry(id, directory, params = null){

        try{

            if(directory != "startJobs" || directory != "stopJobs"){
                throw new Error("directory mismatched!");
            }else{

                const fpath = ((dir) => (dir === "startJobs"?'./public/startJobs':'./public/stopJobs'))(directory);
                const fileName = id+".json"
                const filePath = path.join(fpath, fileName);

                if (!fs.existsSync(path)) {
                    throw new Error("Directory doesn't exists");
                }else{

                    fs.readFile(filePath, 'utf-8', (error, jsonData) => {
                        if (error) {
                          console.error('Error reading JSON file:', error);
                          return false;
                        }
                      
                        try {
                          const parsedData = JSON.parse(jsonData);
                          console.log(parsedData);

                          let returnObj = {};

                          if(params){
                            if(params === "*"){

                                returnObj = jsonData;

                            }else{
                                for (const key of params){
                                    if(jsonData.hasOwnProperty(key)){
                                        returnObj[key] = jsonData[key]; 
                                    }
                                }  
                            } 
                            
                            console.log(returnObj);
                            return returnObj;

                          }
                        } catch (parseError) {
                          console.error('Error parsing JSON data:', parseError);
                          throw new Error(parseError);
                        }
                      });
                                        
                }

            }

        }catch(error){
            return(false);
        }

    }



}