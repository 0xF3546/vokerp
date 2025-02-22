import { useEffect, useState } from "react";
import { fetchNui } from "../../utils/fetchNui";

const Chat = () => {
    const [chatInput, setChatInput] = useState('');
    const [lastCommands, setLastCommands] = useState<string[]>([]);
    const [currentCommandIndex, setCurrentCommandIndex] = useState<number>(-1);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            console.log(chatInput);
            setLastCommands((state) => [...state, chatInput]);
            setChatInput('');
            setCurrentCommandIndex(-1);
            fetchNui('handleCommand', chatInput);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (lastCommands.length > 0) {
                const newIndex = currentCommandIndex === -1 ? lastCommands.length - 1 : Math.max(currentCommandIndex - 1, 0);
                setCurrentCommandIndex(newIndex);
                setChatInput(lastCommands[newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (lastCommands.length > 0) {
                const newIndex = currentCommandIndex === -1 ? -1 : Math.min(currentCommandIndex + 1, lastCommands.length - 1);
                setCurrentCommandIndex(newIndex);
                setChatInput(newIndex === -1 ? '' : lastCommands[newIndex]);
            }
        }
    }

    return (
        <div className="mt-4 absolute left-[0.75rem] bg-gradient-to-r from-[rgba(12,12,12,0.9)] to-[rgba(32,32,32,0.9)] w-[20rem] h-[2rem] rounded-[5px]">
            <input
                className="w-[18.75rem] h-full text-[0.725rem] bg-transparent outline-none border-none  text-white font-montserrat ml-[0.7rem]"
                placeholder="Befehl eingeben..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyPress}
            />
        </div>
    )
}

export default Chat;