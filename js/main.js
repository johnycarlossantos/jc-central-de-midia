// js/main.js

// Importa os módulos nativos do Node.js direto no painel
const fs = require('fs');
const path = require('path');

// Inicializa a ponte de comunicação com o Premiere
const csInterface = new CSInterface();

// Captura os elementos do nosso HTML
const folderInput = document.getElementById('folderPath');
const btnBrowse = document.getElementById('btnBrowse');

// Abre a janela do Windows/Mac para escolher a pasta
btnBrowse.addEventListener('click', () => {
    // Parâmetros: (MúltiplosArquivos, EscolherDiretório, Título, CaminhoInicial, TiposDeArquivo)
    const result = window.cep.fs.showOpenDialog(false, true, "Selecione a pasta de mídia", "", [""]);
    
    // Se o usuário selecionou uma pasta (e não clicou em cancelar)
    if (result.data && result.data.length > 0) {
        folderInput.value = result.data[0]; // Preenche o input com o caminho
        
        // Opcional: Já simula um clique no botão "Carregar" automaticamente!
        btnLoad.click(); 
    }
});
const btnLoad = document.getElementById('btnLoad');
const searchInput = document.getElementById('searchInput');
const resultsGrid = document.getElementById('resultsGrid');

let allMediaFiles = []; // Guarda a lista em memória para o filtro de busca

// Definimos as extensões que queremos listar
const allowedExtensions = ['.mp3', '.wav', '.m4a', '.aac', '.mp4'];

// 1. Ler a pasta quando clicar no botão
btnLoad.addEventListener('click', () => {
    // Padroniza as barras do Windows/Mac para evitar erros de caminho
    const folderPath = folderInput.value.replace(/\\/g, '/'); 
    
    if (!folderPath || !fs.existsSync(folderPath)) {
        resultsGrid.innerHTML = '<p class="placeholder-text">Pasta não encontrada. Cole um caminho válido do Windows.</p>';
        return;
    }

    try {
        const files = fs.readdirSync(folderPath);
        
        // Filtra e mapeia apenas os arquivos compatíveis
        allMediaFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return allowedExtensions.includes(ext);
        }).map(file => {
            return {
                name: file,
                fullPath: path.join(folderPath, file).replace(/\\/g, '/')
            };
        });

        renderGrid(allMediaFiles);
        
    } catch (error) {
        resultsGrid.innerHTML = `<p class="placeholder-text">Erro ao ler: ${error.message}</p>`;
    }
});

// 2. Desenhar os resultados na tela
function renderGrid(filesToRender) {
    resultsGrid.innerHTML = ''; // Limpa os resultados anteriores

    if (filesToRender.length === 0) {
        resultsGrid.innerHTML = '<p class="placeholder-text">Nenhum arquivo de mídia encontrado na busca.</p>';
        return;
    }

    filesToRender.forEach(file => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'media-item';

        // Cria o player nativo do HTML5
        const player = document.createElement('audio');
        player.controls = true;
        // O prefixo file:// permite que o player de HTML5 toque arquivos locais do PC
        player.src = "file://" + file.fullPath; 

        const titleSpan = document.createElement('span');
        titleSpan.className = 'media-title';
        titleSpan.innerText = file.name;

        const btnInsert = document.createElement('button');
        btnInsert.className = 'btn-insert';
        btnInsert.innerText = 'Inserir na Timeline';
        
        // A ponte de comunicação: ao clicar, envia o caminho para o motor do Premiere
        btnInsert.addEventListener('click', () => {
            // "importarArquivo" será o nome da função que criaremos na Etapa 4 no ExtendScript
            csInterface.evalScript(`importarArquivo("${file.fullPath}")`);
        });

        itemDiv.appendChild(titleSpan);
        itemDiv.appendChild(player);
        itemDiv.appendChild(btnInsert);

        resultsGrid.appendChild(itemDiv);
    });
}

// 3. Filtro de busca em tempo real
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    // Filtra o array principal usando o termo digitado e manda redesenhar a grid
    const filteredFiles = allMediaFiles.filter(file => 
        file.name.toLowerCase().includes(searchTerm)
    );
    
    renderGrid(filteredFiles);
});