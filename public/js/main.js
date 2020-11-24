
const HOSTNAME = 'http://localhost:3000';

let movieId, fileId, movieName, id, poll;

function checkProgress() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET',`${HOSTNAME}/api/progress?id=${id}`, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.responseType = 'text';
    xhr.onload = function () {
        const response = JSON.parse(this.response);
        const progress = response.progress;
        const p = document.getElementById("progress");
        p.innerText = `Progress: ${progress}%`;
        p.style.display = "block";
    };
    xhr.onerror = err => {
        alert('Failed to get progress');
    };
    xhr.send();
}

setInterval(() => {
    if (poll) {
        checkProgress();
        console.log('tick')
    }
}, 2000);

function downloadMovie() {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${HOSTNAME}/api/download`, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.responseType = 'blob';
    xhr.onload = function () {
        const urlCreator = window.URL || window.webkitURL;
        const imageUrl = urlCreator.createObjectURL(this.response);
        const tag = document.createElement('a');
        tag.href = imageUrl;
        tag.target = '_blank';
        tag.download = movieName;
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);
        poll = false;
    };
    xhr.onerror = err => {
        poll = false;
        alert('Failed to download movie');
    };
    xhr.send(JSON.stringify({
        movieId: movieId,
        fileId: fileId,
        name: movieName,
        id: id
    }));

    const input = document.getElementById('search')
    input.value = "";
    const resultDiv = document.getElementById('searchResult');
    resultDiv.style.display = "none";
    poll = true;
}

function searchMovie() {
    const input = document.getElementById('search').value;
    if (input && input.length) {
        sendSearch(input);
    }
}

function sendSearch(url) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${HOSTNAME}/api/search`, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.responseType = 'text';
    xhr.onload = function () {
        const response = JSON.parse(this.response);
        console.log(response);
        const resultDiv = document.getElementById('searchResult');
        const name = document.getElementById("name");
        const quality = document.getElementById("quality");
        const language = document.getElementById("language");
        const duration = document.getElementById("duration");
        name.innerText = `Name: ${response.name}`;
        quality.innerText = `Quality: ${response.quality}`;
        language.innerText = `Language: ${response.language}`;
        duration.innerText = `Duration: ${Math.ceil(Number(response.duration) / 60)} minute`;
        resultDiv.style.display = "block";

        movieId = response.movieId;
        fileId = response.fileId;
        movieName = response.name;
        id = response.id;
    };
    xhr.onerror = err => {
        alert('Failed get movie data');
    };
    xhr.send(JSON.stringify({
        "url": url
    }));
}