import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import "./App.css";
import Die from "./components/Die";
import { nanoid } from "nanoid";

export default function App() {
  const [diceArray, setDiceArray] = useState(
    JSON.parse(localStorage.getItem("diceArray")) || allNewDice()
  );
  const [tenzies, setTenzies] = useState(false);
  const [duration, setDuration] = useState(
    JSON.parse(localStorage.getItem("duration")) || 0
  );

  useEffect(() => {
    //local storage for the dice and time
    localStorage.setItem("diceArray", JSON.stringify(diceArray));
    localStorage.setItem("duration", JSON.stringify(duration));

    //checking if the player has won
    const allTrue = diceArray.every((dice) => dice.isHeld);
    const firstValue = diceArray[0].value;
    const sameValues = diceArray.every((dice) => dice.value === firstValue);

    //duration
    const timer = setInterval(() => {
      setDuration((prevTime) => prevTime + 1);
    }, 1000);

    if (allTrue && sameValues) {
      setTenzies(true);
      clearInterval(timer);
    }
    return () => {
      clearInterval(timer);
    };
  }, [diceArray, duration]);

  function allNewDice() {
    let newArr = [];

    for (let i = 0; i < 10; i++) {
      newArr.push(getNewDice());
    }
    return newArr;
  }

  function getNewDice() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function rollDice() {
    if (tenzies) {
      setDiceArray(allNewDice());
      setDuration(0);
      setTenzies(false);
    } else {
      setDiceArray((prevState) =>
        prevState.map((die) => {
          return die.isHeld ? die : getNewDice();
        })
      );
    }
  }

  function holdDice(id) {
    setDiceArray((prevState) =>
      prevState.map((die) => {
        if (die.id === id) {
          return { ...die, isHeld: !die.isHeld };
        } else return { ...die };
      })
    );
  }

  const diceElement = diceArray.map((die) => {
    return (
      <Die
        value={die.value}
        key={die.id}
        isHeld={die.isHeld}
        holdDice={() => holdDice(die.id)}
      />
    );
  });

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">{tenzies ? "Congratulations" : "Tenzies"}</h1>
      {!tenzies && (
        <p className="instructions">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
      )}
      <div className="dice-container">{diceElement}</div>
      <div>Duration: {duration}s</div>
      <button onClick={rollDice} className="dice-btn">
        {tenzies ? "New Game" : "Roll dice"}
      </button>
    </main>
  );
}
