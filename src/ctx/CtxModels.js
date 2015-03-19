var CtxModels;
(function(){	
	CtxModels = class_create({
		constructor: function (model, startIndex) {
			this._models = {};
			this._id = startIndex || 0;
			this.append(model);
		},
		append: function(model){
			return add(this, model);
		},
		tryAppend: function(ctr){
			
			if (mode_SERVER_ALL === ctr.mode)
				return -1;
			
			if (mode_model_NONE === ctr.modeModel)
				return -1;
			
			var model = ctr.modelRef != null
				? '$ref:' + ctr.modelRef
				: ctr.model
				;
			return add(this, model);
		},
		
		stringify: function(){
			return stringify(this._models);
		}
	});
	
	// private
	
	function add(modelBuilder, model) {
		if (model == null) 
			return -1;
		
		var id = 'm' + (++modelBuilder._id);
		modelBuilder._models[id] = model;
		return id;
	}
	var stringify;
	(function(){
		stringify = function (models) {
			stringify = typeof Class !== 'undefined' && is_Function(Class.stringify)
				? Class.stringify
				: JSON.stringify
				;
			return stringify(models);
		};
	}())
}());