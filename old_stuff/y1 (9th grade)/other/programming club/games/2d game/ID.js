var textures = [
    null,
    document.getElementById("dirt"),
    document.getElementById("grass"),
    document.getElementById("stone"),
    document.getElementById("strangeOre")
]

class TileID {
    constructor() {
        this.texture = null;
    }
    static Air() {
        this.texture = null;
        return 0
    }
    static Dirt() {
        this.texture = textures[1];
        return 1
    }
    static Grass() {
        this.texture = textures[2];
        return 2
    }
    static Stone() {
        this.texture = textures[3];
        return 3
    }
    static StrangeOre() {
        this.texture = textures[4];
        return 4;
    }

    static FindTexture(type) {
        switch (type) {
            case 0:
                this.Air();
                break;
            case 1:
                this.Dirt();
                break;
            case 2:
                this.Grass();
                break;
            case 3:
                this.Stone();
                break;
            case 4:
                this.StrangeOre();
                break
            default:
                console.log("unknown type");
                break;
        }
    }

    static DrawTexture(x, y) {
        if (this.texture != null) {
            ctx.drawImage(this.texture, x * scale, y * scale, scale, scale);
        }
        else {
            ctx.fillStyle = "skyBlue";
            ctx.fillRect(x * scale, y * scale, scale, scale);
        }
    }

    static PlayerBlocks() {
        for (i = 0; i < 12; i++) {
            player.hotBar[i] = new Item(ItemID.Blank, 0, "Unknown");
        }
        for (i = 0; i < 11; i++) {
            player.inventory[i] = [];
        }
        for (i = 0; i < 11; i++) {
            for (n = 0; n < 6; n++) {
                player.inventory[i][n] = new Item(ItemID.Blank, 0, "Unknown");
            }
        }
    }
}

class ItemID {
    static Blank = -1;
    static Air = 0;
    static Dirt = 1;
    static Grass = 2;
    static Stone = 3;
    static StrangeOre = 4;

    static FindName(type) {
        switch (type) {
            case -1: return "Unknown";
            case 0: return "Air";
            case 1: return "Dirt";
            case 2: return "Grass";
            case 3: return "Stone";
            case 4: return "Strange Ore";
        }
    }
}

class Item {
    static Empty(){
        this.type = -1;
        this.amount = 0;
        this.displayName = "Unknown";
    }
    constructor(type, amount, displayName) {
        this.type = type;
        this.amount = amount;
        this.displayName = displayName;
    }
}