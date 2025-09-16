import React from 'react';

export default function Pagination({hasNext, onNext, canPrev, onPrev}:{hasNext:boolean,onNext:()=>void,canPrev:boolean,onPrev:()=>void}){
  return (
    <div className="pagination" style={{marginTop:12}}>
      <button className="btn" onClick={onPrev} disabled={!canPrev}>Previous</button>
      <button className="btn" onClick={onNext} disabled={!hasNext}>Next</button>
    </div>
  )
}
