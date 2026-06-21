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
          
          loadTasks();
          loadProfile();
        } else {
          alert(`Login Failed: ${data.error}`);
        }
      } catch (err) {
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
  // 4. SETTINGS ENGINE (PROFILE & NOTIFICATIONS)
  // ==========================================
  const profilePanel = document.getElementById("profile-panel");
  if (profilePanel) {
    const buttons = profilePanel.querySelectorAll("button");
    let saveProfileBtn = null;
    buttons.forEach(btn => { if (btn.innerText.includes("Save")) saveProfileBtn = btn; });

    if (saveProfileBtn) {
        saveProfileBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            const inputs = profilePanel.querySelectorAll("input");
            const token = localStorage.getItem("taskflow_token");
            if (!token) return alert("ERROR: No login token found.");

            try {
                const payload = { 
                    first_name: inputs[0] ? inputs[0].value : "", 
                    last_name: inputs[1] ? inputs[1].value : "", 
                    email: inputs[2] ? inputs[2].value : "", 
                    bio: inputs[3] ? inputs[3].value : "" 
                };

                const response = await fetch("http://localhost:3000/api/profile", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    alert("Settings saved successfully!");
                } else {
                    const errorData = await response.json();
                    alert("SERVER REJECTED SAVE: " + (errorData.error || "Unknown error"));
                }
            } catch (err) {
                alert("NETWORK CRASH: Is your Node server running?");
            }
        });
    }
  }

  const notificationsPanel = document.getElementById("notifications-panel");
  if (notificationsPanel) {
      const toggleSwitches = notificationsPanel.querySelectorAll("input[type='checkbox']");
      toggleSwitches.forEach(toggle => {
          toggle.addEventListener("change", async () => {
              const token = localStorage.getItem("taskflow_token");
              if (!token) return;

              const payload = {
                  email_notifications: toggleSwitches[0] ? toggleSwitches[0].checked : false,
                  push_notifications: toggleSwitches[1] ? toggleSwitches[1].checked : false,
                  task_reminders: toggleSwitches[2] ? toggleSwitches[2].checked : false,
                  weekly_digest: toggleSwitches[3] ? toggleSwitches[3].checked : false
              };

              try {
                  await fetch("http://localhost:3000/api/notifications", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                      body: JSON.stringify(payload)
                  });
              } catch (err) {
                  console.error("Failed to auto-save notifications:", err);
              }
          });
      });
  }

  async function loadProfile() {
      const token = localStorage.getItem("taskflow_token");
      if (!token) return;

      try {
          const response = await fetch("http://localhost:3000/api/profile", {
              method: "GET",
              headers: { "Authorization": `Bearer ${token}` }
          });

          if (response.ok) {
              const data = await response.json();
              
              if (profilePanel) {
                  const inputs = profilePanel.querySelectorAll("input");
                  if (inputs[0]) inputs[0].value = data.first_name || "";
                  if (inputs[1]) inputs[1].value = data.last_name || "";
                  if (inputs[2]) inputs[2].value = data.email || ""; 
                  if (inputs[3]) inputs[3].value = data.bio || "";
              }

              if (notificationsPanel) {
                  const toggles = notificationsPanel.querySelectorAll("input[type='checkbox']");
                  if (toggles[0]) toggles[0].checked = !!data.email_notifications;
                  if (toggles[1]) toggles[1].checked = !!data.push_notifications;
                  if (toggles[2]) toggles[2].checked = !!data.task_reminders;
                  if (toggles[3]) toggles[3].checked = !!data.weekly_digest;
              }
          }
      } catch (err) {
          console.error("Failed to load profile:", err);
      }
  }

  loadProfile();

  // ==========================================
  // 5. KANBAN ENGINE (LOAD, ADD, DRAG/DROP, & DELETE)
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

        const todoStack = document.getElementById("stack-todo-cards");
        const progressStack = document.getElementById("stack-in-progress-cards") || document.getElementById("stack-inprogress-cards");
        const doneStack = document.getElementById("stack-done-cards");

        if (todoStack) todoStack.innerHTML = "";
        if (progressStack) progressStack.innerHTML = "";
        if (doneStack) doneStack.innerHTML = "";

        // 🔥 SMART AVATAR LOGIC
        const getAvatarUrl = (name) => {
            return avatarDatabase[name] || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&bold=true`;
        };
        const currentSessionUser = document.querySelector(".u-name") ? document.querySelector(".u-name").innerText : "User";

        tasks.forEach((task) => {
          // Grabs the name from the DB (e.g., "Ayoub"), or defaults to the logged-in user
          const assigneeName = task.assignee || currentSessionUser;
          
          const taskHtml = `
            <div class="kanban-task-card-item" data-id="${task.id}" draggable="true">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <div class="card-tag-wrapper ux-ui">Task</div>
                    <button class="delete-task-btn" title="Delete Task" style="background: none; border: none; font-size: 14px; cursor: pointer; opacity: 0.4; transition: 0.2s;" onmouseover="this.style.opacity='1'; this.style.transform='scale(1.1)';" onmouseout="this.style.opacity='0.4'; this.style.transform='scale(1)';">🗑️</button>
                </div>
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

  loadTasks();

  // B. Add Task
  if (formAddTask) {
    formAddTask.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("task-title-input").value;
      const description = "New task created";
      
      // 🔥 EXACT MATCH: Grabs the value directly from your <select id="task-assignee-select">
      const assigneeElement = document.getElementById("task-assignee-select");
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
          loadTasks(); 
        }
      } catch (err) {
        console.error("Save error:", err);
      }
    });
  }

  // C. Drag & Drop
  let draggedCard = null;

  document.addEventListener("dragstart", (e) => {
    const card = e.target.closest(".kanban-task-card-item");
    if (card) {
      draggedCard = card;
      setTimeout(() => card.style.opacity = "0.5", 0);
    }
  });

  document.addEventListener("dragend", (e) => {
    const card = e.target.closest(".kanban-task-card-item");
    if (card) {
      card.style.opacity = "1";
      draggedCard = null;
    }
  });

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
        col.element.appendChild(draggedCard); 
        const taskId = draggedCard.getAttribute("data-id");
        const token = localStorage.getItem("taskflow_token");

        try {
          await fetch(`http://localhost:3000/api/tasks/${taskId}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ status: col.status })
          });
        } catch(err) {
            console.error("DB Update failed", err);
        }
      }
    });
  });

  // D. Delete Task Engine
  document.addEventListener("click", async (e) => {
      const deleteBtn = e.target.closest(".delete-task-btn");
      if (deleteBtn) {
          const card = deleteBtn.closest(".kanban-task-card-item");
          const taskId = card.getAttribute("data-id");
          const token = localStorage.getItem("taskflow_token");

          if (confirm("Are you sure you want to delete this task?")) {
              try {
                  card.style.opacity = "0.5"; 
                  const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
                      method: "DELETE",
                      headers: { "Authorization": `Bearer ${token}` }
                  });

                  if (response.ok) {
                      card.remove(); 
                  } else {
                      card.style.opacity = "1";
                      alert("Failed to delete task from server.");
                  }
              } catch (err) {
                  console.error("Delete task error:", err);
                  card.style.opacity = "1";
              }
          }
      }
  });
});
// 6. DASHBOARD METRICS ENGINE
async function updateDashboardMetrics() {
    const token = localStorage.getItem("taskflow_token");
    if (!token) return;

    try {
        const response = await fetch("http://localhost:3000/api/tasks", { 
            headers: { "Authorization": `Bearer ${token}` } 
        });
        const tasks = await response.json();

        // 1. Calculate values
        const active = tasks.filter(t => t.status === 'pending').length;
        const inProgress = tasks.filter(t => t.status === 'in-progress').length;
        const completed = tasks.filter(t => t.status === 'completed').length;
        const today = new Date();
        const overdue = tasks.filter(t => t.due_date && new Date(t.due_date) < today && t.status !== 'completed').length;

        // 2. Map to your HTML classes
        const values = document.querySelectorAll(".metric-count-value");
        if (values.length >= 4) {
            values[0].innerText = active;
            values[1].innerText = inProgress;
            values[2].innerText = completed;
            values[3].innerText = overdue;
        }

        // 3. Greeting
        const hour = new Date().getHours();
        let timeOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
        const greetingEl = document.querySelector(".dashboard-header p");
        if (greetingEl) greetingEl.innerText = `Good ${timeOfDay}, ${document.querySelector(".u-name")?.innerText || 'User'} 👋`;

    } catch (err) { console.error("Dashboard update failed:", err); }
}

// Ensure this runs when the page loads
updateDashboardMetrics();
async function renderDashboardTasks() {
    const listContainer = document.querySelector(".dashboard-list-items-vertical-stack");
    if (!listContainer) return;

    const token = localStorage.getItem("taskflow_token");
    if (!token) return;

    try {
        const response = await fetch("http://localhost:3000/api/tasks", { 
            headers: { "Authorization": `Bearer ${token}` } 
        });
        const tasks = await response.json();
        
        // Filter only active tasks (limit to 5)
        const activeTasks = tasks.filter(t => t.status !== 'completed').slice(0, 5);

        listContainer.innerHTML = ""; // Wipe the static HTML placeholders

        activeTasks.forEach(task => {
            // Map category to your specific CSS class names
            const categoryClass = {
                "UX/UI": "ux-ui",
                "Bug": "bug-tag",
                "Meeting": "meeting-tag",
                "Backend": "backend"
            }[task.category] || "backend";

            listContainer.insertAdjacentHTML("beforeend", `
                <div class="list-row-task-item">
                    <div class="list-item-left-content">
                        <i class="fa-solid fa-list-check item-bullet-ico"></i>
                        <span>${task.title}</span>
                    </div>
                    <div class="card-tag-wrapper ${categoryClass} text-scaled-down">
                        ${task.category || 'General'}
                    </div>
                </div>
            `);
        });
    } catch (err) {
        console.error("Dashboard list render failed:", err);
    }
}

// Call this inside your loadDashboard function!
renderDashboardTasks();