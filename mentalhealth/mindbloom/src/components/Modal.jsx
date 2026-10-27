export default function Modal({title,onClose,children}){
  return <div className="overlay" onClick={onClose}><div className="modal card" onClick={e=>e.stopPropagation()}>
    <div className="row"><h3>{title}</h3><button className="btn ghost" onClick={onClose}>✕</button></div>{children}</div></div>;
}
