const activeToggle = document.querySelector(".activeToggle");
const questionH3 = document.querySelector(".questionH3");
const submitBtn = document.querySelector(".submitBtn");
const progress = document.querySelector(".progress");
const playAgain = document.querySelector(".playAgain");
const questionNum = document.querySelector(".questionNum");
const questionLength = document.querySelector(".questionLength");
const scoreText = document.querySelector(".scoreText");
const options = document.querySelectorAll(".optionText");
const optionLabel = document.querySelectorAll(".options");
const optionSelector = document.querySelectorAll(".optionSelector");
const section = document.querySelectorAll('section');
const quizSelector = document.querySelectorAll('.quizSelector');
const optionText = document.querySelectorAll('.optionText');
const hdr = document.querySelectorAll('.hdr');
const correctIcons = document.querySelectorAll('.correctIcons');
const incorrectIcons = document.querySelectorAll('.incorrectIcons');
const resultHdr = document.querySelectorAll('.resultHdr');

let currPage = 0;
let score = 0;
let questidx = 0;
let data = {}


// fetch("data.json")
//     .then(response => response.json())
//     .then(value => {
//         data = value
//         // console.group(value)
// })
    
async function initQuizAapp() {
    try {
        const response = await fetch("data.json");
        const value = await response.json();
        data = value
        setupQuizSelector();
        setupOptionListeners()
    }
    catch (error) {
        console.log('Error Loading data:', error);
    }
}


    //  THEME SWITCHER
activeToggle.addEventListener('input', () => {
    if (activeToggle.checked) {
        document.body.classList.remove('lightTheme')
        document.body.classList.add('darkTheme')
    } else {
        document.body.classList.add('lightTheme')
        document.body.classList.remove('darkTheme')
    }
})



function pageSlide() {
    if (currPage < (section.length - 1)){
        section[currPage].classList.add('inactive');
        section[currPage].classList.remove('active');
        section[currPage + 1].classList.add('active');
        section[currPage + 1].classList.remove('inactive');
        currPage++
    }
}

function resetPage() {
    score = 0;
    section[0].classList.add('active')
    section[0].classList.remove('inactive')
    for (let i = 1; i < section.length; i++){
        section[i].classList.add('inactive')
        section[i].classList.remove('active')
    }
    currPage = 0;
    questidx = 0;
    submitBtn.textContent = 'Submit Answer'
    progress.style.width = 0;
    for (let i = 0; i < quizSelector.length; i++){
        hdr[i].classList.add('hidden');
        hdr[i].classList.remove('flex');
        resultHdr[i].classList.add('hidden')
        resultHdr[i].classList.remove('flex')
    }
}


function displaySelectedQuiz(cb) {
    for (let i = 1; i < quizSelector.length; i++){
        hdr[i].classList.add('hidden')
        hdr[i].classList.remove('flex')
        resultHdr[i].classList.add('hidden')
        resultHdr[i].classList.remove('flex')
    }
    hdr[cb].classList.add('flex')
    hdr[cb].classList.remove('hidden');
    resultHdr[cb].classList.add('flex')
    resultHdr[cb].classList.remove('hidden')
}



let globalQuestions;
let globalOptions;
let globalCurrOptions;

function setupQuizSelector() {
    quizSelector.forEach((selector, idx) => {
    selector.addEventListener('click', (event) => {
        pageSlide();
        displaySelectedQuiz(idx)
         // Make the Quiz Title in the navbar visible
        let selectedQuiz = data.quizzes[idx]; // TO choose Quiz
        let selectedQuestions = selectedQuiz.questions // To load the question for the chosen quiz
        questionLength.textContent = selectedQuestions.length// Update the Total Questions text
        globalQuestions = selectedQuestions
        
        let quizOptions = selectedQuiz.questions
        
        globalOptions = quizOptions
        
        displayQuestion(selectedQuestions)
        displayOptions(quizOptions)
        clearSelection()

        
    })
})
}

submitBtn.addEventListener('click', () => {
    questidx++;
    tries = 0
    answerFunc.labelsReset()
    answered = false
    if (questidx < globalQuestions.length){
        displayQuestion(globalQuestions);
        displayOptions(globalOptions);
        answerFunc.labelsReset(); // Reset Correct and Incorect Decor
        progress.style.width = ((questidx + 1) / globalQuestions.length) * 100 + '%'; // Update Progress bar

        //  Clear previous Selection
        clearSelection()

        if (questidx === globalQuestions.length - 1){
            submitBtn.textContent = 'Show Results'
        }
    }
    else if (questidx === globalOptions.length){
        scoreText.textContent = score;
        pageSlide()
    }
});

playAgain.addEventListener('click', () => {
    resetPage()
})


let correctAns = ''
function displayQuestion(cb) {
    let current = cb[questidx].question; // Show Question
    questionH3.textContent = current //Update Text Content of Question H3
    questionNum.textContent = questidx + 1;
    correctAns = globalOptions[questidx].answer;
    answerFunc.labelsReset()
    answered = false
}

function displayOptions(cb) {
    let current = cb[questidx].options; // Show Question
    globalCurrOptions = current;
    options.forEach((option, idx) => {
        option.textContent = current[idx]
    })
    
}


let answered = false
const answerFunc = {

    labelsReset() {
        optionLabel.forEach((option) => {
            option.classList.remove('correct', 'incorrect')
        })
        correctIcons.forEach((icon) => {
            icon.classList.add('hidden')
        })
        incorrectIcons.forEach((icon) =>{
            icon.classList.add('hidden')
        })
        submitBtn.classList.add('hidden')
        answered = false
    }
} 

// RESET OPTION SELECT RADIOS
function clearSelection() {
    optionSelector.forEach((option) => {
            option.checked = false;
            answered = false;
    })
}


function setupOptionListeners() {
            optionSelector.forEach((option, idx) => {
            option.addEventListener('click', e => {
            if (answered) return; // Prevent double selection

            let selectedAns = optionText[idx].textContent;

            if (selectedAns === correctAns) {
                score++;
                optionLabel[idx].classList.add('correct');
                correctIcons[idx].classList.remove('hidden');
                incorrectIcons[idx].classList.add('hidden');
                submitBtn.classList.remove('hidden');
            } else {
                optionLabel[idx].classList.add('incorrect');
                incorrectIcons[idx].classList.remove('hidden');
                submitBtn.classList.remove('hidden');

                    // Highlight correct one
                globalCurrOptions.forEach((opt, i) => {
                    if (opt === correctAns) {
                        optionLabel[i].classList.add('correct');
                        correctIcons[i].classList.remove('hidden');
                    }
                });
            }
                answered = true;
    });
  });
}

initQuizAapp()
