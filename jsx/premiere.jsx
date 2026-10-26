// jsx/premiere.jsx

function importarArquivo(caminhoDoArquivo) {
    if (!app.project) {
        alert("Por favor, abra ou crie um projeto primeiro.");
        return;
    }

    var arrayDeImportacao = [caminhoDoArquivo];
    var binDestino = app.project.getInsertionBin();
    
    app.project.importFiles(arrayDeImportacao, 1, binDestino, 0);

    var nomeDoArquivo = caminhoDoArquivo.split('/').pop().split('\\').pop();
    var arquivoImportado = null;

    for (var i = 0; i < binDestino.children.numItems; i++) {
        if (binDestino.children[i].name === nomeDoArquivo) {
            arquivoImportado = binDestino.children[i];
            break;
        }
    }

    if (!arquivoImportado) {
        alert("Erro: Arquivo não encontrado no painel Projeto.");
        return;
    }

    var sequenciaAtiva = app.project.activeSequence;
    
    if (sequenciaAtiva) {
        var posicaoDaAgulhaTicks = sequenciaAtiva.getPlayerPosition().ticks;
        
        var duracaoClipeTicks = "0";
        if (arquivoImportado.getOutPoint) {
            var outPoint = arquivoImportado.getOutPoint();
            var inPoint = arquivoImportado.getInPoint();
            duracaoClipeTicks = String(parseInt(outPoint.ticks, 10) - parseInt(inPoint.ticks, 10));
        }

        try {
            function buscarTrackLivre(tracks, tempoAgulha, duracao) {
                var inicioNovo = parseInt(tempoAgulha, 10);
                var fimNovo = inicioNovo + parseInt(duracao, 10);
                
                for (var i = 0; i < tracks.numTracks; i++) {
                    var track = tracks[i];
                    var ocupada = false;
                    
                    for (var c = 0; c < track.clips.numItems; c++) {
                        var clip = track.clips[c];
                        var inicioExistente = parseInt(clip.start.ticks, 10);
                        var fimExistente = parseInt(clip.end.ticks, 10);
                        
                        if (inicioNovo < fimExistente && fimNovo > inicioExistente) {
                            ocupada = true;
                            break; 
                        }
                    }
                    if (!ocupada) return i; 
                }
                return -1; 
            }

            var nomeLow = nomeDoArquivo.toLowerCase();
            var ehVideo = (nomeLow.indexOf('.mp4') !== -1 || nomeLow.indexOf('.mov') !== -1);

            // CORREÇÃO AQUI: Executa a inserção apenas UMA VEZ dependendo do tipo do arquivo
            if (ehVideo) {
                // É VÍDEO: Insere na track de vídeo (o Premiere puxará o áudio correspondente automaticamente)
                var vTrack = buscarTrackLivre(sequenciaAtiva.videoTracks, posicaoDaAgulhaTicks, duracaoClipeTicks);
                if (vTrack !== -1) {
                    sequenciaAtiva.videoTracks[vTrack].overwriteClip(arquivoImportado, posicaoDaAgulhaTicks);
                } else {
                    alert("Aviso: Todas as tracks de VÍDEO têm bloqueios neste trecho!");
                }
            } else {
                // É APENAS ÁUDIO: Insere na track de áudio
                var aTrack = buscarTrackLivre(sequenciaAtiva.audioTracks, posicaoDaAgulhaTicks, duracaoClipeTicks);
                if (aTrack !== -1) {
                    sequenciaAtiva.audioTracks[aTrack].overwriteClip(arquivoImportado, posicaoDaAgulhaTicks);
                } else {
                    alert("Aviso: Todas as tracks de ÁUDIO têm bloqueios neste trecho! Adicione uma nova track.");
                }
            }

        } catch (erro) {
            alert("Erro ao jogar na Timeline: " + erro.toString());
        }
    } else {
        alert("Arquivo importado! Abra uma Timeline para inseri-lo automaticamente.");
    }
}