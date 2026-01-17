Plan: Ludo Game - Multi-Player & AI Features
TL;DR
Implement a game mode selection screen (Home screen) with 3 game modes: Quick Play (2-4 players), AI Mode (Play vs Computer), and Online Rooms (Join/Create rooms with unique IDs). Each mode requires a player setup screen, different game logic (AI or multiplayer), and a room management system.

Steps
1. Create Home/Landing Screen Component

Add src/components/Home/HomePage.tsx with 3 mode cards:
🎮 Quick Play (Local 2-4 players)
🤖 Play vs Computer (You + AI)
🌐 Online Rooms (Create/Join rooms)
Add navigation state to App.tsx to show HomePage or GamePage
2. Create Player Setup Screen

Add src/components/Setup/PlayerSetupScreen.tsx
Allow user to select 2, 3, or 4 players for Quick Play
Show player selection as blocks/cards (like Ludo King)
For AI mode: only 2 players (Human + 1 AI with difficulty option)
Pass selected players to game state
3. Extend GameContext for Multiple Modes

Update GameContext.tsx:
Add gameMode: 'QUICK_PLAY' | 'AI' | 'ONLINE'
Add activePlayers: PlayerColor[] (only 2-4 instead of always 4)
Add aiPlayers: { [key in PlayerColor]?: AIConfig } for AI settings
Add roomId?: string and roomCode?: string for online mode
4. Implement AI Player Logic

Create src/hooks/useAILogics.ts:
getAIMove(gameState) → returns best token to move
evaluateMove(token, diceValue) → score based on strategy
Support difficulty levels: EASY, MEDIUM, HARD
Integrate into useGameLogics.ts to auto-roll & move for AI players
5. Create Room Management System

Add src/components/Online/RoomSetup.tsx:
Generate unique room ID (${Date.now()}-${Math.random()} format)
Copy-to-clipboard shareable link
Show join room form (paste room ID)
Create src/services/roomService.ts:
Store room data (players, game state, createdAt)
Use localStorage or a backend API (Firebase/Supabase recommended)
6. Add Room Join Flow

Modify App.tsx to handle room URL params (?room=ABC123)
Auto-load room if URL has room ID
Show waiting screen until all players join
Sync game state across players (needs real-time sync via WebSocket/Firebase)
7. Update Game Display Logic

Modify App.tsx to:
Only render player cards for activePlayers
Show AI indicator badge for AI players
Show room info (ID, players joined) in online mode
8. Add Real-Time Sync (Online Mode)

Integrate Firebase Realtime DB or Supabase:
Sync dice rolls, moves, game state across players
Handle disconnections gracefully
Or use WebSocket server for live multiplayer
Further Considerations
Player Selection UI – Design attractive player blocks. Should have name input, color picker, or auto-assign colors?

AI Difficulty – EASY (random moves), MEDIUM (avoid capture), HARD (strategic play + capture threats)?

Room Persistence – Keep rooms alive for 24h? Auto-cleanup? How long should players have to rejoin?

Online Backend – Use Firebase (easiest), Supabase (PostgreSQL), or custom Node server? Each has trade-offs.

Mobile Friendly – UI needs responsive design for small screens, especially for room code display & QR code scanning?

Game State Filtering – In online mode, should a player see other players' token positions before they move? Or only after turn ends?
