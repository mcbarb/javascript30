const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const currentFilter = document.querySelector('.current-filter');

function getVideo() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(localMediaStream => {
            console.log(localMediaStream);
            // video.msHorizontalMirror = true; // not working
            video.srcObject = localMediaStream; 
            video.play()
        })
        .catch(err => {
            console.log('Oh no!', err);
        });
}

function takePhoto() {
    snap.currentTime = 0;
    snap.play();

    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download','photoBoom.jpeg');
    link.innerHTML = `<img src=${data} alt="snapped photo" />`;
    strip.insertBefore(link, strip.firstChild);
}

const redEffect = (pixels) => {
    for (let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i+0] = pixels.data[i+0] + 100; //red
        pixels.data[i+1] = pixels.data[i+1] - 50; //blue
        pixels.data[i+2] = pixels.data[i+2] * 0.5; //green
        // pixels.data[i+0] //opacity
    }
    return pixels;
}

const sum100 = (pixels) => {
    for (let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i+0] = pixels.data[i+0] + 100; //red
        pixels.data[i+1] = pixels.data[i+0] + 100; //blue
        pixels.data[i+2] = pixels.data[i+0] + 100; //green
        // pixels.data[i+0] //opacity
    }
    return pixels;
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
      pixels.data[i - 150] = pixels.data[i + 0]; // RED
      pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
      pixels.data[i - 550] = pixels.data[i + 2]; // Blue
    }
    return pixels;
}

function greenScreen(pixels) {
    const levels = {};
  
    document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value;
    });
  
    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];
  
      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out!
        pixels.data[i + 3] = 0;
      }
    }
  
    return pixels;
  }

const filters = [
    ['no filter', (pixels) => pixels],
    ['red', redEffect],
    ['sum 100', sum100],
    ['RGB split', rgbSplit],
    ['green screen', greenScreen]
 ]

console.log(filters);

function paintToCanvas(filter = undefined) {
    const w = video.videoWidth;
    const h = video.videoHeight;
    canvas.width = w;
    canvas.height = h;
    if (!filter) {
        filter = filters[0]
    }
    return setInterval(() => {
        ctx.drawImage(video, 0,0,w,h);
        let pixels = ctx.getImageData(0,0,w,h);
        ctx.putImageData(filter[1](pixels), 0, 0);
    }, 16)
}

getVideo()
let painter
video.addEventListener('canplay', _ => {painter = paintToCanvas()});

let appliedFilter = filters[0];
const toggleFilter = () => {
    const i = filters.indexOf(appliedFilter);
    appliedFilter = (i + 1 >= filters.length) ? filters[0] : filters[i+1];
    if (painter) {
        clearInterval(painter);
    }
    painter = paintToCanvas(appliedFilter);
    currentFilter.innerHTML = appliedFilter[0];
}