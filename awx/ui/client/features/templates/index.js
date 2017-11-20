import TemplatesStrings from './templates.strings';
import ListController from './list-templates.controller';

const MODULE_NAME = 'at.features.templates';

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

function TemplatesRun ($stateExtender, strings) {
    console.log("adding the templates state");
    $stateExtender.addState({
        name: 'foobar',
        route: '/foobar',
        ncyBreadcrumb: {
            label: strings.get('state.LIST_BREADCRUMB_LABEL')
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
            resolvedModels: TemplatesResolve
        }
    });
}

TemplatesRun.$inject = [
    '$stateExtender',
    'TemplatesStrings'
];

angular
    .module(MODULE_NAME, [])
    .controller('ListController', ListController)
    .service('TemplatesStrings', TemplatesStrings)
    .run(TemplatesRun);

export default MODULE_NAME;
