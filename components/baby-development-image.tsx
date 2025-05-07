"use client"

interface BabyDevelopmentImageProps {
  week: number
  size: string
  className?: string
}

export function BabyDevelopmentImage({ week, size, className = "" }: BabyDevelopmentImageProps) {
  // Function to render the appropriate SVG based on week
  const renderSvgImage = () => {
    if (week < 4+1) {
      // Poppy seed
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="5" fill="#F655A6" />
        </svg>
      )
    } else if (week < 8+1) {
      // Kidney bean (curved bean shape)
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M30,50 C30,30 45,20 60,20 C75,20 80,35 75,50 C70,65 55,75 40,70 C30,65 30,60 30,50Z"
            fill="#F655A6"
            stroke="black"
            strokeWidth="1"
          />
        </svg>
      )
    } else if (week < 12+1) {
      // Lime (circle)
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="30" fill="#FEE5F2" stroke="#F655A6" strokeWidth="2" />
          <circle cx="40" cy="40" r="8" fill="white" fillOpacity="0.5" />
        </svg>
      )
    } else if (week < 16+1) {
      // Avocado (pear shape with pit)
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M50,20 C70,20 80,40 80,60 C80,80 60,85 50,85 C40,85 20,80 20,60 C20,40 30,20 50,20Z"
            fill="#F655A6"
            stroke="black"
            strokeWidth="1"
          />
          <circle cx="50" cy="55" r="15" fill="#FEE5F2" />
        </svg>
      )
    } else if (week < 20+1) {
      // Banana (curved shape)
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M20,70 C30,90 70,90 80,70 C90,50 80,20 60,30 C40,40 10,50 20,70Z"
            fill="#FEE5F2"
            stroke="#F655A6"
            strokeWidth="2"
          />
        </svg>
      )
    } else if (week < 24+1) {
      // Corn on the cob (elongated shape with pattern)
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse cx="50" cy="50" rx="15" ry="40" fill="#FEE5F2" stroke="#F655A6" strokeWidth="2" />
          {/* Corn pattern */}
          {Array.from({ length: 8 }).map((_, i) => (
            <ellipse key={`row-${i}`} cx="50" cy={25 + i * 7} rx="13" ry="3" fill="#F655A6" fillOpacity="0.3" />
          ))}
        </svg>
      )
    } else if (week < 28+1) {
      // Eggplant (bulb shape with stem)
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M50,20 C50,20 40,20 40,30 L40,35 C20,45 20,75 40,85 C60,95 80,85 80,65 C80,45 60,35 50,35 L50,20Z"
            fill="#F655A6"
            stroke="black"
            strokeWidth="1"
          />
          <path
            d="M50,20 L50,25 C50,25 55,25 55,20 C55,15 50,15 50,20Z"
            fill="#FEE5F2"
            stroke="black"
            strokeWidth="1"
          />
        </svg>
      )
    } else if (week < 32+1) {
      // Squash (elongated oval)
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse cx="50" cy="50" rx="20" ry="35" fill="#FEE5F2" stroke="#F655A6" strokeWidth="2" />
          <path
            d="M50,15 L50,20 C50,20 55,20 55,15 C55,10 50,10 50,15Z"
            fill="#F655A6"
            stroke="black"
            strokeWidth="1"
          />
        </svg>
      )
    } else if (week < 36+1) {
      // Honeydew melon (large circle)
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="40" fill="#FEE5F2" stroke="#F655A6" strokeWidth="2" />
          <path d="M30,50 C30,30 70,30 70,50" fill="none" stroke="#F655A6" strokeWidth="1" />
          <path d="M30,60 C30,80 70,80 70,60" fill="none" stroke="#F655A6" strokeWidth="1" />
        </svg>
      )
    } else {
      // Watermelon (large circle with pattern)
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="40" fill="#F655A6" stroke="black" strokeWidth="2" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="#FEE5F2" strokeWidth="4" />
          {/* Watermelon seeds */}
          {Array.from({ length: 8 }).map((_, i) => (
            <ellipse
              key={`seed-${i}`}
              cx={40 + (i % 4) * 7}
              cy={40 + Math.floor(i / 4) * 15}
              rx="2"
              ry="3"
              fill="black"
              transform={`rotate(${i * 30}, 50, 50)`}
            />
          ))}
        </svg>
      )
    }
  }

  const getSizeDescription = () => {
    if (week < 5) {
      return "Poppy seed"
    } else if (week < 9) {
      return "Kidney bean"
    } else if (week < 13) {
      return "Lime"
    } else if (week < 17) {
      return "Avocado"
    } else if (week < 21) {
      return "Banana"
    } else if (week < 25) {
      return "Corn on the cob"
    } else if (week < 29) {
      return "Eggplant"
    } else if (week < 33) {
      return "Squash"
    } else if (week < 37) {
      return "Honeydew melon"
    } else {
      return "Watermelon"
    }
  }

  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <div className="relative h-40 w-40 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md border-2 border-[#F655A6]">
        {renderSvgImage()}
      </div>
      <div className="mt-3 text-center">
        <p className="font-medium">Week {week}</p>
        <p className="text-sm text-[#F655A6] font-medium">Size: {size || getSizeDescription()}</p>
      </div>
    </div>
  )
}
