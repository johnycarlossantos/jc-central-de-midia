// jsx/premiere.jsx

function importarArquivo(caminhoDoArquivo) {
    // 1. Verifica se o usuário tem um projeto aberto no Premiere
    if (!app.project) {
        alert("Por favor, abra ou crie um projeto primeiro.");
        return;
    }

    // 2. O Premiere exige que o caminho seja passado dentro de um Array (lista)
    var arrayDeImportacao = [caminhoDoArquivo];
    
    // Importa o arquivo silenciosamente (sem abrir pop-up) para a pasta (bin) padrão
    app.project.importFiles(arrayDeImportacao, 1, app.project.getInsertionBin(), 0);

    // 3. O Premiere coloca o arquivo importado no painel "Projeto".
    // Precisamos capturar esse arquivo (geralmente é o último item adicionado à raiz)
    var raizDoProjeto = app.project.rootItem;
    var arquivoImportado = raizDoProjeto.children[raizDoProjeto.numItems - 1];

    // 4. Verifica se o usuário tem uma Timeline (Sequência) ativa aberta
    var sequenciaAtiva = app.project.activeSequence;
    
    if (sequenciaAtiva) {
        // Pega a posição exata da "agulha" (playhead) na timeline
        var posicaoDaAgulha = sequenciaAtiva.getPlayerPosition();

        // Verifica se o projeto tem tracks de áudio
        if (sequenciaAtiva.audioTracks.numTracks > 0) {
            // Insere o arquivo importado na Track de Áudio 1 (índice 0) na posição da agulha
            // Se quiser que caia na Track 2, basta mudar para audioTracks[1]
            sequenciaAtiva.audioTracks[0].insertClip(arquivoImportado, posicaoDaAgulha);
        } else {
            alert("Sua timeline não possui canais de áudio.");
        }
    } else {
        alert("Arquivo importado para o painel Projeto! Abra uma Timeline para inseri-lo automaticamente.");
    }
}