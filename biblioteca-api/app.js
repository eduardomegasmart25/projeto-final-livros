const API_BASE_URL = 'http://localhost:3000/api';
const USUARIO_ID = 'SUBSTITUA_POR_ID_DO_USUARIO';

document.addEventListener('DOMContentLoaded', () => {
  carregarPerfilUsuario();
  carregarLivros();
  carregarEmprestimos();
});


async function carregarPerfilUsuario() {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios/${USUARIO_ID}`);
    if (!response.ok) {
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
    const response = await fetch(`${API_BASE_URL}/livros`);
    if (!response.ok) {
      throw new Error('Erro ao obter lista de livros');
    }

    const dados = await response.json();
    const livros = Array.isArray(dados) ? dados : dados.items || [];

    const container = document.getElementById('lista-livros');
    container.innerHTML = '';

    livros.forEach(livro => {
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
    const response = await fetch(`${API_BASE_URL}/emprestimos?usuarioId=${USUARIO_ID}`);
    if (!response.ok) {
      throw new Error('Erro ao obter empréstimos do usuário');
    }

    const emprestimos = await response.json();
    const lista = document.getElementById('meus-emprestimos');
    lista.innerHTML = '';

    if (!Array.isArray(emprestimos) || emprestimos.length === 0) {
      lista.innerHTML = '<li>Nenhum empréstimo encontrado.</li>';
      return;
    }

    emprestimos.forEach(emp => {
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuarioId: USUARIO_ID, livroId })
    });

    if (response.ok) {
      alert('Empréstimo realizado com sucesso!');
      carregarLivros();
      carregarEmprestimos();
      carregarPerfilUsuario();
    } else {
      const erro = await response.json();
      alert(`Erro: ${erro.erro || erro.mensagem || 'Não foi possível realizar o empréstimo.'}`);
    }
  } catch (erro) {
    console.error('Erro ao emprestar livro:', erro);
  }
}


async function devolverLivro(emprestimoId) {
  try {
    const response = await fetch(`${API_BASE_URL}/emprestimos/${emprestimoId}/devolver`, {
      method: 'PUT'
    });

    if (response.ok) {
      alert('Livro devolvido com sucesso!');
      carregarLivros();
      carregarEmprestimos();
      carregarPerfilUsuario();
    } else {
      const erro = await response.json();
      alert(`Erro: ${erro.erro || 'Erro ao devolver livro.'}`);
    }
  } catch (erro) {
    console.error('Erro ao devolver livro:', erro);
  }
}