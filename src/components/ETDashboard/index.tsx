import React, { useEffect, useState } from 'react'
import './index.css'
import apis from 'apis'
import {
  convertKeys,
  createQuery,
  initChartData,
} from 'utils/function'
import ProdPerformanceFilters from './ProdPerformanceFilters'
import SectionInfo from './Components/SectionInfo'
import moment from 'moment'
import { Line } from 'react-chartjs-2'
import { CategoryScale } from 'chart.js'
import Chart from 'chart.js/auto'
import { useSelector } from 'react-redux'
import { RootState } from 'app/store'
import { IDropdownItem } from 'data/wl-types'
import SingleSelect from 'components/SingleSelect'
import CustomDateRangePicker, {
  IDateState,
} from 'components/CustomDateRangePicker'

Chart.register(CategoryScale)

interface IChartData {
  date: string
  value: number
}

const Dashboard = () => {
  const initData = initChartData(
    moment(new Date()).startOf('isoWeeks').format('YYYY-MM-DD'),
    moment(new Date()).format('YYYY-MM-DD')
  )
  const [totalInfo, setTotalInfo] = useState({
    pageViews: 0,
    votes: 0,
    orders: 0,
    grossSales: 0,
  })
  const [typeChart, setTypeChart] = useState('votes')
  const [datePicker, setDatePicker] = useState<IDateState>({
    startDate: new Date(
      moment(new Date()).startOf('isoWeeks').format('YYYY/MM/DD')
    ),
    endDate: new Date(moment(new Date()).format('YYYY/MM/DD')),
  })
  const [chartData, setChartData] = useState<IChartData[]>([])
  const [chartJs, setChartJs] = useState({
    labels: initData.map((data) => data.date),
    datasets: [
      {
        label: typeChart,
        data: initData.map((data) => data.value),
        backgroundColor: ['#e1fef9'],
        borderColor: 'rgb(193,245,244)',
        borderWidth: 3,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 3,
        pointHoverBorderWidth: 5,
      },
    ],
  })
  const user = useSelector((state: RootState) => state.user.user)
  const [products, setProducts] = useState<IDropdownItem[]>([])
  const [productId, setProductId] = useState<IDropdownItem>({
    id: 0,
    name: 'All products',
  })

  const handleGetTotalStatical = () => {
    apis
      .post('dashboard/dashboard-total', {
        data: {
          startDate: moment(datePicker?.startDate).format('YYYYMMDD'),
          endDate: moment(datePicker?.endDate).format('YYYYMMDD'),
          productId: productId.id,
        },
      })
      .then((res) => {
        setTotalInfo(convertKeys(res.data.data))
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleGetChart = () => {
    apis
      .post('dashboard/dashboard-chart', {
        data: {
          startDate: datePicker?.startDate,
          endDate: datePicker?.endDate,
          keys: typeChart,
          productId: productId.id,
        },
      })
      .then((res) => {
        setChartData(convertKeys(res.data.data))
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleGetProducts = () => {
    if (user.id) {
      apis
        .get(
          'wl-products',
          createQuery({
            fields: ['name'],
            filters: {
              member_id: user.id,
            },
          })
        )
        .then((res) => {
          setProducts(
            convertKeys(res.data.data).reduce((acc: any[], item: any) => {
              acc.push({
                id: item.id,
                name: item.attributes.name,
              })
              return acc
            }, [])
          )
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  useEffect(() => {
    handleGetTotalStatical()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datePicker, productId])

  useEffect(() => {
    handleGetChart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datePicker, typeChart, productId])

  useEffect(() => {
    handleGetProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (chartData.length > 0) {
      setChartJs({
        labels: chartData.map((data) => data.date),
        datasets: [
          {
            label: typeChart,
            data: chartData.map((data) => data.value),
            backgroundColor: ['#e1fef9'],
            borderColor: 'rgb(193,245,244)',
            borderWidth: 3,
            fill: true,
            pointRadius: 3,
            pointHoverRadius: 3,
            pointHoverBorderWidth: 5,
          },
        ],
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData])

  useEffect(() => {
    document.title = 'ET Wishlist | Brand Dashboard'
  }, [])

  let today = new Date()
  let lastWeek = new Date(today)
  lastWeek.setDate(today.getDate() - 7)
  let firstDayOfLastWeek = new Date(lastWeek)
  firstDayOfLastWeek.setDate(lastWeek.getDate() - lastWeek.getDay() + 1)

  return (
    <main className="w-full px-10 py-7">
      <div className="flex w-full items-end justify-between">
        <div>
          <span className="text-10 font-bold leading-none tracking-wide text-gray-1150">
            {' '}
            DASHBOARD{' '}
          </span>
          <h1 className="font-[RobotoBold] mt-3 text-xl font-semibold leading-none tracking-tight text-black">
            {' '}
            Overview{' '}
          </h1>
          <h2 className="font-base mt-[11px] leading-none text-gray-1150">
            {' '}
            An overview of your performance on Wishlist.{' '}
          </h2>
        </div>
        <div className="flex items-center flex-1 justify-end space-x-1">
          <SingleSelect
            list={[{ id: 0, name: 'All products' }, ...products]}
            label=""
            placeholder="Select Product"
            value={productId.name}
            onChange={(val) => setProductId(val)}
            position='bottom-right'
          />
          <div className="h-[44px] mt-[12px] flex items-center">
            <CustomDateRangePicker
              onChange={(value) =>
                setDatePicker((prevState) => ({
                  ...prevState,
                  startDate: value.startDate,
                  endDate: value.endDate,
                }))
              }
              startDate={datePicker ? datePicker?.startDate : new Date()}
              endDate={datePicker ? datePicker?.endDate : new Date()}
            />
          </div>
        </div>
      </div>
      <div className="border w-full my-5"></div>
      <div className="flex space-x-[14px]">
        {Object.entries(totalInfo).map(([key, value]) => {
          return (
            <SectionInfo
              key={key}
              label={key.replace(/([a-z])([A-Z])/g, '$1 $2')}
              value={value}
            />
          )
        })}
      </div>
      <div className="border w-full my-5"></div>
      <div className="mb-5 flex w-full items-center justify-between">
        <div>
          <div className="text-xl font-semibold font-[RobotoBold] leading-none tracking-tight text-black">
            {' '}
            Product Performance{' '}
          </div>
          <h2 className="font-base mt-[11px] leading-none text-gray-1150">
            {' '}
            Track your performance on Wishlist – now and over time.{' '}
          </h2>
        </div>

        <ProdPerformanceFilters
          onChange={(val) => setTypeChart(val.id as string)}
        />
      </div>
      <div className="max-h-[350px] w-[99%] max-w-full h-full">
        <Line
          data={chartJs}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
            plugins: {
              tooltip: {
                enabled: true,
                intersect: false,
              },
            },
          }}
        />
      </div>
    </main>
  )
}

export default Dashboard