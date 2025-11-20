// BANCO DE DADOS E ESTADO DA APLICAÇÃO
// =============================================
let db = {};
let currentUser = null; 

const ICON_LIST = [
    { emoji: "🛍️", color: "#FF8C42" }, { emoji: "💊", color: "#FFC107" },
    { emoji: "🛒", color: "#4CAF50" }, { emoji: "🏠", color: "#E91E63" },
    { emoji: "🚗", color: "#9C27B0" }, { emoji: "🎓", color: "#3F51B5" },
    { emoji: "🍔", color: "#FF5722" }, { emoji: "🎁", color: "#F44336" },
    { emoji: "💼", color: "#009688" }, { emoji: "📈", color: "#8BC34A" },
    { emoji: "🪙", color: "#CDDC39" }, { emoji: "👛", color: "#607D8B" },
    { emoji: "🐷", color: "#FFEB3B" }, { emoji: "💰", color: "#795548" },
    { emoji: "💳", color: "#03A9F4" }, { emoji: "🧮", color: "#9E9E9E" },
    { emoji: "💸", color: "#4CAF50" }, { emoji: "🧾", color: "#2196F3" },
    { emoji: "📊", color: "#FF9800" }, { emoji: "💧", color: "#00BCD4" }
];

// Carrega o banco de dados do localStorage
function loadDb() {
    let dbJson = localStorage.getItem('fincontrol_db');
    if (dbJson) {
        db = JSON.parse(dbJson);
    } else {
        db = {
            users: [],
            categories: [],
            banks: [],
            incomes: [],
            expenses: []
        };
        saveDb();
    }
}

// Salva o banco de dados no localStorage
function saveDb() {
    localStorage.setItem('fincontrol_db', JSON.stringify(db));
}

// =============================================
// VARIÁVEIS GLOBAIS DE ELEMENTOS
// =============================================
let loginForm, registerForm, btnGoToRegister, btnGoToLogin, btnLogout, feedTitle;
let screenLogin, screenRegister, screenHome, screenMenu, screenUser, screenCategory, screenBank, screenIncome, screenExpense;
let navBtnHome, navBtnIncome, navBtnExpense, navBtnMenu, allNavButtons;
let userFormSection, userForm, userSaveButton, profileNameInput, profileEmailInput, profilePhoneInput, profileBirthdateInput, profilePasswordInput;
let categoryFormSection, categoryForm, categorySaveButton, categoryIdInput, categoryNameInput, categoryTypeInput, categoryDescInput, categoryTableBody, clearCategoryFormBtn, categoryIconInput, iconPicker, incomeCategorySelect, bankInitialCategorySelect, expenseCategorySelect, btnAddNewCategory;
let categoryFilterForm, filterCategoryName, clearCategoryFilterBtn, btnToggleCategoryFilter;
let bankFormSection, bankForm, bankSaveButton, bankIdInput, bankNameInput, accountNumberInput, accountTypeInput, initialBalanceInput, initialBalanceDateInput, bankTableBody, clearBankFormBtn, incomeBankSelect, expenseBankSelect, bankCreateOnlyFields, btnAddNewBank;
let bankFilterForm, filterBankName, filterAccountNumber, filterAccountType, clearBankFilterBtn, btnToggleBankFilter;
let incomeFormSection, incomeForm, incomeSaveButton, incomeIdInput, incomeDateInput, incomeCategoryInput, incomeBankInput, incomeDescInput, incomeValueInput, incomeTableBody, clearIncomeFormBtn, btnAddNewIncome;
let incomeFilterForm, filterIncomeStartDate, filterIncomeEndDate, filterIncomeCategory, clearIncomeFilterBtn, btnToggleIncomeFilter;
let expenseFormSection, expenseForm, expenseSaveButton, expenseIdInput, expenseDateInput, expenseCategoryInput, expenseBankInput, expenseDescInput, expenseValueInput, expenseTableBody, clearExpenseFormBtn, btnAddNewExpense;
let expenseFilterForm, filterExpenseStartDate, filterExpenseEndDate, filterExpenseCategory, clearExpenseFilterBtn, btnToggleExpenseFilter;
let transactionFeed, modalOverlay, modalTitle, modalBody, btnCloseModal;

let allFormSections = [];
let allFilterContainers = [];
let allFilterToggleButtons = [];


// =============================================
// FUNÇÕES DE LÓGICA
// =============================================

function handleLogin(event) {
    event.preventDefault();
    const name = document.getElementById('loginName').value;
    const pass = document.getElementById('loginPassword').value;
    const user = db.users.find(u => u.nome === name && u.pass === pass);
    
    if (user) {
        currentUser = user; 
        localStorage.setItem('fincontrol_user', JSON.stringify(user)); 
        initializeApp(); 
    } else {
        alert('Nome de usuário ou senha incorretos.');
    }
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const pass = document.getElementById('registerPassword').value;
    const phone = document.getElementById('registerPhone').value;
    const birthdate = document.getElementById('registerBirthdate').value;
    
    if (db.users.some(u => u.nome === name)) {
        alert('Este nome de usuário já existe. Escolha outro.');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        nome: name,
        pass: pass,
        email: email,
        telefone: phone,
        dataNascimento: birthdate
    };
    db.users.push(newUser);
    saveDb();
    
    currentUser = newUser; 
    localStorage.setItem('fincontrol_user', JSON.stringify(newUser));
    initializeApp(); 
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('fincontrol_user');
    document.getElementById('bottomNav').classList.remove('nav-visible'); 
    navigate(screenLogin);
}

function checkSession() {
    loadDb(); 
    const userJson = localStorage.getItem('fincontrol_user');
    if (userJson) {
        currentUser = JSON.parse(userJson);
        initializeApp();
    } else {
        document.getElementById('bottomNav').classList.remove('nav-visible'); 
        navigate(screenLogin);
    }
}

// =============================================
// INICIALIZAÇÃO DO APP (Após o Login)
// =============================================
function initializeApp() {
    
    // --- ADICIONA OS EVENT LISTENERS ---
    
    // Perfil
    userForm.addEventListener('submit', handleProfileUpdate);
    
    // Categoria
    categoryForm.addEventListener('submit', handleCategorySubmit);
    clearCategoryFormBtn.addEventListener('click', clearCategoryForm);
    btnAddNewCategory.addEventListener('click', () => {
        clearCategoryForm();
        showForm(categoryFormSection, categorySaveButton, 'Salvar');
    });
    categoryFilterForm.addEventListener('submit', handleCategoryFilter);
    clearCategoryFilterBtn.addEventListener('click', clearCategoryFiltersAndRender);
    btnToggleCategoryFilter.addEventListener('click', () => toggleFilter(categoryFilterForm, btnToggleCategoryFilter));

    // Banco
    bankForm.addEventListener('submit', handleBankSubmit);
    clearBankFormBtn.addEventListener('click', clearBankForm);
    btnAddNewBank.addEventListener('click', () => {
        clearBankForm();
        showForm(bankFormSection, bankSaveButton, 'Salvar');
    });
    bankFilterForm.addEventListener('submit', handleBankFilter);
    clearBankFilterBtn.addEventListener('click', clearBankFiltersAndRender);
    btnToggleBankFilter.addEventListener('click', () => toggleFilter(bankFilterForm, btnToggleBankFilter));
    
    // Receita
    incomeForm.addEventListener('submit', handleIncomeSubmit);
    clearIncomeFormBtn.addEventListener('click', clearIncomeForm);
    btnAddNewIncome.addEventListener('click', () => {
        clearIncomeForm();
        showForm(incomeFormSection, incomeSaveButton, 'Salvar');
    });
    incomeFilterForm.addEventListener('submit', handleIncomeFilter);
    clearIncomeFilterBtn.addEventListener('click', clearIncomeFiltersAndRender);
    btnToggleIncomeFilter.addEventListener('click', () => toggleFilter(incomeFilterForm, btnToggleIncomeFilter));
    
    // Despesa
    expenseForm.addEventListener('submit', handleExpenseSubmit);
    clearExpenseFormBtn.addEventListener('click', clearExpenseForm);
    btnAddNewExpense.addEventListener('click', () => {
        clearExpenseForm();
        showForm(expenseFormSection, expenseSaveButton, 'Salvar');
    });
    expenseFilterForm.addEventListener('submit', handleExpenseFilter);
    clearExpenseFilterBtn.addEventListener('click', clearExpenseFiltersAndRender);
    btnToggleExpenseFilter.addEventListener('click', () => toggleFilter(expenseFilterForm, btnToggleExpenseFilter));
    
    // Modal
    btnCloseModal.addEventListener('click', () => modalOverlay.style.display = 'none');
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) modalOverlay.style.display = 'none';
    });
    
    // Navegação
    navBtnHome.addEventListener('click', () => navigate(screenHome, navBtnHome));
    navBtnIncome.addEventListener('click', () => navigate(screenIncome, navBtnIncome));
    navBtnExpense.addEventListener('click', () => navigate(screenExpense, navBtnExpense));
    navBtnMenu.addEventListener('click', () => navigate(screenMenu, navBtnMenu));
    btnGoToUser_fromMenu.addEventListener('click', () => navigate(screenUser, navBtnMenu));
    btnGoToCategory_fromMenu.addEventListener('click', () => navigate(screenCategory, navBtnMenu));
    btnGoToBank_fromMenu.addEventListener('click', () => navigate(screenBank, navBtnMenu));
    btnGoToReports_fromMenu.addEventListener('click', () => alert('Tela de Relatórios em breve!'));
    btnGoToMenu_fromUser.addEventListener('click', () => navigate(screenMenu, navBtnMenu));
    btnGoToMenu_fromCategory.addEventListener('click', () => navigate(screenMenu, navBtnMenu));
    btnGoToMenu_fromBank.addEventListener('click', () => navigate(screenMenu, navBtnMenu));
    btnGoToHome_fromIncome.addEventListener('click', () => navigate(screenHome, navBtnHome));
    btnGoToHome_fromExpense.addEventListener('click', () => navigate(screenHome, navBtnHome));
    
    // --- FINALIZA A INICIALIZAÇÃO ---
    
    document.getElementById('bottomNav').classList.add('nav-visible');
    feedTitle.textContent = `Transações de ${currentUser.nome}`;
    
    // Renderiza tudo
    renderCategoryTable();
    renderBankTable();
    renderIncomeTable();
    renderExpenseTable();
    renderTransactionFeed();
    
    populateIconPicker();
    populateBankDropdown(incomeBankSelect);
    populateBankDropdown(expenseBankSelect);
    
    navigate(screenHome, navBtnHome);
}


// =============================================
// LÓGICA DO CRUD DE USUÁRIO (MEU PERFIL)
// =============================================
function loadUserProfile() {
    if (!currentUser) return;
    profileNameInput.value = currentUser.nome;
    profileEmailInput.value = currentUser.email || '';
    profilePhoneInput.value = currentUser.telefone || '';
    profileBirthdateInput.value = currentUser.dataNascimento || '';
    profilePasswordInput.value = ""; 
}

function handleProfileUpdate(event) {
    event.preventDefault();
    const userInDb = db.users.find(u => u.id === currentUser.id);
    if (!userInDb) return;
    userInDb.email = profileEmailInput.value;
    userInDb.telefone = profilePhoneInput.value;
    userInDb.dataNascimento = profileBirthdateInput.value;
    if (profilePasswordInput.value) { 
        userInDb.pass = profilePasswordInput.value;
    }
    currentUser = userInDb;
    localStorage.setItem('fincontrol_user', JSON.stringify(currentUser));
    saveDb();
    alert('Perfil atualizado com sucesso!');
    navigate(screenMenu, navBtnMenu); 
}


// =============================================
// LÓGICA DO CRUD DE CATEGORIA
// =============================================
let currentCategoryId = null;

function populateIconPicker() {
    if (!iconPicker) return;
    iconPicker.innerHTML = "";
    ICON_LIST.forEach(iconData => {
        const iconSpan = document.createElement('span');
        iconSpan.className = "icon-option";
        iconSpan.textContent = iconData.emoji;
        iconSpan.style.backgroundColor = iconData.color;
        iconSpan.dataset.icon = iconData.emoji;
        iconPicker.appendChild(iconSpan);
    });
    addIconPickerEvents();
}

function addIconPickerEvents() {
    const iconOptions = iconPicker.querySelectorAll('.icon-option');
    iconOptions.forEach(icon => {
        icon.addEventListener('click', () => {
            if (icon.classList.contains('selected')) {
                icon.classList.remove('selected');
                categoryIconInput.value = "";
            } else {
                iconOptions.forEach(opt => opt.classList.remove('selected'));
                icon.classList.add('selected');
                categoryIconInput.value = icon.dataset.icon;
            }
        });
    });
}

function handleCategorySubmit(event) {
    event.preventDefault();
    if (currentCategoryId) {
        const category = db.categories.find(c => c.id === currentCategoryId && c.userId === currentUser.id);
        category.nome = categoryNameInput.value;
        category.tipo = categoryTypeInput.value;
        category.desc = categoryDescInput.value;
        category.icon = categoryIconInput.value;
    } else {
        const newCategory = { 
            id: Date.now(), 
            userId: currentUser.id, 
            nome: categoryNameInput.value, 
            tipo: categoryTypeInput.value, 
            desc: categoryDescInput.value,
            icon: categoryIconInput.value
        };
        db.categories.push(newCategory);
    }
    saveDb();
    clearCategoryForm();
    renderCategoryTable();
}

function renderCategoryTable() {
    categoryTableBody.innerHTML = "";
    const filterName = filterCategoryName ? filterCategoryName.value.toLowerCase() : "";

    let userCategories = db.categories.filter(c => c.userId === currentUser.id);

    if (filterName) { // [RF6]
        userCategories = userCategories.filter(c => c.nome.toLowerCase().includes(filterName));
    }

    userCategories.sort((a, b) => a.nome.localeCompare(b.nome)); // [RF6]

    if (userCategories.length === 0) {
        categoryTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">Nenhuma categoria encontrada para este filtro.</td></tr>';
    } else {
        userCategories.forEach(category => {
            const row = document.createElement('tr');
            row.setAttribute('data-id', category.id); 
            const iconData = ICON_LIST.find(i => i.emoji === category.icon);
            const iconChip = iconData 
                ? `<span class="icon-chip" style="background-color: ${iconData.color};">${iconData.emoji}</span>`
                : '';
            row.innerHTML = `
                <td class="icon-cell">${iconChip}</td>
                <td>${category.nome}</td>
                <td>${category.tipo}</td>
                <td>${category.desc}</td>
                <td>
                    <div class="button-group">
                        <button class="edit" onclick="startEditCategory(${category.id})">Editar</button>
                        <button class="remover" onclick="deleteCategory(${category.id})">Remover</button>
                    </div>
                </td>`;
            categoryTableBody.appendChild(row);
        });
    }
    
    populateCategoryDropdown(incomeCategorySelect, 'Receita');
    populateCategoryDropdown(bankInitialCategorySelect, 'Receita');
    populateCategoryDropdown(expenseCategorySelect, 'Despesa');
    if (filterIncomeCategory) {
        populateCategoryDropdown(filterIncomeCategory, 'Receita');
    }
    if (filterExpenseCategory) {
        populateCategoryDropdown(filterExpenseCategory, 'Despesa');
    }
}
function startEditCategory(id) {
    const category = db.categories.find(c => c.id === id && c.userId === currentUser.id);
    currentCategoryId = category.id;
    categoryIdInput.value = category.id;
    categoryNameInput.value = category.nome;
    categoryTypeInput.value = category.tipo;
    categoryDescInput.value = category.desc;
    categoryIconInput.value = category.icon; 
    
    const iconOptions = iconPicker.querySelectorAll('.icon-option');
    iconOptions.forEach(opt => {
        if (opt.dataset.icon === category.icon) {
            opt.classList.add('selected');
        } else {
            opt.classList.remove('selected');
        }
    });
    showForm(categoryFormSection, categorySaveButton, 'Atualizar');
}
function deleteCategory(id) {
    db.categories = db.categories.filter(c => c.id !== id || c.userId !== currentUser.id);
    saveDb();
    renderCategoryTable();
}
function clearCategoryForm() {
    categoryForm.reset();
    currentCategoryId = null;
    categoryIdInput.value = "";
    categoryIconInput.value = "";
    iconPicker.querySelectorAll('.icon-option').forEach(opt => opt.classList.remove('selected'));
    categoryFormSection.classList.remove('is-visible');
}

function handleCategoryFilter(event) {
    event.preventDefault();
    renderCategoryTable();
}

function clearCategoryFiltersAndRender() {
    categoryFilterForm.reset();
    renderCategoryTable();
}

// =============================================
// LÓGICA DO CRUD DE BANCO
// =============================================
let currentBankId = null;

function handleBankSubmit(event) {
    event.preventDefault();
    if (currentBankId) {
        const bank = db.banks.find(b => b.id === currentBankId && b.userId === currentUser.id);
        bank.nome = bankNameInput.value;
        bank.conta = accountNumberInput.value;
        bank.tipo = accountTypeInput.value;
    } else {
        const initialBalance = parseFloat(initialBalanceInput.value);
        const newBank = {
            id: Date.now(),
            userId: currentUser.id,
            nome: bankNameInput.value,
            conta: accountNumberInput.value,
            tipo: accountTypeInput.value,
            saldo: 0.00
        };
        
        if (initialBalance > 0) {
            const selectedCategoryId = parseInt(bankInitialCategorySelect.value);
            const newIncome = {
                id: Date.now(),
                userId: currentUser.id,
                data: initialBalanceDateInput.value, 
                categoriaId: selectedCategoryId ? selectedCategoryId : null,
                bancoId: newBank.id,
                desc: "Saldo Inicial",
                valor: initialBalance
            };
            db.incomes.push(newIncome);
            newBank.saldo += initialBalance;
        }
        db.banks.push(newBank);
        renderIncomeTable();
    }
    saveDb();
    clearBankForm();
    renderBankTable();
}

function renderBankTable() {
    bankTableBody.innerHTML = "";

    const filterName = filterBankName ? filterBankName.value.toLowerCase() : "";
    const filterAccountNum = filterAccountNumber ? filterAccountNumber.value : "";
    const filterType = filterAccountType ? filterAccountType.value : "";

    let userBanks = db.banks.filter(b => b.userId === currentUser.id);

    if (filterName) { // [RF18]
        userBanks = userBanks.filter(b => b.nome.toLowerCase().includes(filterName));
    }
    if (filterAccountNum) { // [RF18]
        userBanks = userBanks.filter(b => b.conta.includes(filterAccountNum));
    }
    if (filterType) { // [RF18]
        userBanks = userBanks.filter(b => b.tipo === filterType);
    }

    userBanks.sort((a, b) => a.nome.localeCompare(b.nome)); // [RF18]

    if (userBanks.length === 0) {
        bankTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">Nenhum banco encontrado para estes filtros.</td></tr>';
    } else {
        userBanks.forEach(bank => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${bank.nome}</td>
                <td>${bank.conta}</td>
                <td>${bank.tipo}</td>
                <td>R$ ${bank.saldo.toFixed(2)}</td>
                <td>
                    <div class="button-group">
                        <button class="edit" onclick="startEditBank(${bank.id})">Editar</button>
                        <button class="remover" onclick="deleteBank(${bank.id})">Remover</button>
                    </div>
                </td>`;
            bankTableBody.appendChild(row);
        });
    }
    
    populateBankDropdown(incomeBankSelect);
    populateBankDropdown(expenseBankSelect);
}
function startEditBank(id) {
    const bank = db.banks.find(b => b.id === id && b.userId === currentUser.id);
    currentBankId = bank.id;
    bankIdInput.value = bank.id;
    bankNameInput.value = bank.nome;
    accountNumberInput.value = bank.conta;
    accountTypeInput.value = bank.tipo;
    bankCreateOnlyFields.style.display = 'none';
    showForm(bankFormSection, bankSaveButton, 'Atualizar');
}
function deleteBank(id) {
    const hasIncome = db.incomes.some(i => i.bancoId === id && i.userId === currentUser.id);
    const hasExpense = db.expenses.some(e => e.bancoId === id && e.userId === currentUser.id);
    if (hasIncome || hasExpense) {
        alert('Não é possível remover este banco pois ele possui receitas ou despesas associadas.');
        return;
    }
    db.banks = db.banks.filter(b => b.id !== id || b.userId !== currentUser.id);
    saveDb();
    renderBankTable();
}
function clearBankForm() {
    bankForm.reset();
    currentBankId = null;
    bankIdInput.value = "";
    bankCreateOnlyFields.style.display = 'block';
    bankFormSection.classList.remove('is-visible');
    initialBalanceDateInput.value = new Date().toISOString().split('T')[0];
}

function handleBankFilter(event) {
    event.preventDefault();
    renderBankTable();
}

function clearBankFiltersAndRender() {
    bankFilterForm.reset();
    renderBankTable();
}


// =============================================
// LÓGICA DO CRUD DE RECEITA
// =============================================
let currentIncomeId = null;

function handleIncomeSubmit(event) {
    event.preventDefault();
    const incomeValue = parseFloat(incomeValueInput.value);
    const bankId = parseInt(incomeBankInput.value);
    
    if (currentIncomeId) {
        const income = db.incomes.find(i => i.id === currentIncomeId && i.userId === currentUser.id);
        const oldBank = db.banks.find(b => b.id === income.bancoId && b.userId === currentUser.id);
        oldBank.saldo -= income.valor; 
        
        income.data = incomeDateInput.value;
        income.categoriaId = parseInt(incomeCategoryInput.value);
        income.bancoId = bankId;
        income.desc = incomeDescInput.value;
        income.valor = incomeValue;
        const newBank = db.banks.find(b => b.id === bankId && b.userId === currentUser.id);
        newBank.saldo += incomeValue;
    } else {
        const newIncome = {
            id: Date.now(),
            userId: currentUser.id,
            data: incomeDateInput.value,
            categoriaId: parseInt(incomeCategoryInput.value),
            bancoId: bankId,
            desc: incomeDescInput.value,
            valor: incomeValue
        };
        db.incomes.push(newIncome);
        const bank = db.banks.find(b => b.id === bankId && b.userId === currentUser.id);
        bank.saldo += incomeValue;
    }
    saveDb();
    clearIncomeForm();
    renderIncomeTable();
    renderBankTable();
}

function renderIncomeTable() {
    incomeTableBody.innerHTML = "";
    const startDate = filterIncomeStartDate.value;
    const endDate = filterIncomeEndDate.value;
    const categoryId = filterIncomeCategory.value;

    let filteredIncomes = db.incomes.filter(i => i.userId === currentUser.id);

    if (startDate) {
        filteredIncomes = filteredIncomes.filter(i => i.data >= startDate);
    }
    if (endDate) {
        filteredIncomes = filteredIncomes.filter(i => i.data <= endDate);
    }
    if (categoryId) {
        filteredIncomes = filteredIncomes.filter(i => i.categoriaId === parseInt(categoryId));
    }

    const userIncomes = filteredIncomes.sort((a, b) => new Date(a.data) - new Date(b.data));

    if (userIncomes.length === 0) {
        incomeTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Nenhuma receita encontrada para estes filtros.</td></tr>';
    } else {
        userIncomes.forEach(income => {
            const category = db.categories.find(c => c.id === income.categoriaId && c.userId === currentUser.id);
            const bank = db.banks.find(b => b.id === income.bancoId && b.userId === currentUser.id);
            
            let categoryDisplay = 'N/A';
            if(category) {
                const iconData = ICON_LIST.find(i => i.emoji === category.icon);
                const iconChip = iconData 
                    ? `<span class="icon-chip" style="background-color: ${iconData.color};">${iconData.emoji}</span>` 
                    : '';
                categoryDisplay = `${iconChip} ${category.nome}`.trim();
            } else if (income.categoriaId === null && income.desc === "Saldo Inicial") {
                 const iconData = ICON_LIST.find(i => i.emoji === "💰");
                 categoryDisplay = `<span class="icon-chip" style="background-color: ${iconData.color};">${iconData.emoji}</span> Saldo Inicial`;
            }
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(income.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                <td>${income.desc}</td>
                <td>${categoryDisplay}</td>
                <td>${bank ? bank.nome : 'N/A'}</td>
                <td>R$ ${income.valor.toFixed(2)}</td>
                <td>
                    <div class="button-group">
                        <button class="edit" onclick="startEditIncome(${income.id})">Editar</button>
                        <button class="remover" onclick="deleteIncome(${income.id})">Remover</button>
                    </div>
                </td>`;
            incomeTableBody.appendChild(row);
        });
    }
    
    renderTransactionFeed(); 
}
function startEditIncome(id) {
    const income = db.incomes.find(i => i.id === id && i.userId === currentUser.id);
    currentIncomeId = income.id;
    incomeIdInput.value = income.id;
    incomeDateInput.value = income.data;
    incomeCategoryInput.value = income.categoriaId;
    incomeBankInput.value = income.bancoId;
    incomeDescInput.value = income.desc;
    incomeValueInput.value = income.valor;
    showForm(incomeFormSection, incomeSaveButton, 'Atualizar');
}
function deleteIncome(id) {
    const income = db.incomes.find(i => i.id === id && i.userId === currentUser.id);
    const bank = db.banks.find(b => b.id === income.bancoId && b.userId === currentUser.id);
    bank.saldo -= income.valor;
    db.incomes = db.incomes.filter(i => i.id !== id || i.userId !== currentUser.id);
    saveDb();
    renderIncomeTable();
    renderBankTable();
}
function clearIncomeForm() {
    incomeForm.reset();
    currentIncomeId = null;
    incomeIdInput.value = "";
    incomeDateInput.value = new Date().toISOString().split('T')[0];
    incomeFormSection.classList.remove('is-visible');
}

function handleIncomeFilter(event) {
    event.preventDefault();
    renderIncomeTable();
}

function clearIncomeFiltersAndRender() {
    incomeFilterForm.reset();
    renderIncomeTable();
}

// =============================================
// LÓGICA DO CRUD DE DESPESA
// =============================================
let currentExpenseId = null;

function handleExpenseSubmit(event) {
    event.preventDefault();
    const expenseValue = parseFloat(expenseValueInput.value);
    const bankId = parseInt(expenseBankInput.value);
    
    if (currentExpenseId) {
        const expense = db.expenses.find(e => e.id === currentExpenseId && e.userId === currentUser.id);
        const oldBank = db.banks.find(b => b.id === expense.bancoId && b.userId === currentUser.id);
        oldBank.saldo += expense.valor; 
        
        expense.data = expenseDateInput.value;
        expense.categoriaId = parseInt(expenseCategoryInput.value);
        expense.bancoId = bankId;
        expense.desc = expenseDescInput.value;
        expense.valor = expenseValue;

        const newBank = db.banks.find(b => b.id === bankId && b.userId === currentUser.id);
        newBank.saldo -= expenseValue;
    } else {
        const newExpense = {
            id: Date.now(),
            userId: currentUser.id,
            data: expenseDateInput.value,
            categoriaId: parseInt(expenseCategoryInput.value),
            bancoId: bankId,
            desc: expenseDescInput.value,
            valor: expenseValue
        };
        db.expenses.push(newExpense);
        const bank = db.banks.find(b => b.id === bankId && b.userId === currentUser.id);
        bank.saldo -= expenseValue;
    }
    saveDb();
    clearExpenseForm();
    renderExpenseTable();
    renderBankTable(); 
}

function renderExpenseTable() {
    expenseTableBody.innerHTML = "";
    const startDate = filterExpenseStartDate.value;
    const endDate = filterExpenseEndDate.value;
    const categoryId = filterExpenseCategory.value;

    let filteredExpenses = db.expenses.filter(e => e.userId === currentUser.id);

    if (startDate) {
        filteredExpenses = filteredExpenses.filter(e => e.data >= startDate);
    }
    if (endDate) {
        filteredExpenses = filteredExpenses.filter(e => e.data <= endDate);
    }
    if (categoryId) {
        filteredExpenses = filteredExpenses.filter(e => e.categoriaId === parseInt(categoryId));
    }

    const userExpenses = filteredExpenses.sort((a, b) => new Date(a.data) - new Date(b.data));

    if (userExpenses.length === 0) {
        expenseTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Nenhuma despesa encontrada para estes filtros.</td></tr>';
    } else {
        userExpenses.forEach(expense => {
            const category = db.categories.find(c => c.id === expense.categoriaId && c.userId === currentUser.id);
            const bank = db.banks.find(b => b.id === expense.bancoId && b.userId === currentUser.id);
            
            let categoryDisplay = 'N/A';
            if(category) {
                const iconData = ICON_LIST.find(i => i.emoji === category.icon);
                const iconChip = iconData 
                    ? `<span class="icon-chip" style="background-color: ${iconData.color};">${iconData.emoji}</span>` 
                    : '';
                categoryDisplay = `${iconChip} ${category.nome}`.trim();
            }
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(expense.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</td>
                <td>${expense.desc}</td>
                <td>${categoryDisplay}</td>
                <td>${bank ? bank.nome : 'N/A'}</td>
                <td>R$ ${expense.valor.toFixed(2)}</td>
                <td>
                    <div class="button-group">
                        <button class="edit" onclick="startEditExpense(${expense.id})">Editar</button>
                        <button class="remover" onclick="deleteExpense(${expense.id})">Remover</button>
                    </div>
                </td>`;
            expenseTableBody.appendChild(row);
        });
    }
    
    renderTransactionFeed();
}
function startEditExpense(id) {
    const expense = db.expenses.find(e => e.id === id && e.userId === currentUser.id);
    currentExpenseId = expense.id;
    expenseIdInput.value = expense.id;
    expenseDateInput.value = expense.data;
    expenseCategoryInput.value = expense.categoriaId;
    expenseBankInput.value = expense.bancoId;
    expenseDescInput.value = expense.desc;
    expenseValueInput.value = expense.valor;
    showForm(expenseFormSection, expenseSaveButton, 'Atualizar');
}
function deleteExpense(id) {
    const expense = db.expenses.find(e => e.id === id && e.userId === currentUser.id);
    const bank = db.banks.find(b => b.id === expense.bancoId && b.userId === currentUser.id);
    bank.saldo += expense.valor;
    db.expenses = db.expenses.filter(e => e.id !== id || e.userId !== currentUser.id);
    saveDb();
    renderExpenseTable();
    renderBankTable();
}
function clearExpenseForm() {
    expenseForm.reset();
    currentExpenseId = null;
    expenseIdInput.value = "";
    expenseDateInput.value = new Date().toISOString().split('T')[0];
    expenseFormSection.classList.remove('is-visible');
}

function handleExpenseFilter(event) {
    event.preventDefault();
    renderExpenseTable();
}

function clearExpenseFiltersAndRender() {
    expenseFilterForm.reset();
    renderExpenseTable();
}


// =============================================
// LÓGICA DO FEED E DO PAINEL INICIAL
// =============================================

function formatFeedDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: '2-digit', weekday: 'short', timeZone: 'UTC' };
    let formatted = new Intl.DateTimeFormat('pt-BR', options).format(date);
    formatted = formatted.replace(',', '').replace('.', '');
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

// (ATUALIZADO) Modificado para mostrar "Saldo do Dia: R$ VALOR"
function renderFeed(element, transactionList, options = {}) {
    element.innerHTML = ""; 
    
    // (NOVO) Pega o saldo inicial se for o modo 'running-balance'
    let currentRunningBalance = options.startingBalance || 0;

    const grouped = transactionList.reduce((acc, trans) => {
        const dateKey = formatFeedDate(trans.data);
        if (!acc[dateKey]) {
            acc[dateKey] = { transactions: [], income: 0, expense: 0 };
        }
        acc[dateKey].transactions.push(trans);
        if(trans.tipo === 'income') acc[dateKey].income += trans.valor;
        else acc[dateKey].expense += trans.valor;
        return acc;
    }, {});
    
    if (transactionList.length === 0) {
        element.innerHTML = '<p class="subtitle">Nenhuma transação encontrada.</p>';
        return;
    }
    
    for (const dateKey in grouped) {
        const group = grouped[dateKey];
        
        // (NOVO) Lógica de cálculo do cabeçalho
        let headerSummaryHTML = '';
        const dailyNet = group.income - group.expense;

        if (options.mode === 'running-balance') {
            // MODO: SALDO ACUMULADO (para a Home)
            let balanceClass = currentRunningBalance >= 0 ? 'income' : 'expense';
            headerSummaryHTML = `
                <span class="daily-summary">
                    <span class="${balanceClass}">
                        Saldo: R$ ${currentRunningBalance.toFixed(2)}
                    </span>
                </span>
            `;
            // Atualiza o saldo para o próximo loop (dia anterior)
            currentRunningBalance -= dailyNet;
        } else {
            // MODO: SALDO DO DIA (Padrão, para o Modal)
            let netClass = dailyNet > 0 ? 'income' : (dailyNet < 0 ? 'expense' : '');
            let netPrefix = dailyNet > 0 ? '+' : '';
            headerSummaryHTML = `
                <span class="daily-summary">
                    <span class="${netClass}">
                        Saldo do Dia: ${netPrefix} R$ ${dailyNet.toFixed(2)}
                    </span>
                </span>
            `;
        }
        // Fim da nova lógica
        
        let itemsHTML = "";
        
        group.transactions.forEach(trans => {
            const category = db.categories.find(c => c.id === trans.categoriaId && c.userId === currentUser.id);
            
            let iconData = null;
            let categoryName = trans.desc;
            
            if (category) {
                iconData = ICON_LIST.find(i => i.emoji === category.icon);
                categoryName = category.nome;
            } else if (trans.desc === "Saldo Inicial") {
                iconData = ICON_LIST.find(i => i.emoji === "💰");
                categoryName = "Saldo Inicial";
            }
            
            const iconChip = iconData
                ? `<span class="icon-chip feed" style="background-color: ${iconData.color};">${iconData.emoji}</span>`
                : `<span class="icon-chip feed" style="background-color: var(--border-color);"></span>`;
            
            const valorClass = trans.tipo === 'income' ? 'income' : 'expense';
            const valorPrefix = trans.tipo === 'income' ? '+' : '-';
            
            const clickAction = (element === transactionFeed && trans.categoriaId) ? `onclick="showCategoryExtract(${trans.categoriaId})"` : '';
            
            itemsHTML += `
                <div class="feed-item" ${clickAction}>
                    <div class="feed-item-left">
                        ${iconChip}
                        <div class="feed-item-details">
                            <h4>${categoryName}</h4>
                            <p>${trans.desc}</p>
                        </div>
                    </div>
                    <span class="feed-item-value ${valorClass}">
                        ${valorPrefix} R$ ${trans.valor.toFixed(2)}
                    </span>
                </div>
            `;
        });
        
        // (ATUALIZADO) Insere o HTML do cabeçalho
        const groupHTML = `
            <div class="feed-date-group">
                <div class="feed-date-header">
                    <span>${dateKey}</span>
                    ${headerSummaryHTML}
                </div>
                ${itemsHTML}
            </div>
        `;
        element.innerHTML += groupHTML;
    }
}

// (ATUALIZADO) Esta função agora calcula e passa o saldo total
function renderTransactionFeed() {
    const userIncomes = db.incomes.filter(i => i.userId === currentUser.id);
    const userExpenses = db.expenses.filter(e => e.userId === currentUser.id);
    
    const mappedIncomes = userIncomes.map(income => ({ ...income, tipo: 'income' }));
    const mappedExpenses = userExpenses.map(expense => ({ ...expense, tipo: 'expense' }));
    
    const allTransactions = [...mappedIncomes, ...mappedExpenses]
        .sort((a, b) => new Date(b.data) - new Date(a.data));
        
    // (NOVO) Calcular o saldo total atual
    const userBanks = db.banks.filter(b => b.userId === currentUser.id);
    const totalBalance = userBanks.reduce((acc, bank) => acc + bank.saldo, 0);
        
    // (ATUALIZADO) Passa o saldo total e o novo modo
    renderFeed(transactionFeed, allTransactions, { mode: 'running-balance', startingBalance: totalBalance }); 
}

function showCategoryExtract(categoryId) {
    if (!categoryId) return; 
    
    const category = db.categories.find(c => c.id === categoryId && c.userId === currentUser.id);
    if (!category) return; 
    
    const iconData = ICON_LIST.find(i => i.emoji === category.icon);
    const iconChip = iconData 
        ? `<span class="icon-chip feed" style="background-color: ${iconData.color};">${iconData.emoji}</span>`
        : '';
    modalTitle.innerHTML = `${iconChip} Extrato: ${category.nome}`;
    
    const categoryIncomes = db.incomes
        .filter(i => i.categoriaId === categoryId && i.userId === currentUser.id)
        .map(i => ({ ...i, tipo: 'income' }));
        
    const categoryExpenses = db.expenses
        .filter(e => e.categoriaId === categoryId && e.userId === currentUser.id)
        .map(e => ({ ...e, tipo: 'expense' }));
        
    const categoryTransactions = [...categoryIncomes, ...categoryExpenses]
        .sort((a, b) => new Date(b.data) - new Date(a.data));
    
    // (ATUALIZADO) Chama renderFeed sem opções, para manter o 'Saldo do Dia'
    renderFeed(modalBody, categoryTransactions); 
    
    modalOverlay.style.display = 'block';
}


// =============================================
// LÓGICA DE DROPDOWNS DINÂMICOS
// =============================================
function populateCategoryDropdown(selectElement, type) { 
    if (!selectElement) return;
    const firstOption = selectElement.options[0];
    selectElement.innerHTML = "";
    if (firstOption) {
        selectElement.appendChild(firstOption); 
    }

    const filteredCategories = db.categories.filter(c => c.tipo === type && c.userId === currentUser.id);
    
    filteredCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        const iconData = ICON_LIST.find(i => i.emoji === category.icon);
        option.textContent = iconData ? `${iconData.emoji} ${category.nome}` : category.nome;
        selectElement.appendChild(option);
    });
}
function populateBankDropdown(selectElement) {
    if (!selectElement) return;
    const firstOption = selectElement.options[0];
    selectElement.innerHTML = "";
    if (firstOption) {
        selectElement.appendChild(firstOption);
    }

    const userBanks = db.banks.filter(b => b.userId === currentUser.id);
    
    userBanks.forEach(bank => {
        const option = document.createElement('option');
        option.value = bank.id;
        option.textContent = `${bank.nome} (Conta: ${bank.conta})`;
        selectElement.appendChild(option);
    });
}

// =============================================
// FUNÇÕES GLOBAIS DE FORMULÁRIO E FILTRO
// =============================================

function hideAllForms() {
    allFormSections.forEach(form => {
        if(form) form.classList.remove('is-visible');
    });
}

function showForm(formSection, saveButton, title) {
    hideAllForms(); 
    hideAllFilters();
    if(formSection) {
        formSection.classList.add('is-visible');
        if (saveButton) {
            saveButton.textContent = title;
        }
        formSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function hideAllFilters() {
    allFilterContainers.forEach(form => {
        if (form) form.classList.remove('is-visible');
    });
    allFilterToggleButtons.forEach(button => {
        if (button) button.classList.remove('active');
    });
}

function toggleFilter(filterContainer, toggleButton) {
    allFilterContainers.forEach(form => {
        if (form && form !== filterContainer) {
            form.classList.remove('is-visible');
        }
    });
    allFilterToggleButtons.forEach(button => {
        if (button && button !== toggleButton) {
            button.classList.remove('active');
        }
    });

    const isVisible = filterContainer.classList.toggle('is-visible');
    toggleButton.classList.toggle('active', isVisible);
    
    if (isVisible) {
        hideAllForms();
    }
}


// =============================================
// INICIALIZAÇÃO E NAVEGAÇÃO
// =============================================
function navigate(activeScreen, activeNavBtn = null) {
    hideAllForms(); 
    hideAllFilters();
    
    const allScreens = [screenLogin, screenRegister, screenHome, screenMenu, screenUser, screenCategory, screenBank, screenIncome, screenExpense];
    allScreens.forEach(s => {
        if (s) s.classList.remove('active');
    });
    
    if(allNavButtons) { 
        allNavButtons.forEach(b => b.classList.remove('active'));
    }
    
    if (activeScreen) {
        activeScreen.classList.add('active');
    }
    if (activeNavBtn) {
        activeNavBtn.classList.add('active');
    }
    
    if (activeScreen === screenHome) {
        renderTransactionFeed();
    }
    
    if (activeScreen === screenUser) {
        loadUserProfile(); 
        if (userFormSection) userFormSection.classList.add('is-visible');
    }

    if (activeScreen === screenCategory) {
        if (categoryFilterForm) categoryFilterForm.reset();
        renderCategoryTable();
    }
    if (activeScreen === screenIncome) {
        incomeDateInput.value = new Date().toISOString().split('T')[0];
        if (incomeFilterForm) incomeFilterForm.reset(); 
        renderIncomeTable();
    }
    if (activeScreen === screenExpense) {
        expenseDateInput.value = new Date().toISOString().split('T')[0];
        if (expenseFilterForm) expenseFilterForm.reset();
        renderExpenseTable();
    }
    if (activeScreen === screenBank) {
        initialBalanceDateInput.value = new Date().toISOString().split('T')[0];
        if (bankFilterForm) bankFilterForm.reset();
        renderBankTable();
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =============================================
// EVENT LISTENER DO DOM
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    
    // Popula todas as variáveis de elementos
    loginForm = document.getElementById('loginForm');
    registerForm = document.getElementById('registerForm');
    btnGoToRegister = document.getElementById('btnGoToRegister');
    btnGoToLogin = document.getElementById('btnGoToLogin');
    btnLogout = document.getElementById('btnLogout');
    feedTitle = document.getElementById('feedTitle');
    screenLogin = document.getElementById('screenLogin');
    screenRegister = document.getElementById('screenRegister');
    screenHome = document.getElementById('screenHome');
    screenMenu = document.getElementById('screenMenu');
    screenUser = document.getElementById('screenUser');
    screenCategory = document.getElementById('screenCategory');
    screenBank = document.getElementById('screenBank');
    screenIncome = document.getElementById('screenIncome');
    screenExpense = document.getElementById('screenExpense');
    navBtnHome = document.getElementById('btnGoToHome');
    navBtnIncome = document.getElementById('btnGoToIncome_fromNav');
    navBtnExpense = document.getElementById('btnGoToExpense_fromNav');
    navBtnMenu = document.getElementById('btnGoToMenu_fromNav');
    allNavButtons = [navBtnHome, navBtnIncome, navBtnExpense, navBtnMenu];
    btnGoToUser_fromMenu = document.getElementById('btnGoToUser_fromMenu');
    btnGoToCategory_fromMenu = document.getElementById('btnGoToCategory_fromMenu');
    btnGoToBank_fromMenu = document.getElementById('btnGoToBank_fromMenu');
    btnGoToReports_fromMenu = document.getElementById('btnGoToReports_fromMenu');
    btnGoToMenu_fromUser = document.getElementById('btnGoToMenu_fromUser');
    btnGoToMenu_fromCategory = document.getElementById('btnGoToMenu_fromCategory');
    btnGoToMenu_fromBank = document.getElementById('btnGoToMenu_fromBank');
    btnGoToHome_fromIncome = document.getElementById('btnGoToHome_fromIncome');
    btnGoToHome_fromExpense = document.getElementById('btnGoToHome_fromExpense');
    userFormSection = document.getElementById('userForm').parentElement;
    userForm = document.getElementById('userForm');
    userSaveButton = userForm.querySelector('.save');
    profileNameInput = document.getElementById('profileName');
    profileEmailInput = document.getElementById('profileEmail');
    profilePhoneInput = document.getElementById('profilePhone');
    profileBirthdateInput = document.getElementById('profileBirthdate');
    profilePasswordInput = document.getElementById('profilePassword');
    categoryFormSection = document.getElementById('categoryForm').parentElement;
    categoryForm = document.getElementById('categoryForm');
    categorySaveButton = categoryForm.querySelector('.save');
    categoryIdInput = document.getElementById('categoryId');
    categoryNameInput = document.getElementById('categoryName');
    categoryTypeInput = document.getElementById('categoryType');
    categoryDescInput = document.getElementById('categoryDesc');
    categoryTableBody = document.getElementById('categoryTableBody');
    clearCategoryFormBtn = document.getElementById('clearCategoryFormBtn');
    categoryIconInput = document.getElementById('categoryIcon');
    iconPicker = document.getElementById('iconPicker');
    incomeCategorySelect = document.getElementById('incomeCategory');
    bankInitialCategorySelect = document.getElementById('bankInitialCategory');
    expenseCategorySelect = document.getElementById('expenseCategory');
    btnAddNewCategory = document.getElementById('btnAddNewCategory');
    categoryFilterForm = document.getElementById('categoryFilterForm');
    filterCategoryName = document.getElementById('filterCategoryName');
    clearCategoryFilterBtn = document.getElementById('clearCategoryFilterBtn');
    btnToggleCategoryFilter = document.getElementById('btnToggleCategoryFilter');
    bankFormSection = document.getElementById('bankForm').parentElement;
    bankForm = document.getElementById('bankForm');
    bankSaveButton = bankForm.querySelector('.save');
    bankIdInput = document.getElementById('bankId');
    bankNameInput = document.getElementById('bankName');
    accountNumberInput = document.getElementById('accountNumber');
    accountTypeInput = document.getElementById('accountType');
    initialBalanceInput = document.getElementById('initialBalance');
    initialBalanceDateInput = document.getElementById('initialBalanceDate');
    bankTableBody = document.getElementById('bankTableBody');
    clearBankFormBtn = document.getElementById('clearBankFormBtn');
    incomeBankSelect = document.getElementById('incomeBank');
    expenseBankSelect = document.getElementById('expenseBank');
    bankCreateOnlyFields = document.getElementById('bankCreateOnlyFields');
    btnAddNewBank = document.getElementById('btnAddNewBank');
    bankFilterForm = document.getElementById('bankFilterForm');
    filterBankName = document.getElementById('filterBankName');
    filterAccountNumber = document.getElementById('filterAccountNumber');
    filterAccountType = document.getElementById('filterAccountType');
    clearBankFilterBtn = document.getElementById('clearBankFilterBtn');
    btnToggleBankFilter = document.getElementById('btnToggleBankFilter');
    incomeFormSection = document.getElementById('incomeForm').parentElement;
    incomeForm = document.getElementById('incomeForm');
    incomeSaveButton = incomeForm.querySelector('.save');
    incomeIdInput = document.getElementById('incomeId');
    incomeDateInput = document.getElementById('incomeDate');
    incomeCategoryInput = document.getElementById('incomeCategory');
    incomeBankInput = document.getElementById('incomeBank');
    incomeDescInput = document.getElementById('incomeDesc');
    incomeValueInput = document.getElementById('incomeValue');
    incomeTableBody = document.getElementById('incomeTableBody');
    clearIncomeFormBtn = document.getElementById('clearIncomeFormBtn');
    btnAddNewIncome = document.getElementById('btnAddNewIncome');
    incomeFilterForm = document.getElementById('incomeFilterForm');
    filterIncomeStartDate = document.getElementById('filterIncomeStartDate');
    filterIncomeEndDate = document.getElementById('filterIncomeEndDate');
    filterIncomeCategory = document.getElementById('filterIncomeCategory');
    clearIncomeFilterBtn = document.getElementById('clearIncomeFilterBtn');
    btnToggleIncomeFilter = document.getElementById('btnToggleIncomeFilter');
    expenseFormSection = document.getElementById('expenseForm').parentElement;
    expenseForm = document.getElementById('expenseForm');
    expenseSaveButton = expenseForm.querySelector('.save');
    expenseIdInput = document.getElementById('expenseId');
    expenseDateInput = document.getElementById('expenseDate');
    expenseCategoryInput = document.getElementById('expenseCategory');
    expenseBankInput = document.getElementById('expenseBank');
    expenseDescInput = document.getElementById('expenseDesc');
    expenseValueInput = document.getElementById('expenseValue');
    expenseTableBody = document.getElementById('expenseTableBody');
    clearExpenseFormBtn = document.getElementById('clearExpenseFormBtn');
    btnAddNewExpense = document.getElementById('btnAddNewExpense');
    expenseFilterForm = document.getElementById('expenseFilterForm');
    filterExpenseStartDate = document.getElementById('filterExpenseStartDate');
    filterExpenseEndDate = document.getElementById('filterExpenseEndDate');
    filterExpenseCategory = document.getElementById('filterExpenseCategory');
    clearExpenseFilterBtn = document.getElementById('clearExpenseFilterBtn');
    btnToggleExpenseFilter = document.getElementById('btnToggleExpenseFilter');
    transactionFeed = document.getElementById('transactionFeed');
    modalOverlay = document.getElementById('modalOverlay');
    modalTitle = document.getElementById('modalTitle');
    modalBody = document.getElementById('modalBody');
    btnCloseModal = document.getElementById('btnCloseModal');
    allFormSections = [categoryFormSection, bankFormSection, incomeFormSection, expenseFormSection];
    allFilterContainers = [categoryFilterForm, bankFilterForm, incomeFilterForm, expenseFilterForm];
    allFilterToggleButtons = [btnToggleCategoryFilter, btnToggleBankFilter, btnToggleIncomeFilter, btnToggleExpenseFilter];

    // Eventos de Login/Registro
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    btnGoToRegister.addEventListener('click', () => navigate(screenRegister));
    btnGoToLogin.addEventListener('click', () => navigate(screenLogin));
    btnLogout.addEventListener('click', handleLogout);

    // Inicializar o App
    checkSession();
});