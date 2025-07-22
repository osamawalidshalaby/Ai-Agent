import { useState , useEffect } from "react";

export const useLocalStorage = (key, initialValue) => {
    const [value , setvalue] = useState(function(){
        const data = localStorage.getItem(key)
        return JSON.parse(data)
    })

    useEffect(function(){
        if (value === null || value === undefined) {
            localStorage.removeItem(key);
            return;
        }
        localStorage.setItem(key , JSON.stringify(value || initialValue))
    },[key , value , initialValue])
    return [value , setvalue]
}