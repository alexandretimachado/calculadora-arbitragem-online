// script.js

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
    const percentProbability = (somaProbabilidades * 100).toFixed(2);

    let resultado = `
        <h3>Resultado da Análise</h3>
        <div class="probability-bar">
            <div class="probability-fill" style="width: ${Math.min(percentProbability, 100)}%"></div>
        </div>
        <p>Soma das probabilidades: <strong>${percentProbability}%</strong></p>
    `;

    resultado += isArbitragem ?
        '<p class="success">✅ Oportunidade de arbitragem encontrada!</p>' :
        '<p class="danger">❌ Não há oportunidade de arbitragem.</p>';

    resultado += '<h3>Distribuição de Apostas</h3>';

    odds.forEach((odd, i) => {
        const valor = (valorTotal * probabilidades[i] / somaProbabilidades).toFixed(2);
        const retorno = (valor * odd).toFixed(2);
        const lucro = (retorno - valorTotal).toFixed(2);

        resultado += `
            <div class="bet-result">
                <strong>${descricoes[i]}</strong>
                <p>Odd: ${odd.toFixed(2)}</p>
                <p>Apostar: R$ ${valor}</p>
                <p>Retorno possível: R$ ${retorno}</p>
                <p>Lucro potencial: R$ ${lucro}</p>
            </div>
        `;
    });

    document.getElementById('resultado').innerHTML = resultado;

    // Animar a barra de probabilidade
    setTimeout(() => {
        const bar = document.querySelector('.probability-fill');
        if (bar) {
            bar.style.width = `${Math.min(percentProbability, 100)}%`;
        }
    }, 100);
}

function guardarCalculo() {
    const valorTotal = parseFloat(document.getElementById('valorTotal').value);
    const odds = Array.from(document.getElementsByClassName('odd'))
        .map(input => parseFloat(input.value))
        .filter(odd => !isNaN(odd));
    const descricoes = Array.from(document.getElementsByClassName('desc'))
        .map(input => input.value || `Aposta ${odds.indexOf(parseFloat(input.previousElementSibling.value)) + 1}`);

    if (odds.length < 2 || isNaN(valorTotal)) {
        alert('Por favor, calcule primeiro antes de guardar');
        return;
    }

    const calculo = {
        data: new Date().toLocaleString(),
        valorTotal,
        odds,
        descricoes,
        resultado: document.getElementById('resultado').innerHTML
    };

    // Pegar histórico existente ou criar novo array
    let historico = JSON.parse(localStorage.getItem('historicoArbitragem') || '[]');
    historico.unshift(calculo); // Adiciona no início do array
    localStorage.setItem('historicoArbitragem', JSON.stringify(historico));

    atualizarHistorico();
}

function atualizarHistorico() {
    const historico = JSON.parse(localStorage.getItem('historicoArbitragem') || '[]');
    const historicoDiv = document.getElementById('historicoLista');

    historicoDiv.innerHTML = historico.map((calculo, index) => `
        <div class="historico-item">
            <h4>Cálculo ${index + 1} - ${calculo.data}</h4>
            <p>Valor Total: R$ ${calculo.valorTotal}</p>
            <p>Odds: ${calculo.odds.join(', ')}</p>
            <p>Descrições: ${calculo.descricoes.join(', ')}</p>
            <button class="btn btn-primary" onclick="deletarDoHistorico(${index})">Deletar</button>
        </div>
    `).join('');
}

function deletarDoHistorico(index) {
    let historico = JSON.parse(localStorage.getItem('historicoArbitragem') || '[]');
    historico.splice(index, 1);
    localStorage.setItem('historicoArbitragem', JSON.stringify(historico));
    atualizarHistorico();
}

function exportarParaArquivo(index) {
    const historico = JSON.parse(localStorage.getItem('historicoArbitragem') || '[]');
    const calculo = historico[index];

    const conteudo = `
Cálculo de Arbitragem - ${calculo.data}
Valor Total: R$ ${calculo.valorTotal}
Odds: ${calculo.odds.join(', ')}
Descrições: ${calculo.descricoes.join(', ')}

Resultado:
${calculo.resultado.replace(/<[^>]*>?/gm, '\n').replace(/&nbsp;/g, ' ')}
    `;

    const blob = new Blob([conteudo], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arbitragem-${calculo.data.replace(/[/:\\]/g, '-')}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Carregar histórico ao iniciar a página
window.onload = atualizarHistorico;
