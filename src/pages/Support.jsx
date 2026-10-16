import {useCallback,useEffect,useRef,useState} from 'react';
import {api} from '../api/axios';
const categories={Scheduling:'Lịch làm / không đến',Quality:'Chất lượng công việc',CashPayment:'Tiền mặt trực tiếp',Other:'Vấn đề khác'};
const statuses={Open:'Đã tiếp nhận',InProgress:'Đang xử lý',Resolved:'Đã giải quyết'};
export default function Support() {
  const [bookings,setBookings]=useState([]),[data,setData]=useState({items:[],total:0}),[page,setPage]=useState(1),[error,setError]=useState(''),[message,setMessage]=useState(''),[loading,setLoading]=useState(true),[busy,setBusy]=useState(false);
  const pending=useRef(false),request=useRef(null);
  const load=useCallback(async()=>{setLoading(true);setError('');try{const result=await api.get(`/api/support?page=${page}`);setData(result.data);}catch{setError('Không tải được yêu cầu hỗ trợ. Vui lòng thử lại.');}finally{setLoading(false);}},[page]);
  useEffect(()=>{load();},[load]);
  useEffect(()=>{api.get('/api/support/bookings').then(r=>setBookings(r.data)).catch(()=>{});},[]);
  const submit=async event=>{
    event.preventDefault();if(pending.current)return;pending.current=true;setBusy(true);setMessage('');
    const form=event.currentTarget;
    try{
      const fields=Object.fromEntries(new FormData(form));const payload={bookingId:Number(fields.bookingId.trim().replace(/^CM/i,'')),category:fields.category,description:fields.description.trim()};
      if(!Number.isSafeInteger(payload.bookingId)||payload.bookingId<=0||payload.description.length<10)throw new Error('Nhập mã đơn hợp lệ và mô tả ít nhất 10 ký tự.');
      const key=JSON.stringify(payload);if(request.current?.key!==key)request.current={key,id:crypto.randomUUID()};
      const result=await api.post('/api/support',{...payload,requestId:request.current.id});request.current=null;form.elements.description.value='';setMessage(`Đã gửi yêu cầu HT${result.data.id}.`);
      if(page!==1)setPage(1);else await load();
    }catch(e){setMessage(e?.response?.data?.message || e.message || 'Không thể gửi. Vui lòng thử lại.');}finally{pending.current=false;setBusy(false);}
  };
  return <main className="mx-auto max-w-3xl px-4 py-8"><h1 className="text-2xl font-bold">Hỗ trợ đơn hàng</h1><p className="my-4">Báo sự cố lịch làm, chất lượng hoặc tiền mặt trực tiếp. Staff sẽ phản hồi tại đây; yêu cầu không tự thay đổi đơn hay thu/hoàn tiền.</p>
    <form onSubmit={submit} className="grid gap-4 rounded-xl border p-5">
      <label>Mã đơn<input aria-label="Mã đơn" name="bookingId" placeholder="Ví dụ: CM123" maxLength={12} required list="support-bookings" className="block w-full rounded border p-2" /></label><datalist id="support-bookings">{bookings.map(b=><option key={b.id} value={`CM${b.id}`}>{b.address}</option>)}</datalist>
      <label>Loại sự cố<select name="category" aria-label="Loại sự cố" className="block w-full rounded border p-2">{Object.entries(categories).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label>
      <label>Mô tả<textarea name="description" aria-label="Mô tả" minLength={10} maxLength={2000} rows={4} required className="block w-full rounded border p-2" /></label><p role="status">{message}</p><button disabled={busy} className="rounded bg-emerald-700 px-4 py-2 text-white disabled:opacity-50">{busy?'Đang gửi...':'Gửi yêu cầu hỗ trợ'}</button>
    </form><h2 className="my-5 text-xl font-semibold">Yêu cầu của tôi</h2><button onClick={load} disabled={loading} className="rounded border px-3 py-2">Tải lại hỗ trợ</button>{error&&<p role="alert">{error}</p>}{loading&&<p>Đang tải...</p>}
    {data.items.map(item=><article key={item.id} data-support-id={item.id} className="my-4 rounded-xl border p-4"><h3 className="font-semibold">HT{item.id} · CM{item.bookingId}</h3><p>{statuses[item.status]} · {categories[item.category]}</p><p className="my-3 whitespace-pre-wrap">{item.description}</p><p className="whitespace-pre-wrap">{item.response?`Phản hồi từ staff: ${item.response}`:'Nhân viên chưa phản hồi.'}</p></article>)}
    {!loading&&!error&&!data.items.length&&<p>Bạn chưa có yêu cầu hỗ trợ.</p>}<p>Trang {page} · {data.total} yêu cầu</p><button disabled={loading||page===1} onClick={()=>setPage(page-1)}>Trang trước</button> <button disabled={loading||page*20>=data.total} onClick={()=>setPage(page+1)}>Trang sau</button>
  </main>;
}
