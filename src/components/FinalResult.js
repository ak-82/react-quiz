import {useQuiz} from "../context/QuizContext";

export default function FinalResult() {
    const {questions,points, highScore,dispatch} = useQuiz();

    const maxPoints = questions.reduce((prev, curr) => prev + curr.points, 0);
    const percentage = Math.ceil(points / maxPoints * 100)
    console.log(percentage, points, maxPoints)
    let emoji;
    if (percentage === 100) {
        emoji = "⭐⭐⭐⭐⭐";
    } else if (percentage>=80 &&percentage < 100) {
        emoji = "⭐⭐⭐⭐";
    } else if (percentage >= 50 && percentage < 80) {
        emoji = "⭐⭐⭐";
    } else if (percentage > 0 && percentage < 50) {
        emoji = "⭐⭐";
    } else if (percentage === 0) {
        emoji = "⭐";
    } else {
        emoji = "";
    }
    return (
        <>
            <p className="result">
                You scored <strong>{points}</strong> out of {maxPoints} ({percentage}%)
                <br/>
                <span>{emoji}</span>
            </p>
            <p className="highscore">(HighScore : {highScore} points)</p>
            <button className="btn btn-ui" onClick={() => dispatch({type: "reset"})}>
                Restart Quiz
            </button>
        </>
    )
}