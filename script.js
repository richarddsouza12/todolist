
document.addEventListener('DOMContentLoaded', function() {
   
   var todoListPage = new ToDoListPage();
   todoListPage.init();
   
});


//TodoList 
var ToDoListPage = function() {

    this.todolistItemsArray = [];

    this.todoText          = document.querySelector('.textarea');
    this.addTodoBtn        = document.querySelector('.buttoninput');
    this.todoListContainer = document.querySelector('.todolist');
    this.storeLocalButton  = document.querySelector('.storelocalbutton');
    this.loadLocalButton   = document.querySelector('.loadlocalbutton');
    this.markCheckedTodoButton  = document.querySelector('.check-button');
    this.deleteTodoButton       = document.querySelector('.trash-button');

    this.init = function() {

      this.attachListeners();

    }

    this.attachListeners = function() {

        var instance = this;
        this.addTodoBtn.addEventListener( 'click', function( e ) { instance.addTodo(); } );
        this.storeLocalButton.addEventListener( 'click', function( e ) {  instance.storeToLocal(); });
        this.loadLocalButton.addEventListener( 'click', function( e ) {  instance.loadFromLocalPopulateToDoList(); });

    }

    this.buildToDoListFromTodoListItemsArray = function( todolistItemsArray ) {

      var instance = this;
      todolistItemsArray.forEach(function( todoObj ) {

          var html = "";
          var todoElementDivWrapper = document.createElement('div');
          html += `
                    <div class="row todoItem" data-tsid="${todoObj.created}" >
                        <div class="col-9">
                            <div class="alert ${todoObj.completed ? 'alert-success' : 'alert-primary'} item ${todoObj.completed ? 'checklist' : ''} ">
                                ${todoObj.name}
                            </div>
                        </div>
                        <div class="col-3">
                            <button class="check-button"><i class="fa-solid fa-check"></i></button>
                            <button class="trash-button"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
          `;
          todoElementDivWrapper.innerHTML = html;
          instance.addClickEventListenerForCheckTodoButton( todoElementDivWrapper );
          instance.addClickEventListenerForDeleteTodoButton( todoElementDivWrapper );
          instance.todoListContainer.appendChild( todoElementDivWrapper );
      });

    }

    this.loadFromLocalPopulateToDoList = function() {

        this.todolistItemsArray = this.loadFromLocal();
        this.buildToDoListFromTodoListItemsArray( this.todolistItemsArray );

    }

    this.storeToLocal = function() {

        var jsonString = JSON.stringify(this.todolistItemsArray);
        localStorage.setItem("localToDoListArray", jsonString);
        alert("successfully stored to local storage");
    }

    this.loadFromLocal = function() {

        var jsonString = localStorage.getItem("localToDoListArray");
        return JSON.parse(jsonString);

    }

    this.createItemObject = function( name ) {

        var itemObj = {
         name : name,
         created : new Date().getTime(),
         completed : false
        };

        return itemObj;
    }

    this.addItemObjectToArray = function( itemObj ) {
        this.todolistItemsArray.push( itemObj );
    }

    this.deleteTodoItemObject = function( timestamp ) {

      var indexToDelete = this.todolistItemsArray.findIndex( obj => obj.created == timestamp );
      if (indexToDelete !== -1) {
          this.todolistItemsArray.splice( indexToDelete, 1);
      }

    }

    this.toggleTodoItemCompleted = function( timestamp , boolCompleted ) {

        var foundObject = this.todolistItemsArray.find( function( obj ) {
            return obj.created == timestamp;
        });

        foundObject.completed = boolCompleted;

    }


    this.addClickEventListenerForDeleteTodoButton = function(todoElementDivWrapper) {

        var instance = this;
        todoElementDivWrapper.querySelector("button.trash-button").addEventListener( 'click', function( e ) {
                    var deleteBtn = e.target;
                    var todolistItem = deleteBtn.closest('div.todoItem');
                    instance.deleteTodoItemObject( todolistItem.getAttribute("data-tsid") );
                    todolistItem.remove();
        });
    }


    this.addClickEventListenerForCheckTodoButton = function( todoElementDivWrapper ) {

      var instance = this;
      todoElementDivWrapper.querySelector("button.check-button").addEventListener( 'click', function( e ) {

         var checkButton = e.target;
         var todoItem =  checkButton.closest('div.todoItem');
         var todolistItemName = todoItem.querySelector('div.item');
         if( todolistItemName.classList.contains("checklist") ) {
           instance.toggleTodoItemCompleted( todoItem.getAttribute("data-tsid") , false );
           todolistItemName.classList.remove("checklist");
            todolistItemName.classList.add('alert-primary');
            todolistItemName.classList.remove('alert-success');

         } else {
          instance.toggleTodoItemCompleted( todoItem.getAttribute("data-tsid") , true );
          todolistItemName.classList.add("checklist");
          todolistItemName.classList.add('alert-success');
          todolistItemName.classList.remove('alert-primary');
         }
       });

    }

    this.addTodo = function( e ) {

            if ( this.todoText.value === '') { return }

            var todoName = this.todoText.value;
             var itemObj = this.createItemObject( todoName );
             this.addItemObjectToArray( itemObj );

            var todoElementDivWrapper = document.createElement('div');
            var html = `
                <div class="row todoItem" data-tsid="${itemObj.created}" >
                        <div class="col-9">
                            <div class="alert alert-primary item">
                                ${todoName}
                            </div>
                        </div>
                        <div class="col-3">
                            <button class="check-button"><i class="fa-solid fa-check"></i></button>
                            <button class="trash-button"><i class="fa-solid fa-trash"></i></button>
                        </div>
                 </div>
            `;
             todoElementDivWrapper.innerHTML = html;

             //add listener for checked and delete button
             this.addClickEventListenerForCheckTodoButton( todoElementDivWrapper );
             this.addClickEventListenerForDeleteTodoButton( todoElementDivWrapper );

             this.todoListContainer.appendChild( todoElementDivWrapper );
             this.todoText.value = '';
     }

}


