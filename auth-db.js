(function () {
  const STORAGE_KEY = "agenda-inteligente-v1";
  const DB_NAME = "agenda-inteligente-db";
  const DB_VERSION = 1;
  const DB_STORE = "records";
  const DB_STATE_KEY = "state";
  const SESSION_KEY = "agenda-inteligente-auth";
  const AUTH_USER = "agenda";
  const AUTH_PASSWORD = "agenda2026";

  let databasePromise;

  function $(selector) {
    return document.querySelector(selector);
  }

  function openDatabase() {
    if (databasePromise) return databasePromise;

    databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(DB_STORE)) {
          database.createObjectStore(DB_STORE, { keyPath: "key" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return databasePromise;
  }

  async function loadStateFromDatabase() {
    if (!("indexedDB" in window)) return null;

    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(DB_STORE, "readonly");
      const store = transaction.objectStore(DB_STORE);
      const request = store.get(DB_STATE_KEY);

      request.onsuccess = () => resolve(request.result?.value || null);
      request.onerror = () => reject(request.error);
    });
  }

  async function saveStateToDatabase(nextState) {
    if (!("indexedDB" in window)) return;

    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(DB_STORE, "readwrite");
      const store = transaction.objectStore(DB_STORE);
      const request = store.put({ key: DB_STATE_KEY, value: nextState, updatedAt: new Date().toISOString() });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  function isAuthenticated() {
    return sessionStorage.getItem(SESSION_KEY) === "ok";
  }

  function showLogin() {
    $("#loginShell").hidden = false;
    $("#appShell").hidden = true;
    $("#professionalReport").hidden = true;
  }

  function showApp() {
    $("#loginShell").hidden = true;
    if (!new URLSearchParams(window.location.search).get("professional")) {
      $("#appShell").hidden = false;
    }
  }

  function installLogin() {
    const form = $("#loginForm");
    const loginError = $("#loginError");

    if (isAuthenticated()) {
      showApp();
    } else {
      showLogin();
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if ($("#loginUser").value.trim() === AUTH_USER && $("#loginPassword").value === AUTH_PASSWORD) {
        sessionStorage.setItem(SESSION_KEY, "ok");
        loginError.textContent = "";
        $("#loginPassword").value = "";
        showApp();
        return;
      }

      loginError.textContent = "Login ou senha inválidos.";
    });

    $("#logoutButton")?.addEventListener("click", () => {
      sessionStorage.removeItem(SESSION_KEY);
      showLogin();
    });
  }

  function mirrorLocalStorageWrites() {
    const nativeSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      nativeSetItem.call(this, key, value);

      if (this === localStorage && key === STORAGE_KEY) {
        try {
          saveStateToDatabase(JSON.parse(value));
        } catch {
          saveStateToDatabase(value);
        }
      }
    };
  }

  async function restoreDatabaseState() {
    try {
      const databaseState = await loadStateFromDatabase();
      if (!databaseState) return;

      const databaseValue = JSON.stringify(databaseState);
      if (localStorage.getItem(STORAGE_KEY) !== databaseValue) {
        localStorage.setItem(STORAGE_KEY, databaseValue);
        window.location.reload();
      }
    } catch {
      // If IndexedDB is unavailable, the app keeps working with localStorage.
    }
  }

  mirrorLocalStorageWrites();
  installLogin();
  restoreDatabaseState();
})();
