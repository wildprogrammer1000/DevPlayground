import { useEffect, useRef, useState } from "react";
import style from "css/module/Pwa.module.css";

const PwaObserver = () => {
  const initialized = useRef(false);
  const [enabled, setEnabled] = useState(false);
  const onBeforeInstallPrompt = () => {
    if (
      !window.matchMedia("(display-mode:standalone)").matches &&
      !initialized.current
    ) {
      initialized.current = true;
      setEnabled(true);
    }
  };
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
