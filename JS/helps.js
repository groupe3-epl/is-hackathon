// Helps assistant (FAQ / chat)

const helpMessagesEl = document.getElementById('help-messages');
const helpForm = document.getElementById('help-form');
const helpInput = document.getElementById('help-input');
const helpChips = document.getElementById('help-chips');
const helpClearBtn = document.getElementById('help-clear');

const STORAGE_KEY = 'skilldev_helps_history_v1';

const HELP_KB = [
  {
    keywords: ['quiz', 'question', 'niveau', 'score'],
    answer:
      "Pour jouer au Quiz Challenge : va dans la section Jeux Populaires puis clique sur le bouton Play du quiz. Choisis un niveau (Facile/Moyen/Difficile) et réponds aux questions avant la fin du chrono."
  },
  {
    keywords: ['tasse', 'gobelet', 'cup'],
    answer:
      "Pour le Jeu de Tasse : ouvre Jeu de Tasse depuis le menu, lis les instructions (bouton Aide) et lance une partie. Le but est de trouver la bonne tasse en observant rapidement."
  },
  {
    keywords: ['pierre', 'papier', 'ciseaux', 'shifumi'],
    answer:
      "Pierre / Papier / Ciseaux : clique sur le jeu dans le menu, puis choisis ton coup. La règle est simple : Pierre bat Ciseaux, Ciseaux bat Papier, Papier bat Pierre."
  },
  {
    keywords: ['batonnet', 'bâtonnet', 'batonnets'],
    answer:
      "Le Jeu de Bâtonnet est un jeu de stratégie : chacun retire des bâtonnets à tour de rôle. L’objectif est d’éviter (ou forcer) la dernière prise selon les règles de la page."
  },
  {
    keywords: ['cadeau', 'cadeaux', 'noël', 'noel'],
    answer:
      "Allez et decouvrez"
  },
  {
    keywords: ['id', 'profil', 'compte', 'connexion', 'inscription'],
    answer:
      "La page ID sert à afficher/mettre à jour des infos de profil. Tu peux t’inscrire/te connecter (selon les écrans) et consulter tes infos."
  },
  {
    keywords: ['outil', 'étudiant', 'ressource', 'apprendre', 'cours'],
    answer:
      "La page Outils Étudiant regroupe des ressources (ex: web, IA, vidéos) pour apprendre et progresser. Tu peux cliquer sur une ressource pour l’ouvrir."
  }
];

const normalize = (text) =>
  (text || '')
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const renderInlineMarkdown = (text) => {
  const safe = (text || '').toString();
  // bold: **text**
  return safe.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};

const readHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }

  if (helpClearBtn) {
    helpClearBtn.addEventListener('click', () => {
      clearConversation();
    });
  }
};

const writeHistory = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore storage errors
  }
};

const history = readHistory();

const addHelpMessage = (role, text, { persist = true } = {}) => {
  if (!helpMessagesEl) return;
  const div = document.createElement('div');
  div.className = `help-msg help-msg--${role}`;
  div.innerHTML = renderInlineMarkdown(text);

  // Copy button on bot messages
  if (role === 'bot') {
    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'help-msg__copy';
    copyBtn.title = 'Copier';
    copyBtn.setAttribute('aria-label', 'Copier');
    copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText((text || '').toString());
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
        window.setTimeout(() => {
          copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
        }, 900);
      } catch {
        // ignore
      }
    });
    div.appendChild(copyBtn);
  }

  helpMessagesEl.appendChild(div);
  helpMessagesEl.scrollTop = helpMessagesEl.scrollHeight;

  if (persist) {
    history.push({ role, text });
    writeHistory(history);
  }
};

const clearConversation = () => {
  if (!helpMessagesEl) return;
  helpMessagesEl.innerHTML = '';
  history.splice(0, history.length);
  writeHistory(history);
  addHelpMessage('bot', 'Salut ! Pose-moi une question sur le site (jeux, cadeaux, ID, outils étudiant).', { persist: true });
};

const findBestAnswer = (question) => {
  const q = normalize(question);
  if (!q) return null;

  let best = null;
  for (const entry of HELP_KB) {
    const score = entry.keywords.reduce((acc, kw) => {
      const needle = normalize(kw);
      return acc + (needle && q.includes(needle) ? 1 : 0);
    }, 0);

    if (score > 0 && (!best || score > best.score)) {
      best = { score, answer: entry.answer };
    }
  }

  return best ? best.answer : null;
};

const answerFallback = () =>
  "Je n’ai pas compris à 100%. Essaye une de ces questions portant sur quiz, tasse, cadeaux, id et outils étudiant.";

const initHelpsAssistant = () => {
  if (!helpMessagesEl || !helpForm || !helpInput) return;

  // Restore history or greet
  if (history.length > 0) {
    for (const item of history) {
      if (!item || !item.role) continue;
      addHelpMessage(item.role, item.text, { persist: false });
    }
  } else {
    addHelpMessage('bot', 'Salut ! Pose-moi une question sur le site (jeux, cadeaux, ID, outils étudiant).');
  }

  helpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const cleaned = (helpInput.value || '').trim();
    if (!cleaned) return;

    addHelpMessage('user', cleaned);
    helpInput.value = '';

    const answer = findBestAnswer(cleaned) || answerFallback();
    window.setTimeout(() => addHelpMessage('bot', answer), 220);
  });

  if (helpChips) {
    helpChips.addEventListener('click', (e) => {
      const btn = e.target.closest('.help-chip');
      if (!btn) return;
      const q = btn.getAttribute('data-question') || btn.textContent;
      if (!q) return;
      helpInput.value = q;
      helpInput.focus();
      helpForm.requestSubmit();
    });
  }
};

initHelpsAssistant();
