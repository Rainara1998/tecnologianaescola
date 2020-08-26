function handleMonth(month){
    if(month === 0)
    return "Jan."

    if(month === 1)
    return "Fev."

    if(month === 2)
    return "Mar."

    if(month === 3)
    return "Abr."

    if(month === 4)
    return "Mai."

    if(month === 5)
    return "Jun."

    if(month === 6)
    return "Jul."

    if(month === 7)
    return "Ago."

    if(month === 8)
    return "Set."

    if(month === 9)
    return "Out."

    if(month === 10)
    return "Nov."

    if(month === 11)
    return "Dez."
}

function addZero(number){
    return number < 10 ? `0${number}` : number
}

export const dateOnly = (content) => {
    const date = new Date(content);
    const day = date.getDate();
    const month = handleMonth(date.getMonth());
    const year = date.getFullYear();
    return `${day + 1} de ${month} de ${year}`;
}

export const dateNascimento = (content) => {
    const date = new Date(content);
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return `${year}-${addZero(month + 1)}-${addZero(day + 1)}`;
}

export const dateCurrent = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return `${year}-${addZero(month + 1)}-${addZero(day)}`;
}

export const compareDate = (entrega, agendada) => {
    const date_entrega = new Date(entrega).getTime();
    const date_agendada = new Date(agendada).getTime();

    return date_agendada > date_entrega;
}