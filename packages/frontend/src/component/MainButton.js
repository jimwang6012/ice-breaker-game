// the main button used across pages
export function MainButton(props) {
  return (
    <div className="flex">
      <button
        onClick={props.handleClick}
        className="absolute z-40 px-6 py-3 text-xl font-semibold text-white rounded-lg shadow-inner bg-ice-6 hover:mt-1 active:mt-2"
      >
        {props.text}
      </button>
      <div className="px-6 py-3 mt-2 text-xl font-semibold rounded-lg text-ice-7 bg-ice-7">
        {props.text}
      </div>
    </div>
  );
}
