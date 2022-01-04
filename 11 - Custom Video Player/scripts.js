const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const volume = player.querySelector('[name="volume"]');
const playbackRate = player.querySelector('[name="playbackRate"]');


console.log(player);
console.log(video);
console.log(progress);
console.log(progressBar);
console.log(toggle);
console.log(skipButtons);
console.log(ranges);
console.log(volume);
console.log(playbackRate);