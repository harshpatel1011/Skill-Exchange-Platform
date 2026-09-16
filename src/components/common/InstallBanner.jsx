import React, { useState, useEffect } from 'react';
import { X, Share, PlusSquare, Zap, Monitor, Smartphone, Check } from 'lucide-react';
import './InstallBanner.css';

const InstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isIOS, setIsIOS] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  useEffect(() => {
    // Clear old localStorage block if present from initial testing
    localStorage.removeItem('pwa_banner_dismissed');

    // 1. Check if already running in standalone mode (installed app)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      setIsVisible(false);
      return;
    }

    // 2. Check if dismissed during this session
    if (sessionStorage.getItem('pwa_banner_dismissed') === 'true') {
      setIsVisible(false);
      return;
    }

    // 3. Detect iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // 4. Capture 'beforeinstallprompt' event for Chromium/Android browsers
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else {
      // Show helper guide modal for iOS or desktop browsers
      setShowGuideModal(true);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="pwa-install-banner">
        <div className="pwa-banner-left">
          {/* App Brand Icon matching Project Logo */}
          <div className="pwa-app-icon">
            <Zap size={20} color="#ffffff" />
          </div>

          {/* Text Information */}
          <div className="pwa-text-content">
            <h4 className="pwa-title">Install SkillSwap</h4>
            <p className="pwa-subtitle">Fast access from your home screen</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pwa-banner-actions">
          <button onClick={handleInstallClick} className="pwa-install-btn" aria-label="Install SkillSwap App">
            Install
          </button>
          <button onClick={handleDismiss} className="pwa-close-btn" aria-label="Dismiss banner">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Installation Instruction Modal (for iOS or Desktop without direct prompt) */}
      {showGuideModal && (
        <div className="pwa-ios-modal-overlay" onClick={() => setShowGuideModal(false)}>
          <div className="pwa-ios-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="pwa-ios-modal-header">
              <h3>{isIOS ? 'Install on iOS' : 'Install SkillSwap App'}</h3>
              <button className="pwa-close-btn" onClick={() => setShowGuideModal(false)}>
                <X size={18} />
              </button>
            </div>

            {isIOS ? (
              <div className="pwa-ios-steps">
                <div className="pwa-step-item">
                  <span className="pwa-step-num">1</span>
                  <span>Tap the <strong>Share</strong> button <Share size={15} style={{ display: 'inline', verticalAlign: 'middle' }} /> in Safari.</span>
                </div>
                <div className="pwa-step-item">
                  <span className="pwa-step-num">2</span>
                  <span>Scroll down and tap <strong>Add to Home Screen</strong> <PlusSquare size={15} style={{ display: 'inline', verticalAlign: 'middle' }} />.</span>
                </div>
                <div className="pwa-step-item">
                  <span className="pwa-step-num">3</span>
                  <span>Tap <strong>Add</strong> at top-right to finish.</span>
                </div>
              </div>
            ) : (
              <div className="pwa-ios-steps">
                <div className="pwa-step-item">
                  <span className="pwa-step-num">1</span>
                  <span>Click the <strong>Install App icon (⊕)</strong> in your browser address bar.</span>
                </div>
                <div className="pwa-step-item">
                  <span className="pwa-step-num">2</span>
                  <span>Or open browser menu (<strong>⋮</strong>) and click <strong>"Install SkillSwap"</strong> or <strong>"Cast, save, and share &gt; Install"</strong>.</span>
                </div>
                <div className="pwa-step-item">
                  <span className="pwa-step-num">3</span>
                  <span>Click <strong>Install</strong> to add it to your desktop or mobile home screen.</span>
                </div>
              </div>
            )}

            <button className="btn btn-primary" style={{ width: '100%', marginTop: '20px' }} onClick={() => setShowGuideModal(false)}>
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallBanner;
