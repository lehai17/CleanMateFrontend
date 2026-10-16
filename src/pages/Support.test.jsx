import React,{act} from 'react';
import {createRoot} from 'react-dom/client';
import Support from './Support';
import {api} from '../api/axios';
jest.mock('../api/axios',()=>({api:{get:jest.fn(),post:jest.fn()}}));
let container,root;
beforeAll(()=>Object.defineProperty(window,'crypto',{value:require('crypto').webcrypto,configurable:true}));
beforeEach(()=>{jest.clearAllMocks();container=document.createElement('div');document.body.appendChild(container);root=createRoot(container);api.get.mockImplementation(url=>Promise.resolve({data:url.includes('/bookings')?[]:{items:[],total:0}}));});
afterEach(async()=>{await act(async()=>root.unmount());container.remove();});
test('retry after response loss preserves the same request ID and clears description only after success',async()=>{
  api.post.mockRejectedValueOnce(new Error('Network error')).mockResolvedValueOnce({data:{id:7}});
  await act(async()=>root.render(<Support />));
  container.querySelector('[name=bookingId]').value='CM123';container.querySelector('[name=description]').value='Không liên lạc được với cleaner.';
  const submit=()=>act(async()=>container.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
  await submit();expect(container.querySelector('[name=description]').value).toBe('Không liên lạc được với cleaner.');
  await submit();expect(api.post).toHaveBeenCalledTimes(2);expect(api.post.mock.calls[1][1]).toEqual(api.post.mock.calls[0][1]);expect(api.post.mock.calls[0][1].requestId).toMatch(/^[0-9a-f-]{36}$/);expect(container.textContent).toContain('Đã gửi yêu cầu HT7.');expect(container.querySelector('[name=description]').value).toBe('');
});
test('invalid booking IDs never send a report and staff responses render as text',async()=>{
  api.get.mockImplementation(url=>Promise.resolve({data:url.includes('/bookings')?[]:{items:[{id:1,bookingId:3,status:'Resolved',category:'Other',description:'A problem occurred',response:'<script>unsafe()</script>'}],total:1}}));
  await act(async()=>root.render(<Support />));container.querySelector('[name=bookingId]').value='Other999';container.querySelector('[name=description]').value='Cần được hỗ trợ về ca làm.';
  await act(async()=>container.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
  expect(api.post).not.toHaveBeenCalled();expect(container.textContent).toContain('<script>unsafe()</script>');expect(container.querySelector('script')).toBeNull();
});
