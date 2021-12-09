let resultSpan = document.getElementById('result');
let radios = document.getElementsByName('algorithms');

function getRandomNumbers(){
    if (radios[0].checked)
        generateShuffledNumbers();
    else
        generateNoiseNumbers();
}

function generateShuffledNumbers() {

    var list = [];

    for (var i = 1; i < 60; i++) {
        list.push(i)
    }

    for (var i = list.length; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
    }
    list = list.filter(number => number != undefined).slice(0, 6);
    let resultString = '';
    list.forEach((number) => {resultString += `${number}, `});
    resultString = resultString.slice(0, -2);
    resultSpan.innerHTML = resultString;
}

function generateNoiseNumbers() {
    fetch("https://api.random.org/json-rpc/4/invoke", {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify({
            "jsonrpc": "2.0",
            "method": "generateIntegers",
            "params": {
                "apiKey": "78fe5e93-cbd5-4838-b8d6-a1468ca255c5",
                "n": 6,
                "min": 1,
                "max": 60,
                "replacement": false
            },
            "id": 42
        })
    })
        .then(response => response.json())
        .then(data => {
            let resultString = '';
            data.result.random.data.forEach((number) => {resultString += `${number}, `});
            resultString = resultString.slice(0, -2);
            resultSpan.innerHTML = resultString;
        })
        .catch(err => {
            console.error(err);
        });
}