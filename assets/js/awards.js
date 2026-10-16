(function(){
"use strict";
const form=document.getElementById("awards-nomination-form");if(!form)return;
const button=form.querySelector('button[type="submit"]'),status=document.getElementById("awards-form-status"),email=form.elements.email,name=form.elements.submitterName,started=form.elements.startedAt;
started.value=String(Date.now());
function business(){const isBusiness=form.querySelector('input[name="submissionType"]:checked')?.value==="business";email.required=isBusiness;name.required=isBusiness;}
form.querySelectorAll('input[name="submissionType"]').forEach(el=>el.addEventListener("change",business));business();
function say(s){status.textContent=s;}
async function check(){try{const r=await fetch("/api/award-nominations",{cache:"no-store"});if(!r.ok||!(await r.json()).available)throw Error("not available");button.disabled=false;say("");}catch{button.disabled=true;say(form.dataset.offline);}}
form.addEventListener("submit",async e=>{
e.preventDefault();business();if(!form.reportValidity())return say(form.dataset.invalid);
button.disabled=true;say(form.dataset.sending);
try{const response=await fetch(form.action,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(Object.fromEntries(new FormData(form)))});const data=await response.json();if(!response.ok||!data.ok)throw Error("failed");form.reset();business();started.value=String(Date.now());say(form.dataset.success);}catch{say(form.dataset.failed);}finally{button.disabled=false;}
});
check();
})();