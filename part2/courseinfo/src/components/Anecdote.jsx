const Anecdote = ({ text, votes }) => {
  return (
    <div>
      <p>{text}</p>
      <p>has {votes} votes</p>
    </div>
  );
};

export default Anecdote;
