function ListTemplatesController (models, strings, $state, $scope, rbacUiControlService, Dataset, $filter) {
    const vm = this || {};

    const { unifiedJobTemplate } = models;

    var list = {
        iterator: 'template',
        name: 'templates'
    };

    init();

    function init() {
        $scope.canAdd = false;
        rbacUiControlService.canAdd("job_templates")
            .then(function(params) {
                $scope.canAddJobTemplate = params.canAdd;
            });
        rbacUiControlService.canAdd("workflow_job_templates")
            .then(function(params) {
                $scope.canAddWorkflowJobTemplate = params.canAdd;
            });

        $scope.list = list;
        $scope[`${list.iterator}_dataset`] = Dataset.data;
        $scope[list.name] = $scope[`${list.iterator}_dataset`].results;
        $scope.collection = {
            basePath: 'unified_job_templates',
            iterator: 'template'
        };
        // TODO: get loading after tag is added
    }

    vm.getModified = function(template) {
        let val = "";
        if (template.modified) {
            val += $filter('longDate')(template.modified);
        }
        if (template && template.summary_fields && template.summary_fields.modified_by &&
            template.summary_fields.modified_by.username) {
                val += ` by ${template.summary_fields.modified_by.username}`;
        }
        if (val === "") {
            val = undefined;
        }
        return val;
    };

    // get pretified template type names from options
    vm.templateTypes = unifiedJobTemplate.model.OPTIONS.actions.GET.type.choices
        .reduce((acc, i) => {
            acc[i[0]] = i[1];
            return acc;
        }, {});

    // get if you should show the active indicator for the row or not
    vm.activeId = parseInt($state.params.job_template_id || $state.params.workflow_template_id);
}

ListTemplatesController.$inject = [
    'resolvedModels',
    'TemplatesStrings',
    '$state',
    '$scope',
    'rbacUiControlService',
    'Dataset',
    '$filter'
];

export default ListTemplatesController;
