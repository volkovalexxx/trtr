export function Header({ brand }) {
  return (
    <header className="top">
      <div className="brand">
        <span className="logo">TX</span>
        <div>
          <h1>{brand}</h1>
          <p>Wallet Dashboard</p>
        </div>
      </div>
      <button className="iconBtn">◎</button>
    </header>
  );
}
