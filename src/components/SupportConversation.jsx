import { Ui, Raw } from './../ui/Preferences';
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
  if(!open)return <Ui as="button" className="mt-3 rounded border px-3 py-2" onClick={()=>{setOpen(true);load();}}>Xem trao đổi</Ui>;
  return <Ui as="section" aria-label={`Trao đổi HT${ticketId}`} className="mt-4 grid gap-3 border-t pt-4"><Ui as="h4" className="font-semibold">Lịch sử trao đổi</Ui><Ui as="p">Tin bổ sung cho yêu cầu đã giải quyết sẽ mở lại yêu cầu để staff xử lý.</Ui>
    <Ui as="div"><Ui as="button" type="button" disabled={loading||busy} onClick={()=>load()}>Tải lại trao đổi</Ui>{cursor&&<Ui as="button" type="button" disabled={loading||busy} onClick={()=>load(true)} className="ml-4">Tin cũ hơn</Ui>}</Ui>
    {items.map(m=><Ui as="div" key={m.id} data-message-id={m.id} className="rounded bg-gray-50 p-3"><Ui as="strong">{m.fromStaff?'Nhân viên':'Bạn'}</Ui><Ui as="time" className="ml-3 text-sm">{new Date(m.createdAt).toLocaleString('vi-VN')}</Ui><Ui as="p" className="whitespace-pre-wrap">{<Raw>{m.body}</Raw>}</Ui></Ui>)}
    {!loading&&!items.length&&<Ui as="p">Chưa có trao đổi bổ sung.</Ui>}{loading&&<Ui as="p">Đang tải trao đổi...</Ui>}{error&&<Ui as="p" role="alert">{error}</Ui>}
    <Ui as="form" onSubmit={send} className="grid gap-3"><Ui as="label">Tin nhắn hỗ trợ<Ui as="textarea" name="body" aria-label="Tin nhắn hỗ trợ" required maxLength={2000} rows={3} disabled={busy} className="block w-full rounded border p-2" /></Ui><Ui as="button" disabled={busy||loading} className="rounded bg-emerald-700 p-2 text-white">Gửi tin nhắn</Ui></Ui>
  </Ui>;
}
