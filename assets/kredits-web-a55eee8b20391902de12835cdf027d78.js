"use strict";define("kredits-web/app",["exports","ember","kredits-web/resolver","ember-load-initializers","kredits-web/config/environment"],function(e,t,n,s,o){var r=void 0;t.default.MODEL_FACTORY_INJECTIONS=!0,r=t.default.Application.extend({modulePrefix:o.default.modulePrefix,podModulePrefix:o.default.podModulePrefix,Resolver:n.default}),(0,s.default)(r,o.default.modulePrefix),e.default=r}),define("kredits-web/components/add-contributor/component",["exports","ember"],function(e,t){e.default=t.default.Component.extend({id:null,realName:null,address:null,ipfsHash:null,isCore:!0,inProgress:!1,isValidId:function(){return t.default.isPresent(this.get("id"))}.property("id"),isValidRealName:function(){return t.default.isPresent(this.get("realName"))}.property("realName"),isValidAddress:function(){return this.get("kredits.web3Instance").isAddress(this.get("address"))}.property("address"),isValid:function(){return this.get("isValidId")&&this.get("isValidRealName")&&this.get("isValidAddress")}.property("isValidAddress","isValidId","isValidRealName"),reset:function(){this.setProperties({id:null,realName:null,address:null,ipfsHash:null,isCore:!0,inProgress:!1})},actions:{save:function(){var e=this;return this.get("contractInteractionEnabled")?void(this.get("isValid")?(this.set("inProgress",!0),this.get("kredits").addContributor(this.get("address"),this.get("realName"),"",this.get("isCore"),this.get("id")).then(function(t){e.reset(),e.get("contributors").pushObject(t),window.scroll(0,0)})):alert("Invalid data. Please review and try again.")):void alert("Only core team members can add new contributors. Please ask someone to set you up.")}}})}),define("kredits-web/components/add-contributor/template",["exports"],function(e){e.default=Ember.HTMLBars.template({id:"/k9OiFIM",block:'{"statements":[["open-element","form",[]],["modifier",["action"],[["get",[null]],"save"],[["on"],["submit"]]],["flush-element"],["text","\\n  "],["open-element","p",[]],["flush-element"],["text","\\n    "],["append",["helper",["input"],null,[["name","type","placeholder","value","class"],["id","text","GitHub UID (123)",["get",["id"]],["helper",["if"],[["get",["isValidId"]],"valid",""],null]]]],false],["text","\\n  "],["close-element"],["text","\\n  "],["open-element","p",[]],["flush-element"],["text","\\n    "],["append",["helper",["input"],null,[["name","type","placeholder","value","class"],["realname","text","Carl Sagan",["get",["realName"]],["helper",["if"],[["get",["isValidRealName"]],"valid",""],null]]]],false],["text","\\n  "],["close-element"],["text","\\n  "],["open-element","p",[]],["flush-element"],["text","\\n    "],["append",["helper",["input"],null,[["name","type","placeholder","value","class"],["address","text","0xF18E631Ea191aE4ebE70046Fcb01a436554421BA4",["get",["address"]],["helper",["if"],[["get",["isValidAddress"]],"valid",""],null]]]],false],["text","\\n  "],["close-element"],["text","\\n  "],["open-element","p",[]],["static-attr","class","actions"],["flush-element"],["text","\\n    "],["append",["helper",["input"],null,[["type","value","disabled"],["submit",["helper",["if"],[["get",["inProgress"]],"Processing","Save"],null],["get",["inProgress"]]]]],false],["text","\\n  "],["close-element"],["text","\\n"],["close-element"],["text","\\n"]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',meta:{moduleName:"kredits-web/components/add-contributor/template.hbs"}})}),define("kredits-web/components/contributor-list/component",["exports","ember"],function(e,t){e.default=t.default.Component.extend({tagName:"table",classNames:"contributor-list"})}),define("kredits-web/components/contributor-list/template",["exports"],function(e){e.default=Ember.HTMLBars.template({id:"K8OMz7QI",block:'{"statements":[["open-element","tbody",[]],["flush-element"],["text","\\n"],["block",["each"],[["get",["contributors"]]],null,0],["close-element"],["text","\\n"]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","    "],["open-element","tr",[]],["dynamic-attr","class",["concat",[["helper",["if"],[["get",["contributor","isCurrentUser"]],"current-user"],null]]]],["flush-element"],["text","\\n      "],["open-element","td",[]],["static-attr","class","person"],["flush-element"],["text","\\n        "],["open-element","img",[]],["static-attr","class","avatar"],["dynamic-attr","src",["unknown",["contributor","avatarURL"]],null],["flush-element"],["close-element"],["text","\\n        "],["append",["unknown",["contributor","github_username"]],false],["text","\\n      "],["close-element"],["text","\\n      "],["open-element","td",[]],["static-attr","class","kredits"],["flush-element"],["text","\\n        "],["open-element","span",[]],["static-attr","class","amount"],["flush-element"],["append",["unknown",["contributor","kredits"]],false],["close-element"],["text","\\n        "],["open-element","span",[]],["static-attr","class","symbol"],["flush-element"],["text","₭S"],["close-element"],["text","\\n      "],["close-element"],["text","\\n    "],["close-element"],["text","\\n"]],"locals":["contributor"]}],"hasPartials":false}',meta:{moduleName:"kredits-web/components/contributor-list/template.hbs"}})}),define("kredits-web/components/loading-spinner/component",["exports","ember"],function(e,t){e.default=t.default.Component.extend({classNames:["loading-spinner"]})}),define("kredits-web/components/loading-spinner/template",["exports"],function(e){e.default=Ember.HTMLBars.template({id:"+vFITFyc",block:'{"statements":[["open-element","p",[]],["flush-element"],["text","\\n  "],["open-element","svg",[]],["static-attr","xmlns","http://www.w3.org/2000/svg","http://www.w3.org/2000/xmlns/"],["static-attr","xmlns:xlink","http://www.w3.org/1999/xlink","http://www.w3.org/2000/xmlns/"],["static-attr","version","1.1"],["static-attr","x","0px"],["static-attr","y","0px"],["static-attr","viewBox","0 0 132 100"],["static-attr","enable-background","new 0 0 100 100"],["static-attr","xml:space","preserve","http://www.w3.org/XML/1998/namespace"],["flush-element"],["text","\\n    "],["open-element","path",[]],["static-attr","id","path-comet"],["static-attr","d","M79.062,24.173L79.062,24.173l-0.021-0.011c-0.068-0.03-0.137-0.062-0.204-0.093L42.392,7.337\\n             c0,0,3.065,14.104,4.458,18.019l0,0c0,0-41.754-12.481-46.85-13.67c1.67,6.52,30.607,62.492,30.607,62.492\\n             c5.848,11.873,19.394,18.485,33.522,18.485c19.811,0,35.87-16.059,35.87-35.869C100,42.313,91.418,29.837,79.062,24.173z"],["flush-element"],["text","\\n    "],["close-element"],["text","\\n  "],["close-element"],["text","\\n"],["close-element"],["text","\\n"],["open-element","p",[]],["flush-element"],["text","\\n  Loading data from Ethereum...\\n"],["close-element"],["text","\\n"]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',meta:{moduleName:"kredits-web/components/loading-spinner/template.hbs"}})}),define("kredits-web/components/proposal-list/component",["exports","ember"],function(e,t){e.default=t.default.Component.extend({tagName:"ul",classNames:["proposal-list"],actions:{confirm:function(e){this.get("contractInteractionEnabled")?this.sendAction("confirmAction",e):window.alert("Only members can vote on proposals. Please ask someone to set you up.")}}})}),define("kredits-web/components/proposal-list/template",["exports"],function(e){e.default=Ember.HTMLBars.template({id:"Q7rvGjgJ",block:'{"statements":[["block",["each"],[["get",["proposals"]]],null,2]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["open-element","button",[]],["modifier",["action"],[["get",[null]],"confirm",["get",["proposal","id"]]]],["flush-element"],["text","+1"],["close-element"]],"locals":[]},{"statements":[["text","d"]],"locals":[]},{"statements":[["text","  "],["open-element","li",[]],["flush-element"],["text","\\n    "],["open-element","span",[]],["static-attr","class","id"],["flush-element"],["text","#"],["append",["unknown",["proposal","id"]],false],["close-element"],["text","\\n    Issue"],["block",["if"],[["get",["proposal","executed"]]],null,1],["text","\\n    "],["open-element","span",[]],["static-attr","class","amount"],["flush-element"],["append",["unknown",["proposal","amount"]],false],["close-element"],["open-element","span",[]],["static-attr","class","symbol"],["flush-element"],["text","₭S"],["close-element"],["text","\\n    to "],["open-element","span",[]],["static-attr","class","recipient"],["dynamic-attr","title",["concat",[["unknown",["proposal","recipientAddress"]]]]],["flush-element"],["append",["unknown",["proposal","recipientName"]],false],["close-element"],["text","\\n    "],["open-element","span",[]],["static-attr","class","votes"],["flush-element"],["text","("],["append",["unknown",["proposal","votesCount"]],false],["text","/"],["append",["unknown",["proposal","votesNeeded"]],false],["text"," votes)"],["close-element"],["text","\\n\\n    "],["block",["unless"],[["get",["proposal","executed"]]],null,0],["text","\\n  "],["close-element"],["text","\\n"]],"locals":["proposal"]}],"hasPartials":false}',meta:{moduleName:"kredits-web/components/proposal-list/template.hbs"}})}),define("kredits-web/controllers/application",["exports","ember"],function(e,t){e.default=t.default.Controller.extend({})}),define("kredits-web/controllers/index",["exports","ember","kredits-web/models/proposal"],function(e,t,n){var s=t.default.computed,o=t.default.inject.service;e.default=t.default.Controller.extend({kredits:o(),contractInteractionEnabled:s.alias("kredits.web3Provided"),findContributorByAddress:function(e){return this.get("model.contributors").findBy("address",e)},proposalsOpen:function(){var e=this,t=this.get("model.proposals").filterBy("executed",!1).map(function(t){return t.set("recipientName",e.findContributorByAddress(t.get("recipientAddress")).github_username),t});return t}.property("model.proposals.[]","model.proposals.@each.executed","model.contributors.[]"),proposalsClosed:function(){var e=this,t=this.get("model.proposals").filterBy("executed",!0).map(function(t){return t.set("recipientName",e.findContributorByAddress(t.get("recipientAddress")).github_username),t});return t}.property("model.proposals.[]","model.proposals.@each.executed","model.contributors.[]"),proposalsSorting:["id:desc"],proposalsClosedSorted:t.default.computed.sort("proposalsClosed","proposalsSorting"),proposalsOpenSorted:t.default.computed.sort("proposalsOpen","proposalsSorting"),contributorsSorting:["kredits:desc"],contributorsSorted:t.default.computed.sort("model.contributors","contributorsSorting"),watchContractEvents:function(){var e=this,n=this.get("kredits.kreditsContract").allEvents();n.watch(function(n,s){switch(t.default.Logger.debug("[index] Received contract event",s),s.event){case"ProposalCreated":e._handleProposalCreated(s);break;case"ProposalExecuted":e._handleProposalExecuted(s);break;case"ProposalVoted":e._handleProposalVoted(s);break;case"Transfer":e._handleTransfer(s)}})}.on("init"),_handleProposalCreated:function(e){if(t.default.isPresent(this.get("model.proposals").findBy("id",e.args.id.toNumber())))return t.default.Logger.debug("[index] proposal exists, not adding from event"),!1;var s=n.default.create({id:e.args.id.toNumber(),creatorAddress:e.args.creator,recipientAddress:e.args.recipient,recipientName:null,votesCount:0,votesNeeded:2,amount:e.args.amount.toNumber(),executed:!1,url:e.args.url,ipfsHash:e.args.ipfsHash});this.get("model.proposals").pushObject(s)},_handleProposalExecuted:function(e){return this.get("model.proposals").findBy("id",e.args.id.toNumber()).get("executed")?(t.default.Logger.debug("[index] proposal already executed, not adding from event"),!1):(this.get("model.proposals").findBy("id",e.args.id.toNumber()).setProperties({executed:!0,votesCount:2}),void this.get("model.contributors").findBy("address",e.args.recipient).incrementProperty("kredits",e.args.amount.toNumber()))},_handleProposalVoted:function(e){this.get("model.proposals").findBy("id",e.args.id.toNumber()).incrementProperty("votesCount",1)},_handleTransfer:function(e){this.get("model.contributors").findBy("address",e.args.from).incrementProperty("kredits",-e.args.value.toNumber()),this.get("model.contributors").findBy("address",e.args.to).incrementProperty("kredits",e.args.value.toNumber())},actions:{confirmProposal:function(e){this.get("kredits").vote(e).then(function(e){window.confirm("Vote submitted to Ethereum blockhain: "+e)})}}})}),define("kredits-web/helpers/app-version",["exports","ember","kredits-web/config/environment"],function(e,t,n){function s(){return o}e.appVersion=s;var o=n.default.APP.version;e.default=t.default.Helper.helper(s)}),define("kredits-web/initializers/app-version",["exports","ember-cli-app-version/initializer-factory","kredits-web/config/environment"],function(e,t,n){var s=n.default.APP,o=s.name,r=s.version;e.default={name:"App Version",initialize:(0,t.default)(o,r)}}),define("kredits-web/initializers/container-debug-adapter",["exports","ember-resolver/container-debug-adapter"],function(e,t){e.default={name:"container-debug-adapter",initialize:function(){var e=arguments[1]||arguments[0];e.register("container-debug-adapter:main",t.default),e.inject("container-debug-adapter:main","namespace","application:main")}}}),define("kredits-web/initializers/export-application-global",["exports","ember","kredits-web/config/environment"],function(e,t,n){function s(){var e=arguments[1]||arguments[0];if(n.default.exportApplicationGlobal!==!1){var s;if("undefined"!=typeof window)s=window;else if("undefined"!=typeof global)s=global;else{if("undefined"==typeof self)return;s=self}var o,r=n.default.exportApplicationGlobal;o="string"==typeof r?r:t.default.String.classify(n.default.modulePrefix),s[o]||(s[o]=e,e.reopen({willDestroy:function(){this._super.apply(this,arguments),delete s[o]}}))}}e.initialize=s,e.default={name:"export-application-global",initialize:s}}),define("kredits-web/models/contributor",["exports","ember"],function(e,t){e.default=t.default.Object.extend({address:null,github_username:null,github_uid:null,ipfsHash:null,kredits:null,isCurrentUser:!1,avatarURL:function(){return"https://avatars2.githubusercontent.com/u/"+this.get("github_uid")+"?v=3&s=128"}.property("github_uid")})}),define("kredits-web/models/proposal",["exports","ember"],function(e,t){e.default=t.default.Object.extend({id:null,creatorAddress:null,recipientAddress:null,recipientName:null,votesCount:null,votesNeeded:null,amount:null,executed:null,url:null,ipfsHash:null})}),define("kredits-web/resolver",["exports","ember-resolver"],function(e,t){e.default=t.default}),define("kredits-web/router",["exports","ember","kredits-web/config/environment"],function(e,t,n){var s=t.default.Router.extend({location:n.default.locationType,rootURL:n.default.rootURL});s.map(function(){this.route("spinner")}),e.default=s}),define("kredits-web/routes/application",["exports","ember"],function(e,t){e.default=t.default.Route.extend({})}),define("kredits-web/routes/index",["exports","ember"],function(e,t){e.default=t.default.Route.extend({kredits:t.default.inject.service(),model:function(){var e=this.get("kredits");return t.default.RSVP.hash({contributors:e.getContributors(),totalSupply:e.getValueFromContract("totalSupply"),contributorsCount:e.getValueFromContract("contributorsCount"),proposals:e.getProposals()})}})}),define("kredits-web/routes/spinner",["exports","ember"],function(e,t){e.default=t.default.Route.extend({})}),define("kredits-web/services/ajax",["exports","ember-ajax/services/ajax"],function(e,t){Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("kredits-web/services/kredits",["exports","ember","npm:web3","kredits-web/config/environment","kredits-web/models/contributor","kredits-web/models/proposal","npm:kredits-contracts"],function(e,t,n,s,o,r,l){e.default=t.default.Service.extend({web3Instance:null,web3Provided:!1,web3:function(){if(this.get("web3Instance"))return this.get("web3Instance");var e=void 0;if("undefined"!=typeof window.web3)t.default.Logger.debug("[kredits] Using user-provided instance, e.g. from Mist browser or Metamask"),e=window.web3,this.set("web3Provided",!0);else{t.default.Logger.debug("[kredits] Creating new instance from npm module class");var o=new n.default.providers.HttpProvider(s.default.web3ProviderUrl);e=new n.default(o)}return this.set("web3Instance",e),window.web3=e,e}.property("web3Instance"),currentUserAccounts:function(){return this.get("web3Provided")&&this.get("web3").eth.accounts||[]}.property("web3","web3Provided"),kreditsContract:function(){if(this.get("kreditsContractInstance"))return this.get("kreditsContractInstance");console.log(s.default.ethereumChain);var e=(0,l.default)(this.get("web3"),s.default.ethereumChain).Kredits;return this.set("kreditsContractInstance",e),e}.property("web3"),getValueFromContract:function(e){for(var n=this,s=arguments.length,o=Array(s>1?s-1:0),r=1;r<s;r++)o[r-1]=arguments[r];return new t.default.RSVP.Promise(function(t,s){var r;(r=n.get("kreditsContract"))[e].apply(r,o.concat([function(e,n){e&&s(e),t(n)}]))})},getContributorData:function(e){var n=this,s=new t.default.RSVP.Promise(function(s,r){n.getValueFromContract("contributorAddresses",e).then(function(e){n.getValueFromContract("contributors",e).then(function(r){n.getValueFromContract("balanceOf",e).then(function(l){var a=o.default.create({address:e,github_username:r[1],github_uid:r[0],ipfsHash:r[3],kredits:l.toNumber(),isCurrentUser:n.get("currentUserAccounts").includes(e)});t.default.Logger.debug("[kredits] contributor",a),s(a)})})}).catch(function(e){return r(e)})});return s},getContributors:function(){var e=this;return this.getValueFromContract("contributorsCount").then(function(n){for(var s=[],o=0;o<n.toNumber();o++)s.push(e.getContributorData(o));return t.default.RSVP.all(s)})},getProposalData:function(e){var n=this,s=new t.default.RSVP.Promise(function(s,o){n.getValueFromContract("proposals",e).then(function(n){var o=r.default.create({id:e,creatorAddress:n[0],recipientAddress:n[1],votesCount:n[2].toNumber(),votesNeeded:n[3].toNumber(),amount:n[4].toNumber(),executed:n[5],url:n[6],ipfsHash:n[7]});t.default.Logger.debug("[kredits] proposal",o),s(o)}).catch(function(e){return o(e)})});return s},getProposals:function(){var e=this;return this.getValueFromContract("proposalsCount").then(function(n){for(var s=[],o=0;o<n.toNumber();o++)s.push(e.getProposalData(o));return t.default.RSVP.all(s)})},vote:function(e){var n=this;return t.default.Logger.debug("[kredits] vote for",e),new t.default.RSVP.Promise(function(s,o){n.get("kreditsContract").vote(e,function(e,n){e&&o(e),t.default.Logger.debug("[kredits] vote response",n),s(n)})})},addContributor:function(e,n,s,r,l){var a=this;return t.default.Logger.debug("[kredits] add contributor",n,e),new t.default.RSVP.Promise(function(i,d){a.get("kreditsContract").addContributor(e,n,s,r,l,function(r,u){r&&d(r),t.default.Logger.debug("[kredits] add contributor response",u);var c=o.default.create({address:e,github_username:n,github_uid:l,ipfsHash:s,kredits:0,isCurrentUser:a.get("currentUserAccounts").includes(e)});i(c)})})},logKreditsContract:function(){t.default.Logger.debug("[kredits] kreditsContract",this.get("kreditsContract"))}.on("init")})}),define("kredits-web/templates/application",["exports"],function(e){e.default=Ember.HTMLBars.template({id:"bs9LAwOM",block:'{"statements":[["open-element","main",[]],["flush-element"],["text","\\n  "],["append",["unknown",["outlet"]],false],["text","\\n"],["close-element"],["text","\\n"]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',meta:{moduleName:"kredits-web/templates/application.hbs"}})}),define("kredits-web/templates/index",["exports"],function(e){e.default=Ember.HTMLBars.template({id:"V9LmlsVv",block:'{"statements":[["open-element","section",[]],["static-attr","id","contributors"],["flush-element"],["text","\\n  "],["open-element","header",[]],["flush-element"],["text","\\n    "],["open-element","h2",[]],["flush-element"],["text","Kosmos Contributors"],["close-element"],["text","\\n  "],["close-element"],["text","\\n\\n  "],["open-element","div",[]],["static-attr","class","content"],["flush-element"],["text","\\n    "],["append",["helper",["contributor-list"],null,[["contributors"],[["get",["contributorsSorted"]]]]],false],["text","\\n\\n    "],["open-element","p",[]],["static-attr","class","stats"],["flush-element"],["text","\\n      "],["open-element","span",[]],["static-attr","class","number"],["flush-element"],["append",["unknown",["model","totalSupply"]],false],["close-element"],["text"," kredits issued and distributed among\\n      "],["open-element","span",[]],["static-attr","class","number"],["flush-element"],["append",["unknown",["model","contributorsCount"]],false],["close-element"],["text"," contributors.\\n    "],["close-element"],["text","\\n  "],["close-element"],["text","\\n"],["close-element"],["text","\\n\\n"],["block",["if"],[["get",["proposalsOpen"]]],null,0],["text","\\n"],["open-element","section",[]],["static-attr","id","proposals-closed"],["flush-element"],["text","\\n  "],["open-element","header",[]],["flush-element"],["text","\\n    "],["open-element","h2",[]],["flush-element"],["text","Closed Proposals"],["close-element"],["text","\\n  "],["close-element"],["text","\\n  "],["open-element","div",[]],["static-attr","class","content"],["flush-element"],["text","\\n    "],["append",["helper",["proposal-list"],null,[["proposals","confirmAction"],[["get",["proposalsClosedSorted"]],"confirmProposal"]]],false],["text","\\n  "],["close-element"],["text","\\n"],["close-element"],["text","\\n\\n"],["open-element","section",[]],["static-attr","id","add-contributor"],["flush-element"],["text","\\n  "],["open-element","header",[]],["flush-element"],["text","\\n    "],["open-element","h2",[]],["flush-element"],["text","Add Contributor"],["close-element"],["text","\\n  "],["close-element"],["text","\\n\\n  "],["open-element","div",[]],["static-attr","class","content"],["flush-element"],["text","\\n    "],["append",["helper",["add-contributor"],null,[["kredits","contributors","contractInteractionEnabled"],[["get",["kredits"]],["get",["model","contributors"]],["get",["contractInteractionEnabled"]]]]],false],["text","\\n  "],["close-element"],["text","\\n"],["close-element"],["text","\\n"]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","  "],["open-element","section",[]],["static-attr","id","proposals-open"],["flush-element"],["text","\\n    "],["open-element","header",[]],["flush-element"],["text","\\n      "],["open-element","h2",[]],["flush-element"],["text","Open Proposals"],["close-element"],["text","\\n    "],["close-element"],["text","\\n    "],["open-element","div",[]],["static-attr","class","content"],["flush-element"],["text","\\n      "],["append",["helper",["proposal-list"],null,[["proposals","confirmAction","contractInteractionEnabled"],[["get",["proposalsOpenSorted"]],"confirmProposal",["get",["contractInteractionEnabled"]]]]],false],["text","\\n    "],["close-element"],["text","\\n  "],["close-element"],["text","\\n"]],"locals":[]}],"hasPartials":false}',meta:{moduleName:"kredits-web/templates/index.hbs"}})}),define("kredits-web/templates/loading",["exports"],function(e){e.default=Ember.HTMLBars.template({id:"elCfJGFx",block:'{"statements":[["append",["unknown",["loading-spinner"]],false],["text","\\n"]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',meta:{moduleName:"kredits-web/templates/loading.hbs"}})}),define("kredits-web/templates/spinner",["exports"],function(e){e.default=Ember.HTMLBars.template({id:"OxhVgkbb",block:'{"statements":[["append",["unknown",["loading-spinner"]],false],["text","\\n"]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',meta:{moduleName:"kredits-web/templates/spinner.hbs"}})}),define("kredits-web/config/environment",["ember"],function(e){var t="kredits-web";try{var n=t+"/config/environment",s=document.querySelector('meta[name="'+n+'"]').getAttribute("content"),o=JSON.parse(unescape(s)),r={default:o};return Object.defineProperty(r,"__esModule",{value:!0}),r}catch(e){throw new Error('Could not read config from meta tag with name "'+n+'".')}}),runningTests||require("kredits-web/app").default.create({name:"kredits-web",version:"0.0.0+7c98de3e"});