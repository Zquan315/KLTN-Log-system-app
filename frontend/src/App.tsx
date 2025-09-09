import React, { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { getToken } from './api';

export default function App(){
  const [authed, setAuthed] = useState(!!getToken());
  return authed ? <Dashboard onLogout={()=>{localStorage.clear(); setAuthed(false);}}/> : <Login onSuccess={()=>setAuthed(true)} />;
}
