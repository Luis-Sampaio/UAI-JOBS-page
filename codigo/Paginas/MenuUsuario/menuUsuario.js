const JSON_SERVER_URL_EMPREGADORES = 'https://json-uai-jobs.vercel.app/empregadores';
const JSON_SERVER_URL_FREELANCERS = 'https://json-uai-jobs.vercel.app/freelancers';
const JSON_SERVER_URL_ADMIN = 'https://json-uai-jobs.vercel.app/admin';

document.addEventListener('DOMContentLoaded', () => {
    carregaDadosUsuarioCorrente();

    document.getElementById('btnEditaDados').addEventListener('click', () => {
        editaDadosUsuario();
    });
    document.getElementById('btnEditaImagem').addEventListener('click', () => {
        editaImagemUsuario();
    });

    document.getElementById('saveButton').addEventListener('click', () => {
        salvaNovosDados();
    });

    document.getElementById('saveButtonImagem').addEventListener('click', async () => {
        const fileInput = document.getElementById('imagemUsuario');
        const file = fileInput.files[0];

        if (file) {
            const imageUrl = await uploadImagem(file);
            if (imageUrl) {
                let usuarioCorrente = JSON.parse(localStorage.getItem('UsuarioCorrente'));
                if (usuarioCorrente) {
                    usuarioCorrente.imagem = imageUrl;
                    try {
                        const updatedUsuario = await updateUsuario(usuarioCorrente, usuarioCorrente.tipo);
                        localStorage.setItem('UsuarioCorrente', JSON.stringify(updatedUsuario));
                        console.log("URL da imagem salva no usuário corrente e no JSON server");
                        document.getElementById('userImage').src = imageUrl;
                        document.getElementById('divEditaImagemUsuario').classList.add('d-none');
                    } catch (error) {
                        console.error("Erro ao atualizar o usuário:", error);
                    }
                } else {
                    console.error("Nenhum usuário corrente encontrado no local storage");
                }
            }
        } else {
            console.error("Nenhum arquivo selecionado para upload");
        }
    });
});

function carregaDadosUsuarioCorrente() {
    let userData = JSON.parse(localStorage.getItem('UsuarioCorrente'));
    if (userData) {
        document.getElementById('userImage').src = `${userData.imagem}` || 'default.jpg';
        document.getElementById('userName').innerHTML = `${userData.nome}` || 'Nome do Usuário';
        document.getElementById('userEmail').innerHTML = `<strong>E-mail:</strong> ${userData.email}` || 'E-mail';
        document.getElementById('userSenha').innerHTML = `<strong>Senha:</strong> ${userData.senha}` || 'E-mail';
        document.getElementById('userDob').innerHTML = `<strong>Data de Nascimento:</strong> ${userData.dataNascimento || ''}`;
        document.getElementById('userType').innerHTML = `<strong>Tipo de Usuário:</strong> ${userData.tipo || ''}`;
        document.getElementById('userBio').innerHTML = `<strong>Biografia:</strong> ${userData.bio || ''}`;
        document.getElementById('userCpf').innerHTML = `<strong>CPF:</strong> ${userData.cpf || ''}`;
        document.getElementById('userPhone').innerHTML = `<strong>Telefone:</strong> ${userData.telefone || ''}`;
        document.getElementById('userCep').innerHTML = `<strong>CEP:</strong> ${userData.cep || ''}`;
    }
}

function editaDadosUsuario() {
    let userData = JSON.parse(localStorage.getItem('UsuarioCorrente')) || {};

    document.getElementById('userName').innerHTML = `<strong>Nome de Usuário:</strong> <input type="text" id="inputNome" class="form-control" value="${userData.nome || ''}">`;
    document.getElementById('userEmail').innerHTML = `<strong>Email:</strong> <input type="text" id="inputEmail" class="form-control" value="${userData.email|| ''}">`;
    document.getElementById('userSenha').innerHTML = `<strong>Senha:</strong> <input id="inputSenha" class="form-control" value="${userData.senha || ''}"></input>`;
    document.getElementById('userDob').innerHTML = `<strong>Data de Nascimento:</strong> <input type="date" id="inputData" class="form-control" value="${userData.dataNascimento|| ''}">`;
    document.getElementById('userBio').innerHTML = `<strong>Biografia:</strong> <textarea id="inputBio" class="form-control">${userData.bio || ''}</textarea>`;
    document.getElementById('userPhone').innerHTML = `<strong>Telefone:</strong> <input type="number" id="inputTelefone" class="form-control" value="${userData.telefone || ''}">`;
    document.getElementById('userCep').innerHTML = `<strong>CEP:</strong> <input type="number" id="inputCep" class="form-control" value="${userData.cep || ''}">`;

    document.getElementById('saveButton').classList.remove('d-none');
}

function salvaNovosDados(){
    let userData = JSON.parse(localStorage.getItem('UsuarioCorrente'))
    let novoNome = document.getElementById('inputNome').value;
    let novoEmail = document.getElementById('inputEmail').value;
    let novaSenha = document.getElementById('inputSenha').value;
    let novaData = document.getElementById('inputData').value;
    let novaBio = document.getElementById('inputBio').value;
    let novoTelefone = document.getElementById('inputTelefone').value;
    let novoCEP = document.getElementById('inputCep').value;
    let urltipo = "";

    let usuarioAtualizado = {
        id: userData.id,
        nome: novoNome,
        dataNascimento: novaData,
        cpf: userData.cpf,
        telefone: novoTelefone,
        cep: novoCEP,
        linkedin: userData.linkedin,
        email: novoEmail,
        senha: novaSenha,
        interesses: userData.interesses,
        tipo: userData.tipo,
        imagem: userData.imagem,
        bio: novaBio,
        UserPremium: userData.UserPremium
    }

    if(userData.tipo === "admin"){
        urltipo = 'admin'
    }
    else if(userData.tipo === "freelancer"){
        urltipo = 'freelancers'
        usuarioAtualizado.vagasCandidatadas = userData.vagasCandidatadas;
    }
    else if(userData.tipo === "empregador"){
        urltipo = 'empregadores'
        usuarioAtualizado.vagasPublicadas = userData.vagasPublicadas;
    }

    axios.put(`https://json-uai-jobs.vercel.app/${urltipo}/${userData.id}`, usuarioAtualizado)
        .then(response => {
            console.log('Dados do usuário atualizados com sucesso no servidor:', response.data);
            localStorage.setItem('UsuarioCorrente', JSON.stringify(usuarioAtualizado));
        })
        .catch(error => {
            console.error('Erro ao atualizar os dados do usuário no servidor:', error);
        });

    document.getElementById('saveButton').classList.add('d-none');
}

function editaImagemUsuario(){
    let divInputImagem = document.getElementById("divEditaImagemUsuario")
    divInputImagem.classList.remove('d-none');
}

async function uploadImagem(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Imagens'); // Use o nome exato do seu upload preset

    try {
        console.log("Iniciando upload da imagem para Cloudinary");
        const response = await fetch('https://api.cloudinary.com/v1_1/df7rlfmhg/image/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Imagem enviada com sucesso:", data.secure_url);
            return data.secure_url; // URL da imagem
        } else {
            const errorText = await response.text();
            console.error("Erro ao fazer upload da imagem. Status:", response.status, "Mensagem:", errorText);
            throw new Error('Erro ao fazer upload da imagem');
        }
    } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        return null;
    }
}

async function updateUsuario(usuario, tipo) {
    let url = tipo === 'empregador' ? JSON_SERVER_URL_EMPREGADORES : JSON_SERVER_URL_FREELANCERS;
    url += `/${usuario.id}`;

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
    });

    if (response.ok) {
        const data = await response.json();
        console.log("Usuário atualizado com sucesso:", data);
        return data;
    } else {
        const errorText = await response.text();
        console.error("Erro ao atualizar o usuário. Status:", response.status, "Mensagem:", errorText);
        throw new Error('Erro ao atualizar o usuário');
    }
}
