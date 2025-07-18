from flask import render_template, jsonify, request, session, redirect, url_for
from app import app
import models
import random

# Rota principal (serve o HTML do jogo)
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/escolher_nivel', methods=['POST'])
def escolher_nivel():
    nivel = request.form.get('nivel')
    if nivel not in ['facil', 'medio', 'dificil']:
        return "Nível inválido", 400
    session['nivel'] = nivel
    return redirect(url_for('jogo'))

@app.route('/jogo')
def jogo():
    nivel = session.get('nivel')
    return render_template('index.html', nivel=nivel)

@app.route('/palavra_aleatoria')
def palavra():
    nivel = session.get('nivel', 'facil')
    palavra = models.get_random_palavra(nivel)
    return jsonify(palavra)

@app.route('/validar_resposta', methods=['POST'])
def validar_resposta():
    data = request.get_json()
    resposta_usuario = data['resposta'].lower().strip()
    palavra_atual = data['palavra_atual'].lower()

    if resposta_usuario == palavra_atual:
        return jsonify({
            'acerto': True,
            'mensagem': 'Parabéns! Confira a dica acima da bomba',
            'proximo_desafio': 'desafio2'
        })
    else:
        return jsonify({
            'acerto': False,
            'mensagem': 'Você perdeu 10 segundos. Tente novamente!',
            'penalidade': 10
        })

@app.route('/validar_calculo', methods=['POST'])
def validar_calculo():
    data = request.get_json()
    resposta_usuario = data.get('resposta_usuario')
    desafio = data.get('desafio')

    try:
        resposta_usuario = float(resposta_usuario)
    except:
        return jsonify({'acerto': False, 'mensagem': 'Resposta inválida.'})

    def calcular(a, b, op):
        if op == '+': return a + b
        if op == '-': return a - b
        if op == '*': return a * b
        if op == '/': return a / b
        return None

    try:
        resultado = calcular(desafio['a1'], desafio['b1'], desafio['operacao1'])

        if desafio['nivel'] != 'facil':
            resultado = calcular(resultado, desafio['b2'], desafio['operacao2'])

        acerto = abs(resposta_usuario - resultado) < 1e-6
        return jsonify({
            'acerto': acerto,
            'mensagem': 'Certo!' if acerto else 'Errado.'
        })

    except Exception as e:
        print("Erro no cálculo:", e)
        return jsonify({'acerto': False, 'mensagem': 'Erro no servidor'})
# mudanças
@app.route('/iniciar_adivinha', methods=['POST'])
def iniciar_adivinha():
    nivel = session.get('nivel', 'facil')
    if nivel == 'facil':
        num_tentativas = 10
    elif nivel == 'medio':
        num_tentativas = 8
    else:
        num_tentativas = 6

    numero_aleatorio = random.randint(0, 100)
    session['numero_aleatorio'] = numero_aleatorio
    session['num_tentativas'] = num_tentativas
    session['registro_palpite'] = []

    return jsonify({
        'msg': f'Um número entre 0 e 100 foi sorteado. Você tem {num_tentativas} tentativas. Boa sorte!'
    })


@app.route('/validar_palpite', methods=['POST'])
def validar_palpite():
    data = request.get_json()
    palpite = data.get('palpite')

    if palpite is None:
        return jsonify({'erro': 'Palpite não enviado'}), 400

    try:
        palpite = int(palpite)
    except:
        return jsonify({'erro': 'Palpite inválido'}), 400

    numero_aleatorio = session.get('numero_aleatorio')
    num_tentativas = session.get('num_tentativas', 0)
    registro_palpite = session.get('registro_palpite', [])

    if numero_aleatorio is None or num_tentativas <= 0:
        return jsonify({'erro': 'Jogo não iniciado ou terminado'}), 400

    registro_palpite.append(palpite)
    num_tentativas -= 1

    session['num_tentativas'] = num_tentativas
    session['registro_palpite'] = registro_palpite

    if palpite == numero_aleatorio:
        return jsonify({
            'acertou': True,
            'mensagem': 'Parabéns, você acertou!!! Confira a dica lá em cima.',
            'registro': registro_palpite
        })
    else:
        if num_tentativas <= 0:
            # Reinicia o jogo automaticamente aqui (opcional)
            msg = f'Você perdeu! O número era {numero_aleatorio}. Um novo número foi sorteado.'
            # Reinicia para novo jogo:
            novo_numero = random.randint(0, 100)
            if 'nivel' in session:
                nivel = session['nivel']
            else:
                nivel = 'facil'

            if nivel == 'facil':
                num_tentativas = 10
            elif nivel == 'medio':
                num_tentativas = 8
            else:
                num_tentativas = 6

            session['numero_aleatorio'] = novo_numero
            session['num_tentativas'] = num_tentativas
            session['registro_palpite'] = []

            return jsonify({
                'acertou': False,
                'mensagem': msg,
                'tentativas_restantes': 0,
                'registro': []
            })

        else:
            dica = "menor" if palpite > numero_aleatorio else "maior"
            return jsonify({
                'acertou': False,
                'mensagem': f'O número sorteado é {dica}. Você tem {num_tentativas} tentativas restantes.',
                'tentativas_restantes': num_tentativas,
                'registro': registro_palpite
            })

@app.route('/salvar_pontuacao', methods=['POST'])
def salvar_pontuacao_route():
    dados = request.get_json()
    nome = dados.get('nome')
    pontuacao = dados.get('pontuacao')
    dificuldade = dados.get('dificuldade')

    if not all([nome, pontuacao, dificuldade]):
        return jsonify({'erro': 'Dados incompletos'}), 400

    models.salvar_pontuacao(nome, pontuacao, dificuldade)
    return jsonify({'status': 'Pontuação salva com sucesso'})

@app.route('/ranking')
def ranking_route():
    ranking = models.get_ranking_top10()
    return render_template('ranking.html', ranking=ranking)


@app.route('/reiniciar')
def reiniciar():
    session.pop('nivel', None)
    return redirect(url_for('jogo'))