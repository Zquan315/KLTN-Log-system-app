import React from 'react';

export default function LogTable({rows}:{rows:any[]}){
  return (
    <div className="card" style={{padding:8}}>
      <table className="table">
        <thead>
          <tr>
            <th style={{width:180}}>Time</th>
            <th style={{width:120}}>Label</th>
            <th style={{width:240}}>Key</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r,idx)=>(
            <tr key={idx}>
              <td>{new Date(Number(r.ts)).toLocaleString()}</td>
              <td><span className={`badge ${r.label==='attack'?'badge-attack':'badge-benign'}`}>{r.label}</span></td>
              <td>{r.key}</td>
              <td>{r.message}</td>
            </tr>
          ))}
          {rows.length===0 && <tr><td colSpan={4} style={{color:'var(--muted)'}}>No data</td></tr>}
        </tbody>
      </table>
    </div>
  )
}
