import {useState,useEffect,useRef} from 'react';
export default function useCountdown(seconds,onDone){
  const [left,setLeft]=useState(seconds);const [running,setRunning]=useState(false);const cb=useRef(onDone);cb.current=onDone;
  useEffect(()=>{setLeft(seconds);setRunning(false)},[seconds]);
  useEffect(()=>{if(!running)return;const id=setInterval(()=>setLeft(l=>{if(l<=1){clearInterval(id);setRunning(false);cb.current&&cb.current();return 0}return l-1}),1000);return()=>clearInterval(id)},[running]);
  return {left,running,start:()=>left>0&&setRunning(true),pause:()=>setRunning(false),reset:()=>{setRunning(false);setLeft(seconds)}};
}
export const fmt=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
