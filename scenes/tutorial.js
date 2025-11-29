import { Level1Scene } from './level1.js';
import { MyButton } from '../components/myButton.js';

export class TutorialScene extends Level1Scene {
    constructor(p, opts) {
        super(p, opts);
        this.p = p;
        this.level = opts.level;
    }

    init() {
        super.init();
        console.log("Tutorial scene initialized");
    }
}