const templateUrl = require('~components/list/row-item.partial.html');

// function link (scope, el, attrs) {
// }

function atRowItem () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        templateUrl,
        scope: {
            headerValue: '@',
            headerLink: '@',
            headerTag: '@',
            labelValue: '@',
            value: '@',
            valueLink: '@',
            smartStatus: '=?'
        }
        // link
    };
}

export default atRowItem;
