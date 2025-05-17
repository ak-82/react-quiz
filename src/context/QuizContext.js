import {createContext, useContext, useEffect, useReducer} from "react";
import Error from "../components/Error";

const QuizContext = createContext();

const initialState = {
    questions: [],
    status: "loading",
    index: 0,
    answer: null,
    points: 0,
    highScore: 0,
    secondsRemaining: null,
}

function reducer(state, action) {

    switch (action.type) {
        case "dataReceived":
            return {...state, questions: action.payload, status: "ready"};
        case "error":
            return {...state, status: "error"};
        case "start":
            return {...state, status: "active", secondsRemaining: state.questions.length * 30};
        case "newAnswer":
            const question = state.questions.at(state.index);
            return {
                ...state,
                answer: action.payload,
                points: action.payload === question.correctOption
                    ? state.points + question.points
                    : state.points
            };
        case "nextQuestion":
            return {
                ...state,
                index: state.index + 1,
                answer: null
            }
        case "finish":
            return {
                ...state,
                status: "finished",
                highScore: state.points > state.highScore ? state.points : state.highScore
            };
        case "reset":
            return {
                ...state,
                status: "ready",
                index: 0,
                answer: null,
                points: 0,
            };
        case "timer":
            return {
                ...state,
                status: state.secondsRemaining === 0 ? "finished" : state.status,
                secondsRemaining: state.secondsRemaining - 1,
            }
        default:
            throw new Error("Unknown action type");
    }
}

function QuizProvider ({ children }) {
    const [{
        questions,
        status,
        index,
        answer,
        points,
        highScore,
        secondsRemaining
    }, dispatch] = useReducer(reducer, initialState)

    useEffect(function () {
        fetch("http://localhost:8910/questions")
            .then(res => res.json())
            .then(data => dispatch({type: "dataReceived", payload: data}))
            .catch(err => dispatch({type: "dataFailed"}));
    }, [])


    return (
        <QuizContext.Provider value={{
            questions,
            status,
            index,
            answer,
            points,
            highScore,
            secondsRemaining,
            dispatch,
            numQuestions:questions.length,
        }}>
            {children}
        </QuizContext.Provider>
    );
}

function useQuiz() {
    return useContext(QuizContext);
}

export {QuizProvider,useQuiz}