import type { QuestionVisual } from "../../types";
import { ClockVisual } from "./ClockVisual";
import { CountingVisual } from "./CountingVisual";
import { ShapeVisual } from "./ShapeVisual";

interface Props {
  visual: QuestionVisual;
}

export function QuestionVisualRenderer({ visual }: Props) {
  switch (visual.type) {
    case "clock":
      return <ClockVisual hour={visual.hour} />;
    case "counting":
      return <CountingVisual emoji={visual.emoji} count={visual.count} />;
    case "shape":
      return <ShapeVisual shape={visual.shape} />;
  }
}
