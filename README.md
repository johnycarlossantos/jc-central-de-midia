# JC Central de Mídia

Um painel de extensão para Adobe Premiere Pro que otimiza a organização, pesquisa e inserção de trilhas sonoras e efeitos na timeline, criado para acelerar o fluxo de trabalho de edição.

## 🚀 Funcionalidades Principais

* **Navegação Local Integrada:** Carregue as suas pastas de efeitos e músicas diretamente no Premiere, incluindo subpastas.
* **Preview Nativo:** Ouça áudios (.mp3, .wav, .aac, .m4a) e assista a vídeos (.mp4, .mov) dentro do próprio painel antes de importar.
* **Pastas Favoritas:** Guarde os seus diretórios mais utilizados (como "Trilhas" ou "SFX") e acesse-os com apenas um clique através da memória local do painel.
* **Inserção Inteligente Anti-Colisão:** O script analisa a timeline e insere automaticamente a mídia na primeira track de áudio ou vídeo livre, protegendo o seu trabalho e as suas Camadas de Ajuste de serem sobrescritas.

## 📦 Como Instalar (Para Utilizadores)

1. Faça o download da versão mais recente do ficheiro `JC-Central-de-Midia.zxp`.
2. Como a Adobe descontinuou o seu gestor nativo, instale um gestor de ZXP gratuito, recomendamos o [Anastasiy's Extension Manager](https://install.anastasiy.com/) ou o [ZXPInstaller](https://zxpinstaller.com/).
3. Abra o gestor de extensões e arraste o ficheiro `.zxp` para a janela do programa.
4. Reinicie o Adobe Premiere Pro.

## 🛠️ Como Utilizar

1. No Premiere Pro, acesse o menu superior: **Janela > Extensões > JC-Central-de-Midia**.
2. Clique no ícone de pasta (📁) para selecionar a pasta no seu computador onde guarda as suas mídias.
3. Se quiser guardar essa pasta para o futuro, clique no ícone de estrela (⭐).
4. Utilize a barra de pesquisa para encontrar o som perfeito, ouça o preview e clique em **Inserir na Timeline**. O ficheiro será importado e colocado exatamente onde a agulha da timeline estiver posicionada.

## 💻 Notas para Desenvolvimento
Este plugin foi construído utilizando CEP (Common Extensibility Platform) da Adobe, combinando interface em HTML5/CSS, lógica de varredura de ficheiros com Node.js e automação de timeline via ExtendScript.