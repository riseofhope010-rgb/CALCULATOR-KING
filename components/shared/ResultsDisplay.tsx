'use client'

import { ReactNode } from 'react'
import { FileText } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid } from 'recharts'

interface ResultsDisplayProps {
  title: string
  mainResult?: { label: string; value: string | number; subtext?: string }
  cards?: { label: string; value: string | number; color?: string }[]
  pieData?: { name: string; value: number; color: string }[]
  barData?: { name: string; value: number; fill?: string }[]
  lineData?: { name: string; value: number }[]
  tableData?: { headers: string[]; rows: (string | number)[][] }
  children?: ReactNode
}

const COLORS = ['#2563EB', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']

export default function ResultsDisplay({
  title,
  mainResult,
  cards,
  pieData,
  barData,
  lineData,
  tableData,
  children,
}: ResultsDisplayProps) {
  return (
    <div className="space-y-6">
      <h2 className="section-title">{title}</h2>

      {/* Main Result Card */}
      {mainResult && (
        <div className="results-card">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{mainResult.label}</p>
          <p className="text-4xl md:text-5xl font-bold text-primary mb-2">{mainResult.value}</p>
          {mainResult.subtext && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{mainResult.subtext}</p>
          )}
        </div>
      )}

      {/* Result Cards */}
      {cards && cards.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((card, index) => (
            <div
              key={index}
              className="card hover:shadow-lg transition-all duration-200 hover:scale-102"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                {card.label}
              </p>
              <p
                className="text-xl md:text-2xl font-bold"
                style={{ color: card.color || '#2563EB' }}
              >
                {card.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Charts Row */}
      {(pieData || barData) && (
        <div className={`grid gap-6 ${pieData && barData ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Pie Chart */}
          {pieData && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Distribution
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      animationDuration={800}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Bar Chart */}
          {barData && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Comparison
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="#2563EB"
                      animationDuration={800}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Line Chart */}
      {lineData && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Trend Over Time
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563EB"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Table */}
      {tableData && (
        <div className="card overflow-x-auto">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Detailed Breakdown
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {tableData.headers.map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`px-4 py-3 text-gray-600 dark:text-gray-400 ${
                        cellIndex === 0 ? 'font-medium' : ''
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {children}
    </div>
  )
}
