export default function Point({ plusPoint }) {
  return (
    <div className="plus-point">
      {plusPoint < 0 ? "" : "+"}
      {plusPoint}
    </div>
  );
}
