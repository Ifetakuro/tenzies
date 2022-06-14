function Dot() {
  return <span className="dots" />;
}

function DiceBox({ children, style, holdDice }) {
  return (
    <div className="dice-face" style={style} onClick={holdDice}>
      {children}
    </div>
  );
}

export default function Die({ value, holdDice, isHeld }) {
  const styles = {
    backgroundColor: isHeld ? "#132743" : "#fff",
    color: isHeld ? "#fff" : "#132743",
  };

  let dots = Array(value)
    .fill(0)
    .map((_, i) => <Dot key={i} />);
  return (
    <DiceBox style={styles} holdDice={holdDice}>
      {dots}
    </DiceBox>
  );
}
