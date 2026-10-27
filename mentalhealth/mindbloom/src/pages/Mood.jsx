import {useState} from 'react';import {useApp} from '../context/AppContext.jsx';import {MOODS,today} from '../data.js';import BarChart from '../components/BarChart.jsx';
export default function Mood(){
  const {moods,setMoods,toast}=useApp();
  const [f,setF]=useState({value:0,note:'',date:today()});const [err,setErr]=useState('');const [flt,setFlt]=useState('all');const [sort,setSort]=useState('new');
  const submit=e=>{e.preventDefault();
    if(!f.value)return setErr('Please select a mood.');if(!f.date)return setErr('Please pick a date.');if(f.note.length>200)return setErr('Note max 200 characters.');
    setErr('');setMoods([...moods,{id:Date.now(),value:f.value,note:f.note.trim(),date:f.date}]);setF({value:0,note:'',date:today()});toast('Mood saved ✅')};
  const del=id=>{setMoods(moods.filter(m=>m.id!==id));toast('Mood deleted')};
  let list=moods.filter(m=>flt==='all'||m.value===+flt);
  list=[...list].sort((a,b)=>sort==='new'?b.date.localeCompare(a.date)||b.id-a.id:sort==='old'?a.date.localeCompare(b.date):b.value-a.value);
  const chart=[...moods].sort((a,b)=>a.date.localeCompare(b.date)).slice(-10).map(m=>({...MOODS[m.value-1],...m}));
  const dist=MOODS.map(m=>({...m,n:moods.filter(x=>x.value===m.value).length}));
  return <div><h2>Mood Tracker</h2><div className="grid two">
    <form className="card col" onSubmit={submit}><h3>How are you feeling?</h3>
      <div className="emojis">{MOODS.map(m=><button type="button" key={m.value} className={'emoji'+(f.value===m.value?' on':'')} onClick={()=>setF({...f,value:m.value})} title={m.label}>{m.emoji}</button>)}</div>
      <input type="date" max={today()} value={f.date} onChange={e=>setF({...f,date:e.target.value})}/>
      <textarea placeholder="Add a note (optional)" value={f.note} onChange={e=>setF({...f,note:e.target.value})}/>
      {err&&<p className="err">{err}</p>}<button className="btn">Save mood</button></form>
    <div className="card"><h3>Analytics – last 10 logs</h3><BarChart data={chart}/>
      <div className="dist">{dist.map(d=><span key={d.value}>{d.emoji} {d.n}</span>)}</div></div></div>
    <div className="card"><div className="row"><h3>History</h3><div className="row">
      <select value={flt} onChange={e=>setFlt(e.target.value)}><option value="all">All moods</option>{MOODS.map(m=><option key={m.value} value={m.value}>{m.emoji} {m.label}</option>)}</select>
      <select value={sort} onChange={e=>setSort(e.target.value)}><option value="new">Newest</option><option value="old">Oldest</option><option value="high">Highest mood</option></select></div></div>
      {!list.length&&<p className="muted">Nothing to show.</p>}
      {list.map(m=><div className="item row" key={m.id}><span>{MOODS[m.value-1].emoji} <b>{MOODS[m.value-1].label}</b> · {m.date}<br/><small className="muted">{m.note}</small></span>
        <button className="btn danger" onClick={()=>del(m.id)}>Delete</button></div>)}</div></div>;
}
