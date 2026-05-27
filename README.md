# TasteBuds

A music-social app prototype built as a single self-contained React component. TasteBuds lets you share what you're listening to, find fans with similar taste, and connect with people going to the same shows.

> **This is a frontend prototype / design mock.** All data is static and in-memory. There is no backend, authentication, or real Spotify integration.

---

## Overview

TasteBuds combines a social feed, a fan discovery grid, concert check-ins, and user profiles into a mobile-first (390px) single-page experience — all in one `.jsx` file.

**Core concept:** music taste as social identity. Every profile surface — top albums, genre tags, "Cold Opens" Q&As, now-playing status — is designed to spark conversation between fans.

---

## Features

### Home Feed
- Chronological posts from other users, with an optional "now playing" pill showing what they're listening to
- "For You" / "Following" tab toggle
- Compose bar to write and post your own update
- Horizontal "Now Playing Stories" row showing friends' currently playing tracks (tap for a tooltip)
- 🎰 "Today's Spin" slot machine — randomly surfaces a song recommendation

### Find Fans
- 3-column grid of nearby fans with genre tags and compatibility scores
- "Now listening" badge on active listeners
- One-tap follow / connect toggle, reflected consistently across all screens

### Shows
- Upcoming concerts near you with venue, date, and ticket info
- Check in to a show to appear in the attendee list
- Tap a show to open a detail modal listing all fans going, with compatibility scores
- Connect with attendees directly from the show modal; tapping an attendee opens their full profile

### Profiles
- Fan profiles with cover photo, avatar, bio, location, and social links
- Top Albums shelf (horizontal scroll)
- "Cold Opens" — a 2×2 grid of icebreaker Q&As about music history and taste
- Music compatibility percentage shown relative to your own taste
- Your own profile (My Profile tab) with empty-state prompts to connect Spotify

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React (hooks only, no class components) |
| State | `useState` — no external state library |
| Styling | CSS-in-JS via injected `<style>` tag with CSS custom properties |
| Typography | Google Fonts — Cormorant Garamond + Instrument Sans |
| Data | Static in-memory constants (no API calls) |
| Routing | Conditional rendering (`screen` state variable) |

---

## Project Structure

The entire app lives in `tastebuds.jsx` and is organized into six logical sections:

```
tastebuds.jsx
├── FONTS + CSS          Design system: tokens, typography, all component styles, animations
├── Static Data          slotSongs, NOW_PLAYING_STORIES, INITIAL_POSTS, fans, SHOWS
├── TasteBuds()
│   ├── useState hooks   screen, posts, draft, connected, checkedIn, selectedFan, selectedShow, ...
│   ├── Handlers         toggleLike, submitPost, spin, toggleConnect, showTooltip, toggleCheckin
│   └── JSX Return
│       ├── Home Screen  Feed header, stories row, compose bar, post list
│       ├── Fans Screen  Discovery grid with connect buttons
│       ├── Profile      Fan detail view (navigated from fans grid or show modal)
│       ├── My Profile   Logged-in user's own profile
│       ├── Shows        Concert listings with check-in
│       ├── Bottom Nav   Persistent tab bar (all screens)
│       ├── Show Modal   Slide-up attendee detail sheet
│       ├── Slot Modal   "Today's Spin" song randomizer
│       └── NP Tooltip   Floating "now playing" overlay
```

---

## Getting Started

This component is designed to run in any React environment.

### With Create React App or Vite

```bash
# Install dependencies (if you don't have a React project already)
npm create vite@latest tastebuds -- --template react
cd tastebuds
npm install

# Drop tastebuds.jsx into src/, then update src/main.jsx:
```

```jsx
// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import TasteBuds from './tastebuds'

ReactDOM.createRoot(document.getElementById('root')).render(<TasteBuds />)
```

```bash
npm run dev
```

### As a Claude Artifact

Paste the full file contents into a Claude React artifact and it will render immediately with no configuration.

---

## Design System

All visual variables are defined as CSS custom properties at the top of the CSS block:

```css
:root {
  --bg:      #f0f0f0;   /* page background */
  --bg2:     #e6e6e6;   /* subtle surface */
  --bg3:     #dcdcdc;   /* deeper surface */
  --border:  #cccccc;   /* dividers / outlines */
  --ink:     #111111;   /* primary text */
  --ink2:    #444444;   /* secondary text */
  --ink3:    #888888;   /* muted / placeholder text */
  --accent:  #b50063;   /* brand pink — wordmark highlight */
}
```

To retheme the app, change these eight values.

Typography uses two faces:
- **Cormorant Garamond** (serif, italic) — editorial headings, screen titles, artist names
- **Instrument Sans** (sans-serif) — all UI text, buttons, metadata

---

## Data Model

Each major data type and its shape:

**Post**
```js
{ id, emoji, name, handle, time, text, nowPlaying: { emoji, song, artist } | null,
  likes, replies, reposts, liked, playing }
```

**Fan**
```js
{ id, emoji, name, handle, tags, bio, compat, cold: [4 strings],
  topAlbums: [{ emoji, title, artist, bg }], playing, nowSong }
```

**Show**
```js
{ id, emoji, artist, venue, date, going,
  attendees: [{ id, emoji, name, handle, compat }] }
```

Fan `id` values are shared with show `attendees[].id`, enabling cross-screen navigation from a show attendee directly to their fan profile.

---

## Extending the Prototype

Some natural next steps if you want to wire this up further:

- **Spotify Web API** — replace `fans[].nowSong` and `INITIAL_POSTS[].nowPlaying` with real listening data via the [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- **Backend / Auth** — swap `INITIAL_POSTS` and `fans` for API calls; replace `connected` / `checkedIn` Sets with persisted user state
- **Real routing** — replace the `screen` state variable with React Router for shareable URLs
- **Ticketing integration** — connect `SHOWS` to a live events API (Ticketmaster, Songkick)
- **Notifications** — the ✉ icon buttons are currently inert; could open a messages/notifications panel

---

## License

This is a prototype / concept demo. Use freely for personal or educational purposes.

README generated by Claude Sonnet 4.6
v1.0 5/26/2026