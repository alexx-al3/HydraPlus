export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#070d1f;--bg2:#0c1530;--card:rgba(255,255,255,.07);--border:rgba(255,255,255,.11);--cyan:#00d4ff;--cyan2:#0099bb;--blue:#38bdf8;--purple:#a78bfa;--green:#34d399;--amber:#fbbf24;--red:#f87171;--t1:#f0f9ff;--t2:#7ea9c4;--t3:#4a6782}
.light{--bg:#f0f9ff;--bg2:#e0f2fe;--card:rgba(255,255,255,.88);--border:rgba(14,165,233,.18);--t1:#0c2340;--t2:#1e6094;--t3:#7ba9c4}
html,body,#root{height:100%;width:100%;overflow:hidden}
body{font-family:'Nunito',sans-serif;background:var(--bg);color:var(--t1);overscroll-behavior:none}
.app-shell{max-width:430px;margin:0 auto;height:100dvh;display:flex;flex-direction:column;background:var(--bg);overflow:hidden;position:relative}
.app-content{flex:1;overflow-y:auto;overflow-x:hidden;scrollbar-width:none}
.app-content::-webkit-scrollbar{display:none}
.screen{padding:12px 16px 0}
.splash{height:100dvh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:40px;background:radial-gradient(ellipse at center,#06102a,#020810)}
.splash-inner{text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px}
.splash-title{font-family:'Space Grotesk',sans-serif;font-size:52px;font-weight:700;color:#f0f9ff;letter-spacing:-2px}
.splash-title span{color:var(--cyan)}
.splash-sub{font-size:15px;color:var(--t2)}
.splash-bar{width:200px;height:3px;background:rgba(255,255,255,.1);border-radius:99px;overflow:hidden}
.splash-fill{height:100%;background:linear-gradient(90deg,var(--cyan),var(--purple));animation:splashLoad 2.2s .4s ease forwards;width:0}
@keyframes splashLoad{to{width:100%}}
.notif-banner{background:linear-gradient(90deg,rgba(0,212,255,.18),rgba(167,139,250,.18));border-bottom:1px solid rgba(0,212,255,.25);padding:10px 14px;display:flex;align-items:center;gap:8px;font-size:13px}
.nb-txt{flex:1;color:var(--t1);font-weight:600}
.nb-btn{background:var(--cyan);color:#050d1a;border:none;border-radius:8px;padding:6px 14px;font-weight:900;font-family:'Nunito',sans-serif;cursor:pointer;font-size:12px}
.nb-close{background:none;border:none;color:var(--t2);cursor:pointer;font-size:16px;padding:2px 6px}
.ob-shell{min-height:100dvh;display:flex;flex-direction:column;padding:24px 20px 40px;background:var(--bg)}
.ob-dots{display:flex;gap:8px;justify-content:center;margin-bottom:24px}
.ob-dot{width:8px;height:8px;border-radius:99px;background:rgba(255,255,255,.14);transition:all .3s}
.ob-dot.on{background:rgba(0,212,255,.5)}.ob-dot.cur{width:26px;background:var(--cyan)}
.ob-body{flex:1}.ob-step{padding-bottom:12px}
.ob-title{font-family:'Space Grotesk',sans-serif;font-size:30px;font-weight:700;line-height:1.15;margin-bottom:8px}
.ob-sub{font-size:14px;color:var(--t2);margin-bottom:20px;line-height:1.6}
.ob-features{display:flex;flex-direction:column;gap:9px}
.ob-feat{padding:13px 16px;background:var(--card);border:1px solid var(--border);border-radius:14px;font-size:14px;font-weight:600}
.ob-input{width:100%;padding:16px 18px;background:var(--card);border:1.5px solid var(--border);border-radius:16px;color:var(--t1);font-family:'Nunito',sans-serif;font-size:17px;font-weight:600;outline:none;transition:border-color .2s}
.ob-input:focus{border-color:var(--cyan)}.ob-input::placeholder{color:var(--t3)}
.ob-avatar-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.ob-av-btn{display:flex;flex-direction:column;align-items:center;gap:3px;padding:10px 6px;background:var(--card);border:2px solid var(--border);border-radius:16px;cursor:pointer;color:var(--t1);position:relative;transition:all .2s;overflow:hidden;min-height:110px}
.ob-av-btn.sel{border-color:var(--cyan);background:rgba(0,212,255,.1)}
.ob-av-preview{height:72px;display:flex;align-items:flex-end;justify-content:center;overflow:hidden}
.ob-av-label{font-size:11px;font-weight:800;color:var(--t1)}
.ob-av-desc{font-size:9px;color:var(--t3);text-align:center;line-height:1.2}
.ob-av-check{position:absolute;top:5px;right:7px;font-size:11px;font-weight:900;color:var(--cyan)}
.ob-routines{display:flex;flex-direction:column;gap:8px}
.ob-routine{display:flex;align-items:center;gap:12px;padding:13px 16px;background:var(--card);border:2px solid var(--border);border-radius:14px;cursor:pointer;color:var(--t1);text-align:left;width:100%;transition:all .2s}
.ob-routine.sm{padding:10px 13px}.ob-routine.sel{border-color:var(--cyan);background:rgba(0,212,255,.08)}
.ob-rt-info{flex:1}.ob-rt-name{display:block;font-weight:800;font-size:15px}.ob-rt-desc{display:block;font-size:11px;color:var(--t2);margin-top:1px}
.ob-rt-goal{font-size:13px;font-weight:700;color:var(--t3)}.ob-rt-goal.cyan,.cyan{color:var(--cyan)!important}
.ob-actions{display:flex;gap:12px;padding-top:20px}
.btn-pri{flex:1;padding:16px;background:linear-gradient(135deg,var(--cyan),#0099ee);border:none;border-radius:16px;color:#fff;font-family:'Nunito',sans-serif;font-size:16px;font-weight:900;cursor:pointer;transition:transform .15s;box-shadow:0 4px 20px rgba(0,212,255,.28)}
.btn-pri:active{transform:scale(.96)}.btn-pri.small{flex:0;padding:11px 18px;font-size:14px}
.btn-sec{padding:16px 18px;background:var(--card);border:1px solid var(--border);border-radius:16px;color:var(--t2);font-family:'Nunito',sans-serif;font-size:15px;font-weight:700;cursor:pointer}
.btn-outline{width:100%;padding:12px;background:transparent;border:1.5px solid var(--border);border-radius:12px;color:var(--cyan);font-family:'Nunito',sans-serif;font-size:13px;font-weight:700;cursor:pointer}
.btn-danger{width:100%;padding:12px;background:rgba(248,113,113,.1);border:1.5px solid rgba(248,113,113,.3);border-radius:12px;color:var(--red);font-family:'Nunito',sans-serif;font-size:13px;font-weight:700;cursor:pointer;margin-top:12px}
.glass-card{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:16px;margin-bottom:12px}
.card-title{font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:600;color:var(--t2);text-transform:uppercase;letter-spacing:.6px;margin-bottom:12px}
.bottom-nav{display:flex;background:var(--bg2);border-top:1px solid var(--border);padding:6px 0 max(6px,env(safe-area-inset-bottom))}
.nav-tab{flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 4px;background:none;border:none;cursor:pointer;color:var(--t3);transition:color .2s}
.nav-tab.active{color:var(--cyan)}.nav-tab.active .nav-icon{transform:scale(1.18)}
.nav-icon{font-size:22px;transition:transform .2s;display:block}.nav-lbl{font-size:10px;font-weight:700}
.home-screen{padding-top:max(12px,env(safe-area-inset-top))}
.home-hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px}
.home-greeting{font-size:17px;font-weight:900}.home-date{font-size:11px;color:var(--t2);text-transform:capitalize;margin-top:2px}
.home-hdr-right{display:flex;align-items:center;gap:7px}
.icon-btn{background:none;border:none;font-size:20px;cursor:pointer;padding:2px}
.level-badge{background:linear-gradient(135deg,var(--purple),var(--cyan));color:#fff;font-size:11px;font-weight:900;padding:4px 10px;border-radius:99px}
.streak-badge{background:rgba(251,191,36,.14);color:var(--amber);font-size:11px;font-weight:900;padding:4px 10px;border-radius:99px;border:1px solid rgba(251,191,36,.3)}
.xp-wrap{margin-bottom:10px}.xp-hdr{display:flex;align-items:center;gap:7px;margin-bottom:5px}
.xp-level{font-size:11px;font-weight:900;color:var(--cyan)}.xp-title{font-size:11px;color:var(--t2);flex:1}.xp-pts{font-size:10px;color:var(--t3)}
.xp-track{height:6px;background:rgba(255,255,255,.07);border-radius:99px;overflow:hidden;border:1px solid var(--border)}
.xp-fill{height:100%;background:linear-gradient(90deg,var(--cyan),var(--purple));border-radius:99px;transition:width 1s ease}
.motiv-card{font-size:12px;color:var(--t2);font-style:italic;padding:11px 14px;margin-bottom:12px}
.dashboard{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px}
.dash-tama{display:flex;flex-direction:column;align-items:center;gap:6px}
.dash-ring{flex:1;display:flex;justify-content:center}
.mood-lbl{font-size:11px;text-align:center;font-weight:700;line-height:1.3;max-width:120px}
.remain-row{display:flex;align-items:center;justify-content:center;gap:5px;margin-bottom:16px;flex-wrap:wrap}
.remain-lbl{font-size:13px;color:var(--t2)}.remain-amt{font-size:19px;font-weight:900;color:var(--cyan);font-family:'Space Grotesk',sans-serif}
.goal-done{font-size:15px;font-weight:900;color:var(--green)}
.sec-lbl{font-size:11px;font-weight:900;color:var(--t2);text-transform:uppercase;letter-spacing:.6px;margin-bottom:9px}
.quick-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:10px}
.quick-btn{display:flex;flex-direction:column;align-items:center;gap:4px;padding:12px 4px;background:var(--card);border:1.5px solid var(--border);border-radius:16px;cursor:pointer;color:var(--t1);font-family:'Nunito',sans-serif;transition:all .15s}
.quick-btn:active{transform:scale(.93);border-color:var(--cyan);background:rgba(0,212,255,.12)}
.quick-icon{font-size:20px}.quick-lbl{font-size:12px;font-weight:900}
.custom-btn{width:100%;padding:12px;background:var(--card);border:1.5px dashed var(--border);border-radius:14px;color:var(--t2);font-family:'Nunito',sans-serif;font-size:13px;font-weight:700;cursor:pointer;margin-bottom:10px}
.custom-row{display:flex;gap:8px;align-items:center;margin-bottom:10px}
.custom-input{flex:1;padding:12px 14px;background:var(--card);border:1.5px solid var(--border);border-radius:14px;color:var(--t1);font-family:'Nunito',sans-serif;font-size:15px;font-weight:600;outline:none}
.custom-input:focus{border-color:var(--cyan)}.ml-lbl{color:var(--t2);font-weight:700}
.log-item{display:flex;align-items:center;gap:12px;padding:10px 14px;margin-bottom:6px}
.log-ml{flex:1;font-weight:900;font-size:14px;color:var(--cyan)}.log-time{font-size:12px;color:var(--t3)}
.ring-wrap{position:relative;width:178px;height:178px;display:flex;align-items:center;justify-content:center}
.ring-inner{text-align:center;pointer-events:none}
.ring-consumed{font-family:'Space Grotesk',sans-serif;font-size:24px;font-weight:700}.ring-of{font-size:11px;color:var(--t2)}.ring-pct{font-size:14px;font-weight:900;margin-top:2px;transition:color .5s}
.scr-hdr{margin-bottom:14px;padding-top:max(12px,env(safe-area-inset-top))}
.scr-title{font-family:'Space Grotesk',sans-serif;font-size:24px;font-weight:700}.scr-sub{font-size:13px;color:var(--t2);margin-top:2px}
.stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
.stat-card{padding:14px;border-radius:18px;text-align:center;border:1.5px solid}
.sc-cyan{background:rgba(0,212,255,.08);border-color:rgba(0,212,255,.25)}.sc-purple{background:rgba(167,139,250,.08);border-color:rgba(167,139,250,.25)}
.sc-blue{background:rgba(56,189,248,.08);border-color:rgba(56,189,248,.25)}.sc-green{background:rgba(52,211,153,.08);border-color:rgba(52,211,153,.25)}
.sc-icon{font-size:26px;margin-bottom:6px}.sc-val{font-family:'Space Grotesk',sans-serif;font-size:28px;font-weight:700}.sc-lbl{font-size:11px;color:var(--t2);font-weight:700;margin-top:2px}
.bar-chart{display:flex;align-items:flex-end;gap:6px;height:120px;padding-top:22px}
.bar-col{flex:1;display:flex;flex-direction:column;align-items:center;height:100%}
.bar-amt{font-size:7px;color:var(--t3);margin-bottom:3px;text-align:center}
.bar-track{flex:1;width:100%;background:rgba(255,255,255,.05);border-radius:6px;overflow:hidden;display:flex;align-items:flex-end;border:1px solid var(--border)}
.bar-fill{width:100%;border-radius:5px;background:linear-gradient(180deg,var(--blue),var(--cyan2));transition:height 1s ease}
.bar-fill.complete{background:linear-gradient(180deg,#34d399,#059669)}.bar-fill.today{background:linear-gradient(180deg,var(--cyan),var(--purple));box-shadow:0 0 10px rgba(0,212,255,.35)}
.bar-day{font-size:10px;color:var(--t2);margin-top:4px;font-weight:700}.today-lbl{color:var(--cyan)}
.sum-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);font-size:13px;color:var(--t2)}
.sum-row:last-of-type{border-bottom:none}.sum-row strong{color:var(--t1);font-size:14px}
.pr-row{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.pr-day{font-size:12px;font-weight:900;color:var(--t2);width:28px}
.pr-track{flex:1;height:8px;background:rgba(255,255,255,.06);border-radius:99px;overflow:hidden}
.pr-fill{height:100%;border-radius:99px;transition:width 1s ease}
.pr-fill.c{background:var(--green)}.pr-fill.g{background:var(--cyan)}.pr-fill.l{background:var(--purple)}
.pr-pct{font-size:11px;font-weight:700;color:var(--t2);width:32px;text-align:right}
.level-show{display:flex;align-items:center;gap:14px}
.ls-info{flex:1}.ls-level{font-family:'Space Grotesk',sans-serif;font-size:19px;font-weight:700}.ls-title{font-size:12px;color:var(--cyan);font-weight:700;margin-bottom:8px}
.streak-show{display:flex;align-items:center;gap:14px;background:rgba(251,191,36,.08);border-color:rgba(251,191,36,.25)}
.ss-num{font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:700;color:var(--amber)}.ss-lbl{font-size:12px;color:var(--t2)}.ss-quote{font-size:11px;color:var(--t3);font-style:italic;margin-top:4px}
.ach-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
.ach-card{padding:14px;border-radius:18px;text-align:center;border:1.5px solid var(--border);background:var(--card)}
.ach-card.unlocked{border-color:rgba(0,212,255,.3);background:rgba(0,212,255,.05)}.ach-card.locked{opacity:.55}
.ach-icon{font-size:30px;display:block;margin-bottom:6px}.ach-lbl{font-size:12px;font-weight:900;margin-bottom:2px}.ach-desc{font-size:10px;color:var(--t2);margin-bottom:4px;line-height:1.3}.ach-xp{font-size:10px;font-weight:900;color:var(--cyan)}
.cfg-av-grid{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
.cfg-av-btn{display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 12px;background:var(--card);border:2px solid var(--border);border-radius:14px;cursor:pointer;color:var(--t1);transition:all .2s}
.cfg-av-btn.sel{border-color:var(--cyan);background:rgba(0,212,255,.1)}
.cfg-routines{display:flex;flex-direction:column;gap:7px}
.cfg-slider{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)}
.cfg-slider:last-of-type{border-bottom:none}.cfg-sl-lbl{font-size:13px;color:var(--t2);width:60px}
.slider{flex:1;accent-color:var(--cyan);cursor:pointer}.cfg-sl-val{font-size:13px;font-weight:700;color:var(--cyan);width:44px;text-align:right}
.toggle-row{display:flex;align-items:center;justify-content:space-between;padding:13px 0;border-bottom:1px solid var(--border);font-size:14px;color:var(--t1)}
.toggle-row:last-child{border-bottom:none}
.toggle{width:50px;height:28px;border-radius:99px;border:none;cursor:pointer;position:relative;transition:background .3s}
.toggle.on{background:var(--cyan)}.toggle.off{background:rgba(255,255,255,.15)}
.toggle-thumb{position:absolute;top:4px;width:20px;height:20px;background:#fff;border-radius:50%;transition:left .3s}
.toggle.on .toggle-thumb{left:26px}.toggle.off .toggle-thumb{left:4px}
.notif-status{padding:10px 14px;border-radius:12px;font-size:13px;font-weight:600;margin-bottom:4px}
.ns-granted{background:rgba(52,211,153,.12);color:var(--green);border:1px solid rgba(52,211,153,.3)}
.ns-denied{background:rgba(248,113,113,.12);color:var(--red);border:1px solid rgba(248,113,113,.3)}
.ns-default{background:rgba(251,191,36,.1);color:var(--amber);border:1px solid rgba(251,191,36,.3)}
.notif-how{margin-top:4px}.how-step{display:flex;gap:8px;font-size:12px;color:var(--t2);padding:5px 0;border-bottom:1px solid var(--border)}.how-step:last-child{border-bottom:none}.how-step b{color:var(--t1)}
.notif-prev-bubble{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:16px;padding:12px 14px}
.npb-header{display:flex;align-items:center;gap:7px;margin-bottom:6px}
.npb-app{font-size:12px;font-weight:900;color:var(--cyan);flex:1}.npb-time{font-size:11px;color:var(--t3)}
.npb-body{font-size:13px;color:var(--t1);font-weight:600;line-height:1.4;margin-bottom:10px}
.npb-actions{display:flex;gap:8px}
.npb-action{font-size:11px;font-weight:800;color:var(--cyan);background:rgba(0,212,255,.12);border:1px solid rgba(0,212,255,.25);padding:4px 12px;border-radius:99px}
.toast-layer{position:fixed;top:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;z-index:9999;padding-top:max(14px,env(safe-area-inset-top));pointer-events:none;display:flex;flex-direction:column;align-items:center;gap:8px}
.toast-item{display:flex;align-items:center;gap:10px;padding:11px 20px;background:rgba(5,13,26,.97);border:1px solid var(--cyan);border-radius:99px;box-shadow:0 6px 28px rgba(0,212,255,.22);animation:toastIn .35s cubic-bezier(.34,1.56,.64,1);max-width:calc(100% - 32px)}
.toast-txt{font-size:13px;font-weight:700;color:var(--t1)}
@keyframes toastIn{from{opacity:0;transform:translateY(-20px) scale(.88)}to{opacity:1;transform:none}}
.xp-pop{position:fixed;right:20px;top:90px;background:linear-gradient(135deg,var(--purple),var(--cyan));color:#fff;font-size:14px;font-weight:900;padding:8px 16px;border-radius:99px;z-index:9998;pointer-events:none;animation:xpPop 2.1s ease forwards}
@keyframes xpPop{0%{opacity:0;transform:translateY(10px) scale(.8)}15%{opacity:1;transform:none}80%{opacity:1}100%{opacity:0;transform:translateY(-44px)}}
.celebrate-layer{position:fixed;inset:0;z-index:9997;overflow:hidden}
.conf{position:absolute;font-size:30px;animation:confFall 3s ease-in both}
.conf-0{left:6%;animation-delay:.0s}.conf-1{left:20%;animation-delay:.15s}.conf-2{left:37%;animation-delay:.05s}.conf-3{left:52%;animation-delay:.2s}
.conf-4{left:66%;animation-delay:.0s}.conf-5{left:79%;animation-delay:.1s}.conf-6{left:89%;animation-delay:.25s}.conf-7{left:46%;animation-delay:.3s}
@keyframes confFall{from{top:-60px;transform:rotate(0)}to{top:110vh;transform:rotate(720deg) scale(.4)}}
.fade-in{animation:fadeUp .35s ease}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
/* ════ CHARACTERS ════ */
.char-wrap{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;user-select:none;cursor:default;width:120px;min-height:130px}
.char-happy{animation:cH .65s ease-in-out infinite}.char-normal{animation:cN 3s ease-in-out infinite}.char-sad{animation:cS 2s ease-in-out infinite}.char-critical{animation:cC .32s ease-in-out infinite}
@keyframes cH{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-13px) rotate(2deg)}}
@keyframes cN{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes cS{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(3px) rotate(1deg)}}
@keyframes cC{0%,100%{transform:translateX(0)}33%{transform:translateX(-4px)}66%{transform:translateX(4px)}}
.splash-ring{position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:110px;height:30px;border:3px solid rgba(91,200,245,.4);border-radius:50%;animation:sRA .8s ease-out infinite;pointer-events:none}
@keyframes sRA{0%{transform:translateX(-50%) scale(.6);opacity:.8}100%{transform:translateX(-50%) scale(1.5);opacity:0}}
.splash-drop{position:absolute;font-size:13px;pointer-events:none;animation:sDA .9s ease-out infinite}
.sp0{bottom:8px;left:14px;animation-delay:.0s}.sp1{bottom:8px;right:14px;animation-delay:.1s}.sp2{bottom:18px;left:6px;animation-delay:.15s}.sp3{bottom:18px;right:6px;animation-delay:.2s}.sp4{bottom:28px;left:22px;animation-delay:.05s}.sp5{bottom:28px;right:22px;animation-delay:.25s}
@keyframes sDA{0%{transform:scale(0);opacity:1}100%{transform:scale(1) translateY(-30px);opacity:0}}
.drop-body{position:relative;overflow:hidden;width:80px;height:95px;background:linear-gradient(145deg,#7de8ff 0%,#29b8f0 45%,#1890cc 100%);border-radius:50% 50% 46% 46%/38% 38% 62% 62%;border:3px solid rgba(255,255,255,.5);box-shadow:0 0 0 2px rgba(41,184,240,.4),0 8px 24px rgba(0,150,220,.5),inset 0 -10px 20px rgba(0,0,0,.15),inset 0 4px 12px rgba(255,255,255,.3);flex-shrink:0}
.char-happy .drop-body{box-shadow:0 0 0 3px rgba(0,212,255,.6),0 10px 30px rgba(0,180,255,.5),inset 0 -8px 18px rgba(0,0,0,.1),inset 0 4px 14px rgba(255,255,255,.4)}
.char-sad .drop-body{background:linear-gradient(145deg,#93c5d8,#5a90b0,#3a6a90);filter:saturate(.7)}
.char-critical .drop-body{background:linear-gradient(145deg,#b0ccd8,#6a8898,#4a6070);filter:saturate(.3) brightness(.8)}
.drop-shine{position:absolute;top:10px;left:12px;width:18px;height:28px;background:rgba(255,255,255,.45);border-radius:50%;transform:rotate(-20deg);filter:blur(2px)}
.drop-face{position:relative;z-index:3;display:flex;flex-direction:column;align-items:center;padding-top:16px;gap:5px}
.dino-face{padding-top:12px}.whale-face{padding-top:14px}.plant-face{padding-top:16px}.ghost-face{padding-top:18px}.fire-face{padding-top:12px;gap:3px}.cloud-face{padding-top:22px}
.eyes-row{display:flex;gap:14px;justify-content:center}
.eye{width:13px;height:13px;background:#1a1a35;border-radius:50%;position:relative;border:2px solid rgba(255,255,255,.6);flex-shrink:0;transition:all .3s}
.eye-happy{height:9px!important;border-radius:50% 50% 0 0!important}.eye-sad{transform:rotate(15deg)}
.eye-x{background:transparent!important;border-color:transparent!important;display:flex;align-items:center;justify-content:center}
.eye-x-mark{font-size:12px;font-weight:900;color:#f87171;line-height:1}
.eye-sunglass{background:transparent!important;border:none!important;display:flex;align-items:center;justify-content:center}
.sunglass{font-size:16px;line-height:1;margin-top:-2px}
.eye-gleam{position:absolute;top:2px;right:2px;width:4px;height:4px;background:#fff;border-radius:50%}
.cheek{position:absolute;width:11px;height:8px;background:rgba(255,160,180,.6);border-radius:50%;z-index:4}
.cheek-l{left:9%}.cheek-r{right:9%}.robot-cheek{background:rgba(0,212,255,.4)!important}.fire-cheek{background:rgba(255,200,100,.6)!important}
.mouth{transition:all .3s}
.mouth-happy{width:22px;height:11px;border:3px solid rgba(255,255,255,.85);border-top:none;border-radius:0 0 22px 22px;background:rgba(220,60,80,.55)}
.mouth-normal{width:14px;height:0;border-bottom:3px solid rgba(255,255,255,.75);border-radius:2px}
.mouth-sad{width:18px;height:9px;border:3px solid rgba(255,255,255,.7);border-bottom:none;border-radius:9px 9px 0 0;margin-top:6px}
.mouth-critical{width:12px;height:0;border-bottom:3px solid rgba(248,113,113,.9);border-radius:2px;margin-top:6px}
.tear{position:absolute;bottom:10%;width:5px;height:9px;background:rgba(120,200,255,.85);border-radius:50% 50% 80% 80%;z-index:5;animation:tF 1.2s ease-in infinite}
.tear-l{left:20%}.tear-r{right:20%}
@keyframes tF{0%{transform:translateY(0);opacity:1}100%{transform:translateY(16px);opacity:0}}
.body-water{position:absolute;bottom:0;left:0;right:0;background:linear-gradient(0deg,rgba(0,180,255,.45),rgba(0,212,255,.18));border-radius:0 0 42px 42px;transition:height 1.5s cubic-bezier(.4,0,.2,1);z-index:1}
.dino-water,.plant-water{border-radius:0 0 36px 36px}
.bubble{position:absolute;background:rgba(255,255,255,.5);border-radius:50%;z-index:2;animation:bR 2s ease-in infinite}
.b1{width:6px;height:6px;left:20%;bottom:15%;animation-delay:0s}.b2{width:4px;height:4px;left:55%;bottom:25%;animation-delay:.7s}.b3{width:5px;height:5px;left:70%;bottom:10%;animation-delay:1.3s}
@keyframes bR{0%{transform:translateY(0);opacity:.7}100%{transform:translateY(-40px);opacity:0}}
.arm{position:absolute;width:12px;height:28px;border-radius:6px;z-index:0;bottom:24%;transition:transform .3s}
.arm-l{left:2px;transform-origin:top center;background:linear-gradient(180deg,#5bc8f5,#2a9fd4)}
.arm-r{right:2px;transform-origin:top center;background:linear-gradient(180deg,#5bc8f5,#2a9fd4)}
.dino-arm{background:linear-gradient(180deg,#6ad870,#2eb040)!important;width:11px;height:24px}
.robot-arm{background:linear-gradient(180deg,#8090a8,#505f78)!important;width:10px;height:26px;border-radius:4px}
.arm-happy.arm-l{animation:aWL .45s ease-in-out infinite alternate}.arm-happy.arm-r{animation:aWR .45s ease-in-out infinite alternate}
.arm-sad.arm-l{transform:rotate(30deg)}.arm-sad.arm-r{transform:rotate(-30deg)}
.arm-critical.arm-l{transform:rotate(60deg) translateY(4px)}.arm-critical.arm-r{transform:rotate(-60deg) translateY(4px)}
@keyframes aWL{from{transform:rotate(-40deg)}to{transform:rotate(10deg)}}
@keyframes aWR{from{transform:rotate(40deg)}to{transform:rotate(-10deg)}}
.star{position:absolute;font-size:15px;z-index:10;pointer-events:none;animation:stP 1.4s ease-in-out infinite}
.s1{top:-14px;right:-12px;animation-delay:0s}.s2{top:2px;left:-18px;animation-delay:.5s}.s3{bottom:-4px;right:-18px;animation-delay:.9s}
@keyframes stP{0%,100%{transform:scale(.6) rotate(0);opacity:.5}50%{transform:scale(1.3) rotate(180deg);opacity:1}}
.zzz-badge{position:absolute;top:-12px;right:-10px;font-size:14px;animation:zF 1.8s ease-in-out infinite;z-index:10}
@keyframes zF{0%,100%{transform:translateY(0) rotate(-5deg);opacity:.7}50%{transform:translateY(-8px) rotate(5deg);opacity:1}}
.sweat-drop{position:absolute;top:0;right:-14px;font-size:16px;z-index:10;animation:swA 1s ease-in infinite}
@keyframes swA{0%{transform:translateY(0);opacity:1}100%{transform:translateY(20px);opacity:0}}
.dino-body{position:relative;overflow:hidden;width:78px;height:88px;background:linear-gradient(145deg,#7ce87c,#3cc040,#28a030);border-radius:42% 42% 45% 45%/36% 36% 58% 58%;border:3px solid rgba(255,255,255,.5);box-shadow:0 0 0 2px rgba(60,192,64,.4),0 8px 24px rgba(30,160,50,.5),inset 0 -10px 20px rgba(0,0,0,.15),inset 0 4px 12px rgba(255,255,255,.3);flex-shrink:0}
.char-happy .dino-body{box-shadow:0 0 0 3px rgba(80,240,80,.6),0 10px 30px rgba(50,200,60,.5)}
.char-sad .dino-body{background:linear-gradient(145deg,#8aa88a,#4a784a);filter:saturate(.7)}
.char-critical .dino-body{background:linear-gradient(145deg,#909890,#506050);filter:saturate(.2) brightness(.75)}
.dino-shine{position:absolute;top:10px;left:12px;width:16px;height:26px;background:rgba(255,255,255,.38);border-radius:50%;transform:rotate(-20deg);filter:blur(2px)}
.dino-spikes{position:absolute;top:-14px;left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:5}
.dino-spike{width:10px;height:18px;background:linear-gradient(180deg,#52d852,#22a022);clip-path:polygon(50% 0%,100% 100%,0% 100%);border-radius:3px;transition:all .3s}
.ds0,.ds3{width:8px;height:14px;margin-top:4px}
.spike-happy{animation:spW .7s ease-in-out infinite alternate}
@keyframes spW{from{transform:scaleY(1) rotate(-3deg)}to{transform:scaleY(1.3) rotate(3deg)}}
.dino-tail{position:absolute;bottom:8px;right:-20px;width:24px;height:18px;background:linear-gradient(135deg,#3cc040,#28a030);border-radius:60% 80% 80% 20%;transform:rotate(-15deg);transform-origin:left center;z-index:0}
.tail-wag{animation:tW .4s ease-in-out infinite alternate}
@keyframes tW{from{transform:rotate(-20deg)}to{transform:rotate(15deg)}}
.whale-wrap{width:130px!important}
.whale-body{position:relative;overflow:hidden;width:108px;height:76px;background:linear-gradient(145deg,#80b8ff,#4488e8,#2860c0);border-radius:52% 52% 48% 48%/58% 58% 42% 42%;border:3px solid rgba(255,255,255,.5);box-shadow:0 0 0 2px rgba(80,136,232,.4),0 8px 24px rgba(40,96,192,.5),inset 0 -10px 20px rgba(0,0,0,.15),inset 0 4px 12px rgba(255,255,255,.3);flex-shrink:0}
.char-happy .whale-body{box-shadow:0 0 0 3px rgba(100,180,255,.6),0 10px 30px rgba(60,140,255,.5)}
.char-sad .whale-body{background:linear-gradient(145deg,#8ab0d0,#4a7090);filter:saturate(.7)}
.char-critical .whale-body{background:linear-gradient(145deg,#909ab0,#506080);filter:saturate(.2) brightness(.75)}
.whale-shine{position:absolute;top:8px;left:14px;width:20px;height:22px;background:rgba(255,255,255,.38);border-radius:50%;transform:rotate(-20deg);filter:blur(2px)}
.whale-belly{position:absolute;bottom:6px;left:50%;transform:translateX(-50%);width:70px;height:30px;background:rgba(255,255,255,.22);border-radius:50%;border:2px solid rgba(255,255,255,.3)}
.whale-tail{position:absolute;bottom:10px;right:-22px;width:30px;height:24px;background:linear-gradient(135deg,#4488e8,#2860c0);clip-path:polygon(0 50%,60% 0%,100% 25%,100% 75%,60% 100%);z-index:0}
.whale-spout{position:absolute;top:-32px;left:30%;font-size:13px;text-align:center;animation:wSp 1s ease-in-out infinite;line-height:1.1;z-index:10}
@keyframes wSp{0%,100%{transform:translateY(0);opacity:1}50%{transform:translateY(-8px);opacity:.5}}
.whale-zzz{top:-8px;right:-14px}
.plant-body{position:relative;overflow:hidden;width:74px;height:80px;background:linear-gradient(145deg,#a8e078,#72c038,#52a020);border-radius:50%;border:3px solid rgba(255,255,255,.5);box-shadow:0 0 0 2px rgba(100,192,60,.4),0 8px 24px rgba(70,160,30,.5),inset 0 -10px 20px rgba(0,0,0,.15),inset 0 4px 12px rgba(255,255,255,.3);flex-shrink:0}
.char-happy .plant-body{box-shadow:0 0 0 3px rgba(140,220,80,.6),0 10px 30px rgba(100,200,40,.5)}
.char-sad .plant-body{background:linear-gradient(145deg,#a0b880,#607840);filter:saturate(.6)}
.char-critical .plant-body{background:linear-gradient(145deg,#c8a870,#8a6030);filter:saturate(.2) brightness(.8)}
.plant-shine{position:absolute;top:8px;left:10px;width:14px;height:22px;background:rgba(255,255,255,.38);border-radius:50%;transform:rotate(-15deg);filter:blur(2px)}
.plant-top{position:absolute;top:-26px;left:50%;transform:translateX(-50%);display:flex;align-items:flex-end;justify-content:center;z-index:4}
.plant-stem{width:5px;height:20px;background:linear-gradient(180deg,#52a020,#3a7818);border-radius:3px}
.plant-leaf{position:absolute;background:linear-gradient(135deg,#6ad840,#40b020);border-radius:50% 50% 50% 0;z-index:3}
.pl0{width:22px;height:28px;left:-22px;top:-8px;transform:rotate(-35deg)}.pl1{width:22px;height:28px;right:-22px;top:-8px;transform:rotate(35deg) scaleX(-1)}.pl2{width:18px;height:24px;left:-12px;top:-20px;transform:rotate(-55deg)}
.plant-flower{position:absolute;top:-42px;left:50%;transform:translateX(-50%);font-size:20px;animation:plF 1.2s ease-in-out infinite alternate}
@keyframes plF{from{transform:translateX(-50%) rotate(-8deg)}to{transform:translateX(-50%) rotate(8deg)}}
.leaf-bounce{animation:lB .8s ease-in-out infinite alternate}
@keyframes lB{from{transform:rotate(-35deg) scale(1)}to{transform:rotate(-25deg) scale(1.12)}}
.plant-pot{width:60px;height:24px;background:linear-gradient(180deg,#d2855a,#a05030);border-radius:4px 4px 10px 10px;border:2px solid rgba(255,255,255,.2);margin-top:-2px;position:relative;z-index:2;flex-shrink:0}
.robot-antenna{position:absolute;top:-22px;left:50%;transform:translateX(-50%);width:5px;height:18px;background:linear-gradient(180deg,#8090a8,#505f78);border-radius:3px;z-index:5}
.antenna-ball{position:absolute;top:-9px;left:-3px;width:10px;height:10px;border-radius:50%}
.aball-happy{background:#00d4ff;box-shadow:0 0 10px #00d4ff;animation:aB .4s ease-in-out infinite}
.aball-crit{background:#f87171;box-shadow:0 0 8px #f87171;animation:aB .15s ease-in-out infinite}
.aball-idle{background:#475569}
@keyframes aB{0%,100%{opacity:1}50%{opacity:.2}}
.robot-head{position:relative;overflow:hidden;width:76px;height:72px;background:linear-gradient(145deg,#c8d8e8,#8090a8,#505f78);border-radius:16px;border:3px solid rgba(255,255,255,.5);box-shadow:0 0 0 2px rgba(128,144,168,.4),0 8px 24px rgba(60,80,100,.5),inset 0 -8px 16px rgba(0,0,0,.2),inset 0 4px 12px rgba(255,255,255,.25);flex-shrink:0}
.char-happy .robot-head{box-shadow:0 0 0 3px rgba(0,212,255,.5),0 10px 28px rgba(0,160,200,.5)}
.char-sad .robot-head{background:linear-gradient(145deg,#8098a8,#405060);filter:saturate(.5)}
.char-critical .robot-head{background:linear-gradient(145deg,#607080,#303840);filter:brightness(.7)}
.robot-ear{position:absolute;top:20px;width:8px;height:16px;background:linear-gradient(180deg,#7080a0,#405060);border-radius:4px;border:2px solid rgba(255,255,255,.2)}
.robot-ear-l{left:-6px}.robot-ear-r{right:-6px}
.robot-screen{position:relative;z-index:3;margin:8px;background:rgba(0,0,0,.45);border-radius:10px;border:2px solid rgba(0,212,255,.4);padding:6px 8px;display:flex;flex-direction:column;align-items:center;gap:4px;box-shadow:inset 0 0 12px rgba(0,212,255,.15)}
.robot-eyes-row{display:flex;gap:16px;justify-content:center}
.robot-eye-led{font-size:13px;font-weight:900;line-height:1;transition:all .3s}
.led-cyan{color:#00d4ff;text-shadow:0 0 8px #00d4ff;animation:lG .6s ease-in-out infinite alternate}
.led-red{color:#f87171;text-shadow:0 0 6px #f87171;animation:lG .2s ease-in-out infinite alternate}
.led-blue{color:#93c5fd}.led-white{color:rgba(255,255,255,.8)}
@keyframes lG{from{text-shadow:0 0 4px currentColor}to{text-shadow:0 0 14px currentColor}}
.robot-display-mouth{font-size:8px;letter-spacing:2px;font-family:monospace;font-weight:900;color:rgba(255,255,255,.7);min-height:12px;line-height:1}
.rdm-happy{color:#00d4ff;animation:mP .5s ease-in-out infinite alternate}
.rdm-critical{color:#f87171}
@keyframes mP{from{letter-spacing:1px}to{letter-spacing:3px}}
.robot-water-bar{width:48px;height:5px;background:rgba(0,0,0,.4);border-radius:3px;overflow:hidden;border:1px solid rgba(0,212,255,.3)}
.robot-water-fill{height:100%;background:linear-gradient(90deg,#00d4ff,#0099cc);border-radius:3px;transition:width 1s ease}
.robot-body{position:relative;overflow:hidden;width:68px;height:52px;background:linear-gradient(180deg,#a0b0c8,#607080);border-radius:8px 8px 14px 14px;border:3px solid rgba(255,255,255,.35);box-shadow:0 4px 16px rgba(60,80,100,.4);margin-top:-2px;flex-shrink:0}
.robot-chest-light{position:absolute;top:10px;left:50%;transform:translateX(-50%);width:14px;height:14px;border-radius:50%;transition:background .5s;box-shadow:0 0 10px currentColor}
.robot-fill{border-radius:0 0 10px 10px}
.robot-legs{display:flex;gap:16px;margin-top:1px;z-index:2;position:relative}
.robot-leg{width:14px;height:18px;background:linear-gradient(180deg,#607080,#404858);border-radius:4px 4px 7px 7px;border:2px solid rgba(255,255,255,.2)}
.robot-smoke{top:-4px;right:-14px}
.ghost-wrap{width:100px!important}
.ghost-body{position:relative;overflow:hidden;width:86px;height:96px;background:linear-gradient(145deg,#d8b8f8,#b070e8,#8840c8);border-radius:50% 50% 0 0;border:3px solid rgba(255,255,255,.45);box-shadow:0 0 0 2px rgba(160,100,220,.4),0 8px 28px rgba(120,60,200,.5),inset 0 -10px 20px rgba(0,0,0,.15),inset 0 4px 14px rgba(255,255,255,.25);flex-shrink:0}
.char-happy .ghost-body{box-shadow:0 0 0 3px rgba(196,132,252,.6),0 10px 32px rgba(160,80,220,.5)}
.char-sad .ghost-body{background:linear-gradient(145deg,#b0a0c8,#706090);filter:saturate(.6)}
.char-critical .ghost-body{background:linear-gradient(145deg,#9080a0,#504060);filter:saturate(.2) brightness(.75)}
.ghost-shine{position:absolute;top:10px;left:12px;width:16px;height:28px;background:rgba(255,255,255,.4);border-radius:50%;transform:rotate(-20deg);filter:blur(2px)}
.ghost-bottom{position:absolute;bottom:-4px;left:0;right:0;height:24px;background:inherit}
.ghost-bottom::after{content:'';position:absolute;bottom:0;left:0;right:0;height:20px;background:var(--bg);clip-path:polygon(0% 100%,8% 0%,16% 100%,25% 0%,33% 100%,41% 0%,50% 100%,58% 0%,66% 100%,75% 0%,83% 100%,91% 0%,100% 100%)}
.ghost-water{background:linear-gradient(0deg,rgba(167,139,250,.5),rgba(196,181,253,.18))!important;border-radius:0!important}
.bat{position:absolute;font-size:14px;z-index:10;animation:btF 1.2s ease-in-out infinite;pointer-events:none}
.bat0{top:-20px;left:-10px;animation-delay:0s}.bat1{top:-28px;right:-8px;animation-delay:.4s}.bat2{top:-12px;right:-18px;animation-delay:.8s}
@keyframes btF{0%,100%{transform:translateY(0) rotate(-5deg)}50%{transform:translateY(-8px) rotate(5deg)}}
.fire-wrap{width:100px!important;min-height:110px!important}
.fire-outer{position:relative;width:90px;height:100px;background:linear-gradient(180deg,#fde047,#fb923c,#ea580c);clip-path:polygon(50% 0%,65% 18%,80% 5%,72% 28%,90% 20%,78% 42%,95% 40%,82% 60%,90% 75%,70% 68%,65% 88%,50% 75%,35% 88%,30% 68%,10% 75%,18% 60%,5% 40%,22% 42%,10% 20%,28% 28%,20% 5%,35% 18%);animation:fO .5s ease-in-out infinite alternate;flex-shrink:0}
.char-happy .fire-outer{background:linear-gradient(180deg,#fef08a,#fbbf24,#f97316);filter:brightness(1.15)}
.char-sad .fire-outer{background:linear-gradient(180deg,#d97706,#b45309,#92400e);filter:saturate(.6)}
.char-critical .fire-outer{background:linear-gradient(180deg,#9a3412,#7c2d12,#431407);filter:saturate(.3) brightness(.8)}
@keyframes fO{from{transform:scaleX(1)}to{transform:scaleX(1.04) scaleY(1.06)}}
.fire-middle{position:absolute;top:15%;left:50%;transform:translateX(-50%);width:68px;height:72px;background:linear-gradient(180deg,#fed7aa,#fb923c,#ea580c);clip-path:polygon(50% 0%,70% 22%,88% 15%,75% 40%,92% 38%,78% 58%,88% 72%,65% 65%,58% 85%,50% 70%,42% 85%,35% 65%,12% 72%,22% 58%,8% 38%,25% 40%,12% 15%,30% 22%);animation:fM .4s ease-in-out infinite alternate}
@keyframes fM{from{transform:translateX(-50%) scaleY(1)}to{transform:translateX(-50%) scaleY(1.08)}}
.fire-inner{position:absolute;top:22%;left:50%;transform:translateX(-50%);width:50px;height:54px;background:linear-gradient(180deg,#fff7ed,#fef3c7,#fde047);clip-path:ellipse(50% 50% at 50% 60%);display:flex;align-items:center;justify-content:center}
.spark{position:absolute;font-size:12px;z-index:10;animation:spkF 1s ease-out infinite;pointer-events:none}
.sp0{top:-10px;left:10px;animation-delay:0s}.sp1{top:-15px;right:10px;animation-delay:.35s}.sp2{top:-5px;left:40%;animation-delay:.7s}
@keyframes spkF{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(-28px) rotate(180deg);opacity:0}}
.fire-smoke{top:0;right:-10px;font-size:20px!important}
.cloud-wrap{width:130px!important}
.cloud-body{position:relative;overflow:visible;width:120px;height:68px;background:linear-gradient(145deg,#ffffff,#e8f0f8,#d0dce8);border-radius:34px;border:3px solid rgba(255,255,255,.8);box-shadow:0 0 0 2px rgba(200,220,240,.5),0 8px 24px rgba(150,180,210,.4),inset 0 4px 12px rgba(255,255,255,.6);flex-shrink:0}
.char-happy .cloud-body{background:linear-gradient(145deg,#fff,#f0f8ff);box-shadow:0 0 0 3px rgba(200,240,255,.7)}
.char-sad .cloud-body{background:linear-gradient(145deg,#c8d0d8,#909aa0);filter:saturate(.6)}
.char-critical .cloud-body{background:linear-gradient(145deg,#808898,#505868);filter:saturate(.2)}
.cloud-bump{position:absolute;background:inherit;border:inherit;border-radius:50%;box-shadow:inherit}
.cb1{width:52px;height:52px;top:-26px;left:18px}.cb2{width:40px;height:40px;top:-20px;left:50px}.cb3{width:34px;height:34px;top:-16px;right:20px}
.cloud-shine{position:absolute;top:8px;left:16px;width:22px;height:14px;background:rgba(255,255,255,.6);border-radius:50%;filter:blur(3px)}
.cloud-zzz{top:-4px;right:0}
.lightning{position:absolute;bottom:-22px;left:50%;transform:translateX(-50%);font-size:24px;z-index:10;animation:ltF .3s ease-in-out infinite}
@keyframes ltF{0%,100%{opacity:1}50%{opacity:.1}}
.rain-drop{position:absolute;bottom:-18px;font-size:11px;animation:rnF .8s ease-in infinite;pointer-events:none}
.rd0{left:15%;animation-delay:0s}.rd1{left:35%;animation-delay:.2s}.rd2{left:60%;animation-delay:.1s}.rd3{left:80%;animation-delay:.3s}
@keyframes rnF{0%{transform:translateY(0);opacity:1}100%{transform:translateY(20px);opacity:0}}
`
