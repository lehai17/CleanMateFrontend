const {test,expect}=require('@playwright/test');
const {randomUUID}=require('node:crypto');
const API='http://127.0.0.1:15238',password='CleanMate-system-test-123!';
async function setup(request,serviceKey='cleaning'){
  const email=`repeat-${randomUUID()}@example.test`,signup=await request.post(`${API}/api/auth/register`,{data:{fullName:'Repeat Customer',email,password,phoneNumber:'0901111111',address:'Profile address'}});expect(signup.status()).toBe(200);
  const customer=await signup.json(),headers={Authorization:`Bearer ${customer.token}`},oldRequest=randomUUID();
  const created=await request.post(`${API}/api/bookings`,{headers,data:{serviceKey,startTime:new Date(Date.now()+86400000).toISOString(),durationHours:2,address:'Original booking address',contactName:'Original booking contact',contactPhone:'0907777777',notes:'Keep the gate closed.',paymentMethod:'cash',requestId:oldRequest}});expect(created.status()).toBe(200);const old=await created.json();
  expect((await request.put(`${API}/api/orders/${old.id}/cancel`,{headers})).status()).toBe(204);
  const auth=await request.post(`${API}/api/auth/login`,{data:{email:'admin@system.test',password:'CleanMate-admin-test-123!'}});expect(auth.status()).toBe(200);const adminHeaders={Authorization:`Bearer ${(await auth.json()).token}`};
  const services=async()=>(await request.get(`${API}/api/management/services`,{headers:adminHeaders})).json();const original=(await services()).find(s=>s.key===serviceKey);
  const update=async data=>{const current=(await services()).find(s=>s.key===serviceKey);expect((await request.put(`${API}/api/management/services/${serviceKey}`,{headers:adminHeaders,data:{...current,...data,version:current.version}})).status()).toBe(200);};
  return {email,headers,old,oldRequest,update,restore:()=>update(original)};
}
async function openRepeat(page,account){
  await page.goto('/login');await page.locator('form input[type="email"]').fill(account.email);await page.locator('form input[type="password"]').fill(password);await page.getByRole('button',{name:'Đăng nhập',exact:true}).click();await expect(page).toHaveURL(/:13000\/?$/);
  await page.goto('/orders');await page.getByRole('row').filter({hasText:`CM${account.old.id}`}).getByRole('button',{name:'Đặt lại',exact:true}).click();await expect(page).toHaveURL(/\/booking$/);
}

test('rebooking uses current renamed service and duration bounds, creates a new cash order and preserves the source',async({page,request})=>{
  const account=await setup(request);const errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{
    await account.update({name:'Current cleaning service',hourlyRate:81000,maxHours:1});await openRepeat(page,account);
    await expect(page.getByRole('heading',{name:'Chọn thời gian',exact:true})).toBeVisible();await expect(page.locator('input[type="time"]')).toHaveValue('');await expect(page.getByRole('button',{name:'Tiếp tục',exact:true})).toBeDisabled();await expect(page.getByRole('status')).toContainText('Thời lượng đã điều chỉnh');await expect(page.getByText('Current cleaning service',{exact:true}).first()).toBeVisible();
    const day=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Bangkok'}).format(new Date(Date.now()+2*86400000));if(!(await page.locator(`[title="${day}"]`).count()))await page.getByRole('button',{name:'Tháng sau'}).click();await page.locator(`[title="${day}"]`).click();await page.locator('input[type="time"]').fill('09:00');await page.getByRole('button',{name:'Tiếp tục',exact:true}).click();
    await expect(page.getByPlaceholder('Nhập họ và tên')).toHaveValue('Original booking contact');await expect(page.getByPlaceholder('Nhập số điện thoại')).toHaveValue('0907777777');await expect(page.getByPlaceholder(/Nhập địa chỉ chi tiết/)).toHaveValue('Original booking address');await expect(page.getByPlaceholder(/Yêu cầu đặc biệt/)).toHaveValue('Keep the gate closed.');await expect(page.locator('input[value="cash"]')).toBeChecked();
    const before=await (await request.get(`${API}/api/orders`,{headers:account.headers})).json();expect(before).toHaveLength(1);
    await page.getByRole('button',{name:'Tiếp tục',exact:true}).click();let payload;page.on('request',r=>{if(r.url()===`${API}/api/bookings`&&r.method()==='POST')payload=r.postDataJSON();});
    await page.getByRole('button',{name:'Xác nhận đặt lịch',exact:true}).click();await expect(page.getByText('Đặt lịch thành công!',{exact:true})).toBeVisible();
    expect(payload.ServiceKey).toBe('cleaning');expect(payload.DurationHours).toBe(1);expect(payload.ExpectedPrice).toBe(81000);expect(payload.PaymentMethod).toBe('cash');expect(payload.Notes).toBe('Keep the gate closed.');expect(payload.RequestId).not.toBe(account.oldRequest);expect(payload).not.toHaveProperty('CleanerId');expect(payload).not.toHaveProperty('Price');
    const orders=await (await request.get(`${API}/api/orders`,{headers:account.headers})).json();expect(orders).toHaveLength(2);expect(orders.find(o=>o.id===account.old.id)).toMatchObject({status:'Cancelled',price:140000});const repeated=orders.find(o=>o.id!==account.old.id);expect(repeated).toMatchObject({status:'Pending',price:81000,paymentStatus:'Unpaid',cleaner:null});expect(errors).toEqual([]);
  }finally{await account.restore();}
});

test('a retired service returns the repeat draft to service selection without creating an order',async({page,request})=>{
  const account=await setup(request,'cooking');
  try{
    await account.update({isActive:false});await openRepeat(page,account);await expect(page.getByRole('status')).toContainText('Dịch vụ cũ không còn mở đặt');await expect(page.locator('input[type="time"]')).toHaveCount(0);await expect(page.getByRole('button',{name:/Dọn Dẹp Tổng Quát/})).toBeVisible();await expect(page.getByRole('button',{name:'Tiếp tục',exact:true})).toBeDisabled();
    expect(await (await request.get(`${API}/api/orders`,{headers:account.headers})).json()).toHaveLength(1);
  }finally{await account.restore();}
});
