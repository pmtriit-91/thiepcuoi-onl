/**
 * Wedding Vault Protection System
 * © 2026 Minh Trí & Cẩm Hương. All Rights Reserved.
 * Bảo vệ bản quyền hình ảnh & mã nguồn thiệp cưới.
 */
(function () {
  'use strict';

  // 1. Chống chuột phải (Context Menu)
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    return false;
  }, { capture: true });

  // 2. Chống phím tắt F12, View Source, Inspect Element, Save Page
  document.addEventListener('keydown', function (e) {
    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    const isCtrlOrMeta = e.ctrlKey || e.metaKey;

    // Ctrl/Cmd + U (View Source)
    if (isCtrlOrMeta && (e.key === 'u' || e.key === 'U' || e.keyCode === 85)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl/Cmd + S (Save Page)
    if (isCtrlOrMeta && (e.key === 's' || e.key === 'S' || e.keyCode === 83)) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl/Cmd + Shift + I (Inspect)
    // Ctrl/Cmd + Shift + J (Console)
    // Ctrl/Cmd + Shift + C (Element Picker)
    if (isCtrlOrMeta && e.shiftKey) {
      const k = e.key ? e.key.toUpperCase() : '';
      if (k === 'I' || k === 'J' || k === 'C' || e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }

    // Mac Cmd + Option + I / Cmd + Option + U / Cmd + Option + J / Cmd + Option + C
    if (e.metaKey && e.altKey) {
      const k = e.key ? e.key.toUpperCase() : '';
      if (k === 'I' || k === 'U' || k === 'J' || k === 'C' || e.keyCode === 73 || e.keyCode === 85 || e.keyCode === 74 || e.keyCode === 67) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
  }, { capture: true });

  // 3. Chống kéo thả ảnh (Drag & Drop)
  document.addEventListener('dragstart', function (e) {
    if (e.target && e.target.nodeName === 'IMG') {
      e.preventDefault();
      return false;
    }
  }, { capture: true });

  // 4. Bẫy kiểm tra DevTools (Debugger hook)
  function activateAntiDebug() {
    setInterval(function () {
      const startTime = performance.now();
      // debugger trap - nếu bảng DevTools đang mở, lệnh này sẽ tạm dừng thực thi
      (function () {}['constructor']('debugger')());
      const endTime = performance.now();
      if (endTime - startTime > 100) {
        // DevTools đang can thiệp
        try {
          console.clear();
        } catch (err) {}
      }
    }, 1000);
  }

  // Khởi chạy bẫy
  try {
    activateAntiDebug();
  } catch (err) {}

  // 5. Cảnh báo bản quyền trang trọng trong Console
  try {
    const style1 = 'color: #8b1d24; font-size: 20px; font-weight: bold; font-family: serif;';
    const style2 = 'color: #555; font-size: 13px; line-height: 1.5;';
    console.log('%c👰🤵 THIỆP CƯỚI MINH TRÍ & CẨM HƯƠNG', style1);
    console.log('%cToàn bộ hình ảnh, nội dung và mã nguồn thuộc bản quyền riêng của cô dâu chú rể.\nVui lòng tôn trọng quyền tác giả và ngày vui của chúng mình ❤️', style2);
  } catch (e) {}
})();
