// ==========================================
// 1. 기존 스크립트 (로그인, 카운터, 색 바꾸기)
// ==========================================
const id = "Sheep";
const pw = "24152415";

//로그인
const loginForm = document.querySelector("#loginForm");
if (loginForm) {
    loginForm.onsubmit = function (e) {
        e.preventDefault(); // 페이지 새로고침 방지

        const inputId = document.querySelector("#user_Id").value;
        const inputPw = document.querySelector("#user_Pw").value;

        if (inputId === id && inputPw === pw) {
            alert("로그인 성공!");
        } else {
            alert("로그인 실패: 아이디 또는 비밀번호가 틀렸습니다.");
        }
    };
}

//카운터
let counter = document.querySelector("#counter");
let number = 0;
let count_number = document.querySelector("#count_number");
if (counter) {
    counter.onclick = function () {
        number = number + 1;
        count_number.textContent = number + "번 클릭";
    };
}

//색 바꾸기
let text_message = document.querySelector('#text_message');
if (text_message) {
    text_message.onclick = function () {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        text_message.style.color = 'rgb(' + r + ',' + g + ',' + b + ')';
    };
}


// ==========================================
// 2. [신규 추가] 공부 문제 풀이 기능
// ==========================================

// 초1~고3 문제 데이터베이스
const quizBank = [
    {
        id: 1, grade: "ele1", subject: "math",
        question: "[초등 1학년 수학] 5 + 3 은 얼마일까요?",
        options: ["1) 6", "2) 7", "3) 8", "4) 9"],
        answer: "3",
        answerText: "8",
        explanation: "5에 3을 더하면 5 → 6, 7, 8이 되므로 정답은 8입니다."
    },
    {
        id: 2, grade: "ele3", subject: "korean",
        question: "[초등 3학년 국어] 다음 중 맞춤법이 올바른 문장은 무엇일까요?",
        options: ["1) 감기가 낳았다.", "2) 감기가 낫았다.", "3) 병이 깨끗이 낫았다.", "4) 아기를 낫았다."],
        answer: "3",
        answerText: "3",
        explanation: "병이나 상처가 고쳐지는 것은 '낫다'가 기본형이므로 '낫았다'가 맞습니다. 아기를 출산하는 것은 '낳다'입니다."
    },
    {
        id: 3, grade: "ele6", subject: "science",
        question: "[초등 6학년 과학] 자석에서 끌어당기는 힘이 가장 강한 두 부분을 무엇이라고 하나요?",
        options: ["1) 자극(N극, S극)", "2) 중심부", "3) 나침반", "4) 전류"],
        answer: "1",
        answerText: "1",
        explanation: "자석의 양 끝 부분인 N극과 S극을 '자극'이라고 하며, 이곳에서 철을 끌어당기는 힘이 가장 강합니다."
    },
    {
        id: 4, grade: "mid1", subject: "math",
        question: "[중학교 1학년 수학] 일차방정식 2x + 4 = 10 의 해(x의 값)를 구하세요.",
        options: ["1) x = 2", "2) x = 3", "3) x = 4", "4) x = 5"],
        answer: "2",
        answerText: "3",
        explanation: "2x + 4 = 10 에서 4를 이항하면 2x = 6 이 되고, 양변을 2로 나누면 x = 3 이 됩니다."
    },
    {
        id: 5, grade: "mid3", subject: "science",
        question: "[중학교 3학년 과학] 원소 기호 'Na'가 나타내는 원소의 이름은 무엇일까요?",
        options: ["1) 질소", "2) 니켈", "3) 나트륨(소듐)", "4) 네온"],
        answer: "3",
        answerText: "나트륨",
        explanation: "'Na'는 나트륨(소듐)의 원소 기호입니다. 1) 질소는 N, 2) 니켈은 Ni, 4) 네온은 Ne 입니다."
    },
    {
        id: 6, grade: "high1", subject: "history",
        question: "[고등학교 1학년 한국사] 고려 시대에 원나라의 간섭을 물리치고 쌍성총관부를 공격하여 영토를 회복한 왕은 누구인가요?",
        options: ["1) 태조 왕건", "2) 광종", "3) 공민왕", "4) 성종"],
        answer: "3",
        answerText: "공민왕",
        explanation: "공민왕은 반원 자주 개혁 정책을 추진하여 정동행성 이문소를 폐지하고 쌍성총관부를 공격하여 철령 이북의 영토를 회복했습니다."
    },
    {
        id: 7, grade: "high3", subject: "math",
        question: "[고등학교 3학년 수학] 함수 f(x) = 3x² + 2x - 5 의 도함수 f'(x)를 구하세요.",
        options: ["1) f'(x) = 6x + 2", "2) f'(x) = 3x + 2", "3) f'(x) = 6x - 5", "4) f'(x) = 3x² + 2"],
        answer: "1",
        answerText: "6x + 2",
        explanation: "다항식의 미분 공식 d/dx(xⁿ) = n·xⁿ⁻¹ 에 따라 d/dx(3x²) = 6x, d/dx(2x) = 2, 상수항 -5는 0이 되므로 f'(x) = 6x + 2 입니다."
    }
];

let stats = { total: 0, correct: 0 };
let activeQuiz = null;

function handleKeyPress(e) {
    if (e.key === 'Enter') sendMessage();
}

function sendMessage() {
    const inputEl = document.getElementById('user-input');
    if (!inputEl) return;
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
    if (!container) return;
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
        if (text.includes('수학')) selectedQuiz = quizBank.find(q => q.subject === 'math');
        else if (text.includes('국어')) selectedQuiz = quizBank.find(q => q.subject === 'korean');
        else if (text.includes('과학')) selectedQuiz = quizBank.find(q => q.subject === 'science');
    }

    if (!selectedQuiz) {
        selectedQuiz = quizBank[Math.floor(Math.random() * quizBank.length)];
    }

    presentQuiz(selectedQuiz);
}

function requestQuickQuiz(grade, subject) {
    const found = quizBank.find(q => q.grade === grade && q.subject === subject);
    if (found) {
        appendMessage('user', `${found.question.split(']')[0]}] 문제 출제해주세요!`);
        presentQuiz(found);
    }
}

function presentQuiz(quiz) {
    activeQuiz = quiz;
    
    let optionsHTML = '';
    quiz.options.forEach(opt => {
        optionsHTML += `<li><button type="button" class="opt-btn" onclick="submitOptionAnswer('${opt.charAt(0)}')">${opt}</button></li>`;
    });

    const quizCardHTML = `
        <strong>🎯 맞춤 문제 출제!</strong>
        <div class="p-card">
            <div style="font-weight: bold; margin-bottom: 6px;">${quiz.question}</div>
            <ul style="list-style: none; padding: 0;">
                ${optionsHTML}
            </ul>
        </div>
        <p style="font-size: 11px; color: #64748b; margin-top: 4px;">
            💡 번호를 클릭하거나 하단에 정답을 작성해 주세요.
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
            <span style="color: #16a34a; font-size: 14px; font-weight: bold;">🎉 정답입니다!</span><br>
            <strong>📖 해설:</strong> ${activeQuiz.explanation}
        `;
    } else {
        resultHTML = `
            <span style="color: #dc2626; font-size: 14px; font-weight: bold;">❌ 오답입니다.</span><br>
            <strong>정답:</strong> ${activeQuiz.answer}번 (${activeQuiz.answerText})<br>
            <strong>📖 해설:</strong> ${activeQuiz.explanation}
        `;
    }

    appendMessage('ai', resultHTML);
    activeQuiz = null;
}

function updateStats() {
    const statTotal = document.getElementById('stat-total');
    const statCorrect = document.getElementById('stat-correct');
    const statRate = document.getElementById('stat-rate');
    if (!statTotal) return;

    statTotal.innerText = stats.total;
    statCorrect.innerText = stats.correct;
    const rate = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    statRate.innerText = rate + '%';
}
