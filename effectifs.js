document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('squad-container');

  async function loadPlayers() {
    // try inline JSON first (useful when opening file:// or when fetch blocked)
    try {
      const inline = document.getElementById('players-data');
      if (inline) {
        try {
          const parsed = JSON.parse(inline.textContent || inline.innerText || '{}');
          if (parsed && Array.isArray(parsed.players) && parsed.players.length) return parsed.players;
        } catch (e) {
          // ignore parse error and fallback to fetch
        }
      }
      const res = await fetch('data/players.json', { cache: 'no-store' });
      if (!res.ok) throw new Error(res.status + ' ' + res.statusText);
      const data = await res.json();
      return (data && Array.isArray(data.players)) ? data.players : [];
    } catch (e) {
      console.error('Erreur chargement joueurs', e);
      return [];
    }
  }

  function groupByRole(players) {
    const roles = { Gardien: [], Défenseur: [], Milieu: [], Attaquant: [] };
    players.forEach(p => {
      const pos = (p.position || '').toLowerCase();
      if (pos.includes('gard')) roles.Gardien.push(p);
      else if (pos.includes('défen') || pos.includes('defen') || pos.includes('défenseur') || pos.includes('déf')) roles.Défenseur.push(p);
      else if (pos.includes('milieu') || pos.includes('mili')) roles.Milieu.push(p);
      else if (pos.includes('atta') || pos.includes('ail') || pos.includes('avant')) roles.Attaquant.push(p);
      else roles.Milieu.push(p); // fallback
    });
    return roles;
  }

  function createRoleSection(title, players) {
    const section = document.createElement('section');
    section.className = 'section';
    const h = document.createElement('h3'); h.textContent = `${title} (${players.length})`;
    section.appendChild(h);
    if (players.length === 0) {
      const p = document.createElement('p'); p.className = 'muted'; p.textContent = 'Aucun joueur.'; section.appendChild(p); return section;
    }
    // create a cards grid — each player gets a card with photo, short text and CTA
    const grid = document.createElement('div');
    grid.className = 'grid grid-2 teams';
    grid.style.alignItems = 'stretch';

    players.forEach(p => {
      const art = document.createElement('article');
      art.className = 'teams article';
      art.style.display = 'flex';
      art.style.flexDirection = 'column';
      art.style.alignItems = 'center';
      art.innerHTML = `
        <img src="${p.photo}" alt="Photo de ${p.name}" loading="lazy" style="width:100%;height:180px;object-fit:cover;border-radius:10px;margin-bottom:12px">
        <div style="padding:6px 8px;text-align:center;flex:1;display:flex;flex-direction:column;justify-content:space-between;">
          <div>
            <h4 style="margin:0 0 6px">${p.name}</h4>
            <p class="muted" style="margin:0 0 8px">${p.position} • #${p.number} • ${p.age} ans</p>
            <p style="margin:0 0 12px">${p.short}</p>
          </div>
          <div style="margin-top:12px">
            <a href="joueurs.html#${p.id}" class="btn-small" aria-label="En savoir plus sur ${p.name}">En savoir plus</a>
          </div>
        </div>
      `;
      grid.appendChild(art);
    });
    section.appendChild(grid);
    return section;
  }

  (async function init() {
    const players = await loadPlayers();
    if (!players || players.length === 0) {
      container.innerHTML = '<p class="muted">Effectif non disponible pour le moment.</p>';
      return;
    }

    const grouped = groupByRole(players);
    container.innerHTML = '';
    container.appendChild(createRoleSection('Gardiens', grouped.Gardien));
    container.appendChild(createRoleSection('Défenseurs', grouped.Défenseur));
    container.appendChild(createRoleSection('Milieux', grouped.Milieu));
    container.appendChild(createRoleSection('Attaquants', grouped.Attaquant));
  })();
});
