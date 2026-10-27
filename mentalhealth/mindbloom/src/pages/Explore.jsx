import {useState,useEffect} from 'react';import Tabs from '../components/Tabs.jsx';import {useApp} from '../context/AppContext.jsx';import {ACTIVITIES,CHALLENGES,RESOURCES} from '../data.js';
function Quotes(){
  const [list,setList]=useState([]);const [i,setI]=useState(0);const [status,setStatus]=useState('loading');
  const [fav,setFav]=useState(()=>JSON.parse(localStorage.getItem('mb-fav')||'[]'));const {toast}=useApp();
  useEffect(()=>{fetch('/quotes.json').then(r=>r.json()).then(d=>{setList(d);setI(Math.floor(Math.random()*d.length));setStatus('ok')}).catch(()=>setStatus('error'))},[]);
  useEffect(()=>{localStorage.setItem('mb-fav',JSON.stringify(fav))},[fav]);
  if(status==='loading')return <p>Loading…</p>;if(status==='error')return <p className="err">Could not load quotes.</p>;
  const q=list[i];const isFav=fav.includes(q.id);
  return <div className="card quote hero">“{q.text}”<small>— {q.author}</small><div className="row center">
    <button className="btn" onClick={()=>setI((i+1+Math.floor(Math.random()*(list.length-1)))%list.length)}>New quote</button>
    <button className="btn ghost" onClick={()=>{setFav(isFav?fav.filter(x=>x!==q.id):[...fav,q.id]);toast(isFav?'Removed from favourites':'Saved ❤️')}}>{isFav?'♥ Saved':'♡ Save'}</button></div>
    {fav.length>0&&<p className="muted">Favourites: {list.filter(x=>fav.includes(x.id)).map(x=>x.text.slice(0,28)+'…').join(' | ')}</p>}</div>;
}
function Activities(){
  const [cat,setCat]=useState('All');const [q,setQ]=useState('');const cats=['All',...new Set(ACTIVITIES.map(a=>a.cat))];
  const list=ACTIVITIES.filter(a=>(cat==='All'||a.cat===cat)&&a.title.toLowerCase().includes(q.toLowerCase()));
  return <div><div className="row card"><input placeholder="Search…" value={q} onChange={e=>setQ(e.target.value)}/><select value={cat} onChange={e=>setCat(e.target.value)}>{cats.map(c=><option key={c}>{c}</option>)}</select></div>
    <div className="grid two">{list.map(a=><div className="card" key={a.id}><span className="tag">{a.cat}</span><h3>{a.title}</h3><p>{a.desc}</p></div>)}</div></div>;
}
function Challenges(){
  const {done,setDone,toast}=useApp();const pct=Math.round(done.length/CHALLENGES.length*100);
  const tog=c=>{const d=done.includes(c);setDone(d?done.filter(x=>x!==c):[...done,c]);if(!d)toast('Nice work! 🌟')};
  return <div className="card"><h3>Self-care challenges — {pct}%</h3><div className="progress"><div style={{width:pct+'%'}}/></div>
    {CHALLENGES.map(c=><label className="item row" key={c}><span>{c}</span><input type="checkbox" checked={done.includes(c)} onChange={()=>tog(c)}/></label>)}
    <button className="btn ghost" onClick={()=>setDone([])}>Reset all</button></div>;
}
function Resources(){
  const [q,setQ]=useState('');const [cat,setCat]=useState('All');const [open,setOpen]=useState(null);const cats=['All',...new Set(RESOURCES.map(r=>r.cat))];
  const list=RESOURCES.filter(r=>(cat==='All'||r.cat===cat)&&r.title.toLowerCase().includes(q.toLowerCase()));
  return <div><div className="row card"><input placeholder="Search resources…" value={q} onChange={e=>setQ(e.target.value)}/><select value={cat} onChange={e=>setCat(e.target.value)}>{cats.map(c=><option key={c}>{c}</option>)}</select></div>
    {list.map(r=><div className="card" key={r.id}><div className="row"><b>{r.title} <span className="tag">{r.cat}</span></b><button className="btn ghost" onClick={()=>setOpen(open===r.id?null:r.id)}>{open===r.id?'Hide':'Read'}</button></div>{open===r.id&&<p>{r.tip}</p>}</div>)}</div>;
}
export default function Explore(){
  const [tab,setTab]=useState('Quotes');const V={Quotes,Activities,Challenges,Resources}[tab];
  return <div><h2>Explore</h2><Tabs tabs={['Quotes','Activities','Challenges','Resources']} active={tab} onChange={setTab}/><V/></div>;
}
