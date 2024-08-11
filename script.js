// Redirect functions
function redirectToBodyParts() {
    window.location.href = 'body-parts.html';
}

function submitBodyPart() {
    window.location.href = 'quiz.html';
}

function startOver() {
    localStorage.clear();
    window.location.href = 'index.html';
}

// Logic for storing data and navigating pages
let selectedBodyPart = null;

function selectBodyPart(part) {
    selectedBodyPart = part;
    localStorage.setItem('selectedBodyPart', part);
}

let currentQuestionIndex = 0;
let answers = [];

const questions = [
    "Do you feel any pain or discomfort in this area?",
    "Have you experienced this before?",
    "Is the discomfort persistent for more than a day?"
];

function loadQuestion() {
    if (currentQuestionIndex < questions.length) {
        document.getElementById('question').textContent = questions[currentQuestionIndex];
    } else {
        storeAnswers();
        window.location.href = 'report.html';
    }
}

function submitAnswer(answer) {
    answers.push(answer);
    currentQuestionIndex++;
    loadQuestion();
}

function storeAnswers() {
    const selectedBodyPart = localStorage.getItem('selectedBodyPart');
    const userAnswers = {
        bodyPart: selectedBodyPart,
        responses: answers
    };

    localStorage.setItem('quizResponses', JSON.stringify(answers));
}

// Report generation logic
function generateReport() {
    const selectedBodyPart = localStorage.getItem('selectedBodyPart');
    const quizResponses = JSON.parse(localStorage.getItem('quizResponses'));

    let reportContent = `<h3>Symptom Report for ${selectedBodyPart.charAt(0).toUpperCase() + selectedBodyPart.slice(1)}</h3>`;
    
    reportContent += '<ul>';
    quizResponses.forEach((response, index) => {
        reportContent += `<li>Question ${index + 1}: ${questions[index]} - <strong>${response}</strong></li>`;
    });
    reportContent += '</ul>';

    // Simple analysis based on the quiz responses
    const symptomSeverity = quizResponses.filter(response => response === 'yes').length;

    if (symptomSeverity === 3) {
        reportContent += '<p><strong>It is advisable to consult a doctor immediately.</strong></p>';
    } else if (symptomSeverity === 2) {
        reportContent += '<p><strong>You may need to monitor the symptoms closely.</strong></p>';
    } else {
        reportContent += '<p><strong>The symptoms seem mild, but keep observing any changes.</strong></p>';
    }

    document.getElementById('report-content').innerHTML = reportContent;
}

// Load question on quiz page load
if (window.location.pathname.includes('quiz.html')) {
    loadQuestion();
}

// Generate report on report page load
if (window.location.pathname.includes('report.html')) {
    generateReport();
}

