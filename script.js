// JSONデータをfetchする
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    let mode; // 1 or 2
    let currentQuestionIndex = 0;
    let correctAnswers = 0;
    let incorrectAnswers = [];

    const modeSelection = document.getElementById("mode-selection");
    const quizContainer = document.getElementById("quiz-container");
    const resultContainer = document.getElementById("result-container");
    const questionElement = document.getElementById("question");
    const optionsElement = document.getElementById("options");
    const resultElement = document.getElementById("result");
    const correctAnswersElement = document.getElementById("correct-answers");

    modeSelection.addEventListener("click", (event) => {
      if (event.target.id === "mode1") {
        mode = 1;
        startQuiz();
      } else if (event.target.id === "mode2") {
        mode = 2;
        startQuiz();
      }
    });

    function startQuiz() {
      modeSelection.style.display = "none";
      quizContainer.style.display = "block";
      loadQuestion();
    }

    function loadQuestion() {
      const currentQuestion = data[currentQuestionIndex];
      questionElement.textContent = mode === 1 ? currentQuestion.meaning : currentQuestion.word;
      if (mode === 1) {
        loadMode1Options(currentQuestion.word);
      } else {
        loadMode2Options(currentQuestion.meaning);
      }
    }

    function loadMode1Options(correctWord) {
      const options = getRandomOptions(correctWord);
      renderOptions(options);
    }

    function loadMode2Options(correctMeaning) {
      const options = getRandomOptions(correctMeaning);
      renderOptions(options);
    }

    function getRandomOptions(correctAnswer) {
      const options = [];
      options.push(correctAnswer);
      while (options.length < 4) {
        const randomIndex = Math.floor(Math.random() * data.length);
        const randomOption = mode === 1 ? data[randomIndex].word : data[randomIndex].meaning;
        if (!options.includes(randomOption)) {
          options.push(randomOption);
        }
      }
      return shuffle(options);
    }

    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    function renderOptions(options) {
      optionsElement.innerHTML = "";
      options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.classList.add("option");
        button.addEventListener("click", () => checkAnswer(option));
        optionsElement.appendChild(button);
      });
    }

    function checkAnswer(selectedOption) {
      const currentQuestion = data[currentQuestionIndex];
      const correctAnswer = mode === 1 ? currentQuestion.word : currentQuestion.meaning;
      if (selectedOption === correctAnswer) {
        correctAnswers++;
      } else {
        incorrectAnswers.push({
          question: mode === 1 ? currentQuestion.meaning : currentQuestion.word,
          correctAnswer
        });
      }
      currentQuestionIndex++;
      if (currentQuestionIndex < data.length) {
        loadQuestion();
      } else {
        showResult();
      }
    }

    function showResult() {
      quizContainer.style.display = "none";
      resultContainer.style.display = "block";
      resultElement.textContent = `正解数: ${correctAnswers}/${data.length}`;
      incorrectAnswers.forEach(item => {
        const listItem = document.createElement("p");
        listItem.textContent = `${item.question}：正解は${item.correctAnswer}`;
        correctAnswersElement.appendChild(listItem);
      });
    }
  });
