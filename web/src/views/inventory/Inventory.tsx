import { useEffect } from "react";
import { fetchNui } from "../../utils/fetchNui";

const Inventory = () => {
    
    useEffect(() => {
        fetchNui('Inventory::Get').then((data) => {
            console.log(data)
        });
    }, [])

    return (
        <>
        </>
    )
}

export default Inventory;