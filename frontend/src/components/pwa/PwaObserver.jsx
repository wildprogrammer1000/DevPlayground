import { useEffect, useRef, useState } from "react";
import style from "css/module/Pwa.module.css";

const PwaObserver = () => {
  const initialized = useRef(false);
  const promptRef = useRef();
  const [enabled, setEnabled] = useState(false);
  const onBeforeInstallPrompt = (e) => {
    e.preventDefault();
    if (
      !window.matchMedia("(display-mode:standalone)").matches &&
      !initialized.current
    ) {
      initialized.current = true;
      promptRef.current = e;
      setEnabled(true);
    }
  };

  const isIOS = () =>
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isAndroid = () => /Android/.test(navigator.userAgent);
  
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);
  return {
    enabled: enabled,
    PwaObserver: enabled ? (
      <div className={style.pwa}>
        <div className={style.title}>앱으로 설치할래요?</div>
        <div className={style.buttons}>
          <button>설치</button>
          <button onClick={() => setEnabled(false)}>취소</button>
        </div>
      </div>
    ) : null,
  };
};
export default PwaObserver;
