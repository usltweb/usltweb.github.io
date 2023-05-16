let status1 = "";
let objects = [];
let result;

function setup() {
  canvas = createCanvas(350, 350);
  canvas.center();
  canvas.id("mycan");
 
  video = createCapture(VIDEO);
  video.size(350, 350);
  video.hide();
  
}

function start() {
  classifier = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/22WvgGNLh/model.json', modelLoaded);
}

function draw() {
  image(video, 0, 0, 350, 350);
  if (status1 == "true" && objects.length > 0) {
    const box = objects[0].boundingBox;
    if (box) {
      fill(0, 0, 0);
      noStroke();
      rectMode(CENTER);
      rect(width/2, height/2, box.width, box.height);
    }
  }
}

function modelLoaded() {
  console.log("model is loaded");
  status1 = "true";
  classifier.classify(video, gotResults);
}

function gotResults(error, results) {
  if (error) {
    console.log(error);
  } else {
    console.log(results);
    const resultsDiv = document.getElementById("results");
    const resultText = document.createElement("p");
    resultText.innerText = results[0].label;
    resultsDiv.appendChild(resultText);

    assignObjects(results, function() {
      console.log(objects);
    });

    objects = results;

    speakResult(); // speak result after displaying it
  }
}

function assignObjects(results, callback) {
  objects = results;
  callback();
}

synth = window.speechSynthesis;

function speakResult() {
  if (objects.length > 0) {
    result = objects[0].label;
    utterance = new SpeechSynthesisUtterance(result);
    synth.speak(utterance);
  }
}

start();

const menuIcon = document.querySelector(".menu-icon");
const menu = document.querySelector(".menu");

menuIcon.addEventListener("click", () => {
  menu.classList.toggle("active");
});
