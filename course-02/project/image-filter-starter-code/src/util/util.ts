import fs from 'fs';
import Jimp = require('jimp');

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string>{
    return new Promise( async resolve => {
        const photo = await Jimp.read(inputURL);
        const outpath = '/tmp/filtered.'+Math.floor(Math.random() * 2000)+'.jpg';
        await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname+outpath, (img)=>{
            resolve(__dirname+outpath);
        });
    });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files:Array<string>){
    for( let file of files) {
        fs.unlinkSync(file);
    }
}


// Check if Url is appropriate
export function validateImageURL(address: string): boolean{
    try{
        const newAddress = new URL(address)
    }catch(TypeError){
        return false
    }
    // Check if it is a valid img
    return address.toLowerCase().match(/(.jpeg|.jpg|.gif|.png)/) != null
}

// This parses query string and gives value of image_url
export function parseUrl(query: string): string{
    const queriedUrl = query.replace("/filteredimage?image_url=",'');
    return queriedUrl
}