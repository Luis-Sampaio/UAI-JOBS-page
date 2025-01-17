const JSON_SERVER_URL_EMPREGADORES = 'https://json-uai-jobs.vercel.app/empregadores';
const JSON_SERVER_URL_FREELANCERS = 'https://json-uai-jobs.vercel.app/freelancers';
const JSON_SERVER_URL_ADMIN = 'https://json-uai-jobs.vercel.app/admin';

// Função que lê o usuário logado no momento
function lerUsuarioCorrenteLS() {
    let strUsuarios = localStorage.getItem('UsuarioCorrente');
    let usuarioLogado = JSON.parse(strUsuarios);

    return usuarioLogado;
}

// Função que salva o usuário logado no momento
function salvarUsuarioCorrenteLS(usuario) {
    localStorage.setItem('UsuarioCorrente', JSON.stringify(usuario));
}

// Função que atualiza os interesses do usuário no Local Storage e no JSON server
async function atualizarInteressesLS(usuarioLogado) {

    if(usuarioLogado.tipo === "freelancer"){
        try {
            // Atualiza os interesses no JSON server usando PATCH
            const response = await axios.patch(`${JSON_SERVER_URL_FREELANCERS}/${usuarioLogado.id}`, { interesses: usuarioLogado.interesses });
            console.log('Resposta do servidor:', response.data);
        } catch (error) {
            console.error('Erro ao atualizar os interesses no JSON server:', error);
        }
    }
    else if(usuarioLogado.tipo === "empregador"){
        try {
            // Atualiza os interesses no JSON server usando PATCH
            const response = await axios.patch(`${JSON_SERVER_URL_EMPREGADORES}/${usuarioLogado.id}`, { interesses: usuarioLogado.interesses });
            console.log('Resposta do servidor:', response.data);
        } catch (error) {
            console.error('Erro ao atualizar os interesses no JSON server:', error);
        }
    }
    else if(usuarioLogado.tipo === "admin"){
        try {
            // Atualiza os interesses no JSON server usando PATCH
            const response = await axios.patch(`${JSON_SERVER_URL_ADMIN}/${usuarioLogado.id}`, { interesses: usuarioLogado.interesses });
            console.log('Resposta do servidor:', response.data);
        } catch (error) {
            console.error('Erro ao atualizar os interesses no JSON server:', error);
        }
    }


    
}

// Função para salvar as seleções no Local Storage e no JSON server
function salvarSelecoes() {
    const interessesSelecionados = []; // Array para armazenar os interesses selecionados
    document.querySelectorAll('.card-interesse.selecionado').forEach(card => { // Para cada card selecionado
        interessesSelecionados.push(card.textContent.trim()); // Adiciona o texto do card (interesse) ao array
    });
    const usuarioLogado = lerUsuarioCorrenteLS();
    usuarioLogado.interesses = interessesSelecionados; // Adiciona os interesses selecionados aos interesses do usuário fictício
    salvarUsuarioCorrenteLS(usuarioLogado); // Salva os dados do usuário fictício no Local Storage
    atualizarInteressesLS(usuarioLogado); // Atualiza os interesses no Local Storage e no JSON server
}

// Nomes dos interesses e caminhos das imagens
const interesses = [
    { name: 'Jurídico', imageUrl: '../../img/imgCardsPesquisaInteresse/justica.png' },
    { name: 'Culinária', imageUrl: '../../img/imgCardsPesquisaInteresse/culinaria.png' },
    { name: 'Design', imageUrl: '../../img/imgCardsPesquisaInteresse/design.png' },
    { name: 'Finanças', imageUrl: '../../img/imgCardsPesquisaInteresse/financa.png' },
    { name: 'Fotografia', imageUrl: '../../img/imgCardsPesquisaInteresse/fotografia.png' },
    { name: 'Marketing', imageUrl: '../../img/imgCardsPesquisaInteresse/marketing.png' },
    { name: 'Redação', imageUrl: '../../img/imgCardsPesquisaInteresse/redacao.png' },
    { name: 'Construção', imageUrl: '../../img/imgCardsPesquisaInteresse/tijolos.png' },
    { name: 'Tradução', imageUrl: '../../img/imgCardsPesquisaInteresse/traducao.png' },
    { name: 'Videoclipes', imageUrl: '../../img/imgCardsPesquisaInteresse/videoclipe.png' },
    { name: 'Computação', imageUrl: '../../img/imgCardsPesquisaInteresse/computacao.png' },
    { name: 'Mídias Sociais', imageUrl: '../../img/imgCardsPesquisaInteresse/midia-social.png' }
];

// Função para criar um card com uma imagem específica e nome do interesse
function criarCard(interesse) {
    const card = document.createElement('div'); // Cria uma div
    card.classList.add('card-interesse'); // Adiciona a classe 'card-interesse' na div
    card.innerHTML = '<img src="' + interesse.imageUrl + '" alt="' + interesse.name + '">' + // Adiciona uma imagem ao card
        '<div>' + interesse.name + '</div>'; // Adiciona o nome do interesse no card
    card.onclick = function () { // Quando o usuario clicar no card:
        card.classList.toggle('selecionado'); // Alterna a classe 'selecionado' do card (seleciona ou desseleciona)
        atualizarEstadoBotaoConfirmar(); // Atualiza o estado do botão Confirmar (habilita ou desabilita)
    };
    return card;
}

// Inicializa os cards
const gradeInteresses = document.getElementById('grade-interesses');
interesses.forEach(interesse => { // Para cada interesse
    gradeInteresses.appendChild(criarCard(interesse)); // Adiciona um card ao grid
});
atualizarEstadoBotaoConfirmar();

// Função para limpar a seleção dos cards
function limparSelecao() {
    document.querySelectorAll('.card-interesse.selecionado').forEach(card => { // Para cada card selecionado
        card.classList.remove('selecionado'); // Remove a classe 'selecionado' do card
    });
    atualizarEstadoBotaoConfirmar();
}

// Função para atualizar o estado do botão Confirmar baseado na seleção dos cards
function atualizarEstadoBotaoConfirmar() {
    const selectedCards = document.querySelectorAll('.card-interesse.selecionado').length; // Conta o número de cards selecionados
    const botaoConfirmar = document.getElementById('botao-confirmar');
    botaoConfirmar.disabled = selectedCards === 0; // Desativa o botão Confirmar se nenhum card estiver selecionado
}

// Função para confirmar a seleção e salvar as seleções de interesses antes de redirecionar para a home
function confirmarSelecao() {
    const confirmacao = confirm('Você deseja confirmar suas escolhas?'); // Pergunta ao usuário se ele deseja confirmar as escolhas
    if (confirmacao) { // Se o usuário confirmar
        salvarSelecoes(); // Salva as seleções no Local Storage e no JSON server
        window.location.href = '../Home/Home.html'; // Redireciona para a home
    }
}

// Adiciona função de clique ao botão Pular
document.getElementById('botao-pular').addEventListener('click', function () {
    const confirmacao = confirm('Você tem certeza que deseja pular a pesquisa de interesses?'); // Pergunta ao usuário se ele deseja pular a pesquisa
     if (confirmacao) { // Se o usuário confirmar
        window.location.href = '../Home/Home.html'; // Redireciona para a página inicial
    }
});
