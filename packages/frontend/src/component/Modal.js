import { useNavigate } from "react-router-dom";
import "./modal.css";

// Modal for room-closed
export function Modal({ show, pageJump, mainPrompt, buttonPrompt, title }) {
  const showHideClassName = show ? "modal display-block" : "modal display-none";
  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <div className="relative w-full h-full max-w-md p-4 md:h-auto">
          <div className="relative p-10 bg-white rounded-lg shadow dark:bg-ice-8">
            <div className="pt-0 text-center">
              {title}
              <h3 className="mb-5 text-xl font-bold text-ice-7">
                {mainPrompt}
              </h3>

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
