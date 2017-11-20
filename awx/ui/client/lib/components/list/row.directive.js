const templateUrl = require('~components/list/row.partial.html');

// function link (scope, el, attrs) {
// }

function atRow () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        templateUrl,
        // link
    };
}

export default atRow;
