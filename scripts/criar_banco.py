import os
import sqlite3

# Cria a pasta 'database' se não existir
if not os.path.exists('database'):
    os.makedirs('database')

conn = sqlite3.connect('database/palavras.db')  # cria o arquivo dentro da pasta database
c = conn.cursor()

# Cria tabela palavras, se não existir
c.execute('''
CREATE TABLE IF NOT EXISTS palavras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    palavra TEXT NOT NULL,
    dica TEXT NOT NULL
)
''')

# Lista de palavras e dicas para inserir
palavras = [
    ('banana', 'Fruta amarela'),
    ('teclado', 'Usado para digitar'),
    ('tigre', 'Animal listrado'),
    ('garrafa', 'Usado para guardar líquido'),
    ('internet', 'Conecta pessoas no mundo inteiro'),
]

# Insere dados
c.executemany('INSERT INTO palavras (palavra, dica) VALUES (?, ?)', palavras)

# Criando Ranking
c.execute('''
CREATE TABLE IF NOT EXISTS ranking (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    pontuacao INTEGER NOT NULL,
    dificuldade TEXT NOT NULL,
    data DATETIME DEFAULT CURRENT_TIMESTAMP
)
''')



conn.commit()
conn.close()

print('Banco de dados criado com sucesso!')

