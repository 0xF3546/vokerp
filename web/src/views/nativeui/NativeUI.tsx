import React, { useEffect, useState, useRef } from "react";
import { eventListener } from "../../utils/EventListener";
import "./nativeui.css";
import { fetchNui } from "../../utils/fetchNui";

const NativeUI = () => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuTitle, setMenuTitle] = useState("");
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!menuVisible) return;

            switch (e.key) {
                case "ArrowUp":
                    setActiveIndex((prev) => (prev > 0 ? prev - 1 : menuItems.length - 1));
                    break;
                case "ArrowDown":
                    setActiveIndex((prev) => (prev < menuItems.length - 1 ? prev + 1 : 0));
                    break;
                case "Enter":
                    handleItemSelect(menuItems[activeIndex]);
                    break;
                default:
                    break;
            }
        };

        const handleWheel = (e: WheelEvent) => {
            if (!menuVisible) return;

            if (e.deltaY < 0) {
                setActiveIndex((prev) => (prev > 0 ? prev - 1 : menuItems.length - 1));
            } else if (e.deltaY > 0) {
                setActiveIndex((prev) => (prev < menuItems.length - 1 ? prev + 1 : 0));
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("wheel", handleWheel);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("wheel", handleWheel);
        };
    }, [menuVisible, menuItems, activeIndex]);

    const handleItemSelect = (item: { key: string; type: string; checked?: boolean }) => {
        if (!item) return;

        switch (item.type) {
            case "text":
                fetchNui("NativeMenu::Submit", ["text", item.key]);
                break;
            case "checkbox":
                item.checked = !item.checked;
                setMenuItems([...menuItems]);
                fetchNui("NativeMenu::Submit", ["text", item.key, item.checked]);
                break;
            default:
                break;
        }
    };

    interface MenuItem {
        key: string;
        name: string;
        right: string;
        type: string;
        checked: boolean;
    }

    const createNativeMenu = (
        menukey: string,
        menutitle: string,
        menuitems: { [key: string]: { name: string; right: string; type?: string; extraData?: boolean } },
        closeable: boolean = true
    ) => {
        const items: MenuItem[] = Object.entries(menuitems).map(([key, value]) => ({
            key,
            name: value.name,
            right: value.right,
            type: value.type || "text",
            checked: value.extraData || false,
        }));

        if (closeable) {
            items.push({
                key: "close",
                name: '<i class="fa-solid fa-xmark"></i> Schließen',
                right: "",
                type: "text",
                checked: false,
            });
        }

        setMenuTitle(menutitle);
        setMenuItems(items);
        setMenuVisible(true);
        setActiveIndex(0);
    };

    useEffect(() => {
        eventListener.listen("NativeMenu::Create", createNativeMenu);
        eventListener.listen("NativeMenu::Destroy", () => setMenuVisible(false));
        eventListener.listen("NativeMenu::Back", () => setMenuVisible(false));

        return () => {
            eventListener.remove("NativeMenu::Create");
            eventListener.remove("NativeMenu::Destroy");
            eventListener.remove("NativeMenu::Back");
        };
    }, []);

    return (
        <div id="NativeUI">
            <div className={`background ${menuVisible ? "visible" : ""}`}></div>
            <div className={`menu ${menuVisible ? "visible" : ""}`} ref={menuRef}>
                <div className="header">
                    <div className="inner">
                        <span id="title">{menuTitle}</span>
                        <span id="index">{`${activeIndex + 1}/${menuItems.length}`}</span>
                    </div>
                </div>
                <div id="itemList">
                    {menuItems.map((item, index) => (
                        <div
                            key={item.key}
                            data-id={index}
                            id={`item-${index}`}
                            className={`item ${index === activeIndex ? "active" : ""}`}
                            onClick={() => handleItemSelect(item)}
                        >
                            {item.type === "checkbox" && (
                                <span className="checkBox">
                                    {item.checked ? (
                                        <i className="far fa-check-square"></i>
                                    ) : (
                                        <i className="far fa-square"></i>
                                    )}
                                </span>
                            )}
                            <span className="itemTitle">{item.name}</span>
                            <span className="itemRightLabel">{item.right}</span>
                        </div>
                    ))}
                </div>
                <div className="footer"></div>
            </div>
        </div>
    );
};

export default NativeUI;