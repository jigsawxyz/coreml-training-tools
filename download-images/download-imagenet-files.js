const download = require("download-file");
const superagent = require("superagent");
const request = require("request");
const fs = require("fs");
const async = require("async");
const gm = require("gm");
const sharp = require('sharp');
const http = require("http");
const uuidv4 = require('uuid/v4');
const isCorrupted = require("is-corrupted-jpeg");

const DOWNLOAD_ASYNC_LIMIT = 30;

var checkIfImageIsValid = function(filename, callback) {
    if (isCorrupted(filename)) {
        console.log(filename, "is corrupted!");
        fs.unlink(filename, () => {
            callback();
        });
    } else {
        // Load into gm
        gm(filename)
            .noProfile()
            .write(filename, (err) => {
                if (err) {
                    console.log(err);
                }

                callback();
            });
        
    }
}

var downloadImage = function(url, subdir, index, callback) {
    request.head(url, {timeout: 2000}, (err, res, body) => {
        if (!res || !res.headers) {
            return callback("Could not get headers");
        }

        if (!res.headers['content-type'] || res.headers['content-type'] != "image/jpeg") {
            console.log('Not image - content-type:', res.headers['content-type']);
            return callback("Not an image");
        }

        var fullFilename = "training_data/" + subdir + "/" + uuidv4() + ".jpg";

        if (!err) {
            request(url).on("error", () => {
                return callback("Error downloading image");
            }).pipe(fs.createWriteStream(fullFilename)).on('close', () => {
                // Check image is valid

                checkIfImageIsValid(fullFilename, () => {
                    callback();
                })
            });
        } else {
            callback("Error");
        }
    });
};


var getListOfImages = function(url, callback) {
    superagent.get(url, (err, res) => {
        if (!err) {
            var images = res.text.split(/\r?\n/);
            console.log("There are", images.length, "possible images...");
            console.log("Starting to process...");
            callback(null, images);
        } else {
            callback("Could not load URL");
        }
    });
};

if (process.argv.length > 3) {
    console.log("Going to look at the image list - ", process.argv[2]);
    console.log("We will be categorising these images as", process.argv[3]);
    
    fs.exists("training_data/" + process.argv[3], (exists) => {
        if (!exists) {
            fs.mkdirSync("training_data/" + process.argv[3]);
        }

        getListOfImages(process.argv[2], (err, images) => {
            if (err) {
                console.log(err);
            } else {
                var index = 1;

                async.eachLimit(images, DOWNLOAD_ASYNC_LIMIT, (image, cb) => {
                    index++;
                    console.log("Downloading [", index, " of " + images.length, "] - ", image);
                    downloadImage(image, process.argv[3], index, (err) => {
                        if (err) {
                            console.log("Could not download");
                        }  

                        cb();
                    });
                }, () => {
                    console.log("All done  ✅");
                })
            }
    
        })
    });
    
    

} else {
    console.log("Could not find image url");
}