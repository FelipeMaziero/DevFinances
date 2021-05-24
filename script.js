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

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("dev.finances:transaction")) || []
  },
  set(transactions) {
    localStorage.setItem("dev.finances:transaction",
    JSON.stringify(transactions))
  }
}

const Transaction = {
  all: Storage.get(),

  add(transactions) {
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
    tr.innerHTML = DOM.innerHTMLTransaction(transactions, index)
    tr.dataset.index = index


    DOM.transactionsContainer.appendChild(tr)
  },

  innerHTMLTransaction(transactions, index) {
    const CSSclass = transactions.amount > 0 ? "income" : "expense"

    const amount = Utils.formatCurrency(transactions.amount)


    const html = `
        <tr>
            <td class="description">${transactions.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transactions.date}</td>
            <td>
              <img onclick="transaction.remove(${index})" src="./assets/minus.svg" alt="Remove transação" style="cursor: pointer">
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
  formatAmount(value) {
    value = Number(value) * 100

    return value
  },

  formatDate(date) {
    const splittedDate = date.split("-")
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },

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

const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },


  validateFields() {
    const {
      description,
      amount,
      date
    } = Form.getValues()

    if (description.trim() === "" || amount.trim() === "" || date.trim() === "") {
      throw new Error("Por favor, preencha todos os campos")
    }
  },

  formatValues() {
    let {
      description,
      amount,
      date
    } = Form.getValues()

    amount = Utils.formatAmount(amount)

    date = Utils.formatDate(date)

    return {
      description,
      amount,
      date
    }
  },

  clearfields() {
    Form.description.value = ""
    Form.amount.value = ""
    Form.date.value = ""
  },

  submit(event) {
    event.preventDefault()

    try {
      // verificar se todas as informações foram preenchidas
      Form.validateFields()
      // formatar os dados para salvar
      const transaction = Form.formatValues()
      // salvar
      Transaction.add(transaction)
      // apagar os dados do formulario
      Form.clearfields()
      // modal feche
      modal.close()

    } catch (error) {
      alert(error.message)
    }


  }
}



const App = {
  init() {
    Transaction.all.forEach(function (transactions, index) {
      DOM.addTransaction(transactions, index)
    })

    DOM.updateBalance()

    Storage.set(Transaction.all)

  },

  reload() {
    DOM.clearTransactions()
    App.init()
  },
}

App.init()