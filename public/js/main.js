
function downloadImage(url, name) {
    let xhr = new XMLHttpRequest();
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