import {useState,useEffect} from 'react';import {Link} from 'react-router-dom';
import {useApp} from '../context/AppContext.jsx';import {MOODS,CHALLENGES} from '../data.js';import BarChart from '../components/BarChart.jsx';
export default function Dashboard(){
  const {moods,entries,done,sessions}=useApp();const [q,setQ]=useState(null);
  useEffect(()=>{fetch('/quotes.json').then(r=>r.json()).then(d=>setQ(d[new Date().getDate()%d.length])).catch(()=>setQ({text:'Take a deep breath.',author:'MindBloom'}))},[]);
  const avg=moods.length?(moods.reduce((a,m)=>a+m.value,0)/moods.length).toFixed(1):'–';
  const chart=moods.slice(-7).map(m=>({...MOODS[m.value-1],...m}));
  const h=new Date().getHours();const greet=h<12?'Good morning':h<18?'Good afternoon':'Good evening';
  return <div><h2>{greet} 🌿</h2>
    {q&&<div className="card quote hero">“{q.text}”<small>— {q.author}</small></div>}
    <div className="grid stats">
      <div className="card stat"><b>{moods.length}</b>Mood logs</div><div className="card stat"><b>{avg}</b>Avg mood</div>
      <div className="card stat"><b>{entries.length}</b>Journal entries</div><div className="card stat"><b>{sessions}</b>Sessions done</div>
      <div className="card stat"><b>{done.length}/{CHALLENGES.length}</b>Challenges</div></div>
    <div className="grid two"><div className="card"><h3>Last 7 moods</h3><BarChart data={chart}/></div>
      <div className="card"><h3>Quick actions</h3><div className="col"><Link className="btn" to="/mood">Log mood</Link><Link className="btn" to="/journal">Write journal</Link>
        <Link className="btn" to="/meditate">Breathe / Meditate</Link><Link className="btn" to="/explore">Relief activities</Link></div></div></div></div>;
}
