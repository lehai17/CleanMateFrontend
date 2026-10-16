import React,{act} from 'react';
import {createRoot} from 'react-dom/client';
import Recovery from './Recovery';
import {api} from '../api/axios';
jest.mock('../api/axios',()=>({api:{post:jest.fn()}}));
jest.mock('react-router-dom',()=>({Link:({to,children})=><a href={to}>{children}</a>}));
let container,root;
beforeEach(()=>{jest.clearAllMocks();localStorage.clear();sessionStorage.clear();container=document.createElement('div');root=createRoot(container);});
afterEach(async()=>{await act(async()=>root.unmount());});
async function email(value){await act(async()=>{const input=container.querySelector('[aria-label="Email khôi phục"]');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,value);input.dispatchEvent(new Event('input',{bubbles:true}));});}
const submit=index=>act(async()=>container.querySelectorAll('form')[index].dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
test('recovery blocks duplicate sends and keeps the email after an explicit delivery outage',async()=>{
  let reject;api.post.mockImplementation(()=>new Promise((resolve,fail)=>{reject=fail;}));await act(async()=>root.render(<Recovery/>));await email('owner@example.test');await submit(0);await submit(0);expect(api.post).toHaveBeenCalledTimes(1);await act(async()=>reject({response:{status:503,data:{message:'Email delivery unavailable'}}}));expect(container.textContent).toContain('Email delivery unavailable');expect(container.querySelector('[aria-label="Email khôi phục"]').value).toBe('owner@example.test');expect(container.querySelector('button').disabled).toBe(false);
});
test('reset requires matching confirmation and clears secrets after success without storing them',async()=>{
  api.post.mockResolvedValue({data:{message:'Password reset; sign in again.'}});await act(async()=>root.render(<Recovery/>));await email('owner@example.test');const code='A'.repeat(64);container.querySelector('[name=code]').value=code;container.querySelector('[name=newPassword]').value='Recovered-password-123!';container.querySelector('[name=confirmation]').value='Mismatch-password-123!';await submit(1);expect(api.post).not.toHaveBeenCalled();container.querySelector('[name=confirmation]').value='Recovered-password-123!';await submit(1);expect(api.post).toHaveBeenCalledWith('/api/auth/reset-password',{email:'owner@example.test',code,newPassword:'Recovered-password-123!'});expect(container.querySelector('[name=code]')).toBeNull();expect(localStorage.length).toBe(0);expect(sessionStorage.length).toBe(0);expect(container.querySelector('a').getAttribute('href')).toBe('/login');
});
