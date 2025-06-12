import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../Components/quiz.css';

const maintext = "Do you have your koalafications ?";

function shuffleArray(arr) {
  return arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch('/koala_quiz_questions.json')
      .then((res) => res.json())
      .then((data) => {
        const shuffled = shuffleArray(data).slice(0, 10); // pick 10 random questions
        setQuestions(shuffled);
      })
      .catch((err) => console.error('Failed to load quiz data:', err));
  }, []);

  const handleAnswer = (choiceIndex) => {
    const current = questions[currentQuestionIndex];
    if (choiceIndex === current.answer_index) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelected(null);
      } else {
        setQuizDone(true);
      }
    }, 300); // small delay for feedback
  };

  if (questions.length === 0) {
    return <p>Loading quiz...</p>;
  }

  if (quizDone) {
    return (
      <div className="quizsect">
        <h1>Quiz Completed!</h1>
        <p>You got {score} out of {questions.length} correct.</p>
        {score >= 6 ? (
          <>
            <h2>🎉 Congratulations! You got your koalafications!</h2>
            <img className='qualifyimg' src="/koalafied.png" alt="Koalafied!" width="300" />
          </>
        ) : (
          <h2>🐨 Try again to earn your koalafications!</h2>
        )}
      </div>
    );
  }

  const current = questions[currentQuestionIndex];

  return (
    <div className='quizsect'>
      <h1>
        {maintext.split("").map((char, index) => (
          <motion.span
            key={index}
            className="letter"
            animate={{ color: ["#0d920d", "#8fd113", "#0d920d"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </h1>
      <h2>Take the quiz to find out!</h2>
      <div className="question-box">
        <p><strong>Question {currentQuestionIndex + 1}:</strong> {current.question}</p>
        <ul>
          {current.choices.map((choice, idx) => (
            <li
              key={idx}
              onClick={() => handleAnswer(idx)}
              className={`choice ${selected === idx ? 'selected' : ''}`}
            >
              {choice}
            </li>
          ))}
        </ul>
      </div>
      <footer className='foot'><p>© Austin Chiwambo Disclaimer: This website is a personal project and is not affiliated with the Australian Koala Foundation or the Queensland Government.</p></footer>
      </div>
  );
}

export default Quiz;
