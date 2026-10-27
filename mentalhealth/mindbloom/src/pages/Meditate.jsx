import {useState,useEffect} from 'react';import Tabs from '../components/Tabs.jsx';import {useApp} from '../context/AppContext.jsx';import useCountdown,{fmt} from '../hooks/useCountdown.js';
function Timer({label,seconds,onDone}){
  const t=useCountdown(seconds,onDone);const pct=100-(t.left/seconds)*100;
  return <div className="timer"><div className="ring" style={{background:`conic-gradient(var(--accent) ${pct}%,var(--soft) 0)`}}><div className="inner">{fmt(t.left)}</div></div>
    <p className="muted">{label}</p><div className="row center"><button className="btn" onClick={t.running?t.pause:t.start}>{t.running?'Pause':'Start'}</button><button className="btn ghost" onClick={t.reset}>Reset</button></div></div>;
}
function Meditation(){
  const {setSessions,toast}=useApp();const [min,setMin]=useState(5);
  return <div className="card center"><label>Duration: <select value={min} onChange={e=>setMin(+e.target.value)}>{[1,3,5,10,15,20].map(m=><option key={m} value={m}>{m} min</option>)}</select></label>
    <Timer key={min} label="Sit comfortably and focus on your breath" seconds={min*60} onDone={()=>{setSessions(s=>s+1);toast('Meditation complete 🧘')}}/></div>;
}
const PH=[['Inhale',4],['Hold',4],['Exhale',6]];
function Breathing(){
  const [on,setOn]=useState(false);const [i,setI]=useState(0);
  useEffect(()=>{if(!on)return;const id=setTimeout(()=>setI((i+1)%3),PH[i][1]*1000);return()=>clearTimeout(id)},[on,i]);
  const cls=!on?'':i===0?'grow':i===2?'shrink':'held';
  return <div className="card center"><div className={'orb '+cls} style={{transitionDuration:PH[i][1]+'s'}}>{on?PH[i][0]:'Ready'}</div>
    <p className="muted">Inhale 4s · Hold 4s · Exhale 6s</p><button className="btn" onClick={()=>{setOn(!on);setI(0)}}>{on?'Stop':'Start breathing'}</button></div>;
}
function Pomodoro(){
  const {setSessions,toast}=useApp();const [mode,setMode]=useState('Focus');const mins={Focus:25,'Short break':5,'Long break':15};
  return <div className="card center"><Tabs tabs={Object.keys(mins)} active={mode} onChange={setMode}/>
    <Timer key={mode} label={mode==='Focus'?'Stay focused on one task':'Relax and recharge'} seconds={mins[mode]*60} onDone={()=>{if(mode==='Focus')setSessions(s=>s+1);toast(mode+' finished 🍅')}}/></div>;
}
export default function Meditate(){
  const [tab,setTab]=useState('Meditation');
  return <div><h2>Calm Space</h2><Tabs tabs={['Meditation','Breathing','Pomodoro']} active={tab} onChange={setTab}/>
    {tab==='Meditation'&&<Meditation/>}{tab==='Breathing'&&<Breathing/>}{tab==='Pomodoro'&&<Pomodoro/>}</div>;
}
