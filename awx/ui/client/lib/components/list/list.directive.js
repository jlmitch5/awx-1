const templateUrl = require('~components/list/list.partial.html');

// function link (scope, el, attrs) {
// }

function atList () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        templateUrl,
        // link
    };
}

export default atList;
