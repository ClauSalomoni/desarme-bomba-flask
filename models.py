import sqlite3

def query_db(query, args=(), one=False, write=False):
    conn = sqlite3.connect('database/palavras.db')
    conn.row_factory = sqlite3.Row
    cur = conn.execute(query, args)
    if write:
        conn.commit()
        result = None
    else:
        rv = cur.fetchall()
        result = dict(rv[0]) if (rv and one) else [dict(row) for row in rv]
    cur.close()
    conn.close()
    return result
# Função para pegar uma palavra e dica aleatória do banco
def get_random_palavra(nivel):
    resultado = query_db(
        'SELECT palavra, dica FROM palavras WHERE nivel = ? ORDER BY RANDOM() LIMIT 1',
        [nivel],
        one=True
    )
    return resultado or {'palavra': '', 'dica': 'Nenhuma palavra encontrada'}

###Funcs para ranking
def salvar_pontuacao(nome, pontuacao, dificuldade):
    conn = sqlite3.connect('database/palavras.db')
    cur = conn.cursor()
    cur.execute('''
        INSERT INTO ranking (nome, pontuacao, dificuldade)
        VALUES (?, ?, ?)
    ''', (nome, pontuacao, dificuldade))
    conn.commit()
    cur.close()
    conn.close()

def get_ranking_top10():
    resultado = query_db(
        'SELECT nome, pontuacao, dificuldade, data FROM ranking ORDER BY pontuacao DESC LIMIT 10'
    )
    return resultado