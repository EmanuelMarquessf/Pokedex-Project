const quantPokemon = 100;
const url = `https://pokeapi.co/api/v2/pokemon?limit=${quantPokemon}`;

async function loadPokemon() {
    await axios.get(url).then(response => {
        const pokemonArray = [];
        response.data.results.forEach(pokemon => {
            axios.get(pokemon.url).then(response2 => {
                pokemonArray.push(response2.data);
                if (pokemonArray.length === quantPokemon) {
                    pokemonArray.sort((a, b) => a.id - b.id);
                    const pokemonList = document.getElementById('pokemonCards');
                    var idPoke = 1;
                    pokemonArray.forEach(pokemon => {
                        const finalName = FormatName(pokemon.name);

                        let divTypes = '';
                        if (pokemon.types.length === 1) {
                            divTypes = `<div class="primaryType"><p><img src = "./media/${pokemon.types[0].type.name}.svg"></p></div>`;
                        } else {
                            divTypes = `
                        <div class="primaryType"><p><img src = "./media/${pokemon.types[0].type.name}.svg"></p></div>
                        <div class="secondaryType"><p><img src = "./media/${pokemon.types[1].type.name}.svg"></p></div>
                        `;
                        }

                        const card = document.createElement('card');
                        card.classList.add('card');
                        card.innerHTML = `
                        <div class="cardOpenModal" id="cardOpenModal" onclick="openModal(${idPoke})">
                            <div class="pokemonName"><p class="pokeName"> ${finalName} </p></div>
                            <div class="pokemonId"><p class="pokeId"> ${FormatPokeId(pokemon.id)} </p></div>
                            <div class="pokemonImage"><img class="pokeImg" src="${pokemon.sprites.other["official-artwork"].front_default}" onmouseover="animateImg(this, ${idPoke})" onmouseout="normalImg(this, ${idPoke})" onclick="rotateImg(this, ${idPoke})" ></div>
                            <div class="typePokemon">
                                ${divTypes}
                            </div>
                        </div>
                    `;
                        idPoke++;
                        pokemonList.appendChild(card);

                    });
                }
            });
        });
    });
}

async function lPokemon() {
    const response = await axios.get(url);
    const pokemonArray = await Promise.all(
        response.data.results.map(async pokemon => {
            const { data } = await axios.get(pokemon.url);
            return data;
        })
    );

    const pokemonList = document.getElementById('pokemonCards');
    let idPoke = 1;

    pokemonArray.forEach(pokemon => {
        const pokemonName = FormatName(pokemon.name);
        const primaryType = pokemon.types[0].type.name;
        const secondaryType = pokemon.types[1] ? pokemon.types[1].type.name : null;
        const imgUrl = pokemon.sprites.other['official-artwork'].front_default;

        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
        <div class="cardOpenModal" id="cardOpenModal" onclick="openModal(${idPoke})">
            <div class="pokemonName">
                <p class="pokeName">${pokemonName}</p>
            </div>
            <div class="pokemonId">
                <p class="pokeId">${FormatPokeId(pokemon.id)}</p>
            </div>
            <div class="pokemonImage">
                <img class="pokeImg" src="${imgUrl}" onmouseover="animateImg(this, ${idPoke})" onmouseout="normalImg(this, ${idPoke})" onclick="rotateImg(this, ${idPoke})">
            </div>
            <div class="typePokemon">
                <div class="primaryType">
                    <p><img src="./media/${primaryType}.svg"></p>
                </div>
                ${ secondaryType ? `<div class="secondaryType"> <p><img src="./media/${secondaryType}.svg"></p> </div>`: ''}
            </div>
        </div>`;
        idPoke++;
        pokemonList.appendChild(card);
    });
}

function animateImg(img, id) {
    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`
}

function normalImg(img, id) {
    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}

function rotateImg(img, id) {
    var typeImg = img.src;
    if (typeImg.includes("back")) {
        img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`
    }
    else {
        img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/${id}.gif`;
    }
}

function FormatPokeId(pokeId) {
    var finalId = pokeId < 9 ? `#00${pokeId}` : pokeId < 99 ? `#0${pokeId}` : `#${pokeId}`;
    return finalId;
}

function FormatName(pokeName) {
    var arrayPokemonName = pokeName.split("");
    var finalName = arrayPokemonName[0].toUpperCase();
    for (let i = 1; i < arrayPokemonName.length; i++) {
        finalName = finalName + arrayPokemonName[i]
    }
    return finalName;
}

function openModal(idPoke) {
    const urlInfoPoke = `https://pokeapi.co/api/v2/pokemon/${idPoke}`
    modal.style.display = "block"

    axios.get(urlInfoPoke).then(response => {
        const pokemons = response.data;

        //const type = `./media/${pokemons.types[0].type.name}.svg`
        //const primaryColor = GetPrimaryColor(type);

        console.log(pokemons)
        //document.getElementById("cardPokeModal").style.backgroundColor = primaryColor;
        document.getElementById("idPoke").innerHTML = `${FormatPokeId(pokemons.id)}`;
        document.getElementById("namePoke").innerHTML = `${FormatName(pokemons.name)}`;
        document.getElementById("imgPoke").src = `${pokemons.sprites.other["official-artwork"].front_default}`
        document.getElementById("PrimaryType").src = `./media/${pokemons.types[0].type.name}.svg`
        if (pokemons.types.length === 2) {
            document.getElementById("SecondaryType").src = `./media/${pokemons.types[1].type.name}.svg`
            document.getElementById("SecondaryType").style.display = "inline-block"
            document.getElementById("PrimaryType").style.marginLeft = "0%"
        }
        else {
            document.getElementById("SecondaryType").style.display = "none"
            document.getElementById("PrimaryType").style.marginLeft = "50%"
        }
        console.log(pokemons)
        document.getElementById('pokeHei').innerHTML = `${pokemons.height}`
        document.getElementById('pokeWei').innerHTML = `${pokemons.weight}`

        const abilities = pokemons.abilities;
        const pokeAbilitie = document.getElementById('pokeAbilitie');

        pokeAbilitie.innerHTML = '';
        for(let abilitie of abilities) {
            const url = abilitie.ability.url
            const abilitieElement = document.createElement('p');    
            abilitieElement.innerHTML += `<p><b><u>${FormatName(abilitie.ability.name)}</u></b></p>`;
            axios.get(url).then(response => {
                const hb = response.data;
                abilitieElement.setAttribute('title', `${hb.effect_entries[0].effect}`)
            });
            pokeAbilitie.appendChild(abilitieElement);
            
        }
    })
}


function closeModal() {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none"
    }
}

window.addEventListener("load", function () {
    document.querySelector(".botao").addEventListener("click", function () {
        document.querySelector(".whiteSide").classList.add("moveWhiteSide");
        document.querySelector(".redSide").classList.add("moveRedSide");
        document.querySelector(".midCircle").classList.add("moveMidCircle");
        document.querySelector(".midCircle").classList.add("moveMidCircle");
        document.querySelector(".botao").classList.add("moveBotao");
        document.querySelector(".searchBar").classList.add("moveSearchBar");
        document.querySelector(".searchInput").classList.add("moveSearchInput");
        document.querySelector(".searchButton").classList.add("searchButton");
        document.querySelector(".imgPokeball1").classList.add("rotatePokeballImage");
        document.querySelector(".smallFooter").classList.add("moveFooterText");
    });
});


// function GetPrimaryColor(pokemonImage){
//     var colorThief = new ColorThief();
//     var dominantColor = colorThief.getColor(pokemonImage);

//     return dominantColor;
// }


lPokemon();