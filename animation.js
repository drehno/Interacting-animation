// Cross-Tab Draggable Particle Ball with Aura Combining
class CrossTabAnimation {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.tabId = this.generateTabId();
        this.remoteBalls = new Map(); // Ball data from other tabs

        // Window position tracking
        this.windowPos = {
            screenX: window.screenX,
            screenY: window.screenY,
            width: window.innerWidth,
            height: window.innerHeight
        };

        // Single ball for this tab
        this.ball = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            radius: 20,
            color: this.getTabColor(),
            dragging: false,
            offsetX: 0,
            offsetY: 0,
            vx: 0,
            vy: 0
        };

        // Aura settings
        this.auraRadius = 150;
        this.auraIntensity = 0.6;

        // Animation timing for effects
        this.animationTime = 0;

        // Connection particles between balls
        this.connectionParticles = [];

        this.setupCanvas();
        this.setupEventListeners();
        this.setupLocalStorage();
        this.animate();
        this.syncLoop();
        this.trackWindowPosition();

        // Display tab ID
        document.getElementById('tabId').textContent = this.tabId;
    }

    generateTabId() {
        return 'tab_' + Math.random().toString(36).substr(2, 9);
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.updateWindowPosition();
        });
    }

    trackWindowPosition() {
        setInterval(() => {
            this.updateWindowPosition();
        }, 100);
    }

    updateWindowPosition() {
        this.windowPos = {
            screenX: window.screenX,
            screenY: window.screenY,
            width: window.innerWidth,
            height: window.innerHeight
        };
    }

    setupEventListeners() {
        // Mouse events for dragging
        this.canvas.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Check if clicking on the ball
            const dx = mouseX - this.ball.x;
            const dy = mouseY - this.ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= this.ball.radius) {
                this.ball.dragging = true;
                this.ball.offsetX = dx;
                this.ball.offsetY = dy;
                this.ball.vx = 0;
                this.ball.vy = 0;
            }
        });

        this.canvas.addEventListener('mousemove', (e) => {
            if (this.ball.dragging) {
                const rect = this.canvas.getBoundingClientRect();
                this.ball.x = e.clientX - rect.left - this.ball.offsetX;
                this.ball.y = e.clientY - rect.top - this.ball.offsetY;
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.ball.dragging = false;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.ball.dragging = false;
        });

        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const touchX = touch.clientX - rect.left;
            const touchY = touch.clientY - rect.top;

            const dx = touchX - this.ball.x;
            const dy = touchY - this.ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= this.ball.radius) {
                this.ball.dragging = true;
                this.ball.offsetX = dx;
                this.ball.offsetY = dy;
                this.ball.vx = 0;
                this.ball.vy = 0;
            }
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (this.ball.dragging) {
                const touch = e.touches[0];
                const rect = this.canvas.getBoundingClientRect();
                this.ball.x = touch.clientX - rect.left - this.ball.offsetX;
                this.ball.y = touch.clientY - rect.top - this.ball.offsetY;
            }
        });

        this.canvas.addEventListener('touchend', () => {
            this.ball.dragging = false;
        });

        // Button controls
        document.getElementById('clearBtn').addEventListener('click', () => {
            // Reset ball to center
            this.ball.x = this.canvas.width / 2;
            this.ball.y = this.canvas.height / 2;
            this.ball.vx = 0;
            this.ball.vy = 0;
        });

        document.getElementById('randomBtn').addEventListener('click', () => {
            // Move ball to random position
            this.ball.x = Math.random() * this.canvas.width;
            this.ball.y = Math.random() * this.canvas.height;
        });
    }

    setupLocalStorage() {
        // Listen for storage events from other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === 'animationData') {
                this.handleRemoteUpdate(e.newValue);
            }
        });

        // Cleanup on tab close
        window.addEventListener('beforeunload', () => {
            this.removeTabFromStorage();
        });

        // Initial load of existing data
        const existingData = localStorage.getItem('animationData');
        if (existingData) {
            this.handleRemoteUpdate(existingData);
        }

        // Poll for updates since storage events don't fire in the same tab
        setInterval(() => {
            const currentData = localStorage.getItem('animationData');
            this.handleRemoteUpdate(currentData);
        }, 100);
    }

    getTabColor() {
        // Generate a consistent color for this tab based on tabId
        const hash = this.tabId.split('').reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);

        const hue = Math.abs(hash) % 360;
        return `hsl(${hue}, 80%, 60%)`;
    }

    updateBall() {
        // Update animation time for effects
        this.animationTime += 0.05;

        // Apply physics if not being dragged
        if (!this.ball.dragging) {
            // Apply velocity with friction
            this.ball.x += this.ball.vx;
            this.ball.y += this.ball.vy;
            this.ball.vx *= 0.98;
            this.ball.vy *= 0.98;

            // Boundary collision
            if (this.ball.x - this.ball.radius < 0) {
                this.ball.x = this.ball.radius;
                this.ball.vx *= -0.8;
            }
            if (this.ball.x + this.ball.radius > this.canvas.width) {
                this.ball.x = this.canvas.width - this.ball.radius;
                this.ball.vx *= -0.8;
            }
            if (this.ball.y - this.ball.radius < 0) {
                this.ball.y = this.ball.radius;
                this.ball.vy *= -0.8;
            }
            if (this.ball.y + this.ball.radius > this.canvas.height) {
                this.ball.y = this.canvas.height - this.ball.radius;
                this.ball.vy *= -0.8;
            }

            // Interaction with remote balls based on screen position
            const myScreenX = this.windowPos.screenX + this.ball.x;
            const myScreenY = this.windowPos.screenY + this.ball.y;

            this.remoteBalls.forEach((remoteBall) => {
                const remoteScreenX = remoteBall.screenX + remoteBall.x;
                const remoteScreenY = remoteBall.screenY + remoteBall.y;

                const dx = remoteScreenX - myScreenX;
                const dy = remoteScreenY - myScreenY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Gentle attraction/repulsion based on distance
                if (distance < this.auraRadius * 2 && distance > 0) {
                    const force = (this.auraRadius * 2 - distance) / (this.auraRadius * 2) * 0.1;
                    this.ball.vx += (dx / distance) * force;
                    this.ball.vy += (dy / distance) * force;
                }
            });
        }

        // Update connection particles
        this.updateConnectionParticles();
    }

    updateConnectionParticles() {
        // Collect all balls for checking connections
        const allBalls = [];

        allBalls.push({
            x: this.ball.x,
            y: this.ball.y,
            screenX: this.windowPos.screenX + this.ball.x,
            screenY: this.windowPos.screenY + this.ball.y,
            color: this.ball.color
        });

        this.remoteBalls.forEach((remoteBall) => {
            const localX = (remoteBall.screenX + remoteBall.x) - this.windowPos.screenX;
            const localY = (remoteBall.screenY + remoteBall.y) - this.windowPos.screenY;

            allBalls.push({
                x: localX,
                y: localY,
                screenX: remoteBall.screenX + remoteBall.x,
                screenY: remoteBall.screenY + remoteBall.y,
                color: remoteBall.color
            });
        });

        // Create new connection particles between nearby balls
        for (let i = 0; i < allBalls.length; i++) {
            for (let j = i + 1; j < allBalls.length; j++) {
                const ball1 = allBalls[i];
                const ball2 = allBalls[j];

                const dx = ball2.screenX - ball1.screenX;
                const dy = ball2.screenY - ball1.screenY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Generate particles when balls are close
                if (distance < this.auraRadius * 2 && Math.random() < 0.15) {
                    this.connectionParticles.push({
                        ball1: ball1,
                        ball2: ball2,
                        progress: 0,
                        life: 1.0,
                        size: Math.random() * 3 + 2
                    });
                }
            }
        }

        // Update existing particles
        for (let i = this.connectionParticles.length - 1; i >= 0; i--) {
            const p = this.connectionParticles[i];
            p.progress += 0.02;
            p.life -= 0.015;

            if (p.life <= 0 || p.progress >= 1) {
                this.connectionParticles.splice(i, 1);
            }
        }
    }

    drawScene() {
        // Clear canvas with slight fade for trail effect
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Collect all balls with screen positions for aura calculations
        const allBalls = [];

        // Add local ball
        allBalls.push({
            x: this.ball.x,
            y: this.ball.y,
            screenX: this.windowPos.screenX + this.ball.x,
            screenY: this.windowPos.screenY + this.ball.y,
            color: this.ball.color,
            radius: this.ball.radius,
            isLocal: true
        });

        // Add remote balls visible in screen space
        this.remoteBalls.forEach((remoteBall) => {
            const localX = (remoteBall.screenX + remoteBall.x) - this.windowPos.screenX;
            const localY = (remoteBall.screenY + remoteBall.y) - this.windowPos.screenY;

            // Include if visible or near this window
            if (localX > -this.auraRadius && localX < this.canvas.width + this.auraRadius &&
                localY > -this.auraRadius && localY < this.canvas.height + this.auraRadius) {
                allBalls.push({
                    x: localX,
                    y: localY,
                    screenX: remoteBall.screenX + remoteBall.x,
                    screenY: remoteBall.screenY + remoteBall.y,
                    color: remoteBall.color,
                    radius: remoteBall.radius,
                    isLocal: false
                });
            }
        });

        // Draw combined auras
        this.drawCombinedAuras(allBalls);

        // Draw all balls
        allBalls.forEach(ball => {
            this.drawBall(ball.x, ball.y, ball.radius, ball.color, ball.isLocal);
        });

        // Draw connection lines between nearby balls
        this.drawConnections(allBalls);
    }

    drawCombinedAuras(balls) {
        // For each ball, draw its aura
        balls.forEach((ball, index) => {
            // Check distance to other balls
            const nearbyBalls = [];

            balls.forEach((otherBall, otherIndex) => {
                if (index !== otherIndex) {
                    const dx = otherBall.screenX - ball.screenX;
                    const dy = otherBall.screenY - ball.screenY;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < this.auraRadius * 2) {
                        nearbyBalls.push({ ball: otherBall, distance: distance });
                    }
                }
            });

            // Draw aura layers
            const layers = 15;
            for (let i = layers; i > 0; i--) {
                const currentRadius = (this.auraRadius / layers) * i;
                const baseAlpha = (this.auraIntensity * (i / layers)) * 0.05;

                // Create gradient
                const gradient = this.ctx.createRadialGradient(
                    ball.x, ball.y, 0,
                    ball.x, ball.y, currentRadius
                );

                // Parse HSL color to get hue
                const hue = parseInt(ball.color.match(/\d+/)[0]);

                // Enhanced glow when near other balls
                let alpha = baseAlpha;
                nearbyBalls.forEach(({ distance }) => {
                    if (distance < currentRadius * 2) {
                        const overlap = 1 - (distance / (currentRadius * 2));
                        alpha += overlap * 0.02;
                    }
                });

                gradient.addColorStop(0, `hsla(${hue}, 80%, 60%, ${alpha * 2})`);
                gradient.addColorStop(0.5, `hsla(${hue}, 80%, 60%, ${alpha})`);
                gradient.addColorStop(1, `hsla(${hue}, 80%, 60%, 0)`);

                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(ball.x, ball.y, currentRadius, 0, Math.PI * 2);
                this.ctx.fill();
            }

            // Draw combination effect between nearby balls with pulsing animation
            nearbyBalls.forEach(({ ball: otherBall, distance }) => {
                if (distance < this.auraRadius * 1.5) {
                    const overlap = 1 - (distance / (this.auraRadius * 1.5));

                    // Pulsing effect based on animation time
                    const pulse = Math.sin(this.animationTime * 2) * 0.3 + 0.7;

                    // Draw multiple energy flow layers for depth
                    for (let layer = 0; layer < 3; layer++) {
                        const gradient = this.ctx.createLinearGradient(
                            ball.x, ball.y,
                            otherBall.x, otherBall.y
                        );

                        const hue1 = parseInt(ball.color.match(/\d+/)[0]);
                        const hue2 = parseInt(otherBall.color.match(/\d+/)[0]);
                        const mixedHue = (hue1 + hue2) / 2;

                        const layerAlpha = overlap * (0.15 - layer * 0.04) * pulse;

                        gradient.addColorStop(0, `hsla(${hue1}, 80%, 60%, ${layerAlpha})`);
                        gradient.addColorStop(0.5, `hsla(${mixedHue}, 90%, 70%, ${layerAlpha * 1.5})`);
                        gradient.addColorStop(1, `hsla(${hue2}, 80%, 60%, ${layerAlpha})`);

                        this.ctx.strokeStyle = gradient;
                        this.ctx.lineWidth = (overlap * 12 + layer * 4) * pulse;
                        this.ctx.beginPath();
                        this.ctx.moveTo(ball.x, ball.y);
                        this.ctx.lineTo(otherBall.x, otherBall.y);
                        this.ctx.stroke();
                    }

                    // Draw animated wave effect
                    const waveOffset = (this.animationTime * 50) % 40;
                    for (let w = 0; w < 3; w++) {
                        const wavePos = (w * 40 + waveOffset) / 120;
                        if (wavePos <= 1) {
                            const waveX = ball.x + (otherBall.x - ball.x) * wavePos;
                            const waveY = ball.y + (otherBall.y - ball.y) * wavePos;

                            const waveGradient = this.ctx.createRadialGradient(
                                waveX, waveY, 0,
                                waveX, waveY, 15 * overlap
                            );

                            const mixedHue = (parseInt(ball.color.match(/\d+/)[0]) + parseInt(otherBall.color.match(/\d+/)[0])) / 2;
                            waveGradient.addColorStop(0, `hsla(${mixedHue}, 90%, 70%, ${overlap * 0.6})`);
                            waveGradient.addColorStop(1, `hsla(${mixedHue}, 90%, 70%, 0)`);

                            this.ctx.fillStyle = waveGradient;
                            this.ctx.beginPath();
                            this.ctx.arc(waveX, waveY, 15 * overlap, 0, Math.PI * 2);
                            this.ctx.fill();
                        }
                    }
                }
            });
        });

        // Draw connection particles
        this.drawConnectionParticles();
    }

    drawConnectionParticles() {
        this.connectionParticles.forEach(p => {
            // Calculate position along the line between balls
            const x = p.ball1.x + (p.ball2.x - p.ball1.x) * p.progress;
            const y = p.ball1.y + (p.ball2.y - p.ball1.y) * p.progress;

            // Mix colors based on progress
            const hue1 = parseInt(p.ball1.color.match(/\d+/)[0]);
            const hue2 = parseInt(p.ball2.color.match(/\d+/)[0]);
            const currentHue = hue1 + (hue2 - hue1) * p.progress;

            // Draw particle with glow
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, p.size * 3);
            gradient.addColorStop(0, `hsla(${currentHue}, 90%, 70%, ${p.life * 0.8})`);
            gradient.addColorStop(0.5, `hsla(${currentHue}, 90%, 70%, ${p.life * 0.4})`);
            gradient.addColorStop(1, `hsla(${currentHue}, 90%, 70%, 0)`);

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(x, y, p.size * 3, 0, Math.PI * 2);
            this.ctx.fill();

            // Core
            this.ctx.fillStyle = `hsla(${currentHue}, 100%, 90%, ${p.life})`;
            this.ctx.beginPath();
            this.ctx.arc(x, y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawBall(x, y, radius, color, isLocal) {
        // Outer glow ring
        const glowGradient = this.ctx.createRadialGradient(x, y, radius, x, y, radius * 2);
        glowGradient.addColorStop(0, color.replace(')', ', 0.4)').replace('hsl', 'hsla'));
        glowGradient.addColorStop(1, color.replace(')', ', 0)').replace('hsl', 'hsla'));

        this.ctx.fillStyle = glowGradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius * 2, 0, Math.PI * 2);
        this.ctx.fill();

        // Main ball with gradient
        const ballGradient = this.ctx.createRadialGradient(
            x - radius * 0.3, y - radius * 0.3, radius * 0.1,
            x, y, radius
        );

        if (isLocal) {
            ballGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            ballGradient.addColorStop(0.3, color.replace(')', ', 1)').replace('hsl', 'hsla'));
            ballGradient.addColorStop(1, color.replace('60%', '40%').replace(')', ', 1)').replace('hsl', 'hsla'));
        } else {
            ballGradient.addColorStop(0, color.replace('60%', '80%').replace(')', ', 0.9)').replace('hsl', 'hsla'));
            ballGradient.addColorStop(1, color.replace('60%', '40%').replace(')', ', 0.9)').replace('hsl', 'hsla'));
        }

        this.ctx.fillStyle = ballGradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Highlight
        const highlightGradient = this.ctx.createRadialGradient(
            x - radius * 0.4, y - radius * 0.4, 0,
            x - radius * 0.4, y - radius * 0.4, radius * 0.6
        );
        highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        this.ctx.fillStyle = highlightGradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawConnections(balls) {
        for (let i = 0; i < balls.length; i++) {
            for (let j = i + 1; j < balls.length; j++) {
                const ball1 = balls[i];
                const ball2 = balls[j];

                const dx = ball2.screenX - ball1.screenX;
                const dy = ball2.screenY - ball1.screenY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.auraRadius * 2) {
                    const alpha = (1 - distance / (this.auraRadius * 2)) * 0.5;
                    const pulse = Math.sin(this.animationTime * 3) * 0.2 + 0.8;

                    // Outer glow line
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.3 * pulse})`;
                    this.ctx.lineWidth = 4;
                    this.ctx.beginPath();
                    this.ctx.moveTo(ball1.x, ball1.y);
                    this.ctx.lineTo(ball2.x, ball2.y);
                    this.ctx.stroke();

                    // Inner bright line
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * pulse})`;
                    this.ctx.lineWidth = 2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(ball1.x, ball1.y);
                    this.ctx.lineTo(ball2.x, ball2.y);
                    this.ctx.stroke();
                }
            }
        }
    }

    syncLoop() {
        this.sendBallToStorage();
        setTimeout(() => this.syncLoop(), 50);
    }

    sendBallToStorage() {
        const data = {
            tabId: this.tabId,
            timestamp: Date.now(),
            screenX: this.windowPos.screenX,
            screenY: this.windowPos.screenY,
            width: this.windowPos.width,
            height: this.windowPos.height,
            x: this.ball.x,
            y: this.ball.y,
            radius: this.ball.radius,
            color: this.ball.color
        };

        try {
            const existing = JSON.parse(localStorage.getItem('animationData') || '{}');
            existing[this.tabId] = data;

            // Clean up old tabs (no heartbeat in last 3 seconds)
            const now = Date.now();
            Object.keys(existing).forEach(tabId => {
                if (now - existing[tabId].timestamp > 3000 && tabId !== this.tabId) {
                    delete existing[tabId];
                }
            });

            localStorage.setItem('animationData', JSON.stringify(existing));
        } catch (e) {
            console.warn('LocalStorage quota exceeded, clearing old data');
            localStorage.setItem('animationData', JSON.stringify({ [this.tabId]: data }));
        }
    }

    handleRemoteUpdate(dataString) {
        if (!dataString) return;

        try {
            const allData = JSON.parse(dataString);

            this.remoteBalls.clear();

            // Update active tabs count
            const activeTabs = Object.keys(allData);
            document.getElementById('activeTabs').textContent = activeTabs.length;

            // Get ball data from other tabs
            Object.entries(allData).forEach(([tabId, data]) => {
                if (tabId !== this.tabId) {
                    this.remoteBalls.set(tabId, {
                        tabId: tabId,
                        screenX: data.screenX,
                        screenY: data.screenY,
                        width: data.width,
                        height: data.height,
                        x: data.x,
                        y: data.y,
                        radius: data.radius,
                        color: data.color
                    });
                }
            });
        } catch (e) {
            console.error('Error parsing remote data:', e);
        }
    }

    removeTabFromStorage() {
        try {
            const data = JSON.parse(localStorage.getItem('animationData') || '{}');
            delete data[this.tabId];
            localStorage.setItem('animationData', JSON.stringify(data));
        } catch (e) {
            console.error('Error removing tab from storage:', e);
        }
    }

    animate() {
        this.updateBall();
        this.drawScene();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    new CrossTabAnimation();
});
