import { useState, useEffect } from 'react';
import questions from '../data/questions.json';

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, gameOver]);

  const startGame = () => {
    setGameStarted(true);
    selectRandomQuestion();
  };

  const selectRandomQuestion = () => {
    try {
      const availableQuestions = questions.filter(
        (q) => !answeredQuestions.includes(q.id)
      );
      if (availableQuestions.length === 0) {
        setGameOver(true);
        return;
      }
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      setCurrentQuestion(availableQuestions[randomIndex]);
      setFeedback('');
      setSelectedAnswer(null);
      setShowCorrectAnswer(false);
    } catch (error) {
      console.error('Error selecting question:', error);
      setFeedback('Error loading question. Please try again.');
    }
  };

  const handleAnswer = (selectedOption) => {
    try {
      if (!currentQuestion || feedback) return;
      
      setSelectedAnswer(selectedOption);
      const normalizedSelected = selectedOption.trim().toLowerCase();
      const normalizedCorrect = currentQuestion.answer.trim().toLowerCase();
      const isCorrect = normalizedSelected === normalizedCorrect;

      if (isCorrect) {
        setScore(score + 10);
        setFeedback('Correct!');
      } else {
        setFeedback(`Incorrect!`);
        setShowCorrectAnswer(true);
      }

      setAnsweredQuestions([...answeredQuestions, currentQuestion.id]);
      setTimeout(selectRandomQuestion, 2000);
    } catch (error) {
      console.error('Error handling answer:', error);
      setFeedback('Error processing answer. Please try again.');
    }
  };

  const resetGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setAnsweredQuestions([]);
    setFeedback('');
    setGameStarted(true);
    selectRandomQuestion();
  };

  if (!gameStarted) {
    return (
      <div className="container">
        <h1>LayerEdge Quiz</h1>
        <button onClick={startGame}>Start Quiz</button>
        <div className="footer">
          Developed by Karol |{' '}
          <a href="https://twitter.com/@iveobod" target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="container">
        <h1>Game Over!</h1>
        <p>
          {score}{' '}
          <img src="/edge.jpg" style={{ width: '20px', verticalAlign: 'middle' }} />
        </p>
        <button onClick={resetGame}>Play Again</button>
        <div className="footer">
          Developed by Karol |{' '}
          <a href="https://twitter.com/@iveobod" target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="timer">Time Left: {timeLeft}s</div>
      <h1>LayerEdge Quiz</h1>
      <p>
        {score}{' '}
        <img src="/edge.jpg" style={{ width: '20px', verticalAlign: 'middle' }} />
      </p>
      {currentQuestion && (
        <div>
          <div className="question">{currentQuestion.question}</div>
          <div className="options">
            {currentQuestion.options.map((option, index) => {
              let buttonClass = '';
              if (selectedAnswer) {
                if (option === currentQuestion.answer && showCorrectAnswer) {
                  buttonClass = 'correct-answer';
                } else if (option === selectedAnswer && option !== currentQuestion.answer) {
                  buttonClass = 'incorrect-answer';
                }
              }
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={feedback !== ''}
                  className={buttonClass}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {feedback && (
            <div className={`feedback ${feedback.includes('Correct!') ? 'correct' : 'incorrect'}`}>
              {feedback}
            </div>
          )}
        </div>
      )}
      <div className="footer">
        Developed by Karol |{' '}
        <a href="https://twitter.com/@iveobod" target="_blank" rel="noopener noreferrer">
          Twitter
        </a>
      </div>
    </div>
  );
}