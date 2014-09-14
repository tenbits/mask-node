var compo_renderMode_SERVER = 'server',
	compo_renderMode_SERVER_ALL = 'server:all',
	compo_renderMode_SERVER_CHILDREN = 'server:children',
	compo_renderMode_CLIENT = 'client',
	compo_renderMode_BOTH = 'both',
	compo_getMetaInfo,	
	compo_getRenderMode,
	compo_isServerMode,
	compo_setMode
	;
	
(function(){
	
	compo_isServerMode = function(compo){
		return compo_getRenderMode(compo) === compo_renderMode_SERVER;
	};
	compo_setMode = function(ctr, mode){
		if (ctr.meta == null) 
			ctr.meta = new CompoMeta;
		ctr.meta.mode = mode;
	};
	compo_getMetaInfo = function(compo){
		if (compo == null) 
			return new CompoMeta;
		
		var proto = typeof compo === 'function'
				? compo.prototype
				: compo
				;
		return new CompoMeta(proto);
	};
	compo_getRenderMode = function(compo){
		if (compo == null) 
			return compo_renderMode_BOTH;
		
		var proto = typeof compo === 'function'
			? compo.prototype
			: compo
			;
		var mode = proto.meta && proto.meta.mode;
		if (mode == null || mode === 'both') 
			return compo_renderMode_BOTH;
		
		if (typeof mode === 'number') 
			return mode;
		
		if (mode === 'server' || mode === 'server:all') 
			return compo_renderMode_SERVER;
		
		if (mode === 'client') 
			return compo_renderMode_CLIENT;
		
		return compo_renderMode_BOTH;
	};
	
	// Private
	
	function CompoMeta(ctr){
		if (ctr == null) 
			return;
		
		var meta = ctr.meta || ctr.$meta;
		if (meta != null) 
			return meta;
		
		if (ctr.mode /* obsolete */) 
			this.mode = ctr.mode;
	}
	CompoMeta.prototype = {
		mode: compo_renderMode_BOTH,
		modeModel: null,
		attributes: null,
		cache: false
	};
}());