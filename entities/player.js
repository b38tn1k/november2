export function createPlayer(p) {
    return {
        x: 0,
        y: 0,
        speed: 250,
        size: 100,
        visible: false,
        movingLeft: false,
        movingRight: false,
        Debug: p.shared.Debug,

        onActionStart(action) {

            if (action === "moveLeft") this.movingLeft = true;
            if (action === "moveLeft") this.Debug.log('player', `Player: move left started`);
            if (action === "moveRight") this.movingRight = true;
            if (action === "moveRight") this.Debug.log('player', `Player: move right started`);
        },

        onActionEnd(action) {
            if (action === "moveLeft") this.movingLeft = false;
            if (action === "moveRight") this.movingRight = false;
        },

        update(dt) {
            if (this.movingLeft) this.x -= this.speed * dt;
            if (this.movingRight) this.x += this.speed * dt;
        },

        draw(p) {
            p.fill(200, 200, 200);
            // p.noFill();
            p.stroke(255, 0, 0);
            p.circle(this.x, this.y, this.size);
        },

        reset(spawn = { x: 0, y: 0 }) {
            this.x = spawn.x;
            this.y = spawn.y;
            this.movingLeft = false;
            this.movingRight = false;
            this.visible = true;
            if (this.Debug) this.Debug.log('player', `Player reset to (${this.x}, ${this.y})`);
        }
    };
}