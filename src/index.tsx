import React from 'react';
import ReactDOM from 'react-dom';
import {FaustInput} from "./components/faust-input";
import "./main.scss";
import "./app.scss";
import {TopPanel} from "./components/top-panel/top-panel";
import {MainArea} from "./components/main-area/main-area";

const App = () => {
  return <div className="app">
    <TopPanel/>
    <MainArea/>
    {/*<FaustInput/>*/}
  </div>
}

ReactDOM.render(<App/>, document.getElementById("root"));

console.log();