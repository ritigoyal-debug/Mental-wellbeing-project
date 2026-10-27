import {useState,useEffect} from 'react';
export default function useLocalStorage(key,init){
  const [v,setV]=useState(()=>{try{const s=localStorage.getItem(key);return s?JSON.parse(s):init}catch{return init}});
  useEffect(()=>{localStorage.setItem(key,JSON.stringify(v))},[key,v]);
  return [v,setV];
}
