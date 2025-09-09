import React from 'react';
import dayjs from 'dayjs';

export type Filters = {
  q?: string; label?: 'attack'|'benign'|''; from?: string; to?: string;
};
export default function FiltersBar({filters, setFilters, onSearch, onExport}:{filters:Filters, setFilters:(f:Filters)=>void, onSearch:()=>void, onExport:()=>void}){
  return (
    <div className="card" style={{padding:16, marginBottom:16}}>
      <div className="toolbar">
        <input className="input" placeholder='Search by key (e.g. "src_ip:10.0.0.5")'
               value={filters.q||''} onChange={e=>setFilters({...filters, q:e.target.value})}/>
        <select className="select" value={filters.label||''} onChange={e=>setFilters({...filters, label: e.target.value as any})}>
          <option value="">All labels</option>
          <option value="attack">attack</option>
          <option value="benign">benign</option>
        </select>
        <input className="input" type="datetime-local"
               value={filters.from||''}
               onChange={e=>setFilters({...filters, from:e.target.value})}/>
        <input className="input" type="datetime-local"
               value={filters.to||''}
               onChange={e=>setFilters({...filters, to:e.target.value})}/>
        <button className="btn btn-primary" onClick={onSearch}>Apply</button>
        <button className="btn btn-outline" onClick={onExport}>Export CSV</button>
      </div>
      <div style={{marginTop:8, color:'var(--muted)'}}>
        Tip: để xem mới nhất → để trống thời gian. Back-end trả về theo thứ tự mới→cũ.
      </div>
    </div>
  )
}

export function toEpochMs(v?: string){
  if (!v) return undefined;
  return dayjs(v).valueOf();
}
