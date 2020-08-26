import React,{useState, useEffect} from 'react';

export default function Field({stateValue = () => {}, name, value, required, ...rest}){
    const [valueInput, setValueInput] = useState(value || '');
    const [error, setError] = useState(false);

    function handleValue(content){
        setValueInput(content);
        if(required && content === '')
        setError(true)

        else setError(false)
    }
    
    useEffect(() => {
        const newObjectContent = {};
        newObjectContent[name] = valueInput
        stateValue(newObjectContent);
    }, [valueInput, name, stateValue]);

    return(
        <textarea className={error ? 'errorField' : ''} required={required} value={valueInput} name={name} onChange={(content) => handleValue(content.target.value)} {...rest}/>
    )
}