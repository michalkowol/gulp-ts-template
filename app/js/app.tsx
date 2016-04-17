/// <reference path="../../typings/browser.d.ts" />

import Stateful from './component/Components.react'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as $ from 'jquery'
import * as bootstrap from 'bootstrap'
import {createStore, combineReducers, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import {Router, Route, browserHistory} from 'react-router'
import {syncHistoryWithStore, routerReducer} from 'react-router-redux'

console.log("Hello, World!");
$.ajax({
   url: "",
    cache: 1
});
ReactDOM.render(<Stateful />, document.getElementById('demo'));