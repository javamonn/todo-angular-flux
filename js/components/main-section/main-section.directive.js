(() => {
  'use strict';

  let MainSectionController = function(TodoActions) {
    this.TodoActions = TodoActions;

    this.toggleCompleteAll = () => {
      TodoActions.toggelCompleteAll();
    }
  }

  let MainSection = () => ({
    restrict: 'E',
    templateUrl: './js/components/main-section/main-section.html',
    scope: {
      allTodos: '=',
      areAllComplete:'='
    },
    controllerAs: 'mainSection',
    controller: ['TodoActions', MainSectionController],
    bindToController: true
  });

  angular
    .module('app')
    .directive('mainSection', [MainSection]);

})();