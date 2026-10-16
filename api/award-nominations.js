const SITE="https://themexicoreview.com";
const categories=new Set(["restaurant","hotel","experience"]);
const emails=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function clean(value,max=180){return typeof value==="string"?value.trim().slice(0,max):"";}
function json(res,status,data){res.setHeader("Content-Type","application/json; charset=utf-8");res.setHeader("Cache-Control","no-store");res.setHeader("X-Content-Type-Options","nosniff");return res.status(status).json(data);}
function escape(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
export default async function handler(req,res){
 const ready=Boolean(process.env.RESEND_API_KEY&&process.env.AWARDS_TO_EMAIL&&process.env.AWARDS_FROM_EMAIL);
 if(req.method==="GET")return json(res,200,{available:ready});
 if(req.method!=="POST")return json(res,405,{ok:false,error:"method"});
 if(!ready)return json(res,503,{ok:false,error:"not_configured"});
 const origin=req.headers.origin;
 if(origin&&origin!==SITE&&origin!=="https://www.themexicoreview.com")return json(res,403,{ok:false,error:"origin"});
 if(!String(req.headers["content-type"]||"").includes("application/json"))return json(res,415,{ok:false,error:"content_type"});
 const body=typeof req.body==="object"&&req.body?req.body:{};
 if(JSON.stringify(body).length>12000)return json(res,413,{ok:false,error:"too_large"});
 if(clean(body.fax))return json(res,400,{ok:false,error:"invalid"});
 const type=clean(body.submissionType,20),category=clean(body.category,30),place=clean(body.placeName,160),city=clean(body.city,100),
 website=clean(body.website,400),reason=clean(body.reason,2500),name=clean(body.submitterName,100),email=clean(body.email,254);
 const age=Date.now()-Number(body.startedAt);
 if(!Number.isFinite(age)||age<1500||age>7200000)return json(res,400,{ok:false,error:"invalid"});
 if(!["reader","business"].includes(type)||!categories.has(category)||place.length<2||city.length<2||reason.length<15||body.consent!=="yes")return json(res,400,{ok:false,error:"invalid"});
 if((email&&!emails.test(email))||(type==="business"&&(!emails.test(email)||!name)))return json(res,400,{ok:false,error:"contact"});
 if(website&&!/^https?:\/\/[^ ]+\.[^ ]+$/i.test(website)&&!/^@?[a-z0-9_.-]{2,30}$/i.test(website))return json(res,400,{ok:false,error:"website"});
 const labels=[["Type",type],["Category",category],["Place / business",place],["Location",city],["Website / social",website||"Not supplied"],["Reason",reason],["Submitter",name||"Not supplied"],["Reply email",email||"Not supplied"],["Consent","Yes"],["Submitted",new Date().toISOString()]];
 const html='<div style="font-family:Arial,sans-serif;max-width:720px"><h1 style="color:#4B0F17">The Mexico Review — Award nomination</h1><table style="border-collapse:collapse;width:100%">'+labels.map(([a,b])=>'<tr><th style="text-align:left;vertical-align:top;padding:12px;border-bottom:1px solid #ddd">'+escape(a)+'</th><td style="padding:12px;border-bottom:1px solid #ddd;white-space:pre-wrap">'+escape(b)+'</td></tr>').join("")+'</table></div>';
 try{
 const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":"Bearer "+process.env.RESEND_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({from:process.env.AWARDS_FROM_EMAIL,to:[process.env.AWARDS_TO_EMAIL],subject:"TMR Awards 2027: "+category+" — "+place,html,...(email?{reply_to:email}:{})})});
 const result=await response.json().catch(()=>({}));
 if(!response.ok||!result.id)return json(res,502,{ok:false,error:"delivery"});
 return json(res,200,{ok:true});
 }catch{return json(res,502,{ok:false,error:"delivery"});}
}
