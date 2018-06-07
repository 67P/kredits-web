"use strict"
define("kredits-web/app",["exports","kredits-web/resolver","ember-load-initializers","kredits-web/config/environment"],function(e,t,n,r){Object.defineProperty(e,"__esModule",{value:!0})
var o=Ember.Application.extend({modulePrefix:r.default.modulePrefix,podModulePrefix:r.default.podModulePrefix,Resolver:t.default});(0,n.default)(o,r.default.modulePrefix),e.default=o}),define("kredits-web/components/add-contributor/component",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Component.extend({kredits:Ember.inject.service(),attributes:{account:null,name:null,kind:"person",url:null,github_username:null,github_uid:null,wiki_username:null,isCore:!1},didInsertElement:function(){this._super.apply(this,arguments),this.reset()},isValidAccount:Ember.computed.notEmpty("account"),isValidName:Ember.computed.notEmpty("name"),isValidURL:Ember.computed.notEmpty("url"),isValidGithubUID:Ember.computed.notEmpty("github_uid"),isValidGithubUsername:Ember.computed.notEmpty("github_username"),isValidWikiUsername:Ember.computed.notEmpty("wiki_username"),isValid:Ember.computed.and("isValidAccount","isValidName","isValidGithubUID"),reset:function(){this.setProperties(this.attributes)},actions:{submit:function(){var e=this
if(this.isValid){var t=Object.keys(this.attributes),n=this.getProperties(t),r=this.save(n)
this.set("inProgress",r),r.then(function(){e.reset(),window.scroll(0,0),window.alert("Contributor added.")})}else alert("Invalid data. Please review and try again.")}}})}),define("kredits-web/components/add-contributor/template",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"CSegBQfj",block:'{"symbols":[],"statements":[[6,"form"],[3,"action",[[21,0,[]],"submit"],[["on"],["submit"]]],[8],[0,"\\n  "],[6,"p"],[8],[0,"\\n    "],[1,[26,"input",null,[["name","type","id","checked"],["is-core","checkbox","is-core",[22,["isCore"]]]]],false],[0,"\\n    "],[6,"label"],[10,"for","is-core"],[10,"class","checkbox"],[8],[0,"\\n      Core team member (can add contributors)\\n    "],[9],[0,"\\n  "],[9],[0,"\\n  "],[6,"p"],[8],[0,"\\n    "],[1,[26,"input",null,[["name","type","placeholder","value","class"],["account","text","0xF18E631Ea191aE4ebE70046Fcb01a436554421BA4",[22,["account"]],[26,"if",[[22,["isValidAccount"]],"valid",""],null]]]],false],[0,"\\n  "],[9],[0,"\\n  "],[6,"p"],[8],[0,"\\n    "],[6,"select"],[10,"required",""],[11,"onchange",[26,"action",[[21,0,[]],[26,"mut",[[22,["kind"]]],null]],[["value"],["target.value"]]],null],[8],[0,"\\n      "],[6,"option"],[10,"value","person"],[11,"selected",[26,"eq",[[22,["kind"]],"person"],null],null],[8],[0,"Person"],[9],[0,"\\n      "],[6,"option"],[10,"value","organization"],[11,"selected",[26,"eq",[[22,["kind"]],"organization"],null],null],[8],[0,"Organization"],[9],[0,"\\n    "],[9],[0,"\\n  "],[9],[0,"\\n  "],[6,"p"],[8],[0,"\\n    "],[1,[26,"input",null,[["name","type","placeholder","value","class"],["name","text","Name",[22,["name"]],[26,"if",[[22,["isValidName"]],"valid",""],null]]]],false],[0,"\\n  "],[9],[0,"\\n  "],[6,"p"],[8],[0,"\\n    "],[1,[26,"input",null,[["name","type","placeholder","value","class"],["url","text","URL",[22,["url"]],[26,"if",[[22,["isValidURL"]],"valid",""],null]]]],false],[0,"\\n  "],[9],[0,"\\n  "],[6,"p"],[8],[0,"\\n    "],[1,[26,"input",null,[["name","type","placeholder","value","class"],["github_uid","text","GitHub UID (123)",[22,["github_uid"]],[26,"if",[[22,["isValidGithubUID"]],"valid",""],null]]]],false],[0,"\\n  "],[9],[0,"\\n  "],[6,"p"],[8],[0,"\\n    "],[1,[26,"input",null,[["name","type","placeholder","value","class"],["github_username","text","GitHub username",[22,["github_username"]],[26,"if",[[22,["isValidGithubUsername"]],"valid",""],null]]]],false],[0,"\\n  "],[9],[0,"\\n  "],[6,"p"],[8],[0,"\\n    "],[1,[26,"input",null,[["name","type","placeholder","value","class"],["wiki_username","text","Wiki Username",[22,["wiki_username"]],[26,"if",[[22,["isValidWikiUsername"]],"valid",""],null]]]],false],[0,"\\n  "],[9],[0,"\\n  "],[6,"p"],[10,"class","actions"],[8],[0,"\\n    "],[1,[26,"input",null,[["type","disabled","value"],["submit",[26,"is-pending",[[22,["inProgress"]]],null],[26,"if",[[26,"is-pending",[[22,["inProgress"]]],null],"Processing","Save"],null]]]],false],[0,"\\n  "],[9],[0,"\\n"],[9],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"kredits-web/components/add-contributor/template.hbs"}})}),define("kredits-web/components/add-proposal/component",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Component.extend({attributes:{contributorId:null,kind:"community",amount:null,description:null,url:null},didInsertElement:function(){this._super.apply(this,arguments),this.reset()},contributors:[],isValidContributor:Ember.computed.notEmpty("contributorId"),isValidAmount:Ember.computed("amount",function(){return parseInt(this.amount,10)>0}),isValidDescription:Ember.computed.notEmpty("description"),isValidUrl:Ember.computed.notEmpty("url"),isValid:Ember.computed.and("isValidContributor","isValidAmount","isValidDescription"),reset:function(){this.setProperties(this.attributes)},actions:{submit:function(){var e=this
if(this.isValid){var t=Object.keys(this.attributes),n=this.getProperties(t),r=this.save(n)
this.set("inProgress",r),r.then(function(){e.reset(),window.scroll(0,0),window.alert("Proposal added.")})}else alert("Invalid data. Please review and try again.")}}})}),define("kredits-web/components/add-proposal/template",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"cM+dvRZ+",block:'{"symbols":["contributor"],"statements":[[6,"form"],[3,"action",[[21,0,[]],"submit"],[["on"],["submit"]]],[8],[0,"\\n  "],[6,"p"],[8],[0,"\\n    "],[6,"select"],[10,"required",""],[11,"onchange",[26,"action",[[21,0,[]],[26,"mut",[[22,["contributorId"]]],null]],[["value"],["target.value"]]],null],[8],[0,"\\n      "],[6,"option"],[10,"value",""],[10,"selected",""],[10,"disabled",""],[10,"hidden",""],[8],[0,"Contributor"],[9],[0,"\\n"],[4,"each",[[22,["contributors"]]],null,{"statements":[[0,"        "],[6,"option"],[11,"value",[21,1,["id"]],null],[11,"selected",[26,"eq",[[22,["contributorId"]],[21,1,["id"]]],null],null],[8],[1,[21,1,["github_username"]],false],[9],[0,"\\n"]],"parameters":[1]},null],[0,"    "],[9],[0,"\\n  "],[9],[0,"\\n  "],[6,"p"],[8],[0,"\\n    "],[6,"select"],[10,"required",""],[11,"onchange",[26,"action",[[21,0,[]],[26,"mut",[[22,["kind"]]],null]],[["value"],["target.value"]]],null],[8],[0,"\\n      "],[6,"option"],[10,"value","community"],[11,"selected",[26,"eq",[[22,["kind"]],"community"],null],null],[8],[0,"Community"],[9],[0,"\\n      "],[6,"option"],[10,"value","design"],[11,"selected",[26,"eq",[[22,["kind"]],"design"],null],null],[8],[0,"Design"],[9],[0,"\\n      "],[6,"option"],[10,"value","dev"],[11,"selected",[26,"eq",[[22,["kind"]],"dev"],null],null],[8],[0,"Development"],[9],[0,"\\n      "],[6,"option"],[10,"value","docs"],[11,"selected",[26,"eq",[[22,["kind"]],"docs"],null],null],[8],[0,"Documentation"],[9],[0,"\\n      "],[6,"option"],[10,"value","ops"],[11,"selected",[26,"eq",[[22,["kind"]],"ops"],null],null],[8],[0,"IT Operations"],[9],[0,"\\n    "],[9],[0,"\\n  "],[9],[0,"\\n  "],[6,"p"],[8],[0,"\\n    "],[1,[26,"input",null,[["type","placeholder","value","class"],["text","100",[22,["amount"]],[26,"if",[[22,["isValidAmount"]],"valid",""],null]]]],false],[0,"\\n  "],[9],[0,"\\n  "],[6,"p"],[8],[0,"\\n    "],[1,[26,"input",null,[["type","placeholder","value","class"],["text","Description",[22,["description"]],[26,"if",[[22,["isValidDescription"]],"valid",""],null]]]],false],[0,"\\n  "],[9],[0,"\\n  "],[6,"p"],[8],[0,"\\n    "],[1,[26,"input",null,[["type","placeholder","value","class"],["text","URL (optional)",[22,["url"]],[26,"if",[[22,["isValidUrl"]],"valid",""],null]]]],false],[0,"\\n  "],[9],[0,"\\n  "],[6,"p"],[10,"class","actions"],[8],[0,"\\n    "],[1,[26,"input",null,[["type","disabled","value"],["submit",[26,"is-pending",[[22,["inProgress"]]],null],[26,"if",[[26,"is-pending",[[22,["inProgress"]]],null],"Processing","Save"],null]]]],false],[0,"\\n    "],[4,"link-to",["index"],null,{"statements":[[0,"Back"]],"parameters":[]},null],[0,"\\n  "],[9],[0,"\\n"],[9],[0,"\\n\\n"]],"hasEval":false}',meta:{moduleName:"kredits-web/components/add-proposal/template.hbs"}})}),define("kredits-web/components/contributor-list/component",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Component.extend({tagName:"table",classNames:"contributor-list",selectedContributor:null,actions:{toggleContributorInfo:function(e){e.get("showMetadata")?e.set("showMetadata",!1):(this.contributors.setEach("showMetadata",!1),e.set("showMetadata",!0))}}})}),define("kredits-web/components/contributor-list/template",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"1c6etkaE",block:'{"symbols":["contributor"],"statements":[[6,"tbody"],[8],[0,"\\n"],[4,"each",[[22,["contributors"]]],null,{"statements":[[0,"    "],[6,"tr"],[11,"class",[27,[[26,"if",[[21,1,["isCurrentUser"]],"current-user"],null]]]],[3,"action",[[21,0,[]],"toggleContributorInfo",[21,1,[]]]],[8],[0,"\\n      "],[6,"td"],[10,"class","person"],[8],[0,"\\n        "],[6,"img"],[10,"class","avatar"],[11,"src",[21,1,["avatarURL"]],null],[8],[9],[0,"\\n        "],[1,[21,1,["name"]],false],[0,"\\n      "],[9],[0,"\\n      "],[6,"td"],[10,"class","kredits"],[8],[0,"\\n        "],[6,"span"],[10,"class","amount"],[8],[1,[21,1,["balance"]],false],[9],[0,"\\n        "],[6,"span"],[10,"class","symbol"],[8],[0,"₭S"],[9],[0,"\\n      "],[9],[0,"\\n    "],[9],[0,"\\n    "],[6,"tr"],[11,"class",[27,["metadata ",[26,"if",[[21,1,["isCurrentUser"]],"current-user"],null]," ",[26,"if",[[21,1,["showMetadata"]],"visible"],null]]]],[8],[0,"\\n      "],[6,"td"],[10,"colspan","2"],[8],[0,"\\n        "],[6,"ul"],[8],[0,"\\n          "],[6,"li"],[8],[6,"a"],[11,"href",[27,["https://testnet.etherscan.io/address/",[21,1,["account"]]]]],[8],[0,"Inspect Ethereum transactions"],[9],[9],[0,"\\n"],[4,"if",[[21,1,["ipfsHash"]]],null,{"statements":[[0,"            "],[6,"li"],[8],[6,"a"],[11,"href",[27,["https://ipfs.io/ipfs/",[21,1,["ipfsHash"]]]]],[8],[0,"Inspect IPFS profile"],[9],[9],[0,"\\n"]],"parameters":[]},null],[0,"        "],[9],[0,"\\n"],[4,"if",[[21,1,["showMetadata"]]],null,{"statements":[[0,"          "],[6,"pre"],[8],[1,[21,1,["ipfsData"]],false],[9],[0,"\\n"]],"parameters":[]},null],[0,"      "],[9],[0,"\\n    "],[9],[0,"\\n"]],"parameters":[1]},null],[9],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"kredits-web/components/contributor-list/template.hbs"}})}),define("kredits-web/components/loading-spinner/component",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Component.extend({classNames:["loading-spinner"]})}),define("kredits-web/components/loading-spinner/template",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"ISgzaxg0",block:'{"symbols":[],"statements":[[6,"p"],[8],[0,"\\n  "],[6,"svg"],[10,"xmlns","http://www.w3.org/2000/svg","http://www.w3.org/2000/xmlns/"],[10,"xmlns:xlink","http://www.w3.org/1999/xlink","http://www.w3.org/2000/xmlns/"],[10,"version","1.1"],[10,"x","0px"],[10,"y","0px"],[10,"viewBox","0 0 132 100"],[10,"enable-background","new 0 0 100 100"],[10,"xml:space","preserve","http://www.w3.org/XML/1998/namespace"],[8],[0,"\\n    "],[6,"path"],[10,"id","path-comet"],[10,"d","M79.062,24.173L79.062,24.173l-0.021-0.011c-0.068-0.03-0.137-0.062-0.204-0.093L42.392,7.337\\n             c0,0,3.065,14.104,4.458,18.019l0,0c0,0-41.754-12.481-46.85-13.67c1.67,6.52,30.607,62.492,30.607,62.492\\n             c5.848,11.873,19.394,18.485,33.522,18.485c19.811,0,35.87-16.059,35.87-35.869C100,42.313,91.418,29.837,79.062,24.173z"],[8],[0,"\\n    "],[9],[0,"\\n  "],[9],[0,"\\n"],[9],[0,"\\n"],[6,"p"],[8],[0,"\\n  Loading data from Ethereum...\\n"],[9],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"kredits-web/components/loading-spinner/template.hbs"}})}),define("kredits-web/components/proposal-list/component",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Component.extend({tagName:"ul",classNames:["proposal-list"],actions:{confirm:function(e){this.contractInteractionEnabled?this.confirmProposal(e):window.alert("Only members can vote on proposals. Please ask someone to set you up.")}}})}),define("kredits-web/components/proposal-list/template",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"2TLNTpxX",block:'{"symbols":["proposal"],"statements":[[4,"each",[[22,["proposals"]]],null,{"statements":[[0,"  "],[6,"li"],[11,"data-proposal-id",[21,1,["id"]],null],[11,"title",[27,["(",[21,1,["kind"]],") ",[21,1,["description"]]]]],[8],[0,"\\n    "],[6,"span"],[11,"class",[27,["category ",[21,1,["kind"]]]]],[8],[0,"♥"],[9],[0,"\\n    "],[6,"span"],[10,"class","amount"],[8],[1,[21,1,["amount"]],false],[9],[6,"span"],[10,"class","symbol"],[8],[0,"₭S"],[9],[0,"\\n    for "],[6,"span"],[10,"class","recipient"],[8],[1,[21,1,["contributor","name"]],false],[9],[0,"\\n    "],[6,"span"],[10,"class","votes"],[8],[0,"("],[1,[21,1,["votesCount"]],false],[0,"/"],[1,[21,1,["votesNeeded"]],false],[0," votes)"],[9],[0,"\\n\\n"],[4,"unless",[[21,1,["isExecuted"]]],null,{"statements":[[0,"      "],[6,"button"],[3,"action",[[21,0,[]],"confirm",[21,1,["id"]]]],[8],[0,"+1"],[9],[0,"\\n"]],"parameters":[]},null],[0,"  "],[9],[0,"\\n"]],"parameters":[1]},null]],"hasEval":false}',meta:{moduleName:"kredits-web/components/proposal-list/template.hbs"}})}),define("kredits-web/controllers/application",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Controller.extend({})}),define("kredits-web/controllers/index",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Controller.extend({kredits:Ember.inject.service(),contributors:Ember.computed.alias("kredits.contributors"),contributorsWithKredits:Ember.computed.filter("contributors",function(e){return 0!==e.get("balance")}),contributorsSorting:["balance:desc"],contributorsSorted:Ember.computed.sort("contributorsWithKredits","contributorsSorting"),proposals:Ember.computed.alias("kredits.proposals"),proposalsOpen:Ember.computed.filterBy("proposals","isExecuted",!1),proposalsClosed:Ember.computed.filterBy("proposals","isExecuted",!0),proposalsSorting:["id:desc"],proposalsClosedSorted:Ember.computed.sort("proposalsClosed","proposalsSorting"),proposalsOpenSorted:Ember.computed.sort("proposalsOpen","proposalsSorting"),actions:{confirmProposal:function(e){this.kredits.vote(e).then(function(e){window.confirm("Vote submitted to Ethereum blockhain: "+e.hash)})},save:function(e){var t=this
return this.kredits.addContributor(e).then(function(e){return t.contributors.pushObject(e),e})}}})}),define("kredits-web/controllers/proposals/new",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Controller.extend({kredits:Ember.inject.service(),contributors:Ember.computed.alias("kredits.contributors"),minedContributors:Ember.computed.filterBy("contributors","id"),actions:{save:function(e){var t=this,n=this.contributors.findBy("id",e.contributorId)
return e.contributorIpfsHash=n.get("ipfsHash"),this.kredits.addProposal(e).then(function(e){return t.transitionToRoute("index"),e})}}})}),define("kredits-web/helpers/and",["exports","ember-truth-helpers/helpers/and"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"and",{enumerable:!0,get:function(){return t.and}})}),define("kredits-web/helpers/app-version",["exports","kredits-web/config/environment","ember-cli-app-version/utils/regexp"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.appVersion=o
var r=t.default.APP.version
function o(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}
return t.hideSha?r.match(n.versionRegExp)[0]:t.hideVersion?r.match(n.shaRegExp)[0]:r}e.default=Ember.Helper.helper(o)}),define("kredits-web/helpers/await",["exports","ember-promise-helpers/helpers/await"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("kredits-web/helpers/eq",["exports","ember-truth-helpers/helpers/equal"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"equal",{enumerable:!0,get:function(){return t.equal}})}),define("kredits-web/helpers/gt",["exports","ember-truth-helpers/helpers/gt"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"gt",{enumerable:!0,get:function(){return t.gt}})}),define("kredits-web/helpers/gte",["exports","ember-truth-helpers/helpers/gte"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"gte",{enumerable:!0,get:function(){return t.gte}})}),define("kredits-web/helpers/is-array",["exports","ember-truth-helpers/helpers/is-array"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"isArray",{enumerable:!0,get:function(){return t.isArray}})}),define("kredits-web/helpers/is-equal",["exports","ember-truth-helpers/helpers/is-equal"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"isEqual",{enumerable:!0,get:function(){return t.isEqual}})}),define("kredits-web/helpers/is-fulfilled",["exports","ember-promise-helpers/helpers/is-fulfilled"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"isFulfilled",{enumerable:!0,get:function(){return t.isFulfilled}})}),define("kredits-web/helpers/is-pending",["exports","ember-promise-helpers/helpers/is-pending"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"isPending",{enumerable:!0,get:function(){return t.isPending}})}),define("kredits-web/helpers/is-rejected",["exports","ember-promise-helpers/helpers/is-rejected"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"isRejected",{enumerable:!0,get:function(){return t.isRejected}})}),define("kredits-web/helpers/lt",["exports","ember-truth-helpers/helpers/lt"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"lt",{enumerable:!0,get:function(){return t.lt}})}),define("kredits-web/helpers/lte",["exports","ember-truth-helpers/helpers/lte"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"lte",{enumerable:!0,get:function(){return t.lte}})}),define("kredits-web/helpers/not-eq",["exports","ember-truth-helpers/helpers/not-equal"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"notEq",{enumerable:!0,get:function(){return t.notEq}})}),define("kredits-web/helpers/not",["exports","ember-truth-helpers/helpers/not"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"not",{enumerable:!0,get:function(){return t.not}})}),define("kredits-web/helpers/or",["exports","ember-truth-helpers/helpers/or"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"or",{enumerable:!0,get:function(){return t.or}})})
define("kredits-web/helpers/promise-all",["exports","ember-promise-helpers/helpers/promise-all"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"promiseAll",{enumerable:!0,get:function(){return t.promiseAll}})}),define("kredits-web/helpers/promise-hash",["exports","ember-promise-helpers/helpers/promise-hash"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"promiseHash",{enumerable:!0,get:function(){return t.promiseHash}})}),define("kredits-web/helpers/promise-rejected-reason",["exports","ember-promise-helpers/helpers/promise-rejected-reason"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("kredits-web/helpers/xor",["exports","ember-truth-helpers/helpers/xor"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"xor",{enumerable:!0,get:function(){return t.xor}})}),define("kredits-web/initializers/app-version",["exports","ember-cli-app-version/initializer-factory","kredits-web/config/environment"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0})
var r=void 0,o=void 0
n.default.APP&&(r=n.default.APP.name,o=n.default.APP.version),e.default={name:"App Version",initialize:(0,t.default)(r,o)}}),define("kredits-web/initializers/container-debug-adapter",["exports","ember-resolver/resolvers/classic/container-debug-adapter"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"container-debug-adapter",initialize:function(){var e=arguments[1]||arguments[0]
e.register("container-debug-adapter:main",t.default),e.inject("container-debug-adapter:main","namespace","application:main")}}}),define("kredits-web/initializers/export-application-global",["exports","kredits-web/config/environment"],function(e,t){function n(){var e=arguments[1]||arguments[0]
if(!1!==t.default.exportApplicationGlobal){var n
if("undefined"!=typeof window)n=window
else if("undefined"!=typeof global)n=global
else{if("undefined"==typeof self)return
n=self}var r,o=t.default.exportApplicationGlobal
r="string"==typeof o?o:Ember.String.classify(t.default.modulePrefix),n[r]||(n[r]=e,e.reopen({willDestroy:function(){this._super.apply(this,arguments),delete n[r]}}))}}Object.defineProperty(e,"__esModule",{value:!0}),e.initialize=n,e.default={name:"export-application-global",initialize:n}}),define("kredits-web/models/contributor",["exports","kredits-web/utils/cps/bignumber"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Object.extend({id:(0,t.default)("idRaw","toString"),account:null,balance:(0,t.default)("balanceRaw","toNumber"),isCore:!1,ipfsHash:null,kind:null,name:null,url:null,github_username:null,github_uid:null,wiki_username:null,ipfsData:"",isCurrentUser:!1,avatarURL:Ember.computed("github_uid",function(){var e=this.github_uid
if(e)return"https://avatars2.githubusercontent.com/u/"+e+"?v=3&s=128"})})}),define("kredits-web/models/proposal",["exports","kredits-web/utils/cps/bignumber"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Object.extend({id:(0,t.default)("idRaw","toString"),creatorAccount:null,contributorId:(0,t.default)("contributorIdRaw","toString"),amount:(0,t.default)("amountRaw","toNumber"),votesCount:(0,t.default)("votesCountRaw","toNumber"),votesNeeded:(0,t.default)("votesNeededRaw","toNumber"),executed:null,ipfsHash:null,isExecuted:Ember.computed.alias("executed"),kind:null,description:null,details:{},url:null,ipfsData:""})}),define("kredits-web/resolver",["exports","ember-resolver"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default}),define("kredits-web/router",["exports","kredits-web/config/environment"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0})
var n=Ember.Router.extend({location:t.default.locationType,rootURL:t.default.rootURL})
n.map(function(){this.route("spinner"),this.route("proposals",function(){this.route("new")})}),e.default=n}),define("kredits-web/routes/application",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Route.extend({kredits:Ember.inject.service(),beforeModel:function(e){var t=this.kredits
return t.setup().then(function(){t.get("accountNeedsUnlock")&&confirm("It looks like you have an Ethereum wallet available. Please unlock your account.")&&e.retry()}).catch(function(e){console.log("Error initializing Kredits",e)})},afterModel:function(){var e=this
return this.kredits.loadContributorsAndProposals().then(function(){e.kredits.addContractEventHandlers()})}})}),define("kredits-web/routes/spinner",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Route.extend({})}),define("kredits-web/services/ajax",["exports","ember-ajax/services/ajax"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("kredits-web/services/kredits",["exports","npm:ethers","npm:kredits-contracts","kredits-web/config/environment","kredits-web/models/contributor","kredits-web/models/proposal"],function(e,t,n,r,o,s){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Service.extend({currentUserAccounts:null,currentUser:null,currentUserIsContributor:Ember.computed.notEmpty("currentUser"),currentUserIsCore:Ember.computed.alias("currentUser.isCore"),hasAccounts:Ember.computed.notEmpty("currentUserAccounts"),accountNeedsUnlock:Ember.computed("currentUserAccounts",function(){return this.currentUserAccounts&&Ember.isEmpty(this.currentUserAccounts)}),getEthProvider:function(){var e=this
return new Ember.RSVP.Promise(function(n){var o=void 0,s=void 0
void 0!==window.web3?(console.debug("[kredits] Using user-provided instance, e.g. from Mist browser or Metamask"),s=parseInt(window.web3.version.network),(o=new t.default.providers.Web3Provider(window.web3.currentProvider,{chainId:s})).listAccounts().then(function(t){e.set("currentUserAccounts",t),n(o)})):(console.debug("[kredits] Creating new instance from npm module class"),s=parseInt(r.default.contractMetadata.networkId),o=new t.default.providers.JsonRpcProvider(r.default.web3ProviderUrl,{chainId:s}),n(o))})},setup:function(){var e=this
return this.getEthProvider().then(function(t){var o=void 0
return t.getSigner&&(o=t.getSigner()),new n.default(t,o,{ipfsConfig:r.default.ipfs}).init().then(function(t){return e.set("kredits",t),e.currentUserAccounts&&e.currentUserAccounts.length>0&&e.getCurrentUser.then(function(t){e.set("currentUser",t)}),t})})},totalSupply:Ember.computed(function(){return this.kredits.Token.functions.totalSupply()}),contributors:[],proposals:[],loadContributorsAndProposals:function(){var e=this
return this.getContributors().then(function(t){return e.contributors.pushObjects(t)}).then(function(){return e.getProposals()}).then(function(t){return e.proposals.pushObjects(t)})},addContributor:function(e){return console.debug("[kredits] add contributor",e),this.kredits.Contributor.add(e).then(function(t){return console.debug("[kredits] add contributor response",t),o.default.create(e)})},getContributors:function(){return this.kredits.Contributor.all().then(function(e){return e.map(function(e){return o.default.create(e)})})},addProposal:function(e){var t=this
return console.debug("[kredits] add proposal",e),this.kredits.Operator.addProposal(e).then(function(n){return console.debug("[kredits] add proposal response",n),e.contributor=t.contributors.findBy("id",e.contributorId),s.default.create(e)})},getProposals:function(){var e=this
return this.kredits.Operator.all().then(function(t){return t.map(function(t){return t.contributor=e.contributors.findBy("id",t.contributorId.toString()),s.default.create(t)})})},vote:function(e){return console.debug("[kredits] vote for",e),this.kredits.Operator.functions.vote(e).then(function(e){return console.debug("[kredits] vote response",e),e})},getCurrentUser:Ember.computed("kredits.provider",function(){var e=this
return Ember.isEmpty(this.currentUserAccounts)?Ember.RSVP.resolve():this.kredits.Contributor.functions.getContributorIdByAddress(this.get("currentUserAccounts.firstObject")).then(function(t){return 0===(t=t.toNumber())?Ember.RSVP.resolve():e.kredits.Contributor.getById(t)})}),findProposalById:function(e){return this.proposals.findBy("id",e.toString())},addContractEventHandlers:function(){this.kredits.Operator.on("ProposalCreated",this.handleProposalCreated.bind(this)).on("ProposalVoted",this.handleProposalVoted.bind(this)).on("ProposalExecuted",this.handleProposalExecuted.bind(this)),this.kredits.Token.on("Transfer",this.handleTransfer.bind(this))},handleProposalCreated:function(e){var t=this
this.findProposalById(e)?console.debug("[events] proposal exists, not adding from event"):this.kredits.Operator.getById(e).then(function(e){e.contributor=t.contributors.findBy("id",e.contributorId.toString()),t.proposals.pushObject(s.default.create(e))})},handleProposalVoted:function(e,t,n){var r=this.findProposalById(e)
r&&r.set("votesCount",n)},handleProposalExecuted:function(e,t,n){var r=this.findProposalById(e)
r.get("isExecuted")?console.debug("[events] proposal already executed, not adding from event"):(r.set("executed",!0),this.contributors.findBy("id",t.toString()).incrementProperty("balance",n.toNumber()))},handleTransfer:function(e,t,n){n=n.toNumber(),this.contributors.findBy("address",e).decrementProperty("balance",n),this.contributors.findBy("address",t).incrementProperty("balance",n)}})}),define("kredits-web/templates/application",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"Lp1+Ni2p",block:'{"symbols":[],"statements":[[6,"main"],[8],[0,"\\n  "],[1,[20,"outlet"],false],[0,"\\n"],[9],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"kredits-web/templates/application.hbs"}})}),define("kredits-web/templates/index",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"Vx25wHka",block:'{"symbols":[],"statements":[[4,"if",[[22,["kredits","hasAccounts"]]],null,{"statements":[[0,"  "],[6,"section"],[10,"id","user-account"],[8],[0,"\\n"],[4,"if",[[22,["kredits","currentUser"]]],null,{"statements":[[0,"      "],[1,[22,["kredits","currentUser","name"]],false],[0,"\\n"],[4,"if",[[22,["kredits","currentUserIsCore"]]],null,{"statements":[[0,"        (core)\\n"]],"parameters":[]},null],[0,"      Account: "],[1,[22,["kredits","currentUser","account"]],false],[0,"\\n"]],"parameters":[]},null],[0,"  "],[9],[0,"\\n"]],"parameters":[]},null],[0,"\\n"],[6,"section"],[10,"id","contributors"],[8],[0,"\\n  "],[6,"header"],[8],[0,"\\n    "],[6,"h2"],[8],[0,"Kosmos Contributors"],[9],[0,"\\n  "],[9],[0,"\\n  "],[6,"div"],[10,"class","content"],[8],[0,"\\n    "],[1,[26,"contributor-list",null,[["contributors"],[[22,["contributorsSorted"]]]]],false],[0,"\\n\\n    "],[6,"p"],[10,"class","stats"],[8],[0,"\\n      "],[6,"span"],[10,"class","number"],[8],[1,[26,"await",[[22,["kredits","totalSupply"]]],null],false],[9],[0," kredits issued and distributed among\\n      "],[6,"span"],[10,"class","number"],[8],[1,[22,["contributorsWithKredits","length"]],false],[9],[0," contributors.\\n    "],[9],[0,"\\n  "],[9],[0,"\\n"],[9],[0,"\\n\\n"],[4,"if",[[22,["proposalsOpen"]]],null,{"statements":[[0,"  "],[6,"section"],[10,"id","proposals-open"],[8],[0,"\\n    "],[6,"header"],[8],[0,"\\n      "],[6,"h2"],[8],[0,"Open Proposals"],[9],[0,"\\n    "],[9],[0,"\\n    "],[6,"div"],[10,"class","content"],[8],[0,"\\n"],[0,"      "],[1,[26,"proposal-list",null,[["proposals","confirmProposal","contractInteractionEnabled"],[[22,["proposalsOpenSorted"]],[26,"action",[[21,0,[]],"confirmProposal"],null],[22,["kredits","hasAccounts"]]]]],false],[0,"\\n\\n"],[4,"if",[[22,["kredits","hasAccounts"]]],null,{"statements":[[0,"        "],[6,"p"],[10,"class","actions"],[8],[0,"\\n          "],[4,"link-to",["proposals.new"],null,{"statements":[[0,"Create new proposal"]],"parameters":[]},null],[0,"\\n        "],[9],[0,"\\n"]],"parameters":[]},null],[0,"    "],[9],[0,"\\n  "],[9],[0,"\\n"]],"parameters":[]},null],[0,"\\n"],[6,"section"],[10,"id","proposals-closed"],[8],[0,"\\n  "],[6,"header"],[8],[0,"\\n    "],[6,"h2"],[8],[0,"Closed Proposals"],[9],[0,"\\n  "],[9],[0,"\\n  "],[6,"div"],[10,"class","content"],[8],[0,"\\n    "],[1,[26,"proposal-list",null,[["proposals","confirmProposal"],[[22,["proposalsClosedSorted"]],[26,"action",[[21,0,[]],"confirmProposal"],null]]]],false],[0,"\\n\\n"],[4,"if",[[22,["kredits","hasAccounts"]]],null,{"statements":[[0,"      "],[6,"p"],[10,"class","actions"],[8],[0,"\\n        "],[4,"link-to",["proposals.new"],null,{"statements":[[0,"Create new proposal"]],"parameters":[]},null],[0,"\\n      "],[9],[0,"\\n"]],"parameters":[]},null],[0,"  "],[9],[0,"\\n"],[9],[0,"\\n\\n"],[6,"section"],[10,"id","add-contributor"],[8],[0,"\\n  "],[6,"header"],[8],[0,"\\n    "],[6,"h2"],[8],[0,"Add Contributor"],[9],[0,"\\n  "],[9],[0,"\\n\\n  "],[6,"div"],[10,"class","content"],[8],[0,"\\n"],[4,"if",[[22,["kredits","currentUser","isCore"]]],null,{"statements":[[0,"      "],[1,[26,"add-contributor",null,[["contributors","save"],[[22,["contributors"]],[26,"action",[[21,0,[]],"save"],null]]]],false],[0,"\\n"]],"parameters":[]},{"statements":[[0,"      Only core team members can add new contributors. Please ask someone to set you up.\\n"]],"parameters":[]}],[0,"  "],[9],[0,"\\n"],[9],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"kredits-web/templates/index.hbs"}})}),define("kredits-web/templates/loading",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"mH9O+n3h",block:'{"symbols":[],"statements":[[1,[20,"loading-spinner"],false],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"kredits-web/templates/loading.hbs"}})}),define("kredits-web/templates/proposals/new",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"AndvFYbw",block:'{"symbols":[],"statements":[[6,"section"],[10,"id","add-proposal"],[8],[0,"\\n  "],[6,"header"],[8],[0,"\\n    "],[6,"h2"],[8],[0,"Add Proposal"],[9],[0,"\\n  "],[9],[0,"\\n\\n  "],[6,"div"],[10,"class","content"],[8],[0,"\\n    "],[1,[26,"add-proposal",null,[["contributors","save"],[[22,["minedContributors"]],[26,"action",[[21,0,[]],"save"],null]]]],false],[0,"\\n  "],[9],[0,"\\n"],[9],[0,"\\n\\n"]],"hasEval":false}',meta:{moduleName:"kredits-web/templates/proposals/new.hbs"}})}),define("kredits-web/templates/spinner",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"iRtHkezY",block:'{"symbols":[],"statements":[[1,[20,"loading-spinner"],false],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"kredits-web/templates/spinner.hbs"}})}),define("kredits-web/utils/cps/bignumber",["exports","npm:ethers"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(e,n){return Ember.computed(e,{get:function(){var r=this.get(e)
return r&&t.default.utils.isBigNumber(r)?r[n]():r},set:function(r,o){return o=t.default.utils.bigNumberify(o),this.set(e,o),o[n]()}})}}),define("kredits-web/config/environment",[],function(){try{var e="kredits-web/config/environment",t=document.querySelector('meta[name="'+e+'"]').getAttribute("content"),n={default:JSON.parse(unescape(t))}
return Object.defineProperty(n,"__esModule",{value:!0}),n}catch(t){throw new Error('Could not read config from meta tag with name "'+e+'".')}}),runningTests||require("kredits-web/app").default.create({name:"kredits-web",version:"1.0.0+a0ee2f7b"})

//# sourceMappingURL=kredits-web-5e23fb0e898f0b92288fa8d032e1e1e8.map