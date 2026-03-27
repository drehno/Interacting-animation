# 🌊 Cross-Tab Interactive Animation

An interactive particle animation system that synchronizes across multiple browser tabs using localStorage and **window position awareness**. Watch as particles from different tabs interact with each other in real-time, and see them flow seamlessly between windows when you move them close together on your screen!

## ✨ Features

- **Window Position Awareness**: The system tracks the physical position of each browser window on your screen
- **Cross-Window Particle Flow**: Particles can flow between browser windows when they're aligned side-by-side
- **Screen-Space Interaction**: Particles from different tabs attract each other based on their actual screen positions
- **Portal Effects**: Glowing cyan portal effects appear at window edges when windows are aligned
- **Real-time Synchronization**: All window positions and particle data sync via localStorage
- **Interactive Controls**: Click, drag, or tap to create particles
- **Visual Connections**: See glowing connections between particles, with golden highlights for cross-window connections
- **Unique Tab Colors**: Each tab gets its own color scheme for easy identification
- **Smooth Physics**: Realistic particle motion with gravity, friction, and cross-window attraction

## 🚀 How to Use

1. **Open the Application**:
   - Open `index.html` in your web browser
   - Or use a local server: `python -m http.server 8000` or `npx serve`

2. **Create Particles**:
   - **Click** anywhere on the canvas to spawn particles
   - **Click and drag** to create a stream of particles
   - Use the **"Random Burst"** button to create particles at a random location

3. **Experience Cross-Window Interaction**:
   - Open the same page in **multiple browser tabs** (Ctrl+T / Cmd+T)
   - **Arrange the windows side by side** on your screen (this is key!)
   - **Move the windows close together** until their edges are nearly touching
   - Watch the **cyan portal effect** appear at aligned edges
   - See particles **flow seamlessly** between windows!
   - Particles attract each other based on their **actual screen position**
   - **Move a window** and watch particles react in real-time!
   - Connections between particles from different windows glow with a **golden color**

4. **Controls**:
   - **Clear Particles**: Remove all particles from the current tab
   - **Random Burst**: Create a burst of particles at a random location

## 🎨 How It Works

### Window Position Tracking

The system tracks the physical position of each browser window on your screen:

1. Each window's `screenX` and `screenY` coordinates are tracked 10 times per second
2. Window dimensions (width/height) are also monitored
3. This data is shared across all tabs via localStorage
4. Each tab can calculate which other windows are adjacent based on screen coordinates
5. When windows are aligned (within 20px), they're considered "connected"

### localStorage Synchronization

The application uses the browser's localStorage API to sync all data across tabs:

1. Each tab has a unique ID
2. Every tab writes its **window position** and **particle data** to localStorage ~20 times per second
3. Other tabs poll localStorage ~10 times per second to get updates
4. The system detects adjacent windows and enables cross-window particle flow

### Screen-Space Physics

Particles interact based on their **actual screen position**, not just window-local coordinates:

- **Screen-Space Coordinates**: Each particle's position is converted to screen coordinates (window position + local position)
- **Cross-Window Attraction**: Particles from different windows attract each other when within 200px in screen space
- **Particle Flow**: When a particle reaches an edge adjacent to another window, it can flow into that window
- **Velocity & Friction**: Particles move with momentum and gradually slow down
- **Gravity**: Subtle downward force affects all particles
- **Smart Edge Bouncing**: Particles only bounce if there's no adjacent window; otherwise they can pass through
- **Lifetime**: Particles fade out over 5 seconds

### Visual Effects

- **Glow**: Each particle has a radial gradient glow in its tab's color
- **Connections**: Lines connect nearby particles (within 150px in screen space)
- **Golden Cross-Window Links**: Connections between particles from different windows glow golden
- **Portal Effects**: Cyan glowing gradients appear at window edges when windows are aligned
- **Fade Trail**: Canvas slowly fades, creating smooth motion trails
- **Remote Particle Rendering**: Particles from adjacent windows are visible when near the edge

## 🛠️ Technical Details

- **Pure JavaScript**: No frameworks required
- **Canvas API**: High-performance rendering using HTML5 Canvas
- **localStorage Events**: Real-time cross-tab communication
- **Responsive**: Adapts to any screen size
- **Touch Support**: Works on mobile devices

## 🎯 Tips for Best Experience

- **Open 2-4 windows** (not just tabs - separate browser windows!) for optimal interaction
- **Arrange windows side by side** with edges nearly touching (within 20px)
- **Look for the cyan portal glow** at edges - this indicates windows are connected
- **Create particles near the edge** of one window and watch them flow to the adjacent window
- **Move windows around** while particles are active to see real-time attraction/repulsion
- Try **creating particles in one window** and watch them get pulled into an adjacent window
- The **golden connection lines** show cross-window particle interactions
- Works with windows arranged **horizontally, vertically, or in a grid**
- For best effect, use **similar-sized windows** aligned at the edges

## 🔧 Browser Compatibility

Works in all modern browsers that support:
- HTML5 Canvas
- localStorage
- Storage events

Tested on:
- Chrome/Edge
- Firefox
- Safari

## 📝 License

MIT License - Feel free to use and modify!

## 🌟 Ideas for Extension

- Add different particle types (repulsion, neutral, attraction)
- Implement WebSocket or WebRTC for network synchronization across devices
- Add audio reactive features
- Create particle emitters with different shapes
- Add background music synchronized to particle motion
- Implement replay/recording functionality
