let BaseModel;

function UnifiedJobTemplateModel (method, resource, graft) {
    BaseModel.call(this, 'unified_job_templates');

    this.Constructor = UnifiedJobTemplateModel;

    return this.create(method, resource, graft);
}

function UnifiedJobTemplateModelLoader (_BaseModel_) {
    BaseModel = _BaseModel_;

    return UnifiedJobTemplateModel;
}

UnifiedJobTemplateModelLoader.$inject = ['BaseModel'];

export default UnifiedJobTemplateModelLoader;
