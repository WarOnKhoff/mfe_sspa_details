import React, { useEffect, useState, useMemo } from "react"
import "./index.css"
import { useGlobalStore } from "@mfe/utils"
import { useStore } from "zustand"
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from "victory"

const ForecastDay = ({ forecast }) => {
	const useBoundStore = (selector) => useStore(useGlobalStore, selector)
	const { theme } = useBoundStore((state) => state)

	const day = new Date(forecast.date).toLocaleDateString("en-US", {
		weekday: "long"
	})

	return (
		<div className={`details_card card_${theme}`}>
			{!forecast && <div>Loading data</div>}
			{forecast && (
				<>
					<div className="details_day_label">{day}</div>
					<div className="details_date_label">{forecast.date}</div>
					<div className="forecast_details">
						<img
							src={forecast.day.condition.icon}
							className="details_weather_img"
							alt="weather_logo"
						/>
						<div className="forecast_condition_wrapper">
							<div className="forecast_temperature_label">
								{forecast.day.avgtemp_c}°C
							</div>
							<div className="forecast_condition_text_label">
								{forecast.day.condition.text}
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	)
}

const ForecastChart = ({ forecastData }) => {
	const parsedData = useMemo(() => {
		return forecastData.map((forecast) => {
			// const day = new Date(forecast.date).toLocaleDateString("en-US", {
			// 	weekday: "long"
			// })
			// const averageTemp = forecast.day.avgtemp_c
			return { date: forecast.date, temp: forecast.day.avgtemp_c }
		})
	}, [forecastData])

	return (
		<div
			style={{
				width: "100%",
				height: "250px",
				padding: 10
			}}
		>
			<VictoryChart
				height={200}
				padding={30}
				width={1150}
				// adding the material theme provided with Victory
				theme={VictoryTheme.material}
				domainPadding={30}
			>
				<VictoryAxis
					tickValues={parsedData.map((_, index) => index + 1)}
					tickFormat={parsedData.map(({ date }) => date)}
				/>
				<VictoryAxis dependentAxis tickFormat={(x) => `${x}°C`} />
				<VictoryBar data={parsedData} x="date" y="temp" />
			</VictoryChart>
		</div>
	)
}

const Details = () => {
	const useBoundStore = (selector) => useStore(useGlobalStore, selector)
	const { theme, selectedCity, fetchWeatherData } = useBoundStore(
		(state) => state
	)
	const [days, setDays] = useState([])
	const [selectedOption, setSelectedOption] = useState("chart")

	useEffect(() => {
		if (selectedCity) {
			fetchWeatherData(selectedCity).then((data) => {
				if (selectedOption === "cards") {
					const fiveDaysForecast = [...data.forecast.forecastday].splice(0, 5)
					console.log("fiveDaysForecast", fiveDaysForecast)
					setDays(fiveDaysForecast)
				} else {
					setDays(data.forecast.forecastday)
				}
			})
		}
		return () => {
			setDays([])
		}
	}, [selectedCity, fetchWeatherData, selectedOption])

	const cardsList = useMemo(() => {
		return days.map((forecast, index) => (
			<ForecastDay forecast={forecast} key={`forecast_${index}`} />
		))
	}, [days])

	return (
		<div className={`forecast_container forecast_container_${theme}`}>
			{selectedCity && days.length && (
				<>
					<div style={{ display: "flex", alignItems: "center" }}>
						<h2
							className={`details_title_${theme}`}
							style={{ marginRight: 50 }}
						>
							Details
						</h2>
						<fieldset
							style={{
								display: "flex",
								// width: 200,
								justifyContent: "space-between"
							}}
						>
							<legend>Select details view:</legend>
							<div>
								<input
									type="radio"
									id="chart"
									name="drone"
									value="chart"
									onClick={() => setSelectedOption("chart")}
									checked={selectedOption === "chart"}
								/>
								<label for="chart">chart</label>
							</div>
							<div>
								<input
									type="radio"
									id="cards"
									name="drone"
									value="cards"
									onClick={() => setSelectedOption("cards")}
									checked={selectedOption === "cards"}
								/>
								<label for="cards">cards</label>
							</div>
						</fieldset>
					</div>
					{selectedOption === "cards" && (
						<div className="details_cards_container">{cardsList}</div>
					)}
					{selectedOption === "chart" && <ForecastChart forecastData={days} />}
				</>
			)}
		</div>
	)
}

export default Details
