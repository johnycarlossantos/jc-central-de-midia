// js/main.js

const fs = require('fs');
const path = require('path');
const csInterface = new CSInterface();

const folderInput = document.getElementById('folderPath');
const btnLoad = document.getElementById('btnLoad');
const searchInput = document.getElementById('searchInput');
const resultsGrid = document.getElementById('resultsGrid');
const btnBrowse = document.getElementById('btnBrowse');
const btnFav = document.getElementById('btnFav');
const favoritesList = document.getElementById('favoritesList');

// Busca os favoritos salvos na memória do navegador. Se não existir, cria um array vazio.
let savedFavorites = JSON.parse(localStorage.getItem('jc_media_favorites')) || [];

let allMediaFiles = [];

// Adicionamos o .mov na lista de extensões permitidas
const allowedExtensions = ['.mp3', '.wav', '.m4a', '.aac', '.mp4', '.mov'];

// Nova função: Varre a pasta e todas as subpastas dentro dela
function lerPastaESubpastas(dirPath, arrayDeArquivos) {
    const arquivos = fs.readdirSync(dirPath);
    arrayDeArquivos = arrayDeArquivos || [];

    arquivos.forEach(function(arquivo) {
        const caminhoCompleto = path.join(dirPath, arquivo);
        
        // Se for uma pasta, a função chama ela mesma para entrar nela
        if (fs.statSync(caminhoCompleto).isDirectory()) {
            arrayDeArquivos = lerPastaESubpastas(caminhoCompleto, arrayDeArquivos);
        } else {
            // Se for arquivo, adiciona na lista
            arrayDeArquivos.push(caminhoCompleto);
        }
    });
    return arrayDeArquivos;
}

// Função que desenha as tags dos favoritos na tela
function renderFavorites() {
    favoritesList.innerHTML = ''; // Limpa a área
    
    savedFavorites.forEach((favPath, index) => {
        const chip = document.createElement('div');
        chip.className = 'fav-chip';
        
        // Extrai apenas o nome da pasta (ex: "Trilhas") em vez do caminho inteiro
        const folderName = path.basename(favPath);
        
        // Texto clicável da tag
        const nameSpan = document.createElement('span');
        nameSpan.className = 'fav-name';
        nameSpan.innerText = "📁 " + folderName;
        nameSpan.title = favPath; // Mostra o caminho inteiro se passar o mouse por cima
        
        // Ao clicar no nome, ele preenche o input e já carrega os arquivos!
        nameSpan.addEventListener('click', () => {
            folderInput.value = favPath;
            btnLoad.click();
        });

        // Botão de remover o favorito
        const removeSpan = document.createElement('span');
        removeSpan.className = 'fav-remove';
        removeSpan.innerText = 'X';
        removeSpan.title = "Remover dos favoritos";
        
        removeSpan.addEventListener('click', () => {
            savedFavorites.splice(index, 1); // Remove da lista
            localStorage.setItem('jc_media_favorites', JSON.stringify(savedFavorites)); // Salva no banco
            renderFavorites(); // Redesenha a lista
        });

        chip.appendChild(nameSpan);
        chip.appendChild(removeSpan);
        favoritesList.appendChild(chip);
    });
}

// Ação do botão de favoritar (Estrela)
btnFav.addEventListener('click', () => {
    const currentPath = folderInput.value;
    
    if (!currentPath || currentPath.trim() === '') {
        alert("Selecione uma pasta primeiro clicando na pastinha ao lado!");
        return;
    }
    
    // Se a pasta ainda não está na lista de favoritos
    if (!savedFavorites.includes(currentPath)) {
        savedFavorites.push(currentPath);
        localStorage.setItem('jc_media_favorites', JSON.stringify(savedFavorites));
        renderFavorites();
    } else {
        alert("Esta pasta já está nos seus favoritos!");
    }
});


btnBrowse.addEventListener('click', () => {
    const result = window.cep.fs.showOpenDialog(false, true, "Selecione a pasta de mídia", "", [""]);
    if (result.data && result.data.length > 0) {
        folderInput.value = result.data[0];
        btnLoad.click(); 
    }
});

btnLoad.addEventListener('click', () => {
    const folderPath = folderInput.value.replace(/\\/g, '/'); 
    
    if (!folderPath || !fs.existsSync(folderPath)) {
        resultsGrid.innerHTML = '<p class="placeholder-text">Pasta não encontrada.</p>';
        return;
    }

    try {
        // Agora usamos a nossa nova função que entra em subpastas
        const todosArquivosRaw = lerPastaESubpastas(folderPath);
        
        allMediaFiles = todosArquivosRaw.filter(filePath => {
            const ext = path.extname(filePath).toLowerCase();
            return allowedExtensions.includes(ext);
        }).map(filePath => {
            return {
                name: path.basename(filePath), // Pega só o nome do arquivo
                fullPath: filePath.replace(/\\/g, '/')
            };
        });

        renderGrid(allMediaFiles);
        
    } catch (error) {
        resultsGrid.innerHTML = `<p class="placeholder-text">Erro ao ler: ${error.message}</p>`;
    }
});

function renderGrid(filesToRender) {
    resultsGrid.innerHTML = ''; 

    if (filesToRender.length === 0) {
        resultsGrid.innerHTML = '<p class="placeholder-text">Nenhum arquivo de mídia encontrado na busca.</p>';
        return;
    }

    filesToRender.forEach(file => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'media-item';

        const ext = path.extname(file.name).toLowerCase();
        let player;

        // Se for vídeo, cria a tag <video>, senão, cria <audio>
        if (ext === '.mp4' || ext === '.mov') {
            player = document.createElement('video');
            player.className = 'media-video';
        } else {
            player = document.createElement('audio');
        }
        
        player.controls = true;
        player.src = "file://" + file.fullPath; 

        const titleSpan = document.createElement('span');
        titleSpan.className = 'media-title';
        titleSpan.innerText = file.name;

        const btnInsert = document.createElement('button');
        btnInsert.className = 'btn-insert';
        btnInsert.innerText = 'Inserir na Timeline';
        
        btnInsert.addEventListener('click', () => {
            csInterface.evalScript(`importarArquivo("${file.fullPath}")`);
        });

        itemDiv.appendChild(titleSpan);
        itemDiv.appendChild(player);
        itemDiv.appendChild(btnInsert);

        resultsGrid.appendChild(itemDiv);
    });
}

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredFiles = allMediaFiles.filter(file => 
        file.name.toLowerCase().includes(searchTerm)
    );
    renderGrid(filteredFiles);
});

// Inicializa os favoritos quando o plugin carregar
renderFavorites();