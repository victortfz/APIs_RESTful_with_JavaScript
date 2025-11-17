import { useState, useEffect } from 'react';
import { getCardapio } from './services/api'; // Importa nossa função da API
import './App.css'; // Vite inclui este CSS básico

function App() {
  // Estado para guardar os itens do cardápio
  const [cardapio, setCardapio] = useState([]);
  // Estado para gerenciar o status de carregamento
  const [loading, setLoading] = useState(true);
  // Estado para erros
  const [error, setError] = useState(null);

  // useEffect: Roda quando o componente "monta" (inicia)
  useEffect(() => {
    // Função interna para "chamar o garçom"
    const fetchCardapio = async () => {
      try {
        const response = await getCardapio();
        console.log('✅ Front-end: "Cardápio recebido!"', response.data);
        
        // A resposta da API vem em response.data.dados (conforme nosso back-end)
        if (response.data.dados) {
          setCardapio(response.data.dados);
        } else {
          setCardapio(response.data); // Fallback caso a estrutura seja diferente
        }
      } catch (err) {
        console.error('❌ Front-end: "Erro ao buscar o cardápio"', err);
        setError(err); // Guarda o erro no estado
      } finally {
        setLoading(false); // Para de carregar (com sucesso ou erro)
      }
    };

    fetchCardapio(); // Chama a função
  }, []); // O array vazio [] significa que este efeito roda APENAS UMA VEZ

  // --- Renderização ---

  if (loading) {
    return (
      <div className="App">
        <h1>🍽️ Restaurante 🍽️</h1>
        <div className="loading">Carregando o cardápio...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <h1>🍽️ Restaurante 🍽️</h1>
        <div className="error">
          <p>❌ Erro: A "Cozinha" (Back-end) não respondeu.</p>
          <p>Verifique se o servidor está rodando em http://localhost:4000</p>
        </div>
      </div>
    );
  }

  // Se deu tudo certo:
  return (
    <div className="App">
      <h1>🍽️ Cardápio do Restaurante 🍽️</h1>
      <p className="subtitle">Bem-vindo! Confira nossos deliciosos pratos:</p>
      
      <div className="cardapio-lista">
        {cardapio.map((item) => (
          <div key={item.id} className="cardapio-item">
            <h2>{item.nome}</h2>
            <p className="descricao">{item.descricao}</p>
            <p className="preco">R$ {item.preco.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
