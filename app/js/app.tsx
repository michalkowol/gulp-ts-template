import Stateful from './component/Components.react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as director from 'director';
import * as $ from 'jquery';
import * as bootstrap from 'bootstrap';

console.log("Hello, World!")

ReactDOM.render(<Stateful />, document.getElementById('demo'));

var router = new director.Router({
  '/': () => console.log("Hello, World from Router!")
}).configure({strict: false});

router.init();
router.dispatch('on', window.location.pathname);