let deferredPrompt;
const installButton = document.getElementById('install-btn');

// Oculta o botão por padrão até o navegador confirmar que pode instalar
if (installButton) {
  installButton.style.display = 'none';
}

// Captura o evento de instalação disparado pelo navegador
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // Exibe o botão na tela
  if (installButton) {
    installButton.style.display = 'block';
  }
});

// Ação de clique no botão
if (installButton) {
  installButton.addEventListener('click', async () => {
    if (!deferredPrompt) {
      alert('O aplicativo já está instalado ou este navegador não suporta a instalação direta.');
      return;
    }

    // Exibe o prompt nativo de instalação
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Resultado do prompt: ${outcome}`);

    // Limpa a variável após o uso
    deferredPrompt = null;
    installButton.style.display = 'none';
  });
}

// Oculta o botão se o app já foi instalado
window.addEventListener('appinstalled', () => {
  console.log('PWA instalado com sucesso!');
  if (installButton) {
    installButton.style.display = 'none';
  }
});
