/* TaskFlow Application Complete Matrix Framework Engine*/
window.addEventListener('DOMContentLoaded', () => {

    //  GLOBAL AVATAR DATABASE //
    const avatarDatabase = {
        "Ayoub": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100",
        "Taha": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
        "Hamza": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
        "Doha": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
    };

    
    //  DOM CORE HOOK ATTACHMENTS//
    const loginViewportWall = document.getElementById('login-viewport-wall');
    const mainApplicationWorkspace = document.getElementById('main-application-workspace');
    const appAuthForm = document.getElementById('app-auth-form');
    
    const passwordInput = document.getElementById('auth-password');
    const passwordVisibilityTrigger = document.getElementById('password-visibility-trigger');
    const logoutInteractiveAnchor = document.getElementById('logout-interactive-anchor');
    const darkmodeSwitchNode = document.getElementById('darkmode-switch-node');

    // Modals Containers Mapping Nodes
    const modalAddTask = document.getElementById('modal-container-add-task');
    const modalAddEvent = document.getElementById('modal-container-add-event');
    const formAddTask = document.getElementById('form-submit-node-add-task');
    const formAddEvent = document.getElementById('form-submit-node-add-event');


 // 2. SUB-PAGES ROUTER SUB-SYSTEM LOGIC (DESKTOP + MOBILE SUPPORT)//

const navigationMenuItems = document.querySelectorAll('.sidebar-nav-item-link, .figma-nav-item');
const viewspaceRoutedPanels = document.querySelectorAll('.workspace-routed-view-panel-node');

navigationMenuItems.forEach(menuItem => {
    menuItem.addEventListener('click', (e) => {
    
        e.preventDefault(); 
        
      
        const navigationTargetId = menuItem.getAttribute('data-navigation-target');
        if (!navigationTargetId) return;

      
        navigationMenuItems.forEach(item => item.classList.remove('active'));
        viewspaceRoutedPanels.forEach(panel => panel.classList.remove('active'));

      
        menuItem.classList.add('active');
        
      
        const targetPanelNode = document.getElementById(navigationTargetId);
        if (targetPanelNode) {
            targetPanelNode.classList.add('active');
        }
    });
});
    
    // 3. SECURE AUTH VISUAL BYPASS ROUTER MECHANISM (FIXED MAIN AVATAR)//
    if (passwordVisibilityTrigger && passwordInput) {
        passwordVisibilityTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                passwordVisibilityTrigger.innerHTML = `<i class="fa-regular fa-eye"></i>`;
            } else {
                passwordInput.type = 'password';
                passwordVisibilityTrigger.innerHTML = `<i class="fa-regular fa-eye-slash"></i>`;
            }
        });
    }

    if (appAuthForm) {
        appAuthForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Extraction d l-ism dynamic
            const userInputField = appAuthForm.querySelector('input[type="text"]') || appAuthForm.querySelector('input[type="email"]');
            const nameElement = document.querySelector('.u-name');
            const roleElement = document.querySelector('.u-role');

            if (userInputField && userInputField.value.trim() !== "") {
                let rawValue = userInputField.value.trim();
                let cleanName = rawValue.split('@')[0];
                
                // Capitalize (ayoub -> Ayoub)
                cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
                
                // Injection fl-HTML
                if (nameElement) nameElement.innerText = cleanName;
                
                // 🌟 FIX: Changer la photo d'avatar principale (Header / Sidebar)
                if (nameElement) {
                
                    const mainProfileImg = nameElement.parentElement.querySelector('img');
                    if (mainProfileImg) {
                        const profileAvatarUrl = avatarDatabase[cleanName] || `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=random&color=fff&bold=true`;
                        mainProfileImg.src = profileAvatarUrl;
                    }
                }
                
                // Changement d l-role otomatik
                if (roleElement) {
                    if (cleanName.toLowerCase() === "doha") {
                        roleElement.innerText = "UX/UI Designer";
                    } else {
                        roleElement.innerText = "Front-end Developer";
                    }
                }
            }
            
            // Switch view layers flawlessly
            loginViewportWall.classList.add('hidden');
            mainApplicationWorkspace.classList.remove('hidden');
        });
    }

    if (logoutInteractiveAnchor) {
        logoutInteractiveAnchor.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Return variables arrays settings flags cleanly back to defaults 
            mainApplicationWorkspace.classList.add('hidden');
            loginViewportWall.classList.remove('hidden');
            
            if (appAuthForm) appAuthForm.reset();
            if (passwordInput) passwordInput.type = 'password';
            if (passwordVisibilityTrigger) passwordVisibilityTrigger.innerHTML = `<i class="fa-regular fa-eye-slash"></i>`;
        });
    }


    // 4. SYSTEM DIALOG WINDOWS EVENT INTERPOLATION// 
    const openAddTaskTriggers = document.querySelectorAll('.global-add-task-modal-trigger');
    const openAddEventTriggers = document.querySelectorAll('.global-add-event-modal-trigger');
    const generalModalDismissalElements = document.querySelectorAll('.modal-close-trigger-node');

    openAddTaskTriggers.forEach(btnTrigger => {
        btnTrigger.addEventListener('click', () => modalAddTask.classList.remove('hidden'));
    });

    openAddEventTriggers.forEach(btnTrigger => {
        btnTrigger.addEventListener('click', () => modalAddEvent.classList.remove('hidden'));
    });

    generalModalDismissalElements.forEach(dismissalBtn => {
        dismissalBtn.addEventListener('click', (e) => {
            if (e.target === dismissalBtn || dismissalBtn.contains(e.target)) {
                modalAddTask.classList.add('hidden');
                modalAddEvent.classList.add('hidden');
            }
        });
    });

    // Close overlays securely by backdrop clicking processes
    [modalAddTask, modalAddEvent].forEach(modalBoxOverlay => {
        modalBoxOverlay.addEventListener('click', (e) => {
            if (e.target === modalBoxOverlay) {
                modalBoxOverlay.classList.add('hidden');
            }
        });
    });


    // 5. DATA INGESTION CRUD FORM SIMULATION HANDLERS// 
    if (formAddTask) {
        formAddTask.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const taskTitleValue = document.getElementById('task-title-input').value;
            
            
            const currentSessionUser = document.querySelector('.u-name') ? document.querySelector('.u-name').innerText : "User";
            const taskAssigneeValue = document.getElementById('task-assignee-select').value || currentSessionUser;

            // avtar generation
            const finalAvatarUrl = avatarDatabase[taskAssigneeValue] || `https://ui-avatars.com/api/?name=${encodeURIComponent(taskAssigneeValue)}&background=random&color=fff&bold=true`;
            
            // Programmatically construct high fidelity functional Kanban layout node inside DOM structure
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
            
            const targetTodoStackDropzone = document.getElementById('stack-todo-cards');
            if (targetTodoStackDropzone) {
                targetTodoStackDropzone.insertAdjacentHTML('beforeend', newCardItemHtmlTemplate);
            }
            
            // Clear workflow modal variables settings states tracking values cleanly
            formAddTask.reset();
            modalAddTask.classList.add('hidden');
        });
    }

    if (formAddEvent) {
        formAddEvent.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const eventTitleValue = document.getElementById('event-title-input').value;
            
            // Auto inject dynamic notification item box inside Today calendar highlight target
            const targetCalendarContainerTodayCell = document.querySelector('.date-cell.active-current-today-highlight-box');
            if (targetCalendarContainerTodayCell) {
                const dynamicPillNodeElement = document.createElement('div');
                dynamicPillNodeElement.className = 'calendar-event-pill event-purple';
                dynamicPillNodeElement.textContent = eventTitleValue;
                targetCalendarContainerTodayCell.appendChild(dynamicPillNodeElement);
            }
            
            formAddEvent.reset();
            modalAddEvent.classList.add('hidden');
        });
    }


    // 6. CENTRAL THEME TOGGLE (DARK MODE MATRIX OVERRIDES) //
    if (darkmodeSwitchNode) {
        darkmodeSwitchNode.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode-activated');
            console.log("System Theme Status: Parameter Shift Registered.");
        });
    }

});