const modal = {
  open() {
    // Abrir modal
    // Adicionar a class active ao modal
    const overlay = document.querySelector('.modal-overlay')
    overlay.classList.add('active')
  },
  close() {
    // Fechar Modal
    // Remove a class active do modal
    const overlay = document.querySelector('.modal-overlay')
    overlay.classList.remove('active')
  }
}



// Eu preciso somar as entradas
// depois eu preciso somar as saídas
// remover das entradas o valor das saídas
// assim, eu terei o total

const Transaction = {
  all: [{
    description: 'Luz',
    amount: -50000,
    date: '20/05/2021',
  },
  {
    description: 'Website',
    amount: 500000,
    date: '20/05/2021',
  },
  {
    description: 'Internet',
    amount: -20000,
    date: '20/05/2021',
  },
  {
    description: 'App',
    amount: -20000,
    date: '20/05/2021',
  },

],

  add(transactions){
    Transaction.all.push(transactions)

    App.reload()
    
  },

  remove(index) {
    Transaction.all.splice(index, 1)

    App.reload()
  },

  incomes() {
    let income = 0
    // pegar todas as transacoes
    // para cada transacao,
    Transaction.all.forEach(transactions => {
      // se ela for maior que zero
      if (transactions.amount > 0) {
        // somar a uma variavel e retornar a variavel
        income += transactions.amount
      }
    })
    return income
  },
  expenses() {
    let expense = 0
    Transaction.all.forEach(transactions => {
      // se ela for menor que zero
      if (transactions.amount < 0) {
        // somar a uma variavel e retornar a variavel
        expense += transactions.amount
      }
    })
    return expense
  },
  total() {
    return Transaction.incomes() + Transaction.expenses()
  }
}



const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),

  addTransaction(transactions, index) {
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transactions)


    DOM.transactionsContainer.appendChild(tr)
  },

  innerHTMLTransaction(transactions) {
    const CSSclass = transactions.amount > 0 ? "income" : "expense"

    const amount = Utils.formatCurrency(transactions.amount)


    const html = `
        <tr>
            <td class="description">${transactions.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transactions.date}</td>
            <td>
              <img src="./assets/minus.svg" alt="Remove transação">
            </td>
          </tr>
    `

    return html
  },

  updateBalance() {
    document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())
    document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())
    document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())
  },

  clearTransactions() {
    DOM.transactionsContainer.innerHTML = ""
  }
}

const Utils = {
  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : ""

    value = String(value).replace(/\D/g, "") // esse /\D/g significa que vai procurar por qualquer caractere diferente de numero e trocar por nada. Ache somente numeros

    value = Number(value) / 100

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })

    return signal + value;
  }
}

const App = {
  init() {
    Transaction.all.forEach(transactions =>{
      DOM.addTransaction(transactions)
    })
    
    DOM.updateBalance()
    
  },

  reload() {
    DOM.clearTransactions()
    App.init()
  },
}

App.init()



