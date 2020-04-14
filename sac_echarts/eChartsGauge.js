
	import * as echarts from 'echarts/lib/echarts';
	import 'echarts/lib/chart/gauge';
	import 'echarts/lib/component/tooltip';
	import 'echarts/lib/component/title';
(function() { 


	let template = document.createElement("template");
	template.innerHTML = `
    <style>
    :host {
        display: block;
    } 
    </style> 
    <div id="chart_div" style="width: 600px;height:400px;"></div>
	`;

	class EChartsGauge extends HTMLElement {
		

		constructor() {
			super(); 
			let shadowRoot = this.attachShadow({mode: "open"});
			shadowRoot.appendChild(template.content.cloneNode(true));
			
			this.addEventListener("click", event => {
				var event = new Event("onClick");
				this.dispatchEvent(event);
			});
			
			this._props = {};
		}
		
		render(val, info, color) {
            
            let myChart = echarts.init(document.getElementById('chart_div'), null, {renderer: 'svg'});
            myChart.setOption({
                tooltip: {
                    formatter: '{a} <br/>{b} : {c}%'
                },
                toolbox: {
                    feature: {
                        restore: {},
                        saveAsImage: {}
                    }
                },
                series: [
                    {
                        name: info,
                        type: 'gauge',
                        detail: {formatter: '{val}%'},
                        data: [{value: val, name: '完成率'}]
                    }
                ]
            });
		}
		  
		onCustomWidgetBeforeUpdate(changedProperties) {
			this._props = { ...this._props, ...changedProperties };
		}

		onCustomWidgetAfterUpdate(changedProperties) {
			if ("value" in changedProperties) {
				this.$value = changedProperties["value"];
			}
			
			if ("info" in changedProperties) {
				this.$info = changedProperties["info"];
			}
			
			if ("color" in changedProperties) {
				this.$color = changedProperties["color"];
			}
			
			this.render(this.$value, this.$info, this.$color);
		}
	}
	
	customElements.define("com-demo-echarts-gauge", EChartsGauge);
})();
