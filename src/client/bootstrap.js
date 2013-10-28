var atma = typeof atma === 'undefined'
	? window
	: atma
	;
	
var mask = atma.mask,
	Compo = mask.Compo
	Dom = mask.Dom;

var custom_Attributes = mask.getAttrHandler(),
	custom_Tags = mask.getHandler(),
	custom_Utils = mask.getUtility();

var __models,
	__ID = 0;


// import ../util/function.js
// import ../util/array.js
// import ../mock/Meta.js
// import mock.js
// import traverse.js
// import setup.js

function bootstrap(container, compo) {
	
	if (container == null) 
		container = document.body;
		
	if (compo == null) 
		compo = {};
	
	
	var metaNode = trav_getMeta(container.firstChild),
		metaContent = metaNode && metaNode.textContent,
		meta = metaContent && Meta.parse(metaContent);
		
		
	if (meta == null || meta.type !== 'm') {
		console.error('Meta Inforamtion not defined', container);
		return;
	}
	
	__models = JSON.parse(meta.model);
	
	var model = __models[0],
		el = metaNode.nextSibling;
	
	
	setup(el, model, {}, el.parentNode, compo);

	mask.compoIndex(++__ID);

	if (typeof Compo !== 'undefined') 
		Compo.signal.emitIn(compo, 'domInsert');
	
}