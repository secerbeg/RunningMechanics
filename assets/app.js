(()=>{
  'use strict';
  const dlg=document.getElementById('video-dialog');
  const container=document.getElementById('video-container');
  const dialogTitle=document.getElementById('video-title');
  const refTitle=document.getElementById('video-reference');
  const link=document.getElementById('video-external-link');
  const caption=document.getElementById('dialog-caption');
  let priorFocus=null;
  const closeVideo=()=>{if(dlg.open)dlg.close();container.replaceChildren();if(priorFocus)priorFocus.focus();};
  document.getElementById('video-close').addEventListener('click',closeVideo);
  dlg.addEventListener('close',()=>{container.replaceChildren();if(priorFocus){priorFocus.focus();priorFocus=null;}});
  dlg.addEventListener('click',(event)=>{if(event.target===dlg)closeVideo();});
  document.querySelectorAll('.watch-btn').forEach(btn=>btn.addEventListener('click',()=>{
    priorFocus=btn;
    const src=btn.dataset.source;
    dialogTitle.textContent=btn.dataset.title;
    refTitle.textContent=src==='local'?'Uploaded exercise video':'External coaching reference';
    container.replaceChildren();
    if(src==='local'){
      const video=document.createElement('video');video.controls=true;video.playsInline=true;video.preload='metadata';video.autoplay=true;
      video.setAttribute('aria-label',btn.dataset.title+' demonstration');
      const source=document.createElement('source');source.src='assets/videos/'+btn.dataset.video;source.type='video/mp4';video.append(source);
      video.append(document.createTextNode('Your browser does not support HTML5 video.'));
      container.append(video);link.hidden=true;
      caption.textContent='Video from the uploaded reference files. Follow the sets/reps and cues shown on this page.';
      dlg.showModal();video.play().catch(()=>{});
    } else {
      const id=btn.dataset.video;
      if(!/^[\w-]{11}$/.test(id))return;
      const start=Math.max(0,parseInt(btn.dataset.start||'0',10)||0);
      const iframe=document.createElement('iframe');
      iframe.src=`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&start=${start}`;
      iframe.title=btn.dataset.title+' coaching reference on YouTube';
      iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.referrerPolicy='strict-origin-when-cross-origin';iframe.allowFullscreen=true;iframe.loading='eager';
      container.append(iframe);link.hidden=false;
      link.href=`https://www.youtube.com/watch?v=${id}${start?`&t=${start}s`:''}`;
      caption.textContent='Third-party reference: '+(btn.dataset.reference||'coaching demo')+'. The page instructions define our specific session.';
      dlg.showModal();
    }
  }));
  const key='running_mechanics_session_checks_v1';
  let state={};
  try{state=JSON.parse(localStorage.getItem(key)||'{}')||{};}catch(e){state={};}
  const inputs=[...document.querySelectorAll('.exercise-check')];
  const update=()=>{
    for(const name of ['indoor','outdoor']){
      const selected=inputs.filter(el=>el.dataset.session===name);
      const count=selected.filter(el=>el.checked).length;
      const indicator=document.getElementById(name+'-progress');
      indicator.textContent=`${count} of ${selected.length} completed`;
    }
  };
  inputs.forEach(el=>{el.checked=!!state[el.dataset.exercise];el.addEventListener('change',()=>{
    state[el.dataset.exercise]=el.checked;
    try{localStorage.setItem(key,JSON.stringify(state));}catch(e){}
    update();
  });});
  document.querySelectorAll('.reset-progress').forEach(btn=>btn.addEventListener('click',()=>{
    const session=btn.dataset.reset;
    inputs.filter(el=>el.dataset.session===session).forEach(el=>{el.checked=false;delete state[el.dataset.exercise];});
    try{localStorage.setItem(key,JSON.stringify(state));}catch(e){}
    update();
  }));
  update();
})();
