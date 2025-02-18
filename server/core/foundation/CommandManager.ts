import { eventManager } from "./EventManager";

class CommandManager {
    functionList: {};
    constructor() {
        this.functionList = {};

        eventManager.on("customCommand", (player, command) => {
            var args = command.split(/[ ]+/);

            var commandName = args[0];

            args[0] = player;

            this.call(commandName, ...args);
        });
    }


    add = (command, f) => {
        if (typeof f != "function") return console.log("Ein Fehler ist beim Command hinzufügen aufgetreten. " + command);

        if (this.functionList[command] == undefined) {
            this.functionList[command] = f;
        } else {
            console.log("Der Command ist bereits definiert. " + command);
        }
    }

    call = (cmd, ...args) => {

        if (this.functionList[cmd] != undefined) {
            this.functionList[cmd](...args);
        } else {
            console.log("Call Error Command nicht definiert. " + cmd);
        }
    }
}