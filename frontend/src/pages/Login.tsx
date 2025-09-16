import React, { useState } from 'react';
import { api, setToken } from '../api';

export default function Login({ onSuccess }: { onSuccess: ()=>void }){
  const [username, setU] = useState('admin');
  const [password, setP] = useState('admin123');
  const [err, setErr] = useState('');

  const submit = async (e: any) => {
    e.preventDefault();
    try{
      const res = await api.login(username, password);
      setToken(res.accessToken);
      onSuccess();
    }catch(e:any){ setErr(e.message) }
  }

  return (
    <div className="container">
      <div className="card" style={{maxWidth:420, margin:'80px auto', padding:24}}>
        <h2 style={{marginTop:0}}>IDS Log Dashboard</h2>
        <p style={{color:'var(--muted)'}}>Sign in with your username & password</p>
        <form onSubmit={submit}>
          <div style={{margin:'12px 0'}}>
            <label>Username</label>
            <input className="input" value={username} onChange={e=>setU(e.target.value)} />
          </div>
          <div style={{margin:'12px 0'}}>
            <label>Password</label>
            <input type="password" className="input" value={password} onChange={e=>setP(e.target.value)} />
          </div>
          {err && <div style={{color:'var(--danger)', margin:'8px 0'}}>{err}</div>}
          <button className="btn btn-primary" type="submit" style={{width:'100%'}}>Sign in</button>
        </form>
      </div>
    </div>
  )
}
