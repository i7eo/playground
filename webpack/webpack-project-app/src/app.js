import './css/commons.css';
import Layer from './components/layer/layer.js';

const App = function (){
	console.log(layer);
	var dom = document.getElementById('app');
	var layer = new Layer();
	dom.innerHTML = layer.tpl({
		name: 'tan',
		arr: ['apple' , 'sauming' , 'huawei']
	});
};

App();