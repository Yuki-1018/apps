let words = []; // 英単語と日本語の意味のペアを保持する配列
let mode = ''; // 現在のモードを保持する変数
let currentQuestionIndex = 0; // 現在の問題のインデックス
let correctAnswers = 0; // 正解の数を保持する変数
let incorrectQuestions = []; // 間違った問題のインデックスを保持する配列

// HTML要素の参照を取得
const modeSelection = document.getElementById('mode-selection');
const quizContainer = document.getElementById('quiz-container');
const resultContainer = document.getElementById('result-container');

// クイズを開始する関数
function startQuiz(selectedMode) {
    mode = selectedMode;
    // JSONファイルからデータを読み込む
    fetch('words.json')
        .then(response => response.json())
        .then(data => {
            words = data;
            // クイズを表示する
            displayNextQuestion();
        });
    modeSelection.style.display = 'none'; // モード選択画面を非表示にする
    quizContainer.style.display = 'block'; // クイズコンテナを表示する
}

// 次の問題を表示する関数
function displayNextQuestion() {
    const question = words[currentQuestionIndex];
    let choices = [];

    if (mode === 'meaning') {
        // 日本語の意味 → 英単語モード
        choices = getRandomChoicesExcept(question.english);
        quizContainer.innerHTML = `
            <div class="question">${question.japanese} の英単語は？</div>
            <div class="choices">${choices.map(choice => `<button onclick="checkAnswer('${choice}')">${choice}</button>`).join('')}</div>
        `;
    } else if (mode === 'word') {
        // 英単語 → 日本語の意味モード
        choices = getRandomChoicesExcept(question.japanese);
        quizContainer.innerHTML = `
            <div class="question">${question.english} の日本語の意味は？</div>
            <div class="choices">${choices.map(choice => `<button onclick="checkAnswer('${choice}')">${choice}</button>`).join('')}</div>
        `;
    }
}

// 選択肢をランダムに選択する関数
function getRandomChoicesExcept(correctAnswer) {
    const choices = [correctAnswer];
    while (choices.length < 4) {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        const randomChoice = mode === 'meaning' ? randomWord.english : randomWord.japanese;
        if (!choices.includes(randomChoice) && randomChoice !== correctAnswer) {
            choices.push(randomChoice);
        }
    }
    return shuffleArray(choices);
}

// 配列をシャッフルする関数
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 回答をチェックする関数
function checkAnswer(selectedChoice) {
    const question = words[currentQuestionIndex];
    const correctAnswer = mode === 'meaning' ? question.english : question.japanese;
    if (selectedChoice === correctAnswer) {
        correctAnswers++;
    } else {
        incorrectQuestions.push(currentQuestionIndex);
    }
    currentQuestionIndex++;

    if (currentQuestionIndex < words.length) {
        displayNextQuestion();
    } else {
        displayResult();
    }
}

// 結果を表示する関数
function displayResult() {
    quizContainer.style.display = 'none'; // クイズコンテナを非表示にする
    resultContainer.style.display = 'block'; // 結果コンテナを表示する

    resultContainer.innerHTML = `
        <h2>結果</h2>
        <p>合っていた問題数: ${correctAnswers}</p>
        <p>間違っていた問題:</p>
        <ul>${incorrectQuestions.map(index => `<li>${words[index].english} (${words[index].japanese})</li>`).join('')}</ul>
    `;
}
