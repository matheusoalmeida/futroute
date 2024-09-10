// Lista de times e estádios da Série A e B do Brasil
const timesEstadios = {
    // Série A
    "Vasco": "Estádio São Januário, Rio de Janeiro, RJ",
    "Flamengo": "Estádio do Maracanã, Rio de Janeiro, RJ",
    "Botafogo": "Estádio Nilton Santos, Rio de Janeiro, RJ",
    "Palmeiras": "Allianz Parque, São Paulo, SP",
    "Corinthians": "Arena Corinthians, São Paulo, SP",
    "São Paulo": "Estádio do Morumbi, São Paulo, SP",
    "Santos": "Estádio da Vila Belmiro, Santos, SP",
    "Grêmio": "Arena do Grêmio, Porto Alegre, RS",
    "Internacional": "Estádio Beira-Rio, Porto Alegre, RS",
    "Atlético Mineiro": "Arena MRV, Belo Horizonte, MG",
    "Cruzeiro": "Estádio Mineirão, Belo Horizonte, MG",
    "Athletico Paranaense": "Arena da Baixada, Curitiba, PR",
    "Coritiba": "Estádio Couto Pereira, Curitiba, PR",
    "Bahia": "Arena Fonte Nova, Salvador, BA",
    "Fortaleza": "Arena Castelão, Fortaleza, CE",
    "Ceará": "Arena Castelão, Fortaleza, CE",
    "Goiás": "Estádio da Serrinha, Goiânia, GO",
    "Fluminense": "Estádio do Maracanã, Rio de Janeiro, RJ",
    "Red Bull Bragantino": "Estádio Nabi Abi Chedid, Bragança Paulista, SP",
    "América Mineiro": "Estádio Independência, Belo Horizonte, MG",
    
    // Série B
    "Sport": "Ilha do Retiro, Recife, PE",
    "Vitória": "Barradão, Salvador, BA",
    "CRB": "Estádio Rei Pelé, Maceió, AL",
    "Sampaio Corrêa": "Estádio Castelão, São Luís, MA",
    "Avaí": "Estádio da Ressacada, Florianópolis, SC",
    "Ponte Preta": "Estádio Moisés Lucarelli, Campinas, SP",
    "Guarani": "Estádio Brinco de Ouro, Campinas, SP",
    "Chapecoense": "Arena Condá, Chapecó, SC",
    "Juventude": "Estádio Alfredo Jaconi, Caxias do Sul, RS",
    "Náutico": "Estádio dos Aflitos, Recife, PE",
    "Tombense": "Estádio Antônio Guimarães de Almeida, Tombos, MG",
    "Londrina": "Estádio do Café, Londrina, PR",
    "Novorizontino": "Estádio Jorge Ismael de Biasi, Novo Horizonte, SP",
    "Botafogo-SP": "Estádio Santa Cruz, Ribeirão Preto, SP",
    "Ituano": "Estádio Novelli Júnior, Itu, SP",
    "Mirassol": "Estádio José Maria de Campos Maia, Mirassol, SP",
    "Vila Nova": "Estádio Onésio Brasileiro Alvarenga, Goiânia, GO",
    "ABC": "Estádio Frasqueirão, Natal, RN",
    "Criciúma": "Estádio Heriberto Hülse, Criciúma, SC",
    "Atlético Goianiense": "Estádio Antônio Accioly, Goiânia, GO",
};

let map;
let directionsService;
let directionsRenderer;
let autocomplete;

function initMap() {
    // Inicializa o mapa centrado no Brasil
    map = new google.maps.Map(document.getElementById("mapa"), {
        zoom: 4,
        center: { lat: -14.235, lng: -51.9253 }, // Coordenadas aproximadas do Brasil
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    // Inicializa o autocomplete no campo de origem
    const inputOrigem = document.getElementById('origem');
    autocomplete = new google.maps.places.Autocomplete(inputOrigem);
}

document.getElementById('form-rota').addEventListener('submit', function(event) {
    event.preventDefault();

    const origem = document.getElementById('origem').value.trim();
    const nomeTime = document.getElementById('nome-time').value.trim();
    const estadioDestino = timesEstadios[nomeTime];

    if (origem && estadioDestino) {
        traçarRota(origem, estadioDestino);
        document.getElementById('btn-navegar').setAttribute('data-origem', origem);
        document.getElementById('btn-navegar').setAttribute('data-destino', estadioDestino);
    } else {
        alert("Por favor, preencha todos os campos corretamente.");
    }
});

document.getElementById('btn-navegar').addEventListener('click', function() {
    const origem = this.getAttribute('data-origem');
    const destino = this.getAttribute('data-destino');

    if (origem && destino) {
        const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origem)}&destination=${encodeURIComponent(destino)}&travelmode=driving`;
        window.open(url, '_blank');
    } else {
        alert("Primeiro, trace uma rota.");
    }
});

function traçarRota(origem, destino) {
    const request = {
        origin: origem,
        destination: destino,
        travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, function(result, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
            exibirResultadosRota(result);
        } else {
            alert('Não foi possível traçar a rota: ' + status);
        }
    });
}

function exibirResultadosRota(result) {
    // Obter os detalhes da rota
    const rota = result.routes[0];
    const distancia = rota.legs[0].distance.text;
    const duracao = rota.legs[0].duration.text;

    // Exibir os resultados na página
    const resultadosDiv = document.getElementById('resultados-rota');
    resultadosDiv.innerHTML = `
        <h3>Detalhes da Rota</h3> 
        <p><strong>Distância:</strong> ${distancia}</p>
        <p><strong>Duração:</strong> ${duracao}</p>
    `;
}
