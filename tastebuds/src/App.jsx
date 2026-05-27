import { useState } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Instrument+Sans:wght@400;500;600&display=swap');`;

const css = `
  ${FONTS}
  :root {
    --bg:      #f0f0f0;
    --bg2:     #e6e6e6;
    --bg3:     #dcdcdc;
    --border:  #cccccc;
    --ink:     #111111;
    --ink2:    #444444;
    --ink3:    #888888;
    --accent:  #b50063;
  }
  .app.dark {
    --bg:      #0f0f0f;
    --bg2:     #1a1a1a;
    --bg3:     #242424;
    --border:  #2e2e2e;
    --ink:     #f0f0f0;
    --ink2:    #b0b0b0;
    --ink3:    #666666;
    --accent:  #e0498a;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; transition: background 0.25s ease, background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease; }
  .app {
    width: 390px; max-width: 100%; margin: 0 auto; min-height: 100vh;
    background: var(--bg); color: var(--ink);
    font-family: 'Instrument Sans', sans-serif;
  }
  .screen { padding-bottom: 80px; min-height: 100vh; width: 100%; }

  /* NAV */
  .bottom-nav {
    position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 390px; background: var(--bg); border-top: 1px solid var(--border);
    display: flex; justify-content: space-around; padding: 10px 0 22px; z-index: 100;
  }
  .nav-btn {
    background: none; border: none; color: var(--ink3); cursor: pointer;
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    transition: color 0.2s; padding: 0 12px;
  }
  .nav-btn.active { color: var(--ink); }
  .nav-icon { font-size: 19px; line-height: 1; }
  .nav-btn span { font-size: 9px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }

  /* FEED HEADER */
  .feed-header {
    position: sticky; top: 0; z-index: 50;
    background: color-mix(in srgb, var(--bg) 94%, transparent);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border);
    padding: 52px 18px 0;
  }
  .feed-header-top {
    display: flex; justify-content: space-between; align-items: center;
    padding-bottom: 12px;
  }
  .wordmark {
    font-family: 'La Lou', 'Cormorant Garamond', serif;
    font-size: 24px; font-weight: 300; font-style: italic;
  }
  .wordmark span { color: var(--accent); }
  .feed-header-icons { display: flex; gap: 8px; }
  .icon-btn {
    width: 34px; height: 34px; border-radius: 50%;
    background: var(--bg2); border: 1.5px solid var(--border);
    color: var(--ink2); font-size: 14px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
  }
  .feed-tabs { display: flex; }
  .feed-tab {
    flex: 1; background: none; border: none; cursor: pointer;
    font-family: 'Instrument Sans', sans-serif; font-size: 13px; font-weight: 600;
    color: var(--ink3); padding: 10px 0; position: relative; transition: color 0.18s;
  }
  .feed-tab.active { color: var(--ink); }
  .feed-tab.active::after {
    content: ''; position: absolute; bottom: 0; left: 20%; right: 20%;
    height: 2px; background: var(--ink); border-radius: 2px;
  }

  /* ── NOW PLAYING STORIES ── */
  .now-playing-row {
    padding: 14px 0 14px 18px;
    border-bottom: 1px solid var(--border);
    overflow-x: auto; display: flex; gap: 16px;
    scrollbar-width: none;
  }
  .now-playing-row::-webkit-scrollbar { display: none; }
  .np-story {
    display: flex; flex-direction: column; align-items: center; gap: 5px;
    cursor: pointer; flex-shrink: 0;
  }
  .np-ring-wrap { position: relative; width: 56px; height: 56px; }
  .np-ring {
    width: 56px; height: 56px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
  }
  .np-ring.active {
    background: conic-gradient(var(--ink) 0%, var(--ink2) 40%, var(--ink3) 70%, var(--ink) 100%);
    animation: ring-spin 3s linear infinite;
  }
  .np-ring.inactive { background: var(--bg3); }
  @keyframes ring-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .np-avatar-inner {
    width: 48px; height: 48px; border-radius: 50%;
    background: var(--bg2); border: 2px solid var(--bg);
    display: flex; align-items: center; justify-content: center;
    font-size: 23px; position: absolute; top: 4px; left: 4px;
  }
  .np-badge {
    position: absolute; bottom: 0; right: 0;
    width: 18px; height: 18px; border-radius: 50%;
    background: var(--ink); border: 2px solid var(--bg);
    display: flex; align-items: center; justify-content: center;
    font-size: 8px; color: var(--bg); font-weight: 700;
  }
  .np-name {
    font-size: 10px; font-weight: 600; color: var(--ink2);
    max-width: 56px; text-align: center;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .np-song {
    font-size: 9px; color: var(--ink3);
    max-width: 56px; text-align: center;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    font-style: italic;
  }

  /* now playing tooltip */
  .np-tooltip {
    position: fixed; bottom: 96px; left: 50%; transform: translateX(-50%);
    background: var(--ink); color: var(--bg); border-radius: 12px; padding: 10px 16px;
    font-size: 12px; z-index: 150; white-space: nowrap; pointer-events: none;
    animation: fadeUp 0.25s ease; box-shadow: 0 4px 20px rgba(0,0,0,0.18);
  }
  .np-tooltip strong { font-weight: 600; }
  .np-tooltip span { color: var(--ink3); margin: 0 5px; }

  /* COMPOSE */
  .compose-bar {
    display: flex; gap: 10px; padding: 14px 18px;
    border-bottom: 1px solid var(--border);
  }
  .compose-avatar {
    width: 38px; height: 38px; border-radius: 50%;
    background: var(--bg3); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
  }
  .compose-right { flex: 1; display: flex; flex-direction: column; gap: 8px; }
  .compose-input {
    width: 100%; background: none; border: none; outline: none;
    font-family: 'Instrument Sans', sans-serif; font-size: 14px;
    color: var(--ink); caret-color: var(--ink); resize: none; padding-top: 6px;
  }
  .compose-input::placeholder { color: var(--ink3); }
  .compose-actions { display: flex; justify-content: flex-end; }
  .compose-post-btn {
    background: var(--ink); color: var(--bg); border: none; border-radius: 20px;
    padding: 7px 18px; font-family: 'Instrument Sans', sans-serif;
    font-size: 12px; font-weight: 600; letter-spacing: 0.08em; cursor: pointer;
    transition: opacity 0.15s;
  }
  .compose-post-btn:active { opacity: 0.75; }

  /* POSTS */
  .divider { height: 1px; background: var(--border); }
  .post {
    display: flex; gap: 11px; padding: 14px 18px;
    border-bottom: 1px solid var(--border); cursor: pointer; transition: background 0.12s;
  }
  .post:hover { background: var(--bg2); }
  .post-avatar-wrap { position: relative; flex-shrink: 0; }
  .post-avatar {
    width: 40px; height: 40px; border-radius: 50%;
    background: var(--bg3); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center; font-size: 19px;
  }
  .post-avatar-wrap.playing .post-avatar {
    outline: 2px solid var(--ink2); outline-offset: 2px;
  }
  .post-avatar-np {
    position: absolute; bottom: -2px; right: -2px;
    width: 16px; height: 16px; border-radius: 50%;
    background: var(--ink); border: 1.5px solid var(--bg);
    display: flex; align-items: center; justify-content: center;
    font-size: 8px; color: var(--bg);
  }
  .post-body { flex: 1; min-width: 0; }
  .post-meta { display: flex; align-items: baseline; gap: 5px; margin-bottom: 4px; flex-wrap: wrap; }
  .post-name { font-size: 13px; font-weight: 600; color: var(--ink); }
  .post-handle { font-size: 12px; color: var(--ink3); }
  .post-time { font-size: 11px; color: var(--ink3); margin-left: auto; }
  .post-text { font-size: 14px; color: var(--ink2); line-height: 1.55; margin-bottom: 10px; }
  .now-playing-pill {
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: 10px; padding: 7px 10px; margin-bottom: 10px; width: 100%;
  }
  .pill-art { font-size: 18px; }
  .pill-text { flex: 1; min-width: 0; }
  .pill-song { font-size: 12px; font-weight: 600; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .pill-artist { font-size: 10px; color: var(--ink3); }
  .pill-wave { font-size: 13px; color: var(--ink3); animation: pulse 1.2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .post-actions { display: flex; gap: 20px; margin-top: 2px; }
  .action-btn {
    background: none; border: none; cursor: pointer;
    display: flex; align-items: center; gap: 5px;
    font-family: 'Instrument Sans', sans-serif; font-size: 12px;
    color: var(--ink3); transition: color 0.15s; padding: 0;
  }
  .action-btn:hover { color: var(--ink); }
  .action-btn.liked { color: var(--ink); }
  .action-icon { font-size: 14px; }

  /* FIND FANS */
  .fans-header { padding: 56px 22px 0; display: flex; justify-content: space-between; align-items: flex-end; }
  .fans-title { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 300; font-style: italic; }
  .header-icons { display: flex; gap: 8px; }
  .find-btn {
    margin: 16px 22px 0; width: calc(100% - 44px);
    background: var(--ink); color: var(--bg); border: none; border-radius: 12px;
    padding: 14px; font-family: 'Instrument Sans', sans-serif; font-size: 12px;
    font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .fans-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; padding: 16px 22px; }
  .fan-card { cursor: pointer; }
  .fan-photo {
    width: 100%; aspect-ratio: 1; border-radius: 12px; background: var(--bg2);
    position: relative; overflow: hidden; display: flex; align-items: center;
    justify-content: center; font-size: 28px; margin-bottom: 7px; border: 1px solid var(--border);
  }
  .fan-photo.np-active { outline: 2.5px solid var(--ink2); outline-offset: 2px; }
  .fan-np-badge {
    position: absolute; top: 5px; right: 5px;
    background: var(--ink); border-radius: 8px; padding: 2px 6px;
    font-size: 8px; color: var(--bg); font-weight: 600;
    display: flex; align-items: center; gap: 3px;
  }
  .fan-add {
    position: absolute; bottom: 5px; left: 5px; width: 20px; height: 20px;
    background: var(--ink); border-radius: 50%; display: flex; align-items: center;
    justify-content: center; font-size: 12px; color: var(--bg); font-weight: 700; cursor: pointer;
  }
  .fan-add.connected { background: var(--ink2); }
  .fan-name { font-size: 11px; font-weight: 600; color: var(--ink); margin-bottom: 1px; }
  .fan-handle { font-size: 9px; color: var(--ink3); margin-bottom: 4px; }
  .fan-tags { display: flex; flex-wrap: wrap; gap: 3px; }
  .fan-tag { font-size: 8px; background: var(--bg3); border: 1px solid var(--border); color: var(--ink2); padding: 2px 5px; border-radius: 4px; font-weight: 500; }

  /* PROFILE */
  .profile-header { padding: 56px 22px 0; display: flex; justify-content: space-between; align-items: center; }
  .back-btn { width: 34px; height: 34px; border-radius: 50%; background: var(--bg2); border: 1.5px solid var(--border); color: var(--ink); font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
  .profile-banner { margin: 14px 22px 0; height: 90px; border-radius: 14px; background: var(--bg3); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 11px; letter-spacing: 0.1em; color: var(--ink3); text-transform: uppercase; font-weight: 600; }
  .profile-avatar-row { padding: 0 22px; margin-top: -22px; display: flex; justify-content: space-between; align-items: flex-end; }
  .p-avatar { width: 72px; height: 72px; border-radius: 50%; background: var(--bg2); border: 3px solid var(--bg); display: flex; align-items: center; justify-content: center; font-size: 34px; }
  .p-follow-btn { background: var(--ink); color: var(--bg); border: none; border-radius: 20px; padding: 8px 18px; font-family: 'Instrument Sans', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; }
  .profile-info { padding: 12px 22px 0; }
  .pname { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 400; margin-bottom: 1px; }
  .phandle { font-size: 12px; color: var(--ink3); margin-bottom: 8px; }
  .pbio { font-size: 13px; color: var(--ink2); line-height: 1.6; margin-bottom: 10px; }
  .pmeta { display: flex; flex-wrap: wrap; gap: 10px; font-size: 11px; color: var(--ink3); margin-bottom: 10px; }
  .p-stats { display: flex; gap: 18px; padding: 0 22px 14px; border-bottom: 1px solid var(--border); }
  .p-stat { font-size: 12px; color: var(--ink3); }
  .p-stat strong { font-size: 14px; font-weight: 600; color: var(--ink); margin-right: 3px; }
  .p-socials { display: flex; gap: 6px; }
  .p-social { width: 28px; height: 28px; border-radius: 7px; background: var(--bg2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 12px; cursor: pointer; }
  .section-label { font-size: 9px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ink3); padding: 18px 22px 10px; }
  .h-scroll { display: flex; gap: 10px; padding: 0 22px; overflow-x: auto; scrollbar-width: none; }
  .h-scroll::-webkit-scrollbar { display: none; }
  .album-card { flex-shrink: 0; width: 82px; cursor: pointer; }
  .album-art { width: 82px; height: 82px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 26px; margin-bottom: 6px; border: 1px solid var(--border); }
  .album-title { font-size: 10px; font-weight: 600; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .album-artist { font-size: 9px; color: var(--ink3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px; }
  .cold-opens { padding: 4px 22px 16px; }
  .co-label { font-size: 9px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ink3); margin-bottom: 10px; padding-top: 14px; }
  .co-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .co-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 12px 11px; }
  .co-q { font-size: 9px; color: var(--ink3); margin-bottom: 6px; line-height: 1.5; font-weight: 500; }
  .co-a { font-family: 'Cormorant Garamond', serif; font-size: 13px; font-style: italic; color: var(--ink); line-height: 1.35; }

  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(28,25,23,0.55); z-index: 200; display: flex; align-items: flex-end; justify-content: center; backdrop-filter: blur(3px); }
  .modal { background: var(--bg); border-radius: 22px 22px 0 0; padding: 24px 24px 44px; width: 390px; border-top: 1px solid var(--border); }
  .modal-handle { width: 32px; height: 3px; background: var(--border); border-radius: 2px; margin: 0 auto 22px; }
  .modal h2 { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 300; font-style: italic; text-align: center; margin-bottom: 4px; }
  .modal-sub { font-size: 11px; color: var(--ink3); text-align: center; margin-bottom: 24px; letter-spacing: 0.05em; }
  .slot-display { background: var(--bg2); border: 1px solid var(--border); border-radius: 14px; padding: 26px 20px; text-align: center; margin-bottom: 16px; }
  .slot-art { font-size: 48px; margin-bottom: 12px; display: block; }
  .slot-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 400; color: var(--ink); margin-bottom: 4px; }
  .slot-artist { font-size: 12px; color: var(--ink3); }
  .spin-btn { width: 100%; background: var(--ink); color: var(--bg); border: none; border-radius: 12px; padding: 14px; font-family: 'Instrument Sans', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; cursor: pointer; }
  .spin-btn:disabled { opacity: 0.45; }
  .modal-close { display: block; width: 100%; background: none; border: none; color: var(--ink3); font-size: 12px; cursor: pointer; margin-top: 12px; padding: 8px; font-family: 'Instrument Sans', sans-serif; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
  .anim { animation: fadeUp 0.3s ease; }

  /* ── SHOWS SCREEN ── */
  .shows-header {
    position: sticky; top: 0; z-index: 50;
    background: color-mix(in srgb, var(--bg) 94%, transparent); backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border);
    padding: 52px 18px 14px;
    display: flex; justify-content: space-between; align-items: flex-end;
  }
  .shows-title { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 300; font-style: italic; line-height: 1; }
  .shows-sub { font-size: 10px; color: var(--ink3); font-weight: 500; letter-spacing: 0.06em; margin-top: 3px; }

  .checkin-banner {
    margin: 16px 18px 0;
    background: var(--ink); color: var(--bg);
    border-radius: 16px; padding: 16px 18px;
    display: flex; align-items: center; gap: 14px; cursor: pointer;
    transition: opacity 0.15s;
  }
  .checkin-banner:active { opacity: 0.85; }
  .checkin-icon { font-size: 28px; flex-shrink: 0; }
  .checkin-text h4 { font-family: 'Cormorant Garamond', serif; font-size: 16px; font-weight: 400; font-style: italic; margin-bottom: 3px; }
  .checkin-text p { font-size: 11px; opacity: 0.6; }
  .checkin-arrow { margin-left: auto; font-size: 16px; opacity: 0.4; }

  .shows-section-label {
    font-size: 9px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--ink3); padding: 20px 18px 10px;
  }

  .show-card {
    margin: 0 18px 12px;
    border: 1px solid var(--border); border-radius: 16px;
    overflow: hidden; cursor: pointer; transition: border-color 0.15s;
    background: var(--bg);
  }
  .show-card:hover { border-color: var(--ink2); }
  .show-card.checked-in { border-color: var(--ink); border-width: 1.5px; }

  .show-card-top {
    padding: 14px 16px 12px;
    display: flex; gap: 14px; align-items: flex-start;
  }
  .show-emoji { font-size: 36px; flex-shrink: 0; line-height: 1; }
  .show-info { flex: 1; min-width: 0; }
  .show-artist {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px; font-weight: 400; color: var(--ink);
    margin-bottom: 3px; line-height: 1.2;
  }
  .show-venue { font-size: 12px; color: var(--ink2); margin-bottom: 3px; }
  .show-date { font-size: 11px; color: var(--ink3); }
  .show-checkin-btn {
    flex-shrink: 0; align-self: center;
    border: 1.5px solid var(--border); background: var(--bg2);
    border-radius: 20px; padding: 7px 14px;
    font-family: 'Instrument Sans', sans-serif; font-size: 11px; font-weight: 600;
    color: var(--ink2); cursor: pointer; transition: all 0.15s; white-space: nowrap;
  }
  .show-checkin-btn.active { background: var(--ink); color: var(--bg); border-color: var(--ink); }

  .show-card-bottom {
    border-top: 1px solid var(--border);
    padding: 10px 16px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .show-attendees { display: flex; align-items: center; gap: 8px; }
  .attendee-faces { display: flex; }
  .attendee-face {
    width: 24px; height: 24px; border-radius: 50%;
    background: var(--bg3); border: 2px solid var(--bg);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; margin-left: -6px;
  }
  .attendee-face:first-child { margin-left: 0; }
  .attendee-count { font-size: 11px; color: var(--ink3); }
  .attendee-count strong { color: var(--ink2); font-weight: 600; }
  .show-see-all { font-size: 11px; color: var(--ink3); font-weight: 500; }

  /* ── SHOW DETAIL MODAL ── */
  .show-modal-overlay {
    position: fixed; inset: 0; background: rgba(28,25,23,0.55); z-index: 200;
    display: flex; align-items: flex-end; justify-content: center; backdrop-filter: blur(3px);
  }
  .show-modal {
    background: var(--bg); border-radius: 22px 22px 0 0;
    width: 390px; max-height: 82vh; overflow-y: auto;
    border-top: 1px solid var(--border);
    animation: fadeUp 0.25s ease;
  }
  .show-modal-handle { width: 32px; height: 3px; background: var(--border); border-radius: 2px; margin: 18px auto 0; }
  .show-modal-header {
    padding: 16px 22px 14px;
    border-bottom: 1px solid var(--border);
    display: flex; gap: 14px; align-items: center;
  }
  .show-modal-emoji { font-size: 42px; }
  .show-modal-info { flex: 1; }
  .show-modal-artist { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 400; margin-bottom: 3px; }
  .show-modal-meta { font-size: 12px; color: var(--ink3); line-height: 1.6; }
  .show-modal-checkin {
    width: calc(100% - 44px); margin: 14px 22px 0;
    background: var(--ink); color: var(--bg); border: none; border-radius: 12px;
    padding: 14px; font-family: 'Instrument Sans', sans-serif; font-size: 12px;
    font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer;
    transition: opacity 0.15s;
  }
  .show-modal-checkin.checked { background: var(--bg2); color: var(--ink2); border: 1.5px solid var(--border); }
  .show-modal-attendees-label {
    font-size: 9px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--ink3); padding: 18px 22px 10px;
  }
  .attendee-row {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 22px; border-bottom: 1px solid var(--border);
    cursor: pointer; transition: background 0.12s;
  }
  .attendee-row:hover { background: var(--bg2); }
  .attendee-row:last-child { border-bottom: none; margin-bottom: 32px; }
  .att-avatar {
    width: 40px; height: 40px; border-radius: 50%; background: var(--bg2);
    border: 1px solid var(--border); display: flex; align-items: center;
    justify-content: center; font-size: 19px; flex-shrink: 0;
  }
  .att-info { flex: 1; }
  .att-name { font-size: 13px; font-weight: 600; color: var(--ink); margin-bottom: 1px; }
  .att-handle { font-size: 11px; color: var(--ink3); }
  .att-compat { font-size: 11px; color: var(--ink2); font-weight: 600; }
  .att-connect {
    width: 30px; height: 30px; border-radius: 50%;
    background: var(--bg2); border: 1.5px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; cursor: pointer; color: var(--ink); flex-shrink: 0;
    transition: all 0.15s;
  }
  .att-connect.connected { background: var(--ink); color: var(--bg); border-color: var(--ink); }
  .show-modal-close {
    display: block; width: 100%; background: none; border: none;
    color: var(--ink3); font-size: 12px; cursor: pointer;
    padding: 14px; font-family: 'Instrument Sans', sans-serif;
  }

  /* ── SETTINGS SCREEN ── */
  .settings-header {
    position: sticky; top: 0; z-index: 50; width: 100%;
    background: color-mix(in srgb, var(--bg) 94%, transparent);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border);
    padding: 52px 18px 14px;
    display: flex; align-items: center; gap: 12px;
  }
  .settings-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px; font-weight: 300; font-style: italic; flex: 1;
  }
  .settings-section-label {
    font-size: 9px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--ink3); padding: 22px 22px 8px; width: 100%;
  }
  .settings-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 22px; border-bottom: 1px solid var(--border);
    background: var(--bg); width: 100%;
  }
  .settings-row-left { display: flex; flex-direction: column; gap: 3px; }
  .settings-row-label { font-size: 14px; font-weight: 600; color: var(--ink); }
  .settings-row-sub { font-size: 11px; color: var(--ink3); }

  /* Toggle switch */
  .toggle-wrap { position: relative; width: 48px; height: 28px; flex-shrink: 0; }
  .toggle-wrap input { opacity: 0; width: 0; height: 0; position: absolute; }
  .toggle-track {
    position: absolute; inset: 0; border-radius: 14px;
    background: var(--bg3); border: 1.5px solid var(--border);
    cursor: pointer; transition: background 0.22s, border-color 0.22s;
  }
  .toggle-wrap input:checked + .toggle-track {
    background: var(--ink); border-color: var(--ink);
  }
  .toggle-track::after {
    content: ''; position: absolute;
    top: 3px; left: 3px;
    width: 18px; height: 18px; border-radius: 50%;
    background: var(--bg3); border: 1px solid var(--border);
    transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), background 0.22s, border-color 0.22s;
  }
  .toggle-wrap input:checked + .toggle-track::after {
    transform: translateX(20px);
    background: var(--bg); border-color: var(--bg2);
  }
  .settings-icon-label { font-size: 18px; margin-bottom: 1px; }
`;

const slotSongs = [
  { emoji: "🎹", title: "Vienna", artist: "Billy Joel" },
  { emoji: "🌈", title: "Golden", artist: "Harry Styles" },
  { emoji: "🦋", title: "Shake It Out", artist: "Florence + The Machine" },
  { emoji: "🌙", title: "Lua", artist: "Bright Eyes" },
  { emoji: "🔮", title: "Retrograde", artist: "James Blake" },
  { emoji: "🎸", title: "The Less I Know", artist: "Tame Impala" },
  { emoji: "🕊️", title: "White Flag", artist: "Joseph" },
  { emoji: "🌿", title: "Motion Picture Soundtrack", artist: "Radiohead" },
];

const NOW_PLAYING_STORIES = [
  { id: 1, emoji: "🎵", name: "Maya", song: "Skinny Love", artist: "Bon Iver", active: true },
  { id: 2, emoji: "⚡", name: "Tyler", song: "HUMBLE.", artist: "Kendrick", active: true },
  { id: 3, emoji: "🌙", name: "Jordan", song: "Supermodel", artist: "SZA", active: true },
  { id: 4, emoji: "🎸", name: "Sam", song: "—", artist: "", active: false },
  { id: 5, emoji: "🌸", name: "Priya", song: "Spicy", artist: "aespa", active: true },
  { id: 6, emoji: "🎹", name: "Alex", song: "—", artist: "", active: false },
];

const INITIAL_POSTS = [
  { id: 1, emoji: "🎵", name: "Maya Chen", handle: "@mayatunes", time: "2m", text: "why does 'For Emma, Forever Ago' hit different at 2am? asking for a friend (the friend is me, it's always me)", nowPlaying: { emoji: "🪵", song: "Skinny Love", artist: "Bon Iver" }, likes: 42, replies: 8, reposts: 5, liked: false, playing: true },
  { id: 2, emoji: "⚡", name: "Tyler Fox", handle: "@tylerfox", time: "14m", text: "unpopular opinion: MBDTF is not even Kanye's best album. 808s changed the trajectory of pop music more than any other record this century. fight me", nowPlaying: null, likes: 118, replies: 34, reposts: 21, liked: false, playing: true },
  { id: 3, emoji: "🌙", name: "Jordan Lee", handle: "@jlee_music", time: "31m", text: "just got back from the SZA show and I am not okay. she played Supermodel and I physically left my body", nowPlaying: { emoji: "🌹", song: "Supermodel", artist: "SZA" }, likes: 207, replies: 19, reposts: 44, liked: false, playing: true },
  { id: 4, emoji: "🌸", name: "Priya Nair", handle: "@priyabeats", time: "1h", text: "the way a song can teleport you to a specific Tuesday afternoon in 2011 that you forgot existed until just now", nowPlaying: null, likes: 331, replies: 61, reposts: 88, liked: false, playing: false },
  { id: 5, emoji: "🎸", name: "Sam Rivera", handle: "@samriv", time: "2h", text: "opened a new vinyl shop on Sunset and they had an original pressing of 'Unknown Pleasures' behind the counter. did not buy it. still thinking about it.", nowPlaying: { emoji: "🖤", song: "She's Lost Control", artist: "Joy Division" }, likes: 56, replies: 12, reposts: 7, liked: false, playing: false },
  { id: 6, emoji: "🎹", name: "Alex Kim", handle: "@alexkbeats", time: "3h", text: "spent 4 hours on a 40 second loop. this is fine. music production is fine.", nowPlaying: null, likes: 94, replies: 23, reposts: 15, liked: false, playing: false },
];

const fans = [
  { emoji: "🎵", name: "Maya Chen", handle: "@mayatunes", tags: ["Alt-Pop", "Indie"], id: 1, bio: "Music is my love language. Always at a show, always making playlists nobody asked for.", compat: 91, cold: ["Lana's Born to Die", "St. Vincent", "Early 2000s emo", "Filthy Frank era, 2015"], topAlbums: [{emoji:"🌹",title:"NFR!",artist:"Lana Del Rey",bg:"#e8dde4"},{emoji:"🎸",title:"Illinois",artist:"Sufjan Stevens",bg:"#dde0e8"},{emoji:"🌿",title:"For Emma",artist:"Bon Iver",bg:"#dde8dd"},{emoji:"🌙",title:"Blue",artist:"Joni Mitchell",bg:"#dde4e8"}], playing: true, nowSong: "Skinny Love" },
  { emoji: "🌙", name: "Jordan Lee", handle: "@jlee_music", tags: ["R&B", "Soul"], id: 2, bio: "I will cry at any Stevie Wonder song, guaranteed. SZA changed my life twice.", compat: 78, cold: ["Ctrl — SZA", "Beyoncé's Lemonade", "90s neo-soul", "Drake phase (briefly)"], topAlbums: [{emoji:"🌊",title:"Ctrl",artist:"SZA",bg:"#e0e8e8"},{emoji:"💛",title:"Lemonade",artist:"Beyoncé",bg:"#e8e4d8"},{emoji:"🌸",title:"Blonde",artist:"Frank Ocean",bg:"#e8dde0"},{emoji:"🎷",title:"Kind of Blue",artist:"Miles Davis",bg:"#dde0e8"}], playing: true, nowSong: "Supermodel" },
  { emoji: "🎸", name: "Sam Rivera", handle: "@samriv", tags: ["Rock", "Punk"], id: 3, bio: "Venue rat. If there's a mosh pit, I'm in it. Dad rock is actually the best rock.", compat: 64, cold: ["London Calling", "Nevermind", "Mid-2000s post-punk", "Nickelback. I said it."], topAlbums: [{emoji:"🖤",title:"Unknown Pleasures",artist:"Joy Division",bg:"#e0e0e0"},{emoji:"⚡",title:"London Calling",artist:"The Clash",bg:"#e8e0d8"},{emoji:"🎸",title:"Nevermind",artist:"Nirvana",bg:"#d8e4e8"},{emoji:"🔥",title:"Is This It",artist:"The Strokes",bg:"#e8e0d8"}], playing: false, nowSong: null },
  { emoji: "🎹", name: "Alex Kim", handle: "@alexkbeats", tags: ["Electronic"], id: 4, bio: "Producer by night, barista by day. Everything sounds better at 2am.", compat: 85, cold: ["Boards of Canada — Geogaddi", "Burial's Untrue", "Ambient electronica", "EDM drop era"], topAlbums: [{emoji:"🌌",title:"Geogaddi",artist:"Boards of Canada",bg:"#e0dde8"},{emoji:"🌧",title:"Untrue",artist:"Burial",bg:"#d8dde4"},{emoji:"🔮",title:"Music Has the Right",artist:"Four Tet",bg:"#dde8e0"},{emoji:"🌊",title:"Selected Ambient",artist:"Brian Eno",bg:"#dde0e8"}], playing: true, nowSong: "Retrograde" },
  { emoji: "🌸", name: "Priya Nair", handle: "@priyabeats", tags: ["Pop", "K-Pop"], id: 5, bio: "Certified album-listener. Skip button is illegal in my household.", compat: 73, cold: ["MAMAMOO's Reality in Black", "Red Velvet — Perfect Velvet", "Early K-pop", "One Direction, unironically"], topAlbums: [{emoji:"🌺",title:"Reality in Black",artist:"MAMAMOO",bg:"#e8dde0"},{emoji:"🍒",title:"Perfect Velvet",artist:"Red Velvet",bg:"#e8d8d8"},{emoji:"🎀",title:"Midnights",artist:"Taylor Swift",bg:"#d8dde8"},{emoji:"✨",title:"Future Nostalgia",artist:"Dua Lipa",bg:"#dde8e4"}], playing: true, nowSong: "Spicy" },
  { emoji: "⚡", name: "Tyler Fox", handle: "@tylerfox", tags: ["Hip-Hop"], id: 6, bio: "I have an opinion about every Kanye album and yes I will share it.", compat: 88, cold: ["My Beautiful Dark Twisted Fantasy", "Illmatic", "Golden age hip-hop", "Mumble rap phase (short-lived)"], topAlbums: [{emoji:"🌌",title:"MBDTF",artist:"Kanye West",bg:"#e0dde8"},{emoji:"🔥",title:"Illmatic",artist:"Nas",bg:"#e8e0d8"},{emoji:"⚡",title:"Ready to Die",artist:"Notorious B.I.G.",bg:"#e4e0d8"},{emoji:"🎤",title:"Madvillainy",artist:"Madvillain",bg:"#dde0e4"}], playing: true, nowSong: "HUMBLE." },
];

const SHOWS = [
  {
    id: 1, emoji: "🌹", artist: "Sabrina Carpenter", venue: "Kia Forum, Inglewood", date: "Tonight · Doors 7pm", going: 3,
    attendees: [
      { id: 1, emoji: "🎵", name: "Maya Chen", handle: "@mayatunes", compat: 91 },
      { id: 5, emoji: "🌸", name: "Priya Nair", handle: "@priyabeats", compat: 73 },
      { id: 2, emoji: "🌙", name: "Jordan Lee", handle: "@jlee_music", compat: 78 },
    ]
  },
  {
    id: 2, emoji: "⚡", artist: "Kendrick Lamar", venue: "SoFi Stadium, Inglewood", date: "Sat May 24 · Doors 6pm", going: 5,
    attendees: [
      { id: 6, emoji: "⚡", name: "Tyler Fox", handle: "@tylerfox", compat: 88 },
      { id: 3, emoji: "🎸", name: "Sam Rivera", handle: "@samriv", compat: 64 },
      { id: 4, emoji: "🎹", name: "Alex Kim", handle: "@alexkbeats", compat: 85 },
      { id: 1, emoji: "🎵", name: "Maya Chen", handle: "@mayatunes", compat: 91 },
      { id: 2, emoji: "🌙", name: "Jordan Lee", handle: "@jlee_music", compat: 78 },
    ]
  },
  {
    id: 3, emoji: "🌌", artist: "Mitski", venue: "Hollywood Bowl, Los Angeles", date: "Fri May 30 · Doors 7:30pm", going: 2,
    attendees: [
      { id: 1, emoji: "🎵", name: "Maya Chen", handle: "@mayatunes", compat: 91 },
      { id: 5, emoji: "🌸", name: "Priya Nair", handle: "@priyabeats", compat: 73 },
    ]
  },
  {
    id: 4, emoji: "🎹", artist: "James Blake", venue: "The Wiltern, Los Angeles", date: "Tue Jun 3 · Doors 8pm", going: 1,
    attendees: [
      { id: 4, emoji: "🎹", name: "Alex Kim", handle: "@alexkbeats", compat: 85 },
    ]
  },
  {
    id: 5, emoji: "🌊", artist: "SZA", venue: "Crypto.com Arena, Los Angeles", date: "Sat Jun 7 · Doors 6:30pm", going: 4,
    attendees: [
      { id: 2, emoji: "🌙", name: "Jordan Lee", handle: "@jlee_music", compat: 78 },
      { id: 5, emoji: "🌸", name: "Priya Nair", handle: "@priyabeats", compat: 73 },
      { id: 6, emoji: "⚡", name: "Tyler Fox", handle: "@tylerfox", compat: 88 },
      { id: 1, emoji: "🎵", name: "Maya Chen", handle: "@mayatunes", compat: 91 },
    ]
  },
];

export default function TasteBuds() {
  const [screen, setScreen] = useState("home");
  const [feedTab, setFeedTab] = useState("for-you");
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [draft, setDraft] = useState("");
  const [slotOpen, setSlotOpen] = useState(false);
  const [currentSong, setCurrentSong] = useState(slotSongs[0]);
  const [spinning, setSpinning] = useState(false);
  const [connected, setConnected] = useState(new Set());
  const [selectedFan, setSelectedFan] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [checkedIn, setCheckedIn] = useState(new Set());
  const [selectedShow, setSelectedShow] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const toggleLike = id => setPosts(ps => ps.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));

  const submitPost = () => {
    if (!draft.trim()) return;
    setPosts(ps => [{ id: Date.now(), emoji: "🎧", name: "You", handle: "@yourusername", time: "now", text: draft.trim(), nowPlaying: null, likes: 0, replies: 0, reposts: 0, liked: false, playing: false }, ...ps]);
    setDraft("");
  };

  const spin = () => {
    setSpinning(true);
    let count = 0;
    const iv = setInterval(() => {
      setCurrentSong(slotSongs[Math.floor(Math.random() * slotSongs.length)]);
      if (++count > 9) { clearInterval(iv); setSpinning(false); }
    }, 110);
  };

  const toggleConnect = (id, e) => {
    e.stopPropagation();
    setConnected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const showTooltip = (story) => {
    if (!story.active) return;
    setTooltip(story);
    setTimeout(() => setTooltip(null), 2500);
  };

  const fmt = n => n >= 1000 ? (n / 1000).toFixed(1) + "k" : n;

  const toggleCheckin = (id, e) => {
    if (e) e.stopPropagation();
    setCheckedIn(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  return (
    <>
      <style>{css}</style>
      <div className={`app${darkMode ? " dark" : ""}`}>

        {/* ══ HOME FEED ══ */}
        {screen === "home" && (
          <div className="screen">
            <div className="feed-header">
              <div className="feed-header-top">
                <div className="wordmark">taste<span>buds</span></div>
                <div className="feed-header-icons">
                  <button className="icon-btn" onClick={() => setSlotOpen(true)}>🎰</button>
                  <button className="icon-btn">✉</button>
                </div>
              </div>
              <div className="feed-tabs">
                {["for-you", "following"].map(t => (
                  <button key={t} className={`feed-tab ${feedTab === t ? "active" : ""}`} onClick={() => setFeedTab(t)}>
                    {t === "for-you" ? "For You" : "Following"}
                  </button>
                ))}
              </div>
            </div>

            {/* ── NOW PLAYING STORIES — above compose ── */}
            <div className="now-playing-row">
              {NOW_PLAYING_STORIES.map(story => (
                <div className="np-story" key={story.id} onClick={() => showTooltip(story)}>
                  <div className="np-ring-wrap">
                    <div className={`np-ring ${story.active ? "active" : "inactive"}`}>
                      <div className="np-avatar-inner">{story.emoji}</div>
                    </div>
                    {story.active && <div className="np-badge">♫</div>}
                  </div>
                  <div className="np-name">{story.name}</div>
                  <div className="np-song">{story.active ? story.song : "—"}</div>
                </div>
              ))}
            </div>

            {/* ── COMPOSE ── */}
            <div className="compose-bar">
              <div className="compose-avatar">🎧</div>
              <div className="compose-right">
                <textarea className="compose-input" rows={2} placeholder="What are you listening to?" value={draft} onChange={e => setDraft(e.target.value)} />
                <div className="compose-actions">
                  <button className="compose-post-btn" onClick={submitPost}>Post</button>
                </div>
              </div>
            </div>

            <div className="divider" />

            {/* Posts */}
            {posts.map(post => (
              <div className="post" key={post.id}>
                <div className={`post-avatar-wrap ${post.playing ? "playing" : ""}`}>
                  <div className="post-avatar">{post.emoji}</div>
                  {post.playing && <div className="post-avatar-np">♫</div>}
                </div>
                <div className="post-body">
                  <div className="post-meta">
                    <span className="post-name">{post.name}</span>
                    <span className="post-handle">{post.handle}</span>
                    <span className="post-time">{post.time}</span>
                  </div>
                  <div className="post-text">{post.text}</div>
                  {post.nowPlaying && (
                    <div className="now-playing-pill">
                      <span className="pill-art">{post.nowPlaying.emoji}</span>
                      <div className="pill-text">
                        <div className="pill-song">{post.nowPlaying.song}</div>
                        <div className="pill-artist">{post.nowPlaying.artist}</div>
                      </div>
                      <span className="pill-wave">♫</span>
                    </div>
                  )}
                  <div className="post-actions">
                    <button className="action-btn"><span className="action-icon">💬</span>{fmt(post.replies)}</button>
                    <button className="action-btn"><span className="action-icon">🔁</span>{fmt(post.reposts)}</button>
                    <button className={`action-btn ${post.liked ? "liked" : ""}`} onClick={() => toggleLike(post.id)}>
                      <span className="action-icon">{post.liked ? "♥" : "♡"}</span>{fmt(post.likes)}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ FIND FANS ══ */}
        {screen === "fans" && (
          <div className="screen">
            <div className="fans-header">
              <div className="fans-title">Find Fans</div>
              <div className="header-icons">
                <button className="icon-btn">✉</button>
                <button className="icon-btn">⚙</button>
              </div>
            </div>
            <button className="find-btn">♪ &nbsp;Match by Listening Taste</button>
            <div className="fans-grid">
              {fans.map(fan => (
                <div className="fan-card" key={fan.id} onClick={() => { setSelectedFan(fan); setScreen("profile"); }}>
                  <div className={`fan-photo ${fan.playing ? "np-active" : ""}`}>
                    {fan.emoji}
                    {fan.playing && <div className="fan-np-badge">♫ live</div>}
                    <div className={`fan-add ${connected.has(fan.id) ? "connected" : ""}`} onClick={e => toggleConnect(fan.id, e)}>
                      {connected.has(fan.id) ? "✓" : "+"}
                    </div>
                  </div>
                  <div className="fan-name">{fan.name}</div>
                  <div className="fan-handle">{fan.handle}</div>
                  <div className="fan-tags">{fan.tags.map((t, i) => <span className="fan-tag" key={i}>{t}</span>)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ PROFILE ══ */}
        {screen === "profile" && selectedFan && (
          <div className="screen">
            <div className="profile-header">
              <button className="back-btn" onClick={() => setScreen("fans")}>←</button>
              <div className="header-icons">
                <button className="icon-btn">✉</button>
                <button className="icon-btn">⚙</button>
              </div>
            </div>
            <div className="profile-banner">Cover Photo</div>
            <div className="profile-avatar-row">
              <div className="p-avatar" style={selectedFan.playing ? { outline: "3px solid var(--ink2)", outlineOffset: "3px" } : {}}>
                {selectedFan.emoji}
              </div>
              <button className="p-follow-btn">{connected.has(selectedFan.id) ? "Following ✓" : "+ Follow"}</button>
            </div>
            {selectedFan.playing && (
              <div style={{ margin: "10px 22px 0", display: "flex", alignItems: "center", gap: 8, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: "8px 12px" }}>
                <span style={{ fontSize: 14, color: "var(--ink2)", animation: "pulse 1.2s infinite" }}>♫</span>
                <span style={{ fontSize: 12, color: "var(--ink2)" }}>Now playing <strong style={{ color: "var(--ink)" }}>{selectedFan.nowSong}</strong></span>
              </div>
            )}
            <div className="profile-info">
              <div className="pname">{selectedFan.name}, 24</div>
              <div className="phandle">{selectedFan.handle}</div>
              <div className="pbio">{selectedFan.bio}</div>
              <div className="pmeta">
                <span>📍 Los Angeles</span>
                <span>🎵 Spotify</span>
                <span>🏟 The Fonda</span>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div className="p-socials">
                  <div className="p-social">📸</div>
                  <div className="p-social">𝕏</div>
                </div>
              </div>
            </div>
            <div className="p-stats">
              <div className="p-stat"><strong>248</strong>Following</div>
              <div className="p-stat"><strong>1.4k</strong>Followers</div>
              <div className="p-stat" style={{ marginLeft: "auto", color: "var(--ink2)", fontWeight: 600, fontSize: 12 }}>{selectedFan.compat}% match ♫</div>
            </div>
            <div className="section-label">Top Albums</div>
            <div className="h-scroll">
              {selectedFan.topAlbums.map((a, i) => (
                <div className="album-card" key={i}>
                  <div className="album-art" style={{ background: a.bg }}>{a.emoji}</div>
                  <div className="album-title">{a.title}</div>
                  <div className="album-artist">{a.artist}</div>
                </div>
              ))}
            </div>
            <div className="cold-opens">
              <div className="co-label">Cold Opens</div>
              <div className="co-grid">
                {[["Album that's your whole personality?", selectedFan.cold[0]], ["Top album in 2014?", selectedFan.cold[1]], ["Favorite music era?", selectedFan.cold[2]], ["Worst music phase...", selectedFan.cold[3]]].map(([q, a], i) => (
                  <div className="co-card" key={i}><div className="co-q">{q}</div><div className="co-a">{a}</div></div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ MY PROFILE ══ */}
        {screen === "myprofile" && (
          <div className="screen">
            <div className="profile-header">
              <div style={{ width: 34 }} />
              <div className="header-icons">
                <button className="icon-btn">✉</button>
                <button className="icon-btn" onClick={() => setScreen("settings")}>⚙</button>
              </div>
            </div>
            <div className="profile-banner">Cover Photo</div>
            <div className="profile-avatar-row">
              <div className="p-avatar">🎧</div>
              <button className="p-follow-btn">Edit Profile</button>
            </div>
            <div className="profile-info">
              <div className="pname">Your Name, 22</div>
              <div className="phandle">@yourusername</div>
              <div className="pbio">Your bio — what does music mean to you?</div>
              <div className="pmeta"><span>📍 Los Angeles</span><span>🎵 Spotify</span><span>🏟 Set home venue</span></div>
            </div>
            <div className="p-stats">
              <div className="p-stat"><strong>0</strong>Following</div>
              <div className="p-stat"><strong>0</strong>Followers</div>
            </div>
            <div className="section-label">Top Albums</div>
            <div className="h-scroll">
              <div className="album-card" style={{ opacity: 0.6 }}>
                <div className="album-art" style={{ background: "var(--bg3)", border: "1.5px dashed var(--border)" }}>＋</div>
                <div className="album-title">Connect Spotify</div>
                <div className="album-artist">to populate</div>
              </div>
            </div>
            <div className="cold-opens">
              <div className="co-label">Cold Opens</div>
              <div className="co-grid">
                {["Album that's your whole personality?", "Top album in 2014?", "Favorite music era?", "Worst music phase..."].map((q, i) => (
                  <div className="co-card" key={i} style={{ cursor: "pointer", borderStyle: "dashed" }}>
                    <div className="co-q">{q}</div>
                    <div className="co-a" style={{ color: "var(--ink3)", fontSize: 12 }}>Tap to answer →</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ SHOWS ══ */}
        {screen === "shows" && (
          <div className="screen">
            <div className="shows-header">
              <div>
                <div className="shows-title">Shows</div>
                <div className="shows-sub">Find fans at upcoming concerts</div>
              </div>
              <button className="icon-btn">⚙</button>
            </div>

            <div className="checkin-banner" onClick={() => {}}>
              <span className="checkin-icon">📍</span>
              <div className="checkin-text">
                <h4>Check in to a show</h4>
                <p>Let fans at the same event find you</p>
              </div>
              <span className="checkin-arrow">→</span>
            </div>

            <div className="shows-section-label">Near You · Los Angeles</div>

            {SHOWS.map(show => {
              const isIn = checkedIn.has(show.id);
              const displayCount = show.going + (isIn ? 1 : 0);
              return (
                <div className={`show-card ${isIn ? "checked-in" : ""}`} key={show.id} onClick={() => setSelectedShow(show)}>
                  <div className="show-card-top">
                    <div className="show-emoji">{show.emoji}</div>
                    <div className="show-info">
                      <div className="show-artist">{show.artist}</div>
                      <div className="show-venue">{show.venue}</div>
                      <div className="show-date">{show.date}</div>
                    </div>
                    <button
                      className={`show-checkin-btn ${isIn ? "active" : ""}`}
                      onClick={e => toggleCheckin(show.id, e)}
                    >
                      {isIn ? "✓ Going" : "I'm Going"}
                    </button>
                  </div>
                  <div className="show-card-bottom">
                    <div className="show-attendees">
                      <div className="attendee-faces">
                        {show.attendees.slice(0, 4).map((a, i) => (
                          <div className="attendee-face" key={i}>{a.emoji}</div>
                        ))}
                        {isIn && <div className="attendee-face">🎧</div>}
                      </div>
                      <div className="attendee-count">
                        <strong>{displayCount} fan{displayCount !== 1 ? "s" : ""}</strong> going
                      </div>
                    </div>
                    <div className="show-see-all">See all →</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══ SETTINGS ══ */}
        {/* Settings and related functionality authored by Ethan Buttram 5/26/2026*/}
        {screen === "settings" && (
          <div className="screen">
            <div className="settings-header">
              <button className="back-btn" onClick={() => setScreen("myprofile")}>←</button>
              <div className="settings-title">Settings</div>
            </div>

            <div className="settings-section-label">Appearance</div>

            <div className="settings-row">
              <div className="settings-row-left">
                <div className="settings-icon-label">{darkMode ? "🌙" : "☀️"}</div>
                <div className="settings-row-label">Dark Mode</div>
                <div className="settings-row-sub">{darkMode ? "Switch to light mode" : "Switch to dark mode"}</div>
              </div>
              <label className="toggle-wrap">
                <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(d => !d)} />
                <span className="toggle-track" />
              </label>
            </div>
          </div>
        )}

        {/* NAV */}
        <nav className="bottom-nav">
          <button className={`nav-btn ${screen === "home" ? "active" : ""}`} onClick={() => setScreen("home")}>
            <span className="nav-icon">⌂</span><span>Home</span>
          </button>
          <button className={`nav-btn ${screen === "fans" || screen === "profile" ? "active" : ""}`} onClick={() => setScreen("fans")}>
            <span className="nav-icon">◎</span><span>Find Fans</span>
          </button>
          <button className={`nav-btn ${screen === "shows" ? "active" : ""}`} onClick={() => setScreen("shows")}>
            <span className="nav-icon">🎟</span><span>Shows</span>
          </button>
          <button className={`nav-btn ${screen === "myprofile" || screen === "settings" ? "active" : ""}`} onClick={() => setScreen("myprofile")}>
            <span className="nav-icon">◉</span><span>Profile</span>
          </button>
        </nav>

        {/* SHOW DETAIL MODAL */}
        {selectedShow && (
          <div className="show-modal-overlay" onClick={() => setSelectedShow(null)}>
            <div className="show-modal" onClick={e => e.stopPropagation()}>
              <div className="show-modal-handle" />
              <div className="show-modal-header">
                <div className="show-modal-emoji">{selectedShow.emoji}</div>
                <div className="show-modal-info">
                  <div className="show-modal-artist">{selectedShow.artist}</div>
                  <div className="show-modal-meta">
                    {selectedShow.venue}<br />
                    {selectedShow.date}
                  </div>
                </div>
              </div>
              <button
                className={`show-modal-checkin ${checkedIn.has(selectedShow.id) ? "checked" : ""}`}
                onClick={() => toggleCheckin(selectedShow.id, null)}
              >
                {checkedIn.has(selectedShow.id) ? "✓  You're checked in" : "📍  Check In — I'm Going"}
              </button>
              <div className="show-modal-attendees-label">
                {selectedShow.going + (checkedIn.has(selectedShow.id) ? 1 : 0)} fans going
              </div>
              {checkedIn.has(selectedShow.id) && (
                <div className="attendee-row">
                  <div className="att-avatar">🎧</div>
                  <div className="att-info">
                    <div className="att-name">You</div>
                    <div className="att-handle">@yourusername</div>
                  </div>
                  <div className="att-compat">You!</div>
                </div>
              )}
              {selectedShow.attendees.map((att, i) => (
                <div className="attendee-row" key={i} onClick={() => { const f = fans.find(f => f.id === att.id); if (f) { setSelectedFan(f); setSelectedShow(null); setScreen("profile"); } }}>
                  <div className="att-avatar">{att.emoji}</div>
                  <div className="att-info">
                    <div className="att-name">{att.name}</div>
                    <div className="att-handle">{att.handle}</div>
                  </div>
                  <div className="att-compat">{att.compat}% match</div>
                  <div
                    className={`att-connect ${connected.has(att.id) ? "connected" : ""}`}
                    onClick={e => { e.stopPropagation(); toggleConnect(att.id, e); }}
                  >
                    {connected.has(att.id) ? "✓" : "+"}
                  </div>
                </div>
              ))}
              <button className="show-modal-close" onClick={() => setSelectedShow(null)}>Close</button>
            </div>
          </div>
        )}

        {/* SLOT MODAL */}
        {slotOpen && (
          <div className="modal-overlay" onClick={() => setSlotOpen(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-handle" />
              <h2>Today's Spin</h2>
              <div className="modal-sub">Let the universe decide</div>
              <div className="slot-display">
                <span className={`slot-art ${spinning ? "anim" : ""}`}>{currentSong.emoji}</span>
                <div className={`slot-title ${spinning ? "anim" : ""}`}>{currentSong.title}</div>
                <div className="slot-artist">{currentSong.artist}</div>
              </div>
              <button className="spin-btn" onClick={spin} disabled={spinning}>{spinning ? "Spinning..." : "↺  Spin Again"}</button>
              <button className="modal-close" onClick={() => setSlotOpen(false)}>Dismiss</button>
            </div>
          </div>
        )}

        {/* NOW PLAYING TOOLTIP */}
        {tooltip && (
          <div className="np-tooltip">
            <strong>{tooltip.name}</strong><span>·</span>{tooltip.song} — {tooltip.artist}
          </div>
        )}

      </div>
    </>
  );
}