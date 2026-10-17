import { DINOS, COMING, VERIFIED, PATCH } from "./dinos.js";
import { MUTATIONS, HORDETEST, RULES, canUse, slotsFor } from "./mutations.js";

/* ---------- Discord handshake (only runs inside a Discord Activity) ---------- */
(function discordHandshake() {
  const p = new URLSearchParams(location.search);
  const frameId = p.get("frame_id");
  const clientId = document.querySelector('meta[name="discord-client-id"]')?.content;
  if (!frameId || !clientId || clientId.startsWith("PUT_")) return;
  const target = window.parent.opener ?? window.parent;
  window.addEventListener("message", (e) => {
    const [op, data] = Array.isArray(e.data) ? e.data : [];
    if (op === 1 && data?.evt === "READY") document.body.classList.add("in-discord");
  });
  target.postMessage([0, { v: 1, encoding: "json", client_id: clientId, frame_id: frameId }], "*");
})();

/* ---------- helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const DIET_ICON = { Carnivore: "🥩", Herbivore: "🌿", Omnivore: "🍽️" };
const DIFF_CLASS = { Easy: "easy", Medium: "med", Hard: "hard" };
const mutByName = Object.fromEntries(MUTATIONS.map((m) => [m.name, m]));
const baseName = (s) => s.replace(/\s*\(.*\)$/, "");

const state = { tab: "dinos", q: "", diet: "All", dino: null, build: { dino: "rex", prime: false, slots: ["", "", "", ""] } };

/* ---------- views ---------- */
function dinoCard(d) {
  return `<button class="card" style="--c:${d.color}" data-dino="${d.id}">
    <div class="card-emoji">${d.emoji}</div>
    <div class="card-body">
      <div class="card-name">${esc(d.name)}</div>
      <div class="card-role">${esc(d.role)}</div>
      <div class="chips">
        <span class="chip">${DIET_ICON[d.diet]} ${d.diet}</span>
        <span class="chip ${DIFF_CLASS[d.difficulty]}">${d.difficulty}</span>
        <span class="chip">👥 ${d.stats.group}</span>
      </div>
    </div></button>`;
}

function viewDinos() {
  const q = state.q.toLowerCase();
  const list = DINOS.filter((d) =>
    (state.diet === "All" || d.diet === state.diet) &&
    (!q || [d.name, d.nick, d.role, d.diet, d.about].join(" ").toLowerCase().includes(q)));
  const diets = ["All", "Carnivore", "Herbivore", "Omnivore"];
  return `
    <div class="filters">${diets.map((x) => `<button class="pill ${state.diet === x ? "on" : ""}" data-diet="${x}">${x === "All" ? "🦴 All" : DIET_ICON[x] + " " + x}</button>`).join("")}</div>
    <div class="grid">${list.map(dinoCard).join("") || `<p class="empty">No dino found for "${esc(state.q)}".</p>`}</div>
    <div class="coming"><b>🥚 Coming soon (not playable on live):</b> ${COMING.map(([n, s]) => `${n} <span class="muted">(${s})</span>`).join(", ")}</div>`;
}

function list(items) { return `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`; }

function viewDino(d) {
  const s = d.stats;
  const stat = (k, v) => `<div class="stat"><div class="stat-k">${k}</div><div class="stat-v">${esc(v)}</div></div>`;
  return `
  <div class="detail" style="--c:${d.color}">
    <button class="back" data-back>← All dinos</button>
    <header class="hero">
      <div class="hero-emoji">${d.emoji}</div>
      <div>
        <h2>${esc(d.name)} <span class="muted">"${esc(d.nick)}"</span></h2>
        <div class="chips"><span class="chip">${DIET_ICON[d.diet]} ${d.diet}</span><span class="chip">${esc(d.role)}</span><span class="chip ${DIFF_CLASS[d.difficulty]}">Beginner: ${d.difficulty}</span></div>
        <p>${esc(d.about)}</p>
      </div>
    </header>
    <div class="stats">${stat("⚖️ Max weight", s.weight)}${stat("💨 Max speed", s.speed)}${stat("🦷 Bite force", s.bite)}${stat("👥 Max group", s.group)}${stat("⏳ Growth", s.growth)}</div>
    <p class="note">Max values for an adult. They change with growth, Prime or Frail elder, and server settings.</p>

    <section class="box"><h3>🍖 What it eats</h3><p>${esc(d.food)}</p></section>
    <section class="box"><h3>🎮 Controls & abilities</h3>
      <table class="keys">${d.abilities.map(([k, n, t]) => `<tr><td><kbd>${esc(k)}</kbd></td><td><b>${esc(n)}</b><br><span class="muted">${esc(t)}</span></td></tr>`).join("")}</table>
      <p class="note">Default keys. Alternate attack settings can change them.</p></section>
    <div class="two">
      <section class="box good"><h3>💪 Strengths</h3>${list(d.strengths)}</section>
      <section class="box bad"><h3>⚠️ Weaknesses</h3>${list(d.weaknesses)}</section>
    </div>
    <div class="two">
      <section class="box"><h3>✅ Tips</h3>${list(d.tips)}</section>
      <section class="box"><h3>❌ Common mistakes</h3>${list(d.mistakes)}</section>
    </div>
    <section class="box"><h3>🎯 Watch out for</h3><p>${esc(d.counters)}</p></section>
    <section class="box build"><h3>🧬 Suggested mutations</h3>
      ${d.build.map(([n, why]) => { const m = mutByName[baseName(n)]; return `<div class="mut"><b>${esc(n)}</b>${m?.value ? ` <span class="chip">${m.value}</span>` : ""}${m?.type === "unlock" ? ` <span class="chip unlock">🔓 unlock</span>` : ""}<div class="muted">${esc(why)}</div></div>`; }).join("")}
      <p class="note">Our picks based on how this dino plays. You only get random options in game, so take what's close.</p>
      <button class="btn" data-try="${d.id}">Try it in the builder →</button>
    </section>
    <p class="note">Checked ${VERIFIED} for patch ${PATCH}. Sources: ${d.sources.map((u) => `<a href="${u}" target="_blank" rel="noopener">${new URL(u).hostname}</a>`).join(", ")}</p>
  </div>`;
}

function mutRow(m) {
  const who = { All: "Everyone", Carnivore: "🥩 Carnivores", Herbivore: "🌿 Herbivores", HerbOmni: "🌿🍽️ Herbivores & omnivores" }[m.diet];
  const tags = [
    m.type === "slot2" && `<span class="chip">Slot 2 only</span>`,
    m.type === "unlock" && `<span class="chip unlock">🔓 Slots ${m.slots.join("/")}</span>`,
    m.female && `<span class="chip">♀ Female</span>`,
    m.leader && `<span class="chip">👑 Leader</span>`,
    m.noInherit && `<span class="chip">Not inherited</span>`,
  ].filter(Boolean).join("");
  return `<div class="mrow"><div class="mhead"><b>${esc(m.name)}</b>${m.value ? `<span class="chip">${m.value}</span>` : ""}</div>
    <div>${esc(m.effect)}</div>
    <div class="chips"><span class="chip">${who}</span>${tags}</div>
    ${m.unlock ? `<div class="muted">How to unlock: ${esc(m.unlock)}</div>` : ""}</div>`;
}

function viewMutations() {
  const q = state.q.toLowerCase();
  const f = MUTATIONS.filter((m) => !q || (m.name + " " + m.effect).toLowerCase().includes(q));
  const group = (t, title) => { const g = f.filter((m) => m.type === t); return g.length ? `<h3 class="sec">${title}</h3>${g.map(mutRow).join("")}` : ""; };
  return `
    ${group("life", "Normal pool")}${group("slot2", "Slot 2 extras")}${group("unlock", "🔓 Unlockable")}
    ${!f.length ? `<p class="empty">No mutation found.</p>` : ""}
    <h3 class="sec">🧪 Hordetest only (not on live)</h3>${HORDETEST.map(([n, e]) => `<div class="mrow"><b>${n}</b><div>${e}</div></div>`).join("")}
    <p class="note">Values are the last published defaults. The devs changed some in Oct 2025 without posting new numbers, and servers can change them too.<br>Sources: <a href="https://www.theisle.info/guide/mutations" target="_blank">theisle.info</a>, <a href="https://supercraft.host/wiki/the-isle/mutations_and_entombing/" target="_blank">supercraft.host</a>. Checked ${VERIFIED}.</p>`;
}

function viewBuilder() {
  const b = state.build;
  const d = DINOS.find((x) => x.id === b.dino);
  const n = b.prime ? 4 : 3;
  const picked = b.slots.slice(0, n);
  const label = ["Slot 1 · Juvenile", "Slot 2 · Sub-adult", "Slot 3 · Adult", "Slot 4 · Prime Elder"];
  const slotSel = (i) => {
    const opts = MUTATIONS.filter((m) => canUse(m, d.diet) && slotsFor(m).includes(i + 1));
    return `<label class="slot"><span>${label[i]}</span>
      <select data-slot="${i}"><option value="">— pick —</option>${opts.map((m) => `<option ${picked[i] === m.name ? "selected" : ""} ${picked.includes(m.name) && picked[i] !== m.name ? "disabled" : ""}>${esc(m.name)}</option>`).join("")}</select></label>`;
  };
  const chosen = picked.filter(Boolean).map((x) => mutByName[x]);
  const warn = [];
  if (chosen.some((m) => m.female)) warn.push("♀ You picked a female-only mutation.");
  if (chosen.some((m) => m.leader)) warn.push("👑 Social Behavior only works if you lead the group.");
  if (chosen.some((m) => m.type === "unlock")) warn.push("🔓 Some picks must be unlocked first.");
  const text = `🧬 ${d.name} build: ` + (chosen.length ? chosen.map((m) => m.name).join(" + ") : "(empty)");
  return `
  <div class="builder" style="--c:${d.color}">
    <label class="slot"><span>Dino</span><select data-bdino>${DINOS.map((x) => `<option value="${x.id}" ${x.id === b.dino ? "selected" : ""}>${x.emoji} ${esc(x.name)}</option>`).join("")}</select></label>
    <label class="toggle"><input type="checkbox" data-prime ${b.prime ? "checked" : ""}> 👑 Prime Elder (4th slot)</label>
    <div class="slots">${Array.from({ length: n }, (_, i) => slotSel(i)).join("")}</div>
    <div class="row"><button class="btn" data-roll>🎲 Random challenge build</button><button class="btn ghost" data-suggest>⭐ Load suggested</button><button class="btn ghost" data-clear>Clear</button></div>
    ${chosen.length ? `<section class="box"><h3>What your build does</h3>${chosen.map(mutRow).join("")}</section>` : `<p class="muted">Pick mutations above to see what they do.</p>`}
    ${warn.length ? `<div class="warn">${warn.join("<br>")}</div>` : ""}
    <section class="box"><h3>📋 Share it</h3><textarea readonly rows="2" onclick="this.select()">${esc(text)}</textarea><p class="note">Tap the box, copy, paste in chat.</p></section>
    <p class="note">The builder only shows mutations your dino's diet can get, in the slots they can appear in. In game the options are random.</p>
  </div>`;
}

function viewRules() {
  return `
  <section class="box"><h3>🧬 How mutations work</h3>${list(RULES)}</section>
  <section class="box"><h3>👑 Prime vs Frail Elder</h3><ul>
    <li><b>Prime:</b> finish 5 of 8 goals before 75% growth (small dinos may need 4). Goals include visiting a sanctuary, getting a perfect diet once, visiting 2 migration or 4 patrol zones, avoiding infertility and muscle spasms, raising a baby to 50%, and being born from an egg.</li>
    <li>Prime gets a 4th mutation slot. Stats peak around 87% growth, then slowly drop.</li>
    <li><b>Frail:</b> you missed the goals. Weaker than a normal adult.</li>
    <li>Entombing at elder restarts you as a juvenile and keeps your mutations, boosted.</li></ul></section>
  <section class="box"><h3>🥚 Nesting quick steps</h3><ol>
    <li>Find a mate of the same species and opposite sex. Leave your groups.</li>
    <li>Face each other. Male holds <kbd>N</kbd>, then female presses <kbd>N</kbd>.</li>
    <li>Male picks a spot and builds the nest with <kbd>B</kbd>.</li>
    <li>Female lays eggs on the nest with <kbd>E</kbd>. Eat and drink well first, eggs cost nutrients.</li>
    <li>Stand in front to cool (more males), lie on it to warm (more females).</li>
    <li>Feed hatchlings. At about 20% growth they need to eat on their own.</li>
    <li>Destroy the nest and leftover eggs after hatching so predators can't track it.</li></ol></section>
  <p class="note">Sources: <a href="https://www.theisle-game.com/en/guides/elder-system-guide-frail-prime-elder" target="_blank">Elder guide</a>, <a href="https://www.theisle-game.com/en/info/nesting-guide" target="_blank">Nesting guide</a>. Checked ${VERIFIED}.</p>`;
}

/* ---------- render ---------- */
function render() {
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("on", t.dataset.tab === state.tab));
  $("#search").style.display = state.tab === "dinos" || state.tab === "mutations" ? "" : "none";
  $("#search").placeholder = state.tab === "mutations" ? "Search mutations…" : "Search dinos…";
  const main = $("#main");
  if (state.tab === "dinos") main.innerHTML = state.dino ? viewDino(DINOS.find((d) => d.id === state.dino)) : viewDinos();
  else if (state.tab === "mutations") main.innerHTML = viewMutations();
  else if (state.tab === "builder") main.innerHTML = viewBuilder();
  else main.innerHTML = viewRules();
}

function suggested(id) {
  const d = DINOS.find((x) => x.id === id);
  const names = d.build.map(([n]) => baseName(n)).filter((n) => mutByName[n]);
  const slots = ["", "", "", ""];
  // place slot-2-only picks first, then fill the rest where allowed
  const order = [...names].sort((a, b) => (slotsFor(mutByName[a]).length - slotsFor(mutByName[b]).length));
  for (const n of order) {
    const i = slotsFor(mutByName[n]).map((s) => s - 1).find((s) => !slots[s]);
    if (i !== undefined) slots[i] = n;
  }
  return slots;
}

document.addEventListener("click", (e) => {
  const t = e.target.closest("button, [data-tab]");
  if (!t) return;
  if (t.dataset.tab) { state.tab = t.dataset.tab; state.dino = null; state.q = ""; $("#search").value = ""; render(); scrollTo(0, 0); }
  else if (t.dataset.dino) { state.dino = t.dataset.dino; render(); scrollTo(0, 0); }
  else if (t.hasAttribute("data-back")) { state.dino = null; render(); }
  else if (t.dataset.diet) { state.diet = t.dataset.diet; render(); }
  else if (t.dataset.try) { state.tab = "builder"; state.build = { dino: t.dataset.try, prime: true, slots: suggested(t.dataset.try) }; render(); scrollTo(0, 0); }
  else if (t.hasAttribute("data-suggest")) { state.build.prime = true; state.build.slots = suggested(state.build.dino); render(); }
  else if (t.hasAttribute("data-clear")) { state.build.slots = ["", "", "", ""]; render(); }
  else if (t.hasAttribute("data-roll")) {
    const d = DINOS.find((x) => x.id === state.build.dino);
    const n = state.build.prime ? 4 : 3, slots = ["", "", "", ""];
    for (let i = 0; i < n; i++) {
      const pool = MUTATIONS.filter((m) => canUse(m, d.diet) && slotsFor(m).includes(i + 1) && !slots.includes(m.name));
      slots[i] = pool[Math.floor(Math.random() * pool.length)].name;
    }
    state.build.slots = slots; render();
  }
});

document.addEventListener("change", (e) => {
  const t = e.target;
  if (t.dataset.slot !== undefined) { state.build.slots[+t.dataset.slot] = t.value; render(); }
  else if (t.hasAttribute("data-bdino")) {
    const d = DINOS.find((x) => x.id === t.value);
    state.build.dino = t.value;
    state.build.slots = state.build.slots.map((n, i) => (n && canUse(mutByName[n], d.diet) && slotsFor(mutByName[n]).includes(i + 1) ? n : ""));
    render();
  } else if (t.hasAttribute("data-prime")) { state.build.prime = t.checked; if (!t.checked) state.build.slots[3] = ""; render(); }
});

$("#search").addEventListener("input", (e) => {
  state.q = e.target.value; if (state.tab === "dinos") state.dino = null; render();
  const s = $("#search"); s.focus();
});

$("#footer").textContent = `Checked ${VERIFIED} · Evrima patch ${PATCH} · ${DINOS.length} playable dinos · Fan-made, not affiliated with Afterthought.`;
render();
