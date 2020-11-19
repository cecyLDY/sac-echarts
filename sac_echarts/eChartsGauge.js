(function() { 
	let shadowRoot;
	const ehcartjs = "https://github.com/sucrez/sac-echarts/echarts.min.js";
	function loadScript(src) {
		return new Promise(function(resolve, reject) {
			let script = document.createElement("script");
			script.src = src;
			script.onload = () => {console.log("Load: " + src); resolve(script);}
			script.onerror = () => reject(new Error(`Script load error for ${src}`));

			shadowRoot.appendChild(script)
		});
	}
	let template = document.createElement("template");

	template.innerHTML = `
    <style>
    :host {
        display: block;
    } 
    </style> 
    
	`;

	function draw() {

	}

	class EChartsGauge extends HTMLElement {
		constructor() {
			super(); 
			shadowRoot = this.attachShadow({mode: "open"});
			shadowRoot.appendChild(template.content.cloneNode(true));
			this._firstConnection = 0;
			this.addEventListener("click", event => {
				var event = new Event("onClick");
				this.dispatchEvent(event);
			});
			
			this._props = {};
		}
		
		render(id, div) {
            
            let myChart = echarts.init(document.getElementById(id), null, {renderer: 'svg'});
            myChart.setOption({
				xAxis: {
					type: 'category',
					data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
				},
				yAxis: {
					type: 'value'
				},
				series: [{
					data: [820, 932, 901, 934, 1290, 1330, 1320],
					type: 'line'
				}]
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
			if (this._firstConnection === 0) {
				const div = document.createElement("div");
				let divid = changedProperties.widgetName;
				this._tagContainer = divid;
				div.innerHTML = '<div id="container_' + divid + '"></div>';
				shadowRoot.appendChild(div);

				const css = document.createElement('div');
                css.innerHTML = '<style>#container_' + divid + ' {width: 100%; height: 500px;}</style>';
				shadowRoot.appendChild(css);
				
				let mapcanvas_divstr = shadowRoot.getElementById("container_" + divid);

				async function LoadLibs() {
					try {
						await loadScript(ehcartjs);
					} catch (e) {

					} finally {
						render(divid, mapcanvas_divstr);
					}
				}
				LoadLibs();
			} else {
				
			}
			//this.render(this.$value, this.$info, this.$color);
		}
	}
	
	customElements.define("com-demo-echarts-gauge", EChartsGauge);
})();
