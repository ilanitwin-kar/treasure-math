import { motion } from "framer-motion";

interface ShapeVisualProps {
  shape: "triangle" | "square" | "rectangle" | "pentagon" | "hexagon" | "circle";
  size?: number;
  color?: string;
}

/**
 * רכיב המציג צורה גאומטרית פשוטה (משולש, ריבוע, מחומש וכו').
 * משתמש במצולעים רגולריים.
 */
export function ShapeVisual({ shape, size = 180, color = "#3b82f6" }: ShapeVisualProps) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -45 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 200 200" width="100%" height="100%">
        {renderShape(shape, color)}
      </svg>
    </motion.div>
  );
}

function renderShape(shape: ShapeVisualProps["shape"], color: string) {
  const strokeColor = "#1e40af";

  switch (shape) {
    case "circle":
      return (
        <circle
          cx="100"
          cy="100"
          r="80"
          fill={color}
          stroke={strokeColor}
          strokeWidth="4"
        />
      );

    case "square":
      return (
        <rect
          x="30"
          y="30"
          width="140"
          height="140"
          fill={color}
          stroke={strokeColor}
          strokeWidth="4"
          rx="4"
        />
      );

    case "rectangle":
      return (
        <rect
          x="20"
          y="55"
          width="160"
          height="90"
          fill={color}
          stroke={strokeColor}
          strokeWidth="4"
          rx="4"
        />
      );

    case "triangle":
      return (
        <polygon
          points={regularPolygonPoints(3, 100, 100, 85, -90)}
          fill={color}
          stroke={strokeColor}
          strokeWidth="4"
          strokeLinejoin="round"
        />
      );

    case "pentagon":
      return (
        <polygon
          points={regularPolygonPoints(5, 100, 100, 80, -90)}
          fill={color}
          stroke={strokeColor}
          strokeWidth="4"
          strokeLinejoin="round"
        />
      );

    case "hexagon":
      return (
        <polygon
          points={regularPolygonPoints(6, 100, 100, 80, -90)}
          fill={color}
          stroke={strokeColor}
          strokeWidth="4"
          strokeLinejoin="round"
        />
      );
  }
}

/**
 * מחשב נקודות של מצולע רגולרי.
 */
function regularPolygonPoints(
  n: number,
  cx: number,
  cy: number,
  radius: number,
  startAngleDeg: number
): string {
  const points: string[] = [];
  for (let i = 0; i < n; i++) {
    const angle = (startAngleDeg + (i * 360) / n) * (Math.PI / 180);
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    points.push(`${x},${y}`);
  }
  return points.join(" ");
}
