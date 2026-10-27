export default function Tabs({tabs,active,onChange}){
  return <div className="tabs">{tabs.map(t=><button key={t} className={'tab'+(active===t?' on':'')} onClick={()=>onChange(t)}>{t}</button>)}</div>;
}
