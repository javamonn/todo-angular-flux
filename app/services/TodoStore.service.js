(function() {
  'use strict';

  const TodoRecord = Immutable.Record({
    id: cuid(),
    complete: false,
    text: "Experiment with Angular and Reflux"
  });

  let TodoStore = function(TodoActions, PersistStore) {
    return Reflux.createStore({
      listenables: [TodoActions],
      onCreate: function(text) {
        this.updateTodos(this._todos.push(new TodoRecord({
          text: text,
          id: cuid(),
        })));
      },
      onUpdateText:function(id, text) {
        let [index, todo] = this._todos.findEntry(todo => todo.id == id);
        this.updateTodos(this._todos.set(index, todo.set("text", text)))
      },
      onToggleComplete: function(id) {
        let [index, todo] = this._todos.findEntry(todo => todo.id == id);
        this.updateTodos(this._todos.set(index, todo.set("complete", !todo.complete)));
      }, 
      onToggleCompleteAll: function(checked) {
        this.updateTodos(this._todos.map(todo => todo.set("complete", checked)));
      },
      onDestroy: function(id) {
        let [index, todo] = this._todos.findEntry(todo => todo.id == id);
        this.updateTodos(this._todos.delete(index));
      },
      onDestroyCompleted: function() {
        this.updateTodos(this._todos.filter(todo => !todo.complete));
      },
      updateTodos: function(todos) {
        this._todos = todos;
        this.trigger(this._todos);
        PersistStore.update(todos);
      },
      initialize: function() {
        return PersistStore.initialize()
          .then(todos => {
             this._todos = todos;
             return todos;
          });
      }
    });
  };

  angular
    .module('app')
    .service('TodoStore', ['TodoActions', 'PersistStore', TodoStore]);
})();
