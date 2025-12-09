"use client"

import type React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"
import { useSupabaseAuth } from "@/components/providers/supabase-auth-provider"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalendarIcon, Plus, Edit, Trash2, LineChart, LayoutGrid, Brain, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { JournalEntry } from "@/lib/types"

// Assume EmotionLineChart and EmotionStackedBarChart are imported from your new file
import { EmotionLineChart, EmotionStackedBarChart } from "@/components/EmotionCharts"

type Profile = {
  name: string
  due_date: string
  symptoms: string[]
  allergies: string[]
}
// --- Constants ---
const EMOJI_MAP: Record<string, string> = {
  anger: "😡",
  disgust: "🤢",
  fear: "😨",
  joy: "😃",
  sadness: "😢",
  surprise: "😲",
  neutral: "😐",
}
const EMOTION_KEYS = Object.keys(EMOJI_MAP);

// --- Interfaces for Typing ---
interface DailyEmotionData {
    date: string;
    description: string;
    [key: string]: number | string;
}

interface CalculatedAnalysisResult {
    dailyChartData: DailyEmotionData[];
    coreInsights: string[];
    topEmotion: string;
    totalEntries: number;
}

interface AiInsight {
    ai_advice: string;
    // NEW: We'll store the period hash to know when to force a refresh
    dataHash: string;
}


export default function JournalPage() {
  const { user } = useSupabaseAuth()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date>(new Date())
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [aiInsight, setAiInsight] = useState<AiInsight | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null);

  // State for time range selection
  const [timePeriod, setTimePeriod] = useState<number>(7); // Default to 7 days

  // NEW: State to visually indicate AI refresh is needed
  const [needsRefresh, setNeedsRefresh] = useState(true);


  useEffect(() => {
    fetchEntries()
  }, [user])

  // MARK: Fetch Journal Entries
  const fetchEntries = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
      if (error) throw error
      setEntries(data as JournalEntry[])
      // Setting needsRefresh to true after a successful entry fetch
      setNeedsRefresh(true);
    } catch (error: any) {
      console.error("Error fetching journal entries:", error.message)
    } finally {
      setIsLoading(false)
    }
  }
  

useEffect(() => {
  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      setProfile(data as Profile);
    } catch (err: any) {
      console.error("Error fetching profile:", err.message);
    }
  };

  fetchProfile();
}, [user]);


// MARK: Fetch AI Insights (Manual Trigger)
const fetchAiInsights = useCallback(async (entryData: DailyEmotionData[], topEmotion: string, periodText: string, currentDataHash: string) => {
    if (entryData.length === 0 || isAiLoading) return setAiInsight(null);

    setIsAiLoading(true);
    // Clear any previous error messages related to the save/fetch
    setError(null);

    try {
        const payload = {
        entries: entryData,
        topEmotion,
        timePeriod: periodText,
        profile: profile ? {
            name: profile.name,
            due_date: profile.due_date,
            symptoms: profile.symptoms,
            allergies: profile.allergies,
        } : null,
        };
        console.log("AI API REQUEST PAYLOAD:", payload);

        const res = await fetch("/api/ai-insights", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        console.log("AI API RESPONSE DATA (Raw):", data);

        if (res.status !== 200) {
            // Display API error message to the user
            setError(data.error || `Failed to fetch AI insights (Status: ${res.status}).`);
            throw new Error(data.error || "Failed to fetch AI insights.");
        }

        // Success: Store the insight and the data hash used to generate it
        setAiInsight({ ai_advice: data.ai_insight || "Sorry, I couldn't generate advice this time.", dataHash: currentDataHash });
        setNeedsRefresh(false); // Insights are now up to date

    } catch (error) {
        console.error("Error fetching AI insights:", error);
        // If an error wasn't already set from the server response
        if (!error) setError("An unexpected network or server error occurred.");
    } finally {
        setIsAiLoading(false);
    }
}, [isAiLoading]); // isAiLoading dependency is for protection against double-click

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setDate(new Date())
    setEditingEntry(null)
  }

  const handleOpenDialog = (entry?: JournalEntry) => {
    if (entry) {
      setTitle(entry.title)
      setDescription(entry.description)
      setDate(new Date(entry.date))
      setEditingEntry(entry)
    } else {
      resetForm()
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    resetForm()
  }

  // MARK: Handle Entry Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError("You must be logged in to create a journal entry")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch("/api/sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: description }),
      })
      const sentimentData = await res.json()

      if (res.status !== 200) {
        setError(sentimentData.error || "Failed to analyze sentiment. Please check API Key/server logs.")
        setIsLoading(false)
        return
      }

      const entryData = {
          title,
          description,
          date: format(date, "yyyy-MM-dd"),
          sentiment_label: sentimentData.sentiment_label,
          sentiment_scores: sentimentData.sentiment_scores,
      }

      if (editingEntry) {
        const { error } = await supabase
          .from("journal_entries")
          .update(entryData)
          .eq("id", editingEntry.id)
        if (error) throw error
        setSuccess("Journal entry updated successfully")
      } else {
        const { error } = await supabase.from("journal_entries").insert({
          ...entryData,
          user_id: user.id,
        })
        if (error) throw error
        setSuccess("Journal entry created successfully")
      }

      await fetchEntries()
      setNeedsRefresh(true); // Data has changed, insights are stale
      handleCloseDialog()
    } catch (error: any) {
      setError(error.message || "Failed to save journal entry")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!user) return
    try {
      const { error } = await supabase.from("journal_entries").delete().eq("id", id)
      if (error) throw error
      setEntries(entries.filter((entry) => entry.id !== id))
      setDeleteConfirmId(null)
      setNeedsRefresh(true); // Data has changed, insights are stale
      setAiInsight(null); // Clear old insight
    } catch (error: any) {
      console.error("Error deleting journal entry:", error.message)
    }
  }

  // --- Data Processing for Charts and Insights (using useMemo) ---
  const { dailyChartData, coreInsights, topEmotion, totalEntries } = useMemo<CalculatedAnalysisResult>(() => {

    // 1. Filter entries based on timePeriod
    let filteredEntries = entries;
    if (timePeriod !== 0) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - timePeriod);
        filteredEntries = entries.filter(entry => new Date(entry.date) >= cutoffDate);
    }

    // Ensure entries are sorted ascending by date for line/bar charts
    const sortedEntries = [...filteredEntries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // 2. Transform data for charts and AI payload
    const chartData: DailyEmotionData[] = sortedEntries.map(entry => {
        const data: DailyEmotionData = {
            date: entry.date,
            description: entry.description,
        };
        EMOTION_KEYS.forEach(key => {
            data[key] = entry.sentiment_scores?.[key] || 0;
        });
        return data;
    });

    // 3. Calculate pooled average for insights (using the filtered set)
    const avgScores: Record<string, number> = {};
    EMOTION_KEYS.forEach((key) => {
        avgScores[key] =
            filteredEntries.reduce((sum, entry) => sum + (entry.sentiment_scores?.[key] || 0), 0) /
            Math.max(filteredEntries.length, 1);
    });
    const sortedEmotions = Object.entries(avgScores).sort((a,b) => b[1]-a[1]);
    const topEmotionResult = sortedEmotions[0]?.[0] || "neutral";

    // 4. Generate Structured Insights (The fixed, non-AI parts)
    const insightPoints: string[] = [];
    const periodDisplay = timePeriod === 0 ? 'all time' : `the last **${timePeriod} days**`;

    // Insight Point 1: Dominant Feeling
    insightPoints.push(`Your analysis over ${periodDisplay} shows that your **dominant feeling** was **${topEmotionResult.toUpperCase()}** ${EMOJI_MAP[topEmotionResult]}.`);

    // Insight Point 2: Second Common Feeling
    if (sortedEmotions.length > 1 && sortedEmotions[1][1] > 0.1) {
        const secondEmotion = sortedEmotions[1][0].toUpperCase();
        insightPoints.push(`The second most common feeling recorded was **${secondEmotion}** ${EMOJI_MAP[secondEmotion.toLowerCase()]}.`);
    }

    return { dailyChartData: chartData, coreInsights: insightPoints, topEmotion: topEmotionResult, totalEntries: filteredEntries.length };
  }, [entries, timePeriod]);

    // Calculate a unique hash based on the current data for the period
    const currentDataHash = useMemo(() => {
        // Simple hash based on entry count and period, enough for this purpose
        return `${totalEntries}-${timePeriod}`;
    }, [totalEntries, timePeriod]);


  if (isLoading && entries.length === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading your journal... ♡</p>
        </div>
      </div>
    )
  }

  // Determine the period display text for the charts
  const periodText = timePeriod === 0 ? "All Time" : `Last ${timePeriod} Days`;

  return (
    // FIX: Added better responsive padding to the main container
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">🤰 Pregnancy Journal with Sentient Dashboard</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> New Entry
        </Button>
      </div>

      {/* FIX: Changed lg:space-x-8 to lg:gap-8 for cleaner layout spacing */}
      <div className="flex flex-col lg:flex-row lg:gap-8">
        {/* === LEFT COLUMN: Journal Entries (50%) === */}
        <div className="w-full lg:w-1/2">
            <h2 className="text-xl font-semibold mb-3">All Entries</h2>
            {/* FIX: Ensure consistent vertical gap for entries */}
            <div className="space-y-4">
            {entries.length > 0 ? (
                entries.map((entry) => (
                <Card key={entry.id}>
                    <CardHeader className="pb-2">
                    {/* FIX: Removed unnecessary wrapper div around CardTitle if it was causing issues. Using flex is correct here. */}
                    <div className="flex items-start justify-between">
                        <CardTitle className="text-lg leading-snug pr-4">{entry.title}</CardTitle>
                        <div className="flex space-x-2 flex-shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(entry)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteConfirmId(entry.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        </div>
                    </div>
                    <CardDescription>{format(new Date(entry.date), "MMMM d, yyyy")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <p className="whitespace-pre-wrap text-sm">{entry.description}</p>
                    {entry.sentiment_scores && (
                        <div className="mt-4">
                        <span className="text-sm font-medium block mb-2">Sentiment Scores:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {EMOTION_KEYS.map((key) => (
                                <span
                                    key={key}
                                    className="rounded-full bg-secondary px-2 py-1 text-xs font-semibold text-secondary-foreground"
                                >
                                    {EMOJI_MAP[key]} {key.charAt(0).toUpperCase() + key.slice(1)} ({((entry.sentiment_scores?.[key] || 0)*100).toFixed(0)}%)
                                </span>
                            ))}
                        </div>
                        </div>
                    )}
                    </CardContent>

                    {deleteConfirmId === entry.id && (
                    <CardFooter className="border-t bg-muted/50 px-6 py-4">
                        <div className="flex w-full items-center justify-between">
                        <p className="text-sm font-medium">Are you sure you want to delete this entry?</p>
                        <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(entry.id)}>Delete</Button>
                        </div>
                        </div>
                    </CardFooter>
                    )}
                </Card>
                ))
            ) : (
                <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="mb-4 text-muted-foreground">No journal entries yet</p>
                    <Button onClick={() => handleOpenDialog()}>
                    <Plus className="mr-2 h-4 w-4" /> Create Your First Entry
                    </Button>
                </CardContent>
                </Card>
            )}
            </div>
        </div>

        {/* === RIGHT COLUMN: Visualization Dashboard / Insights (50%) === */}
        {/* FIX: Added space-y-8 to the right column content for better top/bottom separation */}
        <div className="w-full lg:w-1/2 mt-8 lg:mt-0 space-y-8">
            <h2 className="text-xl font-semibold mb-3">Emotional Insights</h2>
            <Card className="mb-8">
                <CardHeader className="flex flex-row items-start justify-between"> {/* Changed items-center to items-start for better vertical alignment on wrap */}
                    <div className='flex-1 pr-4'>
                        <CardTitle>Emotion Trends</CardTitle>
                        <CardDescription>Visual analysis of your emotional journey.</CardDescription>
                    </div>

                    {/* Time Period Filter */}
                    <div className="flex space-x-2 flex-shrink-0"> {/* Ensured buttons don't wrap and shrink content */}
                        {[7, 30, 90, 0].map((period) => (
                            <Button
                                key={period}
                                variant={timePeriod === period ? "default" : "outline"}
                                onClick={() => {
                                    setTimePeriod(period);
                                    setAiInsight(null); // Clear old insight immediately
                                    setNeedsRefresh(true); // Signal that the new period needs new insights
                                }}
                                size="sm"
                            >
                                {period === 0 ? 'All Time' : `${period} Days`}
                            </Button>
                        ))}
                    </div>
                </CardHeader>
                {/* FIX: space-y-6 inside CardContent is correct for vertical spacing */}
                <CardContent className="space-y-6">

                    {/* AI Insight Text Card */}
                    <Card className="border-2 border-primary/50 bg-primary-foreground/10">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-lg flex items-center">
                                <Brain className="w-5 h-5 mr-2" /> AI Insights
                            </CardTitle>

                            {/* NEW: Refresh Button */}
                            {totalEntries > 0 && (
                                <Button
                                    variant={needsRefresh ? "default" : "secondary"}
                                    size="sm"
                                    onClick={() => fetchAiInsights(dailyChartData, topEmotion, periodText, currentDataHash)}
                                    disabled={isAiLoading || (aiInsight?.dataHash === currentDataHash && !needsRefresh)}
                                    // FIX: Adjusted animation class name for visibility
                                    className={cn({"border-2 border-dashed border-red-500": needsRefresh})}
                                >
                                    <RefreshCw className={cn("h-4 w-4 mr-2 transition-transform", isAiLoading ? "animate-spin" : "")} />
                                    {isAiLoading ? "Generating..." : needsRefresh ? "Generate New Advice" : "Advice is Current"}
                                </Button>
                            )}
                            {/* END NEW: Refresh Button */}

                        </CardHeader>
                        <CardContent>
                            {/* FIX: Added proper flex-start alignment and gap for the emoji and text */}
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 pt-0">
                                    <span className="text-5xl lg:text-7xl">
                                        {topEmotion ? EMOJI_MAP[topEmotion] : EMOJI_MAP.neutral}
                                    </span>
                                </div>
                                <div className="space-y-2 w-full">
                                    <h3 className="text-base font-semibold">Core Emotional Summary</h3>

                                    {/* CORE INSIGHTS (Non-AI) */}
                                    {coreInsights.map((insight, index) => (
                                        <p
                                            key={`core-${index}`}
                                            className="leading-relaxed text-sm text-muted-foreground"
                                            dangerouslySetInnerHTML={{ __html: insight.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                                        />
                                    ))}

                                    <hr className="my-2 border-primary/20" />

                                    {/* AI-DRIVEN ADVICE */}
                                    <p className="font-semibold text-base mb-2 flex items-center">
                                        Personalized Recommendation:
                                    </p>

                                    {isAiLoading ? (
                                        <div className="flex items-center space-x-2 p-4 border rounded-lg bg-background/50">
                                            <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                                            <p className="text-sm text-primary/80">Generating personalized insights (This is a manual step)...</p>
                                        </div>
                                    ) : totalEntries === 0 ? (
                                        <p className="text-sm italic text-muted-foreground">
                                            Record a few entries to unlock AI-powered insights!
                                        </p>
                                    ) : (
                                        // Display AI advice or prompt the user if refresh is needed
                                        <p className={cn("text-sm font-medium leading-relaxed whitespace-pre-wrap", {"text-red-500 italic": needsRefresh && !aiInsight})}>
                                            {needsRefresh ? "Click 'Generate New Advice' to process the latest journal data." : (aiInsight?.ai_advice || "No specific advice generated for this period.")}
                                        </p>
                                    )}

                                    {/* Display API Error if one occurred */}
                                    {error && (
                                        <Alert variant="destructive" className="mt-4">
                                            <AlertDescription className="text-xs">
                                                **AI Error:** {error}
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {dailyChartData.length === 0 ? (
                        <p className="text-muted-foreground text-center py-10">
                            Not enough entries for the {periodText} period to generate a chart.
                        </p>
                    ) : (
                        // FIX: Grouped charts into a fragment and ensured each Card is visually separate.
                        <>
                            {/* Line Chart: Show trends over time */}
                            <Card className="shadow-none border">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center"><LineChart className="w-4 h-4 mr-2" /> Key Emotion Trends ({periodText})</CardTitle>
                                    <CardDescription>Tracks the intensity of Joy, Sadness, Fear, and Anger daily.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <EmotionLineChart data={dailyChartData} period={timePeriod} />
                                </CardContent>
                            </Card>

                            {/* Stacked Bar Chart: Show daily mix */}
                            <Card className="shadow-none border">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center"><LayoutGrid className="w-4 h-4 mr-2" /> Daily Emotional Mix ({periodText})</CardTitle>
                                    <CardDescription>A stacked view of all emotions recorded each day.</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <EmotionStackedBarChart data={dailyChartData} period={timePeriod} />
                                </CardContent>
                            </Card>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>


      {/* Journal Entry Dialog */}
      {/* FIX: Ensure DialogContent uses max-w-lg for a slightly larger, more spacious dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingEntry ? "Edit Journal Entry" : "New Journal Entry"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">Title</label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Journal Entry</label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} required />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : editingEntry ? "Update Entry" : "Save Entry"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}