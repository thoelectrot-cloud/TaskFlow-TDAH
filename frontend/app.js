/* TaskFlow Application Complete Matrix Framework Engine */
window.addEventListener("DOMContentLoaded", () => {
  // 1. GLOBAL AVATAR DATABASE //
  const avatarDatabase = {
    Ayoub: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100",
    Taha: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
    Hamza: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
    Doha: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
  };

  // 2. DOM CORE HOOK ATTACHMENTS //
  const loginViewportWall = document.getElementById("login-viewport-wall");
  const mainApplicationWorkspace = document.getElementById("main-application-workspace");
  const appAuthForm = document.getElementById("app-auth-form");
  const appRegisterForm = document.getElementById("app-register-form");

  const passwordInput = document.getElementById("auth-password");
  const passwordVisibilityTrigger = document.getElementById("password-visibility-trigger");
  const logoutInteractiveAnchor = document.getElementById("logout-interactive-anchor");
  const darkmodeSwitchNode = document.getElementById("darkmode-switch-node");

  // Modals
  const modalAddTask = document.getElementById("modal-container-add-task");
  const modalAddEvent = document.getElementById("modal-container-add-event");
  const formAddTask = document.getElementById("form-submit-node-add-task");
  const formAddEvent = document.getElementById("form-submit-node-add-event");

  const signInCard = document.getElementById("auth-signin-card");
  const signUpCard = document.getElementById("auth-signup-card");

  // 3. SECURE AUTH VISUAL BYPASS ROUTER MECHANISM //
  if (passwordVisibilityTrigger && passwordInput) {
    passwordVisibilityTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        passwordVisibilityTrigger.innerHTML = `<i class="fa-regular fa-eye"></i>`;
      } else {
        passwordInput.type = "password";
        passwordVisibilityTrigger.innerHTML = `<i class="fa-regular fa-eye-slash"></i>`;
      }
    });
  }

  // ==========================================
  // REAL BACK-END LOGIN (SIGN IN)
  // ==========================================
  if (appAuthForm) {
    appAuthForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("auth-email").value.trim();
      const password = document.getElementById("auth-password").value;

      try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
          // Save the token!
          localStorage.setItem('taskflow_token', data.token);

          // Update UI Profile Name
          let cleanName = email.split("@")[0];
          cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
          
          const nameElement = document.querySelector(".u-name");
          const roleElement = document.querySelector(".u-role");

          if (nameElement) {
            nameElement.innerText = cleanName;
            const mainProfileImg = nameElement.parentElement.querySelector("img");
            if (mainProfileImg) {
              const profileAvatarUrl = avatarDatabase[cleanName] || `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=random&color=fff&bold=true`;
              mainProfileImg.src = profileAvatarUrl;
            }
          }

          if (roleElement) {
            roleElement.innerText = cleanName.toLowerCase() === "doha" ? "UX/UI Designer" : "Front-end Developer";
          }

          // Switch to workspace
          if (loginViewportWall) loginViewportWall.classList.add("hidden");
          if (mainApplicationWorkspace) mainApplicationWorkspace.classList.remove("hidden");
          
        } else {
          alert(`Login Failed: ${data.error}`);
        }
      } catch (err) {
        console.error("Connection error:", err);
        alert("Failed to connect to the server. Is the backend running?");
      }
    });
  }

  // ==========================================
  // REAL BACK-END REGISTRATION (SIGN UP)
  // ==========================================
  if (appRegisterForm) {
    appRegisterForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("reg-email").value.trim();
      const password = document.getElementById("reg-password").value;
      const confirmPassword = document.getElementById("reg-confirm-password").value;

      if (password !== confirmPassword) {
        return alert("Passwords do not match!");
      }

      try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
          alert('Account created successfully! Please log in.');
          // Switch to Login Card
          signUpCard.classList.add("auth-view-hidden");
          signInCard.classList.remove("auth-view-hidden");
          appRegisterForm.reset();
        } else {
          alert(`Registration Error: ${data.error}`);
        }
      } catch (err) {
        console.error("Connection error:", err);
        alert("Failed to connect to the server.");
      }
    });
  }

  // 4. LOGOUT LOGIC //
  if (logoutInteractiveAnchor) {
    logoutInteractiveAnchor.addEventListener("click", (e) => {
      e.preventDefault();
      
      // Clear token
      localStorage.removeItem('taskflow_token');

      if (mainApplicationWorkspace) mainApplicationWorkspace.classList.add("hidden");
      if (loginViewportWall) loginViewportWall.classList.remove("hidden");

      if (appAuthForm) appAuthForm.reset();
      if (passwordInput) passwordInput.type = "password";
      if (passwordVisibilityTrigger) passwordVisibilityTrigger.innerHTML = `<i class="fa-regular fa-eye-slash"></i>`;
    });
  }

  // 5. SUB-PAGES ROUTER //
  const navigationMenuItems = document.querySelectorAll(".sidebar-nav-item-link, .figma-nav-item");
  const viewspaceRoutedPanels = document.querySelectorAll(".workspace-routed-view-panel-node");

  navigationMenuItems.forEach((menuItem) => {
    menuItem.addEventListener("click", (e) => {
      e.preventDefault();
      const navigationTargetId = menuItem.getAttribute("data-navigation-target");
      if (!navigationTargetId) return;

      navigationMenuItems.forEach((item) => item.classList.remove("active"));
      viewspaceRoutedPanels.forEach((panel) => panel.classList.remove("active"));

      menuItem.classList.add("active");
      const targetPanelNode = document.getElementById(navigationTargetId);
      if (targetPanelNode) targetPanelNode.classList.add("active");
    });
  });

  // 6. SYSTEM DIALOG WINDOWS //
  const openAddTaskTriggers = document.querySelectorAll(".global-add-task-modal-trigger");
  const openAddEventTriggers = document.querySelectorAll(".global-add-event-modal-trigger");
  const generalModalDismissalElements = document.querySelectorAll(".modal-close-trigger-node");

  openAddTaskTriggers.forEach((btn) => btn.addEventListener("click", () => modalAddTask && modalAddTask.classList.remove("hidden")));
  openAddEventTriggers.forEach((btn) => btn.addEventListener("click", () => modalAddEvent && modalAddEvent.classList.remove("hidden")));

  generalModalDismissalElements.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (e.target === btn || btn.contains(e.target)) {
        if (modalAddTask) modalAddTask.classList.add("hidden");
        if (modalAddEvent) modalAddEvent.classList.add("hidden");
      }
    });
  });

  [modalAddTask, modalAddEvent].forEach((modalBoxOverlay) => {
    if (modalBoxOverlay) {
      modalBoxOverlay.addEventListener("click", (e) => {
        if (e.target === modalBoxOverlay) modalBoxOverlay.classList.add("hidden");
      });
    }
  });

  // 7. TASK & EVENT FORMS //
  if (formAddTask) {
    formAddTask.addEventListener("submit", (e) => {
      e.preventDefault();
      const taskTitleValue = document.getElementById("task-title-input").value;
      const currentSessionUser = document.querySelector(".u-name") ? document.querySelector(".u-name").innerText : "User";
      const taskAssigneeValue = document.getElementById("task-assignee-select").value || currentSessionUser;
      const finalAvatarUrl = avatarDatabase[taskAssigneeValue] || `https://ui-avatars.com/api/?name=${encodeURIComponent(taskAssigneeValue)}&background=random&color=fff&bold=true`;

      const newCardItemHtmlTemplate = `
        <div class="kanban-task-card-item">
            <div class="card-tag-wrapper ux-ui">Task</div>
            <h3 class="card-task-title-text">${taskTitleValue}</h3>
            <div class="card-footer-assignment-meta-row">
                <div class="assignee-identity-badge">
                    <img src="${finalAvatarUrl}" alt="${taskAssigneeValue}">
                    <span>${taskAssigneeValue}</span>
                </div>
                <span class="card-timestamp-date">Today</span>
            </div>
        </div>
      `;

      const targetTodoStackDropzone = document.getElementById("stack-todo-cards");
      if (targetTodoStackDropzone) targetTodoStackDropzone.insertAdjacentHTML("beforeend", newCardItemHtmlTemplate);

      formAddTask.reset();
      if (modalAddTask) modalAddTask.classList.add("hidden");
    });
  }

  if (formAddEvent) {
    formAddEvent.addEventListener("submit", (e) => {
      e.preventDefault();
      const eventTitleValue = document.getElementById("event-title-input").value;
      const targetCalendarContainerTodayCell = document.querySelector(".date-cell.active-current-today-highlight-box");
      
      if (targetCalendarContainerTodayCell) {
        const dynamicPillNodeElement = document.createElement("div");
        dynamicPillNodeElement.className = "calendar-event-pill event-purple";
        dynamicPillNodeElement.textContent = eventTitleValue;
        targetCalendarContainerTodayCell.appendChild(dynamicPillNodeElement);
      }

      formAddEvent.reset();
      if (modalAddEvent) modalAddEvent.classList.add("hidden");
    });
  }

  // 8. THEME TOGGLE //
  if (darkmodeSwitchNode) {
    darkmodeSwitchNode.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode-activated");
    });
  }

  // 9. SIGN IN / SIGN UP CARD SWITCHER //
  const signUpTrigger = document.querySelector(".inline-register-trigger");
  const signInTrigger = document.querySelector(".inline-login-trigger");

  if (signUpTrigger && signInTrigger && signInCard && signUpCard) {
    signUpTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      signInCard.classList.add("auth-view-hidden");
      signUpCard.classList.remove("auth-view-hidden");
    });

    signInTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      signUpCard.classList.add("auth-view-hidden");
      signInCard.classList.remove("auth-view-hidden");
    });
  }
});