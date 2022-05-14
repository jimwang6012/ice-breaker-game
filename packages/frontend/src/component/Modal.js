import "./modal.css";

// Customized Modal window with wanted components as parameters
export function Modal({ show, pageJump, mainPrompt, buttonPrompt, title }) {
  const showHideClassName = show ? "modal display-block" : "modal display-none";
  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <div className="">
          <div className="p-5 rounded-lg shadow dark:bg-ice-8">
            <div className="text-center ">
              {/* The component at the top of the modal window */}
              {title}
              <h3 className="mb-5 text-xl font-bold text-ice-7">
                {/* Main prompt message */}
                {mainPrompt}
              </h3>
              {/* The button and its function on the window */}
              <button
                onClick={pageJump}
                className="px-5 py-3 mt-5 font-semibold text-white rounded-lg text-l bg-ice-6 hover:bg-ice-5"
              >
                {buttonPrompt}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
