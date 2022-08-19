import React from "react";
// eslint-disable-next-line
export default ({
    id,
    question,
    correct_answer,
    incorrect_answers,
    handleClick,
    selected_answer,
    isStarted,
    isChecked,
}) => {
    const [randomIndex, setRandomIndex] = React.useState((Math.random() * 3).toFixed(0));
    // eslint-disable-next-line
    const [answersArray, setAnswersArray] = React.useState(getAnswersArray());
    const [answersElements, setAnswersElements] = React.useState(getAnswersElements());

    React.useEffect(() => {
        if (isStarted) setRandomIndex((Math.random() * 3).toFixed(0));
    }, [isStarted]);

    React.useEffect(() => {
        if (selected_answer) setAnswersElements(getAnswersElements());
        // eslint-disable-next-line
    }, [selected_answer]);

    function getAnswersArray() {
        const answersArray = [...incorrect_answers];
        answersArray.splice(randomIndex, 0, correct_answer);
        return answersArray;
    }

    function getAnswersElements() {
        const newArray = answersArray.map(answer => {
            return (
                <span
                    key={answer}
                    className={`answer ${answer === selected_answer ? "active" : ""} `}
                    onClick={event => handleClick(event)}
                >
                    {answer}
                </span>
            );
        });

        return newArray;
    }

    function getCheckedAnswersElements() {
        const checkedAnswersArray = answersArray.map(answer => {
            return (
                <span
                    key={answer}
                    className={`answer ${answer === correct_answer ? "success" : "incorrect"} ${
                        answer === selected_answer && answer !== correct_answer ? "fail" : ""
                    }`}
                >
                    {answer}
                </span>
            );
        });
        return checkedAnswersArray;
    }

    React.useEffect(() => {
        if (isChecked) setAnswersElements(getCheckedAnswersElements());
        // eslint-disable-next-line
    }, [isChecked]);

    return (
        <div className="question-container" id={id}>
            <span className="question">{question}</span>
            <div className="answers">{answersElements}</div>
        </div>
    );
};
