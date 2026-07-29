const API_BASE_URL = 'http://localhost:3000/api';
let authToken = localStorage.getItem('bibliotecaToken');
let usuarioLogado = JSON.parse(localStorage.getItem('bibliotecaUsuario')) || null;

function getAuthHeaders() {
  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
}

function mostrarLogin() {
  document.getElementById('login-card').classList.remove('hidden');
  document.getElementById('app-container').classList.add('hidden');
  document.getElementById('status-usuario').classList.add('hidden');
  document.getElementById('btn-logout').classList.add('hidden');
}

function mostrarApp() {
  document.getElementById('login-card').classList.add('hidden');
  document.getElementById('app-container').classList.remove('hidden');
  document.getElementById('status-usuario').classList.remove('hidden');
  document.getElementById('btn-logout').classList.remove('hidden');
}

function salvarSessao(token, usuario) {
  authToken = token;
  usuarioLogado = usuario;
  localStorage.setItem('bibliotecaToken', token);
  localStorage.setItem('bibliotecaUsuario', JSON.stringify(usuario));
}

function limparSessao() {
  authToken = null;
  usuarioLogado = null;
  localStorage.removeItem('bibliotecaToken');
  localStorage.removeItem('bibliotecaUsuario');
}

async function fazerLogin() {
  const email = document.getElementById('login-email').value.trim();
  const senha = document.getElementById('login-senha').value;
  const erroEl = document.getElementById('login-error');

  erroEl.textContent = '';

  if (!email || !senha) {
    erroEl.textContent = 'Informe e-mail e senha para entrar.';
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    if (!response.ok) {
      const erro = await response.json();
      erroEl.textContent = erro.erro || 'Falha ao autenticar.';
      return;
    }

    const data = await response.json();
    salvarSessao(data.token, data.usuario);
    mostrarApp();
    carregarPerfilUsuario();
    carregarLivros();
    carregarEmprestimos();
  } catch (erro) {
    console.error('Erro ao fazer login:', erro);
    erroEl.textContent = 'Erro de conexão. Tente novamente.';
  }
}

function fazerLogout() {
  limparSessao();
  mostrarLogin();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-login').addEventListener('click', fazerLogin);
  document.getElementById('btn-logout').addEventListener('click', fazerLogout);

  if (authToken && usuarioLogado) {
    mostrarApp();
    carregarPerfilUsuario();
    carregarLivros();
    carregarEmprestimos();
  } else {
    mostrarLogin();
  }
});

async function carregarPerfilUsuario() {
  if (!usuarioLogado) return;

  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/${usuarioLogado.id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        fazerLogout();
      }
      throw new Error('Não foi possível buscar o perfil do usuário');
    }

    const usuario = await response.json();
    const statusBadge = document.getElementById('user-status-badge');
    const secaoAlerta = document.getElementById('secao-alerta');
    const mensagemAlerta = document.getElementById('mensagem-alerta');

    if (usuario.ativo === false) {
      statusBadge.textContent = 'Bloqueado';
      statusBadge.className = 'bloqueado';
      secaoAlerta.classList.remove('hidden');
      mensagemAlerta.innerHTML = `Sua conta está <strong>bloqueada</strong>. Entre em contato com a biblioteca.`;
    } else {
      statusBadge.textContent = 'Ativo';
      statusBadge.className = 'ativo';
      secaoAlerta.classList.add('hidden');
    }
  } catch (erro) {
    console.error('Erro ao buscar perfil:', erro);
  }
}

async function carregarLivros() {
  try {
    const response = await fetch(`${API_BASE_URL}/livros`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao obter lista de livros');
    }

    const dados = await response.json();
    const livros = Array.isArray(dados) ? dados : dados.items || [];

    const container = document.getElementById('lista-livros');
    container.innerHTML = '';

    livros.forEach((livro) => {
      const card = document.createElement('div');
      card.className = 'livro-card';
      const disponivel = livro.quantidadeDisponivel > 0;

      card.innerHTML = `
        <h3>${livro.titulo}</h3>
        <p>Autor: ${livro.autor}</p>
        <button
          onclick="emprestarLivro('${livro._id}')"
          ${!disponivel ? 'disabled' : ''}>
          ${disponivel ? 'Pegar Emprestado' : 'Indisponível'}
        </button>
      `;
      container.appendChild(card);
    });
  } catch (erro) {
    console.error('Erro ao carregar livros:', erro);
  }
}

async function carregarEmprestimos() {
  try {
    const response = await fetch(`${API_BASE_URL}/emprestimos`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        fazerLogout();
      }
      throw new Error('Erro ao obter empréstimos do usuário');
    }

    const emprestimos = await response.json();
    const lista = document.getElementById('meus-emprestimos');
    lista.innerHTML = '';

    if (!Array.isArray(emprestimos) || emprestimos.length === 0) {
      lista.innerHTML = '<li>Nenhum empréstimo encontrado.</li>';
      return;
    }

    emprestimos.forEach((emp) => {
      const item = document.createElement('li');
      const dataEntrega = new Date(emp.dataDevolucaoPrevista).toLocaleDateString('pt-BR');
      const tituloLivro = emp.livro?.titulo || 'Livro não disponível';

      item.innerHTML = `
        <span><strong>${tituloLivro}</strong> - Devolução até: ${dataEntrega}</span>
        <button class="btn-devolver" onclick="devolverLivro('${emp._id}')">Devolver</button>
      `;
      lista.appendChild(item);
    });
  } catch (erro) {
    console.error('Erro ao carregar empréstimos:', erro);
  }
}

async function emprestarLivro(livroId) {
  try {
    const response = await fetch(`${API_BASE_URL}/emprestimos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ livroId }),
    });

    if (!response.ok) {
      const erro = await response.json();
      alert(`Erro: ${erro.erro || erro.mensagem || 'Não foi possível realizar o empréstimo.'}`);
      return;
    }

    alert('Empréstimo realizado com sucesso!');
    carregarLivros();
    carregarEmprestimos();
    carregarPerfilUsuario();
  } catch (erro) {
    console.error('Erro ao emprestar livro:', erro);
  }
}

async function devolverLivro(emprestimoId) {
  try {
    const response = await fetch(`${API_BASE_URL}/emprestimos/${emprestimoId}/devolver`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const erro = await response.json();
      alert(`Erro: ${erro.erro || 'Erro ao devolver livro.'}`);
      return;
    }

    alert('Livro devolvido com sucesso!');
    carregarLivros();
    carregarEmprestimos();
    carregarPerfilUsuario();
  } catch (erro) {
    console.error('Erro ao devolver livro:', erro);
  }
}
