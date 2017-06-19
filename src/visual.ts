module powerbi.extensibility.visual {
    import valueFormatter = powerbi.extensibility.utils.formatting.valueFormatter;

    "use strict";
    export class Visual implements visual.IVisual {
        private readonly host: IVisualHost;
        private target: HTMLElement;
        private updateCount: number;
        private model?: Model;

        constructor(options: VisualConstructorOptions) {
            console.log("construct");
            this.host = options.host;
            this.target = options.element;
            this.updateCount = 0;
        }

        public update(options: VisualUpdateOptions) {
            try {
                const model = this.model = visualTransform(options, this.host);
                console.log("model = ", model);
                if (model.value == undefined) {
                    console.log("nothing to see");
                    this.target.innerHTML = "<p />";
                } else {
                    const formatted = model.formatter.format(model.value);
                    const setting = (model.value > 0)
                        ? model.settings.positive
                        : ((model.value < 0) ? model.settings.negative : model.settings.neutral);

                    const text = this.target.ownerDocument.createElement("p");
                    if (setting.show) {
                        text.textContent = `${formatted}${setting.symbol}`;
                        if (setting.color) {
                            text.style.color = setting.color;
                        }
                        text.style.fontSize = `${setting.fontSize}pt`;
                    } else {
                        text.textContent = `${formatted}`;
                    }
                    this.setText(text);
                }
            }
            catch (ex) {
                console.warn(ex);
            }
        }

        private setText(text: HTMLParagraphElement) {
            const current = this.target.firstChild;
            if (current) {
                this.target.replaceChild(text, current);
            } else {
                this.target.appendChild(text);
            }

        }


        /** 
         * This function gets called for each of the objects defined in the capabilities files and allows you to select which of the 
         * objects and properties you want to expose to the users in the property pane.
         * 
         */
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] | VisualObjectInstanceEnumerationObject {
            const settings = this.model && this.model.settings || VisualSettings.getDefault();
            return VisualSettings.enumerateObjectInstances(settings, options);
        }
    }
}