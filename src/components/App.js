import { useEffect, useRef, useState } from "react";
import { useFeteching } from "./Feteching_Data";
import { useMediaQuery } from "react-responsive";

export default function App() {
  const [userInput, setuserInput] = useState("");
  const [mode, setMode] = useState("social");
  const [newchat, setNewchat] = useState(false);
  const [isSideOpen, setIsSideOpen] = useState(false);
  const [save, setsave] = useState(null);
  const [selectedid, setselectedid] = useState(null);

  const isMobile = useMediaQuery({ maxWidth: 768 });

  console.log(isMobile);
  console.log(selectedid);

  function Handlenewchat() {
    setsave(null);
    setNewchat((newchat) => !newchat);
    setIsSideOpen((isSideOpen) => !isSideOpen);
  }

  function Handleselected(id, result) {
    setIsSideOpen((isSideOpen) => !isSideOpen);
    setselectedid(id);
    setresult(result);
    setdisplayMode(true);
  }

  const {
    result,
    isloading,
    Handleprompt,
    chat,
    setresult,
    displayMode,
    setdisplayMode,
  } = useFeteching(mode, userInput, setuserInput, save);

  useEffect(function(){
    document.title = `AI Agent - ${mode.charAt(0).toUpperCase() + mode.slice(1)}`;
    return function(){
      document.title = "AI Agent";
    }
  } , [mode])

  return (
    <div className="main">
      {newchat && (
        <SaveData
          setsave={setsave}
          setNewchat={setNewchat}
          setresult={setresult}
          setdisplayMode={setdisplayMode}
        />
      )}
      {!isSideOpen && (
        <span className="open-side" onClick={() => setIsSideOpen(!isSideOpen)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#FFFFFF"
          >
            <path d="M120-120v-80h720v80H120Zm0-320v-80h720v80H120Zm0-320v-80h720v80H120Z" />
          </svg>
        </span>
      )}

      {isSideOpen ? (
        <SideBar
          isSideOpen={isSideOpen}
          setIsSideOpen={setIsSideOpen}
          Handlenewchat={Handlenewchat}
          chat={chat}
          Handleselected={Handleselected}
        >
          {" "}
          <Mode
            className="type-side"
            mode={mode}
            setMode={setMode}
            side={true}
          />
        </SideBar>
      ) : (
        ""
      )}
      {!isloading && !result && isMobile && <BeforeResultMobile />}
      {isloading ? <Loader /> : <Result result={result} />}
      {!isloading && !result && !isMobile && <BeforeResult />}
      <Prompt
        setMode={setMode}
        mode={mode}
        setuserInput={setuserInput}
        userInput={userInput}
        Handleprompt={Handleprompt}
        displayMode={displayMode}
        isMobile={isMobile}
      />
    </div>
  );
}

function Prompt({
  setMode,
  mode,
  userInput,
  setuserInput,
  Handleprompt,
  isMobile,
  displayMode,
}) {
  const TextArea = useRef(null);
  useEffect(function () {
    TextArea.current.focus();
  }, []);
  return (
    <div className="box">
      {!isMobile && (
        <Mode setMode={setMode} mode={mode} className="type" side={false} />
      )}
      {isMobile && !displayMode && (
        <Mode setMode={setMode} mode={mode} className="type" side={false} />
      )}
      <div className="prompt">
        <textarea
          ref={TextArea}
          placeholder="Enter your Subject here..."
          value={userInput}
          onChange={(e) => setuserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              Handleprompt();
            }
          }}
        ></textarea>
        <button onClick={Handleprompt}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#e3e3e3"
          >
            <path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function Mode({ setMode, mode, className, side }) {
  return (
    <div className={className}>
      <div
        className={mode === "social" ? "social active" : "social"}
        onClick={() => setMode("social")}
      >
        <p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#FFFFFF"
          >
            <path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-80q17 0 28.5-11.5T720-200q0-17-11.5-28.5T680-240q-17 0-28.5 11.5T640-200q0 17 11.5 28.5T680-160ZM200-440q17 0 28.5-11.5T240-480q0-17-11.5-28.5T200-520q-17 0-28.5 11.5T160-480q0 17 11.5 28.5T200-440Zm480-280q17 0 28.5-11.5T720-760q0-17-11.5-28.5T680-800q-17 0-28.5 11.5T640-760q0 17 11.5 28.5T680-720Zm0 520ZM200-480Zm480-280Z" />
          </svg>
        </p>
        <p>{side ? "Social Post" : "Social Media Post"}</p>
      </div>
      <div
        className={mode === "summary" ? "summary active" : "summary"}
        onClick={() => setMode("summary")}
      >
        <p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="25px"
            viewBox="0 -960 960 960"
            width="25px"
            fill="#FFFFFF"
          >
            <path d="M312.29-606.67q17.78 0 29.41-11.95 11.63-11.96 11.63-28.84 0-18.27-11.83-29.41Q329.67-688 312.79-688q-18.28 0-29.53 11.13Q272-665.73 272-647.96q0 17.78 11.26 29.54 11.25 11.75 29.03 11.75Zm0 167q17.78 0 29.41-11.5 11.63-11.5 11.63-28.83t-11.83-29.17Q329.67-521 312.79-521q-18.28 0-29.53 11.83Q272-497.33 272-480q0 17.33 11.26 28.83 11.25 11.5 29.03 11.5Zm0 167.67q17.78 0 29.41-11.26 11.63-11.25 11.63-29.03T341.5-341.7q-11.83-11.63-28.71-11.63-18.28 0-29.53 11.83Q272-329.67 272-312.79q0 18.28 11.26 29.53Q294.51-272 312.29-272ZM196.67-90.67q-43.83 0-74.92-31.08-31.08-31.09-31.08-74.92v-566.66q0-44.1 31.08-75.39Q152.84-870 196.67-870h445L870-641.67v445q0 43.83-31.28 74.92-31.29 31.08-75.39 31.08H196.67Zm0-106h566.66v-385.85H582.81v-180.81H196.67v566.66Zm0-566.66v180.81-180.81V-196.67v-566.66Z" />
          </svg>
        </p>
        <p>Summary</p>
      </div>
      <div
        className={mode === "article" ? "article active" : "article"}
        onClick={() => setMode("article")}
      >
        <p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="25px"
            viewBox="0 -960 960 960"
            width="25px"
            fill="#FFFFFF"
          >
            <path d="M279.67-50.67q-64.15 0-106.58-42.42-42.42-42.43-42.42-106.58V-761q0-62.29 42.42-105.64Q215.52-910 279.67-910H830v659.33q-20.13 0-32.07 15.42Q786-219.83 786-199.55q0 20.75 11.93 35.82 11.94 15.06 32.07 15.06v98H279.67Zm-.31-98h418.97q-5.1-11.76-7.71-24.04Q688-185 688-200.36q0-13.31 3.33-25.64 3.34-12.33 7.67-24.67H279.4q-22.97 0-36.85 14.36-13.88 14.37-13.88 36.76 0 22.75 13.88 36.82 13.88 14.06 36.81 14.06Zm-50.69-189q12.15-4.66 23.8-8 11.65-3.33 27.2-3.33H732v-463H279.67q-23.24 0-37.12 14.36-13.88 14.36-13.88 36.64v423.33ZM340.33-440h67l18-53H532l18 53h69.33L517.67-720H441L340.33-440ZM444-552l32.33-98h4.34l32.66 98H444ZM228.67-337.67V-812v474.33Z" />
          </svg>
        </p>
        <p>Write Article</p>
      </div>
    </div>
  );
}

function Result({ result }) {
  const [displayedLines, setDisplayedLines] = useState([]);

  useEffect(() => {
    if (!result) {
      setDisplayedLines([]);
      return;
    }
    const lines = result.split("\n").filter((line) => line.trim() !== "");
    if (lines.length === 0) {
      setDisplayedLines([]);
      return;
    }
    setDisplayedLines([lines[0]]);
    let i = 1;
    const interval = setInterval(() => {
      setDisplayedLines((prev) => [...prev, lines[i]]);
      i++;
      if (i >= lines.length) clearInterval(interval);
    }, 400); // Adjust delay as needed
    return () => clearInterval(interval);
  }, [result]);

  return (
    <div className="result">
      <div className="result-content">
        {displayedLines.length === 0 && ""}
        {displayedLines.map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </div>
    </div>
  );
}

function Loader() {
  return (
    <div className="load">
      <p className="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="40"
          height="40"
          viewBox="0 0 48 48"
        >
          <path
            fill="#2196f3"
            d="M23.426,31.911l-1.719,3.936c-0.661,1.513-2.754,1.513-3.415,0l-1.719-3.936	c-1.529-3.503-4.282-6.291-7.716-7.815l-4.73-2.1c-1.504-0.668-1.504-2.855,0-3.523l4.583-2.034	c3.522-1.563,6.324-4.455,7.827-8.077l1.741-4.195c0.646-1.557,2.797-1.557,3.443,0l1.741,4.195	c1.503,3.622,4.305,6.514,7.827,8.077l4.583,2.034c1.504,0.668,1.504,2.855,0,3.523l-4.73,2.1	C27.708,25.62,24.955,28.409,23.426,31.911z"
          ></path>
          <path
            fill="#7e57c2"
            d="M38.423,43.248l-0.493,1.131c-0.361,0.828-1.507,0.828-1.868,0l-0.493-1.131	c-0.879-2.016-2.464-3.621-4.44-4.5l-1.52-0.675c-0.822-0.365-0.822-1.56,0-1.925l1.435-0.638c2.027-0.901,3.64-2.565,4.504-4.65	l0.507-1.222c0.353-0.852,1.531-0.852,1.884,0l0.507,1.222c0.864,2.085,2.477,3.749,4.504,4.65l1.435,0.638	c0.822,0.365,0.822,1.56,0,1.925l-1.52,0.675C40.887,39.627,39.303,41.232,38.423,43.248z"
          ></path>
        </svg>
      </p>
      <p className="text">Thinking....</p>
    </div>
  );
}

function HandleError() {
  return <div></div>;
}

function NewChat() {
  <button className="new">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="40px"
      viewBox="0 -960 960 960"
      width="40px"
      fill="#FFFFFF"
    >
      <path d="M427.33-426.67H170.67v-106h256.66V-791h106v258.33H790v106H533.33v256h-106v-256Z" />
    </svg>
  </button>;
}

function BeforeResult() {
  return (
    <div className="heading">
      <p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#FFFFFF"
        >
          <path d="M160-360q-50 0-85-35t-35-85q0-50 35-85t85-35v-80q0-33 23.5-56.5T240-760h120q0-50 35-85t85-35q50 0 85 35t35 85h120q33 0 56.5 23.5T800-680v80q50 0 85 35t35 85q0 50-35 85t-85 35v160q0 33-23.5 56.5T720-120H240q-33 0-56.5-23.5T160-200v-160Zm200-80q25 0 42.5-17.5T420-500q0-25-17.5-42.5T360-560q-25 0-42.5 17.5T300-500q0 25 17.5 42.5T360-440Zm240 0q25 0 42.5-17.5T660-500q0-25-17.5-42.5T600-560q-25 0-42.5 17.5T540-500q0 25 17.5 42.5T600-440ZM320-280h320v-80H320v80Zm-80 80h480v-480H240v480Zm240-240Z" />
        </svg>
      </p>
      <h3>Let's Go How Can I Help You</h3>
      <p>Choose an action below and tell me what you'd like to create</p>
    </div>
  );
}

function BeforeResultMobile() {
  return (
    <div className="heading">
      <p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#FFFFFF"
        >
          <path d="M160-360q-50 0-85-35t-35-85q0-50 35-85t85-35v-80q0-33 23.5-56.5T240-760h120q0-50 35-85t85-35q50 0 85 35t35 85h120q33 0 56.5 23.5T800-680v80q50 0 85 35t35 85q0 50-35 85t-85 35v160q0 33-23.5 56.5T720-120H240q-33 0-56.5-23.5T160-200v-160Zm200-80q25 0 42.5-17.5T420-500q0-25-17.5-42.5T360-560q-25 0-42.5 17.5T300-500q0 25 17.5 42.5T360-440Zm240 0q25 0 42.5-17.5T660-500q0-25-17.5-42.5T600-560q-25 0-42.5 17.5T540-500q0 25 17.5 42.5T600-440ZM320-280h320v-80H320v80Zm-80 80h480v-480H240v480Zm240-240Z" />
        </svg>
      </p>
      <h3>Let's Go Osama</h3>
      <p>Choose an action below and tell me</p>
    </div>
  );
}

function SideBar({
  children,
  isSideOpen,
  setIsSideOpen,
  Handlenewchat,
  chat,
  Handleselected,
}) {
  return (
    <div className={`side${isSideOpen ? "" : " side-closed"}`}>
      <span onClick={() => setIsSideOpen(!isSideOpen)} className="close-side">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="35px"
          viewBox="0 -960 960 960"
          width="35px"
          fill="#FFFFFF"
        >
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
      </span>
      <div className="info">
        <p role="button" onClick={Handlenewchat}>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#FFFFFF"
            >
              <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
            </svg>
          </span>
          New Chat
        </p>
      </div>
      {children}
      <div className="chats">
        <h3>Latest Chats</h3>
        {chat?.map((c, idx) => (
          <div key={idx} onClick={() => Handleselected(c.id, c.result)}>
            <h5>{c.input}</h5>
            <p>{c.start}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SaveData({ setsave, setNewchat, setresult, setdisplayMode }) {
  return (
    <div className="confirm">
      <p>Do you Want To save This Chat ?</p>
      <div>
        <button
          className="save"
          onClick={() => {
            setsave(true);
            setNewchat(false);
            setdisplayMode(false)
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }}
        >
          Save
        </button>
        <button
          className="cancel"
          onClick={() => {
            setsave(false);
            setNewchat(false);
            setresult("");
            setdisplayMode(false);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
