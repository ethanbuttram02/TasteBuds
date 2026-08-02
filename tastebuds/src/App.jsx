import { useState, useEffect } from "react";
import {
  redirectToSpotifyLogin,
  getSpotifyAuthCode,
  getSpotifyAuthError,
  clearSpotifyAuthParamsFromUrl,
  exchangeCodeForToken,
  getStoredSpotifyToken,
  fetchSpotifyProfile,
  fetchSpotifyTopArtists,
  fetchSpotifyTopAlbums,
} from "./spotifyAuth.js";
 
// ── Design tokens ──────────────────────────────────────────────────────────
const T = {
  bg:        "#f0f0f0",
  surface:   "#ffffff",
  border:    "#e8e8e8",
  dark:      "#1a1412",
  mid:       "#7a7068",
  subtle:    "#b0a89e",
  pink:      "#b50063",
  pinkSoft:  "#fbe8f1",
  purple:    "#6B48C8",
  purpleSoft:"#F0ECFB",
  coral:     "#E8512A",
  coralSoft: "#FDF0EB",
  teal:      "#0D9E8A",
  tealSoft:  "#E5F7F5",
  green:     "#1DAF5E",
  greenSoft: "#E6F8EE",
  spotify:   "#1DB954",
};
 
// ── Shared UI primitives ───────────────────────────────────────────────────
const Avatar = ({ size = 40, initials = "?", color = T.pink }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: color + "22", border: `1.5px solid ${color}44`,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, fontSize: size * 0.36, fontWeight: 700, color,
  }}>{initials}</div>
);
 
const Pill = ({ children, color = T.pink, soft = false, small = false }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 4,
    padding: small ? "3px 10px" : "5px 13px",
    borderRadius: 99,
    background: soft ? color + "18" : color,
    color: soft ? color : "#fff",
    fontSize: small ? 10 : 11, fontWeight: 700, letterSpacing: "0.02em", lineHeight: 1,
  }}>{children}</span>
);
 
const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{
    background: T.surface, borderRadius: 18, border: `1px solid ${T.border}`,
    overflow: "hidden", cursor: onClick ? "pointer" : "default", ...style,
  }}>{children}</div>
);
 
const StatusBar = () => (
  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
    padding:"14px 22px 6px", fontSize:13, fontWeight:700, color:T.dark }}>
    <span>9:41</span>
    <div style={{ display:"flex", gap:5, alignItems:"center" }}>
      <span style={{ fontSize:11 }}>▲▲▲</span><span>◼◼◼</span>
    </div>
  </div>
);
 
// ── ONBOARDING: Progress bar ───────────────────────────────────────────────
const ProgressBar = ({ step, total }) => (
  <div style={{ padding:"6px 24px 0" }}>
    <div style={{ height:3, background: T.border, borderRadius:2, overflow:"hidden" }}>
      <div style={{ height:"100%", width:`${(step/total)*100}%`, background: T.pink,
        borderRadius:2, transition:"width 0.4s cubic-bezier(0.22,1,0.36,1)" }} />
    </div>
  </div>
);
 
const BackBtn = ({ onBack }) => (
  <button onClick={onBack} style={{ border:"none", background:"none", cursor:"pointer",
    fontSize:26, color:T.dark, padding:"16px 0 8px", display:"block", lineHeight:1 }}>‹</button>
);
 
const InputField = ({ icon, placeholder, value, type = "text", focused = false }) => (
  <div style={{
    display:"flex", alignItems:"center", gap:10,
    background: T.surface, border:`1.5px solid ${focused ? T.pink : T.border}`,
    borderRadius:12, padding:"13px 16px",
    boxShadow: focused ? `0 0 0 3px ${T.pink}18` : "none",
    transition:"border-color 0.2s, box-shadow 0.2s",
  }}>
    <span style={{ fontSize:17, opacity:0.5, flexShrink:0 }}>{icon}</span>
    <span style={{ fontSize:16, color: value ? T.dark : T.subtle, flex:1 }}>
      {value || placeholder}
    </span>
  </div>
);
 
const BigButton = ({ children, onClick, color = T.pink, outline = false, style = {} }) => (
  <button onClick={onClick} style={{
    width:"100%", padding:"15px", borderRadius:14,
    background: outline ? "transparent" : color,
    border: outline ? `1.5px solid ${T.border}` : "none",
    color: outline ? T.dark : "#fff",
    fontSize:16, fontWeight:700, cursor:"pointer",
    letterSpacing:"0.02em", ...style,
  }}>{children}</button>
);
 
// ── SCREEN 1: Welcome ──────────────────────────────────────────────────────
const WelcomeScreen = ({ onNext, onLogin, onSpotifyLogin }) => (
  <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center",
    justifyContent:"center", padding:"0 28px 40px", gap:0 }}>
    {/* Logo */}
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
      gap:14, marginBottom:36 }}>
      <div style={{ width:96, height:96, borderRadius:"50%", background:T.dark,
        display:"flex", alignItems:"center", justifyContent:"center",
        boxShadow:`0 12px 40px ${T.dark}44` }}>
        <span style={{ fontSize:42 }}>♫</span>
      </div>
      <div style={{ fontSize:30, fontWeight:900, color:T.dark, letterSpacing:"-0.5px" }}>
        taste<span style={{ color:T.pink }}>buds</span>
      </div>
    </div>
 
    <div style={{ fontSize:26, fontWeight:800, color:T.dark, textAlign:"center",
      lineHeight:1.2, marginBottom:10, letterSpacing:"-0.3px" }}>
      find your people<br/>through music
    </div>
    <div style={{ fontSize:15, color:T.mid, textAlign:"center", lineHeight:1.65,
      marginBottom:40, maxWidth:280 }}>
      connect with fans who actually share your taste — not just your genre.
    </div>
 
    <BigButton onClick={onNext} style={{ marginBottom:12 }}>Create an account</BigButton>
    <BigButton onClick={onLogin} outline style={{ marginBottom:16 }}>Log in</BigButton>
 
    <div style={{ display:"flex", alignItems:"center", gap:12, width:"100%", margin:"4px 0 16px" }}>
      <div style={{ flex:1, height:1, background:T.border }} />
      <span style={{ fontSize:13, color:T.subtle, fontWeight:500 }}>or</span>
      <div style={{ flex:1, height:1, background:T.border }} />
    </div>
 
    <button onClick={onSpotifyLogin} style={{ width:"100%", padding:15, borderRadius:14,
      background:T.spotify, border:"none", color:"#fff",
      fontSize:15, fontWeight:700, cursor:"pointer",
      display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
      <span style={{ fontSize:20 }}>♪</span> Continue with Spotify
    </button>
  </div>
);
 
// ── SCREEN 2: Create Account (Email) ──────────────────────────────────────
const CreateAccountScreen = ({ onNext, onBack }) => (
  <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"0 28px" }}>
    <ProgressBar step={1} total={4} />
    <BackBtn onBack={onBack} />
    <div style={{ marginBottom:28 }}>
      <div style={{ fontSize:28, fontWeight:800, color:T.dark, lineHeight:1.15,
        letterSpacing:"-0.4px", marginBottom:8 }}>
        Create your<br/><span style={{ color:T.pink }}>account</span>
      </div>
      <div style={{ fontSize:14, color:T.mid }}>start with your email and a password.</div>
    </div>
 
    <div style={{ marginBottom:18 }}>
      <div style={{ fontSize:11, fontWeight:700, color:T.mid, letterSpacing:"0.1em",
        textTransform:"uppercase", marginBottom:7 }}>Email</div>
      <InputField icon="✉" value="grace@example.com" focused />
    </div>
    <div style={{ marginBottom:18 }}>
      <div style={{ fontSize:11, fontWeight:700, color:T.mid, letterSpacing:"0.1em",
        textTransform:"uppercase", marginBottom:7 }}>Password</div>
      <InputField icon="🔒" placeholder="at least 8 characters" type="password" />
      <div style={{ fontSize:12, color:T.subtle, marginTop:6, paddingLeft:4 }}>
        Use a mix of letters, numbers and symbols
      </div>
    </div>
    <div style={{ marginBottom:28 }}>
      <div style={{ fontSize:11, fontWeight:700, color:T.mid, letterSpacing:"0.1em",
        textTransform:"uppercase", marginBottom:7 }}>Confirm Password</div>
      <InputField icon="🔒" placeholder="confirm your password" type="password" />
    </div>
 
    <div style={{ marginTop:"auto", paddingBottom:40 }}>
      <BigButton onClick={onNext} style={{ marginBottom:14 }}>Continue</BigButton>
      <div style={{ fontSize:12, color:T.subtle, textAlign:"center", lineHeight:1.6 }}>
        By continuing you agree to our{" "}
        <span style={{ color:T.pink, fontWeight:600 }}>Terms of Service</span>
        {" "}and{" "}
        <span style={{ color:T.pink, fontWeight:600 }}>Privacy Policy</span>
      </div>
    </div>
  </div>
);
 
// ── SCREEN 3: Pick Username ────────────────────────────────────────────────
const UsernameScreen = ({ onNext, onBack }) => (
  <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"0 28px" }}>
    <ProgressBar step={2} total={4} />
    <BackBtn onBack={onBack} />
    <div style={{ marginBottom:28 }}>
      <div style={{ fontSize:28, fontWeight:800, color:T.dark, lineHeight:1.15,
        letterSpacing:"-0.4px", marginBottom:8 }}>
        pick a<br/><span style={{ color:T.pink }}>username</span>
      </div>
      <div style={{ fontSize:14, color:T.mid }}>this is how other fans will find you.</div>
    </div>
 
    <div style={{ marginBottom:16 }}>
      <div style={{ fontSize:11, fontWeight:700, color:T.mid, letterSpacing:"0.1em",
        textTransform:"uppercase", marginBottom:7 }}>Username</div>
      <div style={{ display:"flex", alignItems:"center", gap:10,
        background:T.surface, border:`1.5px solid ${T.pink}`,
        borderRadius:12, padding:"13px 16px",
        boxShadow:`0 0 0 3px ${T.pink}18` }}>
        <span style={{ fontSize:17, color:T.pink, fontWeight:700 }}>@</span>
        <span style={{ fontSize:16, color:T.dark, flex:1 }}>grxceturner</span>
      </div>
      <span style={{ display:"inline-flex", alignItems:"center", gap:5,
        background:T.greenSoft, color:T.green, borderRadius:20,
        padding:"4px 10px", fontSize:11, fontWeight:700, marginTop:8 }}>
        ✓ available
      </span>
      <div style={{ fontSize:12, color:T.subtle, marginTop:7, paddingLeft:2 }}>
        Only letters, numbers and underscores. No spaces.
      </div>
    </div>
 
    <Card style={{ padding:"14px 16px", marginBottom:20 }}>
      <div style={{ fontSize:11, fontWeight:700, color:T.mid, letterSpacing:"0.1em",
        textTransform:"uppercase", marginBottom:12 }}>Your profile preview</div>
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <Avatar size={44} initials="G" color={T.pink} />
        <div>
          <div style={{ fontSize:15, fontWeight:700, color:T.dark }}>grxceturner</div>
          <div style={{ fontSize:12, color:T.subtle }}>@grxceturner</div>
        </div>
      </div>
    </Card>
 
    <div style={{ marginTop:"auto", paddingBottom:40 }}>
      <BigButton onClick={onNext}>Continue</BigButton>
    </div>
  </div>
);
 
// ── SCREEN 4: Birthday / Age Verification ─────────────────────────────────
const BirthdayScreen = ({ onNext, onBack }) => (
  <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"0 28px" }}>
    <ProgressBar step={3} total={4} />
    <BackBtn onBack={onBack} />
    <div style={{ marginBottom:28 }}>
      <div style={{ fontSize:28, fontWeight:800, color:T.dark, lineHeight:1.15,
        letterSpacing:"-0.4px", marginBottom:8 }}>
        when's your<br/><span style={{ color:T.pink }}>birthday?</span>
      </div>
      <div style={{ fontSize:14, color:T.mid, lineHeight:1.5 }}>
        we use this to verify your age. you must be 13+ to use Taste Buds.
      </div>
    </div>
 
    <div style={{ marginBottom:14 }}>
      <div style={{ fontSize:11, fontWeight:700, color:T.mid, letterSpacing:"0.1em",
        textTransform:"uppercase", marginBottom:10 }}>Date of birth</div>
      <div style={{ display:"flex", gap:10 }}>
        {[["Month","08"], ["Day","14"], ["Year","2002"]].map(([label, val], i) => (
          <div key={i} style={{ flex: i===2 ? 1.4 : 1 }}>
            <div style={{ fontSize:10, fontWeight:700, color:T.subtle,
              textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>{label}</div>
            <div style={{ background:T.surface, border:`1.5px solid ${T.pink}`,
              borderRadius:12, padding:"13px 10px", textAlign:"center",
              fontSize:17, fontWeight:700, color:T.dark,
              boxShadow:`0 0 0 3px ${T.pink}18` }}>{val}</div>
          </div>
        ))}
      </div>
    </div>
 
    <div style={{ background:T.pinkSoft, border:`1px solid ${T.pink}44`,
      borderRadius:12, padding:"12px 14px",
      display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
      <span style={{ fontSize:20 }}>✓</span>
      <span style={{ fontSize:13, color:T.pink, fontWeight:700 }}>Age verified — you're good to go!</span>
    </div>
 
    <Card style={{ padding:"14px 16px" }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
        <span style={{ fontSize:20, marginTop:1 }}>🔒</span>
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:T.dark, marginBottom:3 }}>
            Your data stays private
          </div>
          <div style={{ fontSize:12, color:T.mid, lineHeight:1.5 }}>
            We only use your birthday for age verification. It won't be shown on your profile.
          </div>
        </div>
      </div>
    </Card>
 
    <div style={{ marginTop:"auto", paddingBottom:40 }}>
      <BigButton onClick={onNext}>Continue</BigButton>
    </div>
  </div>
);
 
// ── SCREEN 5: Connect Spotify ──────────────────────────────────────────────
const SpotifyScreen = ({ onConnect, onSkip, error }) => (
  <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"0 28px" }}>
    <ProgressBar step={4} total={4} />
    <div style={{ flex:1, display:"flex", flexDirection:"column",
      alignItems:"center", paddingTop:28, paddingBottom:40 }}>
      <div style={{ width:110, height:110, borderRadius:"50%", background:T.spotify,
        display:"flex", alignItems:"center", justifyContent:"center", fontSize:52,
        marginBottom:24, boxShadow:`0 12px 40px ${T.spotify}44` }}>♪</div>
 
      <div style={{ fontSize:26, fontWeight:800, color:T.dark, textAlign:"center",
        letterSpacing:"-0.3px", marginBottom:10 }}>connect your<br/>Spotify</div>
      <div style={{ fontSize:14, color:T.mid, textAlign:"center", lineHeight:1.65,
        marginBottom:28, maxWidth:280 }}>
        your listening data is how we match you with fans who actually get it.
      </div>
 
      <div style={{ width:"100%", display:"flex", flexDirection:"column",
        gap:10, marginBottom:28 }}>
        {[
          { icon:"🎵", title:"Music Matching", sub:"match by top artists, albums & listening patterns" },
          { icon:"♫",  title:"Now Playing",    sub:"share what you're listening to in real time" },
          { icon:"🧾", title:"Monthly Receipts", sub:"your listening history, wrapped monthly" },
          { icon:"💿", title:"Top Albums",      sub:"auto-populate your profile with your favourites" },
        ].map((p, i) => (
          <Card key={i} style={{ padding:"12px 14px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:22, flexShrink:0 }}>{p.icon}</span>
              <div>
                <div style={{ fontSize:14, fontWeight:600, color:T.dark, marginBottom:2 }}>{p.title}</div>
                <div style={{ fontSize:12, color:T.mid }}>{p.sub}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
 
      {error && (
        <div style={{ width:"100%", padding:"10px 14px", borderRadius:12,
          background:T.coralSoft, color:T.coral, fontSize:12.5, lineHeight:1.5,
          marginBottom:14 }}>
          couldn't connect to Spotify: {error}
        </div>
      )}
      <button onClick={onConnect} style={{ width:"100%", padding:15, borderRadius:14,
        background:T.spotify, border:"none", color:"#fff",
        fontSize:16, fontWeight:700, cursor:"pointer",
        display:"flex", alignItems:"center", justifyContent:"center",
        gap:10, marginBottom:14 }}>
        <span style={{ fontSize:20 }}>♪</span> Connect Spotify
      </button>
      <button onClick={onSkip} style={{ border:"none", background:"none",
        cursor:"pointer", fontSize:13, color:T.subtle }}>
        skip for now — connect later in settings
      </button>
    </div>
  </div>
);
 
// ── TAB BAR ────────────────────────────────────────────────────────────────
const TabBar = ({ active, setScreen }) => {
  const tabs = [
    { id:"home",     icon:"⌂",  label:"Home"     },
    { id:"find",     icon:"◎",  label:"Find"     },
    { id:"shows",    icon:"♦",  label:"Shows"    },
    { id:"messages", icon:"✉",  label:"Messages" },
    { id:"profile",  icon:"◉",  label:"Profile"  },
  ];
  const accentFor = { home:T.pink, find:T.purple, shows:T.coral, messages:T.teal, profile:T.pink };
  return (
    <div style={{ position:"absolute", bottom:0, left:0, right:0,
      background:T.surface, borderTop:`1px solid ${T.border}`,
      display:"flex", paddingBottom:20 }}>
      {tabs.map(tab => {
        const isActive = active === tab.id;
        const accent = accentFor[tab.id];
        return (
          <button key={tab.id} onClick={() => setScreen(tab.id)} style={{
            flex:1, border:"none", background:"none", cursor:"pointer",
            display:"flex", flexDirection:"column", alignItems:"center",
            padding:"10px 0 0", gap:3 }}>
            <span style={{ fontSize:20, lineHeight:1, color:isActive ? accent : T.subtle }}>{tab.icon}</span>
            <span style={{ fontSize:10, fontWeight:isActive ? 700 : 500,
              color:isActive ? accent : T.subtle }}>{tab.label}</span>
            {isActive && <div style={{ width:20, height:2.5, borderRadius:2,
              background:accent, marginTop:1 }} />}
          </button>
        );
      })}
    </div>
  );
};
 
// ── HOME FEED ──────────────────────────────────────────────────────────────
const stories = [
  { init:"M", color:T.pink,   name:"maya",   song:"The 1975"     },
  { init:"J", color:T.purple, name:"jake",   song:"Oasis"        },
  { init:"Z", color:T.coral,  name:"zoe",    song:"Olivia R"     },
  { init:"L", color:T.teal,   name:"leo",    song:"Sabrina"      },
  { init:"A", color:T.green,  name:"aria",   song:"H.Styles"     },
];
 
const feedPosts = [
  { init:"M", color:T.pink,   name:"Maya R.",    handle:"@mayar",
    content:"ok The 1975 just dropped something and i cannot stop",
    song:"The 1975 — All I Need To Hear", tag:"🎵", match:"92%", time:"2m" },
  { init:"J", color:T.purple, name:"Jake M.",    handle:"@jakemm",
    content:"saw Phoebe Bridgers last night and i genuinely cannot recover",
    song:"Phoebe Bridgers — Motion Sickness", tag:"🎟", match:"87%", time:"14m" },
  { init:"Z", color:T.coral,  name:"Zoe K.",     handle:"@zoek",
    content:"monthly receipt just dropped and embarrassing as expected",
    song:"Olivia Rodrigo — vampire", tag:"🧾", match:"84%", time:"1h" },
];
 
const HomeScreen = () => (
  <div style={{ flex:1, overflowY:"auto", paddingBottom:80 }}>
    <div style={{ padding:"4px 20px 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <span style={{ fontSize:22, fontWeight:900, color:T.pink, letterSpacing:"-0.5px" }}>tastebuds</span>
      <button style={{ background:T.pinkSoft, border:"none", borderRadius:12,
        padding:"6px 12px", fontSize:18, cursor:"pointer" }}>🎰</button>
    </div>
    <div style={{ display:"flex", padding:"12px 20px 0", gap:4 }}>
      {["For You","Following"].map((t,i) => (
        <button key={t} style={{ border:"none", background:"none", cursor:"pointer",
          fontSize:14, fontWeight:i===0 ? 700 : 500,
          color:i===0 ? T.dark : T.mid, padding:"4px 10px 8px",
          borderBottom:i===0 ? `2.5px solid ${T.pink}` : "2.5px solid transparent" }}>{t}</button>
      ))}
    </div>
    <div style={{ height:1, background:T.border, margin:"0 0 12px" }} />
    <div style={{ paddingLeft:16, overflowX:"auto", display:"flex", gap:14, paddingBottom:16 }}>
      {stories.map((s,i) => (
        <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center",
          gap:5, flexShrink:0, width:60 }}>
          <div style={{ padding:2.5, borderRadius:"50%",
            background:`conic-gradient(${s.color},${s.color}88,${s.color})` }}>
            <div style={{ padding:2, borderRadius:"50%", background:T.bg }}>
              <Avatar size={46} initials={s.init} color={s.color} />
            </div>
          </div>
          <span style={{ fontSize:10, fontWeight:500, color:T.mid }}>{s.name}</span>
          <span style={{ fontSize:9, color:T.subtle, textAlign:"center",
            maxWidth:60, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.song}</span>
        </div>
      ))}
    </div>
    <div style={{ margin:"0 16px 14px", display:"flex", gap:10, alignItems:"center" }}>
      <Avatar size={34} initials="G" color={T.pink} />
      <div style={{ flex:1, background:T.surface, border:`1px solid ${T.border}`,
        borderRadius:24, padding:"9px 16px", fontSize:13, color:T.subtle }}>
        what are you listening to?
      </div>
    </div>
    <div style={{ height:1, background:T.border, margin:"0 0 8px" }} />
    {feedPosts.map((p,i) => (
      <div key={i} style={{ padding:"14px 16px", borderBottom:`1px solid ${T.border}` }}>
        <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
          <Avatar size={38} initials={p.init} color={p.color} />
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:2 }}>
              <div>
                <span style={{ fontSize:13, fontWeight:700, color:T.dark }}>{p.name}</span>
                <span style={{ fontSize:12, color:T.subtle, marginLeft:6 }}>{p.handle}</span>
              </div>
              <span style={{ fontSize:11, color:T.subtle }}>{p.time}</span>
            </div>
            <p style={{ fontSize:14, color:T.dark, margin:"4px 0 8px", lineHeight:1.45 }}>{p.content}</p>
            <div style={{ display:"flex", alignItems:"center", gap:10,
              background:p.color+"0F", border:`1px solid ${p.color}22`,
              borderRadius:12, padding:"8px 12px", marginBottom:10 }}>
              <span style={{ fontSize:16 }}>{p.tag}</span>
              <span style={{ fontSize:12, fontWeight:600, color:T.dark }}>{p.song}</span>
            </div>
            <div style={{ display:"flex", gap:16, alignItems:"center" }}>
              {["♡ 12","↩ reply","↗"].map((a,j) => (
                <button key={j} style={{ border:"none", background:"none",
                  cursor:"pointer", fontSize:12, color:T.mid, fontWeight:500 }}>{a}</button>
              ))}
              <Pill small color={p.color} soft>{p.match} match</Pill>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);
 
// ── FIND FANS ──────────────────────────────────────────────────────────────
const fans = [
  { init:"M", color:T.pink,   name:"Maya R.",    match:"92%", artists:"The 1975 · Phoebe B", live:true  },
  { init:"J", color:T.purple, name:"Jake M.",    match:"87%", artists:"Oasis · Blur",         live:false },
  { init:"Z", color:T.coral,  name:"Zoe K.",     match:"84%", artists:"Olivia R · Sabrina",   live:true  },
  { init:"L", color:T.teal,   name:"Leo P.",     match:"79%", artists:"Harry S · 1D",         live:false },
  { init:"A", color:T.green,  name:"Aria W.",    match:"76%", artists:"Sombr · Addison R",    live:true  },
  { init:"S", color:T.purple, name:"Sam T.",     match:"71%", artists:"The 1975 · Oasis",     live:false },
];
 
const FindFansScreen = () => (
  <div style={{ flex:1, overflowY:"auto", paddingBottom:80 }}>
    <div style={{ padding:"4px 20px 12px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <span style={{ fontSize:20, fontWeight:800, color:T.dark }}>find fans</span>
      <Pill color={T.purple} soft small>◎ nearby</Pill>
    </div>
    <div style={{ margin:"0 16px 14px", position:"relative" }}>
      <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)",
        fontSize:14, color:T.subtle }}>🔍</span>
      <input readOnly style={{ width:"100%", padding:"10px 14px 10px 36px",
        border:`1px solid ${T.border}`, borderRadius:14, background:T.surface,
        fontSize:14, color:T.mid, outline:"none", boxSizing:"border-box",
        fontFamily:"inherit" }} placeholder="search by artist or name" />
    </div>
    <div style={{ height:1, background:T.border, margin:"0 0 16px" }} />
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, padding:"0 16px" }}>
      {fans.map((f,i) => (
        <Card key={i} style={{ padding:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"flex-start", marginBottom:10 }}>
            <Avatar size={44} initials={f.init} color={f.color} />
            {f.live && <Pill color={T.green} small>♫ live</Pill>}
          </div>
          <div style={{ fontSize:13, fontWeight:700, color:T.dark, marginBottom:2 }}>{f.name}</div>
          <div style={{ fontSize:10, color:T.mid, marginBottom:8, lineHeight:1.4 }}>{f.artists}</div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <Pill color={f.color} soft small>{f.match}</Pill>
            <button style={{ border:`1.5px solid ${f.color}`, borderRadius:20,
              background:"none", color:f.color, fontSize:11, fontWeight:700,
              padding:"4px 10px", cursor:"pointer" }}>+ connect</button>
          </div>
        </Card>
      ))}
    </div>
  </div>
);
 
// ── SHOWS ──────────────────────────────────────────────────────────────────
const shows = [
  { artist:"The 1975",         venue:"Kia Forum, LA",        date:"Aug 12", fans:14, color:T.pink   },
  { artist:"Phoebe Bridgers",  venue:"Greek Theatre, LA",    date:"Aug 19", fans:8,  color:T.purple },
  { artist:"Olivia Rodrigo",   venue:"Crypto.com Arena, LA", date:"Sep 3",  fans:22, color:T.coral  },
  { artist:"Sabrina Carpenter",venue:"Hollywood Bowl, LA",   date:"Sep 14", fans:11, color:T.teal   },
];
 
const ShowsScreen = () => (
  <div style={{ flex:1, overflowY:"auto", paddingBottom:80 }}>
    <div style={{ padding:"4px 20px 12px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
      <span style={{ fontSize:20, fontWeight:800, color:T.dark }}>shows near you</span>
      <Pill color={T.coral} soft small>📍 LA</Pill>
    </div>
    <div style={{ height:1, background:T.border, margin:"0 0 14px" }} />
    <div style={{ display:"flex", flexDirection:"column", gap:12, padding:"0 16px" }}>
      {shows.map((s,i) => (
        <Card key={i}>
          <div style={{ display:"flex", gap:0 }}>
            <div style={{ width:5, background:s.color, flexShrink:0, borderRadius:"18px 0 0 18px" }} />
            <div style={{ padding:"14px 14px 14px 14px", flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <div style={{ fontSize:15, fontWeight:800, color:T.dark, marginBottom:3 }}>{s.artist}</div>
                  <div style={{ fontSize:12, color:T.mid, marginBottom:6 }}>{s.venue}</div>
                  <Pill color={s.color} soft small>📅 {s.date}</Pill>
                </div>
                <button style={{ background:s.color, color:"#fff", border:"none",
                  borderRadius:12, padding:"8px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>
                  check in
                </button>
              </div>
              <div style={{ marginTop:12, display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ display:"flex" }}>
                  {[0,1,2,3].map(j => (
                    <div key={j} style={{ width:24, height:24, borderRadius:"50%",
                      background:s.color+"33", border:`2px solid ${T.surface}`,
                      marginLeft:j===0 ? 0 : -8 }} />
                  ))}
                </div>
                <span style={{ fontSize:12, color:T.mid, fontWeight:500 }}>{s.fans} fans going</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);
 
// ── MESSAGES ──────────────────────────────────────────────────────────────
const convos = [
  { init:"M", color:T.pink,   name:"Maya R.",    last:"ok i'm obsessed with that track you sent",      time:"2m",  unread:2 },
  { init:"J", color:T.purple, name:"Jake M.",    last:"we're literally going to the same show omg",    time:"18m", unread:0 },
  { init:"Z", color:T.coral,  name:"Zoe K.",     last:"my spotify wrapped is going to be so unhinged", time:"1h",  unread:3 },
  { init:"L", color:T.teal,   name:"Leo P.",     last:"have you heard the new Phoebe album???",        time:"3h",  unread:0 },
  { init:"A", color:T.green,  name:"Aria W.",    last:"coming to the 1975 show in aug?",               time:"1d",  unread:0 },
];
 
const chatMessages = [
  { from:"them", text:"hey!! saw you're going to The 1975 show 👀", time:"9:38" },
  { from:"me",   text:"yes!! i've been listening on repeat for weeks", time:"9:39" },
  { from:"them", text:"ok we have basically the same taste this is insane", time:"9:40" },
  { from:"me",   text:"right?? 92% match makes sense lol", time:"9:40" },
  { from:"them", text:"ok i'm obsessed with that track you sent", time:"9:41" },
];
 
const MessagesScreen = () => {
  const [openChat, setOpenChat] = useState(null);
  if (openChat !== null) {
    const c = convos[openChat];
    return (
      <div style={{ flex:1, display:"flex", flexDirection:"column", paddingBottom:80 }}>
        <div style={{ padding:"4px 16px 12px", display:"flex", alignItems:"center",
          gap:12, borderBottom:`1px solid ${T.border}` }}>
          <button onClick={() => setOpenChat(null)} style={{ border:"none", background:"none",
            fontSize:22, cursor:"pointer", color:c.color }}>‹</button>
          <Avatar size={36} initials={c.init} color={c.color} />
          <div>
            <div style={{ fontSize:14, fontWeight:700, color:T.dark }}>{c.name}</div>
            <div style={{ fontSize:11, color:T.teal }}>● online</div>
          </div>
          <Pill color={c.color} soft small style={{ marginLeft:"auto" }}>92% match</Pill>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 0",
          display:"flex", flexDirection:"column", gap:10 }}>
          {chatMessages.map((m,i) => (
            <div key={i} style={{ display:"flex", justifyContent:m.from==="me" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth:"72%",
                background:m.from==="me" ? c.color : T.surface,
                border:m.from==="them" ? `1px solid ${T.border}` : "none",
                color:m.from==="me" ? "#fff" : T.dark,
                borderRadius:m.from==="me" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                padding:"10px 14px", fontSize:14, lineHeight:1.4 }}>
                {m.text}
                <div style={{ fontSize:10, color:m.from==="me" ? "rgba(255,255,255,0.6)" : T.subtle,
                  marginTop:4, textAlign:"right" }}>{m.time}</div>
              </div>
            </div>
          ))}
          <div style={{ display:"flex", alignItems:"center", gap:4, padding:"4px 0" }}>
            <Avatar size={24} initials={c.init} color={c.color} />
            <div style={{ background:T.surface, border:`1px solid ${T.border}`,
              borderRadius:12, padding:"8px 14px", display:"flex", gap:4 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width:6, height:6, borderRadius:"50%",
                  background:T.subtle, animation:`bounce 1.2s ${i*0.2}s infinite` }} />
              ))}
            </div>
          </div>
        </div>
        <div style={{ padding:"12px 16px 0", display:"flex", gap:10, alignItems:"center" }}>
          <div style={{ flex:1, background:T.surface, border:`1px solid ${T.border}`,
            borderRadius:24, padding:"10px 16px", fontSize:13, color:T.subtle }}>
            message {c.name.split(" ")[0].toLowerCase()}...
          </div>
          <button style={{ background:c.color, border:"none", borderRadius:"50%",
            width:38, height:38, cursor:"pointer", fontSize:16, color:"#fff" }}>↑</button>
        </div>
      </div>
    );
  }
  return (
    <div style={{ flex:1, overflowY:"auto", paddingBottom:80 }}>
      <div style={{ padding:"4px 20px 12px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:20, fontWeight:800, color:T.dark }}>messages</span>
        <button style={{ background:T.tealSoft, border:"none", borderRadius:12,
          padding:"6px 12px", fontSize:13, fontWeight:700, color:T.teal, cursor:"pointer" }}>+ new</button>
      </div>
      <div style={{ margin:"0 16px 14px", position:"relative" }}>
        <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)",
          fontSize:14, color:T.subtle }}>🔍</span>
        <input readOnly style={{ width:"100%", padding:"10px 14px 10px 36px",
          border:`1px solid ${T.border}`, borderRadius:14, background:T.surface,
          fontSize:14, color:T.mid, outline:"none", boxSizing:"border-box",
          fontFamily:"inherit" }} placeholder="search conversations" />
      </div>
      <div style={{ height:1, background:T.border }} />
      {convos.map((c,i) => (
        <div key={i} onClick={() => setOpenChat(i)} style={{
          display:"flex", alignItems:"center", gap:12, padding:"14px 16px",
          borderBottom:`1px solid ${T.border}`, cursor:"pointer",
          background:c.unread > 0 ? c.color+"06" : "transparent" }}>
          <div style={{ position:"relative" }}>
            <Avatar size={46} initials={c.init} color={c.color} />
            {c.unread > 0 && (
              <div style={{ position:"absolute", top:-2, right:-2,
                background:c.color, color:"#fff", borderRadius:"50%",
                width:18, height:18, fontSize:10, fontWeight:800,
                display:"flex", alignItems:"center", justifyContent:"center",
                border:`2px solid ${T.bg}` }}>{c.unread}</div>
            )}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
              <span style={{ fontSize:14, fontWeight:c.unread>0 ? 800 : 600, color:T.dark }}>{c.name}</span>
              <span style={{ fontSize:11, color:T.subtle }}>{c.time}</span>
            </div>
            <div style={{ fontSize:13, color:c.unread>0 ? T.dark : T.mid,
              fontWeight:c.unread>0 ? 600 : 400,
              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{c.last}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
 
// ── PROFILE ────────────────────────────────────────────────────────────────
const topArtists = ["The 1975","Phoebe B.","Olivia R.","Oasis","Sabrina C.","Harry S.","One Direction","Sombr","Addison Rae"];
const albumColors = [T.pink, T.purple, T.coral, T.teal];
const coldOpens = [
  { q:"fav artist right now?",    a:"The 1975 always"   },
  { q:"last show you went to?",   a:"Greek Theatre 🎟"   },
  { q:"album on repeat?",         a:"Being Funny in a Foreign Language" },
  { q:"song for a road trip?",    a:"Give Me All Your Love" },
];
 
const ProfileScreen = ({ spotifyProfile, spotifyTopArtists, spotifyTopAlbums }) => {
  const displayName = spotifyProfile?.display_name || "Grace Turner";
  const handle = spotifyProfile?.id ? `@${spotifyProfile.id}` : "@grxceturner";
  const initial = displayName.charAt(0).toUpperCase();
  const avatarUrl = spotifyProfile?.images?.[0]?.url || null;
  const artistNames = spotifyTopArtists?.length
    ? spotifyTopArtists.map(a => a.name)
    : topArtists;
 
  return (
  <div style={{ flex:1, overflowY:"auto", paddingBottom:80 }}>
    <div style={{ height:120,
      background:`linear-gradient(135deg, ${T.pink}CC 0%, ${T.purple}99 50%, ${T.coral}88 100%)`,
      position:"relative" }}>
      <div style={{ position:"absolute", bottom:-28, left:20 }}>
        <div style={{ width:60, height:60, borderRadius:"50%", background:T.pinkSoft,
          border:`3px solid ${T.bg}`, display:"flex", alignItems:"center",
          justifyContent:"center", fontSize:22, fontWeight:900, color:T.pink,
          overflow:"hidden", backgroundImage: avatarUrl ? `url(${avatarUrl})` : "none",
          backgroundSize:"cover", backgroundPosition:"center" }}>
          {!avatarUrl && initial}
        </div>
      </div>
      <Pill color={T.pink} style={{ position:"absolute", bottom:12, right:16 }}>
        {spotifyProfile ? "♪ spotify connected" : "✦ founding member"}
      </Pill>
    </div>
    <div style={{ padding:"36px 20px 0" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
        <div>
          <div style={{ fontSize:20, fontWeight:900, color:T.dark, letterSpacing:"-0.3px" }}>{displayName}</div>
          <div style={{ fontSize:13, color:T.mid }}>{handle}</div>
        </div>
        <Pill color={T.pink}>99% match</Pill>
      </div>
      <div style={{ fontSize:12, color:T.mid, marginBottom:14 }}>♪ Greek Theatre · LA · thetastebuds.app</div>
      <div style={{ display:"flex", gap:24, marginBottom:16 }}>
        {[["142","following"],["389","followers"]].map(([n,l]) => (
          <div key={l}>
            <span style={{ fontSize:16, fontWeight:800, color:T.dark }}>{n}</span>
            <span style={{ fontSize:12, color:T.mid, marginLeft:4 }}>{l}</span>
          </div>
        ))}
      </div>
      <div style={{ height:1, background:T.border, margin:"0 0 16px" }} />
      <div style={{ fontSize:13, fontWeight:800, color:T.dark, marginBottom:10 }}>top artists</div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:18 }}>
        {artistNames.map((a,i) => (
          <Pill key={i} color={[T.pink,T.purple,T.coral,T.teal,T.green,T.purple,T.pink,T.coral,T.teal][i]} soft small>{a}</Pill>
        ))}
      </div>
      <div style={{ fontSize:13, fontWeight:800, color:T.dark, marginBottom:10 }}>top albums</div>
      <div style={{ display:"flex", gap:10, marginBottom:18 }}>
        {spotifyTopAlbums?.length
          ? spotifyTopAlbums.map((album) => (
              <div key={album.id} title={album.name} style={{ width:66, height:66, borderRadius:12,
                overflow:"hidden", border:`1px solid ${T.border}`, flexShrink:0,
                backgroundImage: `url(${album.images?.[1]?.url || album.images?.[0]?.url || ""})`,
                backgroundSize:"cover", backgroundPosition:"center", backgroundColor:T.border }} />
            ))
          : albumColors.map((c,i) => (
              <div key={i} style={{ width:66, height:66, borderRadius:12,
                background:`linear-gradient(135deg, ${c}DD, ${c}66)`,
                border:`1px solid ${c}44` }} />
            ))}
      </div>
      <div style={{ height:1, background:T.border, margin:"0 0 16px" }} />
      <div style={{ fontSize:13, fontWeight:800, color:T.dark, marginBottom:10 }}>cold opens</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        {coldOpens.map((co,i) => (
          <Card key={i} style={{ padding:12 }}>
            <div style={{ fontSize:10, color:T.mid, marginBottom:4, lineHeight:1.3 }}>{co.q}</div>
            <div style={{ fontSize:12, fontWeight:700, color:T.dark, lineHeight:1.3 }}>{co.a}</div>
          </Card>
        ))}
      </div>
    </div>
  </div>
  );
};
 
// ── Spotify: connecting overlay ─────────────────────────────────────────────
const SpotifyConnectingScreen = () => (
  <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center",
    justifyContent:"center", gap:18, padding:"0 28px" }}>
    <div style={{ width:72, height:72, borderRadius:"50%", background:T.spotify,
      display:"flex", alignItems:"center", justifyContent:"center", fontSize:32,
      boxShadow:`0 12px 40px ${T.spotify}44` }}>♪</div>
    <div style={{ display:"flex", gap:6 }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:T.spotify,
          animation:"bounce 1.2s infinite", animationDelay:`${i*0.15}s` }} />
      ))}
    </div>
    <div style={{ fontSize:15, color:T.mid, fontWeight:600, textAlign:"center" }}>
      connecting your Spotify…
    </div>
  </div>
);
 
// ── APP SHELL ──────────────────────────────────────────────────────────────
export default function App() {
  // Onboarding state: null = not started, 0-4 = step, "done" = complete
  const [onboardStep, setOnboardStep] = useState(0);
  const [mainScreen, setMainScreen] = useState("home");
 
  // Spotify login state
  const [spotifyStatus, setSpotifyStatus] = useState("idle"); // idle | connecting | connected | error
  const [spotifyError, setSpotifyError] = useState(null);
  const [spotifyProfile, setSpotifyProfile] = useState(null);
  const [spotifyTopArtists, setSpotifyTopArtists] = useState([]);
  const [spotifyTopAlbums, setSpotifyTopAlbums] = useState([]);
 
  const onboardingComplete = onboardStep === "done";
 
  const loadSpotifyData = async (accessToken) => {
    try {
      const [profile, artists, albums] = await Promise.all([
        fetchSpotifyProfile(accessToken),
        fetchSpotifyTopArtists(accessToken),
        fetchSpotifyTopAlbums(accessToken),
      ]);
      setSpotifyProfile(profile);
      setSpotifyTopArtists(artists);
      setSpotifyTopAlbums(albums);
      setSpotifyStatus("connected");
      setOnboardStep("done");
    } catch (err) {
      console.error(err);
      setSpotifyError(err.message);
      setSpotifyStatus("error");
    }
  };
 
  // Handles the redirect back from Spotify (?code=...) and picks up an
  // already-valid session on refresh.
  useEffect(() => {
    const handleSpotifyRedirect = async () => {
      const authError = getSpotifyAuthError();
      if (authError) {
        clearSpotifyAuthParamsFromUrl();
        setSpotifyError(authError === "access_denied" ? "access was denied" : authError);
        setSpotifyStatus("error");
        return;
      }
 
      const code = getSpotifyAuthCode();
      if (code) {
        setSpotifyStatus("connecting");
        clearSpotifyAuthParamsFromUrl();
        try {
          const token = await exchangeCodeForToken(code);
          await loadSpotifyData(token.access_token);
        } catch (err) {
          console.error(err);
          setSpotifyError(err.message);
          setSpotifyStatus("error");
        }
        return;
      }
 
      const existingToken = getStoredSpotifyToken();
      if (existingToken) {
        setSpotifyStatus("connecting");
        await loadSpotifyData(existingToken.access_token);
      }
    };
 
    handleSpotifyRedirect();
  }, []);
 
  const handleSpotifyLogin = () => {
    setSpotifyError(null);
    redirectToSpotifyLogin();
  };
 
  const mainScreens = {
    home:     <HomeScreen />,
    find:     <FindFansScreen />,
    shows:    <ShowsScreen />,
    messages: <MessagesScreen />,
    profile:  <ProfileScreen spotifyProfile={spotifyProfile} spotifyTopArtists={spotifyTopArtists} spotifyTopAlbums={spotifyTopAlbums} />,
  };
 
  const renderOnboarding = () => {
    if (spotifyStatus === "connecting") return <SpotifyConnectingScreen />;
 
    switch (onboardStep) {
      case 0: return <WelcomeScreen
        onNext={() => setOnboardStep(1)}
        onLogin={() => setOnboardStep("done")}
        onSpotifyLogin={handleSpotifyLogin} />;
      case 1: return <CreateAccountScreen
        onNext={() => setOnboardStep(2)}
        onBack={() => setOnboardStep(0)} />;
      case 2: return <UsernameScreen
        onNext={() => setOnboardStep(3)}
        onBack={() => setOnboardStep(1)} />;
      case 3: return <BirthdayScreen
        onNext={() => setOnboardStep(4)}
        onBack={() => setOnboardStep(2)} />;
      case 4: return <SpotifyScreen
        onConnect={handleSpotifyLogin}
        onSkip={() => setOnboardStep("done")}
        error={spotifyStatus === "error" ? spotifyError : null} />;
      default: return null;
    }
  };
 
  return (
    <>
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; -webkit-font-smoothing:antialiased; }
        body { background:#2a2320; display:flex; justify-content:center; align-items:center;
          min-height:100vh; font-family:-apple-system,'SF Pro Text','Inter',sans-serif; }
        @keyframes bounce { 0%,60%,100%{transform:translateY(0);opacity:0.4} 28%{transform:translateY(-5px);opacity:1} }
        ::-webkit-scrollbar { display:none; }
        input { font-family:inherit; }
        button { font-family:inherit; }
      `}</style>
      <div style={{ width:390, height:844, background:T.bg, borderRadius:48, overflow:"hidden",
        boxShadow:"0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)",
        display:"flex", flexDirection:"column", position:"relative" }}>
        <StatusBar />
        <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
          {onboardingComplete ? (
            <>
              {mainScreens[mainScreen]}
              <TabBar active={mainScreen} setScreen={setMainScreen} />
            </>
          ) : (
            renderOnboarding()
          )}
        </div>
      </div>
    </>
  );
}
