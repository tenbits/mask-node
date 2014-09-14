var builder_build,
	builder_componentID;
(function() {
	
	builder_build = function(template, model, ctx, container, controller, childs){
		if (container == null) 
			container = new HtmlDom.DocumentFragment();
		
		if (controller == null) 
			controller = new Dom.Component();
		
		if (ctx == null) 
			ctx = { _model: null, _ctx: null };
		
		if (ctx._model == null) 
			ctx._model = new ModelBuilder(model, Cache.modelID);
		
		if (ctx._id == null) 
			ctx._id = Cache.controllerID;
			
		return builder_html(template, model, ctx, container, controller, childs);
	};
	
	// ==== private

	// import model.js
	// import handler/document.js
	
	// import /ref-mask/src/build/type.node.js
	// import /ref-mask/src/build/type.textNode.js
	

	function builder_html(node, model, ctx, container, ctr, childs) {

		if (node == null) 
			return container;
		
		if (ctx._redirect != null || ctx._rewrite != null) 
			return container;

		var type = node.type,
			element,
			elements,
			j, jmax, key, value;

		if (type == null){
			// in case if node was added manually, but type was not set
			
			if (is_Array(node)) {
				type = 10
			}
			else if (node.tagName != null){
				type = 1;
			}
			else if (node.content != null){
				type = 2;
			}
		}
		
		if (type === 1 && custom_Tags[node.tagName] != null) {
			// check if the tag name was overriden
			type = 4;
		}
		
		// Dom.SET
		if (type === 10) {
			for (j = 0, jmax = node.length; j < jmax; j++) {
				builder_html(node[j], model, ctx, container, ctr);
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
				
				Handler.render(node, model, ctx, container, ctr, childs);
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
			
				container = build_node(node, model, ctx, container, ctr, childs);
				childs = null;
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
				if (compo.modelRef !== void 0) 
					modelID = ctx._model.tryAppend(compo);
				
				if (modelID !== -1)
					element.modelID = modelID;
				
				if (compo.async) 
					return element;
				
				if (compo.render) 
					return element;
				
				ctr = compo;
				node = compo;
				elements = [];
			}
		}

		var nodes = node.nodes;
		if (nodes != null) {

			var isarray = is_Array(nodes),
				length = isarray === true ? nodes.length : 1,
				i = 0, childNode;


			for (; i < length; i++) {

				childNode = isarray === true
					? nodes[i]
					: nodes;

				if (type === 4 /* Dom.COMPONENT */ && childNode.type === 1 /* Dom.NODE */){
					
					if (compo_isServerMode(ctr)) 
						childNode.attr['x-compo-id'] = element.ID;
				}

				builder_html(childNode, model, ctx, container, ctr, elements);
			}

		}
		
		if (container.nodeType === Dom.COMPONENT) {
			var fn = ctr.onRenderEndServer;
			if (fn != null && ctr.async !== true) {
				fn.call(ctr, elements, model, ctx, container, ctr);
			}
			
		}
		
		if (childs != null && elements != null && childs !== elements) {
			var imax = elements.length,
				i = -1;
			while( ++i < imax ) {
				childs.push(elements[i]);
			}
		}


		return container;
	};
}());
