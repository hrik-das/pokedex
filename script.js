const search = document.querySelector(".search");
const number = document.querySelector("#number");
const image = document.querySelector("#pokemon-image");
const badge = document.querySelector(".badge");
const statNumber = document.querySelectorAll("#stat-number");
const innerBar = document.querySelectorAll(".inner-bar");
const outerBar = document.querySelectorAll(".outer-bar");
const statDesc = document.querySelectorAll("#stat-desc");
const heading = document.querySelector("#stat");
const pokedex = document.querySelector(".pokedex");
const typeColors = {
    "rock": [182, 158, 49],
    "ghost": [112, 85, 155],
    "steel": [183, 185, 208],
    "water": [100, 147, 235],
    "grass": [116, 203, 72],
    "psychic": [251, 85, 132],
    "ice": [154, 214, 223],
    "dark": [117, 87, 76],
    "fairy": [230, 158, 172],
    "normal": [170, 166, 127],
    "fighting": [193, 34, 57],
    "flying": [168, 145, 236],
    "poison": [164, 62, 158],
    "ground": [222, 193, 107],
    "bug": [167, 183, 35],
    "fire": [245, 125, 49],
    "electric": [249, 207, 48],
    "dragon": [112, 55, 255]
};

const fetchAPI = async pokemon => {
    // Joining Pokemon Names that has more than One Word (Mr Mime)
    pokemon = pokemon.toLowerCase().split(" ").join("-");
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    if(response.status === 200){
        const data = await response.json();
        return data;
    }
    return false;
}

search.addEventListener("change", async e => {
    const data = await fetchAPI(e.target.value);
    console.log(data);
    // Validation when Pokemon does not Exist
    if(!data){
        const message = new SpeechSynthesisUtterance(e.target.value+ "Pokemon Data do not Exist!");
        message.voice = speechSynthesis.getVoices().length > 0 ? speechSynthesis.getVoices()[1] : null;
        message.rate = 0.7;
        speechSynthesis.speak(message);
        // alert("Pokemon Data do not Exist!");
        return;
    }
    // Main Pokemon Color in Order to Change UI Theme
    const mainColor = typeColors[data.types[0].type.name];
    pokedex.style.backgroundColor = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;
    heading.style.color = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;
    // Sets Pokemon # at the Top of the Page
    number.innerHTML = `#${data.id.toString().padStart(3, "0")}`;
    // Sets Pokemon Image
    image.src = data.sprites.other.home.front_default;
    // Updates "Type" Bubbles
    badge.innerHTML = "";
    data.types.forEach(t => {
        let newType = document.createElement("span");
        newType.innerHTML = t.type.name;
        newType.id = "type";
        newType.style.backgroundColor = `rgb(${typeColors[t.type.name][0]}, ${typeColors[t.type.name][1]}, ${typeColors[t.type.name][2]})`;
        badge.appendChild(newType);
    });
    // Updates Stats and Stat bars
    data.stats.forEach((stat, index) => {
        statNumber[index].innerHTML = stat.base_stat.toString().padStart(3, "0");
        innerBar[index].style.width = `${stat.base_stat}%`;
        innerBar[index].style.backgroundColor = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;
        outerBar[index].style.backgroundColor = `rgba(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]}, ${0.3})`;
        statDesc[index].style.color = `rgb(${mainColor[0]}, ${mainColor[1]}, ${mainColor[2]})`;
    });
    let extraMessage = "";
    data.abilities.forEach((ability, index) => {
        if(index === data.abilities.length - 1){
            extraMessage += ` and ${ability.ability.name}`;
        }else{
            extraMessage += `${ability.ability.name}, `;
        }
    });
    data.moves.forEach((move, index) => {
        if (index >= 10) return;
        if(index === 0) extraMessage += ` and Some Special Moves are ${move.move.name}`;
        else if(index === 9) extraMessage += `, and ${move.move.name}`;
        else extraMessage += `, ${move.move.name}`;
    });
    const voices = speechSynthesis.getVoices();
    const message = new SpeechSynthesisUtterance(e.target.value + " is a " + data.types[0].type.name + " type Pokemon and its abilities are " + extraMessage);
    message.rate = 0.7;
    message.pitch = 1.5;
    message.voice = voices.length > 0 ? voices[1] : null;
    speechSynthesis.speak(message);
});