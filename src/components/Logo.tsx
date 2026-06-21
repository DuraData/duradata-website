interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export default function Logo({ className = '', iconOnly = false }: LogoProps) {
  if (iconOnly) {
    return (
      <svg
        viewBox="0 0 100 100"
        className={`w-8 h-8 text-brand-teal transition-transform duration-500 group-hover:rotate-90 ${className}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="square"
      >
        {/* Open square outline with a gap on the right */}
        <path d="M 85 30 L 85 15 L 15 15 L 15 85 L 85 85 L 85 70" />
      </svg>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <svg
        viewBox="0 0 340 90"
        className="w-auto h-10 text-white select-none"
        fill="none"
        stroke="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Open square frame representing the logo symbol */}
        <path
          d="M 82 28 L 82 8 L 8 8 L 8 82 L 82 82 L 82 62"
          stroke="currentColor"
          strokeWidth="6.5"
          strokeLinecap="square"
          className="text-brand-teal"
        />

        {/* Text "DuraData" */}
        <text
          x="33"
          y="46"
          fill="currentColor"
          fontSize="30"
          fontWeight="bold"
          fontFamily="Georgia, Cambria, 'Times New Roman', Times, serif"
          className="text-white"
          stroke="none"
        >
          DuraData
        </text>

        {/* Tagline "Unlocking Insights, Driving Growth" */}
        <text
          x="33"
          y="68"
          fill="currentColor"
          fontSize="10.5"
          letterSpacing="0.02em"
          fontFamily="Georgia, Cambria, 'Times New Roman', Times, serif"
          className="text-slate-400 font-medium"
          stroke="none"
        >
          Unlocking Insights, Driving Growth
        </text>
      </svg>
    </div>
  );
}
