/* ==========================================
   script.js
   ========================================== */

// 1. 로그인 확인 함수 (아이디: Sheep / 비번: 24152415)
function checkLogin(e) {
    if (e) e.preventDefault();

    const idInput = document.getElementById('login-id');
    const pwInput = document.getElementById('login-pw');
    const msg = document.getElementById('login-msg');

    if (!idInput || !pwInput || !msg) return;

    const id = idInput.value.trim();
    const pw = pwInput.value.trim();

    if (id === 'Sheep' && pw === '24152415') {
        msg.style.color = '#16a34a'; // 성공: 초록색
        msg.innerText = '성공';
    } else {
        msg.style.color = '#dc2626'; // 실패: 빨간색
        msg.innerText = '실패';
    }
}

// 2. 글자 색 바꾸기 함수
const colors = ['#dc2626', '#2563eb', '#16a34a', '#9333ea', '#ea580c', '#000000'];
let colorIdx = 0;
function changeTextColor() {
    colorIdx = (colorIdx + 1) % colors.length;
    const colorText = document.getElementById('color-text');
    if (colorText) {
        colorText.style.color = colors[colorIdx];
    }
}

// 3. 카운터 증가 함수
let clickCount = 0;
function increaseCounter() {
    clickCount++;
    const counterCount = document.getElementById('counter-count');
    if (counterCount) {
        counterCount.innerText = clickCount + '번 클릭';
    }
}

/* 기존 공부 문제 풀이 기능 */
const quizBank = [
    { id: 1, grade: "ele1", subject: "math", question: "[초등 1학년 수학] 5 + 3 은 얼마일까요?", options: ["1) 6", "2) 7", "3) 8", "4) 9"], answer: "3", answerText: "8", explanation: "5에 3을 더하면 8입니다." },
    { id: 2, grade: "ele3", subject: "korean", question: "[초등 3학년 국어] 올바른 맞춤법은?", options: ["1) 감기가 낳았다.", "2) 감기가 낫았다.", "3) 병이 깨끗이 낫았다.", "4) 아기를 낫았다."], answer: "3", answerText: "3", explanation: "'낫다'가 기본형이므로 '낫았다'가 맞습니다." },
    { id: 3, grade: "ele6", subject: "science", question: "[초등 6학년 과학] 자석에서 힘이 가장 강한 두 부분은?", options: ["1) 자극(N극, S극)", "2) 중심부", "3) 나침반", "4) 전류"], answer: "1", answerText: "1", explanation: "자석의 양 끝인 자극입니다." },
    { id: 4, grade: "mid1", subject: "math", question: "[중1 수학] 일차방정식 2x + 4 = 10 의 해 x는?", options: ["1) x = 2", "2) x = 3", "3) x = 4", "4) x = 5"], answer: "2", answerText: "3", explanation: "2x = 6 이 되므로 x = 3 입니다." },
    { id: 5, grade: "mid3", subject: "science", question: "[중3 과학] 원소 기호 'Na'의 이름은?", options: ["1) 질소", "2) 니켈", "3) 나트륨(소듐)", "4) 네온"], answer: "3", answerText: "나트륨", explanation: "'Na'는 나트륨입니다." },
    { id: 6, grade: "high1", subject: "history", question: "[고1 한국사] 쌍성총관부를 공격하여 영토를 회복한 왕은?", options: ["1) 태조 왕건", "2) 광종", "3) 공민왕", "4) 성종"], answer: "3", answerText: "공민왕", explanation: "공민왕의 반원 자주 개혁 정책입니다." },
    { id: 7, grade: "high3", subject: "math", question: "[고3 수학] f(x) = 3x² + 2x - 5 의 도함수 f'(x)는?", options: ["1) f'(x) = 6x + 2", "2) f'(x) = 3x + 2", "3) f'(x) = 6x - 5", "4) f'(x) = 3x² + 2"], answer: "1", answerText: "6x + 2", explanation: "미분 공식 적용 시 6x + 2 입니다." }
];

let stats = { total: 0, correct: 0 };
let activeQuiz = null;

function handleKeyPress(e) { if (e.key === 'Enter') sendMessage(); }

function sendMessage() {
    const inputEl = document.getElementById('user-input');
    const text = inputEl.value.trim();
    if (!text) return;
    appendMessage('user', text);
    inputEl.value = '';
    if (activeQuiz) { checkAnswer(text); return; }
    processUserQuery(text);
}

function appendMessage(sender, contentHTML) {
    const container = document.getElementById('chat-container');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.innerHTML = `<div class="bubble">${contentHTML}</div>`;
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

function processUserQuery(text) {
    let quiz = quizBank.find(q => text.includes(q.grade) || text.includes(q.subject)) || quizBank[Math.floor(Math.random() * quizBank.length)];
    presentQuiz(quiz);
}

function requestQuickQuiz(grade, subject) {
    let quiz = quizBank.find(q => q.grade === grade && q.subject === subject);
    if (quiz) presentQuiz(quiz);
}

function presentQuiz(quiz) {
    activeQuiz = quiz;
    let opts = quiz.options.map(o => `<li><button type="button" class="option-btn" onclick="submitOptionAnswer('${o.charAt(0)}')">${o}</button></li>`).join('');
    appendMessage('ai', `<strong>🎯 맞춤 문제</strong><div class="problem-card"><div class="problem-title">${quiz.question}</div><ul class="options-list">${opts}</ul></div>`);
}

function submitOptionAnswer(ansNum) {
    appendMessage('user', `${ansNum}번 선택`);
    checkAnswer(ansNum);
}

function checkAnswer(userAns) {
    if (!activeQuiz) return;
    const isCorrect = (userAns.toString().trim() === activeQuiz.answer || userAns.toString().includes(activeQuiz.answerText));
    stats.total++;
    if (isCorrect) stats.correct++;
    
    document.getElementById('stat-total').innerText = stats.total;
    document.getElementById('stat-correct').innerText = stats.correct;
    document.getElementById('stat-rate').innerText = Math.round((stats.correct / stats.total) * 100) + '%';

    let res = isCorrect ? `🎉 <strong>정답입니다!</strong><br>${activeQuiz.explanation}` : `❌ <strong>오답입니다.</strong> 정답: ${activeQuiz.answer}번<br>${activeQuiz.explanation}`;
    appendMessage('ai', res);
    activeQuiz = null;
}

function triggerFileUpload() { document.getElementById('file-input').click(); }
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = e => { const img = document.getElementById('preview-img'); img.src = e.target.result; img.style.display = 'inline-block'; };
        reader.readAsDataURL(file);
    }
}
function promptLinkInput() {
    const url = prompt('참고할 URL을 입력하세요:');
    if (url) document.getElementById('user-input').value += ` [참고: ${url}]`;
}
