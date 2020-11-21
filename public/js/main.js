
const xhr = new XMLHttpRequest();

const HOSTNAME = 'http://localhost:3000';

function downloadImage(url, name) {
    xhr.open('POST', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function() {
        const urlCreator = window.URL || window.webkitURL;
        const imageUrl = urlCreator.createObjectURL(this.response);
        const tag = document.createElement('a');
        tag.href = imageUrl;
        tag.target = '_blank';
        tag.download = name;
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);
    };
    xhr.onerror = err => {
        alert('Failed to download picture');
    };
    xhr.send(JSON.stringify({
        movieId: "878496841",
        fileId: "1397146"
    }));
}

function searchMovie() {
    const input = document.getElementById('search').value;
    if (input && input.length) {
        sendSearch(input);
    }
}

function sendSearch(url) {
    xhr.open('POST', `${HOSTNAME}/api/search`, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.responseType = 'text';
    xhr.onload = function() {
        const response = JSON.parse(this.response);
        const resultDiv = document.getElementById('searchResult');
        const name = document.getElementById("name");
        const quality = document.getElementById("quality");
        const language = document.getElementById("language");
        const duration = document.getElementById("duration");
        name.innerText = response.name;
        quality.innerText = response.quality;
        language.innerText = response.language;
        duration.innerText = response.duration;
        resultDiv.style.display = "block";
    };
    xhr.onerror = err => {
        alert('Failed get movie data');
    };
    xhr.send(JSON.stringify({
        "url": url
    }));
}