# Tools to help with creating a CoreML model file
This project contains the following:
1. download-images - NodeJS script that, given a URL on ImageNet, downloads all of the images, strips them of any irrelevant EXIF data and then puts them in the correct training data folder
2. train-model - Python script that trains a machine learning model with TuriCreate and outputs the results as a CoreML file

## download-images
To run this, go into the directory, then...

```
npm install
```

Once the node modules have installed, run the following command to download the images...

```
node download-imagenet-files.js http://www.image-net.org/api/text/imagenet.synset.geturls?wnid=n07697537 hotdog
```

The first parameter should be the URL to the imagenet synset list of URLs.
The second parameter is the classification you want to give these images, e.g. hotdog.

The script will take a few moments to run, and after it has, it will dump the images in the training_data folder.

## train-model
This folder contains a Python script that trains the model with turicreate. Before running the script, make sure that you have followed the installation instructions on the TuriCreate github - https://github.com/apple/turicreate.

Note: there seems to be an issue exporting to CoreML if you have installed Python with homebrew. Therefore, I would thoroughly recommend following the steps for installing with Anaconda on the link above.

Once you've got your training_data downloaded, you can run the script like so:
```
python train-model.py
```

This will take quite a while (10mins-ish), but once it has completed, a file will be created called Classifier.mlmodel. You can import this into your XCode projects.