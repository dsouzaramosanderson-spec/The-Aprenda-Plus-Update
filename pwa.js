let deferredPrompt = null;

// Regista o Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('Service Worker registado com sucesso:', reg.scope))
      .catch((err) => console.error('Falha ao registar o Service Worker:', err));
  });
}

// Captura o evento de instalação nativo (Chrome / Android / Edge)
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('Evento beforeinstallprompt capturado!');
});

// Evento ao clicar no botão
document.addEventListener('DOMContentLoaded', () => {
  const installButton = document.getElementById('install-btn');

  if (!installButton) {
    console.error('Botão com id "install-btn" não foi encontrado no HTML.');
    return;
  }

  installButton.addEventListener('click', async () => {
    // Detecta Safari / iOS
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (deferredPrompt) {
      // Dispara o prompt de instalação nativo no Android / Desktop
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`Resultado da escolha: ${outcome}`);
      deferredPrompt = null;
    } else if (isSafari) {
      alert(
        'No Safari (iOS/Mac), a instalação é feita pelo menu nativo:\n\n' +
        '1. Clique no ícone de Compartilhar (ou menu Arquivo no Mac)\n' +
        '2. Escolha "Adicionar à Tela de Início" ou "Adicionar ao Dock"'
      );
    } else {
      alert('A instalação não está disponível no momento. Verifique se o app já está instalado ou acesse via HTTPS.');
    }
  });
});
