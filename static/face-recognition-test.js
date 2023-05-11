const detectarRostros = () => {
    const form = document.getElementById('formDetect');
    form.addEventListener('submit', async event => {
        event.preventDefault();
        const formData = new FormData(form);
        const response = await fetch('http://localhost:8080/detectFaces', {
            method: 'POST',
            body: formData
        });
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const img = document.createElement('img');
        img.src = url;
        document.getElementById('resultsDetect').appendChild(img);
    });
};

const compararRostros = () => {
    const form = document.getElementById('formCompare');
    form.addEventListener('submit', async event => {
        event.preventDefault();
        const formData = new FormData(form);
        const response = await fetch('http://localhost:8080/compareFaces', {
            method: 'POST',
            body: formData
        });
        const result = await response.text()
        document.getElementById('resultsCompare').innerText = result;
    });

};

const init = () => {
    detectarRostros();
    compararRostros();
};

init();





