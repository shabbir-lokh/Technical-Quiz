// FEATURE 1: QUESTION BANK WITH CATEGORIES
const questions = [
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "High Text Machine Language",
      "Hyper Transfer Markup Language",
      "Home Tool Markup Language"
    ],
    answer: 0,
    category: "html"
  },
  {
    question: "Which tag creates a hyperlink?",
    options: ["<p>", "<a>", "<h1>", "<img>"],
    answer: 1,
    category: "html"
  },
  {
    question: "Which tag displays an image?",
    options: ["<image>", "<picture-text>", "<img>", "<src>"],
    answer: 2,
    category: "html"
  },
  {
    question: "Which keyword declares a block-scoped variable?",
    options: ["int", "define", "let", "print"],
    answer: 2,
    category: "javascript"
  },
  {
    question: "Which operator checks strict equality?",
    options: ["=", "==", "===", "!="],
    answer: 2,
    category: "javascript"
  },
  {
    question: "Which method adds an item to an array?",
    options: ["pop()", "push()", "shift()", "slice()"],
    answer: 1,
    category: "javascript"
  },
  {
    question: "Which method selects an element by its ID?",
    options: [
      "getElementById()",
      "getClass()",
      "queryByName()",
      "selectID()"
    ],
    answer: 0,
    category: "javascript"
  },
  {
    question: "Which event occurs when a button is clicked?",
    options: ["onload", "onchange", "click", "onhover"],
    answer: 2,
    category: "javascript"
  }
];

// SELECT HTML ELEMENTS
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const userForm = document.getElementById("user-form");
const usernameInput = document.getElementById("username");
const categorySelect = document.getElementById("category");
const greeting = document.getElementById("greeting");

const questionCount = document.getElementById("question-count");
const questionText = document.getElementById("question");
const optionsContainer = document.getElementById("options");
const feedback = document.getElementById("feedback");
const scoreText = document.getElementById("score");
const progressBar = document.getElementById("progress-bar");

const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const quizTitle = document.querySelector(".welcome-section h1");

// QUIZ VARIABLES
let playerName = "";
let selectedCategory = "all";
let quizQuestions = [];
let currentQuestion = 0;
let score = 0;
let answered = false;
let userAnswers = [];

// FEATURE 2: LIVE INPUT FEEDBACK
usernameInput.addEventListener("input", function () {
  const name = usernameInput.value.trim();

  greeting.textContent = name
    ? `Welcome, ${name}!`
    : "Your quiz is ready!";
});

// FEATURE 3: FORM VALIDATION + CATEGORY FILTER
userForm.addEventListener("submit", function (event) {
  event.preventDefault();

  playerName = usernameInput.value.trim();
  selectedCategory = categorySelect.value;

  // Validate the name.
  if (!playerName) {
    greeting.textContent = "Please enter your name.";
    usernameInput.focus();
    return;
  }

  // Filter questions by category.
  quizQuestions = questions.filter(function (item) {
    return selectedCategory === "all" ||
      item.category === selectedCategory;
  });

  if (quizQuestions.length === 0) {
    greeting.textContent = "No questions available in this category.";
    return;
  }

  startQuiz();
});

// START OR RESTART THE QUIZ
function startQuiz() {
  currentQuestion = 0;
  score = 0;
  answered = false;
  userAnswers = [];

  startScreen.hidden = true;
  resultScreen.hidden = true;
  quizScreen.hidden = false;

  quizTitle.textContent = `Good luck, ${playerName}!`;

  showQuestion();
}

// DISPLAY CURRENT QUESTION
function showQuestion() {
  answered = false;

  const item = quizQuestions[currentQuestion];

  questionCount.textContent =
    `Question ${currentQuestion + 1} of ${quizQuestions.length}`;

  questionText.textContent = item.question;
  feedback.textContent = "";
  nextBtn.disabled = true;

  // FEATURE 4: DYNAMIC PROGRESS BAR
  const progress =
    ((currentQuestion + 1) / quizQuestions.length) * 100;

  progressBar.style.width = `${progress}%`;

  // Clear the previous options.
  optionsContainer.replaceChildren();

  // Create answer buttons dynamically.
  item.options.forEach(function (option, index) {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = option;
    button.classList.add("answer-option");

    button.addEventListener("click", function () {
      checkAnswer(index);
    });

    optionsContainer.appendChild(button);
  });

  nextBtn.textContent =
    currentQuestion === quizQuestions.length - 1
      ? "View Results"
      : "Next Question";
}

// CHECK THE SELECTED ANSWER
function checkAnswer(selectedIndex) {
  if (answered) {
    return;
  }

  answered = true;

  const correctIndex = quizQuestions[currentQuestion].answer;
  const buttons = optionsContainer.querySelectorAll("button");

  buttons.forEach(function (button, index) {
    button.disabled = true;

    if (index === correctIndex) {
      button.classList.add("correct");
    }
  });

  userAnswers[currentQuestion] = selectedIndex;

  if (selectedIndex === correctIndex) {
    score++;
    feedback.textContent = "Correct answer!";
  } else {
    buttons[selectedIndex].classList.add("incorrect");
    feedback.textContent =
      "Incorrect! The correct answer is highlighted.";
  }

  nextBtn.disabled = false;
}

// MOVE TO NEXT QUESTION
nextBtn.addEventListener("click", function () {
  if (!answered) {
    feedback.textContent = "Please select an answer first.";
    return;
  }

  currentQuestion++;

  if (currentQuestion < quizQuestions.length) {
    showQuestion();
  } else {
    showResults();
  }
});

// FEATURE 5: SCORE CALCULATION
function showResults() {
  quizScreen.hidden = true;
  resultScreen.hidden = false;

  const percentage = Math.round(
    (score / quizQuestions.length) * 100
  );

  let message;

  if (percentage >= 80) {
    message = "Excellent work!";
  } else if (percentage >= 50) {
    message = "Good job! Keep practising.";
  } else {
    message = "Keep learning and try again!";
  }

  scoreText.textContent =
    `${playerName}, your score is ${score}/${quizQuestions.length} ` +
    `(${percentage}%). ${message}`;

  // Add detailed results dynamically.
  const details = document.createElement("p");
  details.id = "result-details";

  details.textContent =
    `Category: ${selectedCategory.toUpperCase()} | ` +
    `Correct: ${score} | Incorrect: ${quizQuestions.length - score}`;

  // Remove any previous result details first.
  const oldDetails = document.getElementById("result-details");

  if (oldDetails) {
    oldDetails.remove();
  }

  scoreText.insertAdjacentElement("afterend", details);
}

// RESTART BUTTON
restartBtn.addEventListener("click", function () {
  // Remove dynamic results.
  const details = document.getElementById("result-details");

  if (details) {
    details.remove();
  }

  // Reset quiz and form.
  resultScreen.hidden = true;
  quizScreen.hidden = true;
  startScreen.hidden = false;

  userForm.reset();

  playerName = "";
  selectedCategory = "all";
  quizQuestions = [];
  currentQuestion = 0;
  score = 0;
  answered = false;
  userAnswers = [];

  greeting.textContent = "Your quiz is ready!";
  quizTitle.textContent = "Challenge Your Knowledge";

  optionsContainer.replaceChildren();
  progressBar.style.width = "0%";

  usernameInput.focus();
});
