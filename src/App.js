import React from "react";
import { nanoid } from "nanoid";
import QuestionComp from "./components/QuestionComp";
import Loader from "./components/Loader";

export default () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [isStarted, setIsStarted] = React.useState(false);
    const [questionsData, setQuestionsData] = React.useState([]);
    const [questions, setQuestions] = React.useState([]);
    const [score, setScore] = React.useState(0);
    const [isChecked, setIsChecked] = React.useState(false);

    const decodeHTML = input => {
        let textarea = document.createElement("textarea");
        textarea.innerHTML = input;
        return textarea.value;
    };

    React.useEffect(() => {
        async function fetchQuestions() {
            try {
                const response = await fetch("https://opentdb.com/api.php?amount=5&type=multiple");
                if (!response.ok) {
                    throw new Error(`This is an HTTP error: The status is ${response.status}`);
                }
                const data = await response.json();
                setQuestionsData(data.results);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        setIsLoading(true);
        if (isStarted) fetchQuestions();
    }, [isStarted]);

    React.useEffect(() => {
        if (questionsData)
            setQuestions(
                questionsData.map(element => ({
                    id: nanoid(),
                    question: decodeHTML(element.question),
                    correct_answer: decodeHTML(element.correct_answer),
                    incorrect_answers: element.incorrect_answers,
                    selected_answer: "",
                }))
            );
    }, [questionsData]);

    function handleClick(event) {
        const selectedQuestionId = event.target.closest(".question-container").id;
        setQuestions(prevQuestions =>
            prevQuestions.map(question => ({
                ...question,
                selected_answer:
                    selectedQuestionId === question.id
                        ? event.target.textContent
                        : question.selected_answer,
            }))
        );
    }

    function handleCheck() {
        setIsChecked(true);
        questions.map(question => {
            if (question.selected_answer === question.correct_answer)
                setScore(prevScore => prevScore + 1);
        });
    }

    function handleReset() {
        setIsChecked(false);
        setIsStarted(false);
        setScore(0);
        setQuestionsData([]);
        setIsLoading(true);
    }

    const questionArray = questions.map(question => (
        <QuestionComp
            key={question.id}
            id={question.id}
            question={question.question}
            correct_answer={question.correct_answer}
            incorrect_answers={question.incorrect_answers}
            handleClick={handleClick}
            selected_answer={question.selected_answer}
            isStarted={isStarted}
            isChecked={isChecked}
        />
    ));

    return (
        <div className="container">
            <span className="bg-blob-1" />
            <span className="bg-blob-2" />
            {isStarted && !isLoading ? (
                <>
                    {questionArray}
                    <div className="button-container">
                        {isChecked && (
                            <span className="score">You scored {score}/5 correct answers</span>
                        )}
                        {!isChecked && !isLoading && (
                            <button className="btn btn--submit" onClick={handleCheck}>
                                Check answers
                            </button>
                        )}
                        {isChecked && (
                            <button className="btn btn--submit" onClick={handleReset}>
                                Play Again
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <h1 className="title">Quizzical</h1>
                    <span className="app-description">Let's see how much You know!</span>
                    <button
                        className={`btn ${isLoading && isStarted ? "disabled" : ""}`}
                        onClick={() => setIsStarted(true)}
                    >
                        {isLoading && isStarted ? <Loader /> : "Start quiz"}
                    </button>
                </>
            )}
        </div>
    );
};
