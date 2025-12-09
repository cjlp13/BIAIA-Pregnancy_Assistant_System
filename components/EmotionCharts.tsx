// components/EmotionCharts.tsx (Requires: npm install recharts)
import { format } from "date-fns";
import { 
    BarChart, Bar, LineChart, Line, XAxis, YAxis, 
    CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import type { JournalEntry } from "@/lib/types";

// --- Constants (Imported/Copied from JournalPage) ---
const EMOJI_MAP: Record<string, string> = {
    anger: "😡", disgust: "🤢", fear: "😨", joy: "😃",
    sadness: "😢", surprise: "😲", neutral: "😐",
}

const EMOTION_COLORS: Record<string, string> = {
    joy: "#ec4899",       // Pink-500
    anger: "#ef4444",     // Red-500
    sadness: "#3b82f6",   // Blue-500
    fear: "#f59e0b",      // Amber-500
    surprise: "#6366f1",  // Indigo-500
    disgust: "#10b981",   // Emerald-500
    neutral: "#9ca3af",   // Gray-400
}

// Lighter shade for the gradient stop (approx 20% lighter using HSL/CSS color mixer)
const LIGHTER_EMOTION_COLORS: Record<string, string> = {
    joy: "#fb7185",       // Lighter Pink (Rose-400)
    anger: "#f87171",     // Lighter Red (Red-400)
    sadness: "#60a5fa",   // Lighter Blue (Blue-400)
    fear: "#fbbd23",      // Lighter Amber (Amber-400)
    surprise: "#818cf8",  // Lighter Indigo (Indigo-400)
    disgust: "#34d399",   // Lighter Emerald (Emerald-400)
    neutral: "#a1a1aa",   // Lighter Gray (Gray-400)
}
// -----------------------------------------------------

// Data format required for Recharts
interface DailyEmotionData {
    date: string;
    description: string;
    [key: string]: number | string; // key is emotion name, value is score
}

interface ChartProps {
    data: DailyEmotionData[];
    period: number;
}

// Helper to render custom tooltip content (Enhanced to show all scores)
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const entry = payload[0].payload;
        
        // Prepare list of emotions and scores
        const emotionScores = Object.keys(EMOTION_COLORS)
            .map(key => ({
                key,
                score: entry[key] || 0
            }))
            .sort((a, b) => b.score - a.score); // Sort by score descending

        const topEmotionKey = emotionScores[0]?.key || 'neutral';

        return (
            <div className="bg-white/90 border border-gray-200 p-3 rounded-xl shadow-2xl text-xs max-w-sm backdrop-blur-sm">
                <p className="font-extrabold text-sm mb-1 text-gray-800">{format(new Date(label), "MMM d, yyyy")}</p>
                
                <div className="flex items-center space-x-2 text-sm mb-2 p-1 rounded-md bg-gray-50 border border-gray-100">
                    <span className="font-semibold text-gray-700">Top Feeling:</span> 
                    <span className="font-bold" style={{ color: EMOTION_COLORS[topEmotionKey] }}>
                        {topEmotionKey.toUpperCase()} {EMOJI_MAP[topEmotionKey]} 
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                    {emotionScores.filter(e => e.score > 0).map(({ key, score }) => (
                        <p key={key} className="flex items-center justify-between text-gray-600">
                            <span className="font-medium mr-2">{EMOJI_MAP[key]} {key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                            <span className="font-bold" style={{ color: EMOTION_COLORS[key] }}>
                                {`${(score * 100).toFixed(0)}%`}
                            </span>
                        </p>
                    ))}
                </div>
                <hr className="my-2 border-gray-100" />
                <p className="text-gray-500 italic max-h-16 overflow-hidden text-xs">
                    "{entry.description.substring(0, 80)}..."
                </p>
            </div>
        );
    }
    return null;
};

// Custom Legend for Emojis
const CustomLegend = (props: any) => {
    const { payload } = props;
  
    return (
      <div className="flex flex-wrap justify-center gap-x-4 text-xs font-semibold mt-2">
        {payload.map((entry: any, index: number) => {
            const key = entry.dataKey || entry.value.toLowerCase().split(' ')[0]; // Extract key from name
            const color = entry.color || EMOTION_COLORS[key] || '#000000';

            return (
                <div key={`item-${index}`} className="flex items-center space-x-1 py-1" style={{ color }}>
                    {entry.type === 'line' ? (
                        <svg width="14" height="3" className="mt-[2px]">
                            <line x1="0" y1="1.5" x2="14" y2="1.5" stroke={color} strokeWidth="2" />
                        </svg>
                    ) : (
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
                    )}
                    <span>{EMOJI_MAP[key]} {entry.value}</span>
                </div>
            );
        })}
      </div>
    );
  };


// --- Line Chart: Trend Over Time ---
export const EmotionLineChart: React.FC<ChartProps> = ({ data, period }) => (
    <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
                dataKey="date" 
                tickFormatter={(dateStr) => format(new Date(dateStr), 'MMM dd')} 
                minTickGap={20}
                stroke="#6b7280" // Gray-500
            />
            <YAxis 
                domain={[0, 1]} 
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} 
                stroke="#6b7280"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{ padding: 10 }} />
            
            {/* Focus on core emotions */}
            {/* Using name prop for CustomLegend parsing */}
            <Line type="monotone" dataKey="joy" stroke={EMOTION_COLORS.joy} strokeWidth={2} name={`Joy`} dot={false} />
            <Line type="monotone" dataKey="sadness" stroke={EMOTION_COLORS.sadness} strokeWidth={2} name={`Sadness`} dot={false} />
            <Line type="monotone" dataKey="fear" stroke={EMOTION_COLORS.fear} strokeWidth={2} name={`Fear`} dot={false} />
            <Line type="monotone" dataKey="anger" stroke={EMOTION_COLORS.anger} strokeWidth={2} name={`Anger`} dot={false} />
        </LineChart>
    </ResponsiveContainer>
);

// --- Stacked Bar Chart: Daily Mix ---
export const EmotionStackedBarChart: React.FC<ChartProps> = ({ data, period }) => (
    <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <defs>
                {Object.keys(EMOTION_COLORS).map(key => (
                    <linearGradient key={`gradient-${key}`} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                        {/* Darker color at the bottom (0%) */}
                        <stop offset="0%" stopColor={EMOTION_COLORS[key]} stopOpacity={1}/>
                        {/* Lighter color at the top (100%) */}
                        <stop offset="100%" stopColor={LIGHTER_EMOTION_COLORS[key]} stopOpacity={0.8}/>
                    </linearGradient>
                ))}
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
                dataKey="date" 
                tickFormatter={(dateStr) => format(new Date(dateStr), 'MMM dd')}
                minTickGap={20}
                stroke="#6b7280"
            />
            <YAxis 
                domain={[0, 1]} 
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} 
                stroke="#6b7280"
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Use CustomLegend for Emojis in the legend */}
            <Legend content={<CustomLegend />} layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{ padding: 10 }}/>
            
            {Object.keys(EMOTION_COLORS).map(key => (
                <Bar 
                    key={key} 
                    dataKey={key} 
                    stackId="a" 
                    // Apply the gradient fill here
                    fill={`url(#gradient-${key})`} 
                    name={`${key.charAt(0).toUpperCase() + key.slice(1)}`} // Use name only for CustomLegend parsing
                />
            ))}
        </BarChart>
    </ResponsiveContainer>
);