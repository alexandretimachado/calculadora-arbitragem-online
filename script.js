function adicionarOdd() {
    const container = document.getElementById('oddsContainer');
    const oddInputs = container.querySelectorAll('.odd-input');
    const newIndex = oddInputs.length + 1;

    const div = document.createElement('div');
    div.className = 'odd-input';
    div.innerHTML = `
        <div class="odd-number">
            <label for="odd${newIndex}">Odd ${newIndex}:</label>
            <input type="number" id="odd${newIndex}" step="0.01" min="1" placeholder="Ex: 2.00" class="odd">
        </div>
        <div class="odd-desc">
            <label for="desc${newIndex}">Descrição:</label>
            <input type="text" id="desc${newIndex}" placeholder="Ex: Casa de apostas" class="desc">
        </div>
    `;
    container.appendChild(div);
}

function calcular() {
    const valorTotal = parseFloat(document.getElementById('valorTotal').value);
    const odds = Array.from(document.getElementsByClassName('odd'))
        .map(input => parseFloat(input.value))
        .filter(odd => !isNaN(odd));
    const descricoes = Array.from(document.getElementsByClassName('desc'))
        .map((input, index) => input.value || `Aposta ${index + 1}`);

    if (odds.length < 2 || isNaN(valorTotal)) {
        alert('Por favor, preencha pelo menos duas odds e o valor total');
        return;
    }

    const probabilidades = odds.map(odd => 1 / odd);
    const somaProbabilidades = probabilidades.reduce((a, b) => a + b, 0);
    const isArbitragem = somaProbabilidades < 1;

    let resultadoTexto = isArbitragem ? "Há uma oportunidade de arbitragem!" : "Não há arbitragem possível.";
    document.getElementById('resultado').innerHTML = `<p>${resultadoTexto}</p>`;
}

function guardarCalculo() {
    alert("Função para salvar o cálculo ainda não implementada.");
}
