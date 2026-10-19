
/* ==========================================
   AI 공부 문제 풀이 - script.js
   실습 기능 3종 (로그인, 글자 색 바꾸기, 카운터) + 기존 문제 풀이 로직
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {
    initPracticeFeatures();
});

// 📌 3가지 실습 기능 이벤트 처리
function initPracticeFeatures() {
    // 1. 로그인 기능
    const loginBtn = document.getElementById('login-btn');
    const loginId = document.getElementById('login-id');
    const loginPw = document.getElementById('login-pw');
    const loginMsg = document.getElementById('login-msg');

    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            const idVal = loginId.value.trim();
            const pwVal = loginPw.value.trim();

            if (idVal === '' || pwVal === '') {
                loginMsg.style.color = '#dc2626';
                loginMsg.innerText = '아이디/비밀번호 입력!';
            } else {
                loginMsg.style.color = '#16a34a';
                loginMsg.innerText = `${idVal}님 환영합니다!`;
            }
        });
    }

    // 2. 글자 색 바꾸기 기능
    const colorText = document.getElementById('color-text');
    const colors = ['#dc2626', '#2563eb', '#16a34a', '#9333ea', '#ea580c', '#000000'];
    let colorIdx = 0;

    if (colorText) {
        colorText.addEventListener('click', function() {
            colorIdx = (colorIdx + 1) % colors.length;
            colorText.style.color = colors[colorIdx];
        });
    }

    // 3. 카운터 기능
    const counterBtn = document.getElementById('counter-btn');
    const counterDisplay = document.getElementById('counter-count');
    let clickCount = 0;

    if (counterBtn) {
        counterBtn.addEventListener('click', function() {
            clickCount++;
            counterDisplay.innerText = `${clickCount}번 클릭`;
        });
    }
}


/* ==========================================
   기존 공부 문제 풀이 핵심 기능
   ========================================== */

const quizBank = [
    {
        id: 1, grade: "ele1", subject: "math",
        question: "[초등 1학년 수학] 5 + 3 은 얼마일까요?",
        options: ["1) 6", "2) 7", "3) 8", "4) 9"],
        answer: "3",
        answerText: "8",
        explanation: "5에 3을 더하면 8이 되므로 정답은 8입니다."
    },
    {
        id: 2, grade: "ele3", subject: "korean",
        question: "[초등 3학년 국어] 다음 중 맞춤법이 올바른 문장은 무엇일까요?",
        options: ["1) 감기가 낳았다.", "2) 감기가 낫았다.", "3) 병이 깨끗이 낫았다.", "4) 아기를 낫았다."],
        answer: "3",
        answerText: "3",
        explanation: "병이나 상처가 고쳐지는 것은 '낫다'가 기본형이므로 '낫았다'가 맞습니다."
    },
    {
        id: 3, grade: "ele6", subject: "science",
        question: "[초등 6학년 과학] 자석에서 끌어당기는 힘이 가장 강한 두 부분을 무엇이라고 하나요?",
        options: ["1) 자극(N극, S극)", "2) 중심부", "3) 나침반", "4) 전류"],
        answer: "1",
        answerText: "1",
        explanation: "자석의 양 끝 부분인 N극과 S극을 '자극'이라고 합니다."
    },
    {
        id: 4, grade: "mid1", subject: "math",
        question: "[중학교 1학년 수학] 일차방정식 2x + 4 = 10 의 해(x의 값)를 구하세요.",
        options: ["1) x = 2", "2) x = 3", "3) x = 4", "4) x = 5"],
        answer: "2",
        answerText: "3",
        explanation: "2x + 4 = 10 에서 4를 이항하면 2x = 6 이 되고 x = 3 이 됩니다."
    },
    {
        id: 5, grade: "mid3", subject: "science",
        question: "[중학교 3학년 과학] 원소 기호 'Na'가 나타내는 원소의 이름은 무엇일까요?",
        options: ["1) 질소", "2) 니켈", "3) 나트륨(소듐)", "4) 네온"],
        answer: "3",
        answerText: "나트륨",
        explanation: "'Na'는 나트륨(소듐)의 원소 기호입니다."
    },
    {
        id: 6, grade: "high1", subject: "history",
        question: "[고등학교 1학년 한국사] 고려 시대에 원나라의 간섭을 물리치고 쌍성총관부를 공격하여 영토를 회복한 왕은?",
        options: ["1) 태조 왕건", "2) 광종", "3) 공민왕", "4) 성종"],
        answer: "3",
        answerText: "공민왕",
        explanation: "공민왕은 반원 자주 개혁 정책을 추진하여 영토를 회복했습니다."
    },
    {
        id: 7, grade: "high3", subject: "math",
        question: "[고등학교 3학년 수학] 함수 f(x) = 3x² + 2x - 5 의 도함수 f'(x)를 구하세요.",
        options: ["1) f'(x) = 6x + 2", "2) f'(x) = 3x + 2", "3) f'(x) = 6x - 5", "4) f'(x) = 3x² + 2"],
        answer: "1",
        answerText: "6x + 2",
        explanation: "미분 공식에 따라 d/dx(3x²) = 6x, d/dx(2x) = 2 이므로 f'(x) = 6x + 2 입니다."
    }
];

let stats = { total: 0, correct: 0 };
let activeQuiz = null;

function handleKeyPress(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const inputEl = document.getElementById('user-input');
    const text = inputEl.value.trim();
    if (!text) return;

    appendMessage('user', text);
    inputEl.value = '';

    if (activeQuiz) {
        checkAnswer(text);
        return;
    }

    processUserQuery(text);
}

function appendMessage(sender, contentHTML) {
    const container = document.getElementById('chat-container');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'bubble';
    bubbleDiv.innerHTML = contentHTML;

    msgDiv.appendChild(bubbleDiv);
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

function processUserQuery(text) {
    let selectedQuiz = null;

    if (text.includes('초1') || text.includes('1학년')) {
        selectedQuiz = quizBank.find(q => q.grade === 'ele1');
    } else if (text.includes('초3') || text.includes('3학년')) {
        selectedQuiz = quizBank.find(q => q.grade === 'ele3');
    } else if (text.includes('중1')) {
        selectedQuiz = quizBank.find(q => q.grade === 'mid1');
    } else if (text.includes('중3')) {
        selectedQuiz = quizBank.find(q => q.grade === 'mid3');
    } else if (text.includes('고1') || text.includes('한국사')) {
        selectedQuiz = quizBank.find(q => q.grade === 'high1');
    } else if (text.includes('고3') || text.includes('미분')) {
        selectedQuiz = quizBank.find(q => q.grade === 'high3');
    }

    if (!selectedQuiz) {
        if (text.includes('수학')) {
            selectedQuiz = quizBank.find(q => q.subject === 'math');
        } else if (text.includes('국어')) {
            selectedQuiz = quizBank.find(q => q.subject === 'korean');
        } else if (text.includes('과학')) {
            selectedQuiz = quizBank.find(q => q.subject === 'science');
        }
    }

    if (!selectedQuiz) {
        selectedQuiz = quizBank[Math.floor(Math.random() * quizBank.length)];
    }

    presentQuiz(selectedQuiz);
}

function requestQuickQuiz(grade, subject) {
    const found = quizBank.find(q => q.grade === grade && q.subject === subject);
    if (found) {
        appendMessage('user', `${found.question.split(']')[0]}] 문제 부탁드립니다!`);
        presentQuiz(found);
    }
}

function presentQuiz(quiz) {
    activeQuiz = quiz;
    
    let optionsHTML = '';
    quiz.options.forEach(opt => {
        optionsHTML += `<li><button class="option-btn" onclick="submitOptionAnswer('${opt.charAt(0)}')">${opt}</button></li>`;
    });

    const quizCardHTML = `
        <strong>🎯 맞춤 문제가 준비되었습니다!</strong>
        <div class="problem-card">
            <div class="problem-title">${quiz.question}</div>
            <ul class="options-list">
                ${optionsHTML}
            </ul>
        </div>
        <p style="font-size: 12px; color: #64748b; margin-top: 8px;">
            💡 보기 번호를 클릭하거나 하단 입력창에 정답 번호/단어를 입력하세요.
        </p>
    `;

    appendMessage('ai', quizCardHTML);
}

function submitOptionAnswer(ansNum) {
    if (!activeQuiz) return;
    appendMessage('user', `${ansNum}번 선택`);
    checkAnswer(ansNum);
}

function checkAnswer(userAns) {
    if (!activeQuiz) return;

    const isCorrect = (userAns.toString().trim() === activeQuiz.answer || userAns.toString().includes(activeQuiz.answerText));
    
    stats.total++;
    if (isCorrect) stats.correct++;
    updateStats();

    let resultHTML = '';
    if (isCorrect) {
        resultHTML = `
            <span style="color: #16a34a; font-size: 16px; font-weight: bold;">🎉 정답입니다! 아주 잘하셨습니다.</span><br><br>
            <strong>📖 문제 해설:</strong><br>
            ${activeQuiz.explanation}
        `;
    } else {
        resultHTML = `
            <span style="color: #dc2626; font-size: 16px; font-weight: bold;">❌ 아쉽네요, 오답입니다.</span><br><br>
            <strong>정답:</strong> ${activeQuiz.answer}번 (${activeQuiz.answerText})<br><br>
            <strong>📖 문제 해설:</strong><br>
            ${activeQuiz.explanation}
        `;
    }

    resultHTML += `<br><br><span style="font-size: 12px; color: #475569;">다음 문제를 풀고 싶다면 '다음 문제' 또는 과목명을 입력해 주세요.</span>`;

    appendMessage('ai', resultHTML);
    activeQuiz = null;
}

function updateStats() {
    document.getElementById('stat-total').innerText = stats.total;
    document.getElementById('stat-correct').innerText = stats.correct;
    const rate = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    document.getElementById('stat-rate').innerText = rate + '%';
}

function triggerFileUpload() {
    document.getElementById('file-input').click();
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            const imgEl = document.getElementById('preview-img');
            imgEl.src = evt.target.result;
            imgEl.style.display = 'inline-block';
        };
        reader.readAsDataURL(file);
    }
}

function promptLinkInput() {
    const url = prompt('참고할 웹사이트 링크(URL)를 입력하세요:');
    if (url) {
        document.getElementById('user-input').value += ` [참고링크: ${url}]`;
    }
}
