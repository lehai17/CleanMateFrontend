import {useEffect,useRef,useState} from 'react';
import {api} from '../api/axios';

export default function EmailVerification(){
  const [user,setUser]=useState(null),[message,setMessage]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
  const active=useRef(true),pending=useRef(false);
  const load=async()=>{const result=await api.get('/api/me');if(active.current)setUser(result.data);};
  useEffect(()=>{active.current=true;load().catch(()=>{if(active.current)setError('Không thể tải trạng thái email.');});return()=>{active.current=false;};},[]);
  const run=async action=>{if(pending.current)return;pending.current=true;setBusy(true);setError('');setMessage('');try{await action();}catch(e){if(active.current)setError(e?.response?.data?.message||'Không thể xác minh email.');}finally{pending.current=false;if(active.current)setBusy(false);}};
  return <section className="mt-6 grid gap-4 rounded-xl border p-5"><h2 className="text-xl font-bold">Xác minh email</h2>
    {error&&<p role="alert">{error}</p>}{message&&<p role="status">{message}</p>}
    {!user?<button type="button" disabled={busy} onClick={()=>run(load)}>Tải lại trạng thái email</button>:<><p>{user.email}</p>{user.emailVerifiedAt?<p>Email đã được xác minh.</p>:<>
      <p>Mã dùng một lần, hết hạn sau 30 phút. Chỉ yêu cầu lại sau 2 phút.</p><button type="button" disabled={busy} onClick={()=>run(async()=>{const result=await api.post('/api/auth/request-email-verification');if(active.current)setMessage(result.data.message);})}>Gửi mã xác minh email</button>
      <form className="grid gap-4" onSubmit={e=>{e.preventDefault();const form=e.currentTarget,code=form.elements.code.value;run(async()=>{const result=await api.post('/api/auth/verify-email',{email:user.email,code});if(!active.current)return;form.reset();setMessage(result.data.message);await load();});}}><label>Mã xác minh email<input name="code" aria-label="Mã xác minh email" required minLength={64} maxLength={64} autoComplete="one-time-code" disabled={busy} className="block w-full rounded border p-3"/></label><button disabled={busy}>Xác minh email</button></form>
    </>}</>}
  </section>;
}
