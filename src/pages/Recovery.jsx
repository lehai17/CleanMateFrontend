import { Ui } from './../ui/Preferences';
import {useRef,useState} from 'react';
import { Link } from './../ui/Links';
import {api} from '../api/axios';

export default function Recovery() {
  const [email,setEmail]=useState(''),[message,setMessage]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false),[done,setDone]=useState(false);
  const pending=useRef(false);
  const run=async action=>{
    if(pending.current)return;pending.current=true;setBusy(true);setError('');setMessage('');
    try{await action();}catch(e){setError(e?.response?.data?.message||'Không thể xử lý. Vui lòng thử lại.');}finally{pending.current=false;setBusy(false);}
  };
  return <Ui as="main" className="mx-auto max-w-xl px-4 py-10"><Ui as="h1" className="text-2xl font-bold">Khôi phục mật khẩu</Ui><Ui as="p" className="my-4">Nhập email đăng ký, sau đó dán mã nhận qua email để đặt mật khẩu mới. Mã có hiệu lực 30 phút. Tài khoản chỉ đăng nhập Google tiếp tục khôi phục qua Google.</Ui>
    {error&&<Ui as="p" role="alert" className="my-4 text-red-700">{error}</Ui>}{message&&<Ui as="p" role="status" className="my-4 text-emerald-800">{message}</Ui>}
    {!done&&<><Ui as="form" className="grid gap-4 rounded-xl border p-5" onSubmit={e=>{e.preventDefault();run(async()=>setMessage((await api.post('/api/auth/forgot-password',{email})).data.message));}}>
      <Ui as="label">Email khôi phục<Ui as="input" aria-label="Email khôi phục" type="email" required maxLength={254} value={email} disabled={busy} onChange={e=>setEmail(e.target.value)} autoComplete="email" className="block w-full rounded border p-3"/></Ui><Ui as="button" disabled={busy} className="rounded bg-emerald-700 p-3 text-white">Gửi mã khôi phục</Ui></Ui>
      <Ui as="form" className="mt-6 grid gap-4 rounded-xl border p-5" onSubmit={e=>{e.preventDefault();const form=e.currentTarget;const code=form.elements.code.value,newPassword=form.elements.newPassword.value;if(newPassword!==form.elements.confirmation.value){setError('Hai mật khẩu mới không khớp.');return;}run(async()=>{const result=await api.post('/api/auth/reset-password',{email,code,newPassword});form.reset();setDone(true);setMessage(result.data.message);});}}>
        <Ui as="label">Mã khôi phục<Ui as="input" name="code" aria-label="Mã khôi phục" required minLength={64} maxLength={64} autoComplete="one-time-code" spellCheck={false} disabled={busy} className="block w-full rounded border p-3"/></Ui>
        <Ui as="label">Mật khẩu khôi phục mới<Ui as="input" name="newPassword" aria-label="Mật khẩu khôi phục mới" type="password" required minLength={12} maxLength={72} autoComplete="new-password" disabled={busy} className="block w-full rounded border p-3"/></Ui>
        <Ui as="label">Nhập lại mật khẩu khôi phục<Ui as="input" name="confirmation" aria-label="Nhập lại mật khẩu khôi phục" type="password" required maxLength={72} autoComplete="new-password" disabled={busy} className="block w-full rounded border p-3"/></Ui>
        <Ui as="p">Mật khẩu mới tối thiểu 12 ký tự, tối đa 72 byte UTF-8. Các phiên cũ sẽ bị thu hồi.</Ui><Ui as="button" disabled={busy||!email.trim()} className="rounded bg-emerald-700 p-3 text-white">Đặt lại mật khẩu</Ui>
      </Ui></>}
    <Link to="/login" className="mt-6 block text-emerald-800 underline">Quay lại đăng nhập</Link>
  </Ui>;
}
