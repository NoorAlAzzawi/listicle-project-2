async function renderBossList() {
  const grid = document.getElementById("boss-grid");
  if (!grid) return; // not on the list page

  const res = await fetch("/api/bosses");
  const bosses = await res.json();

  grid.innerHTML = bosses
    .map(
      (b) => `
        <article class="card">
          <img class="card-img" src="${b.image}" alt="${b.name}" />
          <h3>${b.name}</h3>
          <p class="muted">${b.title}</p>
  
          <!--  at least 3 displayed attributes -->
          <p><strong>Location:</strong> ${b.location}</p>
          <p><strong>Difficulty:</strong> ${b.difficulty}</p>
  
          <!--  unique endpoint like /bosses/2 -->
          <a href="/bosses/${b.id}" role="button">Info</a>
        </article>
      `
    )
    .join("");
}

async function renderBossDetail() {
  const detail = document.getElementById("boss-detail");
  if (!detail) return; // not on the detail page

  const id = window.location.pathname.split("/").pop();

  const res = await fetch(`/api/bosses/${id}`);
  if (!res.ok) {
    // if the id doesn't exist, trigger 404
    window.location.href = "/this-route-does-not-exist";
    return;
  }

  const b = await res.json();

  //  includes ALL fields
  detail.innerHTML = `
      <header>
        <h1>${b.name}</h1>
        <p class="muted">${b.title}</p>
      </header>
  
      <img class="detail-img" src="${b.image}" alt="${b.name}" />
  
      <section class="detail-grid">
        <div><strong>ID:</strong><br/>${b.id}</div>
        <div><strong>Location:</strong><br/>${b.location}</div>
        <div><strong>Difficulty:</strong><br/>${b.difficulty}</div>
        <div><strong>Description:</strong><br/>${b.description}</div>
      </section>
    `;
}

renderBossList();
renderBossDetail();
