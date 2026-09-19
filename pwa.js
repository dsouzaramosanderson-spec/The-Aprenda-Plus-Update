// 1. Registra o Service Worker no navegador
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(() => console.log('Service Worker registrado com sucesso!'))
    .catch((err) => console.log('Erro ao registrar Service Worker:', err));
}

// 2. Controla o botão "Instalar o APP"
let eventoInstalacao;
const botaoInstalar = document.getElementById('btn-instalar');

// O navegador avisa quando o PWA está pronto para ser instalado
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); // Evita a barrinha padrão do navegador
  eventoInstalacao = e;
  
  // Mostra o seu botão na tela
  if (botaoInstalar) {
    botaoInstalar.style.display = 'block';
  }
});

// Ação de clicar no botão "Instalar o APP"
if (botaoInstalar) {
  botaoInstalar.addEventListener('click', async () => {
    if (!eventoInstalacao) return;
    
    // Esconde o botão após o clique
    botaoInstalar.style.display = 'none';
    
    // Dispara a janela nativa de instalação do sistema
    eventoInstalacao.prompt();
    
    const resultado = await eventoInstalacao.userChoice;
    console.log(`Resposta do usuário: ${resultado.outcome}`);
    eventoInstalacao = null;
  });
}
