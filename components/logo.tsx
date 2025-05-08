interface LogoProps {
    width?: number
    height?: number
    className?: string
  }
  
  export function Logo({ width = 100, height = 40, className = "" }: LogoProps) {
    return (
      <div className={`relative ${className}`} style={{ width, height }}>
        <svg width={width} height={height} viewBox="0 0 200 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* b - Larger pregnant woman silhouette */}
          <circle cx="15" cy="8" r="5" fill="currentColor" />
          <path d="M12 13V40H18V13" fill="currentColor" />
          {/* Larger, more obvious pregnant belly */}
          <ellipse cx="22" cy="26" rx="9" ry="11" fill="currentColor" />
  
          {/* Star with curved edges */}
          <path
            d="M145 10C146 13 147 15 149 17C152 17.5 155 18 157 18C155 19.5 153 21 152 23C152.5 25.5 153 28 154 30C152 28.5 149 27 145 26C141 27 138 28.5 136 30C137 28 137.5 25.5 138 23C137 21 135 19.5 133 18C135 18 138 17.5 141 17C143 15 144 13 145 10Z"
            fill="#FF69B4"
          />
  
          {/* Sparkle with curved edges */}
          <path
            d="M170 15C170.5 13.5 171 12 172 10C173 12 173.5 13.5 174 15C176 14.5 177.5 14 179 13C177.5 15 176 16.5 174 17C176 17.5 177.5 19 179 21C177.5 20 176 19.5 174 19C173.5 20.5 173 22 172 24C171 22 170.5 20.5 170 19C168 19.5 166.5 20 165 21C166.5 19 168 17.5 170 17C168 16.5 166.5 15 165 13C166.5 14 168 14.5 170 15Z"
            fill="#FF69B4"
          />
        </svg>
  
        {/* Text elements with Times New Roman font */}
        <div className="absolute inset-0 flex items-center" style={{ paddingLeft: "35px" }}>
          <span
            style={{
              fontFamily: "'Times New Roman', Times, serif",
              fontSize: height * 0.7,
              lineHeight: 1,
              letterSpacing: "-0.5px",
            }}
          >
            <span style={{ color: "currentColor" }}>i</span>
            <span style={{ color: "#FF69B4" }}>ai</span>
            <span style={{ color: "currentColor" }}>a</span>
          </span>
        </div>
      </div>
    )
  }
  