var builder_build,
	builder_componentID,
	build;
	
(function() {
	
	// import ./model.js
	// import ./handler/document.js
	// import /ref-mask/src/build/type.node.js
	// import /ref-mask/src/build/type.textNode.js
	
	builder_build = function(template, model, ctx, container, ctr, children){
		if (container == null) 
			container = new HtmlDom.DocumentFragment();
		
		if (ctr == null) 
			ctr = new Dom.Component();
		
		if (ctx == null) 
			ctx = { _model: null, _ctx: null };
		
		if (ctx._model == null) 
			ctx._model = new ModelBuilder(model, Cache.modelID);
		
		if (ctx._id == null) 
			ctx._id = Cache.controllerID;
			
		return build(template, model, ctx, container, ctr, children);
	};
	

	build = function(node, model, ctx, container, ctr, children) {

		if (node == null) 
			return container;
		
		if (ctx._redirect != null || ctx._rewrite != null) 
			return container;

		var type = node_getType(node),
			element,
			elements,
			j, jmax, key, value;

		// Dom.SET
		if (type === 10) {
			var imax = node.length,
				i;
			for(i = 0; i < imax; i++) {
				build(node[i], model, ctx, container, ctr);
			}
			return container;
		}
		
		var tagName = node.tagName;
		if (tagName === 'else')
			return container;
		
		// Dom.STATEMENT
		if (type === 15) {
			var Handler = custom_Statements[tagName];
			if (Handler == null) {
				
				if (custom_Tags[tagName] != null) {
					// Dom.COMPONENT
					type = 4;
				} else {
					log_error('<mask: statement is undefined', tagName);
					return container;
				}
				
			}
			if (type === 15) {
				Handler.render(node, model, ctx, container, ctr, children);
				return container;
			}
		}
		
		// Dom.NODE
		if (type === 1) {
			if (tagName.charCodeAt(0) === 58) {
				// :
				type = 4;
				node.mode = mode_CLIENT;
				node.controller = mock_TagHandler.create(tagName, null, mode_CLIENT);
			} else {
				container = build_node(node, model, ctx, container, ctr, children);
				children = null;
			}
		}

		// Dom.TEXTNODE
		if (type === 2) {
			build_textNode(node, model, ctx, container, ctr);
			return container;
		}

		// Dom.COMPONENT
		if (type === 4) {
			element = document.createComponent(node, model, ctx, container, ctr);
			container.appendChild(element);
			container = element;
			
			var compo = element.compo;
			if (compo != null) {
				var modelID = -1;
				if (compo.model && ctr.model !== compo.model) {
					model = compo.model;
					modelID = ctx._model.tryAppend(compo);
				}
				if (compo.modelRef != null) 
					modelID = ctx._model.tryAppend(compo);
				
				if (modelID !== -1)
					element.modelID = modelID;
				
				if (compo.async) 
					return element;
				
				if (compo.render) 
					return element;
				
				ctr = compo;
				node = compo;
				// collect childElements for the component
				elements = [];
			}
		}

		build_childNodes(node, model, ctx, container, ctr, elements);
		
		if (container.nodeType === Dom.COMPONENT) {
			var fn = ctr.onRenderEndServer;
			if (fn != null && ctr.async !== true) {
				fn.call(ctr, elements, model, ctx, container, ctr);
			}
			
		}
		
		arr_pushMany(children, elements);
		return container;
	};
}());
