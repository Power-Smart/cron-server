import fs from 'fs';
import path from 'path';
import _ from 'lodash';

export class Files {
    constructor() {
        this.createEntry = this.createEntry.bind(this);
        this.deleteEntry = this.deleteEntry.bind(this);
        this.readEntry = this.readEntry.bind(this);
    }

    createEntry(id, directory, data) {

        try {

            // console.log(id, directory, data);

            if (directory !== "startJobs" && directory !== "stopJobs") {
                console.log("directory mismatched!");
                throw new Error("directory mismatched!");
            } else {

                console.log("directory matched!");

                // const fpath = './public/startJobs';
                const fpath = ((dir) => (dir === "startJobs" ? './public/startJobs' : './public/stopJobs'))(directory);
                const fileName = id + ".json"

                // console.log(fpath);
                // console.log(fileName);

                const jsonData = JSON.stringify(data, null, 2);
                const filePath = path.join(fpath, fileName);

                // console.log(jsonData);
                // console.log(filePath);

                if (!fs.existsSync(fpath)) {

                    console.log("Directory doesn't exists");
                    throw new Error("Directory doesn't exists");
                } else {
                    fs.writeFileSync(filePath, jsonData, 'utf-8');

                    console.log("Entry created");

                    return true;
                }

            }

        } catch (error) {
            return (false);
        }

    }

    deleteEntry(id, directory) {

        try {

            if (directory != "startJobs" && directory != "stopJobs") {
                throw new Error("directory mismatched!");
            } else {

                const fpath = ((dir) => (dir === "startJobs" ? './public/startJobs' : './public/stopJobs'))(directory);
                const fileName = id + ".json"
                const filePath = path.join(fpath, fileName);

                if (!fs.existsSync(fpath)) {
                    throw new Error("Directory doesn't exists");
                } else {
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

        } catch (error) {
            console.log(error.message);
            return (false);
        }

    }


    //     async readEntry(directory, id = null, params = null){

    //         try{

    //             if(!_.isNull(id)){

    //                 if(directory != "startJobs" && directory != "stopJobs"){
    //                     throw new Error("directory mismatched!");
    //                 }else{

    //                     const fpath = ((dir) => (dir === "startJobs"?'./public/startJobs':'./public/stopJobs'))(directory);
    //                     const fileName = id+".json"
    //                     const filePath = path.join(fpath, fileName);

    //                     if (!fs.existsSync(path)) {
    //                         throw new Error("Directory doesn't exists");
    //                     }else{

    //                         fs.readFile(filePath, 'utf-8', (error, jsonData) => {
    //                             if (error) {
    //                                 console.error('Error reading JSON file:', error);
    //                                 return false;
    //                             }

    //                             try {
    //                                 const parsedData = JSON.parse(jsonData);
    //                                 console.log(parsedData);

    //                                 let returnObj = [];

    //                                 if(params){

    //                                 for (const key of params){
    //                                         if(parsedData.hasOwnProperty(key)){
    //                                             returnObj[key] = parsedData[key]; 
    //                                         }
    //                                     }  
    //                                 }else{
    //                                     returnObj = parsedData;
    //                                 }

    //                                 console.log(returnObj);
    //                                 return returnObj;

    //                             } catch (parseError) {

    //                                 console.error('Error parsing JSON data:', parseError);
    //                                 throw new Error(parseError);

    //                             }

    //                           });

    //                     }

    //                 }

    //             }else{

    //                 let returnObj = [];

    //                 if(directory != "startJobs" && directory != "stopJobs"){
    //                     throw new Error("directory mismatched!");
    //                 }else{

    //                     const fpath = ((dir) => (dir === "startJobs"?'./public/startJobs':'./public/stopJobs'))(directory);

    //                     fs.readdir(fpath, (error, files) => {
    //                         if (error) {
    //                           console.error('Error reading directory:', error);
    //                           return false;
    //                         }

    //                         // Iterate through each file
    //                         files.forEach(file => {

    //                             const fId = file.split(".")[0];

    //                             console.log(fId);

    //                             const filePath = path.join(fpath, file);

    //                             // Read the content of each file
    //                             fs.readFile(filePath, 'utf-8', (readError, content) => {

    //                                 console.log("inside readfile");

    //                                 if (readError) {
    //                                 console.error(`Error reading file ${file}:`, readError);
    //                                 return false;
    //                                 }

    //                                 try {

    //                                     console.log("inside try-catch");
    //                                     const parsedData = JSON.parse(content);
    //                                     // console.log(parsedData);

    //                                     let tempObj = {};

    //                                     if(params){

    //                                     for (const key of params){
    //                                             if(parsedData.hasOwnProperty(key)){
    //                                                 tempObj[key] = parsedData[key]; 
    //                                             }
    //                                         }  
    //                                     }else{
    //                                         tempObj = parsedData;
    //                                     }
    //                                     console.log("pushed");
    //                                     // console.log(tempObj);
    //                                     returnObj.push(tempObj);
    //                                     console.log(returnObj);


    //                                 } catch (parseError) {

    //                                     console.error('Error parsing JSON data:', parseError);
    //                                     throw new Error(parseError);

    //                                 }
    //                                 console.log("mama aye nagitta puthe\n\n\n\n\n\n");
    //                                 // console.log(`Content of ${file}:\n${content}\n`);
    //                             });

    //                         });

    //                       });

    //                 }

    //                 console.log("hello");  
    //                 console.log(returnObj);
    //                 return returnObj;

    //             }



    //         }catch(error){
    //             console.log(error.message);
    //             return(false);
    //         }

    //     }

    async readEntry(directory, id = null, params = null) {
        try {
            if (!_.isNull(id)) {
                if (directory !== "startJobs" && directory !== "stopJobs") {
                    throw new Error("directory mismatched!");
                } else {
                    const fpath = ((dir) => (dir === "startJobs" ? './public/startJobs' : './public/stopJobs'))(directory);
                    const fileName = id + ".json";
                    const filePath = path.join(fpath, fileName);

                    if (!fs.existsSync(filePath)) {
                        throw new Error("File doesn't exist");
                    } else {
                        const jsonData = await fs.promises.readFile(filePath, 'utf-8');
                        try {
                            const parsedData = JSON.parse(jsonData);
                            let returnObj = {};

                            if (params) {
                                for (const key of params) {
                                    if (parsedData.hasOwnProperty(key)) {
                                        returnObj[key] = parsedData[key];
                                    }
                                }
                            } else {
                                returnObj = parsedData;
                            }

                            return returnObj;
                        } catch (parseError) {
                            console.error('Error parsing JSON data:', parseError);
                            throw new Error(parseError);
                        }
                    }
                }
            } else {
                if (directory !== "startJobs" && directory !== "stopJobs") {
                    throw new Error("directory mismatched!");
                } else {
                    const fpath = ((dir) => (dir === "startJobs" ? './public/startJobs' : './public/stopJobs'))(directory);
                    const files = await fs.promises.readdir(fpath);
                    let returnObj = [];

                    for (const file of files) {
                        const fId = file.split(".")[0];
                        const filePath = path.join(fpath, file);
                        const content = await fs.promises.readFile(filePath, 'utf-8');

                        try {
                            const parsedData = JSON.parse(content);
                            let tempObj = {};

                            if (params) {
                                for (const key of params) {
                                    if (parsedData.hasOwnProperty(key)) {
                                        tempObj[key] = parsedData[key];
                                    }
                                }
                            } else {
                                tempObj = parsedData;
                            }

                            returnObj.push(tempObj);
                        } catch (parseError) {
                            console.error('Error parsing JSON data:', parseError);
                            throw new Error(parseError);
                        }
                    }

                    return returnObj;
                }
            }
        } catch (error) {
            console.log(error.message);
            return false;
        }
    }




}