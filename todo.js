// Tüm elementleri seçme
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardbody = document.querySelectorAll(".card-body")[0];
const secondCardbody = document.querySelectorAll(".card-body")[1];
const filterInput = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners(); // bu şekilde, sayfa ilk yüklendiğinde event listenerlar çalışacak.

function eventListeners() {     // Tüm event listenerlar buraya yazılacak, fonksiyon olarak
    form.addEventListener("submit",addTodo); // *1* ilk event listener, aşağıda addTodo fonksiyonu tanımlanacak
    document.addEventListener("DOMContentLoaded",(loadAllTodosToUI));  // *5* Sayfa yeniden yüklendiğinde bu listener çalışır. DOMContentLoaded
    document.addEventListener("click",deleteTodo); // *6* silme tuşuna basıldığında çalışacak fonksiyon
    filterInput.addEventListener("keyup",filterTodos); // *7* filtreleme input'una bir şey yazıldığında çalışacak fonksiyon
    clearButton.addEventListener("click",clearAllTodos); // *8* tüm taskları temizleyin'e tıklandığında çalışacak fonksiyon
}


function clearAllTodos() {            // *8*
    if (confirm("Emin misiniz ?")){
        // todoList.innerHTML = "";  // bu yöntem yavaş kalır. bunun yerine, firstElementChild'ın null'e eşit olduğu duruma kadar döngüye girecek şekilde while döngüsü kullanacağız.
        
        while (todoList.firstElementChild != null) {    // todoList'in firstElementChild'ı null'e eşit değilse dedik,
            todoList.removeChild(todoList.firstElementChild);   // firstElementChild'ı sil dedik.
        }       // Yani, firstElementChild null olana kadar bu döngüyü devam ettirecek ve tamamını silmiş olacak.
    }
    
    localStorage.removeItem("todos");

}



function filterTodos(e) {       // *7*
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLowerCase();

        if (text.indexOf(filterValue) === -1){
            listItem.setAttribute("style","display : none !important");
        }
        else {
            listItem.setAttribute("style","display : block");
        }

    })
    
}

function deleteTodo(e) {                                    // *6*
    if (e.target.className === "fa fa-remove") {            // eğer tıklanılan yerin className'i "fa fa-remove" ise dedik,
        e.target.parentElement.parentElement.remove();      // bu elementin parent'inin (<a>) parent'ini (<li>) sil dedik.
        deleteTodoFromLocalStorage(e.target.parentElement.parentElement.textContent);   // *7* arayüzden silinen todo'yu storage'dan da silmek için yeni bir fonksiyon ekledik
        showAlert("warning","Todo başarıyla silindi!");     // ve sonrasında warning alert göster dedik.
    }

}


function deleteTodoFromLocalStorage(deletetodo) {   // *7*
    let todos = getTodosFromStorage();              // storage'dan array olarak getirdik.

    todos.forEach (function(todo,index) {           // array'in elemanları üzerinde gezdirdik.
        if (todo === deletetodo) {                  // eğer elemanın değeri sildiğimiz ayarüz değerine eşit ise;
            todos.splice(index,1);                  // arrayden değeri sil dedik.
        }       // splice metodu ile, o değerin indeksinden itibaren 1 değer sil dedik.
    });

    localStorage.setItem("todos",JSON.stringify(todos));    // tekrardan storage'ı güncelledik.
}



function loadAllTodosToUI() {           // *5*
    let todos = getTodosFromStorage();  // storage'daki verileri array olarak getir dedik.

    todos.forEach(function(todo) {      // array elemanları üzerinde tek tek gez dedik.
        addTodoToUI(todo);              // ve her eleman için todos ekleme fonksiyonunu çalıştır dedik.
    });                                 // böylece storage'daki verileri, sayfa yenilendiğinde arayüze eklemiş olduk.

}



function addTodo(e) {              // *1* yukarıda submit ile çalışacak addTodo fonksiyonu
    const newTodo = todoInput.value.trim();  // trim() metodu, girilen değerin başındaki ve sonundaki gereksiz boşlukları siler

    // Burada if ile bir kontrol yaparak, eğer input boş ise boş todo eklemek yerine uyarı mesajı gösterilmesini sağlayabiliriz.
    if (newTodo === "") {
        /*<div class="alert alert-danger" role="alert">
                        <strong>Oh snap!</strong> Change a few things up and try submitting again.
                      </div>*/
        showAlert("danger","Lütfen bir todo girin!");   // *3* Buradan alacağı değerler ile alert fonksiyonunu çalıştıracak

    }
    else {
    addTodoToUI(newTodo);   // *2* Bu fonksiyon ile inputtan alınan değeri yeni bir list-item olarak ekleyeceğiz
    addTodoToStorage(newTodo);  // *4* Bu fonksiyonla eklenen todoları localstorage'a ekleyeceğiz
    
    showAlert("success","Todo başarıyla eklendi!"); // Aynı showAlert fonksiyonunu kullanarak başarı alerti de verdirmiş olduk.
}



    e.preventDefault();     // fonksiyonun default olarak sayfaya yönlenmesini engellemek için 
}


function getTodosFromStorage() {
    let todos;
    if (localStorage.getItem("todos") === null) {   // storage'da todos key'i var mı diye sorguladık
        todos = [];                                 // yoksa boş bir key oluştursun dedik.
    }
    else {                                          // varsa array'e çevirip getirsin dedik.
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}



function addTodoToStorage(newTodo){     // *4*
    let todos = getTodosFromStorage();  // sonra üstteki fonksiyonu çağırdık.

    todos.push(newTodo);                // yeni newtodos'u array'e eklesin dedik.

    localStorage.setItem("todos",JSON.stringify(todos));    // ve son hali ile array'i string'e çevirip storage'a gönderdik. yani storage'ı güncellemiş olduk.
}


function showAlert(type,message){           // *3* Alert fonksiyonunu tanımlayalım.
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;    // Alert fonksiyonumuz tanımlandı. 
                                    // Şimdi bu fonksiyonu form'un altına ekleyelim.
    // Form alanının altına ekleyeceğiz. yani önceden seçtiğimiz firstCardbody değişkenin altına child ekleyeceğiz.
    
    firstCardbody.appendChild(alert);

    // Şu anda alert'imiz görünüyor ancak hiç silinmiyor. Biz 1 sn sonra silinmesini de istiyoruz.
    // Bunun için window objesinin içerisindeki setTimeout metodunu kullanacağız.
    // Yani remove metodunun çalışmasını geciktireceğiz.

    setTimeout(function(){
        alert.remove();
    }, 1000);   // Burada verdiğimiz değer, milisaniye bazındadır. yani 1 saniye = 1000
}


function addTodoToUI(newTodo) {     // *2* Bu fonksiyon ile newTodo olarak gelen değeri arayüze ekleyeceğiz
                                    // Burada html içerisindeki <li> yapısını oluşturacağız

    const listItem = document.createElement("li"); // önce li tag'ini oluşturduk. sonrasını adım adım devam edeceğiz
    listItem.className = "list-group-item d-flex justify-content-between";
    listItem.appendChild(document.createTextNode(newTodo));

    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class = 'fa fa-remove'></i>";

    listItem.appendChild(link); // <a> tag'ini <li> tag'i altına ekledik.
    

    // bu oluşturduğumuz list item'ı todoList'e eklemeliyiz.
    // yani <li> tag'ini <ul> tag'i altına eklemeliyiz.
    // <ul> tag'ini seçmiştik zaten, yukarıda, todoList değişkeni ile.

    todoList.appendChild(listItem);
    todoInput.value = "";       // her girilen todo'dan sonra inputu boşaltır.



    
}
