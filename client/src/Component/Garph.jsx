
import * as React from 'react';
import { useEffect } from 'react';
import { ChartComponent, SeriesCollectionDirective, Highlight, SeriesDirective, Inject, Tooltip, DateTime, SplineAreaSeries, Legend } from '@syncfusion/ej2-react-charts';
import { Browser, registerLicense } from '@syncfusion/ej2-base';
import { ContextApi } from '../Context/ContextApi';
import { useParams } from 'react-router-dom';

const SAMPLE_CSS = `
    .control-fluid {
        padding: 0px !important;
        width:100%
    }`;

/**
 * SplineArea component to display chart data
 */
const SplineArea = ({data}) => {
    console.log(data);
    // const { getChartDataByCoinId } = React.useContext(ContextApi);
    // const { id } = useParams();

    // useEffect(() => {
    //     const fetchCoin = async () => {
    //         try {
    //             const response = await getChartDataByCoinId(id);
    //             const coinChartData = response.data;
                
    //             // Transform the API data to fit the chart's format
    //             const transformedData = coinChartData.map(item => ({
    //                 x: new Date(item.timestamp * 1000), // Convert Unix timestamp to JavaScript Date
    //                 y: item.price // Use price for y-axis
    //             }));
                
    //             // Check data format and log for debugging
    //             // console.log('Transformed Data:', transformedData);
                
    //             setData(transformedData);
    //         } catch (error) {
    //             console.error('Error fetching coin chart data:', error);
    //         }
    //     };

    //     fetchCoin();
    // }, [id, getChartDataByCoinId]);

    registerLicense('Ngo9BigBOggjHTQxAR8/V1NCaF1cWWhIfkxzWmFZfVpgcF9HaVZSRGY/P1ZhSXxXdkxjXH5YcX1WR2JZV0c=');

    const onChartLoad = (args) => {
        let chart = document.getElementById('charts');
        chart.setAttribute('title', '');
    };

    const load = (args) => {
        let selectedTheme = location.hash.split('/')[1];
        selectedTheme = selectedTheme ? selectedTheme : 'Material';
        args.chart.theme = (selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1))
            .replace(/-dark/i, "Dark")
            .replace(/contrast/i, 'Contrast')
            .replace(/-highContrast/i, 'HighContrast');
    };

    return (
        <div className="control-pane  !w-full">
            <style className='!w-full'>{SAMPLE_CSS}</style>

            <div className="control-section" style={{ color: 'purple', width: '100%', textAlign: 'center' }}>
                <ChartComponent
                    className='!w-full'
                    id="charts"
                    primaryXAxis={{
                        valueType: 'DateTime',
                        labelFormat: 'y',
                        majorGridLines: { width: 0 },
                        intervalType: 'Years',
                        minimum: data.length > 0 ? new Date(Math.min(...data.map(d => d.x))) : new Date(),
                        maximum: data.length > 0 ? new Date(Math.max(...data.map(d => d.x))) : new Date(),
                        edgeLabelPlacement: 'Shift'
                    }}
                    primaryYAxis={{
                        labelFormat: '{value}',
                        lineStyle: { width: 0 },
                        maximum: data.length > 0 ? Math.max(...data.map(d => d.y)) * 1.2 : 10,
                        interval: data.length > 0 ? (Math.max(...data.map(d => d.y)) * 1.2) / 5 : 1,
                        majorTickLines: { width: 0 },
                        minorTickLines: { width: 0 }
                    }}
                    load={load.bind(this)}
                    width={Browser.isDevice ? '100%' : '100%'}
                    height={Browser.isDevice ? '100%' : '75%'}
                    legendSettings={{ enableHighlight: true }}
                    chartArea={{ border: { width: 0 } }}
                    title="Coin Price Over Time"
                    loaded={onChartLoad.bind(this)}
                    tooltip={{ enable: true }}
                >
                    <Inject services={[SplineAreaSeries, DateTime, Tooltip, Legend, Highlight]} />
                    <SeriesCollectionDirective>
                        <SeriesDirective
                            dataSource={data}
                            xName="x"
                            yName="y"
                            name="Coin Price"
                            marker={{
                                visible: true,
                                isFilled: true,
                                height: 7,
                                width: 7,
                                shape: 'Diamond'
                            }}
                            opacity={0.5}
                            type="SplineArea"
                            width={2}
                            border={{ width: 2 }}
                        />
                    </SeriesCollectionDirective>
                </ChartComponent>
            </div>
        </div>
    );
};

export default SplineArea;

