export function createPlayer(p) {
    return {
        x: 0,
        y: 0,
        speed: 250,
        size: 16,
        visible: false,
        movingLeft: false,
        movingRight: false,
        Debug: p.shared.Debug,
        health: 100,

        onActionStart(action) {
            if (action === "moveLeft") this.movingLeft = true;
            if (action === "moveLeft") this.Debug.log('player', `Player: move left started`);
            if (action === "moveRight") this.movingRight = true;
            if (action === "moveRight") this.Debug.log('player', `Player: move right started`);
            if (action === "moveUp") this.movingUp = true;
            if (action === "moveUp") this.Debug.log('player', `Player: move up started`);
            if (action === "moveDown") this.movingDown = true;
            if (action === "moveDown") this.Debug.log('player', `Player: move down started`);
        },

        onActionEnd(action) {
            if (action === "moveLeft") this.movingLeft = false;
            if (action === "moveRight") this.movingRight = false;
            if (action === "moveUp") this.movingUp = false;
            if (action === "moveDown") this.movingDown = false;
        },

        update(dt) {
            if (!this.visible) return;
            if (this.movingLeft) this.x -= this.speed * dt;
            if (this.movingRight) this.x += this.speed * dt;
            if (this.movingUp) this.y -= this.speed * dt;
            if (this.movingDown) this.y += this.speed * dt;
        },

        draw(p) {
            if (!this.visible) return;
            p.fill(0, 200, 200);
            p.square(this.x + this.size/2, this.y + this.size/2, this.size);
        },

        reset(spawn = { x: 0, y: 0 }) {
            this.x = spawn.x;
            this.y = spawn.y;
            this.movingLeft = false;
            this.movingRight = false;
            this.visible = true;
            if (this.Debug) this.Debug.log('player', `Player reset to (${this.x}, ${this.y})`);
        },

        deactivate() {
            this.visible = false;
            this.movingLeft = false;
            this.movingRight = false;
            if (this.Debug) this.Debug.log('player', 'Player deactivated');
        }
    };
}