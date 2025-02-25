import React, { useEffect, useState, useRef } from "react";
import { useWebView } from "../../contexts/webViewContext";
import { eventListener } from "../../utils/EventListener";
import "./circlemenu.css";
import { fetchNui } from "../../utils/fetchNui";

interface MenuItem {
    key: string;
    title: string;
    desc: string;
    image: string;
}

const CircleMenu: React.FC = () => {
    const webView = useWebView();
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [activeItem, setActiveItem] = useState<HTMLDivElement | null>(null);
    const [cMenuKey, setCMenuKey] = useState<string | null>(null);
    const circleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleShow = (menuKey: string, items: string) => {
            setMenuItems(JSON.parse(items));
            setCMenuKey(menuKey);
            console.log("Showing CircleMenu...");
            fetchNui("showComponent", "CircleMenu");
        };

        eventListener.listen("CircleMenu:Show", handleShow);

        return () => {
            eventListener.remove("CircleMenu:Show", handleShow);
        };
    }, []);

    useEffect(() => {
        if (menuItems.length > 0) {
            registerCircleItems();
        }
    }, [menuItems]);

    const registerCircleItems = () => {
        const items = circleRef.current?.querySelectorAll<HTMLDivElement>(".item");
        items?.forEach((item, index) => {
            item.style.left = `${(50 - 35 * Math.cos(-0.5 * Math.PI - 2 * (1 / items.length) * index * Math.PI)).toFixed(4)}%`;
            item.style.top = `${(50 + 35 * Math.sin(-0.5 * Math.PI - 2 * (1 / items.length) * index * Math.PI)).toFixed(4)}%`;
        });
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!circleRef.current) return;
        const items = circleRef.current.querySelectorAll<HTMLDivElement>(".item");
        let lastDistance: number | null = null;
        let lastItem: HTMLDivElement | null = null;

        items.forEach(item => {
            const distance = calculateDistanceToMouse(item, event);
            if (lastDistance === null || distance < lastDistance) {
                lastDistance = distance;
                lastItem = item;
            }
        });

        if (lastItem) {
            items.forEach(item => {
                item.style.opacity = "0.95";
                item.style.background = "";
            });
            (lastItem as HTMLDivElement).style.opacity = "1.0";
            (lastItem as HTMLDivElement).style.background = "linear-gradient(90deg, rgba(162, 51, 51, 0.9), rgba(129, 22, 22, 0.9))";
            setActiveItem(lastItem);
        }
    };

    const calculateDistanceToMouse = (item: HTMLDivElement, event: React.MouseEvent<HTMLDivElement>) => {
        const rect = item.getBoundingClientRect();
        const itemX = rect.left + rect.width / 2;
        const itemY = rect.top + rect.height / 2;
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        return Math.sqrt(Math.pow(itemX - mouseX, 2) + Math.pow(itemY - mouseY, 2));
    };

    const closeCircleMenu = () => {
        fetchNui("hideComponent", "CircleMenu");
        if (activeItem && cMenuKey) {
            fetchNui(`CircleMenuSelect_${cMenuKey}`, `${activeItem.dataset.itemkey}`);
        }
        setMenuItems([]);
        setActiveItem(null);
        setCMenuKey(null);
    };

    return (
        <div id="CircleMenu" onMouseMove={handleMouseMove}>
            <div className="main">
                <div className="circle" ref={circleRef}>
                    {menuItems.map((item, index) => (
                        <div key={index} data-itemkey={item.key} data-title={item.title} data-desc={item.desc} className="item">
                            <img src={`./images/circlemenu/${item.image}.png`} alt={item.title} />
                        </div>
                    ))}
                </div>
                <div className="infos">
                    <span id="infosTitle">{activeItem ? activeItem.dataset.title : "Schließen"}</span><br />
                    <span id="infosDesc">{activeItem ? activeItem.dataset.desc : "Schließt das Menu"}</span>
                </div>
                <button onClick={closeCircleMenu}>Close</button>
            </div>
        </div>
    );
};

export default CircleMenu;