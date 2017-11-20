const templateUrl = require('~components/list/row-action.partial.html');

// function link (scope, el, attrs) {
// }

function atRowAction () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        templateUrl,
        scope: {
            icon: '@'
        }
        // link
    };
}

export default atRowAction;
