import { eventManager } from "client/core/foundation/EventManager";
import { isChatOpen } from "./Chat";
import { player } from "./Player";
/*
eventManager.on("keydown", (key) => {
    if (key != 88) return;

    if (player.getVariable("canInteract") != true || !isChatOpen()) return;

    var Raycast = utils.getRaycast();

    let menuItems = {
        'close': {
            'title': 'Schließen',
            'desc': 'Schließt das Menu.',
            'image': 'close'
        }
    }

    if (Raycast[4]) {
        target = Raycast[4];

        if (target == undefined || target == 11010) return;

        if (alt.Player.local.vehicle != null) { //InsideVehicle
            target = alt.Player.local.vehicle;

            let engineState = target.getSyncedMeta("engineState");
            let lockState = target.getSyncedMeta("lockState");
            let trunkState = target.getSyncedMeta("trunkState");

            if (alt.Player.local.seat == 1) {
                if (engineState) {
                    menuItems['engine'] = {
                        'title': 'Motor Ausschalten',
                        'desc': 'Schalte deinen Motor aus',
                        'image': 'engine'
                    }
                } else {
                    menuItems['engine'] = {
                        'title': 'Motor Anschalten',
                        'desc': 'Schalte deinen Motor ein',
                        'image': 'engine'
                    }
                }
                menuItems['throwOut'] = {
                    'title': 'Rausschmeißen',
                    'desc': 'Spieler aus deinem Fahrzeug schmeißen',
                    'image': 'throwOut'
                }
            }

            if (lockState) {
                menuItems['lock'] = {
                    'title': 'Fahrzeug Aufschließen',
                    'desc': 'Schließe dein Fahrzeug auf',
                    'image': 'lock'
                }
            } else {
                menuItems['lock'] = {
                    'title': 'Fahrzeug Abschließen',
                    'desc': 'Schließe dein Fahrzeug ab',
                    'image': 'lock'
                }
            }

            if (trunkState) {
                menuItems['trunk'] = {
                    'title': 'Kofferaum Öffnen',
                    'desc': 'Öffne deinen Kofferaum',
                    'image': 'trunk'
                }
            } else {
                menuItems['trunk'] = {
                    'title': 'Kofferaum Schließen',
                    'desc': 'Schließe deinen Kofferaum',
                    'image': 'trunk'
                }
            }

            createCircleMenu("vehicleInside", menuItems);
        } else if (native.isEntityAVehicle(target)) { //OutsideVehicle
            target = utils.getEntityByScriptID(target);

            if (target == null || !target.valid || target.type != 1) return;

            if (utils.getDistance(alt.Player.local.pos, target.pos) > 3) return;

            let lockState = target.getSyncedMeta("lockState");
            let trunkState = target.getSyncedMeta("trunkState");

            if (lockState) {
                menuItems['lock'] = {
                    'title': 'Fahrzeug Aufschließen',
                    'desc': 'Schließe dein Fahrzeug auf',
                    'image': 'lock'
                }
            } else {
                menuItems['lock'] = {
                    'title': 'Fahrzeug Abschließen',
                    'desc': 'Schließe deine Fahrzeug ab',
                    'image': 'lock'
                }
            }

            if (isGasStationNear() && native.getIsVehicleEngineRunning(target) == false) {
                menuItems['fuel'] = {
                    'title': 'Fahrzeug Betanken',
                    'desc': 'Tanke dein Fahrzeug',
                    'image': 'fuel'
                }
            }

            if (trunkState) {
                menuItems['trunk'] = {
                    'title': 'Kofferaum Öffnen',
                    'desc': 'Öffne deinen Kofferaum',
                    'image': 'trunk'
                }
            } else {
                menuItems['trunk'] = {
                    'title': 'Kofferaum Schließen',
                    'desc': 'Schließe deinen Kofferaum',
                    'image': 'trunk'
                }
            }

            targetGarage = getNearsetGarage(alt.Player.local.pos);

            if (targetGarage) {
                menuItems['park'] = {
                    'title': 'Einparken',
                    'desc': `Parke dein Fahrzeug in die ${targetGarage.name} ein`,
                    'image': 'park'
                }
            }

            menuItems['repair'] = {
                'title': 'Reparieren',
                'desc': 'Reparieren dein Fahrzeug',
                'image': 'repair'
            }

            menuItems['info'] = {
                'title': 'Information',
                'desc': 'Zeige dir die Fahrzeug Informationen an',
                'image': 'info'
            }

            createCircleMenu("vehicleOutside", menuItems);
        } else { //Player
            if (!native.doesEntityExist(target) || target == alt.Player.local) return;

            target = utils.getEntityByScriptID(target);

            if (target == null || !target.valid || target.type != 0) return;

            if (utils.getDistance(alt.Player.local.pos, target.pos) > 2) return;

            alt.log(`Player Raycast Type: ${target.type}`)
            let death = target.getSyncedMeta("death");
            let cuffed = target.getSyncedMeta("tiedup");
            let handCuffed = target.getSyncedMeta("cuffed");
            if (death != true) {
                if (alt.Player.local.getSyncedMeta("canCuff") != true) {
                    menuItems['cuff'] = {
                        'title': 'Fesseln',
                        'desc': 'Fesselt/Entfesselt den Spieler',
                        'image': 'cuff'
                    };
                }

                if (cuffed != true) {
                    if (alt.Player.local.getSyncedMeta("canCuff") == true) {
                        menuItems['handcuffs'] = {
                            'title': 'Handschellen',
                            'desc': 'Handschellen Anlegen/Aufmachen',
                            'image': 'handcuffs'
                        };

                        if (handCuffed) {
                            menuItems['handcuffschange'] = {
                                'title': 'Handschellen Verschieben',
                                'desc': 'Handschellen nach vorne/hinten legen.',
                                'image': 'handcuffschange'
                            };
                        }
                    }
                } else if (cuffed == true) {
                    menuItems['cuffchange'] = {
                        'title': 'Fessel Verschieben',
                        'desc': 'Fessel nach vorne/hinten legen.',
                        'image': 'cuffchange'
                    };
                }
            }
            menuItems['givemoney'] = {
                'title': 'Geld geben',
                'desc': 'Gebe dem Spieler Geld',
                'image': 'money'
            };
            menuItems['showid'] = {
                'title': 'Personalausweis zeigen',
                'desc': 'Zeige dem Spieler dein Personalausweis',
                'image': 'showid'
            };
            menuItems['showlics'] = {
                'title': 'Lizenzen zeigen',
                'desc': 'Zeige dem Spieler deine Lizenzen',
                'image': 'showid'
            };
            menuItems['givekey'] = {
                'title': 'Schlüssel geben',
                'desc': 'Gebe dem Spieler einen Schlüssel',
                'image': 'givekey'
            };
            menuItems['giveitem'] = {
                'title': 'Item geben',
                'desc': 'Gebe dem Spieler ein Item',
                'image': 'giveitem'
            };
            if (death == true || cuffed == true || handCuffed) {
                menuItems['search'] = {
                    'title': 'Durchsuchen',
                    'desc': 'Durchsuche den Spieler',
                    'image': 'search'
                };
                menuItems['getid'] = {
                    'title': 'Personalausweis nehmen',
                    'desc': 'Nehme den Personalausweis des Spielers',
                    'image': 'getid'
                };
                menuItems['getlics'] = {
                    'title': 'Lizenzen nehmen',
                    'desc': 'Nehme die Lizenzen des Spielers',
                    'image': 'getid'
                };

                if (target.getSyncedMeta("cuffpos") != false) {
                    let veh = utils.getNearsetVehicle(target.pos, 3);

                    if (veh != false) {
                        menuItems['setInVeh'] = {
                            'title': 'Ins Fahrzeug setzten',
                            'desc': 'Setzte den Spieler in ein Fahrzeug',
                            'image': 'setInVeh'
                        };
                    }
                }
            }
            if (death) {
                menuItems['stabilize'] = {
                    'title': 'Stabilisieren',
                    'desc': 'Stabilisiere den Spieler',
                    'image': 'stabilize'
                };
            }
            if (alt.Player.local.getSyncedMeta("setLicenses")) {
                menuItems['setlicenses'] = {
                    'title': 'Lizenzen vergeben',
                    'desc': 'Vergib Lizenzen an den Spieler',
                    'image': 'setlicenses'
                };
            }

            createCircleMenu('Player', menuItems);

        }
    } else return;
});*/