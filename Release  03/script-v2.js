// =============================================
// BANCO DE DADOS E ESTADO DA APLICAÇÃO
// =============================================
let db = {};
let currentUser = null; 
let appInitialized = false; 

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

// =============================================
// DADOS DE TESTE (SEED)
// =============================================
function seedDatabase() {
    const testUserId = 999;
    const testUser = { id: testUserId, nome: "test", pass: "123", email: "test@test.com", telefone: "12345", dataNascimento: "2000-01-01" };
    const testCategories = [
        { id: 1, userId: testUserId, nome: "Salário", tipo: "Receita", desc: "Recebimento mensal", icon: "💼" },
        { id: 2, userId: testUserId, nome: "Alimentação", tipo: "Despesa", desc: "Supermercado", icon: "🍔" },
        { id: 3, userId: testUserId, nome: "Transporte", tipo: "Despesa", desc: "Gasolina", icon: "🚗" },
        { id: 4, userId: testUserId, nome: "Moradia", tipo: "Despesa", desc: "Aluguel", icon: "🏠" }
    ];
    const testBanks = [{ id: 10, userId: testUserId, nome: "Banco Principal", conta: "12345-6", tipo: "corrente", saldo: 2330.00 }];
    const testIncomes = [{ id: 100, userId: testUserId, data: "2025-11-05", categoriaId: 1, bancoId: 10, desc: "Salário", valor: 5000 }];
    const testExpenses = [
        { id: 200, userId: testUserId, data: "2025-11-06", categoriaId: 2, bancoId: 10, desc: "Mercado", valor: 750 },
        { id: 201, userId: testUserId, data: "2025-11-07", categoriaId: 3, bancoId: 10, desc: "Gasolina", valor: 300 },
        { id: 202, userId: testUserId, data: "2025-11-10", categoriaId: 4, bancoId: 10, desc: "Aluguel", valor: 1500 }
    ];
    
    db = { users: [testUser], categories: testCategories, banks: testBanks, incomes: testIncomes, expenses: testExpenses };
    saveDb();
    alert("Dados carregados! Usuário: test / Senha: 123");
    location.reload(); 
}

function loadDb() {
    let dbJson = localStorage.getItem('fincontrol_db');
    if (dbJson) db = JSON.parse(dbJson);
    else seedDatabase();
}
function saveDb() { localStorage.setItem('fincontrol_db', JSON.stringify(db)); }

// =============================================
// VARIÁVEIS GLOBAIS
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
let screenReports, btnBackToSelection_fromRF21, rf21FilterForm, filterRF21StartDate, filterRF21EndDate, filterRF21Type, filterRF21Category, filterRF21Bank, rf21ResultContainer, rf21Chart, rf21TableResult, rf21ChartInstance = null;
let screenReportsRF22, btnBackToSelection_fromRF22, rf22FilterForm, filterRF22StartDate, filterRF22EndDate, filterRF22Type, filterRF22Limit, filterRF22Bank, rf22ResultContainer, rf22Chart, rf22TableResult, rf22ChartInstance = null;
let screenReportSelection, btnGoToReportSelection_fromMenu, btnGoToRF21_fromSelection, btnGoToRF22_fromSelection, btnBackToMenu_fromSelection;
let btnSeedData;
let allFormSections = [];
let allFilterContainers = [];
let allFilterToggleButtons = [];

// =============================================
// LÓGICA DE LOGIN
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
        navigate(screenHome, navBtnHome); 
    } else {
        alert('Nome de usuário ou senha incorretos.');
    }
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value;
    const pass = document.getElementById('registerPassword').value;
    if (db.users && db.users.some(u => u.nome === name)) { alert('Este nome de usuário já existe.'); return; }
    const newUser = { id: Date.now(), nome: name, pass: pass, email: "", telefone: "", dataNascimento: "" };
    if(!db.users) db.users = [];
    db.users.push(newUser);
    saveDb();
    currentUser = newUser; 
    localStorage.setItem('fincontrol_user', JSON.stringify(newUser));
    initializeApp(); 
    navigate(screenHome, navBtnHome);
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('fincontrol_user');
    document.getElementById('bottomNav').classList.remove('nav-visible'); 
    if (rf21ChartInstance) rf21ChartInstance.destroy();
    if (rf22ChartInstance) rf22ChartInstance.destroy();
    navigate(screenLogin);
}

function checkSession() {
    loadDb(); 
    const userJson = localStorage.getItem('fincontrol_user');
    if (userJson) {
        currentUser = JSON.parse(userJson);
        initializeApp();
        navigate(screenMenu, navBtnMenu); 
    } else {
        document.getElementById('bottomNav').classList.remove('nav-visible'); 
        navigate(screenLogin);
    }
}

// =============================================
// INICIALIZAÇÃO
// =============================================
function initializeApp() {
    if (appInitialized) return; 

    const addEvt = (el, evt, func) => { if(el) el.addEventListener(evt, func); };

    addEvt(userForm, 'submit', handleProfileUpdate);
    addEvt(categoryForm, 'submit', handleCategorySubmit);
    addEvt(clearCategoryFormBtn, 'click', clearCategoryForm);
    addEvt(btnAddNewCategory, 'click', () => { clearCategoryForm(); showForm(categoryFormSection, categorySaveButton, 'Salvar'); });
    addEvt(categoryFilterForm, 'submit', handleCategoryFilter);
    addEvt(clearCategoryFilterBtn, 'click', clearCategoryFiltersAndRender);
    addEvt(btnToggleCategoryFilter, 'click', () => toggleFilter(categoryFilterForm, btnToggleCategoryFilter));

    addEvt(bankForm, 'submit', handleBankSubmit);
    addEvt(clearBankFormBtn, 'click', clearBankForm);
    addEvt(btnAddNewBank, 'click', () => { clearBankForm(); showForm(bankFormSection, bankSaveButton, 'Salvar'); });
    addEvt(bankFilterForm, 'submit', handleBankFilter);
    addEvt(clearBankFilterBtn, 'click', clearBankFiltersAndRender);
    addEvt(btnToggleBankFilter, 'click', () => toggleFilter(bankForm, btnToggleBankFilter));
    
    addEvt(incomeForm, 'submit', handleIncomeSubmit);
    addEvt(clearIncomeFormBtn, 'click', clearIncomeForm);
    addEvt(btnAddNewIncome, 'click', () => { clearIncomeForm(); showForm(incomeFormSection, incomeSaveButton, 'Salvar'); });
    addEvt(incomeFilterForm, 'submit', handleIncomeFilter);
    addEvt(clearIncomeFilterBtn, 'click', clearIncomeFiltersAndRender);
    addEvt(btnToggleIncomeFilter, 'click', () => toggleFilter(incomeFilterForm, btnToggleIncomeFilter));
    
    addEvt(expenseForm, 'submit', handleExpenseSubmit);
    addEvt(clearExpenseFormBtn, 'click', clearExpenseForm);
    addEvt(btnAddNewExpense, 'click', () => { clearExpenseForm(); showForm(expenseFormSection, expenseSaveButton, 'Salvar'); });
    addEvt(expenseFilterForm, 'submit', handleExpenseFilter);
    addEvt(clearExpenseFilterBtn, 'click', clearExpenseFiltersAndRender);
    addEvt(btnToggleExpenseFilter, 'click', () => toggleFilter(expenseFilterForm, btnToggleExpenseFilter));
    
    addEvt(btnCloseModal, 'click', () => modalOverlay.style.display = 'none');
    if(modalOverlay) modalOverlay.addEventListener('click', (event) => { if (event.target === modalOverlay) modalOverlay.style.display = 'none'; });
    
    addEvt(navBtnHome, 'click', () => navigate(screenHome, navBtnHome));
    addEvt(navBtnIncome, 'click', () => navigate(screenIncome, navBtnIncome));
    addEvt(navBtnExpense, 'click', () => navigate(screenExpense, navBtnExpense));
    addEvt(navBtnMenu, 'click', () => navigate(screenMenu, navBtnMenu));
    
    addEvt(btnGoToUser_fromMenu, 'click', () => navigate(screenUser, navBtnMenu));
    addEvt(btnGoToCategory_fromMenu, 'click', () => navigate(screenCategory, navBtnMenu));
    addEvt(btnGoToBank_fromMenu, 'click', () => navigate(screenBank, navBtnMenu));
    
    addEvt(btnGoToReportSelection_fromMenu, 'click', () => navigate(screenReportSelection, navBtnMenu));
    addEvt(btnGoToRF21_fromSelection, 'click', () => navigate(screenReports, navBtnMenu));
    addEvt(btnGoToRF22_fromSelection, 'click', () => navigate(screenReportsRF22, navBtnMenu));
    addEvt(btnBackToMenu_fromSelection, 'click', () => navigate(screenMenu, navBtnMenu));
    addEvt(btnBackToSelection_fromRF21, 'click', () => navigate(screenReportSelection, navBtnMenu));
    addEvt(btnBackToSelection_fromRF22, 'click', () => navigate(screenReportSelection, navBtnMenu));

    addEvt(btnGoToMenu_fromUser, 'click', () => navigate(screenMenu, navBtnMenu));
    addEvt(btnGoToMenu_fromCategory, 'click', () => navigate(screenMenu, navBtnMenu));
    addEvt(btnGoToMenu_fromBank, 'click', () => navigate(screenMenu, navBtnMenu));
    addEvt(btnGoToHome_fromIncome, 'click', () => navigate(screenHome, navBtnHome));
    addEvt(btnGoToHome_fromExpense, 'click', () => navigate(screenHome, navBtnHome));
    
    addEvt(rf21FilterForm, 'submit', handleRF21Generate);
    addEvt(rf22FilterForm, 'submit', handleRF22Generate);
    
    document.getElementById('bottomNav').classList.add('nav-visible');
    if(feedTitle) feedTitle.textContent = `Transações de ${currentUser.nome}`;
    
    renderCategoryTable();
    renderBankTable();
    renderIncomeTable();
    renderExpenseTable();
    renderTransactionFeed();
    
    populateIconPicker();
    populateBankDropdown(incomeBankSelect);
    populateBankDropdown(expenseBankSelect);
    
    appInitialized = true;
}

// =============================================
// LÓGICA DO CRUD
// =============================================
function handleProfileUpdate(e){ e.preventDefault(); navigate(screenMenu, navBtnMenu); }
function populateIconPicker() { if(!iconPicker) return; iconPicker.innerHTML=""; ICON_LIST.forEach(d=>{ let s=document.createElement('span'); s.className="icon-option"; s.textContent=d.emoji; s.style.backgroundColor=d.color; s.dataset.icon=d.emoji; s.onclick=()=>{document.querySelectorAll('.icon-option').forEach(o=>o.classList.remove('selected')); s.classList.add('selected'); categoryIconInput.value=d.emoji;}; iconPicker.appendChild(s); }); }
function populateCategoryDropdown(selectElement, type) { 
    if (!selectElement) return;

    const isFilter = selectElement.id.startsWith('filter');
    const defaultText = isFilter ? "Todas as Categorias" : "Selecione uma categoria...";
    
    selectElement.innerHTML = ''; 
    const defaultOption = document.createElement('option');
    defaultOption.value = ""; 
    defaultOption.textContent = defaultText;
    selectElement.appendChild(defaultOption);

    let filteredCategories = db.categories.filter(c => c.userId === currentUser.id);
    
    if (type === 'Receita' || type === 'Despesa') {
        filteredCategories = filteredCategories.filter(c => c.tipo === type);
    }

    filteredCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        const iconData = ICON_LIST.find(i => i.emoji === category.icon);
        option.textContent = iconData ? `${iconData.emoji} ${category.nome}` : category.nome;
        selectElement.appendChild(option);
    });
}
function handleCategorySubmit(e){ 
    e.preventDefault(); 
    if (currentCategoryId) {
        const c = db.categories.find(x => x.id === currentCategoryId);
        c.nome = categoryNameInput.value; c.tipo = categoryTypeInput.value; c.desc = categoryDescInput.value; c.icon = categoryIconInput.value;
    } else {
        db.categories.push({ id: Date.now(), userId: currentUser.id, nome: categoryNameInput.value, tipo: categoryTypeInput.value, desc: categoryDescInput.value, icon: categoryIconInput.value });
    }
    saveDb(); clearCategoryForm(); renderCategoryTable(); 
}
function renderCategoryTable() { 
    categoryTableBody.innerHTML=""; 
    let cats = db.categories.filter(c=>c.userId===currentUser.id);
    if(filterCategoryName && filterCategoryName.value) cats = cats.filter(c=>c.nome.toLowerCase().includes(filterCategoryName.value.toLowerCase()));
    cats.sort((a,b)=>a.nome.localeCompare(b.nome));
    cats.forEach(c=>{ 
        let iconData = ICON_LIST.find(i=>i.emoji===c.icon);
        let iconChip = iconData ? `<span class="icon-chip" style="background-color: ${iconData.color};">${c.icon}</span>` : '';
        let row=document.createElement('tr'); 
        row.innerHTML=`<td>${iconChip}</td><td>${c.nome}</td><td>${c.tipo}</td><td>${c.desc}</td><td><button class="edit" onclick="startEditCategory(${c.id})">✎</button> <button class="remover" onclick="deleteCategory(${c.id})">X</button></td>`; 
        categoryTableBody.appendChild(row); 
    }); 
    populateCategoryDropdown(incomeCategorySelect, 'Receita'); populateCategoryDropdown(expenseCategorySelect, 'Despesa'); populateCategoryDropdown(bankInitialCategorySelect, 'Receita'); 
    
    populateCategoryDropdown(filterIncomeCategory, 'Receita');
    populateCategoryDropdown(filterExpenseCategory, 'Despesa');
    
    if(filterRF21Category) populateCategoryDropdown(filterRF21Category, ''); 
}
function startEditCategory(id) {
    const c = db.categories.find(x => x.id === id);
    currentCategoryId = c.id; categoryIdInput.value = c.id; categoryNameInput.value = c.nome; categoryTypeInput.value = c.tipo; categoryDescInput.value = c.desc; categoryIconInput.value = c.icon;
    showForm(categoryFormSection, categorySaveButton, 'Atualizar');
}
function deleteCategory(id){ db.categories=db.categories.filter(c=>c.id!==id); saveDb(); renderCategoryTable(); }
function clearCategoryForm(){ categoryForm.reset(); currentCategoryId=null; categoryIconInput.value=""; categoryFormSection.classList.remove('is-visible'); }
function handleCategoryFilter(e){ e.preventDefault(); renderCategoryTable(); }
function clearCategoryFiltersAndRender(){ categoryFilterForm.reset(); renderCategoryTable(); }

function handleBankSubmit(e){ 
    e.preventDefault();
    if (currentBankId) {
        const b = db.banks.find(x => x.id === currentBankId);
        b.nome = bankNameInput.value; b.conta = accountNumberInput.value; b.tipo = accountTypeInput.value;
    } else {
        let bal = parseFloat(initialBalanceInput.value);
        let newBank = { id: Date.now(), userId: currentUser.id, nome: bankNameInput.value, conta: accountNumberInput.value, tipo: accountTypeInput.value, saldo: 0 };
        if(bal > 0) {
            db.incomes.push({ id: Date.now(), userId: currentUser.id, data: initialBalanceDateInput.value, categoriaId: parseInt(bankInitialCategorySelect.value)||null, bancoId: newBank.id, desc: "Saldo Inicial", valor: bal });
            newBank.saldo = bal;
        }
        db.banks.push(newBank);
    }
    saveDb(); clearBankForm(); renderBankTable(); renderTransactionFeed();
}
function renderBankTable() { 
    bankTableBody.innerHTML=""; let banks=db.banks.filter(b=>b.userId===currentUser.id); 
    if(filterBankName && filterBankName.value) banks = banks.filter(b=>b.nome.toLowerCase().includes(filterBankName.value.toLowerCase()));
    banks.forEach(b=>{ let row=document.createElement('tr'); row.innerHTML=`<td>${b.nome}</td><td>${b.conta}</td><td>${b.tipo}</td><td>R$ ${b.saldo.toFixed(2)}</td><td><button class="edit" onclick="startEditBank(${b.id})">✎</button> <button class="remover" onclick="deleteBank(${b.id})">X</button></td>`; bankTableBody.appendChild(row); }); 
    populateBankDropdown(incomeBankSelect); populateBankDropdown(expenseBankSelect); if(filterRF21Bank) populateBankDropdown(filterRF21Bank); if(filterRF22Bank) populateBankDropdown(filterRF22Bank); 
}
let currentBankId = null;
function startEditBank(id){ let b=db.banks.find(x=>x.id===id); currentBankId=b.id; bankIdInput.value=b.id; bankNameInput.value=b.nome; accountNumberInput.value=b.conta; accountTypeInput.value=b.tipo; bankCreateOnlyFields.style.display='none'; showForm(bankFormSection, bankSaveButton, 'Atualizar'); }
function deleteBank(id){ if(db.incomes.some(i=>i.bancoId===id) || db.expenses.some(e=>e.bancoId===id)){alert('Tem transações!');return;} db.banks=db.banks.filter(b=>b.id!==id); saveDb(); renderBankTable(); }
function clearBankForm(){ bankForm.reset(); currentBankId=null; bankCreateOnlyFields.style.display='block'; bankFormSection.classList.remove('is-visible'); }
function handleBankFilter(e){ e.preventDefault(); renderBankTable(); }
function clearBankFiltersAndRender(){ bankFilterForm.reset(); renderBankTable(); }

let currentIncomeId = null;
function handleIncomeSubmit(e){ 
    e.preventDefault(); 
    let val = parseFloat(incomeValueInput.value); let bid = parseInt(incomeBankInput.value);
    if(currentIncomeId){
        let inc = db.incomes.find(x=>x.id===currentIncomeId);
        let oldBank = db.banks.find(x=>x.id===inc.bancoId); oldBank.saldo -= inc.valor;
        inc.data = incomeDateInput.value; inc.categoriaId = parseInt(incomeCategoryInput.value); inc.bancoId = bid; inc.desc = incomeDescInput.value; inc.valor = val;
        let newBank = db.banks.find(x=>x.id===bid); newBank.saldo += val;
    } else {
        db.incomes.push({ id: Date.now(), userId: currentUser.id, data: incomeDateInput.value, categoriaId: parseInt(incomeCategoryInput.value), bancoId: bid, desc: incomeDescInput.value, valor: val });
        let b = db.banks.find(x=>x.id===bid); b.saldo += val;
    }
    saveDb(); clearIncomeForm(); renderIncomeTable(); renderBankTable(); renderTransactionFeed();
}
function renderIncomeTable(){ 
    incomeTableBody.innerHTML=""; let incs=db.incomes.filter(i=>i.userId===currentUser.id);
    if(filterIncomeStartDate && filterIncomeStartDate.value) incs = incs.filter(i=>i.data >= filterIncomeStartDate.value);
    if(filterIncomeCategory && filterIncomeCategory.value) { 
        const catIdToFilter = parseInt(filterIncomeCategory.value);
        incs = incs.filter(i=>parseInt(i.categoriaId) === catIdToFilter); // Forçando parseInt no ID da DB
    }
    
    const userIncomes = incs.sort((a, b) => new Date(b.data) - new Date(a.data));

    userIncomes.forEach(i=>{ 
        let c = db.categories.find(x=>x.id===i.categoriaId); let b = db.banks.find(x=>x.id===i.bancoId);
        let catName = c ? `${c.icon} ${c.nome}` : (i.desc==="Saldo Inicial"?"💰 Saldo Inicial":"-");
        let bName = b ? b.nome : "-";
        let row=document.createElement('tr'); 
        row.innerHTML=`<td>${new Date(i.data).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</td><td>${i.desc}</td><td>${catName}</td><td>${bName}</td><td>R$ ${i.valor.toFixed(2)}</td><td><button class="edit" onclick="startEditIncome(${i.id})">✎</button> <button class="remover" onclick="deleteIncome(${i.id})">X</button></td>`; 
        incomeTableBody.appendChild(row); 
    }); 
}
function startEditIncome(id){ let i=db.incomes.find(x=>x.id===id); currentIncomeId=i.id; incomeIdInput.value=i.id; incomeDateInput.value=i.data; incomeCategoryInput.value=i.categoriaId; incomeBankInput.value=i.bancoId; incomeDescInput.value=i.desc; incomeValueInput.value=i.valor; showForm(incomeFormSection, incomeSaveButton, 'Atualizar'); }
function deleteIncome(id){ let i=db.incomes.find(x=>x.id===id); let b=db.banks.find(x=>x.id===i.bancoId); b.saldo-=i.valor; db.incomes=db.incomes.filter(x=>x.id!==id); saveDb(); renderIncomeTable(); renderBankTable(); renderTransactionFeed();}
function clearIncomeForm(){ incomeForm.reset(); currentIncomeId=null; incomeDateInput.value=new Date().toISOString().split('T')[0]; incomeFormSection.classList.remove('is-visible'); }
function handleIncomeFilter(e){ e.preventDefault(); renderIncomeTable(); } // SUBMIT FILTER
function clearIncomeFiltersAndRender(){ incomeFilterForm.reset(); renderIncomeTable(); }

let currentExpenseId = null;
function handleExpenseSubmit(e){ 
    e.preventDefault(); 
    let val = parseFloat(expenseValueInput.value); let bid = parseInt(expenseBankInput.value);
    if(currentExpenseId){
        let exp = db.expenses.find(x=>x.id===currentExpenseId);
        let oldBank = db.banks.find(x=>x.id===exp.bancoId); oldBank.saldo += exp.valor;
        exp.data = expenseDateInput.value; exp.categoriaId = parseInt(expenseCategoryInput.value); exp.bancoId = bid; exp.desc = expenseDescInput.value; exp.valor = val;
        let newBank = db.banks.find(x=>x.id===bid); newBank.saldo -= val;
    } else {
        db.expenses.push({ id: Date.now(), userId: currentUser.id, data: expenseDateInput.value, categoriaId: parseInt(expenseCategoryInput.value), bancoId: bid, desc: expenseDescInput.value, valor: val });
        let b = db.banks.find(x=>x.id===bid); b.saldo -= val;
    }
    saveDb(); clearExpenseForm(); renderExpenseTable(); renderBankTable(); renderTransactionFeed();
}
function renderExpenseTable(){ 
    expenseTableBody.innerHTML=""; let exps=db.expenses.filter(e=>e.userId===currentUser.id);
    if(filterExpenseStartDate && filterExpenseStartDate.value) exps = exps.filter(e=>e.data >= filterExpenseStartDate.value);
    if(filterExpenseCategory && filterExpenseCategory.value) { // Verifica se há valor no filtro
        const catIdToFilter = parseInt(filterExpenseCategory.value);
        exps = exps.filter(e=>parseInt(e.categoriaId) === catIdToFilter); // Forçando parseInt no ID da DB
    }
    
    exps.sort((a, b) => new Date(b.data) - new Date(a.data));

    exps.forEach(e=>{ 
        let c = db.categories.find(x=>x.id===e.categoriaId); let b = db.banks.find(x=>x.id===e.bancoId);
        let catName = c ? `${c.icon} ${c.nome}` : "-";
        let bName = b ? b.nome : "-";
        let row=document.createElement('tr'); 
        row.innerHTML=`<td>${new Date(e.data).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</td><td>${e.desc}</td><td>${catName}</td><td>${bName}</td><td>R$ ${e.valor.toFixed(2)}</td><td><button class="edit" onclick="startEditExpense(${e.id})">✎</button> <button class="remover" onclick="deleteExpense(${e.id})">X</button></td>`; 
        expenseTableBody.appendChild(row); 
    }); 
}
function startEditExpense(id){ let e=db.expenses.find(x=>x.id===id); currentExpenseId=e.id; expenseIdInput.value=e.id; expenseDateInput.value=e.data; expenseCategoryInput.value=e.categoriaId; expenseBankInput.value=e.bancoId; expenseDescInput.value=e.desc; expenseValueInput.value=e.valor; showForm(expenseFormSection, expenseSaveButton, 'Atualizar'); }
function deleteExpense(id){ let e=db.expenses.find(x=>x.id===id); let b=db.banks.find(x=>x.id===e.bancoId); b.saldo+=e.valor; db.expenses=db.expenses.filter(x=>x.id!==id); saveDb(); renderExpenseTable(); renderBankTable(); renderTransactionFeed();}
function clearExpenseForm(){ expenseForm.reset(); currentExpenseId=null; expenseDateInput.value=new Date().toISOString().split('T')[0]; expenseFormSection.classList.remove('is-visible'); }
function handleExpenseFilter(e){ e.preventDefault(); renderExpenseTable(); }
function clearExpenseFiltersAndRender(){ expenseFilterForm.reset(); renderExpenseTable(); }

// FEED
function formatFeedDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: '2-digit', weekday: 'short', timeZone: 'UTC' };
    let formatted = new Intl.DateTimeFormat('pt-BR', options).format(date);
    formatted = formatted.replace(',', '').replace('.', '');
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
function renderFeed(element, transactionList, options = {}) {
    element.innerHTML = ""; 
    let currentRunningBalance = options.startingBalance || 0;
    const grouped = transactionList.reduce((acc, trans) => {
        const dateKey = formatFeedDate(trans.data);
        if (!acc[dateKey]) acc[dateKey] = { transactions: [], income: 0, expense: 0 };
        acc[dateKey].transactions.push(trans);
        if(trans.tipo === 'income') acc[dateKey].income += trans.valor; else acc[dateKey].expense += trans.valor;
        return acc;
    }, {});
    if (transactionList.length === 0) { element.innerHTML = '<p class="subtitle">Nenhuma transação encontrada.</p>'; return; }
    for (const dateKey in grouped) {
        const group = grouped[dateKey];
        let headerSummaryHTML = '';
        const dailyNet = group.income - group.expense;
        if (options.mode === 'running-balance') {
            let balanceClass = currentRunningBalance >= 0 ? 'income' : 'expense';
            headerSummaryHTML = `<span class="daily-summary"><span class="${balanceClass}">Saldo: R$ ${currentRunningBalance.toFixed(2)}</span></span>`;
            currentRunningBalance -= dailyNet;
        } else {
            let netClass = dailyNet > 0 ? 'income' : (dailyNet < 0 ? 'expense' : '');
            let netPrefix = dailyNet > 0 ? '+' : '';
            headerSummaryHTML = `<span class="daily-summary"><span class="${netClass}">Saldo do Dia: ${netPrefix} R$ ${dailyNet.toFixed(2)}</span></span>`;
        }
        let itemsHTML = "";
        group.transactions.forEach(trans => {
            const category = db.categories.find(c => c.id === trans.categoriaId && c.userId === currentUser.id);
            let iconData = null; let categoryName = trans.desc;
            if (category) { iconData = ICON_LIST.find(i => i.emoji === category.icon); categoryName = category.nome; }
            else if (trans.desc === "Saldo Inicial") { iconData = ICON_LIST.find(i => i.emoji === "💰"); categoryName = "Saldo Inicial"; }
            const iconChip = iconData ? `<span class="icon-chip feed" style="background-color: ${iconData.color};">${iconData.emoji}</span>` : `<span class="icon-chip feed" style="background-color: var(--border-color);"></span>`;
            const valorClass = trans.tipo === 'income' ? 'income' : 'expense';
            const valorPrefix = trans.tipo === 'income' ? '+' : '-';
            const clickAction = (element === transactionFeed && trans.categoriaId) ? `onclick="showCategoryExtract(${trans.categoriaId})"` : '';
            itemsHTML += `<div class="feed-item" ${clickAction}><div class="feed-item-left">${iconChip}<div class="feed-item-details"><h4>${categoryName}</h4><p>${trans.desc}</p></div></div><span class="feed-item-value ${valorClass}">${valorPrefix} R$ ${trans.valor.toFixed(2)}</span></div>`;
        });
        element.innerHTML += `<div class="feed-date-group"><div class="feed-date-header"><span>${dateKey}</span>${headerSummaryHTML}</div>${itemsHTML}</div>`;
    }
}
function renderTransactionFeed() {
    const userIncomes = db.incomes.filter(i => i.userId === currentUser.id);
    const userExpenses = db.expenses.filter(e => e.userId === currentUser.id);
    const mappedIncomes = userIncomes.map(income => ({ ...income, tipo: 'income' }));
    const mappedExpenses = userExpenses.map(expense => ({ ...expense, tipo: 'expense' }));
    const allTransactions = [...mappedIncomes, ...mappedExpenses].sort((a, b) => new Date(b.data) - new Date(a.data));
    const userBanks = db.banks.filter(b => b.userId === currentUser.id);
    const totalBalance = userBanks.reduce((acc, bank) => acc + bank.saldo, 0);
    renderFeed(transactionFeed, allTransactions, { mode: 'running-balance', startingBalance: totalBalance }); 
}
function showCategoryExtract(categoryId) {
    if (!categoryId) return; 
    const category = db.categories.find(c => c.id === categoryId && c.userId === currentUser.id);
    if (!category) return; 
    const iconData = ICON_LIST.find(i => i.emoji === category.icon);
    const iconChip = iconData ? `<span class="icon-chip feed" style="background-color: ${iconData.color};">${iconData.emoji}</span>` : '';
    modalTitle.innerHTML = `${iconChip} Extrato: ${category.nome}`;
    const categoryIncomes = db.incomes.filter(i => i.categoriaId === categoryId && i.userId === currentUser.id).map(i => ({ ...i, tipo: 'income' }));
    const categoryExpenses = db.expenses.filter(e => e.categoriaId === categoryId && e.userId === currentUser.id).map(e => ({ ...e, tipo: 'expense' }));
    const categoryTransactions = [...categoryIncomes, ...categoryExpenses].sort((a, b) => new Date(b.data) - new Date(a.data));
    renderFeed(modalBody, categoryTransactions); 
    modalOverlay.style.display = 'block';
}

// UTILS E HELPERS
function populateBankDropdown(sel) { if(!sel)return; sel.innerHTML="<option value=''>Selecione</option>"; db.banks.filter(b=>b.userId===currentUser.id).forEach(b=>{ let o=document.createElement('option'); o.value=b.id; o.text=b.nome; sel.appendChild(o); }); }
function hideAllForms(){ allFormSections.forEach(f=>{if(f)f.classList.remove('is-visible')}); }
function showForm(f,b,t){ hideAllForms(); hideAllFilters(); if(f){f.classList.add('is-visible'); if(b)b.textContent=t;} }
function hideAllFilters(){ allFilterContainers.forEach(f=>{if(f)f.classList.remove('is-visible')}); allFilterToggleButtons.forEach(b=>{if(b)b.classList.remove('active')}); }
function toggleFilter(f,b){ allFilterContainers.forEach(x=>{if(x!==f && x)x.classList.remove('is-visible')}); if(f)f.classList.toggle('is-visible'); }
function getFilteredTransactions(f){ 
    let incs=db.incomes.filter(i=>i.userId===currentUser.id), exps=db.expenses.filter(e=>e.userId===currentUser.id);
    if(f.startDate) { incs=incs.filter(i=>i.data>=f.startDate); exps=exps.filter(e=>e.data>=f.startDate); }
    if(f.endDate) { incs=incs.filter(i=>i.data<=f.endDate); exps=exps.filter(e=>e.data<=f.endDate); }
    if(f.type==='Receita') exps=[]; if(f.type==='Despesa') incs=[];
    if(f.categoryId) { incs=incs.filter(i=>i.categoriaId===f.categoryId); exps=exps.filter(e=>e.categoriaId===f.categoryId); }
    if(f.bankId) { incs=incs.filter(i=>i.bancoId===f.bankId); exps=exps.filter(e=>e.bancoId===f.bankId); }
    return [...incs.map(i=>({...i,tipo:'Receita'})), ...exps.map(e=>({...e,tipo:'Despesa'}))];
}

// === RELATÓRIO RF21 ===
function handleRF21Generate(e){ 
    e.preventDefault(); 
    const filters = {
        startDate: filterRF21StartDate.value, 
        endDate: filterRF21EndDate.value,
        type: filterRF21Type.value,
        categoryId: filterRF21Category.value ? parseInt(filterRF21Category.value) : null,
        bankId: filterRF21Bank.value ? parseInt(filterRF21Bank.value) : null
    };

    let transactions = getFilteredTransactions(filters); 
    
    // 2. Table Data (Grouping) - Prepara dados para tabela e gráfico
    const categoryGroups = {};
    let totalGeral = 0; 
    let totalAbsoluteMovement = 0; 
    const totalTransactions = transactions.length;

    transactions.forEach(trans => {
        let catId = trans.categoriaId;
        if (catId === null && trans.desc === "Saldo Inicial" && trans.tipo === 'Receita') catId = "saldo_inicial";
        if (!catId) return;

        if (!categoryGroups[catId]) {
            let catInfo = db.categories.find(c => c.id === catId);
            if (catId === "saldo_inicial") catInfo = { id: "saldo_inicial", nome: "Saldo Inicial", tipo: "Receita", icon: "💰", color: "#ccc" };
            if (!catInfo) catInfo = { id: catId, nome: "(Removida)", tipo: "?", icon: "❓", color: "#ccc" };

            categoryGroups[catId] = { info: catInfo, transactions: [], subtotal: 0 };
        }
        categoryGroups[catId].transactions.push(trans);
        const valor = (trans.tipo === 'Receita' ? trans.valor : -trans.valor);
        categoryGroups[catId].subtotal += valor;
        totalGeral += valor; 
        totalAbsoluteMovement += trans.valor; 
    });

    // GRÁFICO DINÂMICO
    let chartLabels = [];
    let chartData = [];
    let chartColors = [];

    if (filters.categoryId) {
        let descGroups = {};
        transactions.forEach(t => {
             if(!descGroups[t.desc]) descGroups[t.desc] = 0;
             descGroups[t.desc] += t.valor;
        });
        Object.keys(descGroups).forEach((d, i) => {
            chartLabels.push(d);
            chartData.push(descGroups[d]);
            chartColors.push(ICON_LIST[i % ICON_LIST.length].color);
        });
    } else {
        Object.values(categoryGroups).forEach(g => {
            chartLabels.push(g.info.nome);
            let val = g.transactions.reduce((acc, t) => acc + t.valor, 0); 
            chartData.push(val);
            let icon = ICON_LIST.find(i => i.emoji === g.info.icon);
            chartColors.push(icon ? icon.color : '#ccc');
        });
    }
    
    renderRF21Chart(chartLabels, chartData, chartColors); 
    renderRF21Table(categoryGroups, totalAbsoluteMovement, totalGeral, filters.type, totalTransactions); 
} 

function renderRF21Chart(labels, data, colors){ 
    if(rf21ChartInstance) rf21ChartInstance.destroy();
    let ctx = rf21Chart.getContext('2d');
    rf21ChartInstance = new Chart(ctx, { 
        type: 'doughnut', 
        data: { 
            labels: labels, 
            datasets: [{ 
                data: data, 
                backgroundColor: colors, 
                borderColor: '#1A1A2E',
                borderWidth: 2
            }] 
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#fff', padding: 20 } }
            }
        }
    });
}

function renderRF21Table(categoryGroups, totalAbsoluteMovement, totalGeral, filterType, totalTransactions) { 
    if (Object.keys(categoryGroups).length === 0) { rf21TableResult.innerHTML = '<p>Nenhuma transação encontrada.</p>'; return; }
    let html = "";
    const sortedKeys = Object.keys(categoryGroups).sort((a, b) => categoryGroups[a].info.nome.localeCompare(categoryGroups[b].info.nome));
    sortedKeys.forEach(catId => {
        const group = categoryGroups[catId];
        const iconData = ICON_LIST.find(i => i.emoji === group.info.icon);
        const colorStyle = iconData ? `color: ${iconData.color};` : '';
        html += `<div class="report-category-group"><div class="report-category-header" style="${colorStyle}">${group.info.icon || ''} ${group.info.nome}</div>`;
        group.transactions.forEach(trans => {
            const dataFormatada = new Date(trans.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'});
            const valorFormatado = `R$ ${trans.valor.toFixed(2)}`;
            const tipoClass = trans.tipo === 'Receita' ? 'income' : 'expense';
            html += `<div class="report-transaction-row"><span>${dataFormatada}</span><span>${trans.desc}</span><span class="${tipoClass}">${valorFormatado}</span></div>`;
        });
        const subClass = group.subtotal >= 0 ? 'income' : 'expense';
        html += `<div class="report-category-footer">Subtotal: <span class="${subClass}">R$ ${Math.abs(group.subtotal).toFixed(2)}</span></div></div>`; 
    });
    
    // Total Movimentado (Soma Bruta)
    html += `
        <div class="report-total-footer">
            Total Movimentado: <span style="font-weight: bold;">R$ ${totalAbsoluteMovement.toFixed(2)}</span>
        </div>
    `;
    rf21TableResult.innerHTML = html;
}

// === RELATÓRIO RF22 ===
function handleRF22Generate(e){ 
    e.preventDefault(); 
    const filters = {
        startDate: filterRF22StartDate.value, endDate: filterRF22EndDate.value, type: filterRF22Type.value, limit: parseInt(filterRF22Limit.value), bankId: filterRF22Bank.value ? parseInt(filterRF22Bank.value) : null
    };
    let trans=getFilteredTransactions(filters);
    let catTotals = {};
    let totalGeral = 0;

    trans.forEach(t=>{
        let cid = t.categoriaId || 'outros';
        if(!catTotals[cid]) {
            let c = db.categories.find(x=>x.id==cid);
            let iData = ICON_LIST.find(i=>i.emoji===c.icon);
            catTotals[cid] = { val:0, count:0, name: c ? c.nome : (cid==='outros'?'Saldo/Outros':'?'), icon: c ? c.icon : '', color: iData?iData.color:'' };
        }
        catTotals[cid].val += t.valor;
        catTotals[cid].count++;
        totalGeral += t.valor;
    });
    
    let sortedStats = Object.values(catTotals).sort((a, b) => b.count - a.count);
    if (filters.limit > 0) sortedStats = sortedStats.slice(0, filters.limit);

    let labels = sortedStats.map(s => s.name);
    let data = sortedStats.map(s => s.val);
    let colors = sortedStats.map(s => s.color || '#ccc');
    
    renderRF22Chart(labels, data, colors);
    renderRF22Table(sortedStats, totalGeral);
}
function renderRF22Chart(labels, data, colors){
    if(rf22ChartInstance) rf22ChartInstance.destroy();
    let ctx = rf22Chart.getContext('2d');
    rf22ChartInstance = new Chart(ctx, { 
        type: 'doughnut', 
        data: { labels: labels, datasets: [{ data: data, backgroundColor: colors, borderColor: '#1A1A2E' }] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#fff', padding: 20 } }
            }
        }
    });
}
function renderRF22Table(stats, totalGeral) {
    if (stats.length === 0) { rf22TableResult.innerHTML = '<p>Nenhuma transação encontrada.</p>'; return; }
    let html = "";
    
    // --- TABELA DETALHADA ---
    stats.forEach(stat => {
        const percent = totalGeral > 0 ? ((stat.val / totalGeral) * 100).toFixed(1) : 0;
        const colorStyle = stat.color ? `color: ${stat.color};` : '';
        html += `<div class="report-category-group">
            <div class="report-category-header" style="${colorStyle}">${stat.icon || ''} ${stat.name}</div>
            <div class="report-transaction-row" style="grid-template-columns: 1fr 1fr 1fr;">
                <span>Transações: <strong>${stat.count}</strong></span>
                <span>Valor Total: <strong>R$ ${stat.val.toFixed(2)}</strong></span>
                <span>Participação: <strong>${percent}%</strong></span>
            </div>
        </div>`;
    });
    
    // --- RODAPÉ COM RESUMO DA MAIS USADA ---
    if (stats.length > 0) {
        const topCat = stats[0];
        html += `
            <div class="report-total-footer" style="margin-top: 20px; border-top: 2px solid var(--accent);">
                🏆 Categoria Mais Usada: 
                <span style="color: var(--accent); font-size: 1.1em;">
                    ${topCat.name} (${topCat.count} transações)
                </span>
                <br>
                <span style="font-size: 0.9em; color: var(--text-muted); font-weight: normal;">
                   Valor Total nela: R$ ${topCat.val.toFixed(2)}
                </span>
            </div>
        `;
    }
    
    rf22TableResult.innerHTML = html;
}

// NAVEGAÇÃO
function navigate(scr, btn){ 
    hideAllForms(); hideAllFilters();
    [screenLogin, screenRegister, screenHome, screenMenu, screenUser, screenCategory, screenBank, screenIncome, screenExpense, screenReportSelection, screenReports, screenReportsRF22].forEach(s=>{if(s)s.classList.remove('active')});
    if(scr) scr.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    // MAPEAMENTO DE ELEMENTOS (ESSENCIAL PARA FUNCIONAR)
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
    screenReportSelection = document.getElementById('screenReportSelection');
    screenReports = document.getElementById('screenReports');
    screenReportsRF22 = document.getElementById('screenReportsRF22');
    
    navBtnHome = document.getElementById('btnGoToHome');
    navBtnIncome = document.getElementById('btnGoToIncome_fromNav');
    navBtnExpense = document.getElementById('btnGoToExpense_fromNav');
    navBtnMenu = document.getElementById('btnGoToMenu_fromNav');
    
    // FORMS E BOTÕES DE SALVAR (CRÍTICO PARA ADD/EDITAR)
    userFormSection = document.getElementById('userForm').parentElement; userForm = document.getElementById('userForm'); userSaveButton = userForm.querySelector('.save');
    profileNameInput = document.getElementById('profileName'); profileEmailInput = document.getElementById('profileEmail'); profilePhoneInput = document.getElementById('profilePhone'); profileBirthdateInput = document.getElementById('profileBirthdate'); profilePasswordInput = document.getElementById('profilePassword');

    categoryFormSection = document.getElementById('categoryForm').parentElement; categoryForm = document.getElementById('categoryForm'); categorySaveButton = categoryForm.querySelector('.save');
    categoryIdInput = document.getElementById('categoryId'); categoryNameInput = document.getElementById('categoryName'); categoryTypeInput = document.getElementById('categoryType'); categoryDescInput = document.getElementById('categoryDesc'); categoryIconInput = document.getElementById('categoryIcon'); iconPicker = document.getElementById('iconPicker');
    categoryTableBody = document.getElementById('categoryTableBody'); categoryFilterForm = document.getElementById('categoryFilterForm'); clearCategoryFormBtn = document.getElementById('clearCategoryFormBtn'); btnAddNewCategory = document.getElementById('btnAddNewCategory'); filterCategoryName = document.getElementById('filterCategoryName'); clearCategoryFilterBtn = document.getElementById('clearCategoryFilterBtn'); btnToggleCategoryFilter = document.getElementById('btnToggleCategoryFilter');
    incomeCategorySelect = document.getElementById('incomeCategory'); bankInitialCategorySelect = document.getElementById('bankInitialCategory'); expenseCategorySelect = document.getElementById('expenseCategory');

    bankFormSection = document.getElementById('bankForm').parentElement; bankForm = document.getElementById('bankForm'); bankSaveButton = bankForm.querySelector('.save');
    bankIdInput = document.getElementById('bankId'); bankNameInput = document.getElementById('bankName'); accountNumberInput = document.getElementById('accountNumber'); accountTypeInput = document.getElementById('accountType'); initialBalanceInput = document.getElementById('initialBalance'); initialBalanceDateInput = document.getElementById('initialBalanceDate'); bankCreateOnlyFields = document.getElementById('bankCreateOnlyFields');
    bankTableBody = document.getElementById('bankTableBody'); clearBankFormBtn = document.getElementById('clearBankFormBtn'); btnAddNewBank = document.getElementById('btnAddNewBank');
    bankFilterForm = document.getElementById('bankFilterForm'); filterBankName = document.getElementById('filterBankName'); filterAccountNumber = document.getElementById('filterAccountNumber'); filterAccountType = document.getElementById('filterAccountType'); clearBankFilterBtn = document.getElementById('clearBankFilterBtn'); btnToggleBankFilter = document.getElementById('btnToggleBankFilter');
    incomeBankSelect = document.getElementById('incomeBank'); expenseBankSelect = document.getElementById('expenseBank');

    incomeFormSection = document.getElementById('incomeForm').parentElement; incomeForm = document.getElementById('incomeForm'); incomeSaveButton = incomeForm.querySelector('.save');
    incomeIdInput = document.getElementById('incomeId'); incomeDateInput = document.getElementById('incomeDate'); incomeCategoryInput = document.getElementById('incomeCategory'); incomeBankInput = document.getElementById('incomeBank'); incomeDescInput = document.getElementById('incomeDesc'); incomeValueInput = document.getElementById('incomeValue');
    incomeTableBody = document.getElementById('incomeTableBody'); clearIncomeFormBtn = document.getElementById('clearIncomeFormBtn'); btnAddNewIncome = document.getElementById('btnAddNewIncome');
    incomeFilterForm = document.getElementById('incomeFilterForm'); filterIncomeStartDate = document.getElementById('filterIncomeStartDate'); filterIncomeEndDate = document.getElementById('filterIncomeEndDate'); filterIncomeCategory = document.getElementById('filterIncomeCategory'); clearIncomeFilterBtn = document.getElementById('clearIncomeFilterBtn'); btnToggleIncomeFilter = document.getElementById('btnToggleIncomeFilter');

    expenseFormSection = document.getElementById('expenseForm').parentElement; expenseForm = document.getElementById('expenseForm'); expenseSaveButton = expenseForm.querySelector('.save');
    expenseIdInput = document.getElementById('expenseId'); expenseDateInput = document.getElementById('expenseDate'); expenseCategoryInput = document.getElementById('expenseCategory'); expenseBankInput = document.getElementById('expenseBank'); expenseDescInput = document.getElementById('expenseDesc'); expenseValueInput = document.getElementById('expenseValue');
    expenseTableBody = document.getElementById('expenseTableBody'); clearExpenseFormBtn = document.getElementById('clearExpenseFormBtn'); btnAddNewExpense = document.getElementById('btnAddNewExpense');
    expenseFilterForm = document.getElementById('expenseFilterForm'); filterExpenseStartDate = document.getElementById('filterExpenseStartDate'); filterExpenseEndDate = document.getElementById('filterExpenseEndDate'); filterExpenseCategory = document.getElementById('filterExpenseCategory'); clearExpenseFilterBtn = document.getElementById('clearExpenseFilterBtn'); btnToggleExpenseFilter = document.getElementById('btnToggleExpenseFilter');

    transactionFeed = document.getElementById('transactionFeed');
    modalOverlay = document.getElementById('modalOverlay');
    modalTitle = document.getElementById('modalTitle');
    modalBody = document.getElementById('modalBody');
    btnCloseModal = document.getElementById('btnCloseModal');
    
    // Botões Menu
    btnGoToUser_fromMenu = document.getElementById('btnGoToUser_fromMenu');
    btnGoToCategory_fromMenu = document.getElementById('btnGoToCategory_fromMenu');
    btnGoToBank_fromMenu = document.getElementById('btnGoToBank_fromMenu');
    btnGoToReportSelection_fromMenu = document.getElementById('btnGoToReportSelection_fromMenu');
    
    btnGoToRF21_fromSelection = document.getElementById('btnGoToRF21_fromSelection');
    btnGoToRF22_fromSelection = document.getElementById('btnGoToRF22_fromSelection');
    btnBackToMenu_fromSelection = document.getElementById('btnBackToMenu_fromSelection');
    
    btnBackToSelection_fromRF21 = document.getElementById('btnBackToSelection_fromRF21');
    btnBackToSelection_fromRF22 = document.getElementById('btnBackToSelection_fromRF22');
    
    rf21FilterForm = document.getElementById('rf21FilterForm'); rf21Chart = document.getElementById('rf21Chart'); rf21TableResult = document.getElementById('rf21TableResult');
    filterRF21StartDate = document.getElementById('filterRF21StartDate'); filterRF21EndDate = document.getElementById('filterRF21EndDate'); filterRF21Type = document.getElementById('filterRF21Type'); filterRF21Category = document.getElementById('filterRF21Category'); filterRF21Bank = document.getElementById('filterRF21Bank');

    rf22FilterForm = document.getElementById('rf22FilterForm'); rf22Chart = document.getElementById('rf22Chart'); rf22TableResult = document.getElementById('rf22TableResult');
    filterRF22StartDate = document.getElementById('filterRF22StartDate'); filterRF22EndDate = document.getElementById('filterRF22EndDate'); filterRF22Type = document.getElementById('filterRF22Type'); filterRF22Limit = document.getElementById('filterRF22Limit'); filterRF22Bank = document.getElementById('filterRF22Bank');
    
    btnSeedData = document.getElementById('btnSeedData');

    allFormSections = [categoryFormSection, bankFormSection, incomeFormSection, expenseFormSection];
    allFilterContainers = [categoryFormSection, bankFormSection, incomeFormSection, expenseFormSection];

    // EVENTOS CRÍTICOS DE LOGIN
    if(loginForm) loginForm.addEventListener('submit', handleLogin);
    if(registerForm) registerForm.addEventListener('submit', handleRegister);
    if(btnGoToRegister) btnGoToRegister.addEventListener('click', () => navigate(screenRegister));
    if(btnGoToLogin) btnGoToLogin.addEventListener('click', () => navigate(screenLogin));
    if(btnLogout) btnLogout.addEventListener('click', handleLogout);
    if(btnSeedData) btnSeedData.addEventListener('click', seedDatabase);

    checkSession();
});