/* TaskFlow Application Complete Matrix Framework Engine */
window.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. GLOBAL VARIABLES & HOOKS
  // ==========================================
  const avatarDatabase = {
    Ayoub: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100",
    Taha: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
    Hamza: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
    Doha: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
  };

  const loginViewportWall = document.getElementById("login-viewport-wall");
  const mainApplicationWorkspace = document.getElementById("main-application-workspace");
  const appAuthForm = document.getElementById("app-auth-form");
  const appRegisterForm = document.getElementById("app-register-form");
  const passwordInput = document.getElementById("auth-password");
  const passwordVisibilityTrigger = document.getElementById("password-visibility-trigger");
  const logoutInteractiveAnchor = document.getElementById("logout-interactive-anchor");
  const darkmodeSwitchNode = document.getElementById("darkmode-switch-node");

  const modalAddTask = document.getElementById("modal-container-add-task");
  const modalAddEvent = document.getElementById("modal-container-add-event");
  const formAddTask = document.getElementById("form-submit-node-add-task");

  const signInCard = document.getElementById("auth-signin-card");
  const signUpCard = document.getElementById("auth-signup-card");

  // ==========================================
  // 2. AUTHENTICATION & LOGIN LOGIC
  // ==========================================
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

  if (appAuthForm) {
    appAuthForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("auth-email").value.trim();
      const password = document.getElementById("auth-password").value;

      try {
        const response = await fetch("http://localhost:3000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("taskflow_token", data.token);

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

          if (loginViewportWall) loginViewportWall.classList.add("hidden");
          if (mainApplicationWorkspace) mainApplicationWorkspace.classList.remove("hidden");
        } else {
          alert(`Login Failed: ${data.error}`);
        }
      } catch (err) {
        console.error("Connection error:", err);
        alert("Failed to connect to the server.");
      }
    });
  }

  if (appRegisterForm) {
    appRegisterForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("reg-email").value.trim();
      const password = document.getElementById("reg-password").value;
      const confirmPassword = document.getElementById("reg-confirm-password").value;

      if (password !== confirmPassword) return alert("Passwords do not match!");

      try {
        const response = await fetch("http://localhost:3000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          alert("Account created successfully! Please log in.");
          signUpCard.classList.add("auth-view-hidden");
          signInCard.classList.remove("auth-view-hidden");
          appRegisterForm.reset();
        } else {
          const data = await response.json();
          alert(`Registration Error: ${data.error}`);
        }
      } catch (err) {
        console.error("Connection error:", err);
      }
    });
  }

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

  if (logoutInteractiveAnchor) {
    logoutInteractiveAnchor.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("taskflow_token");
      if (mainApplicationWorkspace) mainApplicationWorkspace.classList.add("hidden");
      if (loginViewportWall) loginViewportWall.classList.remove("hidden");
      if (appAuthForm) appAuthForm.reset();
    });
  }

  // ==========================================
  // 3. UI ROUTING & MODALS
  // ==========================================
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

  const openAddTaskTriggers = document.querySelectorAll(".global-add-task-modal-trigger");
  const generalModalDismissalElements = document.querySelectorAll(".modal-close-trigger-node");

  openAddTaskTriggers.forEach((btn) =>
    btn.addEventListener("click", () => modalAddTask && modalAddTask.classList.remove("hidden"))
  );

  generalModalDismissalElements.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (e.target === btn || btn.contains(e.target)) {
        if (modalAddTask) modalAddTask.classList.add("hidden");
      }
    });
  });

  if (darkmodeSwitchNode) {
    darkmodeSwitchNode.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode-activated");
    });
  }

  // ==========================================
  // 4. SETTINGS ENGINE (PROFILE SAVE)
  // ==========================================
  const profilePanel = document.getElementById("profile-panel");
  if (profilePanel) {
    const saveProfileBtn = profilePanel.querySelector(".form-actions-area button:last-child");
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            const inputs = profilePanel.querySelectorAll("input");
            const token = localStorage.getItem("taskflow_token");
            try {
                const response = await fetch("http://localhost:3000/api/profile", {
                    method: "PUT",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` 
                    },
                    body: JSON.stringify({ 
                        first_name: inputs[0].value, 
                        last_name: inputs[1].value, 
                        bio: inputs[3].value 
                    })
                });
                if (response.ok) alert("Settings saved successfully!");
            } catch (err) {
                console.error("Save settings error:", err);
            }
        });
    }
  }

  // ==========================================
  // 5. KANBAN ENGINE (LOAD, ADD, & DRAG/DROP)
  // ==========================================
  
  // A. Load Tasks
  async function loadTasks() {
    const token = localStorage.getItem("taskflow_token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:3000/api/tasks", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const tasks = await response.json();

        // 1. Grab all columns (Fixing the ID mismatch)
        const todoStack = document.getElementById("stack-todo-cards");
        const progressStack = document.getElementById("stack-in-progress-cards") || document.getElementById("stack-inprogress-cards");
        const doneStack = document.getElementById("stack-done-cards");

        // 2. Clear out old HTML to stop duplicates
        if (todoStack) todoStack.innerHTML = "";
        if (progressStack) progressStack.innerHTML = "";
        if (doneStack) doneStack.innerHTML = "";

        const getAvatarUrl = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&bold=true`;
        const currentSessionUser = document.querySelector(".u-name") ? document.querySelector(".u-name").innerText : "User";

        // 3. Render Cards
        tasks.forEach((task) => {
          const assigneeName = task.assignee || currentSessionUser;
          const taskHtml = `
            <div class="kanban-task-card-item" data-id="${task.id}" draggable="true">
                <div class="card-tag-wrapper ux-ui">Task</div>
                <h3 class="card-task-title-text">${task.title}</h3>
                <div class="card-footer-assignment-meta-row">
                    <div class="assignee-identity-badge">
                        <img src="${getAvatarUrl(assigneeName)}" alt="${assigneeName}">
                        <span>${assigneeName}</span>
                    </div>
                    <span class="card-timestamp-date">Today</span>
                </div>
            </div>
          `;

          if (task.status === "pending" && todoStack) {
            todoStack.insertAdjacentHTML("beforeend", taskHtml);
          } else if (task.status === "in-progress" && progressStack) {
            progressStack.insertAdjacentHTML("beforeend", taskHtml);
          } else if (task.status === "completed" && doneStack) {
            doneStack.insertAdjacentHTML("beforeend", taskHtml);
          }
        });
      }
    } catch (err) {
      console.error("Load tasks error:", err);
    }
  }

  // Load tasks immediately on startup
  loadTasks();

  // B. Add Task
  if (formAddTask) {
    formAddTask.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("task-title-input").value;
      const description = "New task created";
      const assigneeElement = document.getElementById("task-assignee-input");
      const assignee = assigneeElement ? assigneeElement.value : "Taha";
      const token = localStorage.getItem("taskflow_token");

      try {
        const response = await fetch("http://localhost:3000/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, description, assignee }),
        });

        if (response.ok) {
          formAddTask.reset();
          if (modalAddTask) modalAddTask.classList.add("hidden");
          loadTasks(); // Refreshes board instantly
        }
      } catch (err) {
        console.error("Save error:", err);
      }
    });
  }

  // C. Drag and Drop Engine
  let draggedCard = null;

  // Grab the card securely
  document.addEventListener("dragstart", (e) => {
    const card = e.target.closest(".kanban-task-card-item");
    if (card) {
      draggedCard = card;
      setTimeout(() => card.style.opacity = "0.5", 0);
    }
  });

  // Let go of the card
  document.addEventListener("dragend", (e) => {
    const card = e.target.closest(".kanban-task-card-item");
    if (card) {
      card.style.opacity = "1";
      draggedCard = null;
    }
  });

  // Setup the columns to catch the cards (Matching IDs)
  const kanbanColumns = [
    { element: document.getElementById("stack-todo-cards"), status: "pending" },
    { element: document.getElementById("stack-in-progress-cards") || document.getElementById("stack-inprogress-cards"), status: "in-progress" },
    { element: document.getElementById("stack-done-cards"), status: "completed" }
  ];

  kanbanColumns.forEach(col => {
    if (!col.element) return;

    col.element.addEventListener("dragover", (e) => {
      e.preventDefault();
      col.element.style.background = "rgba(0, 0, 0, 0.03)";
    });

    col.element.addEventListener("dragleave", () => {
      col.element.style.background = "";
    });

    col.element.addEventListener("drop", async (e) => {
      e.preventDefault();
      col.element.style.background = "";

      if (draggedCard) {
        col.element.appendChild(draggedCard); // Move visually
        const taskId = draggedCard.getAttribute("data-id");
        const token = localStorage.getItem("taskflow_token");

        try {
          // Save to DB
          await fetch(`http://localhost:3000/api/tasks/${taskId}/status`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ status: col.status })
          });
        } catch(err) {
            console.error("DB Update failed", err);
        }
      }
    });
  });
});