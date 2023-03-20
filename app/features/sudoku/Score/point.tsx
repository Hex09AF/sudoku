interface PointProps {
  plusPoint: number;
}

export default function Point({ plusPoint }: PointProps) {
  return (
    <div className={`plus-point ${plusPoint > 0 ? "plus" : "minus"}`}>
      {plusPoint < 0 ? "" : "+"}
      {plusPoint}
    </div>
  );
}
