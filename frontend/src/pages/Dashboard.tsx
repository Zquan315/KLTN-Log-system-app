import React, { useEffect, useState } from 'react';
import { api } from '../api';
import FiltersBar, { Filters, toEpochMs } from '../components/Filters';
import LogTable from '../components/LogTable';
import Pagination from '../components/Pagination';

export default function Dashboard({ onLogout }:{ onLogout: ()=>void }){
  const [filters, setFilters] = useState<Filters>({});
  const [rows, setRows] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string|undefined>();
  const [prevStack, setPrevStack] = useState<string[]>([]);
  const [hasNext, setHasNext] = useState(false);

  const load = async (reset=false, cur?:string) => {
    const params:any = {
      q: filters.q || undefined,
      label: filters.label || undefined,
      from: toEpochMs(filters.from),
      to: toEpochMs(filters.to),
      limit: 20,
      cursor: cur
    };
    const res = await api.logs(params);
    setRows(res.items);
    setHasNext(!!res.nextCursor);
    setCursor(res.nextCursor || undefined);
    if (reset) setPrevStack([]); // reset stack khi apply filter
  }

  useEffect(() => { load(true); }, []);

  return (
    <div className="container">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', margin:'12px 0'}}>
        <h2 style={{margin:0}}>IDS Log Dashboard</h2>
        <button className="btn" onClick={onLogout}>Logout</button>
      </div>

      <FiltersBar
        filters={filters}
        setFilters={setFilters}
        onSearch={()=>load(true)}
        onExport={()=>api.exportCsv({
          q: filters.q||undefined,
          label: filters.label||undefined,
          from: toEpochMs(filters.from),
          to: toEpochMs(filters.to),
          limit: 1000
        })}
      />

      <LogTable rows={rows} />

      <Pagination
        hasNext={hasNext}
        onNext={()=>{
          if (cursor){ setPrevStack(s=>[...s, cursor as any]); load(false, cursor); }
        }}
        canPrev={prevStack.length>0}
        onPrev={()=>{
          const prev = [...prevStack];
          prev.pop(); // bỏ current
          const cur = prev.pop(); // lấy cursor của page trước trước (do backend trả nextCursor)
          setPrevStack(prev);
          load(false, cur);
        }}
      />
    </div>
  )
}
