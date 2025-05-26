import { useState, useEffect } from 'react'
import './App.css';

import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";

import BarChart from "./components/BarChart";
import DoughnutChart from './components/DoughnutChart';
import LineChart from './components/LineChart';

import { Anchor, Tabs, TabsProps } from "antd";
// import rt_logo from "./rt_logo.svg"

import { Generation, Prices } from 'AppAPI'

const TabPane = Tabs;

Chart.register(CategoryScale);

interface Props {
    getGenerationPctLatest(): Promise<Generation>
    getGenerationPctLast24h(): Promise<Generation>
    getGenerationGWLast24h(): Promise<Generation>
    getPriceLast24h(): Promise<Prices>
} 

function App(props: Props) {
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
    const [priceLast24h, setPriceLast24h] = useState(emptyChart('Last 24h'));
    const [generationPctLatest, setGenerationPctLatest] = useState(emptyChart('Latest %'));
    const [generationGWLast24h, setGenerationGWLast24h] = useState(emptyChart('Last 24h GW'));
    const [generationLatestTitle, setGenerationLatestTitle] = useState('');

    const dateToLabel = (d: Date): string => {
        return `${padTimeDigit(d.getHours())}:${padTimeDigit(d.getMinutes())}`;
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
            labels: gens['froms'].map(x => dateToLabel(new Date(x))),
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
            labels: gens['froms'].map(x => dateToLabel(new Date(x))),
            datasets: datasets
        };
    }

    const getPriceLast24hData = (prices: Prices) => {
        return {
            labels: prices.froms.map(x => dateToLabel(new Date(x))),
            datasets: [{
                label: 'price',
                data: prices.vals,
                backgroundColor: 'blue'
            }]
        };
    }

    useEffect(() => {
        const bootstrap = async () => {
            const genLatestAPIData = await props.getGenerationPctLatest();

            setGenerationPctLatest(getGenerationPctLatestData(genLatestAPIData));
            setGenerationPctLast24h(getGenerationPctLast24hData(await props.getGenerationPctLast24h()));
            setGenerationGWLast24h(getGenerationGWLast24hData(await props.getGenerationGWLast24h()));
            setPriceLast24h(getPriceLast24hData(await props.getPriceLast24h()));

            const genLatestDate = new Date(genLatestAPIData.froms[0]);
            setGenerationLatestTitle(`Latest ${dateToLabel(genLatestDate)}`)
        };

        bootstrap();
    }, []);

    const items: TabsProps['items'] = [
        {
          key: '1',
          label: 'Generation',
          children: (
            <section id="generation">
                <div id="generation-body">
                    <div className='generation-gw-last24h-container'>
                        <LineChart chartClassName='generation-gw-last24h' chartData={generationGWLast24h} title='Last 24h GW' minY={0}/>
                    </div>
                    <div className='generation-pct-last24h-container'>
                        <BarChart chartClassName='generation-pct-last24h' chartData={generationPctLast24h} title='Last 24h %'/>
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
          label: 'Price',
          children: (
            <section id="price">
                <div id="price-body">
                    <div className='price-last24h-container'>
                        <LineChart
                            chartClassName='price-last24h' 
                            chartData={priceLast24h} 
                            title='Price per MWh Last 24h'
                            displayLegend={false}/>
                    </div>
                </div>
            </section>),
        },
      ];

    return (
        <div id="page">
            {/* <!--<img className='rt-logo' src={rt_logo}></img> --> */}

            <Anchor className='header'
                direction="horizontal"
                items={[
                {
                    key: 'uk-energy',
                    href: 'uk-energy',
                    title: 'UK Energy',
                },
                {
                    key: 'about',
                    href: 'about',
                    title: 'About',
                },
                ]}
            />


            <Tabs defaultActiveKey="1" items={items}/>
        </div>
    ) 
}

function padTimeDigit(d: number){
    return (''+d).padStart(2, '0');
}

export default App;