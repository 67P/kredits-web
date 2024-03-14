'use strict';

module.exports = {
  extends: 'octane',

  rules: {
    'simple-unless': false,
    'no-nested-interactive': false,
    'no-invalid-interactive': false,
    'no-html-comments': false
  },

  ignore: [
    'kredits-web/templates/components/**',
    'app/templates/components/**'
  ],

	pending: [
		{
			"moduleId": "app/templates/dashboard",
			"only": [
				"no-action"
			]
		},
		{
			"moduleId": "app/components/add-contribution/template",
			"only": [
				"no-action",
				"no-curly-component-invocation"
			]
		},
		{
			"moduleId": "app/components/add-contributor/template",
			"only": [
				"no-action",
				"no-curly-component-invocation"
			]
		},
		{
			"moduleId": "app/components/contribution-list/template",
			"only": [
				"no-action",
				"no-curly-component-invocation"
			]
		},
		{
			"moduleId": "app/components/contributor-list/template",
			"only": [
				"no-action"
			]
		},
		{
			"moduleId": "app/components/expense-list/template",
			"only": [
				"no-invalid-role"
			]
		},
		{
			"moduleId": "app/components/topbar-account-panel/template",
			"only": [
				"no-action"
			]
		},
		{
			"moduleId": "app/templates/contributions/new",
			"only": [
				"no-action"
			]
		},
		{
			"moduleId": "app/templates/contributions/resubmit",
			"only": [
				"no-action"
			]
		},
		{
			"moduleId": "app/templates/contributors/edit",
			"only": [
				"no-action"
			]
		},
		{
			"moduleId": "app/templates/contributors/new",
			"only": [
				"no-action"
			]
		},
		{
			"moduleId": "app/templates/signup/eth-account",
			"only": [
				"no-action"
			]
		},
		{
			"moduleId": "app/templates/signup/index",
			"only": [
				"no-action"
			]
		}
	]
};
