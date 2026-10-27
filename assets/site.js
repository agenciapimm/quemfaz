// Banner de cookies (LGPD). Compartilhado pelas LPs e pela 404.
// Scripts de terceiros (pixel, tag) só devem carregar depois do aceite: escute o evento
// "cookieconsent" (detail.aceito) num script colocado ANTES deste no HTML.
(function () {
  var CHAVE = 'qf-consentimento';
  var escolha = null;
  var banner;

  try { escolha = localStorage.getItem(CHAVE); } catch (e) {}

  function avisar() {
    document.dispatchEvent(new CustomEvent('cookieconsent', { detail: { aceito: escolha === 'aceito' } }));
  }

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
