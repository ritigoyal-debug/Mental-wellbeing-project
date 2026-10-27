const COL=['','#e57373','#ffb74d','#fff176','#81c784','#4db6ac'];
export default function BarChart({data}){
  if(!data.length)return <p className="muted">No mood data yet. Log your first mood!</p>;
  return <div className="chart">{data.map(d=><div key={d.id} className="bar-wrap" title={`${d.date}: ${d.label}`}>
    <div className="bar" style={{height:d.value*20+'%',background:COL[d.value]}}>{d.emoji}</div><small>{d.date.slice(5)}</small></div>)}</div>;
}
