import Header from "./Header";
import Main from "./Main";
import {useEffect, useReducer} from "react";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";

const initialState = {
    questions: [],
    status: "loading",
    index: 0
}

function reducer(state, action) {
    switch (action.type) {
        case "dataReceived":
            return {...state, questions: action.payload, status: "ready"};
        case "error":
            return {...state, status: "error"};
        case "start":
            return {...state, status: "active"};
        default:
            throw new Error("Unknown action type");
    }
}

export default function App() {
    const [{questions, status, index}, dispatch] = useReducer(reducer, initialState)
    console.log(questions[index]);
    useEffect(function () {
        fetch("http://localhost:1234/questions")
            .then(res => res.json())
            .then(data => dispatch({type: "dataReceived", payload: data}))
            .catch(err => dispatch({type: "dataFailed"}));
    }, [])
    return (
        <div className="app">
            <Header/>
            <Main>
                {status === "loading" && <Loader/>}
                {status === "error" && <Error/>}
                {status === "ready" && <StartScreen numQuestions={questions.length} dispatch={dispatch}/>}
                {status === "active" && <Question question={questions[index]}/>}
            </Main>
        </div>
    );
}
