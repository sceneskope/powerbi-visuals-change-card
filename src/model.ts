module powerbi.extensibility.visual {
    "use strict";
    import valueFormatter = powerbi.extensibility.utils.formatting.valueFormatter;
    import IValueFormatter = powerbi.extensibility.utils.formatting.IValueFormatter;

    export interface Model {
        value?: number;
        formatter?: IValueFormatter;
        settings: VisualSettings;
    }

    export function visualTransform(options: VisualUpdateOptions, host: IVisualHost) : Model {
        if (!options
        || !options.dataViews
        || !options.dataViews[0]
        || !options.dataViews[0].single) {
            return {
                settings: VisualSettings.getDefault() as VisualSettings
            };
        }

        const dataView = options.dataViews[0];
        const settings = VisualSettings.parse<VisualSettings>(dataView);
        const value = dataView.single.value as number;
        const single = isNaN(value) ? undefined : value;
        const formatter = valueFormatter.create({
            format: valueFormatter.getFormatStringByColumn(dataView.metadata.columns[0])
        });

        return {
            value: single,
            settings: settings,
            formatter: formatter
        };
    }

}
