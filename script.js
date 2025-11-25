let dataArray = []
const form = document.querySelector("#form")

function handleSubmit(e){
    // Empêcher la propagation
    e.preventDefault()

    // On appelle le formulaire
    const formData = new FormData(e.target)


    // On récupéré tous les inputs via leur name 
    const description = formData.get("description")
    const amount = formData.get("amount") 
    const category = formData.get("category")
    const type = formData.get("type")

    // Condition pour la validation du formulaire 
    if(description === "" || amount === ""){
        alert("You need to fill in the fields")
         return
    } if (amount <= 0){
        alert("Amount needs to be superiour to 0")
         return
    } else {
            // Transformation en objet de l'envoie des données
            const transaction = {
                id: Date.now(),
                description,
                amount,
                category,
                type
            }
            // Qu'on envoie dans le tableau des données
            dataArray.push(transaction)
            localStorage.setItem("transactions", JSON.stringify(dataArray))
            displayTransactions()
            updateStats()
            
    }

}

function displayTransactions() {
    // 1. Sélectionner le container
    const listContainer = document.getElementById('transactionsList');
    
    // 2. Vider le container
    listContainer.innerHTML = '';
    
    // 3. Boucler sur le tableau
    dataArray.forEach(transaction => {
        
        // Créer transaction-item
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('transaction-item');
        
        // Créer transaction-info
        const infoDiv = document.createElement('div');
        infoDiv.classList.add('transaction-info');
        
        // Créer transaction-details
        const detailsDiv = document.createElement('div');
        detailsDiv.classList.add('transaction-details');
        
        // Nom de la transaction
        const nameP = document.createElement('p');
        nameP.classList.add('transaction-name');
        nameP.textContent = transaction.description;
        
        // Catégorie
        const categoryP = document.createElement('p');
        categoryP.classList.add('transaction-category');
        categoryP.textContent = transaction.category;
        
        // Ajouter nom et catégorie dans details
        detailsDiv.appendChild(nameP);
        detailsDiv.appendChild(categoryP);
        
        // Créer transaction-right
        const rightDiv = document.createElement('div');
        rightDiv.classList.add('transaction-right');
        
        // Montant
        const amountSpan = document.createElement('span');
        amountSpan.classList.add('transaction-amount');
        amountSpan.classList.add(transaction.type); // 'income' ou 'expense'
        const sign = transaction.type === 'income' ? '+' : '-';
        amountSpan.textContent = `${sign}£${transaction.amount}`;
        
        // Ajouter montant dans right
        rightDiv.appendChild(amountSpan);
        
        // Bouton supprimer
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'X';

        deleteBtn.addEventListener("click",() => {
            deleteTransactions(transaction.id)
        })
        
        // Assembler tout
        infoDiv.appendChild(detailsDiv);
        infoDiv.appendChild(rightDiv);
        infoDiv.appendChild(deleteBtn);
        itemDiv.appendChild(infoDiv);
        
        // Ajouter dans le container
        listContainer.appendChild(itemDiv);
    });
}

function updateStats(){
    let totalIncome = 0;
    let totalExpense = 0;
    let totalBalance = 0;
    
   dataArray.forEach(transaction => {
       if(transaction.type === "income"){
       totalIncome += Number(transaction.amount)
    }  if (transaction.type === "expense") {
        totalExpense += Number(transaction.amount)
    } 
   })
   totalBalance = totalIncome - totalExpense
    document.getElementById("totalIncomeAmount").textContent = `${totalIncome}€`;
    document.getElementById("totalExpenseAmount").textContent = `${totalExpense}€`;
    document.getElementById("totalBalanced").textContent = `${totalBalance}€`
   
}

function deleteTransactions(id){
    // On filtre l'id que l'on souhaite supprimé 
    dataArray = dataArray.filter(transaction => transaction.id !== id);

    // On rafraîchit le local storage ainsi que les fonctions afin de les mettres a jour suite a la suppression
    localStorage.setItem("transactions",JSON.stringify(dataArray))
    displayTransactions()
    updateStats()

}

form.addEventListener("submit", handleSubmit)
// Création du local Storage pour stocker les données rentrées par l'utilisateur
const storedData = localStorage.getItem("transactions");
if(storedData){
    dataArray = JSON.parse(storedData)
}
displayTransactions()
updateStats()

