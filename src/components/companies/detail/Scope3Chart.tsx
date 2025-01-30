import { useState } from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { X, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  getCategoryName,
  getCategoryColor,
  getCategoryFilterColors,
} from '@/lib/constants/emissions'

interface Scope3ChartProps {
  categories: Array<{
    category: number
    total: number
    unit: string
  }>
  className?: string
}

export function Scope3Chart({ categories, className }: Scope3ChartProps) {
  const [excludedCategories, setExcludedCategories] = useState<number[]>([])

  // Calculate total from all categories (including excluded ones)
  const totalAll = categories.reduce((sum, cat) => sum + cat.total, 0)

  const filteredCategories = categories.filter(
    (cat) => !excludedCategories.includes(cat.category),
  )

  const chartData = filteredCategories
    .sort((a, b) => b.total - a.total)
    .map((cat) => ({
      name: getCategoryName(cat.category),
      shortName: getCategoryName(cat.category),
      value: cat.total,
      percentage: (cat.total / totalAll) * 100, // Use total of all categories
      category: cat.category,
      color: getCategoryColor(cat.category),
    }))

  const handleCategoryClick = (category: number) => {
    setExcludedCategories((prev) => [...prev, category])
  }

  const handleCategoryRestore = (category: number) => {
    setExcludedCategories((prev) => prev.filter((id) => id !== category))
  }

  const handleReset = () => {
    setExcludedCategories([])
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-black-1 px-4 py-3 rounded-level-2">
          <Text variant="small" className="text-grey">
            Kategori {data.category}
          </Text>
          <Text variant="large">{data.name}</Text>
          <Text>{Math.round(data.value).toLocaleString()} ton CO₂e</Text>
          <Text className="text-grey">({data.percentage.toFixed(1)}%)</Text>
          <Text variant="small" className="text-blue-2 mt-2">
            Klicka för att filtrera bort
          </Text>
        </div>
      )
    }
    return null
  }

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: any) => {
    const radius = outerRadius * 1.15
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    const anchor = x > cx ? 'start' : 'end'
    const percentage = (percent * 100).toFixed(1)
    const data = chartData[index]

    // Split the category name into words
    const words = data.name.split(' ')
    const firstLine = words.slice(0, 2).join(' ')
    const secondLine = words.slice(2).join(' ')

    return (
      <text
        x={x}
        y={y}
        fill="#878787"
        textAnchor={anchor}
        dominantBaseline="central"
        fontSize={12}
      >
        <tspan x={x} dy="0" fontSize="48" fontWeight="300">
          {Number(percentage).toLocaleString('sv-SE')}
          <tspan fontSize="24" className="text-grey">%</tspan>
        </tspan>
      </text>
    )
  }

  return (
    <div className={cn('bg-black-2 rounded-level-1 p-16', className)}>
      <div className="flex items-center justify-between mb-12">
        <div className="flex-1" />
        {excludedCategories.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Återställ alla
          </Button>
        )}
      </div>

      {excludedCategories.length > 0 && (
        <div className="mb-8 p-4 bg-black-1 rounded-level-2">
          <Text variant="small" className="text-grey">
            Visar {chartData.length} av {categories.length} kategorier.
            Filtrerade kategorier:
          </Text>
          <div className="mt-2 flex flex-wrap gap-2">
            {excludedCategories.map((catId) => {
              const colors = getCategoryFilterColors(catId)
              return (
                <div
                  key={catId}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1 rounded-full text-sm',
                    colors.bg,
                    colors.text,
                  )}
                >
                  <span>{getCategoryName(catId)}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCategoryRestore(catId)
                    }}
                    className={cn(
                      'p-0.5 rounded-full transition-colors',
                      `hover:${colors.bg}`,
                    )}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={120}
              outerRadius={240}
              cornerRadius={0}
              paddingAngle={0}
              dataKey="value"
              nameKey="name"
              label={renderCustomizedLabel}
              labelLine={false}
              onClick={(entry) => handleCategoryClick(entry.category)}
              className="cursor-pointer"
            >
              {chartData.map((entry, index) => {
                // Use different color sets for different types of categories
                let color = 'var(--blue-2)' // Default color
                if (entry.category <= 4) {
                  // Upstream categories 1-4
                  color = index % 2 === 0 ? 'var(--orange-2)' : 'var(--orange-3)'
                } else if (entry.category <= 8) {
                  // Upstream categories 5-8
                  color = index % 2 === 0 ? 'var(--pink-2)' : 'var(--pink-3)'
                } else {
                  // Downstream categories 9-15
                  color = index % 2 === 0 ? 'var(--blue-2)' : 'var(--blue-3)'
                }
                return (
                  <Cell
                    key={`cell-${entry.category}`}
                    fill={color}
                    strokeWidth={0}
                  />
                )
              })}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
