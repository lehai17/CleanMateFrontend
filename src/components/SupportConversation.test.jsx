import React,{act} from 'react';import {createRoot} from 'react-dom/client';import SupportConversation from './SupportConversation';import {api} from '../api/axios';
jest.mock('../api/axios',()=>({api:{get:jest.fn(),post:jest.fn()}}));let container,root;
beforeAll(()=>Object.defineProperty(window,'crypto',{value:require('crypto').webcrypto,configurable:true}));
beforeEach(()=>{jest.clearAllMocks();container=document.createElement('div');document.body.appendChild(container);root=createRoot(container);api.get.mockResolvedValue({data:{items:[],nextBeforeId:null}});});
afterEach(async()=>{await act(async()=>root.unmount());container.remove();});
test('lost reply responses retain the draft and request ID, then clear after acknowledgement',async()=>{
  api.post.mockRejectedValueOnce(new Error('Lost response')).mockResolvedValueOnce({data:{id:1}});await act(async()=>root.render(<SupportConversation ticketId={7} />));await act(async()=>container.querySelector('button').click());const input=container.querySelector('textarea');input.value='Cần kiểm tra lại ca làm.';
  const submit=()=>act(async()=>container.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));await submit();expect(input.value).toBe('Cần kiểm tra lại ca làm.');await submit();expect(api.post.mock.calls[1]).toEqual(api.post.mock.calls[0]);expect(input.value).toBe('');
});
test('messages render as text and older pages prepend without duplicating IDs',async()=>{
  api.get.mockResolvedValueOnce({data:{items:[{id:2,body:'<img src=x onerror=unsafe()>',fromStaff:true,createdAt:'2026-10-16T00:00:00Z'}],nextBeforeId:2}}).mockResolvedValueOnce({data:{items:[{id:1,body:'Older',fromStaff:false,createdAt:'2026-10-15T00:00:00Z'}],nextBeforeId:null}});
  await act(async()=>root.render(<SupportConversation ticketId={7} />));await act(async()=>container.querySelector('button').click());expect(container.querySelector('img')).toBeNull();expect(container.textContent).toContain('<img src=x');const older=Array.from(container.querySelectorAll('button')).find(b=>b.textContent==='Tin cũ hơn');await act(async()=>older.click());expect(api.get).toHaveBeenLastCalledWith('/api/support/7/messages?beforeId=2');expect(Array.from(container.querySelectorAll('[data-message-id]')).map(el=>el.dataset.messageId)).toEqual(['1','2']);
});
