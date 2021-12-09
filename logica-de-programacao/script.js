var A = new Array(10);
var p;
var res = document.getElementById('res');

vetorObserva();


for (p = 0; p < 10; p++) {
    var inc = parseInt(prompt('Informe o valor da posição: ' + p));
    while(A.includes(inc)) {
        inc = parseInt(prompt('Valor existente! Insira outro:'));
    }
    A[p] = inc;
}

function vetorObserva() {
    var vetor = [...A];
    setInterval(function () {                
        if (vetor != A) {
            res.innerHTML = `<h2>Seu vetor é: ${A}</h2>`;
            vetor = [...A];
        }
    }, 500);
}

function incluir() {
    var inc = parseInt(prompt('Informe o número que você deseja incluir:'));
    while(A.includes(inc)) {
        inc = parseInt(prompt('Valor existente! Insira outro:'));
        
    }
    A.push(inc);
}

function consultar1() {
    var consult = parseInt(prompt('Informe a posição dentro do vetor:')-1);
    alert(A[consult]);

}

function excluir() {
    var exc = parseInt(prompt('Informe a posição do vetor que você deseja excluir:')-1);
    A.splice(exc,1);
}

function esvaziar() {
    A = [];
}

function close_window() {
    if (confirm("Close Window?")) {
      close();
    }
  }