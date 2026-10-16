import React,{act,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {UiPreferencesProvider,Ui,Raw} from './Preferences';
function Form(){const [name,setName]=useState('');return <Ui as="form"><Ui as="h1">Đăng nhập</Ui><Ui as="input" aria-label="Họ tên" value={name} onChange={e=>setName(e.target.value)}/><Ui as="p" data-testid="raw"><Raw>{name}</Raw></Ui><Ui as="button" type="button">Gửi tin nhắn</Ui></Ui>;}
let container,root;
beforeEach(()=>{localStorage.clear();container=document.createElement('div');root=createRoot(container);});
afterEach(async()=>act(async()=>root.unmount()));
const mount=()=>act(async()=>root.render(<UiPreferencesProvider><Form/></UiPreferencesProvider>));
const select=(id,value)=>act(async()=>{const input=container.querySelector(id);input.value=value;input.dispatchEvent(new Event('change',{bubbles:true}));});
test('switches language and theme without losing typed content, and restores preferences',async()=>{
  await mount();await act(async()=>{const input=container.querySelector('input');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,'Đăng nhập');input.dispatchEvent(new Event('input',{bubbles:true}));});
  await select('#ui-language','en');expect(container.querySelector('h1').textContent).toBe('Sign in');
  expect(container.querySelector('input').value).toBe('Đăng nhập');expect(container.querySelector('input').getAttribute('aria-label')).toBe('Full name');
  expect(container.querySelector('[data-testid=raw]').textContent).toBe('Đăng nhập');
  await select('#ui-theme','dark');expect(document.documentElement.dataset.theme).toBe('dark');
  await act(async()=>root.unmount());root=createRoot(container);await mount();expect(container.querySelector('#ui-language').value).toBe('en');expect(document.documentElement.dataset.theme).toBe('dark');
});
test('corrupt storage recovers and switching back restores Vietnamese labels',async()=>{
  localStorage.setItem('cleanmate_ui_preferences','broken');await mount();expect(container.querySelector('h1').textContent).toBe('Đăng nhập');
  await select('#ui-language','en');await select('#ui-language','vi');expect(container.querySelector('button').textContent).toBe('Gửi tin nhắn');
});
test('unavailable browser storage keeps preference controls working in memory',async()=>{
  const get=jest.spyOn(Storage.prototype,'getItem').mockImplementation(()=>{throw new Error('Storage disabled');});
  const set=jest.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('Storage disabled');});
  try{await mount();await select('#ui-language','en');await select('#ui-theme','dark');expect(container.querySelector('h1').textContent).toBe('Sign in');expect(document.documentElement.dataset.theme).toBe('dark');}
  finally{get.mockRestore();set.mockRestore();}
});
