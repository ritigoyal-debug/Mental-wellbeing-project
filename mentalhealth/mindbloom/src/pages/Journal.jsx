import {useState,useEffect} from 'react';import {useApp} from '../context/AppContext.jsx';import Modal from '../components/Modal.jsx';import {today} from '../data.js';
const PER=4;
export default function Journal(){
  const {entries,setEntries,toast}=useApp();
  const [modal,setModal]=useState(null);const [q,setQ]=useState('');const [sort,setSort]=useState('new');const [page,setPage]=useState(1);
  const [f,setF]=useState({title:'',body:''});const [err,setErr]=useState('');
  let list=entries.filter(e=>(e.title+e.body).toLowerCase().includes(q.toLowerCase()));
  list=[...list].sort((a,b)=>sort==='new'?b.id-a.id:sort==='old'?a.id-b.id:a.title.localeCompare(b.title));
  const pages=Math.max(1,Math.ceil(list.length/PER));useEffect(()=>{if(page>pages)setPage(pages)},[pages,page]);
  const shown=list.slice((page-1)*PER,page*PER);
  const open=e=>{setErr('');setF(e?{title:e.title,body:e.body}:{title:'',body:''});setModal(e||{})};
  const save=ev=>{ev.preventDefault();
    if(f.title.trim().length<3)return setErr('Title must be at least 3 characters.');if(f.body.trim().length<10)return setErr('Entry must be at least 10 characters.');
    if(modal.id){setEntries(entries.map(e=>e.id===modal.id?{...e,...f}:e));toast('Entry updated ✏️')}
    else{setEntries([{id:Date.now(),date:today(),...f},...entries]);toast('Entry added 📓')}setModal(null)};
  const del=id=>{if(confirm('Delete this entry?')){setEntries(entries.filter(e=>e.id!==id));toast('Entry deleted')}};
  return <div><div className="row"><h2>Daily Journal</h2><button className="btn" onClick={()=>open(null)}>+ New entry</button></div>
    <div className="row card"><input placeholder="🔍 Search entries…" value={q} onChange={e=>{setQ(e.target.value);setPage(1)}}/>
      <select value={sort} onChange={e=>setSort(e.target.value)}><option value="new">Newest</option><option value="old">Oldest</option><option value="az">Title A–Z</option></select></div>
    {!shown.length&&<p className="muted">No entries found.</p>}
    <div className="grid two">{shown.map(e=><div className="card" key={e.id}><h3>{e.title}</h3><small className="muted">{e.date}</small><p>{e.body}</p>
      <div className="row"><button className="btn ghost" onClick={()=>open(e)}>Edit</button><button className="btn danger" onClick={()=>del(e.id)}>Delete</button></div></div>)}</div>
    <div className="row pager"><button className="btn ghost" disabled={page===1} onClick={()=>setPage(page-1)}>← Prev</button><span>Page {page} / {pages}</span>
      <button className="btn ghost" disabled={page===pages} onClick={()=>setPage(page+1)}>Next →</button></div>
    {modal&&<Modal title={modal.id?'Edit entry':'New entry'} onClose={()=>setModal(null)}><form className="col" onSubmit={save}>
      <input placeholder="Title" value={f.title} onChange={e=>setF({...f,title:e.target.value})}/>
      <textarea rows="6" placeholder="Write about your day…" value={f.body} onChange={e=>setF({...f,body:e.target.value})}/>
      {err&&<p className="err">{err}</p>}<button className="btn">Save</button></form></Modal>}</div>;
}
