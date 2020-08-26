import React,{useState, useEffect} from 'react';

export default function Field({stateValue = () => {}, name, value = true, required, ...rest}){
    const [valueInput, setValueInput] = useState(value || false);
    const [error] = useState(false);

    function handleValue(content){
        setValueInput(content);
    }
    
    useEffect(() => {
        const newObjectContent = {};
        newObjectContent[name] = valueInput
        stateValue(newObjectContent);
    }, [valueInput, name, stateValue]);

    return(
        <input className={error ? 'errorField' : ''} type='checkbox' required={required} checked={valueInput} name={name} onChange={() => handleValue(!valueInput)} {...rest}/>
    )
}