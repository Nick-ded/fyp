import React from 'react'
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']

function Charts({ facialMetrics, speechMetrics }) {
  // Debug: Log the metrics
  console.log('Facial Metrics:', facialMetrics)
  console.log('Speech Metrics:', speechMetrics)

  // Check if metrics exist
  if (!facialMetrics || !speechMetrics) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
        No metrics data available
      </div>
    )
  }

  // Prepare facial metrics data for pie chart
  const facialData = [
    { name: 'Eye Contact', value: parseFloat((facialMetrics.eye_contact_score * 100).toFixed(1)) },
    { name: 'Head Stability', value: parseFloat((facialMetrics.head_stability_score * 100).toFixed(1)) },
    { name: 'Smile', value: parseFloat((facialMetrics.smile_score * 100).toFixed(1)) },
    { name: 'Face Presence', value: parseFloat((facialMetrics.face_presence_percentage * 100).toFixed(1)) },
  ]

  // Prepare speech metrics data for bar chart
  const speechData = [
    { 
      name: 'Speech Rate', 
      value: parseFloat(speechMetrics.speech_rate.toFixed(1)),
      optimal: 140,
      unit: 'WPM'
    },
    { 
      name: 'Filler %', 
      value: parseFloat(speechMetrics.filler_percentage.toFixed(1)),
      optimal: 3,
      unit: '%'
    },
    { 
      name: 'Energy', 
      value: parseFloat((speechMetrics.energy_stability * 100).toFixed(1)),
      optimal: 80,
      unit: '%'
    },
  ]

  console.log('Facial Data for Chart:', facialData)
  console.log('Speech Data for Chart:', speechData)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Facial Metrics Pie Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Facial Metrics</h3>
        
        {/* Debug: Show raw values */}
        <div className="mb-4 p-3 bg-gray-50 rounded text-sm">
          <p><strong>Eye Contact:</strong> {(facialMetrics.eye_contact_score * 100).toFixed(1)}%</p>
          <p><strong>Head Stability:</strong> {(facialMetrics.head_stability_score * 100).toFixed(1)}%</p>
          <p><strong>Smile:</strong> {(facialMetrics.smile_score * 100).toFixed(1)}%</p>
          <p><strong>Face Presence:</strong> {(facialMetrics.face_presence_percentage * 100).toFixed(1)}%</p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={facialData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {facialData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Speech Metrics Bar Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Speech Metrics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={speechData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value, name, props) => [
                `${value} ${props.payload.unit}`,
                name
              ]}
            />
            <Legend />
            <Bar dataKey="value" fill="#3B82F6" name="Actual" />
            <Bar dataKey="optimal" fill="#10B981" name="Optimal" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Charts
