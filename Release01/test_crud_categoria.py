import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
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
URL_CATEGORIAS = f"{BASE_URL}/categorias"

CAT_DATA = {
    "nome": "Alimentação (Teste)",
    "tipo": "Despesa",
    "icone": "Icone1",
    "descricao": "Gastos com supermercado."
}

@pytest.mark.order(1)
def test_rf5_inserir_categoria(driver):
    """Testa o RF5: Inserir Categoria"""
    driver.get(URL_CATEGORIAS)
    
    driver.find_element(By.ID, "id-nome").send_keys(CAT_DATA["nome"])
    Select(driver.find_element(By.ID, "id-tipo")).select_by_visible_text(CAT_DATA["tipo"])
    Select(driver.find_element(By.ID, "id-icone")).select_by_visible_text(CAT_DATA["icone"])
    driver.find_element(By.ID, "id-descricao").send_keys(CAT_DATA["descricao"])
    
    driver.find_element(By.ID, "id-botao-salvar").click()
    
    sucesso = WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.ID, "id-mensagem-sucesso"))
    )
    assert "Categoria cadastrada com sucesso" in sucesso.text

@pytest.mark.order(2)
def test_rf6_consultar_categoria(driver):
    """Testa o RF6: Consultar Categoria (na tabela)"""
    driver.get(URL_CATEGORIAS)
    tabela = driver.find_element(By.ID, "id-tabela-resultados")
    assert CAT_DATA["nome"] in tabela.text
    assert CAT_DATA["tipo"] in tabela.text

@pytest.mark.order(3)
def test_rf7_editar_categoria(driver):
    """Testa o RF7: Editar Categoria"""
    driver.get(URL_CATEGORIAS)
    
    # 1. Clica em "Editar"
    driver.find_element(By.ID, "id-btn-editar-1").click()
    
    # 2. Altera a descrição
    
    # ***** MUDANÇA AQUI *****
    # Adiciona uma pausa forçada de 3 segundos para a página carregar
    time.sleep(3)
    
    # Agora que a página carregou, podemos achar o campo
    campo_desc = driver.find_element(By.ID, "id-descricao")
    nova_descricao = "Gastos atualizados."
    campo_desc.clear()
    campo_desc.send_keys(nova_descricao)
    
    # 3. Salva a edição
    driver.find_element(By.ID, "id-botao-salvar-edicao").click()
    
    # 4. Verifica na tabela
    # Adiciona outra pausa para a tabela recarregar
    time.sleep(1)
    
    tabela = driver.find_element(By.ID, "id-tabela-resultados")
    assert nova_descricao in tabela.text

@pytest.mark.order(4)
def test_rf8_remover_categoria(driver):
    """Testa o RF8: Remover Categoria"""
    driver.get(URL_CATEGORIAS)
    
    # 1. Clica em "Remover"
    driver.find_element(By.ID, "id-btn-remover-1").click()
    
    # 2. Verifica a mensagem
    sucesso = driver.find_element(By.ID, "id-mensagem-sucesso")
    assert "Categoria removida com sucesso" in sucesso.text
    
    # 3. Verifica se sumiu da tabela
    tabela = driver.find_element(By.ID, "id-tabela-resultados")
    assert CAT_DATA["nome"] not in tabela.text