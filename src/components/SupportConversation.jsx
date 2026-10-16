import {useEffect,useRef,useState} from 'react';
import {api} from '../api/axios';

export default function SupportConversation({ticketId,onUpdated}) {
  const [open,setOpen]=useState(false),[items,setItems]=useState([]),[cursor,setCursor]=useState(null),[error,setError]=useState(''),[loading,setLoading]=useState(false),[busy,setBusy]=useState(false);
  const pending=useRef(false),retry=useRef(null),alive=useRef(true);
  useEffect(()=>{alive.current=true;return()=>{alive.current=false;};},[]);
  const load=async(older=false)=>{
    setLoading(true);setError('');
    try{const {data}=await api.get(`/api/support/${ticketId}/messages${older?`?beforeId=${cursor}`:''}`);if(!alive.current)return;setItems(previous=>older?[...data.items,...previous.filter(m=>!data.items.some(n=>n.id===m.id))]:data.items);setCursor(data.nextBeforeId);}
    catch(e){if(alive.current)setError(e?.response?.data?.message||'Không tải được trao đổi. Vui lòng thử lại.');}
    finally{if(alive.current)setLoading(false);}
  };
  const send=async event=>{
    event.preventDefault();if(pending.current)return;const form=event.currentTarget,body=form.elements.body.value.trim();if(!body)return;
    pending.current=true;setBusy(true);setError('');if(retry.current?.body!==body)retry.current={body,requestId:crypto.randomUUID()};
    try{await api.post(`/api/support/${ticketId}/messages`,retry.current);retry.current=null;if(!alive.current)return;form.reset();await load();await onUpdated?.();}
    catch(e){if(alive.current)setError(e?.response?.data?.message||'Không gửi được. Thử lại sẽ dùng cùng mã tin nhắn.');}
    finally{pending.current=false;if(alive.current)setBusy(false);}
  };
  if(!open)return <button className="mt-3 rounded border px-3 py-2" onClick={()=>{setOpen(true);load();}}>Xem trao đổi</button>;
  return <section aria-label={`Trao đổi HT${ticketId}`} className="mt-4 grid gap-3 border-t pt-4"><h4 className="font-semibold">Lịch sử trao đổi</h4><p>Tin bổ sung cho yêu cầu đã giải quyết sẽ mở lại yêu cầu để staff xử lý.</p>
    <div><button type="button" disabled={loading||busy} onClick={()=>load()}>Tải lại trao đổi</button>{cursor&&<button type="button" disabled={loading||busy} onClick={()=>load(true)} className="ml-4">Tin cũ hơn</button>}</div>
    {items.map(m=><div key={m.id} data-message-id={m.id} className="rounded bg-gray-50 p-3"><strong>{m.fromStaff?'Nhân viên':'Bạn'}</strong><time className="ml-3 text-sm">{new Date(m.createdAt).toLocaleString('vi-VN')}</time><p className="whitespace-pre-wrap">{m.body}</p></div>)}
    {!loading&&!items.length&&<p>Chưa có trao đổi bổ sung.</p>}{loading&&<p>Đang tải trao đổi...</p>}{error&&<p role="alert">{error}</p>}
    <form onSubmit={send} className="grid gap-3"><label>Tin nhắn hỗ trợ<textarea name="body" aria-label="Tin nhắn hỗ trợ" required maxLength={2000} rows={3} disabled={busy} className="block w-full rounded border p-2" /></label><button disabled={busy||loading} className="rounded bg-emerald-700 p-2 text-white">Gửi tin nhắn</button></form>
  </section>;
}
