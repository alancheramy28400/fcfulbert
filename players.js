document.addEventListener('DOMContentLoaded', function () {
  const grid = document.getElementById('players-grid');
  const modal = document.getElementById('player-modal');
  const modalClose = document.getElementById('modal-close');
  const modalPhoto = document.getElementById('modal-photo');
  const modalTitle = document.getElementById('modal-title');
  const modalMeta = document.getElementById('modal-meta');
  const modalBio = document.getElementById('modal-bio');
  const modalAge = document.getElementById('modal-age');
  const modalNumber = document.getElementById('modal-number');
  const modalPosition = document.getElementById('modal-position');

  async function fetchPlayers() {
    try {
      const res = await fetch('data/players.json', { cache: 'no-store' });
      if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
      const data = await res.json();
      return (data && Array.isArray(data.players)) ? data.players : [];
    } catch (e) {
      console.error('Impossible de charger les joueurs', e);
      return [];
    }
  }

  function createCard(player) {
    const art = document.createElement('article');
    art.className = 'teams article';
    art.setAttribute('role', 'listitem');
    art.style.textAlign = 'center';
    art.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;gap:12px">
        <img src="${player.photo}" alt="Photo de ${player.name}" loading="lazy" style="width:180px;height:180px;object-fit:cover;border-radius:12px;">
        <div style="padding:6px 8px;">
          <h3 style="margin:0 0 6px">${player.name}</h3>
          <p class="muted" style="margin:0 0 8px">${player.position} • #${player.number}</p>
          <p style="margin:0 0 12px">${player.short}</p>
          <p><button class="btn-small" data-player-id="${player.id}">En savoir plus</button></p>
        </div>
      </div>
    `;

    // Attach click handler for the button
    art.querySelector('button[data-player-id]').addEventListener('click', function () {
      openModal(player);
    });

    return art;
  }

  function openModal(player) {
    modalPhoto.src = player.photo || 'img/media.jpg';
    modalPhoto.alt = `Photo de ${player.name}`;
    modalTitle.textContent = player.name;
    modalMeta.textContent = `${player.position} • #${player.number}`;
    modalBio.textContent = player.bio || '';
    modalAge.textContent = player.age ? String(player.age) : '—';
    modalNumber.textContent = player.number ? String(player.number) : '—';
    modalPosition.textContent = player.position || '—';

    // show modal
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    // trap focus: focus close button
    modalClose.focus();

    // prevent background scroll
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });

  (async function init() {
    const players = await fetchPlayers();
    if (!players || players.length === 0) {
      grid.innerHTML = '<p class="muted">Aucun joueur disponible pour le moment.</p>';
      return;
    }
    grid.innerHTML = '';
    players.forEach(p => grid.appendChild(createCard(p)));
  })();
});
