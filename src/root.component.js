import React, { useEffect, useState } from "react"
import "./index.css"
import { useGlobalStore } from "@mfe/utils"
import { useStore } from "zustand"

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

const Details = () => {
	const useBoundStore = (selector) => useStore(useGlobalStore, selector)
	const { theme, selectedCity, fetchWeatherData } = useBoundStore(
		(state) => state
	)
	const [days, setDays] = useState([])

	useEffect(() => {
		if (selectedCity) {
			fetchWeatherData(selectedCity).then((data) =>
				setDays(data.forecast.forecastday)
			)
		}
		return () => {
			setDays([])
		}
	}, [selectedCity, fetchWeatherData])

	return (
		<div className={`forecast_container forecast_container_${theme}`}>
			{selectedCity && days.length && (
				<>
					<h2 className={`details_title_${theme}`}>Details</h2>
					<div className="details_cards_container">
						{days.map((forecast, index) => (
							<ForecastDay forecast={forecast} key={`forecast_${index}`} />
						))}
					</div>
				</>
			)}
		</div>
	)
}

export default Details
