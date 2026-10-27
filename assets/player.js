// Player de vídeo próprio, nas cores da marca. Sem JS, o <video> fica com os controles nativos.
(function () {
  var ICONES = {
    play: '<path d="M7 4.5v15l12-7.5z"/>',
    pause: '<path d="M6 4h4v16H6zM14 4h4v16h-4z"/>',
    som: '<path d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"/>',
    mudo: '<path d="M4 9v6h4l5 4V5L8 9H4zm15.6 3 2.1-2.1-1.4-1.4-2.1 2.1-2.1-2.1-1.4 1.4 2.1 2.1-2.1 2.1 1.4 1.4 2.1-2.1 2.1 2.1 1.4-1.4z"/>',
    tela: '<path d="M4 4h6v2H6v4H4zm10 0h6v6h-2V6h-4zM4 14h2v4h4v2H4zm14 0h2v6h-6v-2h4z"/>'
  };

  function svg(nome) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICONES[nome] + '</svg>'; }
  function tempo(s) { s = Math.floor(s || 0); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }

  document.querySelectorAll('[data-player]').forEach(function (p) {
    var v = p.querySelector('video');
    v.removeAttribute('controls');
    p.insertAdjacentHTML('beforeend',
      '<button type="button" class="player-play" aria-label="Assistir o vídeo">' + svg('play') + '</button>' +
      '<div class="player-barra">' +
        '<input type="range" class="player-progresso" min="0" max="1000" step="1" value="0" aria-label="Posição do vídeo">' +
        '<button type="button" class="player-btn" data-acao="tocar" aria-label="Tocar">' + svg('play') + '</button>' +
        '<span class="player-tempo">0:00 / 0:00</span>' +
        '<button type="button" class="player-btn" data-acao="som" aria-label="Tirar o som">' + svg('som') + '</button>' +
        '<button type="button" class="player-btn" data-acao="tela" aria-label="Tela cheia">' + svg('tela') + '</button>' +
      '</div>');

    var grande = p.querySelector('.player-play');
    var barra = p.querySelector('.player-progresso');
    var txt = p.querySelector('.player-tempo');
    var btnTocar = p.querySelector('[data-acao="tocar"]');
    var btnSom = p.querySelector('[data-acao="som"]');
    var btnTela = p.querySelector('[data-acao="tela"]');
    var ocio, estavaOcioso = false;

    function alternar() { if (v.paused || v.ended) v.play(); else v.pause(); }

    // Esconde a barra depois de 2,5 s sem mexer, enquanto toca.
    function acordar() {
      p.classList.remove('ocioso');
      clearTimeout(ocio);
      if (!v.paused) ocio = setTimeout(function () { p.classList.add('ocioso'); }, 2500);
    }

    function atualizarTempo() {
      var pct = v.duration ? v.currentTime / v.duration : 0;
      barra.value = Math.round(pct * 1000);
      barra.style.setProperty('--p', pct * 100 + '%');
      txt.textContent = tempo(v.currentTime) + ' / ' + tempo(v.duration);
    }

    grande.addEventListener('click', alternar);
    btnTocar.addEventListener('click', alternar);
    // No celular, o primeiro toque com a barra escondida só mostra a barra.
    p.addEventListener('pointerdown', function () { estavaOcioso = p.classList.contains('ocioso'); acordar(); });
    p.addEventListener('pointermove', acordar);
    v.addEventListener('click', function () { if (!estavaOcioso) alternar(); });

    v.addEventListener('play', function () {
      p.classList.add('tocando', 'iniciado');
      btnTocar.innerHTML = svg('pause');
      btnTocar.setAttribute('aria-label', 'Pausar');
      acordar();
    });
    v.addEventListener('pause', function () {
      p.classList.remove('tocando');
      btnTocar.innerHTML = svg('play');
      btnTocar.setAttribute('aria-label', 'Tocar');
      acordar();
    });
    v.addEventListener('timeupdate', atualizarTempo);
    v.addEventListener('loadedmetadata', atualizarTempo);
    v.addEventListener('volumechange', function () {
      btnSom.innerHTML = svg(v.muted ? 'mudo' : 'som');
      btnSom.setAttribute('aria-label', v.muted ? 'Ligar o som' : 'Tirar o som');
    });

    barra.addEventListener('input', function () {
      if (v.duration) v.currentTime = barra.value / 1000 * v.duration;
      atualizarTempo();
    });
    btnSom.addEventListener('click', function () { v.muted = !v.muted; });
    btnTela.addEventListener('click', function () {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (p.requestFullscreen) p.requestFullscreen();
      else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen(); // iPhone
    });

    atualizarTempo();
  });
})();
