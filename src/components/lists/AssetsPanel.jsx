export function AssetsPanel({ assets }) {
  return (
    <section className="panel">
      <div className="panelHead"><h2>Assets</h2><button className="linkBtn">See all</button></div>
      <div className="assetList">
        {assets.map((asset) => (
          <article className="asset" key={`${asset.symbol}-${asset.network}`}>
            <div className="dot red"></div>
            <div><strong>{asset.symbol}</strong><span>{asset.network}</span></div>
            <p>${asset.valueUsd.toFixed(2)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
