// 1. Variável global compartilhada entre as páginas
window.deferredPrompt = window.deferredPrompt || null;

// 2. Registra o Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('Service Worker ativo:', reg.scope))
      .catch((err) => console.error('Erro no Service Worker:', err));
  });
}

// 3. Captura a autorização do Chrome/Android assim que o app carrega
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.deferredPrompt = e;
  console.log('PWA liberado para instalação!');
});

// 4. Função que ativa o clique do botão em qualquer página
function conectarBotaoInstalacao() {
  // Procura por qualquer um dos dois IDs possíveis
  const btn = document.getElementById('btn-instalar') || document.getElementById('install-btn');

  if (btn) {
    btn.onclick = async () => {
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

      if (window.deferredPrompt) {
        window.deferredPrompt.prompt();
        const { outcome } = await window.deferredPrompt.userChoice;
        console.log(`Escolha do usuário: ${outcome}`);
        window.deferredPrompt = null;
      } else if (isSafari) {
        alert(
          'No Safari (iOS/Mac), a instalação é feita pelo menu nativo:\n\n' +
          '1. Toque no ícone de Compartilhar\n' +
          '2. Selecione "Adicionar à Tela de Início"'
        );
      } else {
        alert(
          'A instalação não está liberada no momento.\n\n' +
          'Verifique:\n' +
          '1. O app já está instalado no celular?\n' +
          '2. Você está acessando via HTTPS?\n' +
          '3. Aguarde alguns segundos e tente novamente.'
        );
      }
    };
  }
}

// Tenta conectar o botão assim que o HTML da página atual estiver pronto
document.addEventListener('DOMContentLoaded', conectarBotaoInstalacao);
