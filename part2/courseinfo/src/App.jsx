import { useState } from "react";
import Header from "./components/Header";
import Anecdote from "./components/Anecdote";
import Button from "./components/Button";

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place.",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));

  const nextAnecdote = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length);
    setSelected(randomIndex);
  };

  const voteAnecdote = () => {
    const copy = [...votes];
    copy[selected] += 1;
    setVotes(copy);
  };

  const maxVotes = Math.max(...votes);
  const topAnecdoteIndex = votes.indexOf(maxVotes);

  return (
    <div>
      <Header text="Anecdote of the day" />

      <Anecdote text={anecdotes[selected]} votes={votes[selected]} />

      <Button handleClick={voteAnecdote} text="vote" />
      <Button handleClick={nextAnecdote} text="next anecdote" />

      <Header text="Anecdote with most votes" />

      {maxVotes > 0 ? (
        <Anecdote text={anecdotes[topAnecdoteIndex]} votes={maxVotes} />
      ) : (
        <p>No votes yet</p>
      )}
    </div>
  );
};

export default App;
