# Este é o seu programa: app.py
from flask import Flask, render_template, request, redirect, url_for, flash

# 1. Configuração do App Flask
app = Flask(__name__)
app.secret_key = "secreto" # Necessário para 'flash'

# 2. Nosso "Banco de Dados" Falso (só na memória)
# Vamos usar dicionários para simular Ids únicos
db_usuarios = {}
db_categorias = {}
next_user_id = 1
next_category_id = 1

# 3. Rota Principal - Apenas para dizer "Olá"
@app.route('/')
def index():
    return """
    <h1>App FinControl (VERSÃO FINAL)</h1>
    <p>Seu servidor está no ar!</p>
    <ul>
        <li><a href="/usuarios">CRUD de Usuários</a></li>
        <li><a href="/categorias">CRUD de Categorias</a></li>
    </ul>
    """

# --- CRUD DE USUÁRIO (Baseado no RF1 ao RF4) ---

# Rota para ver a lista E adicionar novo (CREATE + READ)
@app.route('/usuarios', methods=['GET', 'POST'])
def crud_usuarios():
    global next_user_id
    
    # Se o formulário for enviado (POST)
    if request.method == 'POST':
        # [RF1] Cadastrar Usuário
        # Pega os dados do formulário
        novo_usuario = {
            "nome": request.form['nome'],
            "email": request.form['email'],
            "cpf": request.form['cpf'],
            "endereco": request.form['endereco'],
            "data_nasc": request.form['data_nasc'],
            "telefone": request.form['telefone']
        }
        # Adiciona no "banco"
        db_usuarios[next_user_id] = novo_usuario
        next_user_id += 1
        
        flash('Usuário cadastrado com sucesso!') # Mensagem de sucesso
        return redirect(url_for('crud_usuarios')) # Recarrega a página

    # Se for um GET, apenas mostra a página
    # [RF2] Consultar Usuário (aqui mostramos todos)
    return render_template('crud_template.html', 
        titulo="Usuários", 
        items=db_usuarios, 
        form_action=url_for('crud_usuarios'),
        campos_formulario= [
            # Estes campos são baseados na Tabela 1 do seu DRE
            {'nome': 'nome', 'label': 'Nome*', 'tipo': 'text'},
            {'nome': 'email', 'label': 'E-mail', 'tipo': 'email'},
            {'nome': 'cpf', 'label': 'CPF*', 'tipo': 'text'},
            {'nome': 'endereco', 'label': 'Endereço*', 'tipo': 'text'},
            {'nome': 'data_nasc', 'label': 'Data de Nascimento*', 'tipo': 'date'},
            {'nome': 'telefone', 'label': 'Telefone', 'tipo': 'tel'}
        ])

# Rota para DELETAR (DELETE)
# [RF4] Remover Conta
@app.route('/usuarios/remover/<int:user_id>', methods=['POST'])
def remover_usuario(user_id):
    if user_id in db_usuarios:
        del db_usuarios[user_id]
        flash('Usuário removido com sucesso!')
    else:
        flash('Usuário não encontrado!')
    return redirect(url_for('crud_usuarios'))

# Rota para EDITAR (UPDATE) - Etapa 1: Mostrar formulário
# [RF3] Editar Usuário
@app.route('/usuarios/editar/<int:user_id>', methods=['GET'])
def editar_usuario_form(user_id):
    if user_id not in db_usuarios:
        flash('Usuário não encontrado!')
        return redirect(url_for('crud_usuarios'))
    
    usuario = db_usuarios[user_id]
    # O RF3 diz que Nome e CPF não podem ser mudados
    return render_template('edit_template.html',
        titulo=f"Editando Usuário: {usuario['nome']}",
        item=usuario,
        form_action=url_for('editar_usuario_salvar', user_id=user_id),
        campos_formulario=[
            {'nome': 'email', 'label': 'E-mail', 'tipo': 'email', 'valor': usuario['email']},
            {'nome': 'endereco', 'label': 'Endereço*', 'tipo': 'text', 'valor': usuario['endereco']},
            {'nome': 'data_nasc', 'label': 'Data de Nascimento*', 'tipo': 'date', 'valor': usuario['data_nasc']},
            {'nome': 'telefone', 'label': 'Telefone', 'tipo': 'tel', 'valor': usuario['telefone']}
        ],
        campos_fixos=[
            {'label': 'Nome (Fixo)', 'valor': usuario['nome']},
            {'label': 'CPF (Fixo)', 'valor': usuario['cpf']}
        ],
        # *** ESTA É A CORREÇÃO ***
        cancel_url=url_for('crud_usuarios')
    )

# Rota para EDITAR (UPDATE) - Etapa 2: Salvar dados
@app.route('/usuarios/editar/<int:user_id>', methods=['POST'])
def editar_usuario_salvar(user_id):
    if user_id not in db_usuarios:
        flash('Usuário não encontrado!')
        return redirect(url_for('crud_usuarios'))
    
    # Atualiza os dados no "banco"
    db_usuarios[user_id]['email'] = request.form['email']
    db_usuarios[user_id]['endereco'] = request.form['endereco']
    db_usuarios[user_id]['data_nasc'] = request.form['data_nasc']
    db_usuarios[user_id]['telefone'] = request.form['telefone']
    
    flash('Usuário atualizado com sucesso!')
    return redirect(url_for('crud_usuarios'))


# --- CRUD DE CATEGORIA (Baseado no RF5 ao RF8) ---

# Rota para ver a lista E adicionar nova (CREATE + READ)
@app.route('/categorias', methods=['GET', 'POST'])
def crud_categorias():
    global next_category_id
    
    if request.method == 'POST':
        # [RF5] Inserir Categoria
        nova_categoria = {
            "nome": request.form['nome'],
            "tipo": request.form['tipo'],
            "icone": request.form['icone'],
            "descricao": request.form['descricao']
        }
        db_categorias[next_category_id] = nova_categoria
        next_category_id += 1
        
        flash('Categoria cadastrada com sucesso!')
        return redirect(url_for('crud_categorias'))

    # [RF6] Consultar Categoria
    return render_template('crud_template.html', 
        titulo="Categorias", 
        items=db_categorias, 
        form_action=url_for('crud_categorias'),
        campos_formulario= [
            # Estes campos são baseados na Tabela 3 do seu DRE
            {'nome': 'nome', 'label': 'Nome da Categoria*', 'tipo': 'text'},
            {'nome': 'tipo', 'label': 'Tipo', 'tipo': 'select', 'opcoes': ['Receita', 'Despesa']},
            {'nome': 'icone', 'label': 'Ícone*', 'tipo': 'select', 'opcoes': ['Icone1', 'Icone2', 'Icone3']},
            {'nome': 'descricao', 'label': 'Descrição', 'tipo': 'text'}
        ])

# Rota para DELETAR (DELETE)
# [RF8] Remover Categoria
@app.route('/categorias/remover/<int:cat_id>', methods=['POST'])
def remover_categoria(cat_id):
    if cat_id in db_categorias:
        del db_categorias[cat_id]
        flash('Categoria removida com sucesso!')
    return redirect(url_for('crud_categorias'))

# Rota para EDITAR (UPDATE) - Etapa 1: Mostrar formulário
# [RF7] Editar Categoria
@app.route('/categorias/editar/<int:cat_id>', methods=['GET'])
def editar_categoria_form(cat_id):
    if cat_id not in db_categorias:
        flash('Categoria não encontrada!')
        return redirect(url_for('crud_categorias'))
    
    cat = db_categorias[cat_id]
    # RF7 diz que todos os campos podem ser modificados
    return render_template('edit_template.html',
        titulo=f"Editando Categoria: {cat['nome']}",
        item=cat,
        form_action=url_for('editar_categoria_salvar', cat_id=cat_id),
        campos_formulario=[
            {'nome': 'nome', 'label': 'Nome da Categoria*', 'tipo': 'text', 'valor': cat['nome']},
            {'nome': 'tipo', 'label': 'Tipo', 'tipo': 'select', 'opcoes': ['Receita', 'Despesa'], 'selecionado': cat['tipo']},
            {'nome': 'icone', 'label': 'Ícone*', 'tipo': 'select', 'opcoes': ['Icone1', 'Icone2', 'Icone3'], 'selecionado': cat['icone']},
            {'nome': 'descricao', 'label': 'Descrição', 'tipo': 'text', 'valor': cat['descricao']}
        ],
        campos_fixos=[],
        # *** ESTA É A CORREÇÃO ***
        cancel_url=url_for('crud_categorias')
    )

# Rota para EDITAR (UPDATE) - Etapa 2: Salvar dados
@app.route('/categorias/editar/<int:cat_id>', methods=['POST'])
def editar_categoria_salvar(cat_id):
    if cat_id not in db_categorias:
        flash('Categoria não encontrada!')
        return redirect(url_for('crud_categorias'))
    
    db_categorias[cat_id]['nome'] = request.form['nome']
    db_categorias[cat_id]['tipo'] = request.form['tipo']
    db_categorias[cat_id]['icone'] = request.form['icone']
    db_categorias[cat_id]['descricao'] = request.form['descricao']
    
    flash('Categoria atualizada com sucesso!')
    return redirect(url_for('crud_categorias'))

# --- FIM DOS CRUDS ---

# 4. Inicia o servidor
if __name__ == '__main__':
    # Cria os arquivos HTML que o Flask vai usar
    
    # Template principal do CRUD (Formulário + Tabela)
    html_crud = """
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <title>CRUD {{ titulo }}</title>
        <style>
            body { font-family: sans-serif; margin: 20px; }
            h1, h2 { color: #333; }
            form { background: #f4f4f4; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            div { margin-bottom: 10px; }
            label { display: block; margin-bottom: 5px; font-weight: bold; }
            input[type='text'], input[type='email'], input[type='tel'], input[type='date'], select {
                width: 300px; padding: 8px; border: 1px solid #ccc; border-radius: 4px;
            }
            button { background: #007bff; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; }
            button:hover { background: #0056b3; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background: #f0f0f0; }
            .acoes { display: flex; gap: 5px; }
            .btn-editar { background: #ffc107; }
            .btn-remover { background: #dc3545; }
            .msg-sucesso { background: #d4edda; color: #155724; padding: 10px; border-radius: 4px; margin-bottom: 15px; }
        </style>
    </head>
    <body>
        <h1>CRUD de {{ titulo }}</h1>
        
        {% with messages = get_flashed_messages() %}
          {% if messages %}
            <div class="msg-sucesso" id="id-mensagem-sucesso">
              {{ messages[0] }}
            </div>
          {% endif %}
        {% endwith %}

        <h2>1. Cadastrar Novo (Create)</h2>
        <form action="{{ form_action }}" method="POST">
            {% for campo in campos_formulario %}
            <div>
                <label for="id-{{ campo.nome }}">{{ campo.label }}</label>
                {% if campo.tipo == 'select' %}
                    <select name="{{ campo.nome }}" id="id-{{ campo.nome }}">
                        {% for op in campo.opcoes %}
                        <option value="{{ op }}">{{ op }}</option>
                        {% endfor %}
                    </select>
                {% else %}
                    <input type="{{ campo.tipo }}" name="{{ campo.nome }}" id="id-{{ campo.nome }}">
                {% endif %}
            </div>
            {% endfor %}
            <button type="submit" id="id-botao-salvar">Salvar</button>
        </form>

        <h2>2. Consultar (Read)</h2>
        <p>Filtragem: O Selenium fará a filtragem visual.</p>
        <table id="id-tabela-resultados">
            <thead>
                <tr>
                    <th>ID</th>
                    {% for campo in campos_formulario %}
                    <th>{{ campo.label }}</th>
                    {% endfor %}
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {% for id, item in items.items() %}
                <tr>
                    <td>{{ id }}</td>
                    {% for campo in campos_formulario %}
                    <td>{{ item[campo.nome] }}</td>
                    {% endfor %}
                    <td class="acoes">
                        {% if titulo == "Usuários" %}
                            <a href="/usuarios/editar/{{ id }}" class="btn-editar" id="id-btn-editar-{{ id }}">Editar</a>
                            <form action="/usuarios/remover/{{ id }}" method="POST" style="margin:0;">
                                <button type="submit" class="btn-remover" id="id-btn-remover-{{ id }}">Remover</button>
                            </form>
                        {% elif titulo == "Categorias" %}
                            <a href="/categorias/editar/{{ id }}" class="btn-editar" id="id-btn-editar-{{ id }}">Editar</a>
                            <form action="/categorias/remover/{{ id }}" method="POST" style="margin:0;">
                                <button type="submit" class="btn-remover" id="id-btn-remover-{{ id }}">Remover</button>
                            </form>
                        {% endif %}
                    </td>
                </tr>
                {% else %}
                <tr>
                    <td colspan="{{ campos_formulario|length + 2 }}">Nenhum item cadastrado.</td>
                </tr>
                {% endfor %}
            </tbody>
        </table>
    </body>
    </html>
    """

    # Template da página de Edição
    html_edit = """
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <title>{{ titulo }}</title>
        <style>
            body { font-family: sans-serif; margin: 20px; }
            h1 { color: #333; }
            form { background: #f4f4f4; padding: 15px; border-radius: 8px; }
            div { margin-bottom: 10px; }
            label { display: block; margin-bottom: 5px; font-weight: bold; }
            input[type='text'], input[type='email'], input[type='tel'], input[type='date'], select, input[disabled] {
                width: 300px; padding: 8px; border: 1px solid #ccc; border-radius: 4px;
            }
            input[disabled] { background: #eee; }
            button { background: #28a745; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; }
            button:hover { background: #218838; }
            .campo-fixo { margin-bottom: 10px; }
        </style>
    </head>
    <body>
        <h1>{{ titulo }}</h1>
        <form action="{{ form_action }}" method="POST">
            
            {% for campo in campos_fixos %}
            <div class="campo-fixo">
                <label>{{ campo.label }}</label>
                <input type="text" value="{{ campo.valor }}" disabled>
            </div>
            {% endfor %}

            {% for campo in campos_formulario %}
            <div>
                <label for="id-{{ campo.nome }}">{{ campo.label }}</label>
                {% if campo.tipo == 'select' %}
                    <select name="{{ campo.nome }}" id="id-{{ campo.nome }}">
                        {% for op in campo.opcoes %}
                        <option value="{{ op }}" {% if 'selecionado' in campo and op == campo.selecionado %}selected{% endif %}>{{ op }}</option>
                        {% endfor %}
                    </select>
                {% else %}
                    <input type="{{ campo.tipo }}" name="{{ campo.nome }}" id="id-{{ campo.nome }}" value="{{ campo.get('valor', '') }}">
                {% endif %}
            </div>
            {% endfor %}
            <button type="submit" id="id-botao-salvar-edicao">Salvar Edição</button>
        </form>
        <a href="{{ cancel_url }}">Cancelar e Voltar</a>
    </body>
    </html>
    """
    
    # Cria os arquivos HTML fisicamente na pasta 'templates'
    import os
    if not os.path.exists('templates'):
        os.makedirs('templates')
    
    with open('templates/crud_template.html', 'w', encoding='utf-8') as f:
        f.write(html_crud)
    
    with open('templates/edit_template.html', 'w', encoding='utf-8') as f:
        f.write(html_edit)

    print("="*50)
    print("Servidor FinControl (VERSÃO FINAL) está pronto!")
    print("Acesse em: http://127.0.0.1:5000")
    print("="*50)
    app.run(debug=True, port=5000)