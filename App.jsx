import { useState, useEffect, useRef } from "react";

const PHONE = "5583986609128";
const PIX_KEY = "83986609128";
const SK_CATS    = "jrl_categories_v3";
const SK_ORDERS  = "jrl_orders_v3";
const SK_PWD     = "jrl_admin_pwd_v3";
const SK_SETTINGS= "jrl_settings_v3";

const DEFAULT_SETTINGS = {
  companyName: "Junior's Pizzas & Lanches",
  companySlogan: "Sabor que chega até você 🍕",
  logoEmoji: "🍕",
  heroBg: "#E8132A",
  videoUrl: "",
  showIntro: true,
  frete: 5,
};

const DEFAULT_CATS = [
  { id:"salgados", name:"Salgados", emoji:"🥪", color:"#7c2d12", color2:"#431407", items:[
    {id:101,name:"Coxinha de Frango",emoji:"🍗",price:4.50,badge:"top",bl:"+ Pedida",desc:"Massa crocante, recheio de frango cremoso com catupiry.",img:""},
    {id:102,name:"Empada de Camarao",emoji:"🥧",price:5.50,badge:"new",bl:"Novidade",desc:"Massa amanteigada, recheio de camarao temperado.",img:""},
    {id:103,name:"Esfiha de Carne",emoji:"🫓",price:4.00,badge:null,bl:"",desc:"Esfiha aberta com carne moida, cebola e tomate.",img:""},
    {id:104,name:"Pao de Queijo (3un)",emoji:"🧀",price:3.00,badge:null,bl:"",desc:"Macio por dentro, crocante por fora.",img:""},
    {id:105,name:"Pastel de Queijo",emoji:"🥐",price:5.00,badge:null,bl:"",desc:"Pastel grande com queijo mussarela. Frito na hora.",img:""},
  ]},
  { id:"burgers", name:"Hamburgueres", emoji:"🍔", color:"#7f1d1d", color2:"#450a0a", items:[
    {id:201,name:"Junior Classico",emoji:"🍔",price:26.90,badge:"top",bl:"+ Pedido",desc:"Blend 180g, cheddar, alface, tomate, maionese especial, pao brioche.",img:""},
    {id:202,name:"Double Smash",emoji:"🍔",price:34.90,badge:"hot",bl:"Destaque",desc:"Dois smash 90g, cheddar duplo, cebola caramelizada, bacon crocante.",img:""},
    {id:203,name:"Bacon Lover",emoji:"🍔",price:31.90,badge:null,bl:"",desc:"Blend 180g, bacon artesanal, cheddar, cebola crispy, molho barbecue.",img:""},
    {id:204,name:"Frango Crispy",emoji:"🍗",price:25.90,badge:"new",bl:"Novo",desc:"File de frango empanado, maionese de alho, alface, tomate.",img:""},
  ]},
  { id:"pizzas", name:"Pizzas", emoji:"🍕", color:"#78350f", color2:"#451a03", items:[
    {id:301,name:"Calabresa Artesanal",emoji:"🍕",price:39.90,badge:"top",bl:"+ Pedida",desc:"Molho artesanal, mussarela, calabresa fatiada, cebola, azeitona.",img:""},
    {id:302,name:"Frango c/ Catupiry",emoji:"🍕",price:42.90,badge:null,bl:"",desc:"Frango desfiado, catupiry original, mussarela.",img:""},
    {id:303,name:"Portuguesa",emoji:"🍕",price:44.90,badge:null,bl:"",desc:"Presunto, ovos, ervilha, cebola, mussarela, azeitona.",img:""},
    {id:304,name:"Quatro Queijos",emoji:"🍕",price:46.90,badge:"hot",bl:"Top",desc:"Mussarela, cheddar, catupiry, parmesao.",img:""},
  ]},
  { id:"nordestino", name:"Pratos Nordestinos", emoji:"🥩", color:"#7c2d12", color2:"#3b0a00", items:[
    {id:401,name:"Carne de Sol c/ Macaxeira",emoji:"🥩",price:35.90,badge:"hot",bl:"Especial",desc:"Carne de sol grelhada, macaxeira cozida, manteiga de garrafa, cebola.",img:""},
    {id:402,name:"Baiao de Dois",emoji:"🍛",price:27.90,badge:"top",bl:"+ Pedido",desc:"Arroz com feijao-verde, queijo coalho, carne seca, cebola e pimentoes.",img:""},
    {id:403,name:"Cartola",emoji:"🍌",price:13.90,badge:"top",bl:"Nordestina",desc:"Banana frita com queijo coalho grelhado e canela.",img:""},
  ]},
  { id:"porcoes", name:"Porcoes", emoji:"🍟", color:"#713f12", color2:"#3d1e00", items:[
    {id:501,name:"Batata Frita",emoji:"🍟",price:15.90,badge:null,bl:"",desc:"Batata palito crocante, sal e ervas. Serve 2 pessoas.",img:""},
    {id:502,name:"Batata c/ Cheddar e Bacon",emoji:"🧀",price:19.90,badge:"top",bl:"+ Pedida",desc:"Batata frita coberta com cheddar e bacon.",img:""},
    {id:503,name:"Isca de Frango",emoji:"🍗",price:22.90,badge:"hot",bl:"Destaque",desc:"Tiras de frango empanado crocante. Serve 2.",img:""},
  ]},
  { id:"bebidas", name:"Bebidas", emoji:"🥤", color:"#1e3a5f", color2:"#0c1f3a", items:[
    {id:601,name:"Coca-Cola 600ml",emoji:"🥤",price:7.90,badge:null,bl:"",desc:"Garrafa 600ml gelada.",img:""},
    {id:602,name:"Suco Natural 500ml",emoji:"🍹",price:9.90,badge:null,bl:"",desc:"Caju, goiaba, maracuja ou laranja.",img:""},
    {id:603,name:"Agua Mineral 500ml",emoji:"💧",price:4.00,badge:null,bl:"",desc:"Com ou sem gas.",img:""},
    {id:604,name:"Suco de Caju 500ml",emoji:"🍊",price:8.50,badge:"top",bl:"Regional",desc:"Suco de caju nordestino puro.",img:""},
  ]},
  { id:"sobremesas", name:"Sobremesas", emoji:"🍨", color:"#4a1942", color2:"#2d0a2a", items:[
    {id:701,name:"Petit Gateau",emoji:"🍫",price:16.90,badge:"hot",bl:"Destaque",desc:"Bolinho de chocolate quente com sorvete de creme.",img:""},
    {id:702,name:"Pudim de Leite",emoji:"🍮",price:11.90,badge:"top",bl:"Tradicional",desc:"Pudim com calda de caramelo.",img:""},
    {id:703,name:"Acai 400ml",emoji:"🫐",price:18.90,badge:"new",bl:"Novo",desc:"Acai com banana, granola e leite condensado.",img:""},
  ]},
];

const fmt = v => "R$ " + Number(v).toFixed(2).replace(".",",");
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,5);

const T = {
  bg:"#0a0a0a", bg2:"#141414", bg3:"#1c1c1c",
  red:"#E8132A", red2:"#ff2d46",
  gold:"#F5A623", green:"#22c55e",
  border:"#2a2a2a", border2:"#333",
  text:"#f0f0f0", text2:"#aaa", text3:"#555",
};

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [[0,880],[180,660],[340,1100]].forEach(([t,f]) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = f; o.type = "sine";
      const st = ctx.currentTime + t/1000;
      g.gain.setValueAtTime(0,st); g.gain.linearRampToValueAtTime(0.35,st+0.02);
      g.gain.exponentialRampToValueAtTime(0.001,st+0.25);
      o.start(st); o.stop(st+0.25);
    });
  } catch(e) {}
}

const inp = {width:"100%",background:T.bg3,border:`1.5px solid ${T.border}`,borderRadius:10,padding:"10px 13px",color:T.text,fontSize:14,outline:"none",fontFamily:"inherit",boxSizing:"border-box"};
const btn = (bg,color="#fff",extra={}) => ({background:bg,color,border:"none",borderRadius:12,padding:"12px 18px",fontWeight:700,cursor:"pointer",fontSize:14,transition:".18s",...extra});
const overlayStyle = {position:"fixed",inset:0,background:"rgba(0,0,0,.9)",zIndex:300,display:"flex",alignItems:"flex-end",backdropFilter:"blur(6px)"};
const panelStyle = {background:T.bg2,width:"100%",maxWidth:430,margin:"0 auto",borderRadius:"22px 22px 0 0",maxHeight:"90vh",display:"flex",flexDirection:"column",animation:"slideUp .28s cubic-bezier(.34,1.56,.64,1)"};

export default function App() {
  const [mode, setMode] = useState("customer");
  const [adminAuth, setAdminAuth] = useState(false);
  const [cats, setCats] = useState(DEFAULT_CATS);
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const knownIds = useRef(new Set());
  const [newAlert, setNewAlert] = useState(false);

  useEffect(() => {
    (async () => {
      try { const r = await window.storage.get(SK_CATS,true); if(r) setCats(JSON.parse(r.value)); } catch(e){}
      try { const r = await window.storage.get(SK_SETTINGS,true); if(r) setSettings({...DEFAULT_SETTINGS,...JSON.parse(r.value)}); } catch(e){}
      try {
        const r = await window.storage.get(SK_ORDERS,true);
        if(r){ const o=JSON.parse(r.value); setOrders(o); o.forEach(x=>knownIds.current.add(x.id)); }
      } catch(e){}
      setLoading(false);
    })();
  },[]);

  useEffect(() => {
    if(mode!=="admin"||!adminAuth) return;
    const iv = setInterval(async()=>{
      try {
        const r = await window.storage.get(SK_ORDERS,true);
        if(!r) return;
        const o = JSON.parse(r.value);
        const hasNew = o.some(x=>!knownIds.current.has(x.id)&&x.status==="pending");
        if(hasNew){ beep(); setNewAlert(true); o.forEach(x=>knownIds.current.add(x.id)); }
        setOrders(o);
      } catch(e){}
    },3000);
    return ()=>clearInterval(iv);
  },[mode,adminAuth]);

  const saveCats     = async c => { setCats(c);     try{await window.storage.set(SK_CATS,JSON.stringify(c),true);}catch(e){} };
  const saveOrders   = async o => { setOrders(o);   try{await window.storage.set(SK_ORDERS,JSON.stringify(o),true);}catch(e){} };
  const saveSettings = async s => { setSettings(s); try{await window.storage.set(SK_SETTINGS,JSON.stringify(s),true);}catch(e){} };

  const addOrder = async order => {
    const next = [order,...orders];
    await saveOrders(next);
    knownIds.current.add(order.id);
  };

  if(loading) return (
    <div style={{background:T.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:10}}>
      <div style={{fontSize:52,animation:"spin 1s linear infinite"}}>🍕</div>
      <div style={{color:T.text3,fontSize:13,fontFamily:"sans-serif"}}>Carregando...</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if(mode==="admin"){
    if(!adminAuth) return <AdminLogin onAuth={()=>setAdminAuth(true)} onBack={()=>setMode("customer")} settings={settings}/>;
    return <AdminApp cats={cats} orders={orders} settings={settings} newAlert={newAlert}
      onClearAlert={()=>setNewAlert(false)} onSaveCats={saveCats} onSaveOrders={saveOrders}
      onSaveSettings={saveSettings} onBack={()=>{setMode("customer");setAdminAuth(false);}}/>;
  }
  return <CustomerApp cats={cats} orders={orders} settings={settings} onNewOrder={addOrder} onOpenAdmin={()=>setMode("admin")}/>;
}

/* ══════════ INTRO SCREEN ══════════ */
function IntroScreen({ settings, onDone }) {
  const vidRef = useRef(null);
  const [canSkip, setCanSkip] = useState(false);
  const hc = settings.heroBg || T.red;

  useEffect(() => {
    const t = setTimeout(() => setCanSkip(true), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (vidRef.current) {
      vidRef.current.play().catch(() => {});
      vidRef.current.onended = onDone;
    }
  }, []);

  return (
    <div style={{position:"fixed",inset:0,background:"#000",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;600;700&display=swap');
        @keyframes introPop{from{transform:scale(0) rotate(-15deg);opacity:0}to{transform:scale(1) rotate(0);opacity:1}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes popIn{from{transform:scale(.7);opacity:0}to{transform:scale(1);opacity:1}}
        @keyframes barPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.015)}}
        @keyframes alertPulse{0%,100%{opacity:1}50%{opacity:.6}}
        @keyframes newRing{0%,100%{box-shadow:0 0 0 0 rgba(232,19,42,0)}60%{box-shadow:0 0 0 8px rgba(232,19,42,.2)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        *{box-sizing:border-box}
      `}</style>

      {settings.videoUrl ? (
        <video ref={vidRef} src={settings.videoUrl} muted playsInline
          style={{width:"100%",height:"100%",objectFit:"cover",position:"absolute",inset:0}}/>
      ) : (
        <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 40%, ${hc}66 0%, #000 68%)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
          <div style={{fontSize:90,animation:"introPop .7s cubic-bezier(.34,1.56,.64,1) both",marginBottom:18,filter:`drop-shadow(0 0 30px ${hc}88)`}}>{settings.logoEmoji}</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:42,color:"#fff",letterSpacing:2,textAlign:"center",lineHeight:1,animation:"fadeUp .5s .25s both",textShadow:`0 0 40px ${hc}66`}}>
            {settings.companyName}
          </div>
          <div style={{fontSize:15,color:"rgba(255,255,255,.55)",marginTop:10,animation:"fadeUp .5s .45s both",textAlign:"center"}}>{settings.companySlogan}</div>
        </div>
      )}
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:160,background:"linear-gradient(transparent,rgba(0,0,0,.9))",pointerEvents:"none"}}/>
      {canSkip&&(
        <button onClick={onDone} style={{position:"absolute",bottom:40,left:"50%",transform:"translateX(-50%)",background:hc,color:"#fff",border:"none",padding:"15px 40px",borderRadius:50,fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:1,cursor:"pointer",boxShadow:`0 8px 28px ${hc}88`,animation:"fadeUp .35s both",whiteSpace:"nowrap"}}>
          VER CARDÁPIO →
        </button>
      )}
    </div>
  );
}

/* ══════════ ADMIN LOGIN ══════════ */
function AdminLogin({onAuth, onBack, settings}) {
  const [pwd,setPwd]=useState(""); const [err,setErr]=useState("");
  const login = async() => {
    let stored="1234";
    try{const r=await window.storage.get(SK_PWD,true); if(r)stored=r.value;}catch(e){}
    if(pwd===stored) onAuth(); else{setErr("Senha incorreta!");setPwd("");}
  };
  return (
    <div style={{background:T.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{background:T.bg2,borderRadius:24,padding:"36px 28px",width:"100%",maxWidth:360,border:`1px solid ${T.border}`}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:52,marginBottom:8}}>🔐</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:T.text,letterSpacing:1}}>ÁREA ADMIN</div>
          <div style={{fontSize:13,color:T.text3,marginTop:2}}>{settings.companyName}</div>
        </div>
        <input type="password" placeholder="••••••" value={pwd}
          onChange={e=>{setPwd(e.target.value);setErr("");}}
          onKeyDown={e=>e.key==="Enter"&&login()}
          style={{...inp,fontSize:22,textAlign:"center",letterSpacing:8,marginBottom:err?8:14}}/>
        {err&&<div style={{color:T.red,textAlign:"center",fontSize:13,marginBottom:10}}>{err}</div>}
        <button onClick={login} style={{...btn(T.red),width:"100%",padding:15,fontSize:19,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:1}}>ENTRAR</button>
        <button onClick={onBack} style={{...btn("transparent",T.text3),width:"100%",marginTop:10,fontSize:13}}>← Voltar ao cardápio</button>
        <div style={{textAlign:"center",fontSize:11,color:T.text3,marginTop:18,opacity:.6}}>Senha padrão: 1234</div>
      </div>
    </div>
  );
}

/* ══════════ ADMIN APP ══════════ */
function AdminApp({cats,orders,settings,newAlert,onClearAlert,onSaveCats,onSaveOrders,onSaveSettings,onBack}) {
  const [tab,setTab]=useState("orders");
  const [editProd,setEditProd]=useState(null);
  const [editCat,setEditCat]=useState(null);
  const [missingModal,setMissingModal]=useState(null);

  useEffect(()=>{ if(newAlert){setTab("orders");onClearAlert();} },[newAlert]);

  const confirmOrder=id=>onSaveOrders(orders.map(o=>o.id===id?{...o,status:"confirmed"}:o));
  const cancelOrder=id=>onSaveOrders(orders.map(o=>o.id===id?{...o,status:"cancelled"}:o));
  const sendMissing=(id,msg)=>{ onSaveOrders(orders.map(o=>o.id===id?{...o,status:"missing_item",missingMsg:msg}:o)); setMissingModal(null); };
  const saveProd=(catId,prod,isNew)=>{ onSaveCats(cats.map(c=>c.id!==catId?c:{...c,items:isNew?[...c.items,{...prod,id:Date.now()}]:c.items.map(p=>p.id===prod.id?prod:p)})); setEditProd(null); };
  const delProd=(catId,pId)=>onSaveCats(cats.map(c=>c.id!==catId?c:{...c,items:c.items.filter(p=>p.id!==pId)}));
  const saveCat=(cat,isNew)=>{ onSaveCats(isNew?[...cats,{...cat,id:uid(),items:[]}]:cats.map(c=>c.id===cat.id?{...c,...cat}:c)); setEditCat(null); };
  const delCat=id=>onSaveCats(cats.filter(c=>c.id!==id));

  const pendingCount=orders.filter(o=>o.status==="pending").length;
  const tabs=[{k:"orders",l:"Pedidos",i:"🛍️",badge:pendingCount},{k:"products",l:"Produtos",i:"🍽️"},{k:"categories",l:"Categorias",i:"📂"},{k:"settings",l:"Config",i:"⚙️"}];

  return (
    <div style={{background:T.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",fontFamily:"'DM Sans',sans-serif",color:T.text}}>
      <div style={{background:"#0d0d0d",borderBottom:`1px solid ${T.border}`,padding:"10px 14px",position:"sticky",top:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,letterSpacing:.5}}>⚙️ <span style={{color:T.red}}>ADMIN</span> PANEL</div>
          <div style={{fontSize:10,color:T.text3}}>{settings.companyName}</div>
        </div>
        <button onClick={onBack} style={{...btn("#1e1e1e",T.text2),padding:"6px 11px",fontSize:12,border:`1.5px solid ${T.border2}`}}>🏪 Cardápio</button>
      </div>

      <div style={{display:"flex",background:T.bg2,borderBottom:`1px solid ${T.border}`}}>
        {tabs.map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)} style={{flex:1,padding:"9px 4px",border:"none",background:"transparent",color:tab===t.k?T.red:T.text3,fontSize:9,fontWeight:700,borderBottom:`2px solid ${tab===t.k?T.red:"transparent"}`,cursor:"pointer",position:"relative",letterSpacing:.3,textTransform:"uppercase"}}>
            <div style={{fontSize:16,marginBottom:1}}>{t.i}</div>{t.l}
            {t.badge>0&&<span style={{position:"absolute",top:4,right:"50%",transform:"translateX(12px)",background:T.red,color:"#fff",borderRadius:8,fontSize:9,fontWeight:800,padding:"1px 5px",animation:"alertPulse 1s infinite"}}>{t.badge}</span>}
          </button>
        ))}
      </div>

      <div style={{padding:"10px 12px 80px"}}>
        {tab==="orders"&&<OrdersTab orders={orders} onConfirm={confirmOrder} onCancel={cancelOrder} onMissing={o=>setMissingModal(o)}/>}
        {tab==="products"&&<ProductsTab cats={cats} onEdit={(cid,p)=>setEditProd({catId:cid,product:p})} onDelete={delProd} onAdd={cid=>setEditProd({catId:cid,product:null})}/>}
        {tab==="categories"&&<CategoriesTab cats={cats} onEdit={c=>setEditCat(c)} onDelete={delCat} onAdd={()=>setEditCat({isNew:true,name:"",emoji:"🍽️",color:"#7c2d12",color2:"#431407"})}/>}
        {tab==="settings"&&<SettingsTab settings={settings} onSave={onSaveSettings}/>}
      </div>

      {editProd&&<EditProdModal catId={editProd.catId} product={editProd.product} onSave={saveProd} onClose={()=>setEditProd(null)}/>}
      {editCat&&<EditCatModal cat={editCat} onSave={saveCat} onClose={()=>setEditCat(null)}/>}
      {missingModal&&<MissingModal order={missingModal} cats={cats} onSend={msg=>sendMissing(missingModal.id,msg)} onClose={()=>setMissingModal(null)}/>}
    </div>
  );
}

/* ══════════ ORDERS TAB — COMPACTO COM ACCORDION ══════════ */
function OrdersTab({orders,onConfirm,onCancel,onMissing}) {
  const [filter,setFilter]=useState("pending");
  const [expanded,setExpanded]=useState(null);
  const sc={pending:T.gold,confirmed:T.green,cancelled:"#f87171",missing_item:"#fb923c"};
  const sl={pending:"🟡 Novo",confirmed:"✅ OK",cancelled:"❌ Cancelado",missing_item:"⚠️ Aguardando"};
  const filters=[{k:"pending",l:"Novos"},{k:"confirmed",l:"OK"},{k:"missing_item",l:"Aguardando"},{k:"cancelled",l:"Cancelados"},{k:"all",l:"Todos"}];
  const shown=filter==="all"?orders:orders.filter(o=>o.status===filter);
  const co=k=>k==="all"?orders.length:orders.filter(o=>o.status===k).length;

  return (
    <div>
      <div style={{display:"flex",gap:5,marginBottom:10,overflowX:"auto",paddingBottom:2}}>
        {filters.map(f=><button key={f.k} onClick={()=>setFilter(f.k)} style={{flexShrink:0,padding:"5px 10px",borderRadius:8,border:`1.5px solid ${filter===f.k?T.red:T.border}`,background:filter===f.k?"#1f0508":T.bg3,color:filter===f.k?T.red:T.text2,fontSize:11,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>{f.l}{co(f.k)>0?` (${co(f.k)})`:""}
        </button>)}
      </div>

      {shown.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:T.text3}}><div style={{fontSize:40,marginBottom:8}}>📭</div><div style={{fontSize:13}}>Nenhum pedido</div></div>}

      {shown.map(order=>{
        const isOpen=expanded===order.id;
        return(
          <div key={order.id} style={{background:T.bg3,borderRadius:12,marginBottom:7,border:`1.5px solid ${order.status==="pending"?T.gold+"55":T.border}`,overflow:"hidden",animation:order.status==="pending"?"newRing 2.5s infinite":"none"}}>
            <div onClick={()=>setExpanded(isOpen?null:order.id)} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 11px",cursor:"pointer"}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:sc[order.status],flexShrink:0}}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <span style={{fontWeight:800,fontSize:13,color:T.text}}>#{order.id.slice(-4).toUpperCase()}</span>
                  {order.customer?.name&&<span style={{fontSize:12,color:T.text2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{order.customer.name}</span>}
                </div>
                <div style={{fontSize:10,color:T.text3,marginTop:1}}>{new Date(order.timestamp).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})} · {order.items.length} iten{order.items.length!==1?"s":""} · {order.deliveryType==="entrega"?"🛵":"🏪"}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:15,color:T.red}}>{fmt(order.total)}</div>
                <div style={{fontSize:9,color:sc[order.status],fontWeight:700}}>{sl[order.status]}</div>
              </div>
              <div style={{color:T.text3,fontSize:11,marginLeft:2}}>{isOpen?"▲":"▼"}</div>
            </div>

            {isOpen&&(
              <div style={{borderTop:`1px solid ${T.border}`,padding:"9px 11px"}}>
                <div style={{background:T.bg2,borderRadius:8,padding:"8px 10px",marginBottom:8}}>
                  {order.items.map((item,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:12,color:T.text2,marginBottom:2}}>
                      <span>{item.qty}x {item.emoji} {item.name}</span>
                      <span style={{color:T.red,fontWeight:700,flexShrink:0,marginLeft:8}}>{fmt(item.totalPrice*item.qty)}</span>
                    </div>
                  ))}
                  <div style={{borderTop:`1px dashed ${T.border}`,marginTop:5,paddingTop:5,display:"flex",justifyContent:"space-between",fontWeight:800,color:T.text,fontSize:13}}>
                    <span>TOTAL</span><span style={{color:T.red}}>{fmt(order.total)}</span>
                  </div>
                </div>
                <div style={{fontSize:11,color:T.text3,lineHeight:1.7}}>
                  {order.deliveryType==="entrega"?"🛵 Entrega":"🏪 Retirada"}
                  {order.address?` — ${order.address}`:""}
                  {order.payment&&<span> · <b style={{color:T.text2}}>{order.payment}</b></span>}
                </div>
                {order.obs&&<div style={{fontSize:11,color:T.gold,marginTop:3}}>📝 {order.obs}</div>}
                {order.missingMsg&&<div style={{fontSize:11,color:"#fb923c",background:"#1c0e00",borderRadius:6,padding:"6px 8px",marginTop:5,border:"1px solid #7c2d0e"}}>⚠️ {order.missingMsg}</div>}
                {order.status==="pending"&&(
                  <div style={{display:"flex",gap:6,marginTop:8}}>
                    <button onClick={()=>onConfirm(order.id)} style={{...btn(T.green),flex:1,padding:"8px 0",fontSize:12}}>✅ Confirmar</button>
                    <button onClick={()=>onMissing(order)} style={{...btn("#c2410c"),flex:1,padding:"8px 0",fontSize:12}}>⚠️ Falta Item</button>
                    <button onClick={()=>{if(window.confirm("Cancelar pedido?"))onCancel(order.id);}} style={{...btn("#7f1d1d"),padding:"8px 10px",fontSize:12}}>✕</button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ══════════ PRODUCTS TAB ══════════ */
function ProductsTab({cats,onEdit,onDelete,onAdd}) {
  const [open,setOpen]=useState(null);
  return (
    <div>
      {cats.map(cat=>(
        <div key={cat.id} style={{marginBottom:7}}>
          <button onClick={()=>setOpen(open===cat.id?null:cat.id)} style={{width:"100%",background:`linear-gradient(135deg,${cat.color},${cat.color2})`,border:"none",borderRadius:open===cat.id?"11px 11px 0 0":11,padding:"10px 13px",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
            <span style={{color:"#fff",fontFamily:"'Bebas Neue',sans-serif",fontSize:16,letterSpacing:.5}}>{cat.emoji} {cat.name} <span style={{fontSize:11,opacity:.7}}>({cat.items.length})</span></span>
            <span style={{color:"rgba(255,255,255,.8)",fontSize:13}}>{open===cat.id?"▲":"▼"}</span>
          </button>
          {open===cat.id&&(
            <div style={{background:T.bg2,borderRadius:"0 0 11px 11px",border:`1px solid ${T.border}`,overflow:"hidden"}}>
              <button onClick={()=>onAdd(cat.id)} style={{width:"100%",padding:"8px 12px",background:"transparent",border:"none",borderBottom:`1px solid ${T.border}`,color:T.green,fontWeight:700,fontSize:12,cursor:"pointer",textAlign:"left"}}>＋ Adicionar produto</button>
              {cat.items.length===0&&<div style={{padding:14,textAlign:"center",color:T.text3,fontSize:12}}>Sem produtos</div>}
              {cat.items.map(p=>(
                <div key={p.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 11px",borderBottom:`1px solid ${T.border}`}}>
                  <div style={{width:40,height:40,borderRadius:8,background:"#222",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>
                    {p.img?<img src={p.img} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span style={{fontSize:22}}>{p.emoji}</span>}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:12,color:T.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</div>
                    <div style={{fontSize:11,color:T.red,fontWeight:700}}>{fmt(p.price)}</div>
                  </div>
                  <button onClick={()=>onEdit(cat.id,p)} style={{...btn(T.bg3,T.text2),padding:"5px 8px",fontSize:13,border:`1px solid ${T.border2}`}}>✏️</button>
                  <button onClick={()=>{if(window.confirm(`Deletar "${p.name}"?`))onDelete(cat.id,p.id);}} style={{...btn("#7f1d1d"),padding:"5px 8px",fontSize:13}}>🗑️</button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ══════════ CATEGORIES TAB ══════════ */
function CategoriesTab({cats,onEdit,onDelete,onAdd}) {
  return (
    <div>
      <button onClick={onAdd} style={{...btn(T.green),width:"100%",marginBottom:10,padding:10,fontSize:13}}>＋ Nova Categoria</button>
      {cats.map(c=>(
        <div key={c.id} style={{background:T.bg3,borderRadius:11,padding:"9px 11px",marginBottom:7,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:38,height:38,borderRadius:9,background:`linear-gradient(135deg,${c.color},${c.color2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0}}>{c.emoji}</div>
          <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:T.text}}>{c.name}</div><div style={{fontSize:11,color:T.text3}}>{c.items.length} produto{c.items.length!==1?"s":""}</div></div>
          <button onClick={()=>onEdit(c)} style={{...btn(T.bg2,T.text2),padding:"5px 8px",fontSize:13,border:`1px solid ${T.border2}`}}>✏️</button>
          <button onClick={()=>{if(window.confirm(`Deletar "${c.name}"?`))onDelete(c.id);}} style={{...btn("#7f1d1d"),padding:"5px 8px",fontSize:13}}>🗑️</button>
        </div>
      ))}
    </div>
  );
}

/* ══════════ SETTINGS TAB ══════════ */
function SettingsTab({settings,onSave}) {
  const [s,setS]=useState({...settings});
  const [pwdOpen,setPwdOpen]=useState(false);
  const [cur,setCur]=useState(""); const [nw,setNw]=useState(""); const [cf,setCf]=useState(""); const [msg,setMsg]=useState("");
  const set=(k,v)=>setS(p=>({...p,[k]:v}));

  const handleVideo=e=>{
    const file=e.target.files[0]; if(!file) return;
    const rd=new FileReader(); rd.onload=ev=>set("videoUrl",ev.target.result); rd.readAsDataURL(file);
  };

  const savePwd=async()=>{
    let stored="1234"; try{const r=await window.storage.get(SK_PWD,true);if(r)stored=r.value;}catch(e){}
    if(cur!==stored){setMsg("❌ Senha atual incorreta");return;}
    if(nw!==cf){setMsg("❌ Senhas não conferem");return;}
    if(nw.length<4){setMsg("❌ Mínimo 4 caracteres");return;}
    try{await window.storage.set(SK_PWD,nw,true);setMsg("✅ Senha alterada!");setCur("");setNw("");setCf("");}catch(e){setMsg("❌ Erro");}
  };

  const lbl=(t)=><div style={{fontSize:10,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>{t}</div>;

  return (
    <div>
      {/* Empresa */}
      <div style={{background:T.bg3,borderRadius:13,padding:13,marginBottom:9,border:`1px solid ${T.border}`}}>
        <div style={{fontWeight:800,fontSize:13,marginBottom:11,color:T.text}}>🏪 Dados da Empresa</div>
        {[[lbl("Nome da Empresa"),"companyName"],[lbl("Slogan"),"companySlogan"],[lbl("Emoji / Logo"),"logoEmoji"]].map(([l,k])=>(
          <div key={k} style={{marginBottom:9}}>{l}<input value={s[k]} onChange={e=>set(k,e.target.value)} style={inp}/></div>
        ))}
        <div style={{marginBottom:9}}>
          {lbl("Cor de Destaque")}
          <div style={{display:"flex",gap:7,alignItems:"center"}}>
            <input type="color" value={s.heroBg} onChange={e=>set("heroBg",e.target.value)} style={{width:38,height:32,border:"none",background:"none",cursor:"pointer",padding:0,borderRadius:6}}/>
            <input value={s.heroBg} onChange={e=>set("heroBg",e.target.value)} style={{...inp,flex:1,fontSize:12}}/>
          </div>
        </div>
        <div style={{marginBottom:11}}>
          {lbl("Frete de Entrega (R$)")}
          <input type="number" step="0.5" value={s.frete} onChange={e=>set("frete",parseFloat(e.target.value)||0)} style={inp}/>
        </div>
        <button onClick={()=>onSave(s)} style={{...btn(T.red),width:"100%",padding:10,fontSize:13}}>💾 Salvar</button>
      </div>

      {/* Vídeo */}
      <div style={{background:T.bg3,borderRadius:13,padding:13,marginBottom:9,border:`1px solid ${T.border}`}}>
        <div style={{fontWeight:800,fontSize:13,marginBottom:10,color:T.text}}>🎬 Tela de Abertura</div>
        <label style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer",marginBottom:10}}>
          <input type="checkbox" checked={s.showIntro} onChange={e=>set("showIntro",e.target.checked)} style={{accentColor:T.red,width:15,height:15}}/>
          <span style={{fontSize:12,color:T.text2}}>Mostrar tela de abertura</span>
        </label>
        {s.videoUrl&&<video src={s.videoUrl} style={{width:"100%",borderRadius:9,maxHeight:130,objectFit:"cover",marginBottom:8}} muted controls/>}
        <div style={{display:"flex",gap:7}}>
          <label style={{...btn(T.bg2,T.text2),display:"flex",alignItems:"center",gap:5,justifyContent:"center",flex:1,cursor:"pointer",border:`1px solid ${T.border2}`,fontSize:12,padding:"9px 0",borderRadius:9}}>
            📁 Carregar Vídeo
            <input type="file" accept="video/*" onChange={handleVideo} style={{display:"none"}}/>
          </label>
          {s.videoUrl&&<button onClick={()=>set("videoUrl","")} style={{...btn("#7f1d1d"),padding:"9px 11px",fontSize:12}}>✕</button>}
        </div>
        <div style={{fontSize:10,color:T.text3,marginTop:5}}>MP4 vertical, até 30s. Sem vídeo: animação com emoji e nome.</div>
        <button onClick={()=>onSave(s)} style={{...btn(T.red),width:"100%",padding:10,fontSize:13,marginTop:10}}>💾 Salvar</button>
      </div>

      {/* Senha */}
      <div style={{background:T.bg3,borderRadius:13,padding:13,border:`1px solid ${T.border}`}}>
        <div onClick={()=>setPwdOpen(p=>!p)} style={{fontWeight:800,fontSize:13,color:T.text,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          🔐 Alterar Senha Admin <span style={{fontSize:11,color:T.text3}}>{pwdOpen?"▲":"▼"}</span>
        </div>
        {pwdOpen&&<div style={{marginTop:11}}>
          {[["Senha atual",cur,setCur],["Nova senha",nw,setNw],["Confirmar",cf,setCf]].map(([l,v,sv])=>(
            <div key={l} style={{marginBottom:9}}>{lbl(l)}<input type="password" value={v} onChange={e=>sv(e.target.value)} style={inp} placeholder="••••"/></div>
          ))}
          {msg&&<div style={{fontSize:12,marginBottom:7,color:msg.startsWith("✅")?T.green:T.red}}>{msg}</div>}
          <button onClick={savePwd} style={{...btn(T.red),width:"100%",padding:10,fontSize:13}}>Salvar Senha</button>
        </div>}
      </div>
    </div>
  );
}

/* ══════════ EDIT PRODUCT MODAL ══════════ */
function EditProdModal({catId,product,onSave,onClose}) {
  const isNew=!product;
  const [f,setF]=useState(product||{name:"",emoji:"🍽️",price:"",badge:null,bl:"",desc:"",img:""});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const handleImg=e=>{const file=e.target.files[0];if(!file)return;const rd=new FileReader();rd.onload=ev=>set("img",ev.target.result);rd.readAsDataURL(file);};
  const save=()=>{if(!f.name.trim()){alert("Nome obrigatório");return;}if(!f.price||isNaN(parseFloat(f.price))){alert("Preço inválido");return;}onSave(catId,{...f,price:parseFloat(f.price)},isNew);};

  return (
    <div style={overlayStyle} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={panelStyle}>
        <div style={{padding:"13px 15px 10px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${T.border}`}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:19,color:T.text}}>{isNew?"NOVO PRODUTO":"EDITAR PRODUTO"}</div>
          <button onClick={onClose} style={{...btn("#222",T.text2),width:29,height:29,padding:0,borderRadius:8,fontSize:14}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"13px 15px"}}>
          <div style={{textAlign:"center",marginBottom:13}}>
            <div style={{width:84,height:84,borderRadius:15,background:"#222",margin:"0 auto 8px",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",border:`2px dashed ${T.border2}`}}>
              {f.img?<img src={f.img} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span style={{fontSize:40}}>{f.emoji||"🍽️"}</span>}
            </div>
            <div style={{display:"flex",gap:7,justifyContent:"center"}}>
              <label style={{...btn(T.bg3,T.text2),display:"inline-flex",alignItems:"center",gap:4,cursor:"pointer",fontSize:12,padding:"6px 11px",border:`1px solid ${T.border2}`,borderRadius:8}}>
                📷 Foto Real <input type="file" accept="image/*" onChange={handleImg} style={{display:"none"}}/>
              </label>
              {f.img&&<button onClick={()=>set("img","")} style={{...btn("transparent",T.text3),fontSize:12,padding:"6px 7px"}}>✕</button>}
            </div>
          </div>
          {[["Nome","name","Coxinha de Frango"],["Emoji","emoji","🍗"],["Descrição","desc","Descreva..."]].map(([l,k,ph])=>(
            <div key={k} style={{marginBottom:9}}>
              <div style={{fontSize:10,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>{l}</div>
              <input value={f[k]} onChange={e=>set(k,e.target.value)} placeholder={ph} style={inp}/>
            </div>
          ))}
          <div style={{marginBottom:9}}>
            <div style={{fontSize:10,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>Preço (R$)</div>
            <input type="number" step="0.01" value={f.price} onChange={e=>set("price",e.target.value)} placeholder="0,00" style={inp}/>
          </div>
          <div>
            <div style={{fontSize:10,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>Badge</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {[null,"hot","new","top"].map(b=>(
                <button key={String(b)} onClick={()=>set("badge",b)} style={{padding:"5px 10px",borderRadius:7,border:`1.5px solid ${f.badge===b?T.red:T.border}`,background:f.badge===b?"#1f0508":T.bg3,color:f.badge===b?T.red:T.text2,fontSize:11,fontWeight:700,cursor:"pointer"}}>
                  {b===null?"Nenhum":b.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          {f.badge&&<div style={{marginTop:9}}>
            <div style={{fontSize:10,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>Texto do Badge</div>
            <input value={f.bl} onChange={e=>set("bl",e.target.value)} placeholder="Ex: + Pedido" style={inp}/>
          </div>}
        </div>
        <div style={{padding:"11px 15px 20px",borderTop:`1px solid ${T.border}`}}>
          <button onClick={save} style={{...btn(T.red),width:"100%",padding:12,fontSize:17,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:1}}>{isNew?"ADICIONAR":"SALVAR"}</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════ EDIT CATEGORY MODAL ══════════ */
function EditCatModal({cat,onSave,onClose}) {
  const isNew=cat.isNew;
  const [f,setF]=useState({name:cat.name||"",emoji:cat.emoji||"🍽️",color:cat.color||"#7c2d12",color2:cat.color2||"#431407"});
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const save=()=>{if(!f.name.trim()){alert("Nome obrigatório");return;}onSave(isNew?f:{...cat,...f},isNew);};
  return (
    <div style={overlayStyle} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={panelStyle}>
        <div style={{padding:"13px 15px 10px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${T.border}`}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:19,color:T.text}}>{isNew?"NOVA CATEGORIA":"EDITAR CATEGORIA"}</div>
          <button onClick={onClose} style={{...btn("#222",T.text2),width:29,height:29,padding:0,borderRadius:8,fontSize:14}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"13px 15px"}}>
          <div style={{background:`linear-gradient(135deg,${f.color},${f.color2})`,borderRadius:13,padding:16,textAlign:"center",marginBottom:13}}>
            <div style={{fontSize:46,marginBottom:4}}>{f.emoji}</div>
            <div style={{color:"#fff",fontFamily:"'Bebas Neue',sans-serif",fontSize:19}}>{f.name||"Nova Categoria"}</div>
          </div>
          {[["Nome","name","Pizzas"],["Emoji","emoji","🍕"]].map(([l,k,ph])=>(
            <div key={k} style={{marginBottom:9}}>
              <div style={{fontSize:10,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>{l}</div>
              <input value={f[k]} onChange={e=>set(k,e.target.value)} placeholder={ph} style={inp}/>
            </div>
          ))}
          <div style={{display:"flex",gap:9}}>
            {[["Cor Principal","color"],["Cor Escura","color2"]].map(([l,k])=>(
              <div key={k} style={{flex:1}}>
                <div style={{fontSize:10,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>{l}</div>
                <div style={{display:"flex",gap:5,alignItems:"center"}}>
                  <input type="color" value={f[k]} onChange={e=>set(k,e.target.value)} style={{width:34,height:32,borderRadius:6,border:"none",cursor:"pointer",padding:0,background:"none"}}/>
                  <input value={f[k]} onChange={e=>set(k,e.target.value)} style={{...inp,flex:1,fontSize:11}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{padding:"11px 15px 20px",borderTop:`1px solid ${T.border}`}}>
          <button onClick={save} style={{...btn(T.red),width:"100%",padding:12,fontSize:17,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:1}}>{isNew?"CRIAR":"SALVAR"}</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════ MISSING ITEM MODAL ══════════ */
function MissingModal({order,cats,onSend,onClose}) {
  const [msg,setMsg]=useState("");
  const all=cats.flatMap(c=>c.items).filter(p=>!order.items.some(i=>i.id===p.id)).slice(0,9);
  return (
    <div style={overlayStyle} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={panelStyle}>
        <div style={{padding:"13px 15px 10px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${T.border}`}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:19,color:"#fb923c"}}>⚠️ ITEM FALTANDO</div>
          <button onClick={onClose} style={{...btn("#222",T.text2),width:29,height:29,padding:0,borderRadius:8,fontSize:14}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"13px 15px"}}>
          <div style={{background:"#1c0e00",borderRadius:9,padding:10,marginBottom:11,border:"1px solid #7c2d0e"}}>
            <div style={{fontSize:12,color:"#fb923c",fontWeight:700,marginBottom:4}}>#{order.id.slice(-4).toUpperCase()}{order.customer?.name?` — ${order.customer.name}`:""}</div>
            {order.items.map((it,i)=><div key={i} style={{fontSize:11,color:T.text2}}>• {it.qty}x {it.emoji} {it.name}</div>)}
          </div>
          <div style={{fontSize:12,fontWeight:700,color:T.text2,marginBottom:7}}>Sugestões (toque para adicionar):</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:11}}>
            {all.map(p=><button key={p.id} onClick={()=>setMsg(m=>m+(m?", ":"")+`${p.emoji} ${p.name} (${fmt(p.price)})`)} style={{background:T.bg3,border:`1px solid ${T.border2}`,borderRadius:7,padding:"5px 8px",fontSize:11,color:T.text2,cursor:"pointer"}}>{p.emoji} {p.name}</button>)}
          </div>
          <div style={{fontSize:10,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>Mensagem para o cliente:</div>
          <textarea value={msg} onChange={e=>setMsg(e.target.value)} rows={3} placeholder="Ex: O Double Smash acabou. Que tal o Junior Clássico (R$26,90)?" style={{...inp,resize:"none",lineHeight:1.6,fontSize:12}}/>
        </div>
        <div style={{padding:"11px 15px 20px",borderTop:`1px solid ${T.border}`,display:"flex",gap:7}}>
          <button onClick={onClose} style={{...btn(T.bg3,T.text2),flex:1,padding:10,border:`1px solid ${T.border2}`,fontSize:12}}>Cancelar</button>
          <button onClick={()=>msg.trim()&&onSend(msg)} style={{...btn("#c2410c"),flex:2,padding:10,fontSize:13,opacity:msg.trim()?1:.4}}>📲 Avisar Cliente</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════ CUSTOMER APP ══════════ */
function CustomerApp({cats,orders,settings,onNewOrder,onOpenAdmin}) {
  const [showIntro,setShowIntro]=useState(settings.showIntro);
  const [screen,setScreen]=useState("home");
  const [activeCat,setActiveCat]=useState(null);
  const [cart,setCart]=useState([]);
  const [checkoutOpen,setCheckoutOpen]=useState(false);
  const [successOpen,setSuccessOpen]=useState(false);
  const [myOrderId,setMyOrderId]=useState(null);
  const [notice,setNotice]=useState(null);
  const pollRef=useRef(null);

  useEffect(()=>{
    if(!myOrderId) return;
    pollRef.current=setInterval(async()=>{
      try{const r=await window.storage.get(SK_ORDERS,true);if(!r)return;const allO=JSON.parse(r.value);const mine=allO.find(o=>o.id===myOrderId);if(mine?.status==="missing_item"&&!notice){setNotice(mine);}}catch(e){}
    },4000);
    return()=>clearInterval(pollRef.current);
  },[myOrderId,notice]);

  const frete=settings.frete||5;
  const hc=settings.heroBg||T.red;
  const totalItems=cart.reduce((s,c)=>s+c.qty,0);
  const subtotal=cart.reduce((s,c)=>s+c.totalPrice*c.qty,0);

  const addToCart=p=>setCart(prev=>{const ex=prev.find(c=>c.id===p.id);if(ex)return prev.map(c=>c.id===p.id?{...c,qty:c.qty+1}:c);return [...prev,{id:p.id,name:p.name,emoji:p.emoji,price:p.price,totalPrice:p.price,qty:1,img:p.img||""}];});
  const updateQty=(id,d)=>setCart(prev=>prev.map(c=>c.id===id?{...c,qty:c.qty+d}:c).filter(c=>c.qty>0));
  const submitOrder=async data=>{const order={id:uid(),timestamp:Date.now(),status:"pending",items:cart.map(c=>({...c})),total:subtotal+(data.deliveryType==="entrega"?frete:0),...data};await onNewOrder(order);setMyOrderId(order.id);setCart([]);setCheckoutOpen(false);setSuccessOpen(true);};
  const catCC=cat=>cart.filter(c=>cat.items.some(i=>i.id===c.id)).reduce((s,c)=>s+c.qty,0);

  if(showIntro) return <IntroScreen settings={settings} onDone={()=>setShowIntro(false)}/>;

  return (
    <div style={{background:T.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",fontFamily:"'DM Sans',sans-serif",color:T.text,overflowX:"hidden"}}>

      {/* ── HERO HEADER (só na home) ── */}
      {screen==="home"&&(
        <div style={{background:`linear-gradient(155deg,${hc}ee 0%,${hc}77 55%,#000 100%)`,padding:"24px 16px 18px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-20,right:-20,fontSize:110,opacity:.07,userSelect:"none",pointerEvents:"none"}}>{settings.logoEmoji}</div>
          <div style={{position:"absolute",bottom:-15,left:-10,fontSize:75,opacity:.05,userSelect:"none",pointerEvents:"none"}}>{settings.logoEmoji}</div>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",position:"relative",zIndex:1}}>
            <div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:"#fff",letterSpacing:1,lineHeight:1,textShadow:"0 2px 12px rgba(0,0,0,.4)"}}>{settings.companyName}</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.65)",marginTop:4}}>{settings.companySlogan}</div>
              <div style={{display:"flex",alignItems:"center",gap:5,marginTop:7}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:T.green}}></div>
                <span style={{fontSize:11,color:"rgba(255,255,255,.6)"}}>Aberto agora</span>
              </div>
            </div>
            <button onClick={onOpenAdmin} style={{background:"rgba(0,0,0,.35)",border:"1.5px solid rgba(255,255,255,.15)",color:"rgba(255,255,255,.65)",padding:"7px 10px",borderRadius:9,fontSize:17,cursor:"pointer",flexShrink:0}}>⚙️</button>
          </div>
        </div>
      )}

      {/* Sticky header nas sub-páginas */}
      {screen!=="home"&&(
        <div style={{background:"#0d0d0d",padding:"10px 13px",position:"sticky",top:0,zIndex:200,borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:19,letterSpacing:.5}}><span style={{color:hc}}>{settings.companyName.split(" ")[0]}'s</span> MENU</div>
          <button onClick={onOpenAdmin} style={{...btn("#1e1e1e",T.text3),padding:"5px 9px",fontSize:15,border:`1.5px solid ${T.border2}`,borderRadius:8}}>⚙️</button>
        </div>
      )}

      {/* HOME GRID */}
      {screen==="home"&&(
        <>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:14,letterSpacing:.5,padding:"11px 14px 3px",color:T.text3}}>Escolha uma categoria</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,padding:"7px 11px 130px"}}>
            {cats.map((cat,i)=>{const cc=catCC(cat);return(
              <div key={cat.id} onClick={()=>{setActiveCat(cat);setScreen("category");}}
                style={{background:`linear-gradient(135deg,${cat.color}99,${cat.color2}dd)`,borderRadius:15,padding:"18px 9px 13px",cursor:"pointer",border:"1.5px solid rgba(255,255,255,.06)",display:"flex",flexDirection:"column",alignItems:"center",minHeight:115,justifyContent:"center",position:"relative",animation:`fadeUp .35s ${i*0.04}s both`}}>
                {cc>0&&<span style={{position:"absolute",top:7,right:7,background:T.gold,color:"#000",fontSize:10,fontWeight:800,borderRadius:7,padding:"2px 6px"}}>{cc}</span>}
                <div style={{fontSize:42,marginBottom:6}}>{cat.emoji}</div>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:13,color:"#fff",textAlign:"center",lineHeight:1.1}}>{cat.name}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,.4)",marginTop:2}}>{cat.items.length} itens</div>
              </div>
            );})}
          </div>
        </>
      )}

      {/* CATEGORY */}
      {screen==="category"&&activeCat&&(
        <>
          <div style={{background:`linear-gradient(135deg,${activeCat.color},${activeCat.color2})`,padding:"18px 14px 14px",textAlign:"center",position:"relative",borderRadius:"0 0 16px 16px",marginBottom:9}}>
            <button onClick={()=>setScreen("home")} style={{position:"absolute",left:11,top:12,background:"rgba(0,0,0,.4)",border:"1.5px solid rgba(255,255,255,.12)",color:"#fff",padding:"6px 11px",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer"}}>← Voltar</button>
            <div style={{fontSize:48,marginBottom:5}}>{activeCat.emoji}</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:"#fff",letterSpacing:.5}}>{activeCat.name}</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8,padding:"0 11px 130px"}}>
            {activeCat.items.map(p=>{const inCart=cart.find(c=>c.id===p.id);return(
              <div key={p.id} style={{background:T.bg3,borderRadius:12,display:"flex",gap:9,padding:9,border:`1.5px solid ${T.border}`}}>
                <div style={{width:72,height:72,borderRadius:9,background:"#222",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>
                  {p.img?<img src={p.img} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span style={{fontSize:34}}>{p.emoji}</span>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  {p.badge&&<span style={{display:"inline-block",fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:.4,padding:"2px 5px",borderRadius:4,marginBottom:3,background:p.badge==="hot"?"#3a0a0f":p.badge==="new"?"#0a2e14":"#2e1e00",color:p.badge==="hot"?T.red:p.badge==="new"?"#4ade80":T.gold}}>{p.bl||p.badge}</span>}
                  <div style={{fontWeight:700,fontSize:13,color:T.text,marginBottom:2,lineHeight:1.2}}>{p.name}</div>
                  <div style={{fontSize:10,color:T.text3,marginBottom:6,lineHeight:1.4}}>{p.desc}</div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,color:hc}}>{fmt(p.price)}</span>
                    {inCart?(
                      <div style={{display:"flex",alignItems:"center",gap:5}}>
                        <button onClick={()=>updateQty(p.id,-1)} style={{background:"#222",border:`1.5px solid ${T.border2}`,color:T.text,width:26,height:26,borderRadius:7,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>−</button>
                        <span style={{fontWeight:800,fontSize:13,minWidth:17,textAlign:"center"}}>{inCart.qty}</span>
                        <button onClick={()=>updateQty(p.id,1)} style={{background:"#15803d",border:"1.5px solid #15803d",color:"#fff",width:26,height:26,borderRadius:7,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>+</button>
                      </div>
                    ):(
                      <button onClick={()=>addToCart(p)} style={{background:hc,border:"none",color:"#fff",width:32,height:32,borderRadius:9,fontSize:21,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:300}}>+</button>
                    )}
                  </div>
                </div>
              </div>
            );})}
          </div>
        </>
      )}

      {/* CHECKOUT BAR */}
      {totalItems>0&&(
        <div style={{position:"fixed",bottom:0,left:0,right:0,maxWidth:430,margin:"0 auto",padding:"9px 11px 16px",zIndex:250}}>
          <button onClick={()=>setCheckoutOpen(true)} style={{width:"100%",border:"1.5px solid rgba(255,255,255,.1)",cursor:"pointer",background:hc,borderRadius:15,height:60,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",boxShadow:`0 8px 26px ${hc}66`,animation:"barPulse 2s ease infinite"}}>
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              <span style={{fontSize:24}}>🛒</span>
              <div>
                <div style={{fontSize:10,color:"rgba(255,255,255,.75)",fontWeight:600,lineHeight:1}}>{totalItems} iten{totalItems!==1?"s":""}</div>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,color:"#fff",letterSpacing:.5,lineHeight:1.1}}>VER CARRINHO</div>
              </div>
            </div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:"#fff",letterSpacing:.5}}>{fmt(subtotal)}</div>
          </button>
        </div>
      )}

      {checkoutOpen&&<CheckoutModal cart={cart} frete={frete} hc={hc} onUpdateQty={updateQty} onSubmit={submitOrder} onClose={()=>setCheckoutOpen(false)}/>}

      {successOpen&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.92)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:T.bg2,borderRadius:18,padding:"28px 20px",textAlign:"center",maxWidth:290,width:"100%",border:`1px solid ${T.border}`,animation:"popIn .4s cubic-bezier(.34,1.56,.64,1)"}}>
            <div style={{fontSize:52,marginBottom:7}}>🎉</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,marginBottom:5}}>Pedido Enviado!</div>
            <div style={{fontSize:12,color:T.text3,marginBottom:16,lineHeight:1.6}}>Aguarde a confirmação!<br/>Avisamos se precisar trocar algum item.</div>
            <button onClick={()=>{setSuccessOpen(false);setScreen("home");}} style={{...btn(hc),width:"100%",padding:12,fontSize:16,fontFamily:"'Bebas Neue',sans-serif"}}>ÓTIMO!</button>
          </div>
        </div>
      )}

      {notice&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.95)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
          <div style={{background:T.bg2,borderRadius:18,padding:"24px 20px",maxWidth:290,width:"100%",border:`2px solid #fb923c`,animation:"popIn .4s ease"}}>
            <div style={{fontSize:40,textAlign:"center",marginBottom:7}}>⚠️</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,marginBottom:6,textAlign:"center",color:"#fb923c"}}>AVISO DO ESTABELECIMENTO</div>
            <div style={{background:"#1c0e00",borderRadius:9,padding:11,marginBottom:13,fontSize:13,color:"#fbd38d",lineHeight:1.7}}>{notice.missingMsg}</div>
            <button onClick={()=>{setNotice(null);setScreen("home");clearInterval(pollRef.current);}} style={{...btn(hc),width:"100%",padding:10,fontSize:13}}>Entendido!</button>
            <button onClick={()=>{setNotice(null);setCheckoutOpen(true);}} style={{...btn(T.bg3,T.text2),width:"100%",marginTop:7,padding:9,fontSize:12,border:`1px solid ${T.border2}`}}>Escolher outro item</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════ CHECKOUT MODAL ══════════ */
function CheckoutModal({cart,frete,hc,onUpdateQty,onSubmit,onClose}) {
  const [step,setStep]=useState("cart");
  const [del,setDel]=useState("entrega"); const [pay,setPay]=useState("cartao");
  const [name,setName]=useState(""); const [addr,setAddr]=useState(""); const [bairro,setBairro]=useState("");
  const [obs,setObs]=useState(""); const [troco,setTroco]=useState("");

  const sub=cart.reduce((s,c)=>s+c.totalPrice*c.qty,0);
  const fr=del==="entrega"?frete:0;
  const total=sub+fr;
  const payLabels={cartao:"💳 Cartão na entrega",pix:`📱 Pix — ${PIX_KEY}`,dinheiro:"💵 Dinheiro",maquina:"🤖 Maquininha"};
  const submit=()=>{if(del==="entrega"&&!addr.trim()){alert("Informe o endereço!");return;}onSubmit({customer:{name},deliveryType:del,address:addr+(bairro?`, ${bairro}`:""),payment:payLabels[pay],troco:pay==="dinheiro"?troco:null,obs});};

  return (
    <div style={overlayStyle} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={panelStyle}>
        <div style={{padding:"13px 15px 10px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${T.border}`}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:19,color:T.text}}>{step==="cart"?"🛒 CARRINHO":"📋 FINALIZAR"}</div>
          <button onClick={onClose} style={{...btn("#222",T.text2),width:29,height:29,padding:0,borderRadius:8,fontSize:14}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"13px 15px"}}>
          {step==="cart"?(
            <>
              {cart.map(it=>(
                <div key={it.id} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 0",borderBottom:`1px solid ${T.border}`}}>
                  <div style={{width:40,height:40,borderRadius:8,background:"#222",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>
                    {it.img?<img src={it.img} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span style={{fontSize:22}}>{it.emoji}</span>}
                  </div>
                  <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,color:T.text}}>{it.name}</div><div style={{fontSize:12,color:hc,fontWeight:700}}>{fmt(it.totalPrice*it.qty)}</div></div>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <button onClick={()=>onUpdateQty(it.id,-1)} style={{background:"#222",border:`1.5px solid ${T.border2}`,color:T.text,width:26,height:26,borderRadius:7,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>−</button>
                    <span style={{fontWeight:800,fontSize:13,minWidth:17,textAlign:"center"}}>{it.qty}</span>
                    <button onClick={()=>onUpdateQty(it.id,1)} style={{background:"#15803d",border:"1.5px solid #15803d",color:"#fff",width:26,height:26,borderRadius:7,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>+</button>
                  </div>
                </div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",padding:"11px 0 0",fontWeight:800,fontSize:15,color:T.text}}>
                <span>Subtotal</span><span style={{color:hc}}>{fmt(sub)}</span>
              </div>
            </>
          ):(
            <>
              <div style={{marginBottom:11}}>
                <div style={{fontSize:10,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>Entrega</div>
                <div style={{display:"flex",gap:7}}>
                  {[{k:"entrega",l:`🛵 Entrega +${fmt(frete)}`},{k:"retirada",l:"🏪 Retirada Grátis"}].map(d=>(
                    <button key={d.k} onClick={()=>setDel(d.k)} style={{flex:1,padding:8,borderRadius:9,border:`2px solid ${del===d.k?hc:T.border}`,background:del===d.k?"#1f0508":T.bg3,color:del===d.k?hc:T.text2,fontWeight:600,fontSize:11,cursor:"pointer"}}>{d.l}</button>
                  ))}
                </div>
              </div>
              <div style={{marginBottom:9}}>
                <div style={{fontSize:10,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>Seu nome (opcional)</div>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Como te chamamos?" style={inp}/>
              </div>
              {del==="entrega"&&<>
                <div style={{marginBottom:7}}><div style={{fontSize:10,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>Rua e número *</div><input value={addr} onChange={e=>setAddr(e.target.value)} placeholder="Rua, número" style={inp}/></div>
                <div style={{marginBottom:9}}><div style={{fontSize:10,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>Bairro</div><input value={bairro} onChange={e=>setBairro(e.target.value)} placeholder="Bairro" style={inp}/></div>
              </>}
              <div style={{marginBottom:9}}>
                <div style={{fontSize:10,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:.5,marginBottom:5}}>Pagamento</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {Object.entries(payLabels).map(([k,l])=><button key={k} onClick={()=>setPay(k)} style={{border:`2px solid ${pay===k?hc:T.border}`,borderRadius:8,padding:"6px 9px",fontSize:11,fontWeight:600,cursor:"pointer",background:pay===k?"#1f0508":T.bg3,color:pay===k?hc:T.text2}}>{l}</button>)}
                </div>
                {pay==="pix"&&<div style={{background:T.bg3,border:`1px solid ${T.border}`,borderRadius:9,padding:9,marginTop:7,fontSize:12,color:T.text2}}>Pix: <b style={{color:T.text}}>{PIX_KEY}</b></div>}
                {pay==="dinheiro"&&<div style={{marginTop:7}}><input type="number" value={troco} onChange={e=>setTroco(e.target.value)} placeholder="Troco para R$ (opcional)" style={inp}/>{troco&&parseFloat(troco)>=total&&<div style={{fontSize:11,color:T.green,marginTop:3}}>Troco: {fmt(parseFloat(troco)-total)}</div>}</div>}
              </div>
              <div style={{marginBottom:9}}>
                <div style={{fontSize:10,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>Observações</div>
                <textarea value={obs} onChange={e=>setObs(e.target.value)} placeholder="Sem cebola..." rows={2} style={{...inp,resize:"none"}}/>
              </div>
              <div style={{background:T.bg3,borderRadius:9,padding:11,border:`1px solid ${T.border}`}}>
                {[["Subtotal",fmt(sub)],["Frete",fr===0?"Grátis":fmt(fr)]].map(([l,v])=>(
                  <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:12,color:T.text2,marginBottom:3}}><span>{l}</span><span>{v}</span></div>
                ))}
                <div style={{display:"flex",justifyContent:"space-between",fontSize:15,fontWeight:800,color:T.text,marginTop:6,paddingTop:6,borderTop:`1px dashed ${T.border}`}}><span>Total</span><span style={{color:hc}}>{fmt(total)}</span></div>
              </div>
            </>
          )}
        </div>
        <div style={{padding:"11px 15px 20px",borderTop:`1px solid ${T.border}`}}>
          {step==="cart"?(
            <button onClick={()=>setStep("checkout")} style={{...btn(hc),width:"100%",padding:12,fontSize:17,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:1}}>FINALIZAR →</button>
          ):(
            <div style={{display:"flex",gap:7}}>
              <button onClick={()=>setStep("cart")} style={{...btn(T.bg3,T.text2),flex:1,padding:12,border:`1px solid ${T.border2}`}}>← Voltar</button>
              <button onClick={submit} style={{...btn(hc),flex:2,padding:12,fontSize:17,fontFamily:"'Bebas Neue',sans-serif"}}>CONFIRMAR</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
