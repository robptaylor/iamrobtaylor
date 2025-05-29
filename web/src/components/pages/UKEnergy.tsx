import { useState, useEffect } from 'react'
import './UKEnergy.css';

import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

import BarChart from "../charts/BarChart";
import DoughnutChart from '../charts/DoughnutChart';
import LineChart from '../charts/LineChart';

import { Anchor, Tabs, TabsProps } from "antd";

import { Emissions, Generation, Prices } from 'components/pages/UKEnergyAPI'

const TabPane = Tabs;

Chart.register(CategoryScale);

interface Props {
    getGenerationPctLatest(): Promise<Generation>
    getGenerationPctLast24h(): Promise<Generation>
    getGenerationGWLast24h(): Promise<Generation>
    getPriceLast24h(): Promise<Prices>
    getPriceLastWeek(): Promise<Prices>
    getEmissionsLast24h(): Promise<Emissions>
    getEmissionsLastWeek(): Promise<Emissions>
} 

function UKEnergy(props: Props) {
    const emptyChart = (label: string) => {
        return {
            labels: [] as string[],
            datasets: [{
                label: label,
                data: [] as number[],
                backgroundColor: [] as string | string[],
            }]
        };
    }

    const [generationPctLast24h, setGenerationPctLast24h] = useState(emptyChart('Last 24h %'));
    const [generationPctLatest, setGenerationPctLatest] = useState(emptyChart('Latest %'));
    const [generationGWLast24h, setGenerationGWLast24h] = useState(emptyChart('Last 24h GW'));
    const [generationLatestTitle, setGenerationLatestTitle] = useState('');
    const [priceLast24h, setPriceLast24h] = useState(emptyChart('Last 24h'));
    const [priceLastWeek, setPriceLastWeek] = useState(emptyChart('Last Week'));
    const [emissionsLast24h, setEmissionsLast24h] = useState(emptyChart('Last 24h'));
    const [emissionsLastWeek, setEmissionsLastWeek] = useState(emptyChart('Last Week'));

    const dateToTimeLabel = (d: Date): string => {
        return `${padTimeDigit(d.getHours())}:${padTimeDigit(d.getMinutes())}`;
    };

    const dateToDateTimeLabel = (d: Date): string => {
        return `${d.getDate()}/${d.getMonth()} ${padTimeDigit(d.getHours())}:${padTimeDigit(d.getMinutes())}`;
    };

    const colors: Map<string, string> = new Map([
        ['biomass', '#6E260E'],
        ['coal', 'black'],
        ['imports', '#702963'],
        ['gas', '#ec644b'],
        ['nuclear', '#92b6f0'],
        ['other', 'gray'],
        ['hydro', '#48D1CC'],
        ['solar', '#FAFA33'],
        ['wind', '#90EE90'],
    ]);

    const getColor = (fuel: string):string => colors.get(fuel) ?? 'red'; 

    const getGenerationPctLatestData = (gens: Generation) => {
        const labels: string[] = [];
        const vals: number[] = [];
        const backgroundColor: string[] = [];
    
        gens.fuels.forEach(g => {
            const fuel = g.fuel;
            const val = g.vals[0];

            labels.push(fuel);
            vals.push(val);
            backgroundColor.push(getColor(fuel));
        });
    
        return {
            labels: labels,
            datasets: [
                {
                  label: '%',
                  data: vals,
                  backgroundColor: backgroundColor,
                },
            ],
        };
    }

    const getGenerationPctLast24hData = (gens: Generation) => {
        const datasets = gens['fuels'].map(x => {
            return {
                label: x['fuel'],
                data: x['vals'],
                fill: false,
                borderColor: getColor(x['fuel']),
                backgroundColor: getColor(x['fuel']),
                tension: 0.1,
                barPercentage: 0.5,
                barThickness: 15,
                maxBarThickness: 20,
                minBarLength: 2,
            }
        });
    
        return {
            labels: gens['froms'].map(x => dateToTimeLabel(new Date(x))),
            datasets: datasets
        };
    }

    const getGenerationGWLast24hData = (gens: Generation) => {
        const datasets = gens.fuels.map(x => {
            return {
                label: x.fuel,
                data: x.vals,
                backgroundColor: getColor(x.fuel),
            }
        });
    
        return {
            labels: gens['froms'].map(x => dateToTimeLabel(new Date(x))),
            datasets: datasets
        };
    }

    const getPriceData = (prices: Prices, dateToLabel: (d: Date) => string) => {
        return {
            labels: prices.froms.map(x => dateToLabel(new Date(x))),
            datasets: [{
                label: 'price',
                data: prices.vals,
                backgroundColor: 'blue'
            }]
        };
    }

    const getEmissionsData = (emissions: Emissions, dateToLabel: (d: Date) => string) => {
        return {
            labels: emissions.froms.map(x => dateToLabel(new Date(x))),
            datasets: [{
                label: 'emissions',
                data: emissions.vals,
                backgroundColor: 'black'
            }]
        };
    }

    useEffect(() => {
        const bootstrap = async () => {
            const genLatestAPIData = await props.getGenerationPctLatest();

            setGenerationPctLatest(getGenerationPctLatestData(genLatestAPIData));
            setGenerationPctLast24h(getGenerationPctLast24hData(await props.getGenerationPctLast24h()));
            setGenerationGWLast24h(getGenerationGWLast24hData(await props.getGenerationGWLast24h()));
            setPriceLast24h(getPriceData(await props.getPriceLast24h(), dateToTimeLabel));
            setPriceLastWeek(getPriceData(await props.getPriceLastWeek(), dateToDateTimeLabel));
            setEmissionsLast24h(getEmissionsData(await props.getEmissionsLast24h(), dateToTimeLabel));
            setEmissionsLastWeek(getEmissionsData(await props.getEmissionsLastWeek(), dateToDateTimeLabel));

            const genLatestDate = new Date(genLatestAPIData.froms[0]);
            setGenerationLatestTitle(`Latest ${dateToTimeLabel(genLatestDate)}`)
        };

        bootstrap();
    }, []);

    const items: TabsProps['items'] = [
        {
          key: '1',
          label: 'GENERATION',
          children: (
            <section id="generation">
                <div id="generation-body">
                    <div className='generation-gw-last24h-container'>
                        <LineChart 
                            chartClassName='generation-gw-last24h'
                            chartData={generationGWLast24h}
                            title='Last 24h'
                            yTitle={{align: 'center', display: true, text: 'GW'}}
                            minY={0}
                            />
                    </div>
                    <div className='generation-pct-last24h-container'>
                        <BarChart 
                            chartClassName='generation-pct-last24h'
                            chartData={generationPctLast24h}
                            title='Last 24h'
                            yTitle={{align: 'center', display: true, text: '%'}}
                            />
                    </div>
                    <div className='generation-pct-latest-container'>
                        <DoughnutChart chartClassName='generation-pct-latest' chartData={generationPctLatest} title={generationLatestTitle}/>
                    </div>
                </div>
            </section>
          ),
        },
        {
          key: '2',
          label: 'PRICE',
          children: (
            <section id="price">
                <div id="price-body">
                    <div className='price-lastweek-container'>
                        <LineChart
                            chartClassName='price-lastweek' 
                            chartData={priceLastWeek} 
                            title='Last Week'
                            yTitle={{align: 'center', display: true, text: '£/MWh'}}
                            displayLegend={false}/>
                    </div>
                    <div className='price-last24h-container'>
                        <LineChart
                            chartClassName='price-last24h' 
                            chartData={priceLast24h} 
                            title='Last 24h'
                            yTitle={{align: 'center', display: true, text: '£/MWh'}}
                            displayLegend={false}/>
                    </div>
                </div>
            </section>),
        },
        {
            key: '3',
            label: 'EMISSIONS',
            children: (
              <section id="emissions">
                  <div id="emissions-body">
                    <div className='emissions-lastweek-container'>
                        <LineChart
                            chartClassName='emissions-lastweek' 
                            chartData={emissionsLastWeek} 
                            title='Last Week'
                            yTitle={{align: 'center', display: true, text: 'g/kWh'}}
                            displayLegend={false}/>
                      </div>
                      <div className='emissions-last24h-container'>
                        <LineChart
                            chartClassName='emissions-last24h' 
                            chartData={emissionsLast24h} 
                            title='Last 24h'
                            yTitle={{align: 'center', display: true, text: 'g/kWh'}}
                            displayLegend={false}/>
                      </div>
                  </div>
              </section>),
          },
      ];

    return (
        <div id="page">
            <Tabs defaultActiveKey="1" items={items}/>
            <div className="acknowledgement">This page was inspired by <a href="https://grid.iamkate.com">Kate Morley's site</a> with the underlying data coming from <a href="https://bmrs.elexon.co.uk/">Elexon Insights Solution</a> and <a href="https://carbonintensity.org.uk/">Carbon Intensity API</a>. Contains BMRS data © Elexon Limited copyright and database right 2025. </div>
        </div>
    ) 
}

function padTimeDigit(d: number){
    return (''+d).padStart(2, '0');
}

export default UKEnergy;