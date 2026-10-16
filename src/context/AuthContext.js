import React,{createContext,useContext,useEffect,useRef,useState} from 'react';
import {meApi} from '../api/auth';
import {api} from '../api/axios';
import {Ui} from '../ui/Preferences';
import {createSessionGuard,currentSessionExpired} from '../auth/session';

const AuthContext=createContext(null);
const storedToken=()=>{try{return localStorage.getItem('cm_token');}catch{return null;}};
export function AuthProvider({children}){
  const [user,setUser]=useState(null),[loading,setLoading]=useState(true),[restoreError,setRestoreError]=useState('');
  const guard=useRef(null);if(!guard.current)guard.current=createSessionGuard(storedToken());
  const userRef=useRef(null),alive=useRef(true);
  const callbackToken=guard.current.snapshot().token;
  const accept=current=>{userRef.current=current;setUser(current);};
  const clearSession=()=>{
    guard.current.replace(null);accept(null);setRestoreError('');setLoading(false);
    localStorage.removeItem('cm_user');localStorage.removeItem('cm_token');
  };
  const logout=()=>{if(guard.current.snapshot().token===callbackToken)clearSession();};
  const restore=async()=>{
    const expected=guard.current.replace(storedToken());setRestoreError('');setLoading(Boolean(expected.token));
    if(!expected.token){accept(null);return;}
    try{
      const current=await meApi();if(!alive.current||!guard.current.isCurrent(expected))return;
      localStorage.setItem('cm_user',JSON.stringify(current));accept(current);
    }catch(error){
      if(!alive.current||!guard.current.isCurrent(expected))return;
      if(error?.response?.status===401)clearSession();
      else setRestoreError('Không thể kết nối để kiểm tra tài khoản. Vui lòng thử lại.');
    }finally{if(alive.current&&guard.current.isCurrent(expected))setLoading(false);}
  };
  useEffect(()=>{
    alive.current=true;
    const requestId=api.interceptors.request.use(config=>{
      const expected=guard.current.snapshot().token;
      if(storedToken()!==expected){void restore();return Promise.reject(new Error('Phiên đăng nhập đã thay đổi. Vui lòng thử lại.'));}
      config.cleanmateToken=expected;return config;
    });
    const id=api.interceptors.response.use(response=>response,error=>{
      if(alive.current&&currentSessionExpired(error,guard.current.snapshot().token))clearSession();
      return Promise.reject(error);
    });
    const synchronize=event=>{if(event.key==='cm_token'||event.key===null)void restore();};
    window.addEventListener('storage',synchronize);
    restore();
    return()=>{alive.current=false;guard.current.replace(guard.current.snapshot().token);api.interceptors.response.eject(id);api.interceptors.request.eject(requestId);window.removeEventListener('storage',synchronize);};
    // Restoration runs on mount; callbacks read the current guard, not a stale user.

  },[]);
  const login=(current,token)=>{
    if(guard.current.snapshot().token!==callbackToken)return;
    localStorage.setItem('cm_token',token);localStorage.setItem('cm_user',JSON.stringify(current));
    guard.current.replace(token);accept(current);setRestoreError('');setLoading(false);
  };
  const refreshUser=current=>{
    if(guard.current.snapshot().token!==callbackToken)return;
    if(!guard.current.snapshot().token||current?.id!==userRef.current?.id)return;
    localStorage.setItem('cm_user',JSON.stringify(current));accept(current);
  };
  return <AuthContext.Provider value={{user,token:guard.current.snapshot().token,login,logout,refreshUser,restore,restoreError,loading}}>
    {loading?<Ui as="main" className="p-8" role="status">Đang kiểm tra tài khoản...</Ui>:restoreError?<Ui as="main" className="mx-auto max-w-xl p-8"><Ui as="p" role="alert">{restoreError}</Ui><Ui as="button" onClick={restore} className="mt-4 rounded border p-3">Thử kết nối lại</Ui> <Ui as="button" onClick={logout} className="mt-4 rounded border p-3">Đăng nhập bằng tài khoản khác</Ui></Ui>:children}
  </AuthContext.Provider>;
}
export const useAuth=()=>useContext(AuthContext);
