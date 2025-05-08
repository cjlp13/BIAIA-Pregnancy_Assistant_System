"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { differenceInWeeks, parseISO } from "date-fns"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BabyDevelopmentImage } from "@/components/baby-development-image"

// Baby development data with size comparisons and descriptions
const babyDevelopmentData = [
  {
    week: 4,
    size: "Poppy seed",
    length: "0.04 inches",
    weight: "<0.04 oz",
    description: "The embryo is developing the neural tube, which will become the brain and spinal cord.",
    weeklyUpdates: [
      "The placenta is beginning to form",
      "The neural tube is developing, which will become the brain and spinal cord",
      "The heart and other organs are starting to form",
    ],
  },
  {
    week: 8,
    size: "Kidney bean",
    length: "0.6 inches",
    weight: "<0.1 oz",
    description: "Tiny fingers and toes are forming, and the baby's heart is beating rapidly.",
    weeklyUpdates: [
      "Tiny fingers and toes are beginning to form",
      "The baby's heart is beating at about 150 beats per minute",
      "Facial features are becoming more defined",
    ],
  },
  {
    week: 12,
    size: "Lime",
    length: "2.1 inches",
    weight: "0.5 oz",
    description: "All essential organs have formed, and the baby can make facial expressions.",
    weeklyUpdates: [
      "All essential organs have formed and are beginning to function",
      "The baby can make facial expressions",
      "Reflexes are developing and the baby may start to move, though you can't feel it yet",
    ],
  },
  {
    week: 16,
    size: "Avocado",
    length: "4.6 inches",
    weight: "3.5 oz",
    description: "The baby can make sucking motions and may start growing hair.",
    weeklyUpdates: [
      "The baby can make sucking motions with their mouth",
      "Hair is beginning to grow on the head",
      "The baby's skeleton is changing from cartilage to bone",
    ],
  },
  {
    week: 20,
    size: "Banana",
    length: "6.5 inches",
    weight: "10.2 oz",
    description: "You might feel the baby's movements. The baby can hear sounds outside the womb.",
    weeklyUpdates: [
      "You might start feeling the baby's movements (called quickening)",
      "The baby can hear sounds from outside the womb",
      "The baby is developing a sleep-wake cycle",
    ],
  },
  {
    week: 24,
    size: "Corn on the cob",
    length: "11.8 inches",
    weight: "1.3 lbs",
    description: "The baby's face is fully formed, and taste buds are developing.",
    weeklyUpdates: [
      "The baby's face is fully formed with eyebrows and eyelashes",
      "Taste buds are developing and the baby may taste what you eat",
      "The baby's brain is developing rapidly",
    ],
  },
  {
    week: 28,
    size: "Eggplant",
    length: "14.8 inches",
    weight: "2.2 lbs",
    description: "The baby can open and close their eyes and may have regular sleep cycles.",
    weeklyUpdates: [
      "The baby can open and close their eyes",
      "The baby may have regular periods of sleep and wakefulness",
      "The baby's lungs are developing to prepare for breathing",
    ],
  },
  {
    week: 32,
    size: "Squash",
    length: "16.7 inches",
    weight: "3.8 lbs",
    description: "The baby is practicing breathing movements and gaining weight rapidly.",
    weeklyUpdates: [
      "The baby is practicing breathing movements",
      "The baby is gaining weight rapidly as fat is deposited under the skin",
      "The baby's bones are fully formed but still soft and flexible",
    ],
  },
  {
    week: 36,
    size: "Honeydew melon",
    length: "18.7 inches",
    weight: "5.8 lbs",
    description: "The baby is running out of room to move and is preparing for birth.",
    weeklyUpdates: [
      "The baby is running out of room to move around",
      "Most babies move into the head-down position in preparation for birth",
      "The baby's immune system is developing and receiving antibodies from you",
    ],
  },
  {
    week: 40,
    size: "Watermelon",
    length: "20.2 inches",
    weight: "7.6 lbs",
    description: "The baby is fully developed and ready to meet you!",
    weeklyUpdates: [
      "The baby is fully developed and ready to be born",
      "The lungs are mature and ready to take their first breath",
      "The baby continues to build fat reserves for life outside the womb",
    ],
  },
]

// Weekly Updates Harcoded haha lol
const allWeeklyUpdates = {
  1: [
    "Conception typically occurs this week",
    "The fertilized egg (zygote) begins dividing rapidly",
    "The zygote travels down the fallopian tube toward the uterus",
  ],
  2: [
    "The ball of cells (blastocyst) implants in the uterine lining",
    "The placenta begins to form",
    "Pregnancy hormones start to be produced",
  ],
  3: [
    "The embryo is now about the size of a pinhead",
    "The amniotic sac forms around the embryo",
    "The primitive heart and circulatory system begin to form",
  ],
  5: ["The embryo's heart begins to beat", "The neural tube continues to develop", "Arm and leg buds start to appear"],
  6: [
    "The embryo is now about the size of a lentil",
    "Facial features begin to form including eyes and nose",
    "The intestines begin to develop",
  ],
  7: [
    "The embryo's head is large compared to the body",
    "Arm and leg buds are growing longer",
    "The brain is developing rapidly",
  ],
  9: [
    "The embryo is now officially a fetus",
    "Tiny muscles are forming, allowing for more movement",
    "External genitalia begin to develop but are not yet distinguishable",
  ],
  10: [
    "Vital organs like the kidneys, intestines, brain, and liver are in place and starting to function",
    "Fingernails and hair begin to form",
    "The baby can now make a fist",
  ],
  11: [
    "The baby's head makes up about half of its length",
    "The baby can hiccup, though you won't feel it",
    "Tooth buds for baby teeth are forming",
  ],
  13: [
    "The baby's fingerprints are forming",
    "Vocal cords are beginning to develop",
    "The baby's intestines are moving from the umbilical cord into the abdomen",
  ],
  14: [
    "The baby's sex becomes apparent",
    "The baby can squint, frown, and make faces",
    "Lanugo (fine hair) begins to grow on the body",
  ],
  15: [
    "The baby can sense light even though the eyes are still fused shut",
    "The baby is forming taste buds",
    "Bones are becoming harder and more solid",
  ],
  17: [
    "The baby's sweat glands are developing",
    "Fat stores begin to develop under the skin",
    "The umbilical cord is growing stronger and thicker",
  ],
  18: [
    "The baby's ears are now in their final position",
    "The baby might begin to hear sounds",
    "The baby is active and can kick, flip, and roll",
  ],
  19: [
    "Vernix (a waxy protective coating) begins to cover the baby's skin",
    "The baby develops a regular sleep-wake cycle",
    "The baby's movements become stronger and more noticeable",
  ],
  21: [
    "The baby's eyebrows and eyelids are fully developed",
    "The baby's fingernails have grown to the tips of the fingers",
    "You may notice the baby responding to loud sounds",
  ],
  22: [
    "The baby's sense of touch is developing",
    "The baby may suck their thumb",
    "The baby's eyes can now move, though the eyelids remain closed",
  ],
  23: [
    "The baby's inner ear is developed, helping with balance",
    "Blood vessels in the lungs are developing to prepare for breathing",
    "The baby can recognize your voice",
  ],
  25: [
    "The baby's nostrils begin to open",
    "The baby is gaining more fat, making the skin less wrinkled",
    "Brain and nerve endings are developed enough to feel pain",
  ],
  26: [
    "The baby's eyes begin to open and close",
    "The baby's lungs are producing surfactant, essential for breathing",
    "The baby may respond to external sounds with increased pulse rate",
  ],
  27: [
    "The baby's brain is very active now",
    "The baby may hiccup, which you might feel as rhythmic movements",
    "The baby's lungs, though still immature, could function outside the womb with medical help",
  ],
  29: [
    "The baby's head is growing bigger to accommodate the developing brain",
    "The baby is more active and may respond to light and sound",
    "The baby's bones are fully developed, though still soft",
  ],
  30: [
    "The baby's brain is developing rapidly with billions of neurons",
    "The baby's red blood cells are now being produced in the bone marrow",
    "The baby's hands can now grasp",
  ],
  31: [
    "The baby's irises can now dilate in response to light",
    "The baby is practicing breathing movements more regularly",
    "The baby's digestive system is nearly mature",
  ],
  33: [
    "The baby's bones are hardening except for the skull, which remains soft for birth",
    "The baby's immune system is developing",
    "The baby may be making faces, sticking out the tongue, or sucking a thumb",
  ],
  34: [
    "The baby's central nervous system is maturing",
    "The baby's fingernails reach the fingertips",
    "Most of the lanugo (fine hair) is disappearing",
  ],
  35: [
    "The baby's kidneys are fully developed",
    "The baby's liver can process some waste products",
    "The baby is likely in a head-down position preparing for birth",
  ],
  37: [
    "The baby is considered full term",
    "The baby's chest is prominent and the body is filling out",
    "The baby's grasp is now quite strong",
  ],
  38: [
    "The baby's toenails have reached the tips of the toes",
    "The baby's brain is still rapidly developing",
    "The baby continues to add fat layers for temperature regulation after birth",
  ],
  39: [
    "The baby's reflexes are coordinated",
    "The baby's intestines are accumulating meconium (first bowel movement)",
    "The baby is ready for life outside the womb",
  ],
}

export default function BabyDevelopmentPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentWeek, setCurrentWeek] = useState<number>(1)
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      try {
        // Check if user is authenticated
        const { data: sessionData } = await supabase.auth.getSession()

        if (!sessionData.session) {
          router.push("/login")
          return
        }

        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", sessionData.session.user.id)
          .single()

        if (profileError) {
          if (profileError.code === "PGRST116") {
            router.push("/onboarding")
            return
          }
          throw profileError
        }

        setProfile(profileData)

        // Calculate current week of pregnancy
        const currentDate = new Date()
        const dueDate = parseISO(profileData.due_date)
        const pregnancyWeek = Math.min(40, Math.max(1, 40 - differenceInWeeks(dueDate, currentDate)))
        setCurrentWeek(pregnancyWeek)
      } catch (err) {
        console.error("Error loading data:", err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-muted-foreground">Loading baby development information... ♡</p>
        </div>
      </div>
    )
  }

  // Group weeks by trimester
  const firstTrimester = Array.from({ length: 13 }, (_, i) => i + 1)
  const secondTrimester = Array.from({ length: 14 }, (_, i) => i + 14)
  const thirdTrimester = Array.from({ length: 13 }, (_, i) => i + 28)

  // Get development data for the selected week
  const getDevelopmentData = (week: number) => {
    return babyDevelopmentData.find((data) => data.week >= week) || babyDevelopmentData[babyDevelopmentData.length - 1]
  }

  // Get weekly updates for the selected week
  const getWeeklyUpdates = (week: number) => {
    // First check if we have specific updates for this exact week
    const exactWeekData = babyDevelopmentData.find((data) => data.week === week)
    if (exactWeekData && exactWeekData.weeklyUpdates) {
      return exactWeekData.weeklyUpdates
    }

    // Then check if we have updates in our additional weekly data
    if (allWeeklyUpdates[week as keyof typeof allWeeklyUpdates]) {
      return allWeeklyUpdates[week as keyof typeof allWeeklyUpdates]
    }

    // If no exact match, get the closest milestone data
    const milestoneData = getDevelopmentData(week)
    return milestoneData.weeklyUpdates
  }

  const selectedWeekData = getDevelopmentData(currentWeek)
  const weeklyUpdates = getWeeklyUpdates(currentWeek)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Baby Development</h1>

      <Tabs defaultValue="current" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Current Week ({currentWeek})</TabsTrigger>
          <TabsTrigger value="timeline">Development Timeline</TabsTrigger>
          <TabsTrigger value="milestones">Key Milestones</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/30">
              <CardTitle>Week {currentWeek}: Your Baby Now</CardTitle>
              <CardDescription>Your baby is the size of a {selectedWeekData.size}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                <div className="p-6 flex items-center justify-center">
                  <BabyDevelopmentImage week={currentWeek} size={selectedWeekData.size} />
                </div>
                <div className="p-6 bg-card">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Size & Weight</h3>
                      <p className="text-muted-foreground">
                        Length: {selectedWeekData.length} | Weight: {selectedWeekData.weight}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Development</h3>
                      <p className="text-muted-foreground">{selectedWeekData.description}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">What's Happening This Week</h3>
                      <ul className="ml-5 list-disc space-y-1 text-sm text-muted-foreground">
                        {weeklyUpdates.map((update, index) => (
                          <li key={index}>{update}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Pregnancy Timeline</CardTitle>
              <CardDescription>Track your baby's development throughout your pregnancy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-lg font-medium">First Trimester (Weeks 1-13)</h3>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {firstTrimester.map((week) => (
                      <Button
                        key={week}
                        variant={week === currentWeek ? "default" : "outline"}
                        className="h-auto py-2"
                        onClick={() => setCurrentWeek(week)}
                      >
                        Week {week}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-medium">Second Trimester (Weeks 14-27)</h3>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {secondTrimester.map((week) => (
                      <Button
                        key={week}
                        variant={week === currentWeek ? "default" : "outline"}
                        className="h-auto py-2"
                        onClick={() => setCurrentWeek(week)}
                      >
                        Week {week}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-lg font-medium">Third Trimester (Weeks 28-40)</h3>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {thirdTrimester.map((week) => (
                      <Button
                        key={week}
                        variant={week === currentWeek ? "default" : "outline"}
                        className="h-auto py-2"
                        onClick={() => setCurrentWeek(week)}
                      >
                        Week {week}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones">
          <Card>
            <CardHeader>
              <CardTitle>Key Development Milestones</CardTitle>
              <CardDescription>Important stages in your baby's growth</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {babyDevelopmentData.map((milestone) => (
                  <div key={milestone.week} className="flex items-start gap-4 border-b pb-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {milestone.week}
                    </div>
                    <div>
                      <h3 className="font-medium">
                        Week {milestone.week}: Size of a {milestone.size}
                      </h3>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
