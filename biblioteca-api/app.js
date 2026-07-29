const API_BASE_URL = 'http://localhost:3000/api';
let authToken = localStorage.getItem('bibliotecaToken');
let usuarioLogado = JSON.parse(localStorage.getItem('bibliotecaUsuario')) || null;
let currentPage = 1;
let totalPages = 1;

function getAuthHeaders() {
  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
}

function showElement(id) {
  document.getElementById(id).classList.remove('hidden');
}

function hideElement(id) {
  document.getElementById(id).classList.add('hidden');
}

function setActiveTab(tab) {
  const loginTab = document.getElementById('tab-login');
  const registerTab = document.getElementById('tab-register');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (tab === 'login') {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  } else {
    loginTab.classList.remove('active');
    registerTab.classList.add('active');
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
  }
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

function mostrarLogin() {
  hideElement('app-container');
  hideElement('user-status-badge');
  hideElement('btn-logout');
  hideElement('user-greeting');
  showElement('auth-card');
}

function mostrarApp() {
  showElement('app-container');
  showElement('user-status-badge');
  showElement('btn-logout');
  showElement('user-greeting');
  hideElement('auth-card');
}

function showError(id, message) {
  const el = document.getElementById(id);
  if (el) el.textContent = message;
}

function showSuccess(id, message) {
  const el = document.getElementById(id);
  if (el) el.textContent = message;
}

function clearMessages() {
  ['login-error', 'register-error', 'register-success', 'book-error', 'book-success'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
}

function updateUserHeader() {
  const badge = document.getElementById('user-status-badge');
  const greeting = document.getElementById('user-greeting');
  if (!usuarioLogado) {
    badge.textContent = '';
    greeting.textContent = '';
    return;
  }

  greeting.textContent = `Olá, ${usuarioLogado.nome} (${usuarioLogado.role})`;
  badge.textContent = 'Conectado';
  badge.className = 'status-badge ativo';
  if (usuarioLogado.role === 'bibliotecario') {
    showElement('admin-panel');
  } else {
    hideElement('admin-panel');
  }
}

async function fazerLogin() {
  clearMessages();
  const email = document.getElementById('login-email').value.trim();
  const senha = document.getElementById('login-senha').value;

  if (!email || !senha) {
    showError('login-error', 'Informe e-mail e senha.');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    if (!response.ok) {
      const err = await response.json();
      showError('login-error', err.erro || 'Falha ao autenticar.');
      return;
    }

    const data = await response.json();
    salvarSessao(data.token, data.usuario);
    setActiveTab('login');
    updateUserHeader();
    mostrarApp();
    carregarLivros();
    carregarEmprestimos();
    if (usuarioLogado.role === 'bibliotecario') {
      carregarAdminLivros();
    }
  } catch (erro) {
    console.error(erro);
    showError('login-error', 'Erro de conexão. Tente novamente.');
  }
}

async function registrarUsuario() {
  clearMessages();
  const nome = document.getElementById('register-nome').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const senha = document.getElementById('register-senha').value;
  const telefone = document.getElementById('register-telefone').value.trim();
  const matricula = document.getElementById('register-matricula').value.trim();

  if (!nome || !email || !senha) {
    showError('register-error', 'Preencha nome, e-mail e senha.');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha, telefone, matricula }),
    });

    if (!response.ok) {
      const err = await response.json();
      showError('register-error', err.erro || 'Falha ao cadastrar.');
      return;
    }

    showSuccess('register-success', 'Cadastro realizado com sucesso. Faça login.');
    document.getElementById('register-nome').value = '';
    document.getElementById('register-email').value = '';
    document.getElementById('register-senha').value = '';
    document.getElementById('register-telefone').value = '';
    document.getElementById('register-matricula').value = '';
  } catch (erro) {
    console.error(erro);
    showError('register-error', 'Erro de conexão. Tente novamente.');
  }
}

function fazerLogout() {
  limparSessao();
  usuarioLogado = null;
  updateUserHeader();
  mostrarLogin();
}

async function carregarLivros(page = 1) {
  if (!usuarioLogado) return;

  const titulo = document.getElementById('search-titulo').value.trim();
  const autor = document.getElementById('search-autor').value.trim();
  const categoria = document.getElementById('search-categoria').value.trim();
  const disponivel = document.getElementById('search-disponivel').checked;

  const params = new URLSearchParams();
  params.set('page', page);
  params.set('limit', 6);
  if (titulo) params.set('titulo', titulo);
  if (autor) params.set('autor', autor);
  if (categoria) params.set('categoria', categoria);
  if (disponivel) params.set('disponivel', 'true');

  try {
    const response = await fetch(`${API_BASE_URL}/livros?${params.toString()}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao carregar livros.');
    }

    const data = await response.json();
    currentPage = data.pagina;
    totalPages = data.totalPaginas;
    document.getElementById('current-page').textContent = currentPage;
    document.getElementById('total-pages').textContent = totalPages;

    const container = document.getElementById('lista-livros');
    container.innerHTML = '';

    if (!Array.isArray(data.items) || data.items.length === 0) {
      container.innerHTML = '<p class="empty-state">Nenhum livro encontrado.</p>';
      return;
    }

    data.items.forEach((livro) => {
      const card = document.createElement('div');
      card.className = 'livro-card';
      const disponivelLivro = livro.quantidadeDisponivel > 0;
      card.innerHTML = `
        <h3>${livro.titulo}</h3>
        <p><strong>Autor:</strong> ${livro.autor}</p>
        <p><strong>Categoria:</strong> ${livro.categoria || '—'}</p>
        <p><strong>ISBN:</strong> ${livro.isbn || '—'}</p>
        <p><strong>Disponível:</strong> ${livro.quantidadeDisponivel} de ${livro.quantidadeTotal}</p>
        <button class="btn-primary" ${!disponivelLivro ? 'disabled' : ''} onclick="emprestarLivro('${livro._id}')">${disponivelLivro ? 'Pegar emprestado' : 'Indisponível'}</button>
      `;
      container.appendChild(card);
    });
  } catch (erro) {
    console.error(erro);
    showAlert('Erro ao carregar livros.');
  }
}

async function carregarEmprestimos() {
  if (!usuarioLogado) return;

  try {
    const response = await fetch(`${API_BASE_URL}/emprestimos`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        fazerLogout();
      }
      throw new Error('Erro ao carregar empréstimos.');
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
      const status = emp.status || 'emprestado';
      item.innerHTML = `
        <div>
          <strong>${tituloLivro}</strong>
          <p>Devolução até: ${dataEntrega}</p>
          <p>Status: ${status}</p>
        </div>
        <button class="btn-secondary" onclick="devolverLivro('${emp._id}')">Devolver</button>
      `;
      lista.appendChild(item);
    });
  } catch (erro) {
    console.error(erro);
  }
}

async function emprestarLivro(livroId) {
  if (!usuarioLogado) return;

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
      const err = await response.json();
      showAlert(err.erro || 'Erro ao emprestar livro.');
      return;
    }

    showAlert('Empréstimo realizado com sucesso!');
    carregarLivros(currentPage);
    carregarEmprestimos();
  } catch (erro) {
    console.error(erro);
    showAlert('Erro ao emprestar livro.');
  }
}

async function devolverLivro(emprestimoId) {
  if (!usuarioLogado) return;

  try {
    const response = await fetch(`${API_BASE_URL}/emprestimos/${emprestimoId}/devolver`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const err = await response.json();
      showAlert(err.erro || 'Erro ao devolver livro.');
      return;
    }

    showAlert('Livro devolvido com sucesso!');
    carregarLivros(currentPage);
    carregarEmprestimos();
  } catch (erro) {
    console.error(erro);
    showAlert('Erro ao devolver livro.');
  }
}

async function adicionarLivro() {
  clearMessages();
  const titulo = document.getElementById('book-titulo').value.trim();
  const autor = document.getElementById('book-autor').value.trim();
  const isbn = document.getElementById('book-isbn').value.trim();
  const categoria = document.getElementById('book-categoria').value.trim();
  const anoPublicacao = parseInt(document.getElementById('book-ano').value, 10);
  const quantidadeTotal = parseInt(document.getElementById('book-quantidade').value, 10);

  if (!titulo || !autor || !isbn || !categoria || !quantidadeTotal) {
    showError('book-error', 'Preencha todos os campos de livro.');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/livros`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ titulo, autor, isbn, categoria, anoPublicacao, quantidadeTotal }),
    });

    if (!response.ok) {
      const err = await response.json();
      showError('book-error', err.erro || 'Erro ao criar livro.');
      return;
    }

    showSuccess('book-success', 'Livro criado com sucesso!');
    document.getElementById('book-titulo').value = '';
    document.getElementById('book-autor').value = '';
    document.getElementById('book-isbn').value = '';
    document.getElementById('book-categoria').value = '';
    document.getElementById('book-ano').value = '';
    document.getElementById('book-quantidade').value = '';
    carregarLivros(currentPage);
    carregarAdminLivros();
  } catch (erro) {
    console.error(erro);
    showError('book-error', 'Erro ao criar livro.');
  }
}

async function carregarAdminLivros() {
  if (!usuarioLogado || usuarioLogado.role !== 'bibliotecario') return;

  try {
    const response = await fetch(`${API_BASE_URL}/livros?page=1&limit=20`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Falha ao carregar livros para admin.');
    }

    const data = await response.json();
    const adminContainer = document.getElementById('admin-livros');
    adminContainer.innerHTML = '';

    if (!Array.isArray(data.items) || data.items.length === 0) {
      adminContainer.innerHTML = '<p>Nenhum livro cadastrado.</p>';
      return;
    }

    data.items.forEach((livro) => {
      const item = document.createElement('div');
      item.className = 'admin-book-item';
      item.innerHTML = `
        <div>
          <strong>${livro.titulo}</strong> <span>(${livro.autor})</span>
          <p>ISBN: ${livro.isbn || '—'} | Categoria: ${livro.categoria || '—'}</p>
          <p>Disponível: ${livro.quantidadeDisponivel}/${livro.quantidadeTotal}</p>
        </div>
        <div class="admin-actions">
          <button class="btn-secondary" onclick="abrirEditarLivro('${livro._id}')">Editar</button>
          <button class="btn-delete" onclick="excluirLivro('${livro._id}')">Excluir</button>
        </div>
      `;
      adminContainer.appendChild(item);
    });
  } catch (erro) {
    console.error(erro);
  }
}

async function excluirLivro(livroId) {
  if (!confirm('Deseja realmente excluir este livro?')) return;

  try {
    const response = await fetch(`${API_BASE_URL}/livros/${livroId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const err = await response.json();
      showAlert(err.erro || 'Erro ao excluir livro.');
      return;
    }

    showAlert('Livro excluído com sucesso!');
    carregarLivros(currentPage);
    carregarAdminLivros();
  } catch (erro) {
    console.error(erro);
    showAlert('Erro ao excluir livro.');
  }
}

async function abrirEditarLivro(livroId) {
  try {
    const response = await fetch(`${API_BASE_URL}/livros/${livroId}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar livro para edição.');
    }

    const livro = await response.json();
    const titulo = prompt('Título:', livro.titulo);
    if (titulo === null) return;
    const autor = prompt('Autor:', livro.autor);
    if (autor === null) return;
    const isbn = prompt('ISBN:', livro.isbn || '');
    if (isbn === null) return;
    const categoria = prompt('Categoria:', livro.categoria || '');
    if (categoria === null) return;
    const anoPublicacao = prompt('Ano de publicação:', livro.anoPublicacao || '');
    if (anoPublicacao === null) return;
    const quantidadeTotal = prompt('Quantidade total:', livro.quantidadeTotal || '1');
    if (quantidadeTotal === null) return;

    const responseUpdate = await fetch(`${API_BASE_URL}/livros/${livroId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ titulo, autor, isbn, categoria, anoPublicacao, quantidadeTotal: parseInt(quantidadeTotal, 10) }),
    });

    if (!responseUpdate.ok) {
      const err = await responseUpdate.json();
      showAlert(err.erro || 'Erro ao atualizar livro.');
      return;
    }

    showAlert('Livro atualizado com sucesso!');
    carregarLivros(currentPage);
    carregarAdminLivros();
  } catch (erro) {
    console.error(erro);
    showAlert('Erro ao editar livro.');
  }
}

function showAlert(message) {
  const secao = document.getElementById('secao-alerta');
  const mensagem = document.getElementById('mensagem-alerta');
  mensagem.textContent = message;
  secao.classList.remove('hidden');
  setTimeout(() => {
    secao.classList.add('hidden');
  }, 4000);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('tab-login').addEventListener('click', () => setActiveTab('login'));
  document.getElementById('tab-register').addEventListener('click', () => setActiveTab('register'));
  document.getElementById('btn-login').addEventListener('click', fazerLogin);
  document.getElementById('btn-register').addEventListener('click', registrarUsuario);
  document.getElementById('btn-logout').addEventListener('click', fazerLogout);
  document.getElementById('btn-search').addEventListener('click', () => carregarLivros(1));
  document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) carregarLivros(currentPage - 1);
  });
  document.getElementById('next-page').addEventListener('click', () => {
    if (currentPage < totalPages) carregarLivros(currentPage + 1);
  });
  document.getElementById('btn-add-book').addEventListener('click', adicionarLivro);

  if (authToken && usuarioLogado) {
    updateUserHeader();
    mostrarApp();
    carregarLivros();
    carregarEmprestimos();
    if (usuarioLogado.role === 'bibliotecario') {
      carregarAdminLivros();
    }
  } else {
    mostrarLogin();
  }
});
