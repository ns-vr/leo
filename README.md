# Welcome to Leo

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID
## App prototype-
- Version1:https://ai.studio/apps/drive/1CEnlg1zxeVYIXmAhh3nhi73aVSbkrtft?fullscreenApplet=true
- Version 2:https://neon-street-design.lovable.app
- Version3:https://tempo-deployment-2e4f2497-1cd5-43c4-ab95-35ec84cc02b-3lnps4ozn.vercel.app/

## Summary
Leo is a mobile-first street art merchandise platform that fuses AI-powered design tools with real commerce, social watch parties, and curated hype playlists. Built for Gen Z streetwear enthusiasts and urban creators, it transforms users into designers who can customize neon-graffiti jackets and audio-enabled keychains, purchase merch with integrated payments, and vibe together in live watch parties—all wrapped in a dark, neon-soaked graffiti aesthetic that screams underground culture.

## Design Archetype
Neo-Brutalism meets Cyberpunk Street
Raw, high-contrast neon borders on deep black (#0A0A0A), thick glowing outlines, clashing electric accents (green #00FF41, blue #00D4FF, yellow #FFFF00, pink #FF00FF), spray-paint textures, sticker overlays, and animated graffiti tags. This archetype channels underground hype culture with tactile, ugly-cool energy—perfect for youth-driven fashion and AI-generated street art.

## Visual Direction:- 
## Color & Atmosphere
The entire app lives in a deep, tinted black (#0A0A0A) that feels like midnight streets under neon signs. Electric neon accents dominate: green (#00FF41) for primary actions, blue (#00D4FF) for links/info, yellow (#FFFF00) for warnings/highlights, pink (#FF00FF) for errors/special states. Every interactive element glows with CSS text-shadow and box-shadow to simulate neon tube lighting. Background textures include subtle spray-paint noise, brick wall patterns, and animated particle systems (react-native-particles) that drift across screens like urban dust.
## Typography
Display text uses Bangers from Google Fonts—a bold, comic-style graffiti typeface that screams street culture. For body text and UI labels, fall back to JetBrains Mono or Space Mono (technical monospace with edge) to maintain readability while keeping the cyberpunk vibe. Extreme weight contrast: ultra-bold (800/900) for headings with neon glow, lighter weights (300/400) for secondary text. Scale jumps are dramatic—hero text at 48-64px, body at 14-16px.
## Motion & Choreography
Every screen entrance is choreographed: elements stagger in with 50-100ms delays, cards lift on hover with subtle scale (1.02x), buttons respond with haptic feedback and neon pulse animations. The splash screen features a Lottie animation of the Leo logo being spray-painted in real-time with neon drips. Parallax scrolling on Home creates depth as stickers move at different speeds. Particle effects burst on sticker taps in mini-games. Stripe checkout success triggers confetti with neon colors. All transitions use easing curves (ease-out-cubic) for smooth, premium feel—never linear or janky.
## Layout & Composition
Layouts embrace asymmetry and raw energy. The Home hero carousel breaks the grid with diagonal overlays and rotated sticker elements. Dashboard uses a neon-bordered Bento grid with unequal card sizes—featured items are 2x larger. Forms (auth, checkout) sit on spray-painted brick textures with thick neon input borders that glow on focus. The AI chat uses speech bubbles with jagged edges and drop shadows. Profile galleries display thumbnails in a masonry grid with neon separators. Bottom tab navigation has thick underlines for active states, not subtle icons. Whitespace is minimal but intentional—elements breathe just enough to avoid claustrophobia while maintaining high-energy density.
## Texture & Depth
Avoid flat colors. Every surface has subtle noise texture (spray-paint grain). Cards have inner shadows and outer neon glows to simulate layered stickers on walls. The AI design tool preview uses a mockup of a physical hoodie with fabric wrinkles and lighting to ground digital designs in reality. QR codes on keychains sit on glossy acrylic mockups with reflections. Watch party video feeds have scanline overlays for a VHS-cyberpunk aesthetic. Storage upload progress bars fill with animated neon liquid effects.
## Iconography
Use lucide-react-native icons but customize with neon stroke colors and glow effects. Shopping cart, user profile, chat bubbles, play buttons—all outlined in electric green/blue with 2px stroke weight. Custom icons for stickers (spray can, hoodie silhouette, keychain) drawn in a rough, hand-sketched style to match graffiti energy.
## Accessibility
High contrast neon on deep black ensures readability. All interactive elements have minimum 44x44px touch targets. VoiceOver labels describe neon effects semantically ("Green glowing Buy Now button"). Color is never the only indicator—icons and text labels accompany all states. Animations respect prefers-reduced-motion with fallback to simple fades.
##Key Components
- Splash/Onboarding: Animated Leo graffiti logo with neon spray-paint reveal effect, tagline overlay
- Home Screen: Parallax scrolling background with animated sticker elements (hoodies, keychains) trailing neon particles, hero carousel showcasing AI-generated designs, prominent neon-glowing CTA buttons for auth, mini-game sticker tap zones with particle burst feedback
- Auth Screens (Login/Signup): Spray-paint form overlays on brick-wall texture, neon input fields with glow-on-focus states, social auth buttons (Google/Apple), error toasts in pink/yellow
- Bottom Tab Navigation: Persistent across Home, Dashboard, Chat with neon active state indicators
- Dashboard (Tabbed Interface): Three main tabs—Merch, Custom, AI Tools—each with neon grid layouts resembling street vendor stalls

**Merch Section (3 Sub-tabs):**

- Clothes: Scrollable neon cards with hoodie/jacket images, prices, "BUY NOW" buttons, custom jacket sub-flow with image upload and AI overlay generation
- Playlists: Embedded Spotify player for specific hype playlist (6q9mNqQgNJAdKQ3cNycERT), neon player controls, tracklist cards
- Keychains: Gallery of designs, custom keychain builder (image upload → AI neonify → audio record → QR generate → mockup preview → order form)
- AI Chatbox: Floating bubble accessible from all screens, full-screen tab view with graffiti speech bubbles, neon typing indicators, context-aware assistance for design/playlists/troubleshooting
- AI Image-to-Design Tool: Image picker interface, Gemini API integration for neon graffiti transformation, preview carousel with download/share actions
- Profile Screen: Avatar with AI neon filter, saved designs gallery (from Storage), order history list, game points display, reorder buttons
- Stripe Checkout Flow: Payment sheet modal with card input, test mode indicators, success confetti animation, receipt email trigger
- Watch Parties (YOUR WORDS): Stream Video SDK integration, live/VOD player, participant grid, chat overlay, saved party history
- File Storage UI: Upload progress bars (neon), thumbnail grids for designs/audio/videos, delete actions with confirmation
  
## Core Interactions

- Onboarding Flow: Splash animation → Home exploration (guest mode) → Auth prompt on save/purchase actions
- Authentication: Email/password signup with 6+ char validation, forgot password reset flow, persistent login via Firebase Auth, protected routes requiring authentication
- Custom Jacket Creation: Upload photo → AI generates neon design overlay (Gemini API) → preview mockup → save to Storage → add to cart → Stripe checkout → order saved to Firestore
- Custom Keychain Creation: Upload image → AI neonification → record audio (react-native-audio-recorder-player) → generate QR code linking to Storage audio URL → preview keychain mockup (image + QR) → order form → Stripe payment → order persistence
- Merch Purchase: Browse cards → tap "BUY NOW" → cart review → Stripe PaymentSheet → payment intent creation (Firebase Functions backend) → success animation → order saved with receipt
- AI Chat Assistance: Floating bubble tap → full chat interface → text/voice input → Gemini responses with street slang → actionable outputs (design previews, playlist links, QR codes) → history saved to Firestore
- Spotify Playlist Integration: Navigate to Playlists tab → authenticate Spotify SDK → play specific playlist (6q9mNqQgNJAdKQ3cNycERT) → neon player controls → tracklist display with neon cards
- Watch Party Creation: Create party → invite link generation → Stream Video SDK room → live video/chat → record VOD → save to Storage → party history in profile
- Profile Management: View saved designs/audio/videos from Storage → reorder previous purchases → edit avatar with AI neon filter → track game points from mini-games
- Mini-Games: Tap flying stickers for particle burst feedback and points, shake device for random design reveal with animation
- File Management: Upload designs/audio/videos to Firebase Storage → progress indicators → public URL generation for QR codes → delete with confirmation modals
  
## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:



**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
