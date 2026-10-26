// jsx/premiere.jsx

function importarArquivo(caminhoDoArquivo) {
    if (!app.project) {
        alert("Por favor, abra ou crie um projeto primeiro.");
        return;
    }

    var arrayDeImportacao = [caminhoDoArquivo];
    
    // 1. Pega a pasta (Bin) exata onde o Premiere vai importar o arquivo
    var binDestino = app.project.getInsertionBin();
    
    app.project.importFiles(arrayDeImportacao, 1, binDestino, 0);

    // 2. Extrai apenas o nome do arquivo (ex: "efeito-boom.mp3") para localizá-lo
    var nomeDoArquivo = caminhoDoArquivo.split('/').pop().split('\\').pop();
    var arquivoImportado = null;

    // 3. Procura o arquivo recém-importado dentro da pasta correta
    for (var i = 0; i < binDestino.children.numItems; i++) {
        if (binDestino.children[i].name === nomeDoArquivo) {
            arquivoImportado = binDestino.children[i];
            break;
        }
    }

    if (!arquivoImportado) {
        alert("Erro: Arquivo não encontrado no painel Projeto após importação.");
        return;
    }

    var sequenciaAtiva = app.project.activeSequence;
    
    if (sequenciaAtiva) {
        // 4. Pega o tempo da agulha e extrai os "ticks" (o formato numérico que a track entende)
        var posicaoDaAgulha = sequenciaAtiva.getPlayerPosition().ticks;

        try {
            if (sequenciaAtiva.audioTracks.numTracks > 0) {
                // Insere na track de Áudio 1 (índice 0)
                sequenciaAtiva.audioTracks[0].insertClip(arquivoImportado, posicaoDaAgulha);
            } else {
                alert("Sua timeline não possui canais de áudio para inserir o arquivo.");
            }
        } catch (erro) {
            alert("O Premiere encontrou um erro ao jogar na Timeline: " + erro.toString());
        }
    } else {
        alert("Arquivo importado para o painel Projeto! Abra uma Timeline para inseri-lo automaticamente.");
    }
}