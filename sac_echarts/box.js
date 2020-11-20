(function() { 
	let shadowRoot;
	const ehcartjs = "https://sucrez.github.io/sac-echarts/sac_echarts/echarts.min.js";
	function loadScript(src) {
		return new Promise(function(resolve, reject) {
			let script = document.createElement("script");
			script.src = src;
			script.onload = () => {console.log("Load: " + src); resolve(script);}
			script.onerror = () => reject(new Error(`Script load error for ${src}`));

			shadowRoot.appendChild(script)
		});
	}

	function render(id, div) {
            
		let myChart = echarts.init(div);
		myChart.setOption({
			title: {
				text: 'ECharts 入门示例'
			},
			tooltip: {},
			legend: {
				data:['销量']
			},
			xAxis: {
				data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
			},
			yAxis: {},
			series: [{
				name: '销量',
				type: 'bar',
				data: [5, 20, 36, 10, 10, 20]
			}]
		});
	}
	let template = document.createElement("template");

	template.innerHTML = `
    <style type="text/css>
    :host {
        display: block;
    } 
    </style> 
    
	`;
	class Box extends HTMLElement {
		constructor() {
			console.log("constructor");
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
		
		
		  
		onCustomWidgetBeforeUpdate(changedProperties) {
			console.log("onCustomWidgetBeforeUpdate");
			this._props = { ...this._props, ...changedProperties };
		}

		onCustomWidgetAfterUpdate(changedProperties) {
			console.log("onCustomWidgetAfterUpdate");
			if ("value" in changedProperties) {
				this.$value = changedProperties["value"];
			}
			
			if ("info" in changedProperties) {
				this.$info = changedProperties["info"];
			}
			
			if ("color" in changedProperties) {
				this.$color = changedProperties["color"];
			}
			console.log("firsttime: " + this._firstConnection);

			if (this._firstConnection === 0) {
				const div = document.createElement("div");
				let divid = changedProperties.widgetName;
				this._tagContainer = divid;
				div.innerHTML = `<div id="container${divid}" style="width: 600px;height:400px;"></div>`;
				shadowRoot.appendChild(div);

				// const css = document.createElement('div');
                // css.innerHTML = '<style>#container_' + divid + ' {width: 100%; height: 500px;}</style>';
				// shadowRoot.appendChild(css);
				
				let mapcanvas_divstr = shadowRoot.getElementById("container_" + divid);
				console.log(mapcanvas_divstr);
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
				console.log("firsttime: " + this._firstConnection);
			}
			//this.render(this.$value, this.$info, this.$color);
		}
	}
	
	customElements.define("com-echarts-gauge", Box);
})();
