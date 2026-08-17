var UICanvas = document.getElementById("UI");
var UICtx = UICanvas.getContext("2d");
UICanvas.height = window.innerHeight;
UICanvas.width = window.innerWidth;
UICtx.fillStyle = "white";
UICtx.font = "20px Arial";

var isInInventory = false;
var isDragging = false;

function UIUpdate() {
    UICtx.clearRect(UICanvas.width / 2 - 251, UICanvas.height - 89, 600, 100);
    UICtx.fillStyle = "rgba(50, 50, 50, .7)";
    UICtx.fillRect(UICanvas.width / 2 - 250, UICanvas.height - 60, 500, 50);
    UICtx.fillStyle = "rgba(200, 200, 200, .5)"
    UICtx.fillRect((player.selectedBlock - 1) * 45 + (UICanvas.width / 2 - 250), UICanvas.height - 60, 50, 50);

    for (i = 0; i < player.hotBar.length; i++) {
        if (player.hotBar[i].amount > 0 && player.hotBar[i].type != ItemID.Blank) {
            UICtx.drawImage(textures[player.hotBar[i].type], (i - 1) * 45 + (UICanvas.width / 2 - 250) + 5, UICanvas.height - 55, 40, 40);
            UICtx.fillStyle = "white";
            UICtx.font = "20px Arial";
            UICtx.fillText(player.hotBar[i].amount, (i - 1) * 45 + (UICanvas.width / 2 - 250) + 5, UICanvas.height - 15);
        }
    }
    if (isInInventory) {
        for (i = 0; i < player.inventory.length; i++) {
            for (n = 0; n < player.inventory[i].length; n++) {
                if (player.inventory[i][n].amount > 0 && player.inventory[i][n].type != ItemID.Blank) {
                    UICtx.drawImage(textures[player.inventory[i][n].type], i * 45 + (UICanvas.width / 2 - 250) + 3, n * 45 + UICanvas.height - 360 + 3, 40, 40);
                    UICtx.fillStyle = "white";
                    UICtx.font = "15px Arial";
                    UICtx.fillText(player.inventory[i][n].amount, i * 45 + (UICanvas.width / 2 - 250) + 3, n * 45 + UICanvas.height - 360 + 43)
                }
            }
        }
    }
    if (player.hotBar[player.selectedBlock].amount > 0) {
        UICtx.fillText(player.hotBar[player.selectedBlock].displayName, (player.selectedBlock - 1) * 45 + (UICanvas.width / 2 - 250), UICanvas.height - 60);
    }
}

function Inventory() {
    UICtx.fillStyle = "rgba(50, 50, 50, .7)";
    UICtx.fillRect(UICanvas.width / 2 - 250, UICanvas.height - 360, 500, 300);

    for (i = 0; i < 11; i++) {
        for (n = 0; n < 6; n++) {
            UICtx.strokeStyle = "rgb(40, 40, 40)";
            UICtx.rect((UICanvas.width / 2 - 250) + (i * 45), (UICanvas.height - 360) + (n * 45), 45, 45);
            UICtx.stroke();
        }
    }
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

var copyItem = null;
var copyIndex = null;
var copyInIndex = [];
var copiedFrom = "unknown"

UICanvas.addEventListener("mousedown", function (e) {
    if (isInInventory) {
        isDragging = true;

        if (IsInInventory(e)) {
            var selectedItem = player.inventory[Math.floor((e.clientX - 22) / 45) - 9][Math.floor((e.clientY - 22) / 45) - 6]
            copyItem = [selectedItem.type, selectedItem.amount, selectedItem.displayName];
            copyInIndex = [Math.floor((e.clientX - 22) / 45) - 9, Math.floor((e.clientY - 22) / 45) - 6]
            //Debug.Log([Math.floor((e.clientX - 22) / 45) - 9, Math.floor((e.clientY - 22) / 45) - 6])
            copiedFrom = "inventory"
        }
        if (IsInHotBar(e)) {
            var selectedItem = player.hotBar[Math.floor(e.clientX / 45) - 9];
            copyIndex = Math.floor(e.clientX / 45) - 9;
            copyItem = [selectedItem.type, selectedItem.amount, selectedItem.displayName];
            copiedFrom = "hotbar"
        }
    }
}, true);

UICanvas.addEventListener("mouseup", function (e) {
    if (isInInventory) {
        isDragging = false;

        if (IsInInventory(e)) {
            if (player.inventory[Math.floor((e.clientX - 22) / 45) - 9][Math.floor((e.clientY - 22) / 45) - 6].amount <= 0) {
                player.inventory[Math.floor((e.clientX - 22) / 45) - 9][Math.floor((e.clientY - 22) / 45) - 6] = new Item(copyItem[0], copyItem[1], copyItem[2]);
                copyItem = null;
                if (copiedFrom == "hotbar") {
                    player.hotBar[copyIndex] = new Item(-1, 0, "Unknown");
                }
                else if (copiedFrom == "inventory") {
                    player.inventory[copyInIndex[0], copyInIndex[1]] = new Item(-1, 0, "Unknown");
                }
            }
        }
        if (IsInHotBar(e)) {
            if (player.hotBar[Math.floor(e.clientX / 45) - 9].amount <= 0) {
                player.hotBar[Math.floor(e.clientX / 45) - 9] = new Item(copyItem[0], copyItem[1], copyItem[2]);
                copyItem = null;
                if (copiedFrom == "hotbar") {
                    player.hotBar[copyIndex] = new Item(-1, 0, "Unknown");
                }
                else if (copiedFrom == "inventory") {
                    player.inventory[copyInIndex[0]][copyInIndex[1]] = new Item(-1, 0, "Unknown");
                }
            }
        }
    }

}, true);

UICanvas.addEventListener("mousemove", function (e) {
    if (isInInventory) {
        /*if (e.clientX > UICanvas.width / 2 - 250 && e.clientX < UICanvas.width / 2 + 210 && e.clientY > UICanvas.height - 360 && e.clientY < UICanvas.height - 130) {
            UICtx.fillStyle = "rgba(90, 175, 43, .8)"
            UICtx.fillRect(e.clientX, e.clientY, 40, 40);
        }*/
    }
}, true);

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function IsInInventory(e) {
    return e.clientX > UICanvas.width / 2 - 250 && e.clientX < UICanvas.width / 2 + 250 && e.clientY > UICanvas.height - 360 && e.clientY < UICanvas.height - 60
}

function IsInHotBar(e) {
    return e.clientX > UICanvas.width / 2 - 251 && e.clientX < UICanvas.width / 2 + 250 && e.clientY > UICanvas.height - 89 && e.clientY < UICanvas.height - 89 + 100;
}