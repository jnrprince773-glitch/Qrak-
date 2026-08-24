import { put, list, del, get } from '@vercel/blob';

function json(data, status=200){return new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json','cache-control':'no-store'}})}
function validId(id){return typeof id==='string'&&/^[A-Za-z0-9_-]{40,100}$/.test(id)}

export async function GET(request){
  if(!process.env.BLOB_READ_WRITE_TOKEN)return json({error:'Cloud storage is not configured. Add BLOB_READ_WRITE_TOKEN in Vercel.'},503);
  const id=new URL(request.url).searchParams.get('id');
  if(!validId(id))return json({error:'Invalid vault id.'},400);
  const prefix=`qrak/vaults/${id}.json`;
  const result=await list({prefix,limit:1});
  if(!result.blobs.length)return json({error:'No cloud vault found.'},404);
  const blob=result.blobs[0];
  const stored=await get(blob.url,{access:'private'});
  if(!stored)return json({error:'Cloud vault unavailable.'},404);
  return json(JSON.parse(await new Response(stored.stream).text()));
}

export async function POST(request){
  if(!process.env.BLOB_READ_WRITE_TOKEN)return json({error:'Cloud storage is not configured. Add BLOB_READ_WRITE_TOKEN in Vercel.'},503);
  const body=await request.json().catch(()=>null);
  if(!body||!validId(body.id)||!body.payload?.iv||!body.payload?.data)return json({error:'Invalid sync payload.'},400);
  const path=`qrak/vaults/${body.id}.json`;
  await put(path,JSON.stringify({version:1,updatedAt:new Date().toISOString(),payload:body.payload}),{access:'private',addRandomSuffix:false,contentType:'application/json',allowOverwrite:true});
  return json({ok:true});
}

export async function OPTIONS(){return new Response(null,{status:204,headers:{'access-control-allow-origin':'*','access-control-allow-methods':'GET,POST,OPTIONS','access-control-allow-headers':'content-type'}})}
