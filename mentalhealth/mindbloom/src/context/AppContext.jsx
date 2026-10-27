import {createContext,useContext,useState,useEffect} from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';
const Ctx=createContext();export const useApp=()=>useContext(Ctx);
export function AppProvider({children}){
  const [theme,setTheme]=useLocalStorage('mb-theme','light');
  const [moods,setMoods]=useLocalStorage('mb-moods',[]);
  const [entries,setEntries]=useLocalStorage('mb-journal',[]);
  const [done,setDone]=useLocalStorage('mb-challenges',[]);
  const [sessions,setSessions]=useLocalStorage('mb-sessions',0);
  const [toasts,setToasts]=useState([]);
  useEffect(()=>{document.documentElement.dataset.theme=theme},[theme]);
  const toast=m=>{const id=Date.now()+Math.random();setToasts(t=>[...t,{id,m}]);setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),2500)};
  return <Ctx.Provider value={{theme,setTheme,moods,setMoods,entries,setEntries,done,setDone,sessions,setSessions,toast}}>
    {children}<div className="toasts">{toasts.map(t=><div key={t.id} className="toast">{t.m}</div>)}</div></Ctx.Provider>;
}
