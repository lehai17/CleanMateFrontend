import React,{act} from 'react';
import {createRoot} from 'react-dom/client';
import {AuthProvider,useAuth} from './AuthContext';
import {meApi} from '../api/auth';
import {api} from '../api/axios';
jest.mock('../api/auth',()=>({meApi:jest.fn()}));
jest.mock('../api/axios',()=>({api:{interceptors:{request:{use:jest.fn(()=>1),eject:jest.fn()},response:{use:jest.fn(()=>1),eject:jest.fn()}}}}));
let container,root,auth;
const user={id:1,fullName:'Account A',role:'Customer'};
function Probe(){auth=useAuth();return <p>{auth.user?.fullName||'Guest'}</p>;}
const mount=()=>act(async()=>root.render(<AuthProvider><Probe/></AuthProvider>));
beforeEach(()=>{jest.clearAllMocks();localStorage.clear();auth=null;container=document.createElement('div');root=createRoot(container);});
afterEach(async()=>act(async()=>root.unmount()));
test('corrupt cached profile does not crash or replace server identity',async()=>{
  localStorage.setItem('cm_token','A');localStorage.setItem('cm_user','broken');meApi.mockResolvedValue(user);await mount();expect(container.textContent).toBe('Account A');expect(auth.user.id).toBe(1);expect(JSON.parse(localStorage.getItem('cm_user')).id).toBe(1);
});
test('temporary restore failure keeps saved credentials and allows a successful retry',async()=>{
  localStorage.setItem('cm_token','A');meApi.mockRejectedValueOnce(new Error('Offline'));await mount();expect(container.querySelector('[role=alert]').textContent).toContain('Không thể kết nối');expect(localStorage.getItem('cm_token')).toBe('A');
  meApi.mockResolvedValueOnce(user);await act(async()=>container.querySelector('button').click());expect(auth.user.id).toBe(1);expect(auth.token).toBe('A');
});
test('a newer tab login ignores an older restore and unauthorized response',async()=>{
  let resolveOld;localStorage.setItem('cm_token','A');meApi.mockImplementationOnce(()=>new Promise(resolve=>{resolveOld=resolve;}));await mount();
  meApi.mockResolvedValueOnce({id:2,fullName:'Account B',role:'Customer'});await act(async()=>{localStorage.setItem('cm_token','B');window.dispatchEvent(new StorageEvent('storage',{key:'cm_token',oldValue:'A',newValue:'B'}));});expect(auth.user.id).toBe(2);
  await act(async()=>resolveOld(user));expect(auth.user.id).toBe(2);
  const failure={response:{status:401},config:{url:'/api/orders',headers:{Authorization:'Bearer A'}}};await act(async()=>{await expect(api.interceptors.response.use.mock.calls[0][1](failure)).rejects.toBe(failure);});expect(auth.user.id).toBe(2);expect(localStorage.getItem('cm_token')).toBe('B');
});
test('only a current authenticated 401 signs out and appearance preferences survive',async()=>{
  localStorage.setItem('cm_token','A');localStorage.setItem('cleanmate_ui_preferences','{"language":"en","theme":"dark"}');meApi.mockResolvedValue(user);await mount();
  const handler=api.interceptors.response.use.mock.calls[0][1];
  const loginError={response:{status:401},config:{url:'/api/auth/login?test=1',headers:{Authorization:'Bearer A'}}};await act(async()=>{await expect(handler(loginError)).rejects.toBe(loginError);});expect(auth.user.id).toBe(1);
  const googleError={...loginError,config:{...loginError.config,url:'/api/auth/google'}};await act(async()=>{await expect(handler(googleError)).rejects.toBe(googleError);});expect(auth.user.id).toBe(1);
  const expired={response:{status:401},config:{url:'/api/orders',headers:{Authorization:'Bearer A'}}};await act(async()=>{await expect(handler(expired)).rejects.toBe(expired);});expect(auth.user).toBeNull();expect(localStorage.getItem('cm_token')).toBeNull();expect(JSON.parse(localStorage.getItem('cleanmate_ui_preferences')).theme).toBe('dark');
});
test('a delayed profile update for another account cannot overwrite the current user',async()=>{
  localStorage.setItem('cm_token','A');meApi.mockResolvedValue(user);await mount();await act(async()=>auth.refreshUser({id:2,fullName:'Wrong account'}));expect(auth.user.id).toBe(1);await act(async()=>auth.logout());expect(auth.token).toBeNull();
});
test('requests from the old tab identity are rejected before attaching another account token',async()=>{
  localStorage.setItem('cm_token','A');meApi.mockResolvedValueOnce(user);await mount();const request=api.interceptors.request.use.mock.calls[0][0];expect(request({}).cleanmateToken).toBe('A');
  localStorage.setItem('cm_token','B');meApi.mockResolvedValueOnce({id:2,fullName:'Account B'});await act(async()=>{await expect(request({})).rejects.toThrow('Phiên đăng nhập đã thay đổi');});expect(auth.user.id).toBe(2);
});
test('callbacks kept by an old screen cannot sign out or replace a newer login',async()=>{
  localStorage.setItem('cm_token','A');meApi.mockResolvedValue(user);await mount();const old=auth;
  await act(async()=>auth.login({id:2,fullName:'Account B'},'B'));
  await act(async()=>{old.logout();old.refreshUser({...user,fullName:'Stale profile'});old.login(user,'A-late');});
  expect(auth.user.id).toBe(2);expect(localStorage.getItem('cm_token')).toBe('B');
});
