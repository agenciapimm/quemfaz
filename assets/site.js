// Banner de cookies (LGPD) e eventos de lead para o GTM. Compartilhado pelas LPs e pela 404.
// O Consent Mode começa negado no <head> de cada LP; a escolha no banner atualiza aqui.
(function () {
  var CHAVE = 'qf-consentimento';
  var escolha = null;
  var banner;

  try { escolha = localStorage.getItem(CHAVE); } catch (e) {}

  function avisar() {
    var v = escolha === 'aceito' ? 'granted' : 'denied';
    if (window.gtag) gtag('consent', 'update', { ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v });
    document.dispatchEvent(new CustomEvent('cookieconsent', { detail: { aceito: escolha === 'aceito' } }));
  }

  // Clique em [data-lead="whatsapp"|"site"] vira o evento lead_whatsapp / lead_site no dataLayer.
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-lead]');
    if (!a) return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'lead_' + a.getAttribute('data-lead'),
      lead_id: 'qf-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
      botao: a.id
    });
  });

  function montarBanner() {
    var link = document.querySelector('[data-politica]');
    var politica = link ? link.href : 'https://quemfazservicos.com.br/privacidade';
    banner = document.createElement('div');
    banner.className = 'cookies';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Aviso de cookies');
    banner.innerHTML =
      '<p>Usamos cookies de terceiros para medir o desempenho desta página só se você aceitar. ' +
      'Saiba mais na <a href="' + politica + '" target="_blank" rel="noopener">Política de Privacidade</a>.</p>' +
      '<div class="cookies-botoes">' +
      '<button type="button" data-cookies="recusado">Recusar</button>' +
      '<button type="button" data-cookies="aceito">Aceitar</button>' +
      '</div>';
    banner.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cookies]');
      if (b) escolher(b.getAttribute('data-cookies'));
    });
    document.body.appendChild(banner);
  }

  function mostrar() {
    if (!banner) montarBanner();
    banner.hidden = false;
  }

  function escolher(valor) {
    escolha = valor;
    try { localStorage.setItem(CHAVE, valor); } catch (e) {}
    banner.hidden = true;
    avisar();
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-abrir-cookies]')) mostrar();
  });

  if (escolha) avisar();
  else mostrar();
})();
