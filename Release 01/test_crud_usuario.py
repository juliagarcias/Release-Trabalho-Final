import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time  # Certifique-se de que 'import time' está no topo

# --- Configuração do Teste (Fixture) ---
@pytest.fixture
def driver():
    driver = webdriver.Chrome()
    driver.implicitly_wait(3)
    yield driver
    driver.quit()

# --- Constantes de Teste ---
BASE_URL = "http://127.0.0.1:5000"
URL_USUARIOS = f"{BASE_URL}/usuarios"

# Dados de teste
USER_DATA = {
    "nome": "Maria Silva Teste",
    "email": "maria.teste@email.com",
    "cpf": "123.456.789-00",
    "telefone": "(35) 99999-1234",
    "endereco": "Rua Teste, 123",
    "data_nasc": "2000-01-01"
}

@pytest.mark.order(1)
def test_rf1_cadastrar_usuario(driver):
    """Testa o RF1: Cadastrar Usuário"""
    driver.get(URL_USUARIOS)
    
    driver.find_element(By.ID, "id-nome").send_keys(USER_DATA["nome"])
    driver.find_element(By.ID, "id-email").send_keys(USER_DATA["email"])
    driver.find_element(By.ID, "id-cpf").send_keys(USER_DATA["cpf"])
    driver.find_element(By.ID, "id-endereco").send_keys(USER_DATA["endereco"])
    driver.find_element(By.ID, "id-data_nasc").send_keys(USER_DATA["data_nasc"])
    driver.find_element(By.ID, "id-telefone").send_keys(USER_DATA["telefone"])
    
    driver.find_element(By.ID, "id-botao-salvar").click()
    
    wait = WebDriverWait(driver, 5)
    sucesso = wait.until(EC.presence_of_element_located((By.ID, "id-mensagem-sucesso")))
    assert "Usuário cadastrado com sucesso" in sucesso.text

@pytest.mark.order(2)
def test_rf2_consultar_usuario(driver):
    """Testa o RF2: Consultar Usuário (na tabela)"""
    driver.get(URL_USUARIOS)
    tabela = driver.find_element(By.ID, "id-tabela-resultados")
    assert USER_DATA["nome"] in tabela.text
    assert USER_DATA["cpf"] in tabela.text

@pytest.mark.order(3)
def test_rf3_editar_usuario(driver):
    """Testa o RF3: Editar Usuário"""
    driver.get(URL_USUARIOS)
    
    # 1. Encontra o botão "Editar"
    driver.find_element(By.ID, "id-btn-editar-1").click()
    
    # 2. Altera o telefone
    
    # ***** MUDANÇA AQUI *****
    # Adiciona uma pausa forçada de 3 segundos para a página carregar
    time.sleep(3) 
    
    # Agora que a página carregou, podemos achar o campo
    campo_telefone = driver.find_element(By.ID, "id-telefone")
    novo_telefone = "(35) 98888-5555"
    campo_telefone.clear()
    campo_telefone.send_keys(novo_telefone)
    
    # 3. Salva a edição
    driver.find_element(By.ID, "id-botao-salvar-edicao").click()
    
    # 4. Verifica se a mudança foi salva
    # Adiciona outra pausa para a tabela recarregar
    time.sleep(1) 
    
    tabela = driver.find_element(By.ID, "id-tabela-resultados")
    assert novo_telefone in tabela.text
    assert USER_DATA["nome"] in tabela.text

@pytest.mark.order(4)
def test_rf4_remover_usuario(driver):
    """Testa o RF4: Remover Conta"""
    driver.get(URL_USUARIOS)
    
    # 1. Clica no botão "Remover"
    driver.find_element(By.ID, "id-btn-remover-1").click()
    
    # 2. Verifica se foi removido
    sucesso = driver.find_element(By.ID, "id-mensagem-sucesso")
    assert "Usuário removido com sucesso" in sucesso.text
    
    # 3. Verifica se o nome sumiu da tabela
    tabela = driver.find_element(By.ID, "id-tabela-resultados")
    assert USER_DATA["nome"] not in tabela.text