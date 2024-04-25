import axios from 'axios';
import { useEffect, useState } from 'react';
import { Table, Card } from 'react-bootstrap';
import logo from '/altcolors5.png'

const VendorMetrics = () => {
	const url = import.meta.env.VITE_URL;
	const [vendorId, setVendorId] = useState('3');
	const [yearlyMetrics, setYearlyMetrics] = useState({});
	const [monthlyMetrics, setMonthlyMetrics] = useState([]);
	const [dailyMetrics, setDailyMetrics] = useState([]);
	const [selectedFilter, setSelectedFilter] = useState('weekly');

	useEffect(() => {
		axios.get(`${url}/vendors/${vendorId}/metrics`).then((res) => {
			setYearlyMetrics(res.data[0].transaction_metrics[0]);
			setMonthlyMetrics(res.data[0].transaction_metrics[0].monthly_variation);
			setDailyMetrics(res.data[0].transaction_metrics[0].monthly_variation);
		});
	}, []);

	const handleFilterChange = (filter) => {
		setSelectedFilter(filter);
	};

	return (
    <div style={{ maxWidth: '400px', maxHeight: '80vh' }}>
			<div
				style={{ maxWidth: '400px', maxHeight: '80vh' }}
			>
				<div className="row" style={{ maxWidth: '400px' }}>
					<div className="col">
						<h1 className='mb-3 ms-3 display-1'>Metrics</h1>
            <hr/>
						<div
							className="card-deck mr-5 sticky-top"
							style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
						>
							<Card
								className="ms-2"
								style={{ width: 'auto', display: 'inline-block' }}
							>
								<Card.Body>
									<Card.Title>
										Total <b style={{ color: '#FF038A' }}>Daily</b> Sales
									</Card.Title>
									<h2 style={{ color: '#FF038A' }}><i className="fa-solid fa-ice-cream me-2"></i>$11,500</h2>
									<Card.Text className="text-muted">
										<sub>Made through <b>525</b> transactions</sub>
									</Card.Text>
								</Card.Body>
							</Card>
							<Card
								className="ms-2"
								style={{ width: 'auto', display: 'inline-block' }}
							>
								<Card.Body>
									<Card.Title>
										Total <b style={{ color: '#FF038A' }}>March </b>Sales
									</Card.Title>
									<h2 style={{ color: '#FF038A' }}><i className="fa-solid fa-ice-cream me-2"></i>$40,000</h2>
									<Card.Text className="text-muted">
										<sub>Made through <b>2,100</b> transactions</sub>
									</Card.Text>
								</Card.Body>
							</Card>
							<Card
								className="ms-2"
								style={{ width: 'auto', display: 'inline-block' }}
							>
								<Card.Body>
									<Card.Title>
										Total <b style={{ color: '#FF038A' }}>YTD</b> Sales
									</Card.Title>
									<h2 style={{ color: '#FF038A' }}><i className="fa-solid fa-ice-cream me-2"></i>
$300,000 </h2> 
									<Card.Text className="text-muted ">
										<sub>Made through <b>15,120</b> transactions</sub>
									</Card.Text>
								</Card.Body>
							</Card>
						</div>
						<hr />
						<div>
        <h3	 className="metrics-error justify-content-center mt-5 d-flex">Advanced Metric View Coming Soon</h3>
		<img src={logo} style={{ width: '100vw', display: 'inline-block' }}
></img>
      </div>
						{/* <div>
							<div className="d-flex gap-3 mb-3 justify-content-center">
								<label>
									<input
										type="radio"
										value="yearly"
										checked={selectedFilter === 'yearly'}
										onChange={() => handleFilterChange('yearly')}
										className="me-1"
									/>
									Yearly
								</label>
								<label>
									<input
										type="radio"
										value="monthly"
										checked={selectedFilter === 'monthly'}
										onChange={() => handleFilterChange('monthly')}
										className="me-1"
									/>
									Monthly
								</label>
								<label>
									<input
										type="radio"
										value="weekly"
										checked={selectedFilter === 'weekly'}
										onChange={() => handleFilterChange('weekly')}
										className="me-1"
									/>
									Weekly
								</label>
								<label>
									<input
										type="radio"
										value="daily"
										checked={selectedFilter === 'daily'}
										onChange={() => handleFilterChange('daily')}
										className="me-1"
									/>
									Daily
								</label>
							</div>

							{selectedFilter === 'yearly' && yearlyMetrics && (
								<div className='ms-2'
									style={{ maxHeight: '215px', overflowY: 'auto', maxWidth:'100vw'}}
								>
									<Table striped bordered hover>
										<thead>
											<tr>
												<th>Year</th>
												<th>Sales</th>
												<th>Transactions</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>{2024}</td>
												<td>${yearlyMetrics.sales}</td>
												<td>{yearlyMetrics.transactions}</td>
											</tr>
										</tbody>
									</Table>
								</div>
							)}
							{selectedFilter === 'monthly' &&
								monthlyMetrics &&
								monthlyMetrics.length > 0 && (
									<table
										className="ms-2 table table-striped"
										style={{ maxHeight: '215px', overflowY: 'auto', whiteSpace: 'nowrap', maxWidth: '365px' }}
									>
										<thead>
											<tr>
												<th>Month</th>
												<th>Day</th>
												<th>Sales</th>
												<th>Transactions</th>
											</tr>
										</thead>
										<tbody>
											{dailyMetrics.map((dayData, index) => (
												<tr key={index}>
													<td>{dayData.month}</td>
													<td>{index + 1}</td>
													<td>${dayData.sales_per_day[index].toFixed(2)}</td>
													<td>{dayData.transactions_per_day[index]}</td>
												</tr>
											))}
										</tbody>
									</table>
								)}

							{selectedFilter === 'weekly' && (
								<div className='ms-3'
									style={{ maxHeight: '400px', maxWidth:'350px', overflowY: 'auto' }}
								>
									<table
										className="table table-striped"
										style={{ maxHeight: '400px', overflowY: 'auto', whiteSpace: 'nowrap' }}
									>
										<thead>
											<tr>
												<th>Month</th>
												<th>Week</th>
												<th>Sales</th>
												<th>Transactions</th>
											</tr>
										</thead>
										<tbody>
											{monthlyMetrics.map((monthData, index) => {
												console.log(monthData)
												const weeksData = [];
												for (
													let i = 0;
													i < Math.ceil(monthData.days / 7);
													i++
												) {
													const startDay = i * 7;
													const endDay = Math.min((i + 1) * 7, monthData.days);
													const sales = monthData.sales_per_day
														.slice(startDay, endDay)
														.reduce((a, b) => a + b, 0);
													const transactions = monthData.transactions_per_day
														.slice(startDay, endDay)
														.reduce((a, b) => a + b, 0);
													weeksData.push({ week: i + 1, sales, transactions });
												}
												return weeksData.map((weekData, idx) => (
													<tr key={idx}>
														{idx === 0 ? (
															<td rowSpan={weeksData.length}>
																{monthData.month}
															</td>
														) : null}
														<td>{weekData.week}</td>
														<td>${weekData.sales.toFixed(2)}</td>
														<td>{weekData.transactions}</td>
													</tr>
												));
											})}
										</tbody>
									</table>
								</div>
							)}

							{selectedFilter === 'daily' && monthlyMetrics.length > 0 && (
								<div className='ms-3'
									style={{maxHeight: '375px', maxWidth:'350px', overflowY: 'auto' }}
								>
									<table
										className="table table-striped"
										style={{ maxHeight: '375px',overflowY: 'auto', whiteSpace: 'nowrap' }}
									>
										<thead>
											<tr>
												<th>Month</th>
												<th>Day</th>
												<th>Sales</th>
												<th>Transactions</th>
											</tr>
										</thead>
										<tbody>
											{monthlyMetrics.map((monthData) =>
												monthData.sales_per_day.map((sales, index) => (
													<tr key={monthData.month + index}>
														<td>{monthData.month}</td>
														<td>{index + 1}</td>
														<td>${sales.toFixed(2)}</td>
														<td>{monthData.transactions_per_day[index]}</td>
													</tr>
												))
											)}
										</tbody>
									</table>
								</div>
							)}
						</div> */}
					</div>
				</div>
			</div>
		</div>
	);
};

export default VendorMetrics;
