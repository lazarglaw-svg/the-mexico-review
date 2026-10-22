const menuButton=document.querySelector("[data-menu-button]");
const mobileMenu=document.querySelector("[data-mobile-menu]");
if(menuButton&&mobileMenu){
  menuButton.addEventListener("click",()=>{
    const open=mobileMenu.classList.toggle("open");
    menuButton.setAttribute("aria-expanded",String(open));
  });
  mobileMenu.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{
    mobileMenu.classList.remove("open");
    menuButton.setAttribute("aria-expanded","false");
  }));
}
const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if(reduced){
  document.querySelectorAll(".reveal").forEach(el=>el.classList.add("visible"));
}else{
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.12});
  document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));
}

// City filter navigates to real locale-specific city/category pages.
document.querySelectorAll("[data-city-filter]").forEach(select=>{
  select.addEventListener("change",()=>{
    const next=select.value;
    if(next && next.startsWith("/") && !next.startsWith("//"))window.location.assign(next);
  });
});

// Remove the decorative north-east arrow wherever it appears in visible
// site copy (including shared CTA markup and external photo-credit links).
// Keep links, their accessible text, and their click behaviour unchanged.
function removeDecorativeDiagonalArrows(){
  document.querySelectorAll("span").forEach(span=>{
    if(span.textContent.trim()==="↗")span.remove();
  });
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  let node;
  while((node=walker.nextNode())){
    if(!node.nodeValue.includes("↗"))continue;
    if(node.parentElement?.closest("script,style,template,textarea"))continue;
    node.nodeValue=node.nodeValue.replace(/\s*↗/g,"");
  }
}
if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",removeDecorativeDiagonalArrows,{once:true});
}else{
  removeDecorativeDiagonalArrows();
}
