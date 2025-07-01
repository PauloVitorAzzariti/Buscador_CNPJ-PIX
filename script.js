// Tela de login
document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (email === 'acesso@2025' && password === '123456') {
      localStorage.setItem('loggedIn', 'true');
      window.location.href = 'dashboard.html';
    } else {
      alert('Email ou senha incorretos.');
  }

  // Inicializa partículas se houver div
  if (document.getElementById('particles-js')) {
    particlesJS('particles-js', {
      particles: {
        number: { value: 60 },
        color: { value: '#00ffc3' },
        shape: { type: 'circle' },
        opacity: { value: 0.6 },
        size: { value: 3 },
        line_linked: {
          enable: true,
          distance: 120,
          color: '#00ffc3',
          opacity: 0.3,
          width: 1
        },
        move: { enable: true, speed: 2 }
      }
    });
  }
});

// Tela dashboard
if (window.location.pathname.includes('dashboard')) {
  const cnpjForm = document.getElementById('cnpjForm');
  const cnpjInput = document.getElementById('cnpjInput');
  const cnpjListEl = document.getElementById('cnpjList');
  const searchBtn = document.getElementById('searchBtn');
  const resultsContainer = document.getElementById('resultsContainer');
  const cnpjWithPixDiv = document.getElementById('cnpjWithPix');
  const cnpjWithoutPixDiv = document.getElementById('cnpjWithoutPix');
  const printBtn = document.getElementById('printBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  if (localStorage.getItem('loggedIn') !== 'true') {
    window.location.href = 'index.html';
  }

  let cnpjList = [];

  function formatCNPJ(cnpj) {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  }

  cnpjForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let cnpj = cnpjInput.value.trim();
    if (!/^\d{14}$/.test(cnpj)) {
      alert('Digite um CNPJ válido com 14 dígitos numéricos.');
      return;
    }
    if (cnpjList.includes(cnpj)) {
      alert('CNPJ já adicionado.');
      cnpjInput.value = '';
      return;
    }
    cnpjList.push(cnpj);
    renderCNPJList();
    cnpjInput.value = '';
  });

  function renderCNPJList() {
    cnpjListEl.innerHTML = '';
    if (cnpjList.length === 0) {
      cnpjListEl.innerHTML = '<li class="empty-msg">Nenhum CNPJ adicionado.</li>';
      resultsContainer.style.display = 'none';
      printBtn.style.display = 'none';
      return;
    }
    cnpjList.forEach((cnpj, index) => {
      const li = document.createElement('li');
      li.textContent = formatCNPJ(cnpj);
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'X';
      removeBtn.classList.add('remove-btn');
      removeBtn.onclick = () => {
        cnpjList.splice(index, 1);
        renderCNPJList();
        clearResults();
      };
      li.appendChild(removeBtn);
      cnpjListEl.appendChild(li);
    });
  }

  function clearResults() {
    cnpjWithPixDiv.innerHTML = '';
    cnpjWithoutPixDiv.innerHTML = '';
    resultsContainer.style.display = 'none';
    printBtn.style.display = 'none';
  }

  function buscarPix(cnpjs) {
    const comPix = [];
    const semPix = [];

    cnpjs.forEach(cnpj => {
      const ultimoDigito = Number(cnpj.slice(-1));
      if (ultimoDigito % 2 === 0) {
        comPix.push(cnpj);
      } else {
        semPix.push(cnpj);
      }
    });

    return { comPix, semPix };
  }

  function mostrarResultados(resultados) {
    cnpjWithPixDiv.innerHTML = resultados.comPix.length ?
      resultados.comPix.map(c => `<div class="cnpj-item">${formatCNPJ(c)}</div>`).join('') :
      '<div class="empty-msg">Nenhum CNPJ com PIX encontrado.</div>';

    cnpjWithoutPixDiv.innerHTML = resultados.semPix.length ?
      resultados.semPix.map(c => `<div class="cnpj-item">${formatCNPJ(c)}</div>`).join('') :
      '<div class="empty-msg">Nenhum CNPJ sem PIX encontrado.</div>';

    resultsContainer.style.display = 'flex';
    printBtn.style.display = 'inline-block';
  }

  searchBtn.addEventListener('click', () => {
    if (cnpjList.length === 0) {
      alert('Adicione pelo menos um CNPJ para buscar.');
      return;
    }
    const resultados = buscarPix(cnpjList);
    mostrarResultados(resultados);
  });

  printBtn.addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Relatório de CNPJs e PIX', 14, 20);

    doc.setFontSize(14);
    doc.text('CNPJs com PIX cadastrado:', 14, 35);
    let y = 45;
    cnpjWithPixDiv.querySelectorAll('.cnpj-item').forEach(item => {
      doc.text(item.textContent, 20, y);
      y += 8;
    });

    y += 10;
    doc.text('CNPJs sem PIX cadastrado:', 14, y);
    y += 10;
    cnpjWithoutPixDiv.querySelectorAll('.cnpj-item').forEach(item => {
      doc.text(item.textContent, 20, y);
      y += 8;
    });

    doc.save('relatorio_cnpj_pix.pdf');
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('loggedIn');
    window.location.href = 'index.html';
  });

  renderCNPJList();
}
 });
