import ListController from './list-templates.controller';
const listTemplate = require('~features/templates/list.view.html');

function TemplatesResolve ($q, UnifiedJobTemplate) {
    console.log("entered templates resolve block");
    const promises = {};

    promises.unifiedJobTemplate = new UnifiedJobTemplate(['get', 'options']);

    return $q.all(promises);
}

TemplatesResolve.$inject = [
    '$q',
    'UnifiedJobTemplateModel'
];

export default {
    name: 'templates',
    route: '/templates',
    ncyBreadcrumb: {
        label: 'TEMPLATES'
    },
    data: {
        activityStream: true,
        activityStreamTarget: 'template',
        socket: {
            "groups": {
                "jobs": ["status_changed"]
            }
        }
    },
    params: {
        template_search: {
            value: {
                type: 'workflow_job_template,job_template'
            },
            dynamic: true
        }
    },
    searchPrefix: 'template',
    views: {
        '@': {
            controller: ListController,
            templateUrl: listTemplate,
            controllerAs: 'vm'
        }
    },
    resolve: {
        resolvedModels: TemplatesResolve,
        Dataset: ['TemplateList', 'QuerySet', '$stateParams', 'GetBasePath',
            function(list, qs, $stateParams, GetBasePath) {
                let path = GetBasePath(list.basePath) || GetBasePath(list.name);
                return qs.search(path, $stateParams[`${list.iterator}_search`]);
            }
        ]
    }
};
