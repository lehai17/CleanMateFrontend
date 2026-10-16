import {useRef,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import {api} from '../api/axios';
import EmailVerification from '../components/EmailVerification';
export default function Security() {
  const {logout}=useAuth(),navigate=useNavigate();const [error,setError]=useState(''),[busy,setBusy]=useState(false);const pending=useRef(false);
  const revoke=async()=>{
    if(pending.current||!window.confirm('Đăng xuất tất cả thiết bị, gồm cả thiết bị này?'))return;
    pending.current=true;setBusy(true);setError('');
    try{await api.post('/api/auth/logout-all');sessionStorage.setItem('cm_sessions_revoked','1');logout();navigate('/login',{replace:true,state:{sessionsRevoked:true}});}
    catch(e){if(e?.response?.status===401){logout();navigate('/login',{replace:true});}else setError(e?.response?.data?.message || 'Không thể đăng xuất. Vui lòng thử lại.');}
    finally{pending.current=false;setBusy(false);}
  };
  const submit=async event=>{
    event.preventDefault();if(pending.current)return;const form=event.currentTarget;
    if(form.elements.newPassword.value!==form.elements.confirmation.value){setError('Hai mật khẩu mới không khớp.');return;}
    pending.current=true;setBusy(true);setError('');
    try{await api.post('/api/auth/change-password',{currentPassword:form.elements.currentPassword.value,newPassword:form.elements.newPassword.value});form.reset();sessionStorage.setItem('cm_password_changed','1');logout();navigate('/login',{replace:true,state:{passwordChanged:true}});}
    catch(e){if(e?.response?.status===401){logout();navigate('/login',{replace:true});}else setError(e?.response?.data?.message || 'Không thể đổi mật khẩu. Vui lòng thử lại.');}
    finally{pending.current=false;setBusy(false);}
  };
  return <main className="mx-auto max-w-xl px-4 py-8"><h1 className="text-2xl font-bold">Đổi mật khẩu</h1><p className="my-4">Mật khẩu mới ít nhất 12 ký tự. Sau khi lưu, tất cả phiên đăng nhập cũ sẽ hết hiệu lực, gồm cả phiên này.</p><form onSubmit={submit} className="grid gap-4 rounded-xl border p-5">
    {[['Mật khẩu hiện tại','currentPassword','current-password'],['Mật khẩu mới','newPassword','new-password'],['Nhập lại mật khẩu mới','confirmation','new-password']].map(([label,name,autocomplete])=><label key={name}>{label}<input name={name} aria-label={label} type="password" autoComplete={autocomplete} required minLength={name==='newPassword'?12:undefined} maxLength={name==='currentPassword'?128:72} className="block w-full rounded border p-3" /></label>)}
    <button disabled={busy} className="rounded bg-emerald-700 p-3 text-white disabled:opacity-50">{busy?'Đang lưu...':'Lưu mật khẩu mới'}</button></form>
    <section className="mt-6 rounded-xl border p-5"><h2 className="text-xl font-bold">Quản lý phiên đăng nhập</h2><p className="my-4">Đăng xuất tất cả thiết bị, gồm cả thiết bị này. Mật khẩu không thay đổi. Áp dụng cả với tài khoản Google.</p><button type="button" disabled={busy} onClick={revoke} className="rounded bg-red-700 p-3 text-white disabled:opacity-50">Đăng xuất tất cả thiết bị</button></section>{error&&<p role="alert">{error}</p>}<EmailVerification/></main>;
}
