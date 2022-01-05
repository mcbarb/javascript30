const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const volume = player.querySelector('[name="volume"]');
const playbackRate = player.querySelector('[name="playbackRate"]');

let mousedown = false;

function initControls() {
    volume.value = video.volume;
    playbackRate.value = video.playbackRate;
    progressBar.style.flexBasis = '0%';
}

function togglePlay() {
    const state = video.paused ? 'play' : 'pause';
    return video[state]();
}

function updateButton() {
    const icon = this.paused ? '►' : '❚ ❚';
    toggle.textContent = icon;
}

function handleRanges() {
    console.log(parseFloat(this.value));
    video[this.name] = parseFloat(this.value);
}

function skipAction() {
    video.currentTime += parseFloat(this.dataset.skip);
}

function updateProgressBar() {
    const percentage = video.currentTime / video.duration * 100;
    progressBar.style.flexBasis = `${percentage}%`;
}

function scrub(e) {
    const newTime = e.offsetX / progress.offsetWidth * video.duration;
    video.currentTime = newTime;
}

video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate',updateProgressBar);

toggle.addEventListener('click', togglePlay);

ranges.forEach(range => range.addEventListener('change',handleRanges));

skipButtons.forEach(skipButton => skipButton.addEventListener('click',skipAction));

progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseleave', (e) => {if (mousedown) {console.log('mouseout');mousedown = false;}});
progress.addEventListener('mouseup', () => mousedown = false);

initControls();

// console.log(player);
// console.log(video);
// console.log(progress);
// console.log(progressBar);
// console.log(toggle);
// console.log(skipButtons);
// console.log(ranges);
// console.log(volume);
// console.log(playbackRate);