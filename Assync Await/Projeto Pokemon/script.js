const states = document.getElementById('status');
const input = document.getElementById('input-buscar');
const btnBuscar = document.getElementById('botao-buscar');
const resultadoPokemonBuscado = document.getElementById('resultado-pokemon');
const btnCapturar = document.getElementById('botao-capturar');
const resultadoCapturados = document.getElementById('capturados');

class Pokemons {
    constructor(id, nome, tipo, sprite) {
        this.id = id;
        this.nome = nome;
        this.tipo = tipo;
        this.sprite = sprite;
    }

    gerarCardHTML() {
        return `
            <div>
                <img src="${this.sprite}" alt="${this.nome}">
                <p>#${this.id} - ${this.nome}</p>
                <p>${this.tipo}</p>           
            </div>
        
        `
    }
}

let pokemonAtual = null;
let capturados = [];

const salvo = localStorage.getItem('capturados');
if(salvo) {
    capturados = JSON.parse(salvo).map((p) => {
        return new Pokemons(p.id, p.nome, p.tipo, p.sprite);
    });
    renderizar();
}

function capturar() {

    if(!pokemonAtual) {
        states.innerHTML = 'Nenhum pokemon buscado'
        return
    }
    capturados.push(pokemonAtual);
    localStorage.setItem('capturados', JSON.stringify(capturados));
    renderizar();
}

function renderizar() {
    resultadoCapturados.innerHTML = "";
    capturados.forEach((pokemon) => {
        resultadoCapturados.innerHTML += pokemon.gerarCardHTML();
    })
}

btnCapturar.addEventListener('click', capturar);

async function buscarPokemon() {
    try {
        const termo = input.value.toLowerCase();
        states.innerHTML = 'Buscando seu pokemon...'
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${termo}`);
        if(!res.ok) {
            throw new Error('Ocorreu uma falha ao buscar o pokémon... Verfiique sua API');
        }

        const dados = await res.json();

        pokemonAtual = new Pokemons(
            dados.id,
            dados.name,
            dados.types[0].type.name,
            dados.sprites.front_default
        )

        resultadoPokemonBuscado.innerHTML = pokemonAtual.gerarCardHTML();
        states.innerHTML = "";

    } catch (error) {
        states.innerHTML = error.message;        
    }
}

btnBuscar.addEventListener('click', buscarPokemon);