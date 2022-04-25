import { useNavigate } from "react-router-dom";
import "./modal.css";

// Modal for room-closed
export function Modal({ show }) {
  const showHideClassName = show ? "modal display-block" : "modal display-none";
  const navigate = useNavigate();
  const toHome = () => {
    navigate("/home");
  };
  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        <div className="relative w-full h-full max-w-md p-4 md:h-auto">
          <div className="relative p-10 bg-white rounded-lg shadow dark:bg-ice-8">
            <div className="pt-0 text-center">
              <svg
                className="mx-auto mb-4 text-gray-200 w-14 h-14"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h3 className="mb-5 text-xl font-bold text-ice-7">
                Host has left, this room is closed!
              </h3>

              <button
                onClick={toHome}
                className="px-5 py-3 mt-5 font-semibold text-white rounded-lg text-l bg-ice-6 hover:bg-ice-5"
              >
                Return to home page
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
