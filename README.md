# 💣 Desarme da Bomba – Versão Flask

Um jogo interativo criado com Python (Flask), HTML, CSS e JavaScript. O objetivo é desarmar a bomba resolvendo desafios lógicos antes que o tempo acabe.

## 🌐 Demo Online

Este projeto sera publicado e disponível online em:  
[Jogo Desarme a Bomba](https://desarme-bomba-flask.onrender.com/)

## 🚀 Tecnologias Utilizadas

- Python 3.x
- Flask
- HTML5
- CSS3
- JavaScript (DOM, lógica)
- SQLite (para ranking dos jogadores)
- Render (para deploy)

## 🧪 Como rodar localmente

1. **Clone o repositório:**

```bash
git clone https://github.com/ClauSalomoni/desarme-bomba-flask.git
cd desarme-bomba-flask
```
2. **Crie e ative o ambiente virtual**
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

3. **Instale as dependências**
pip install -r requirements.txt

4. **Configure o .env**
Crie um arquivo .env na raiz. Ex:
SECRET_KEY=sua_chave_secreta_aqui

5. **Rode a aplicação**
flask run
Abra no navegador: http://127.0.0.1:5000