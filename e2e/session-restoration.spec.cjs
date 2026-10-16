const {test,expect}=require('@playwright/test');
const {randomUUID}=require('node:crypto');
const API='http://127.0.0.1:15238',password='CleanMate-system-test-123!';
async function account(request,fullName='Restore Customer'){
  const email=`session-${randomUUID()}@example.test`,r=await request.post(`${API}/api/auth/register`,{data:{email,fullName,password}});expect(r.status()).toBe(200);return {...await r.json(),email};
}
async function prepare(page,account){await page.goto('/login');await page.getByLabel('Language / Ngôn ngữ').selectOption('en');await page.getByLabel('Appearance / Giao diện').selectOption('dark');await page.evaluate(value=>{localStorage.setItem('cm_token',value.token);localStorage.setItem('cm_user','broken-cache');},account);}
test('offline restore retains the saved session and retries without losing language or appearance',async({page,request})=>{
  const saved=await account(request);await prepare(page,saved);await page.route(`${API}/api/me`,route=>route.abort('failed'));await page.goto('/profile');await expect(page.getByRole('alert')).toContainText('Unable to connect');expect(await page.evaluate(()=>localStorage.getItem('cm_token'))).toBe(saved.token);
  await page.unroute(`${API}/api/me`);await page.getByRole('button',{name:'Retry connection',exact:true}).click();await expect(page.locator('header')).toContainText('Restore Customer');await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await page.route(`${API}/api/me`,route=>route.abort('failed'));await page.reload();await page.getByRole('button',{name:'Use another account',exact:true}).click();await expect(page).toHaveURL(/\/login$/);expect(await page.evaluate(()=>localStorage.getItem('cm_token'))).toBeNull();await expect(page.getByLabel('Language / Ngôn ngữ')).toHaveValue('en');
});
test('a late 401 from another tab session cannot log out the new customer',async({page,context,request})=>{
  const first=await account(request,'First Customer'),second=await account(request,'Second Customer');await prepare(page,first);
  let release,started;const held=new Promise(resolve=>{release=resolve;}),captured=new Promise(resolve=>{started=resolve;});
  await page.route(`${API}/api/notifications/unread-count`,async route=>{if(route.request().headers().authorization!==`Bearer ${first.token}`)return route.continue();started();await held;await route.fulfill({status:401,contentType:'application/json',body:'{}'});});
  await page.goto('/');await captured;const other=await context.newPage();await other.goto('/login');await other.evaluate(value=>{localStorage.setItem('cm_token',value.token);localStorage.setItem('cm_user',JSON.stringify(value.user));},second);await expect(page.locator('header')).toContainText('Second Customer');
  const expired=page.waitForResponse(r=>r.url()===`${API}/api/notifications/unread-count`&&r.status()===401);release();await expired;await expect.poll(()=>page.evaluate(()=>localStorage.getItem('cm_token'))).toBe(second.token);await page.goto('/profile');await expect(page.locator('header')).toContainText('Second Customer');await other.close();
});
test('an invalid stored token is removed and returns to sign-in without resetting appearance',async({page})=>{
  await prepare(page,{token:'invalid-system-test-token'});await page.goto('/profile');await expect(page).toHaveURL(/\/login$/);await expect(page.getByRole('button',{name:'Sign in',exact:true})).toBeVisible();expect(await page.evaluate(()=>localStorage.getItem('cm_token'))).toBeNull();await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
});
