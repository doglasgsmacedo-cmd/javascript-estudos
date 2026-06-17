const botao = document.getElementById('botao-search');
const states = document.getElementById('status-search');
const input = document.getElementById('input-search');
const resultado = document.getElementById('resultado-card');
const botaoCapturar = document.getElementById('capturar');
const lista = document.getElementById('lista-capturados');


class Pokemon {
    constructor(id, nome, tipo, sprite) {
        this.id = id;
        this.nome = nome;
        this.tipo = tipo;
        this.sprite = sprite;
    }

    gerarCardHTML() {
        return `
            <div class="cardPokemon">
                <img src="${this.sprite}" alt="${this.nome}">
                <span>${this.nome} - #${this.id}</span>
            </div>
        `
    }
}

// ! Local Storage 
let capturados = []
let pokemonAtual = null;

const salvo = localStorage.getItem('capturados');
if(salvo) {
    capturados = JSON.parse(salvo).map((p) => {
        return new Pokemon(p.id, p.nome, p.tipo, p.sprite);
    });
    renderizar();
}

function capturarPokemon() {
    capturados.push(pokemonAtual);

    localStorage.setItem('capturados', JSON.stringify(capturados));

    renderizar();
}

botaoCapturar.addEventListener('click', capturarPokemon);

function renderizar() {
    lista.innerHTML = "";

    capturados.forEach((pokedoglas) => {
        lista.innerHTML += pokedoglas.gerarCardHTML();
    });
}

// ! FIM -> Local Storage 


async function buscarPokemon() {
    try {
        const termo = input.value.toLowerCase();
        states.innerHTML = `Carregando seu pokémon, aguarde...`;

        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${termo}`);

        if (!res.ok) {
            throw new Error("Pokémon não buscado");
        }

        const dados = await res.json();

        pokemonAtual = new Pokemon(
            dados.id,
            dados.name,
            dados.types[0].type.name,
            dados.sprites.front_default
        );

        resultado.innerHTML = pokemonAtual.gerarCardHTML();

    } catch (error) {
        states.innerHTML = error.message;
    }
}

botao.addEventListener('click', buscarPokemon);

