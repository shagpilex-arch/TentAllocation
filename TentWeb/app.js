(() => {
    "use strict";

    if (!window.campPasswordUnlocked) {
        return;
    }

    const AppVersion = "1.5.0";
    const TentCardWidth = 170;
    const TentCardHeight = 145;
    const PersonCardWidth = 92;
    const PersonCardHeight = 84;
    const SiteItemCardWidth = 92;
    const SiteItemCardHeight = 90;
    const TentPitchHorizontalSpacing = 280;
    const LegacyTentPitchHorizontalSpacing = 240;
    const TentPitchVerticalSpacing = 310;
    const LegacyTentPitchVerticalSpacing = 420;
    const DefaultTentStartX = 24;
    const DefaultTentStartY = 18;
    const DefaultTentColumns = 3;
    const LegacyDefaultTentColumns = 5;
    const OccupantGap = 10;
    const OccupantColumns = 2;
    const CanvasContentPadding = 24;
    const GridSnapSize = 20;
    const MaxUndoStates = 50;
    const ZoomLevels = [0.75, 0.9, 1.0, 1.15, 1.3];
    const CollaborationPath = "campTentPlannerSessions";
    // Paste your Firebase web app config here before publishing collaboration.
    const CollaborationConfig = {
        apiKey: "AIzaSyAC4rGNZVQLv4fSvcQ2YXuoIeizzGdaZn8",
        authDomain: "tentplanner-3a5ce.firebaseapp.com",
        databaseURL: "https://tentplanner-3a5ce-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "tentplanner-3a5ce",
        appId: "1:488435840170:web:9c4be854ff9e8ec90b8cd3"
    };

    const PersonType = ["Camper", "Adult", "YoungLeader"];
    const Gender = ["Male", "Female", "Other"];
    const CamperType = ["Standard", "Beaver", "Cub", "Scout", "Explorer"];
    const TentAccommodationType = ["Tent", "BunkRoom"];
    const TentType = ["GreenPatrolTent", "BlueDomeTent", "OrangeHikeTent", "PurpleLeaderTent", "GreyOtherTent"];
    const SiteItemType = ["MessTent", "StorageTent", "FlagPole", "Fire", "KitchenTent", "EventShelter"];

    const TentTypeLabels = ["Green", "Blue", "Orange", "Purple", "Grey"];
    const TentTypeNames = ["Green tent", "Blue tent", "Orange tent", "Purple tent", "Grey tent"];
    const SiteItemTypeLabels = ["Mess Tent", "Storage Tent", "Flag Pole", "Fire", "Kitchen Tent", "Event Shelter"];
    const SizeOptions = [
        { label: "Small (3-person)", value: 0.85 },
        { label: "Standard", value: 1.0 },
        { label: "Large (6-person)", value: 1.25 },
        { label: "Extra large", value: 1.5 }
    ];
    const SiteSizeOptions = [
        { label: "Small", value: 0.85 },
        { label: "Standard", value: 1.0 },
        { label: "Large", value: 1.25 },
        { label: "Extra large", value: 1.5 }
    ];

    const dom = {};
    const state = {
        project: createNewProject(),
        currentFileName: null,
        isDirty: false,
        selectedTentIds: new Set(),
        undoStack: [],
        redoStack: [],
        lastSnapshot: "",
        validationWarnings: [],
        friendLabels: {},
        snapToGrid: true,
        zoomIndex: 2,
        canvasWidth: 1,
        canvasHeight: 1,
        drag: null,
        suppressNextClick: false,
        collaboration: {
            clientId: createId(),
            mode: null,
            code: null,
            db: null,
            ref: null,
            patchRef: null,
            participantRef: null,
            connectedRef: null,
            connected: false,
            applyingRemote: false,
            authUid: null,
            lastPatchId: null,
            lastPublishedSnapshot: ""
        }
    };

    document.addEventListener("DOMContentLoaded", init);

    function init() {
        bindDom();
        bindEvents();
        state.lastSnapshot = captureProjectSnapshot();
        refreshUI();
        requestAnimationFrame(refreshUI);
        setTimeout(refreshUI, 150);
    }

    function bindDom() {
        dom.app = document.getElementById("app");
        dom.canvasScroll = document.getElementById("canvasScroll");
        dom.canvasScaleHost = document.getElementById("canvasScaleHost");
        dom.mainCanvas = document.getElementById("mainCanvas");
        dom.unallocatedBorder = document.getElementById("unallocatedBorder");
        dom.unallocatedPanel = document.getElementById("unallocatedPanel");
        dom.versionLabel = document.getElementById("versionLabel");
        dom.campNameLabel = document.getElementById("campNameLabel");
        dom.campDateLabel = document.getElementById("campDateLabel");
        dom.collaborationStatus = document.getElementById("collaborationStatus");
        dom.statsLabel = document.getElementById("statsLabel");
        dom.snapToGrid = document.getElementById("snapToGrid");
        dom.warningsPanel = document.getElementById("warningsPanel");
        dom.zoomSlider = document.getElementById("zoomSlider");
        dom.zoomLevelLabel = document.getElementById("zoomLevelLabel");
        dom.modalRoot = document.getElementById("modalRoot");
        dom.contextMenu = document.getElementById("contextMenu");
        dom.openFileInput = document.getElementById("openFileInput");
        dom.csvFileInput = document.getElementById("csvFileInput");
        dom.undoMenuItem = document.getElementById("undoMenuItem");
        dom.redoMenuItem = document.getElementById("redoMenuItem");
    }

    function bindEvents() {
        document.addEventListener("click", handleDocumentClick);
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("pointermove", handlePointerMove);
        document.addEventListener("pointerup", handlePointerUp);
        document.addEventListener("pointercancel", cancelDrag);
        document.addEventListener("mousemove", handlePointerMove);
        document.addEventListener("mouseup", handlePointerUp);
        document.addEventListener("contextmenu", handleContextMenu);
        window.addEventListener("resize", debounce(refreshUI, 80));
        window.addEventListener("pagehide", markCollaborationParticipantDisconnecting);
        window.addEventListener("beforeunload", event => {
            if (!state.isDirty) {
                return;
            }
            event.preventDefault();
            event.returnValue = "";
        });

        dom.snapToGrid.addEventListener("change", () => {
            state.snapToGrid = dom.snapToGrid.checked;
        });
        dom.zoomSlider.addEventListener("input", () => {
            state.zoomIndex = clamp(parseInt(dom.zoomSlider.value, 10), 0, ZoomLevels.length - 1);
            refreshUI();
        });
        dom.openFileInput.addEventListener("change", handleOpenFileSelected);
        dom.csvFileInput.addEventListener("change", handleCsvFileSelected);
        dom.canvasScroll.addEventListener("scroll", hideContextMenu);
    }

    function handleDocumentClick(event) {
        const actionButton = event.target.closest("[data-action]");
        if (actionButton && !actionButton.disabled) {
            hideMenus();
            runAction(actionButton.dataset.action, actionButton.dataset);
            return;
        }

        const menuButton = event.target.closest(".menu-button, .menu-dropdown .submenu > button");
        if (menuButton) {
            event.stopPropagation();
            toggleMenu(menuButton.parentElement);
            return;
        }

        if (!event.target.closest(".menu-node")) {
            hideMenus();
        }
        if (!event.target.closest(".context-menu")) {
            hideContextMenu();
        }
    }

    async function runAction(action, data = {}) {
        switch (action) {
            case "new": await actionNew(); break;
            case "open": await actionOpen(); break;
            case "save": await actionSave(false); break;
            case "save-as": await actionSave(true); break;
            case "exit": await actionExit(); break;
            case "undo": undoLastChange(); break;
            case "redo": redoLastChange(); break;
            case "edit-camp": await editCampDetails(); break;
            case "add-tent": await addTent(); break;
            case "add-person": await addPerson(); break;
            case "add-site-item": await addSiteItem(); break;
            case "bulk-add": await bulkAddPeople(); break;
            case "import-csv": await importPeopleFromCsv(); break;
            case "download-sample-csv": downloadSampleCsv(); break;
            case "add-friend": await addFriendLink(); break;
            case "remove-friend": await removeFriendLink(); break;
            case "add-foe": await addFoeLink(); break;
            case "remove-foe": await removeFoeLink(); break;
            case "arrange-tents": await arrangeTentsNeatly(); break;
            case "clear-allocations": await clearAllAllocations(); break;
            case "make-table": showTablePreview(); break;
            case "export-table-pdf": await exportTablePdf(); break;
            case "export-layout-pdf": await exportLayoutPdf(); break;
            case "export-tags-pdf": await exportTentTagsPdf(); break;
            case "edit-tent": await chooseAndEditTent(); break;
            case "duplicate-tent": await chooseAndDuplicateTent(); break;
            case "delete-tent": await chooseAndDeleteTent(); break;
            case "edit-person": await chooseAndEditPerson(); break;
            case "delete-person": await chooseAndDeletePerson(); break;
            case "edit-site-item": await chooseAndEditSiteItem(); break;
            case "delete-site-item": await chooseAndDeleteSiteItem(); break;
            case "fit-screen": fitCanvasToScreen(); break;
            case "collaborate": await showCollaborationDialog(); break;
            case "about": showAbout(); break;
        }
    }

    function toggleMenu(node) {
        const alreadyOpen = node.classList.contains("open");
        if (!node.classList.contains("submenu")) {
            hideMenus();
        }
        node.classList.toggle("open", !alreadyOpen);
        positionMenus();
    }

    function hideMenus() {
        document.querySelectorAll(".menu-node.open").forEach(node => node.classList.remove("open"));
    }

    function positionMenus() {
        document.querySelectorAll(".menu-node.open > .menu-dropdown").forEach(menu => {
            const parentRect = menu.parentElement.getBoundingClientRect();
            if (menu.classList.contains("submenu-dropdown")) {
                menu.style.left = `${parentRect.right}px`;
                menu.style.top = `${parentRect.top}px`;
            } else {
                menu.style.left = `${parentRect.left}px`;
                menu.style.top = `${parentRect.bottom}px`;
            }
            const rect = menu.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
                menu.style.left = `${Math.max(0, window.innerWidth - rect.width - 4)}px`;
            }
            if (rect.bottom > window.innerHeight) {
                menu.style.top = `${Math.max(0, window.innerHeight - rect.height - 4)}px`;
            }
        });
    }

    function handleKeyDown(event) {
        const key = event.key.toLowerCase();
        if (event.ctrlKey && key === "s") {
            event.preventDefault();
            actionSave(false);
        } else if (event.ctrlKey && key === "z") {
            event.preventDefault();
            undoLastChange();
        } else if (event.ctrlKey && key === "y") {
            event.preventDefault();
            redoLastChange();
        } else if (event.altKey && key === "t") {
            event.preventDefault();
            addTent();
        } else if ((event.altKey && key === "c") || (event.ctrlKey && key === "p")) {
            event.preventDefault();
            addPerson();
        } else if (event.key === "Escape") {
            hideMenus();
            hideContextMenu();
        }
    }

    function createNewProject() {
        const now = new Date();
        now.setDate(now.getDate() + 7);
        return normalizeProject({
            schemaVersion: 1,
            id: createId(),
            name: "My Camp",
            campDate: now.toISOString(),
            tents: [],
            siteItems: [],
            people: [],
            friendLinks: [],
            foeLinks: [],
            friendGroups: [],
            allocations: [],
            lastModified: new Date().toISOString()
        });
    }

    function newPerson(name, gender, personType) {
        return normalizePerson({
            id: createId(),
            name,
            gender,
            personType,
            camperType: "Standard",
            notes: "",
            tentId: null,
            x: 0,
            y: 0
        }, new Set());
    }

    function newTent(name, tentType) {
        return normalizeTent({
            id: createId(),
            name,
            tentType,
            accommodationType: "Tent",
            colour: getDefaultTentColour(tentType),
            notes: "",
            x: 100,
            y: 100,
            sizeScale: 1.0
        });
    }

    function newSiteItem(name, itemType) {
        return normalizeSiteItem({
            id: createId(),
            name,
            itemType,
            colour: getDefaultSiteItemColour(itemType),
            x: 100,
            y: 100,
            sizeScale: getDefaultSiteItemScale(itemType)
        });
    }

    function normalizeProject(project, applyExistingAllocations = false) {
        project = project && typeof project === "object" ? project : {};
        project.schemaVersion = Math.max(Number(project.schemaVersion) || 1, 1);
        project.id = ensureId(project.id);
        project.name = cleanName(project.name, "My Camp");
        project.campDate = normalizeDate(project.campDate, 7);
        project.lastModified = normalizeDate(project.lastModified, 0);
        project.tents = array(project.tents).map(normalizeTent);
        project.siteItems = array(project.siteItems).map(normalizeSiteItem);
        const validTentIds = new Set(project.tents.map(t => t.id));
        project.people = array(project.people).map(person => normalizePerson(person, validTentIds));
        const peopleIds = new Set(project.people.map(p => p.id));
        project.friendLinks = normalizeLinks(array(project.friendLinks), peopleIds);
        project.foeLinks = normalizeLinks(array(project.foeLinks), peopleIds);
        project.friendGroups = array(project.friendGroups).map(group => ({
            id: ensureId(group.id),
            personIds: array(group.personIds).filter(id => peopleIds.has(id))
        }));
        project.allocations = array(project.allocations).filter(a => a && a.personId).map(a => ({
            personId: String(a.personId),
            tentId: a.tentId && validTentIds.has(a.tentId) ? a.tentId : null
        }));
        if (applyExistingAllocations) {
            applyAllocationsIfPresent(project);
        }
        syncAllocationsFromPeople(project);
        syncFriendGroupsFromLinks(project);
        return project;
    }

    function normalizeTent(tent) {
        tent = tent && typeof tent === "object" ? tent : {};
        const tentType = normalizeEnum(tent.tentType, TentType, "GreenPatrolTent");
        const accommodationType = normalizeEnum(tent.accommodationType, TentAccommodationType, "Tent");
        return {
            id: ensureId(tent.id),
            name: cleanName(tent.name, "Tent"),
            tentType,
            accommodationType,
            colour: isHexColour(tent.colour) ? tent.colour : getDefaultTentColour(tentType),
            notes: cleanString(tent.notes),
            x: normalizeCoordinate(tent.x),
            y: normalizeCoordinate(tent.y),
            sizeScale: normalizeScale(Number(tent.sizeScale) || 1)
        };
    }

    function normalizeSiteItem(item) {
        item = item && typeof item === "object" ? item : {};
        const itemType = normalizeEnum(item.itemType, SiteItemType, "MessTent");
        return {
            id: ensureId(item.id),
            name: cleanName(item.name, "Site Item"),
            itemType,
            colour: isHexColour(item.colour) ? item.colour : getDefaultSiteItemColour(itemType),
            x: normalizeCoordinate(item.x),
            y: normalizeCoordinate(item.y),
            sizeScale: normalizeScale(Number(item.sizeScale) || getDefaultSiteItemScale(itemType))
        };
    }

    function normalizePerson(person, validTentIds) {
        person = person && typeof person === "object" ? person : {};
        const tentId = person.tentId && validTentIds.has(person.tentId) ? person.tentId : null;
        return {
            id: ensureId(person.id),
            name: cleanName(person.name, "Unnamed person"),
            gender: normalizeEnum(person.gender, Gender, "Male"),
            personType: normalizeEnum(person.personType, PersonType, "Camper"),
            camperType: normalizeEnum(person.camperType, CamperType, "Standard"),
            notes: cleanString(person.notes),
            tentId,
            x: normalizeCoordinate(person.x),
            y: normalizeCoordinate(person.y)
        };
    }

    function normalizeLinks(links, peopleIds) {
        const seen = new Set();
        const result = [];
        for (const link of links) {
            if (!link || !peopleIds.has(link.personAId) || !peopleIds.has(link.personBId) || link.personAId === link.personBId) {
                continue;
            }
            const key = buildLinkKey(link.personAId, link.personBId);
            if (seen.has(key)) {
                continue;
            }
            seen.add(key);
            result.push({
                id: ensureId(link.id),
                personAId: link.personAId,
                personBId: link.personBId
            });
        }
        return result;
    }

    function serializeProject(project) {
        normalizeProject(project);
        project.lastModified = new Date().toISOString();
        return JSON.stringify(project, null, 2);
    }

    function deserializeProject(json) {
        const project = JSON.parse(json);
        return normalizeProject(project, true);
    }

    function captureProjectSnapshot() {
        normalizeProject(state.project);
        return JSON.stringify(state.project);
    }

    function commitChange(mutator) {
        const before = captureProjectSnapshot();
        mutator();
        normalizeProject(state.project);
        const after = captureProjectSnapshot();
        if (before !== after) {
            state.undoStack.push(before);
            trimStack(state.undoStack);
            state.redoStack.length = 0;
            state.lastSnapshot = after;
            state.isDirty = true;
            publishProjectToSession();
        }
        refreshUI();
    }

    function undoLastChange() {
        if (!state.undoStack.length) {
            return;
        }
        state.redoStack.push(captureProjectSnapshot());
        trimStack(state.redoStack);
        state.project = deserializeProject(state.undoStack.pop());
        state.selectedTentIds.clear();
        state.lastSnapshot = captureProjectSnapshot();
        state.isDirty = true;
        publishProjectToSession();
        refreshUI();
    }

    function redoLastChange() {
        if (!state.redoStack.length) {
            return;
        }
        state.undoStack.push(captureProjectSnapshot());
        trimStack(state.undoStack);
        state.project = deserializeProject(state.redoStack.pop());
        state.selectedTentIds.clear();
        state.lastSnapshot = captureProjectSnapshot();
        state.isDirty = true;
        publishProjectToSession();
        refreshUI();
    }

    function trimStack(stack) {
        while (stack.length > MaxUndoStates) {
            stack.shift();
        }
    }

    function refreshUI() {
        removeInvalidTentAssignments();
        compactLegacyDefaultTentLayout();
        arrangeAllAllocatedPeopleByTent();
        state.validationWarnings = validateAllocation(state.project);
        state.friendLabels = getFriendGroupLabels(state.project);
        resizeCanvasToContent();
        renderCanvas();
        renderUnallocated();
        renderStats();
        renderWarnings();
        updateMenuState();
        updateCollaborationStatus();
        updateTitle();
    }

    function resizeCanvasToContent() {
        const scale = ZoomLevels[state.zoomIndex];
        const scrollRect = dom.canvasScroll.getBoundingClientRect();
        const availableWidth = Math.max(1, scrollRect.width / scale);
        const availableHeight = Math.max(1, scrollRect.height / scale);
        const contentRight = getPlanningContentRight() + CanvasContentPadding;
        const contentBottom = getPlanningContentBottom() + CanvasContentPadding;
        state.canvasWidth = Math.ceil(Math.max(availableWidth, contentRight));
        state.canvasHeight = Math.ceil(Math.max(availableHeight, contentBottom));
        dom.canvasScaleHost.style.width = `${state.canvasWidth * scale}px`;
        dom.canvasScaleHost.style.height = `${state.canvasHeight * scale}px`;
        dom.mainCanvas.style.width = `${state.canvasWidth}px`;
        dom.mainCanvas.style.height = `${state.canvasHeight}px`;
        dom.mainCanvas.style.transform = `scale(${scale})`;
        dom.zoomSlider.value = String(state.zoomIndex);
        dom.zoomLevelLabel.textContent = `${Math.round(scale * 100)}%`;
    }

    function renderCanvas() {
        dom.mainCanvas.innerHTML = "";
        const warningTentIds = new Set(state.validationWarnings.filter(w => w.affectedTentId).map(w => w.affectedTentId));

        for (const tent of [...state.project.tents].sort((a, b) => a.name.localeCompare(b.name))) {
            const peopleInTent = state.project.people.filter(p => p.tentId === tent.id).sort(compareByName);
            dom.mainCanvas.appendChild(createTentElement(tent, peopleInTent, warningTentIds.has(tent.id)));
        }

        for (const item of [...state.project.siteItems].sort(compareByName)) {
            dom.mainCanvas.appendChild(createSiteItemElement(item));
        }

        for (const person of state.project.people.filter(p => p.tentId).sort(compareByName)) {
            dom.mainCanvas.appendChild(createPersonElement(person, false));
        }
    }

    function renderUnallocated() {
        dom.unallocatedPanel.innerHTML = "";
        const unallocated = state.project.people.filter(p => !p.tentId).sort(compareByName);
        dom.unallocatedBorder.classList.toggle("collapsed", unallocated.length === 0);
        for (const person of unallocated) {
            dom.unallocatedPanel.appendChild(createPersonElement(person, true));
        }
    }

    function renderStats() {
        const total = state.project.people.length;
        const allocated = state.project.people.filter(p => p.tentId).length;
        const unallocated = total - allocated;
        dom.versionLabel.textContent = `Version ${AppVersion}`;
        dom.campNameLabel.textContent = `Camp: ${state.project.name}`;
        dom.campDateLabel.textContent = `Date: ${formatShortDate(state.project.campDate)}`;
        dom.statsLabel.textContent =
            `Total people: ${total}\n` +
            `Allocated: ${allocated}\n` +
            `Unallocated: ${unallocated}\n` +
            `Tents: ${state.project.tents.length}\n` +
            `Friend links: ${state.project.friendLinks.length}`;
        dom.snapToGrid.checked = state.snapToGrid;
    }

    function renderWarnings() {
        dom.warningsPanel.innerHTML = "";
        const warnings = state.validationWarnings.length
            ? state.validationWarnings
            : [{ message: "No issues detected", ok: true }];
        for (const warning of warnings) {
            const item = document.createElement("div");
            item.className = `warning-item${warning.ok ? " ok" : ""}`;
            item.textContent = warning.message;
            dom.warningsPanel.appendChild(item);
        }
    }

    function updateMenuState() {
        dom.undoMenuItem.disabled = !state.undoStack.length;
        dom.redoMenuItem.disabled = !state.redoStack.length;
    }

    function updateTitle() {
        const fileName = state.currentFileName ? stripExtension(state.currentFileName) : "Untitled";
        document.title = `Camp Tent Planner v${AppVersion} - ${fileName}${state.isDirty ? "*" : ""}`;
    }

    function createTentElement(tent, peopleInTent, hasWarning) {
        const outer = document.createElement("div");
        outer.className = `tent-card${hasWarning ? " warning" : ""}${state.selectedTentIds.has(tent.id) ? " selected" : ""}`;
        outer.dataset.type = "tent";
        outer.dataset.id = tent.id;
        outer.title = tent.notes || "";
        setPositionAndSize(outer, tent.x, tent.y, getTentCardWidth(tent), getTentCardHeight(tent));
        const inner = document.createElement("div");
        inner.className = "tent-inner";
        inner.style.transform = `scale(${normalizeScale(tent.sizeScale)})`;
        inner.innerHTML = `${tent.accommodationType === "BunkRoom" ? bunkRoomIcon(tent.colour) : tentIcon(tent.colour)}
            <div class="tent-name">${escapeHtml(tent.name)}</div>
            <div class="tent-count">${peopleInTent.length} people</div>`;
        outer.appendChild(inner);
        attachPointerHandlers(outer);
        outer.addEventListener("dblclick", event => {
            event.stopPropagation();
            editTent(tent);
        });
        return outer;
    }

    function createPersonElement(person, unallocated) {
        const outer = document.createElement("div");
        const label = state.friendLabels[person.id] || "";
        const roleClass = person.personType === "Adult" ? "adult" : person.personType === "YoungLeader" ? "young-leader" : "camper";
        outer.className = `person-card ${roleClass}${label ? " friend" : ""}${unallocated ? " unallocated" : ""}`;
        outer.dataset.type = "person";
        outer.dataset.id = person.id;
        outer.title = person.notes || "";
        if (unallocated) {
            outer.style.width = `${PersonCardWidth}px`;
            outer.style.height = `${PersonCardHeight}px`;
        } else {
            setPositionAndSize(outer, person.x, person.y, PersonCardWidth, PersonCardHeight);
        }
        const inner = document.createElement("div");
        inner.className = "person-inner";
        inner.innerHTML = `${personIcon(person)}
            <div class="person-name">${escapeHtml(person.name)}</div>
            ${personBadge(person)}
            ${label ? `<div class="friend-badge">${escapeHtml(label)}</div>` : ""}`;
        outer.appendChild(inner);
        attachPointerHandlers(outer);
        outer.addEventListener("dblclick", event => {
            event.stopPropagation();
            editPerson(person);
        });
        return outer;
    }

    function createSiteItemElement(item) {
        const outer = document.createElement("div");
        outer.className = "site-item-card";
        outer.dataset.type = "siteItem";
        outer.dataset.id = item.id;
        setPositionAndSize(outer, item.x, item.y, getSiteItemCardWidth(item), getSiteItemCardHeight(item));
        const inner = document.createElement("div");
        inner.className = "site-inner";
        inner.style.borderColor = darkenColor(item.colour, 0.35);
        inner.style.transform = `scale(${normalizeScale(item.sizeScale)})`;
        inner.innerHTML = `${siteItemIcon(item)}
            <div class="site-name">${escapeHtml(item.name)}</div>`;
        outer.appendChild(inner);
        attachPointerHandlers(outer);
        outer.addEventListener("dblclick", event => {
            event.stopPropagation();
            editSiteItem(item);
        });
        return outer;
    }

    function setPositionAndSize(element, x, y, width, height) {
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        element.style.width = `${width}px`;
        element.style.height = `${height}px`;
    }

    function attachPointerHandlers(element) {
        element.addEventListener("pointerdown", handleDraggablePointerDown);
        element.addEventListener("mousedown", handleDraggableMouseDown);
    }

    function handleDraggablePointerDown(event) {
        if (event.button !== 0) {
            return;
        }
        beginDragFromEvent(event, event.currentTarget, false);
    }

    function handleDraggableMouseDown(event) {
        if (event.button !== 0 || state.drag) {
            return;
        }
        beginDragFromEvent(event, event.currentTarget, true);
    }

    function beginDragFromEvent(event, element, isMouseFallback) {
        const type = element.dataset.type;
        const id = element.dataset.id;
        if (type === "tent" && event.ctrlKey) {
            toggleTentSelection(id);
            event.preventDefault();
            return;
        }
        const rect = element.getBoundingClientRect();
        state.drag = {
            type,
            id,
            element,
            startX: event.clientX,
            startY: event.clientY,
            offsetX: event.clientX - rect.left,
            offsetY: event.clientY - rect.top,
            dragging: false,
            pointerId: event.pointerId,
            isMouseFallback
        };
        if (!isMouseFallback && element.setPointerCapture) {
            try {
                element.setPointerCapture(event.pointerId);
            } catch {
                // Some synthetic or assistive pointer sources cannot be captured.
            }
        }
        hideContextMenu();
    }

    function handlePointerMove(event) {
        const drag = state.drag;
        if (!drag) {
            return;
        }
        const dx = event.clientX - drag.startX;
        const dy = event.clientY - drag.startY;
        if (!drag.dragging && Math.abs(dx) < 4 && Math.abs(dy) < 4) {
            return;
        }
        drag.dragging = true;
        state.suppressNextClick = true;
        drag.element.classList.add("dragging");
        showDragPreview(event.clientX, event.clientY);
        event.preventDefault();
    }

    function handlePointerUp(event) {
        const drag = state.drag;
        if (!drag) {
            return;
        }
        if (!drag.isMouseFallback && drag.element.releasePointerCapture) {
            try {
                drag.element.releasePointerCapture(drag.pointerId);
            } catch {
                // Pointer capture may already have been released.
            }
        }
        drag.element.classList.remove("dragging");
        if (drag.dragging) {
            completeDrop(event.clientX, event.clientY);
            setTimeout(() => {
                state.suppressNextClick = false;
            }, 0);
        }
        removeDragPreview();
        state.drag = null;
    }

    function cancelDrag() {
        if (state.drag) {
            state.drag.element.classList.remove("dragging");
        }
        removeDragPreview();
        state.drag = null;
    }

    function completeDrop(clientX, clientY) {
        const drag = state.drag;
        const point = clientToCanvasPoint(clientX, clientY);
        if (drag.type === "tent") {
            moveTent(drag.id, point);
        } else if (drag.type === "siteItem") {
            moveSiteItem(drag.id, point);
        } else if (drag.type === "person") {
            const draggedPersonId = drag.id || drag.element?.dataset?.id;
            if (!draggedPersonId) {
                return;
            }
            const targetTent = findAllocationTargetAt(point);
            if (targetTent) {
                moveGroupToTent(draggedPersonId, targetTent.id);
                return;
            }
            const target = document.elementFromPoint(clientX, clientY);
            const tentElement = target?.closest?.(".tent-card");
            const personElement = target?.closest?.(".person-card");
            if (tentElement) {
                moveGroupToTent(draggedPersonId, tentElement.dataset.id);
            } else {
                if (personElement && personElement.dataset.id !== draggedPersonId) {
                    const targetPerson = findPerson(personElement.dataset.id);
                    if (targetPerson?.tentId) {
                        moveGroupToTent(draggedPersonId, targetPerson.tentId);
                    } else {
                        moveGroupToUnallocated(draggedPersonId);
                    }
                } else if (target?.closest?.("#unallocatedBorder")) {
                    moveGroupToUnallocated(draggedPersonId);
                } else {
                    moveGroupToUnallocated(draggedPersonId);
                }
            }
        }
    }

    function clientToCanvasPoint(clientX, clientY) {
        const rect = dom.canvasScaleHost.getBoundingClientRect();
        const scale = ZoomLevels[state.zoomIndex];
        return {
            x: (clientX - rect.left) / scale,
            y: (clientY - rect.top) / scale
        };
    }

    function showDragPreview(clientX, clientY) {
        const drag = state.drag;
        if (!drag) {
            return;
        }
        const point = clientToCanvasPoint(clientX, clientY);
        const scale = ZoomLevels[state.zoomIndex];
        let width = PersonCardWidth;
        let height = PersonCardHeight;
        if (drag.type === "tent") {
            const tent = findTent(drag.id);
            width = tent ? getTentCardWidth(tent) : TentCardWidth;
            height = tent ? getTentCardHeight(tent) : TentCardHeight;
        } else if (drag.type === "siteItem") {
            const item = findSiteItem(drag.id);
            width = item ? getSiteItemCardWidth(item) : SiteItemCardWidth;
            height = item ? getSiteItemCardHeight(item) : SiteItemCardHeight;
        }
        let x = point.x - (drag.offsetX / scale);
        let y = point.y - (drag.offsetY / scale);
        if (state.snapToGrid) {
            x = snapToGrid(x);
            y = snapToGrid(y);
        }
        x = clamp(x, 0, state.canvasWidth - width);
        y = clamp(y, 0, state.canvasHeight - height);
        let preview = dom.mainCanvas.querySelector(".drag-preview");
        if (!preview) {
            preview = document.createElement("div");
            preview.className = "drag-preview";
            dom.mainCanvas.appendChild(preview);
        }
        setPositionAndSize(preview, x, y, width, height);
    }

    function removeDragPreview() {
        dom.mainCanvas.querySelector(".drag-preview")?.remove();
    }

    function moveTent(tentId, dropPoint) {
        const firstTent = findTent(tentId);
        if (!firstTent) {
            return;
        }
        const ids = state.selectedTentIds.has(tentId) && state.selectedTentIds.size > 1
            ? [tentId, ...[...state.selectedTentIds].filter(id => id !== tentId)]
            : [tentId];
        commitChange(() => {
            const currentFirstTent = findTent(tentId);
            if (!currentFirstTent) return;
            const tentsToMove = ids.map(findTent).filter(Boolean);
            const scale = ZoomLevels[state.zoomIndex];
            let newX = dropPoint.x - ((state.drag?.offsetX || 0) / scale);
            let newY = dropPoint.y - ((state.drag?.offsetY || 0) / scale);
            if (state.snapToGrid) {
                newX = snapToGrid(newX);
                newY = snapToGrid(newY);
            }
            let deltaX = newX - currentFirstTent.x;
            let deltaY = newY - currentFirstTent.y;
            const minX = Math.min(...tentsToMove.map(t => t.x + deltaX));
            const minY = Math.min(...tentsToMove.map(t => t.y + deltaY));
            const maxX = Math.max(...tentsToMove.map(t => t.x + deltaX + getTentCardWidth(t)));
            const maxY = Math.max(...tentsToMove.map(t => t.y + deltaY + getTentCardHeight(t)));
            if (minX < 0) deltaX -= minX;
            if (minY < 0) deltaY -= minY;
            if (maxX > state.canvasWidth) deltaX -= maxX - state.canvasWidth;
            if (maxY > state.canvasHeight) deltaY -= maxY - state.canvasHeight;
            for (const tent of tentsToMove) {
                tent.x = clamp(tent.x + deltaX, 0, Math.max(0, state.canvasWidth - getTentCardWidth(tent)));
                tent.y = clamp(tent.y + deltaY, 0, Math.max(0, state.canvasHeight - getTentCardHeight(tent)));
            }
        });
    }

    function moveSiteItem(itemId, dropPoint) {
        const item = findSiteItem(itemId);
        if (!item) {
            return;
        }
        commitChange(() => {
            const current = findSiteItem(itemId);
            if (!current) return;
            const scale = ZoomLevels[state.zoomIndex];
            let newX = dropPoint.x - ((state.drag?.offsetX || 0) / scale);
            let newY = dropPoint.y - ((state.drag?.offsetY || 0) / scale);
            if (state.snapToGrid) {
                newX = snapToGrid(newX);
                newY = snapToGrid(newY);
            }
            current.x = clamp(newX, 0, Math.max(0, state.canvasWidth - getSiteItemCardWidth(current)));
            current.y = clamp(newY, 0, Math.max(0, state.canvasHeight - getSiteItemCardHeight(current)));
        });
    }

    function moveGroupToTent(personId, tentId) {
        if (!findTent(tentId)) {
            return;
        }
        commitChange(() => {
            for (const member of getPersonGroup(personId)) {
                member.tentId = tentId;
            }
        });
    }

    function moveGroupToUnallocated(personId) {
        commitChange(() => {
            for (const member of getPersonGroup(personId)) {
                member.tentId = null;
                member.x = 0;
                member.y = 0;
            }
        });
    }

    function handleContextMenu(event) {
        const card = event.target.closest(".tent-card, .person-card, .site-item-card");
        if (!card) {
            return;
        }
        event.preventDefault();
        const type = card.dataset.type;
        const id = card.dataset.id;
        const items = [];
        if (type === "tent") {
            const tent = findTent(id);
            if (!tent) return;
            items.push(["Rename / Change Type", () => editTent(tent)]);
            items.push(["Duplicate Tent", () => duplicateTent(tent)]);
            items.push(["Delete Tent", () => deleteTent(tent)]);
        } else if (type === "person") {
            const person = findPerson(id);
            if (!person) return;
            items.push(["Edit Person", () => editPerson(person)]);
            items.push(["Delete Person", () => deletePerson(person)]);
            items.push(["Move to Unallocated", () => moveGroupToUnallocated(person.id)]);
        } else if (type === "siteItem") {
            const item = findSiteItem(id);
            if (!item) return;
            items.push(["Rename / Change Type", () => editSiteItem(item)]);
            items.push(["Delete Site Item", () => deleteSiteItem(item)]);
        }
        showContextMenu(event.clientX, event.clientY, items);
    }

    function showContextMenu(clientX, clientY, items) {
        dom.contextMenu.innerHTML = "";
        for (const [label, handler] of items) {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = label;
            button.addEventListener("click", () => {
                hideContextMenu();
                handler();
            });
            dom.contextMenu.appendChild(button);
        }
        dom.contextMenu.hidden = false;
        dom.contextMenu.style.left = `${clientX}px`;
        dom.contextMenu.style.top = `${clientY}px`;
        const rect = dom.contextMenu.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            dom.contextMenu.style.left = `${Math.max(0, window.innerWidth - rect.width - 4)}px`;
        }
        if (rect.bottom > window.innerHeight) {
            dom.contextMenu.style.top = `${Math.max(0, window.innerHeight - rect.height - 4)}px`;
        }
    }

    function hideContextMenu() {
        dom.contextMenu.hidden = true;
    }

    async function actionNew() {
        if (!(await confirmSaveIfNeeded())) {
            return;
        }
        state.project = createNewProject();
        state.currentFileName = null;
        state.isDirty = false;
        state.selectedTentIds.clear();
        state.undoStack.length = 0;
        state.redoStack.length = 0;
        state.lastSnapshot = captureProjectSnapshot();
        publishProjectToSession();
        refreshUI();
    }

    async function actionOpen() {
        if (!(await confirmSaveIfNeeded())) {
            return;
        }
        dom.openFileInput.value = "";
        dom.openFileInput.click();
    }

    async function handleOpenFileSelected(event) {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }
        try {
            const content = await file.text();
            openProjectContent(file.name, content);
        } catch (error) {
            showMessage(`Error opening file: ${error.message}`, "Error");
        }
    }

    function openProjectContent(fileName, content) {
        try {
            state.project = deserializeProject(content);
            state.currentFileName = fileName;
            state.isDirty = false;
            state.selectedTentIds.clear();
            state.undoStack.length = 0;
            state.redoStack.length = 0;
            state.lastSnapshot = captureProjectSnapshot();
            publishProjectToSession();
            refreshUI();
        } catch (error) {
            showMessage(`Error opening file: ${error.message}`, "Error");
        }
    }

    async function actionSave(forceSaveAs) {
        const json = serializeProject(state.project);
        const fileName = forceSaveAs || !state.currentFileName
            ? `${sanitizeFileNamePart(state.project.name)}.camp`
            : state.currentFileName;
        downloadText(fileName, "application/json", json);
        state.currentFileName = fileName;
        state.isDirty = false;
        state.lastSnapshot = captureProjectSnapshot();
        refreshUI();
    }

    async function actionExit() {
        if (!(await confirmSaveIfNeeded())) {
            return;
        }
        window.close();
        setTimeout(() => {
            if (!document.hidden) {
                showMessage("Your browser did not allow this tab to close automatically.", "Exit");
            }
        }, 120);
    }

    async function confirmSaveIfNeeded() {
        if (!state.isDirty) {
            return true;
        }
        const result = await showChoiceMessage(
            "You have unsaved changes. Do you want to save them first?",
            "Unsaved Changes",
            [
                { label: "Yes", value: "yes", primary: true },
                { label: "No, don't save", value: "no", secondary: true },
                { label: "Cancel", value: "cancel", secondary: true }
            ]);
        if (result === "yes") {
            await actionSave(false);
            return true;
        }
        return result === "no";
    }

    async function confirmSaveBeforeExport() {
        if (!state.isDirty) {
            return true;
        }
        const result = await showChoiceMessage(
            "This plan has unsaved changes. Save the camp file before exporting?",
            "Save Before Export",
            [
                { label: "Yes", value: "yes", primary: true },
                { label: "No, export without saving", value: "no", secondary: true },
                { label: "Cancel", value: "cancel", secondary: true }
            ]);
        if (result === "yes") {
            await actionSave(false);
            return true;
        }
        return result === "no";
    }

    async function addTent() {
        const result = await showTentDialog();
        if (!result) {
            return;
        }
        commitChange(() => {
            const tent = newTent(result.name, result.tentType);
            const position = getDefaultTentPosition(state.project.tents.length);
            tent.x = position.x;
            tent.y = position.y;
            tent.accommodationType = result.accommodationType;
            tent.notes = result.notes;
            tent.sizeScale = result.sizeScale;
            tent.colour = getDefaultTentColour(result.tentType);
            state.project.tents.push(tent);
        });
    }

    async function editTent(tent) {
        const result = await showTentDialog(tent);
        if (!result) {
            return;
        }
        commitChange(() => {
            const current = findTent(tent.id);
            if (!current) return;
            current.name = result.name;
            current.tentType = result.tentType;
            current.colour = getDefaultTentColour(result.tentType);
            current.accommodationType = result.accommodationType;
            current.notes = result.notes;
            current.sizeScale = result.sizeScale;
        });
    }

    async function addPerson() {
        const result = await showPersonDialog();
        if (!result) {
            return;
        }
        commitChange(() => {
            const person = newPerson(result.name, result.gender, result.personType);
            person.camperType = result.camperType;
            person.notes = result.notes;
            state.project.people.push(person);
        });
    }

    async function editPerson(person) {
        const result = await showPersonDialog(person);
        if (!result) {
            return;
        }
        commitChange(() => {
            const current = findPerson(person.id);
            if (!current) return;
            current.name = result.name;
            current.gender = result.gender;
            current.personType = result.personType;
            current.camperType = result.camperType;
            current.notes = result.notes;
        });
    }

    async function addSiteItem() {
        const result = await showSiteItemDialog();
        if (!result) {
            return;
        }
        commitChange(() => {
            const item = newSiteItem(result.name, result.itemType);
            const position = getDefaultSiteItemPosition(state.project.siteItems.length);
            item.x = position.x;
            item.y = position.y;
            item.sizeScale = result.sizeScale;
            item.colour = getDefaultSiteItemColour(result.itemType);
            state.project.siteItems.push(item);
        });
    }

    async function editSiteItem(item) {
        const result = await showSiteItemDialog(item);
        if (!result) {
            return;
        }
        commitChange(() => {
            const current = findSiteItem(item.id);
            if (!current) return;
            current.name = result.name;
            current.itemType = result.itemType;
            current.colour = getDefaultSiteItemColour(result.itemType);
            current.sizeScale = result.sizeScale;
        });
    }

    async function deleteTent(tent) {
        const ok = await showYesNo(`Delete tent '${tent.name}'? People in this tent will move to Unallocated Campers.`, "Delete Tent");
        if (!ok) {
            return;
        }
        commitChange(() => {
            for (const person of state.project.people.filter(p => p.tentId === tent.id)) {
                person.tentId = null;
            }
            state.project.tents = state.project.tents.filter(t => t.id !== tent.id);
            state.selectedTentIds.delete(tent.id);
        });
    }

    function duplicateTent(tent) {
        commitChange(() => {
            const duplicate = newTent(getUniqueTentName(`${tent.name} copy`), tent.tentType);
            duplicate.colour = tent.colour;
            duplicate.notes = tent.notes;
            duplicate.accommodationType = tent.accommodationType;
            duplicate.sizeScale = tent.sizeScale;
            duplicate.x = Math.max(0, tent.x + 40);
            duplicate.y = Math.max(0, tent.y + 40);
            state.project.tents.push(duplicate);
            state.selectedTentIds.clear();
            state.selectedTentIds.add(duplicate.id);
        });
    }

    async function deletePerson(person) {
        const ok = await showYesNo(`Delete person '${person.name}'?`, "Delete Person");
        if (!ok) {
            return;
        }
        commitChange(() => {
            state.project.people = state.project.people.filter(p => p.id !== person.id);
            state.project.friendLinks = state.project.friendLinks.filter(link => link.personAId !== person.id && link.personBId !== person.id);
            state.project.foeLinks = state.project.foeLinks.filter(link => link.personAId !== person.id && link.personBId !== person.id);
            state.project.friendGroups = state.project.friendGroups.filter(group => !group.personIds.includes(person.id));
        });
    }

    async function deleteSiteItem(item) {
        const ok = await showYesNo(`Delete site item '${item.name}'?`, "Delete Site Item");
        if (!ok) {
            return;
        }
        commitChange(() => {
            state.project.siteItems = state.project.siteItems.filter(existing => existing.id !== item.id);
        });
    }

    async function editCampDetails() {
        const result = await showCampDetailsDialog();
        if (!result) {
            return;
        }
        commitChange(() => {
            state.project.name = result.name;
            state.project.campDate = result.date;
        });
    }

    async function bulkAddPeople() {
        const people = await showBulkAddDialog();
        if (!people || !people.length) {
            return;
        }
        commitChange(() => {
            state.project.people.push(...people);
        });
    }

    async function importPeopleFromCsv() {
        dom.csvFileInput.value = "";
        dom.csvFileInput.click();
    }

    async function handleCsvFileSelected(event) {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }
        try {
            const content = await file.text();
            const result = importCsvFromText(content);
            if (result.people.length === 0) {
                showMessage(buildCsvImportMessage(result, "No people were imported."), "CSV Import");
                return;
            }
            commitChange(() => {
                state.project.people.push(...result.people);
            });
            showMessage(buildCsvImportMessage(result, `Imported ${result.people.length} people from CSV.`), "CSV Import");
        } catch (error) {
            showMessage(`The CSV file could not be imported:\n${error.message}`, "CSV Import");
        }
    }

    function downloadSampleCsv() {
        downloadText("CampTentPlanner_SamplePeople.csv", "text/csv", "Name,Gender,PersonType\r\nJane,girl,young leader\r\n");
    }

    async function addFriendLink() {
        const people = [...state.project.people].sort(compareByName);
        if (people.length < 2) {
            showMessage("Add at least two people before creating a friend link.", "Friend Link");
            return;
        }
        const result = await showLinkDialog("Link Friends Together", "Friend Link", people, "Person 1:", "Person 2:", "Link Friends", false);
        if (!result) {
            return;
        }
        if (hasDirectFriendLink(result.personAId, result.personBId)) {
            showMessage("Those two people already have a direct friend link.", "Friend Link");
            return;
        }
        commitChange(() => {
            state.project.friendLinks.push({ id: createId(), personAId: result.personAId, personBId: result.personBId });
        });
    }

    async function removeFriendLink() {
        const links = state.project.friendLinks
            .map(link => ({ link, name: getFriendLinkName(link) }))
            .sort((a, b) => a.name.localeCompare(b.name));
        const selected = await chooseItem("Remove Friend Link", links, choice => choice.name);
        if (!selected) {
            return;
        }
        commitChange(() => {
            state.project.friendLinks = state.project.friendLinks.filter(link => link.id !== selected.link.id);
        });
    }

    async function addFoeLink() {
        const people = [...state.project.people].sort(compareByName);
        if (people.length < 2) {
            showMessage("Add at least two people before creating a foe link.", "Foe Link");
            return;
        }
        const result = await showLinkDialog("Mark People Who Don't Get Along", "Foe Link", people, "Person A:", "Person B:", "Add Foe Link", true);
        if (!result) {
            return;
        }
        if (hasDirectFoeLink(result.personAId, result.personBId)) {
            showMessage("Those two people already have a foe link.", "Foe Link");
            return;
        }
        commitChange(() => {
            state.project.foeLinks.push({ id: createId(), personAId: result.personAId, personBId: result.personBId });
        });
    }

    async function removeFoeLink() {
        const links = state.project.foeLinks
            .map(link => ({ link, name: getFoeLinkName(link) }))
            .sort((a, b) => a.name.localeCompare(b.name));
        const selected = await chooseItem("Remove Foe Link", links, choice => choice.name);
        if (!selected) {
            return;
        }
        commitChange(() => {
            state.project.foeLinks = state.project.foeLinks.filter(link => link.id !== selected.link.id);
        });
    }

    async function clearAllAllocations() {
        if (!state.project.people.some(p => p.tentId)) {
            showMessage("There are no allocated people to clear.", "Clear Allocations");
            return;
        }
        const ok = await showYesNo("Move all allocated people back to Unallocated Campers?", "Clear Allocations");
        if (!ok) {
            return;
        }
        commitChange(() => {
            for (const person of state.project.people) {
                person.tentId = null;
                person.x = 0;
                person.y = 0;
            }
        });
    }

    async function arrangeTentsNeatly() {
        if (!state.project.tents.length) {
            showMessage("There are no tents to arrange.", "Arrange Tents");
            return;
        }
        commitChange(() => {
            const ordered = [...state.project.tents].sort((a, b) => (a.y - b.y) || (a.x - b.x) || a.name.localeCompare(b.name));
            ordered.forEach((tent, index) => {
                const position = getDefaultTentPosition(index);
                tent.x = position.x;
                tent.y = position.y;
            });
            state.selectedTentIds.clear();
        });
    }

    async function chooseAndEditTent() {
        const tent = await chooseItem("Edit Tent", [...state.project.tents].sort(compareByName), t => t.name);
        if (tent) await editTent(tent);
    }

    async function chooseAndDuplicateTent() {
        const tent = await chooseItem("Duplicate Tent", [...state.project.tents].sort(compareByName), t => t.name);
        if (tent) duplicateTent(tent);
    }

    async function chooseAndDeleteTent() {
        const tent = await chooseItem("Delete Tent", [...state.project.tents].sort(compareByName), t => t.name);
        if (tent) await deleteTent(tent);
    }

    async function chooseAndEditPerson() {
        const person = await chooseItem("Edit Person", [...state.project.people].sort(compareByName), p => p.name);
        if (person) await editPerson(person);
    }

    async function chooseAndDeletePerson() {
        const person = await chooseItem("Delete Person", [...state.project.people].sort(compareByName), p => p.name);
        if (person) await deletePerson(person);
    }

    async function chooseAndEditSiteItem() {
        const item = await chooseItem("Edit Site Item", [...state.project.siteItems].sort(compareByName), s => s.name);
        if (item) await editSiteItem(item);
    }

    async function chooseAndDeleteSiteItem() {
        const item = await chooseItem("Delete Site Item", [...state.project.siteItems].sort(compareByName), s => s.name);
        if (item) await deleteSiteItem(item);
    }

    function fitCanvasToScreen() {
        const contentWidth = Math.max(1, getPlanningContentRight() + CanvasContentPadding);
        const contentHeight = Math.max(1, getPlanningContentBottom() + CanvasContentPadding);
        const viewportWidth = Math.max(1, dom.canvasScroll.clientWidth);
        const viewportHeight = Math.max(1, dom.canvasScroll.clientHeight);
        const requiredScale = Math.min(viewportWidth / contentWidth, viewportHeight / contentHeight);
        let index = 0;
        for (let i = 0; i < ZoomLevels.length; i++) {
            if (ZoomLevels[i] <= requiredScale + 0.001) {
                index = i;
            }
        }
        if (requiredScale >= 1.0) {
            index = ZoomLevels.indexOf(1.0);
        }
        state.zoomIndex = clamp(index, 0, ZoomLevels.length - 1);
        refreshUI();
    }

    async function showCollaborationDialog() {
        if (state.collaboration.code) {
            const result = await showChoiceMessage(
                `You are ${state.collaboration.mode === "host" ? "hosting" : "joined to"} session ${state.collaboration.code}. Share this code with anyone who should collaborate.`,
                "Collaboration",
                [
                    { label: "Copy Code", value: "copy", primary: true },
                    { label: "Leave Session", value: "leave", secondary: true },
                    { label: "Close", value: "close", secondary: true }
                ]);
            if (result === "copy") {
                await copyCollaborationCode();
            } else if (result === "leave") {
                await leaveCollaborationSession();
            }
            return;
        }

        const choice = await showChoiceMessage(
            "Host a new shared planning session, or join one with a code from someone else.",
            "Collaboration",
            [
                { label: "Host", value: "host", primary: true },
                { label: "Join", value: "join", secondary: true },
                { label: "Cancel", value: "cancel", secondary: true }
            ]);
        if (choice === "host") {
            if (await confirmSaveIfNeeded()) {
                await hostCollaborationSession();
            }
        } else if (choice === "join") {
            if (!(await confirmSaveIfNeeded())) {
                return;
            }
            const code = await showJoinSessionDialog();
            if (code) {
                await joinCollaborationSession(code);
            }
        }
    }

    function showJoinSessionDialog() {
        const form = document.createElement("form");
        form.className = "dialog";
        form.innerHTML = `
            <div class="dialog-body">
                <div class="dialog-title">Join Collaboration</div>
                <label>Session Code:</label>
                <input name="code" type="text" autocomplete="off" inputmode="text" maxlength="6" placeholder="ABC123">
                <div class="dialog-actions">
                    <button class="primary" type="submit">Join</button>
                    <button class="secondary" type="button" data-cancel>Cancel</button>
                </div>
            </div>`;
        return showFormDialog(form, submitted => {
            const code = normalizeSessionCode(submitted.elements.code.value);
            if (!code) {
                showMessage("Enter the host's session code.", "Join Collaboration");
                return null;
            }
            return code;
        });
    }

    async function hostCollaborationSession() {
        const db = await getCollaborationDatabase();
        if (!db) {
            return;
        }
        const code = createSessionCode();
        attachCollaborationSession(db, code, "host");
        await publishProjectToSession(true);
        await showChoiceMessage(
            `Session code: ${code}\n\nAnyone who chooses Join and enters this code will see updates as changes are made.`,
            "Collaboration Started",
            [
                { label: "Copy Code", value: "copy", primary: true },
                { label: "OK", value: "ok", secondary: true }
            ]
        ).then(result => {
            if (result === "copy") copyCollaborationCode();
        });
    }

    async function joinCollaborationSession(code) {
        const db = await getCollaborationDatabase();
        if (!db) {
            return;
        }
        const ref = db.ref(`${CollaborationPath}/${code}`);
        try {
            const snapshot = await ref.once("value");
            const value = snapshot.val();
            if (!value?.project) {
                showMessage("No active collaboration session was found for that code.", "Join Collaboration");
                return;
            }
            applyRemoteProject(value.project);
            attachCollaborationSession(db, code, "join", value.latestPatch?.id || null);
        } catch (error) {
            showMessage(buildCollaborationErrorMessage(error, "join the session"), "Join Collaboration");
        }
    }

    function attachCollaborationSession(db, code, mode, lastPatchId = null) {
        detachCollaborationListeners(false);
        state.collaboration.db = db;
        state.collaboration.code = code;
        state.collaboration.mode = mode;
        state.collaboration.ref = db.ref(`${CollaborationPath}/${code}`);
        state.collaboration.patchRef = state.collaboration.ref.child("latestPatch");
        state.collaboration.participantRef = state.collaboration.ref.child(`participants/${state.collaboration.clientId}`);
        state.collaboration.connectedRef = db.ref(".info/connected");
        state.collaboration.lastPatchId = lastPatchId;
        registerCollaborationParticipant();
        state.collaboration.patchRef.on("value", handleRemotePatchUpdate, error => {
            showMessage(`Collaboration connection error:
${error.message}`, "Collaboration");
        });
        state.collaboration.connectedRef.on("value", snapshot => {
            state.collaboration.connected = snapshot.val() === true;
            updateCollaborationStatus();
        });
        updateCollaborationStatus();
    }

    async function leaveCollaborationSession(refresh = true) {
        const sessionRef = state.collaboration.ref;
        detachCollaborationListeners(refresh);
        try {
            await removeCollaborationParticipant(sessionRef);
            await cleanupCollaborationSessionIfEmpty(sessionRef);
        } catch (error) {
            console.warn("Collaboration cleanup failed.", error);
        }
    }

    function detachCollaborationListeners(refresh = true) {
        if (state.collaboration.patchRef) {
            state.collaboration.patchRef.off("value", handleRemotePatchUpdate);
        }
        if (state.collaboration.connectedRef) {
            state.collaboration.connectedRef.off();
        }
        state.collaboration.mode = null;
        state.collaboration.code = null;
        state.collaboration.ref = null;
        state.collaboration.patchRef = null;
        state.collaboration.participantRef = null;
        state.collaboration.connectedRef = null;
        state.collaboration.connected = false;
        state.collaboration.lastPatchId = null;
        state.collaboration.lastPublishedSnapshot = "";
        if (refresh) {
            updateCollaborationStatus();
        }
    }

    async function registerCollaborationParticipant() {
        const participantRef = state.collaboration.participantRef;
        if (!participantRef) {
            return;
        }
        await participantRef.set({
            mode: state.collaboration.mode,
            joinedAt: firebase.database.ServerValue.TIMESTAMP,
            lastSeenAt: firebase.database.ServerValue.TIMESTAMP
        });
        participantRef.onDisconnect().remove();
    }

    async function removeCollaborationParticipant(sessionRef = state.collaboration.ref) {
        const participantRef = state.collaboration.participantRef || sessionRef?.child(`participants/${state.collaboration.clientId}`);
        if (!participantRef) {
            return;
        }
        try {
            participantRef.onDisconnect().cancel();
        } catch {
            // The disconnect registration may already be gone during page close.
        }
        await participantRef.remove();
    }

    function markCollaborationParticipantDisconnecting() {
        if (!state.collaboration.participantRef) {
            return;
        }
        state.collaboration.participantRef.update({
            leavingAt: firebase.database.ServerValue.TIMESTAMP
        }).catch(() => {});
    }

    async function cleanupCollaborationSessionIfEmpty(sessionRef) {
        if (!sessionRef) {
            return;
        }
        const snapshot = await sessionRef.child("participants").once("value");
        if (!snapshot.exists()) {
            await sessionRef.remove();
        }
    }

    function handleRemotePatchUpdate(snapshot) {
        const patch = snapshot.val();
        if (!patch?.id || patch.id === state.collaboration.lastPatchId) {
            return;
        }
        state.collaboration.lastPatchId = patch.id;
        if (patch.updatedBy === state.collaboration.clientId) {
            return;
        }
        applyRemotePatch(patch);
    }

    function applyRemotePatch(patch) {
        if (patch.type === "full" && patch.project) {
            applyRemoteProject(patch.project);
            return;
        }
        if (patch.type === "reload") {
            reloadRemoteProject();
            return;
        }
        if (patch.type !== "delta" || !patch.updates) {
            return;
        }
        state.collaboration.applyingRemote = true;
        try {
            const project = JSON.parse(JSON.stringify(state.project));
            for (const [path, value] of Object.entries(patch.updates)) {
                applyProjectPathUpdate(project, path, value);
            }
            state.project = normalizeProject(project, true);
            state.selectedTentIds.clear();
            state.undoStack.length = 0;
            state.redoStack.length = 0;
            state.lastSnapshot = captureProjectSnapshot();
            state.collaboration.lastPublishedSnapshot = state.lastSnapshot;
            state.isDirty = false;
            refreshUI();
        } finally {
            state.collaboration.applyingRemote = false;
        }
    }

    async function reloadRemoteProject() {
        if (!state.collaboration.ref) {
            return;
        }
        try {
            const snapshot = await state.collaboration.ref.child("project").once("value");
            const project = snapshot.val();
            if (project) {
                applyRemoteProject(project);
            }
        } catch (error) {
            showMessage(buildCollaborationErrorMessage(error, "reload the collaboration session"), "Collaboration");
        }
    }

    function applyProjectPathUpdate(project, path, value) {
        if (!path.startsWith("project/")) {
            return;
        }
        const parts = path.split("/").slice(1);
        let target = project;
        for (let index = 0; index < parts.length - 1; index++) {
            const part = parts[index];
            const nextPart = parts[index + 1];
            if (target[part] == null) {
                target[part] = /^\d+$/.test(nextPart) ? [] : {};
            }
            target = target[part];
        }
        const last = parts[parts.length - 1];
        if (value === null) {
            if (Array.isArray(target)) {
                target.splice(Number(last), 1);
            } else {
                delete target[last];
            }
        } else {
            target[last] = value;
        }
    }

    function applyRemoteProject(project) {
        state.collaboration.applyingRemote = true;
        try {
            state.project = normalizeProject(JSON.parse(JSON.stringify(project)), true);
            state.selectedTentIds.clear();
            state.undoStack.length = 0;
            state.redoStack.length = 0;
            state.lastSnapshot = captureProjectSnapshot();
            state.collaboration.lastPublishedSnapshot = state.lastSnapshot;
            state.isDirty = false;
            refreshUI();
        } finally {
            state.collaboration.applyingRemote = false;
        }
    }

    async function publishProjectToSession(force = false) {
        const collab = state.collaboration;
        if (!collab.ref || collab.applyingRemote) {
            return;
        }
        const snapshot = captureProjectSnapshot();
        if (!force && snapshot === collab.lastPublishedSnapshot) {
            return;
        }
        const previousSnapshot = collab.lastPublishedSnapshot;
        collab.lastPublishedSnapshot = snapshot;
        try {
            const project = JSON.parse(snapshot);
            if (force || !previousSnapshot) {
                const patch = buildFullPatch();
                collab.lastPatchId = patch.id;
                await collab.ref.update(buildSessionPayload(project, patch));
                return;
            }
            const projectUpdates = buildProjectDeltaUpdates(JSON.parse(previousSnapshot), project);
            const deltaPatch = buildDeltaPatch(projectUpdates);
            const updates = { ...projectUpdates };
            addSessionMetadataUpdates(updates, deltaPatch);
            const fullPatch = buildFullPatch();
            const fullPayload = buildSessionPayload(project, fullPatch);
            if (JSON.stringify(updates).length >= JSON.stringify(fullPayload).length) {
                collab.lastPatchId = fullPatch.id;
                await collab.ref.update(fullPayload);
            } else {
                collab.lastPatchId = deltaPatch.id;
                await collab.ref.update(updates);
            }
        } catch (error) {
            collab.lastPublishedSnapshot = previousSnapshot;
            showMessage(buildCollaborationErrorMessage(error, "sync collaboration changes"), "Collaboration");
        }
    }

    function buildSessionPayload(project, patch) {
        const payload = {
            project,
            latestPatch: patch,
            lastPatchId: patch.id,
            updatedAt: firebase.database.ServerValue.TIMESTAMP,
            updatedBy: state.collaboration.clientId,
            updatedByAuthUid: state.collaboration.authUid || null
        };
        if (state.collaboration.mode === "host") {
            payload.createdBy = state.collaboration.authUid || null;
        }
        return payload;
    }

    function buildFullPatch() {
        return {
            id: createPatchId(),
            type: "reload",
            updatedBy: state.collaboration.clientId,
            updatedByAuthUid: state.collaboration.authUid || null
        };
    }

    function buildDeltaPatch(projectUpdates) {
        return {
            id: createPatchId(),
            type: "delta",
            updates: projectUpdates,
            updatedBy: state.collaboration.clientId,
            updatedByAuthUid: state.collaboration.authUid || null
        };
    }

    function addSessionMetadataUpdates(updates, patch) {
        updates.latestPatch = patch;
        updates.lastPatchId = patch.id;
        updates.updatedAt = firebase.database.ServerValue.TIMESTAMP;
        updates.updatedBy = state.collaboration.clientId;
        updates.updatedByAuthUid = state.collaboration.authUid || null;
        if (state.collaboration.mode === "host") {
            updates.createdBy = state.collaboration.authUid || null;
        }
    }

    function createPatchId() {
        return `${Date.now().toString(36)}-${state.collaboration.clientId}`;
    }

    function buildProjectDeltaUpdates(beforeProject, afterProject) {
        const updates = {};
        for (const key of ["schemaVersion", "id", "name", "campDate", "lastModified"]) {
            if (!sameJson(beforeProject[key], afterProject[key])) {
                updates[`project/${key}`] = afterProject[key];
            }
        }
        addCollectionDeltaUpdates(updates, "tents", beforeProject.tents, afterProject.tents, item => item.id);
        addCollectionDeltaUpdates(updates, "siteItems", beforeProject.siteItems, afterProject.siteItems, item => item.id);
        addCollectionDeltaUpdates(updates, "people", beforeProject.people, afterProject.people, item => item.id);
        addCollectionDeltaUpdates(updates, "friendLinks", beforeProject.friendLinks, afterProject.friendLinks, item => item.id);
        addCollectionDeltaUpdates(updates, "foeLinks", beforeProject.foeLinks, afterProject.foeLinks, item => item.id);
        addCollectionDeltaUpdates(updates, "friendGroups", beforeProject.friendGroups, afterProject.friendGroups, item => item.id);
        addCollectionDeltaUpdates(updates, "allocations", beforeProject.allocations, afterProject.allocations, item => item.personId);
        return updates;
    }

    function addCollectionDeltaUpdates(updates, collectionName, beforeValue, afterValue, keySelector) {
        const before = array(beforeValue);
        const after = array(afterValue);
        if (before.length === after.length && hasSameCollectionOrder(before, after, keySelector)) {
            for (let index = 0; index < after.length; index++) {
                addItemDeltaUpdates(updates, `project/${collectionName}/${index}`, before[index], after[index]);
            }
            return;
        }
        if (after.length === before.length + 1 && hasSameCollectionOrder(before, after.slice(0, before.length), keySelector)) {
            updates[`project/${collectionName}/${after.length - 1}`] = after[after.length - 1];
            return;
        }
        updates[`project/${collectionName}`] = after;
    }

    function hasSameCollectionOrder(before, after, keySelector) {
        if (before.length !== after.length) {
            return false;
        }
        for (let index = 0; index < before.length; index++) {
            if (keySelector(before[index]) !== keySelector(after[index])) {
                return false;
            }
        }
        return true;
    }

    function addItemDeltaUpdates(updates, basePath, beforeItem, afterItem) {
        if (sameJson(beforeItem, afterItem)) {
            return;
        }
        const keys = new Set([...Object.keys(beforeItem || {}), ...Object.keys(afterItem || {})]);
        for (const key of keys) {
            if (!sameJson(beforeItem?.[key], afterItem?.[key])) {
                updates[`${basePath}/${key}`] = afterItem?.[key] ?? null;
            }
        }
    }

    function sameJson(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
    }

    async function getCollaborationDatabase() {
        if (!isCollaborationConfigured()) {
            showMessage(
                "Collaboration needs a Firebase Realtime Database configuration before it can run from GitHub Pages. Add your Firebase web app settings to CollaborationConfig in app.js.",
                "Collaboration Setup"
            );
            return null;
        }
        if (!window.firebase?.database) {
            showMessage("The Firebase database script did not load. Check your internet connection and the script tags in index.html.", "Collaboration Setup");
            return null;
        }
        try {
            const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(CollaborationConfig);
            state.collaboration.authUid = await tryAnonymousCollaborationUser(app);
            return app.database();
        } catch (error) {
            showMessage(buildCollaborationErrorMessage(error, "start Firebase"), "Collaboration Setup");
            return null;
        }
    }

    async function tryAnonymousCollaborationUser(app) {
        if (!window.firebase?.auth) {
            return null;
        }
        try {
            const auth = app.auth();
            if (firebase.auth?.Auth?.Persistence?.LOCAL) {
                await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            }
            const existingUser = auth.currentUser || await waitForExistingAuthUser(auth, 500);
            const user = existingUser || (await auth.signInAnonymously()).user || await waitForExistingAuthUser(auth, 8000);
            if (!user) {
                return null;
            }
            await user.getIdToken(true);
            return user.uid;
        } catch (error) {
            console.warn("Collaboration is continuing without Firebase Auth.", error);
            return null;
        }
    }

    function waitForExistingAuthUser(auth, timeoutMs) {
        return new Promise((resolve, reject) => {
            let unsubscribe = () => {};
            const timeout = setTimeout(() => {
                unsubscribe();
                resolve(null);
            }, timeoutMs);
            unsubscribe = auth.onAuthStateChanged(user => {
                clearTimeout(timeout);
                unsubscribe();
                resolve(user || null);
            }, error => {
                clearTimeout(timeout);
                unsubscribe();
                reject(error);
            });
        });
    }

    function buildCollaborationErrorMessage(error, action) {
        const message = error?.message || String(error || "Unknown error");
        if (message.includes("permission_denied") || error?.code === "PERMISSION_DENIED") {
            return `Could not ${action}:
${message}

Firebase rules are blocking this request. To make collaboration work without authorized domains, set Realtime Database rules for campTentPlannerSessions to read/write true.`;
        }
        return `Could not ${action}:
${message}`;
    }

    function isCollaborationConfigured() {
        return Boolean(CollaborationConfig.apiKey && CollaborationConfig.databaseURL && CollaborationConfig.projectId && CollaborationConfig.appId);
    }

    function updateCollaborationStatus() {
        if (!dom.collaborationStatus) {
            return;
        }
        const code = state.collaboration.code;
        if (!code) {
            dom.collaborationStatus.textContent = "Not connected";
            dom.collaborationStatus.className = "collaboration-status";
            return;
        }
        const connectionText = state.collaboration.connected ? "Live" : "Connecting";
        dom.collaborationStatus.textContent = `${connectionText}: ${code}`;
        dom.collaborationStatus.className = `collaboration-status ${state.collaboration.connected ? "live" : "connecting"}`;
    }

    async function copyCollaborationCode() {
        const code = state.collaboration.code;
        if (!code) {
            return;
        }
        try {
            await navigator.clipboard.writeText(code);
            showMessage(`Session code copied: ${code}`, "Collaboration");
        } catch {
            showMessage(`Session code: ${code}`, "Collaboration");
        }
    }

    function createSessionCode() {
        const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let code = "";
        const values = new Uint32Array(6);
        if (window.crypto?.getRandomValues) {
            window.crypto.getRandomValues(values);
        } else {
            for (let i = 0; i < values.length; i++) values[i] = Math.floor(Math.random() * 0xffffffff);
        }
        for (const value of values) {
            code += alphabet[value % alphabet.length];
        }
        return code;
    }

    function normalizeSessionCode(value) {
        return String(value || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
    }

    function showAbout() {
        showChoiceMessage(
            "A Windows desktop app for planning Scout camp tent allocations.\n\nArrange tents, allocate campers, adults and young leaders, track friend and foe links, validate warnings, and export printable PDF plans.",
            "About Camp Tent Planner",
            [{ label: "OK", value: "ok", primary: true }],
            `<div class="dialog-title">Camp Tent Planner</div><div class="version-label">Version ${AppVersion}</div>`
        );
    }

    async function exportTablePdf() {
        if (!(await confirmSaveBeforeExport())) {
            return;
        }
        const bytes = createTablePdf(state.project, validateAllocation(state.project));
        downloadBytes(`${getDefaultPdfFileName(state.project)}.pdf`, "application/pdf", bytes);
        showMessage("PDF exported successfully.", "Success");
    }

    async function exportTentTagsPdf() {
        if (!(await confirmSaveBeforeExport())) {
            return;
        }
        const bytes = createTentTagsPdf(state.project);
        downloadBytes(`${getDefaultPdfFileName(state.project)}_Tags.pdf`, "application/pdf", bytes);
        showMessage("Tent tags exported successfully.", "Success");
    }

    async function exportLayoutPdf() {
        if (!(await confirmSaveBeforeExport())) {
            return;
        }
        const bytes = createLayoutPdf(state.project);
        downloadBytes(`${getDefaultLayoutPdfFileName(state.project)}.pdf`, "application/pdf", bytes);
        showMessage("Layout PDF exported successfully.", "Layout PDF Exported");
    }

    function showTablePreview() {
        const warnings = validateAllocation(state.project);
        const content = document.createElement("div");
        content.className = "dialog preview";
        content.innerHTML = `
            <div class="preview-toolbar">
                <button class="primary" type="button" data-preview-action="pdf">Export Table to PDF</button>
                <button class="tags" type="button" data-preview-action="tags">Export as Tent Tags</button>
                <button class="layout" type="button" data-preview-action="layout">Export Camp Layout</button>
                <button class="print" type="button" data-preview-action="print">Print Table</button>
            </div>
            <div class="preview-scroll">
                <div id="tablePreviewContent" class="table-preview-content">${buildTablePreviewHtml(state.project, warnings)}</div>
            </div>`;
        const modal = mountModal(content);
        content.querySelector(".preview-toolbar").addEventListener("click", event => {
            const action = event.target.closest("[data-preview-action]")?.dataset.previewAction;
            if (!action) {
                return;
            }
            if (action === "pdf") exportTablePdf();
            if (action === "tags") exportTentTagsPdf();
            if (action === "layout") exportLayoutPdf();
            if (action === "print") printTable(content.querySelector("#tablePreviewContent").innerHTML);
        });
        modal.addEventListener("click", event => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    function buildTablePreviewHtml(project, warnings) {
        const rows = [];
        rows.push(`<h1>${escapeHtml(project.name)} - Tent allocation plan</h1>`);
        rows.push(`<div class="date">Date: ${escapeHtml(formatLongDate(project.campDate))}</div>`);
        rows.push(`<div class="allocation-table">`);
        for (const header of ["Tent name", "Tent type", "People allocated", "Summary", "Warnings"]) {
            rows.push(`<div class="allocation-cell header">${escapeHtml(header)}</div>`);
        }
        let row = 1;
        for (const tent of [...project.tents].sort(compareByName)) {
            const people = project.people.filter(p => p.tentId === tent.id).sort(compareByName);
            const tentWarnings = warnings.filter(w => w.affectedTentId === tent.id);
            const cls = tentWarnings.length ? " warning" : row % 2 === 0 ? " shade" : "";
            const values = [
                tent.name,
                getTentTypeName(tent),
                people.length ? people.map(p => p.name).join(", ") : "None",
                getTentSummary(people),
                tentWarnings.length ? tentWarnings.map(w => simplifyWarning(w.message, tent.name)).join("; ") : "None"
            ];
            for (const value of values) {
                rows.push(`<div class="allocation-cell${cls}">${escapeHtml(value)}</div>`);
            }
            row++;
        }
        rows.push(`</div>`);
        rows.push(`<div class="unallocated-preview-title">Unallocated people:</div>`);
        const unallocated = project.people.filter(p => !p.tentId).sort(compareByName);
        if (!unallocated.length) {
            rows.push(`<div style="color:#2e7d32;font-weight:600;font-size:12px;">All people allocated</div>`);
        } else {
            for (const person of unallocated) {
                rows.push(`<div style="font-size:12px;margin:0 0 5px 18px;">${escapeHtml(`${person.name} - ${person.gender} - ${getPersonTypeDisplayName(person.personType)}`)}</div>`);
            }
        }
        return rows.join("");
    }

    function printTable(html) {
        const win = window.open("", "_blank", "noopener,noreferrer,width=1040,height=720");
        if (!win) {
            showMessage("The print window could not be opened.", "Print Table");
            return;
        }
        win.document.write(`<!DOCTYPE html><html><head><title>Tent allocation plan</title><link rel="stylesheet" href="app.css"></head><body><div class="table-preview-content">${html}</div><script>window.onload=function(){window.print();};<\/script></body></html>`);
        win.document.close();
    }

    function showCampDetailsDialog() {
        const body = document.createElement("form");
        body.className = "dialog";
        body.innerHTML = `
            <div class="dialog-body">
                <div class="dialog-title">Camp Details</div>
                <label>Camp Name:</label>
                <input name="campName" type="text" value="${escapeAttribute(state.project.name)}">
                <label>Camp Date:</label>
                <input name="campDate" type="date" value="${toDateInputValue(state.project.campDate)}">
                <div class="dialog-actions">
                    <button class="primary" type="submit">Save</button>
                    <button class="secondary" type="button" data-cancel>Cancel</button>
                </div>
            </div>`;
        return showFormDialog(body, form => {
            const name = form.elements.campName.value.trim();
            if (!name) {
                showMessage("Please enter a camp name.", "Validation Error");
                return null;
            }
            if (!form.elements.campDate.value) {
                showMessage("Please select a camp date.", "Validation Error");
                return null;
            }
            return { name, date: fromDateInputValue(form.elements.campDate.value) };
        });
    }

    function showTentDialog(tent = null) {
        const isEdit = !!tent;
        const body = document.createElement("form");
        body.className = "dialog";
        body.innerHTML = `
            <div class="dialog-body">
                <div class="dialog-title">${isEdit ? "Edit Tent" : "Add New Tent"}</div>
                <label>Name:</label>
                <input name="name" type="text" value="${escapeAttribute(tent?.name || "")}">
                <label>Sleeping Place:</label>
                <select name="accommodationType">${optionHtml(TentAccommodationType, ["Tent", "Bunk room"], tent?.accommodationType || "Tent")}</select>
                <label>Colour:</label>
                <select name="tentType">${optionHtml(TentType, TentTypeLabels, tent?.tentType || "GreenPatrolTent")}</select>
                <label>Size:</label>
                <select name="sizeScale">${sizeOptionHtml(SizeOptions, tent?.sizeScale || 1.0)}</select>
                <label>Notes:</label>
                <textarea name="notes">${escapeHtml(tent?.notes || "")}</textarea>
                <div class="dialog-actions">
                    <button class="primary" type="submit">${isEdit ? "Save" : "Add"}</button>
                    <button class="secondary" type="button" data-cancel>Cancel</button>
                </div>
            </div>`;
        return showFormDialog(body, form => {
            const name = form.elements.name.value.trim();
            if (!name) {
                showMessage("Please enter a name.", "Validation Error");
                return null;
            }
            return {
                name,
                accommodationType: form.elements.accommodationType.value,
                tentType: form.elements.tentType.value,
                sizeScale: parseFloat(form.elements.sizeScale.value),
                notes: form.elements.notes.value.trim()
            };
        });
    }

    function showPersonDialog(person = null) {
        const isEdit = !!person;
        const body = document.createElement("form");
        body.className = "dialog";
        body.innerHTML = `
            <div class="dialog-body">
                <div class="dialog-title">${isEdit ? "Edit Person" : "Add New Person"}</div>
                <label>Name:</label>
                <input name="name" type="text" value="${escapeAttribute(person?.name || "")}">
                <label>Gender:</label>
                <select name="gender">${optionHtml(Gender, Gender, person?.gender || "Male")}</select>
                <label>Person Type:</label>
                <select name="personType">${optionHtml(PersonType, ["Camper", "Adult", "Young Leader"], person?.personType || "Camper")}</select>
                <label id="camperTypeLabel">Camper Type:</label>
                <select name="camperType">${optionHtml(CamperType, CamperType, person?.camperType || "Standard")}</select>
                <label>Notes:</label>
                <textarea name="notes">${escapeHtml(person?.notes || "")}</textarea>
                <div class="dialog-actions">
                    <button class="primary" type="submit">${isEdit ? "Save" : "Add Person"}</button>
                    <button class="secondary" type="button" data-cancel>Cancel</button>
                </div>
            </div>`;
        const typeSelect = body.elements.personType;
        const camperSelect = body.elements.camperType;
        const label = body.querySelector("#camperTypeLabel");
        const updateEnabled = () => {
            const enabled = typeSelect.value === "Camper";
            camperSelect.disabled = !enabled;
            camperSelect.style.opacity = enabled ? "1" : "0.45";
            label.style.opacity = enabled ? "1" : "0.45";
        };
        typeSelect.addEventListener("change", updateEnabled);
        updateEnabled();
        return showFormDialog(body, form => {
            const name = form.elements.name.value.trim();
            if (!name) {
                showMessage("Please enter a name.", "Validation Error");
                return null;
            }
            return {
                name,
                gender: form.elements.gender.value,
                personType: form.elements.personType.value,
                camperType: form.elements.camperType.value,
                notes: form.elements.notes.value.trim()
            };
        });
    }

    function showSiteItemDialog(item = null) {
        const isEdit = !!item;
        const body = document.createElement("form");
        body.className = "dialog";
        body.innerHTML = `
            <div class="dialog-body">
                <div class="dialog-title">${isEdit ? "Edit Site Item" : "Add Site Item"}</div>
                <label>Item Name:</label>
                <input name="name" type="text" value="${escapeAttribute(item?.name || "")}">
                <label>Item Type:</label>
                <select name="itemType">${optionHtml(SiteItemType, SiteItemTypeLabels, item?.itemType || "MessTent")}</select>
                <label>Item Size:</label>
                <select name="sizeScale">${sizeOptionHtml(SiteSizeOptions, item?.sizeScale || 1.0)}</select>
                <div class="dialog-actions">
                    <button class="primary" type="submit">${isEdit ? "Save" : "Add Item"}</button>
                    <button class="secondary" type="button" data-cancel>Cancel</button>
                </div>
            </div>`;
        return showFormDialog(body, form => {
            const name = form.elements.name.value.trim();
            if (!name) {
                showMessage("Please enter a site item name.", "Validation Error");
                return null;
            }
            return {
                name,
                itemType: form.elements.itemType.value,
                sizeScale: parseFloat(form.elements.sizeScale.value)
            };
        });
    }

    function showBulkAddDialog() {
        const form = document.createElement("form");
        form.className = "dialog wide";
        const rows = Array.from({ length: 10 }, (_, index) => `
            <input name="name${index}" type="text">
            <select name="gender${index}">${optionHtml(Gender, Gender, "Male")}</select>
            <select name="type${index}">${optionHtml(PersonType, ["Camper", "Adult", "Young Leader"], "Camper")}</select>
            <select name="camper${index}">${optionHtml(CamperType, CamperType, "Standard")}</select>`).join("");
        form.innerHTML = `
            <div class="dialog-body">
                <div class="dialog-title">Add Up to 10 People</div>
                <div class="bulk-grid">
                    <div class="bulk-header">Name</div>
                    <div class="bulk-header">Gender</div>
                    <div class="bulk-header">Person Type</div>
                    <div class="bulk-header">Camper Type</div>
                    ${rows}
                </div>
                <div class="dialog-actions">
                    <button class="primary" type="submit">Add People</button>
                    <button class="secondary" type="button" data-cancel>Cancel</button>
                </div>
            </div>`;
        form.querySelectorAll("select[name^='type']").forEach(select => {
            const index = select.name.replace("type", "");
            const camper = form.elements[`camper${index}`];
            const update = () => {
                camper.disabled = select.value !== "Camper";
                camper.style.opacity = camper.disabled ? "0.45" : "1";
            };
            select.addEventListener("change", update);
            update();
        });
        return showFormDialog(form, submitted => {
            const people = [];
            for (let i = 0; i < 10; i++) {
                const name = submitted.elements[`name${i}`].value.trim();
                if (!name) {
                    continue;
                }
                const person = newPerson(name, submitted.elements[`gender${i}`].value, submitted.elements[`type${i}`].value);
                person.camperType = submitted.elements[`camper${i}`].value;
                people.push(person);
            }
            if (!people.length) {
                showMessage("Please enter at least one person.", "Validation Error");
                return null;
            }
            return people;
        });
    }

    function showLinkDialog(heading, title, people, firstLabel, secondLabel, buttonText, danger) {
        const form = document.createElement("form");
        form.className = "dialog";
        const options = people.map(person => `<option value="${escapeAttribute(person.id)}">${escapeHtml(person.name)}</option>`).join("");
        form.innerHTML = `
            <div class="dialog-body">
                <div class="dialog-title${danger ? " danger" : ""}">${escapeHtml(heading)}</div>
                <label>${escapeHtml(firstLabel)}</label>
                <select name="person1">${options}</select>
                <label>${escapeHtml(secondLabel)}</label>
                <select name="person2">${options}</select>
                ${danger ? `<div style="font-size:11px;color:#666;margin:0 0 15px;">Note: If both people are placed in the same tent, a warning will be displayed.</div>` : ""}
                <div class="dialog-actions">
                    <button class="${danger ? "danger" : "primary"}" type="submit">${escapeHtml(buttonText)}</button>
                    <button class="secondary" type="button" data-cancel>Cancel</button>
                </div>
            </div>`;
        if (people.length > 1) {
            form.elements.person2.selectedIndex = 1;
        }
        return showFormDialog(form, submitted => {
            const person1 = submitted.elements.person1;
            const person2 = submitted.elements.person2;
            if (!person1.value || !person2.value) {
                showMessage("Please select two people.", "Validation Error");
                return null;
            }
            if (person1.value === person2.value) {
                showMessage("Please select two different people.", "Validation Error");
                return null;
            }
            return { personAId: person1.value, personBId: person2.value };
        }, title);
    }

    function showFormDialog(form, readValue) {
        return new Promise(resolve => {
            mountModal(form);
            const first = form.querySelector("input, select, textarea");
            setTimeout(() => {
                first?.focus();
                first?.select?.();
            }, 0);
            form.addEventListener("submit", event => {
                event.preventDefault();
                const value = readValue(form);
                if (value === null) {
                    return;
                }
                closeModal();
                resolve(value);
            });
            form.querySelector("[data-cancel]").addEventListener("click", () => {
                closeModal();
                resolve(null);
            });
        });
    }

    function chooseItem(title, items, displayNameSelector) {
        if (!items.length) {
            showMessage("There are no matching items.", title);
            return Promise.resolve(null);
        }
        const form = document.createElement("form");
        form.className = "dialog";
        form.innerHTML = `
            <div class="dialog-body">
                <select class="choice-list" name="choice" size="${Math.min(8, Math.max(2, items.length))}">
                    ${items.map((item, index) => `<option value="${index}"${index === 0 ? " selected" : ""}>${escapeHtml(displayNameSelector(item))}</option>`).join("")}
                </select>
                <div class="dialog-actions">
                    <button class="primary" type="submit">OK</button>
                    <button class="secondary" type="button" data-cancel>Cancel</button>
                </div>
            </div>`;
        return showFormDialog(form, submitted => {
            if (!submitted.elements.choice.value) {
                showMessage("Select an item first.", title);
                return null;
            }
            return items[parseInt(submitted.elements.choice.value, 10)];
        });
    }

    function showMessage(message, title = "Camp Tent Planner") {
        return showChoiceMessage(message, title, [{ label: "OK", value: "ok", primary: true }]);
    }

    function showYesNo(message, title) {
        return showChoiceMessage(message, title, [
            { label: "Yes", value: true, primary: true },
            { label: "No", value: false, secondary: true }
        ]);
    }

    function showChoiceMessage(message, title, choices, leadingHtml = "") {
        return new Promise(resolve => {
            const dialog = document.createElement("div");
            dialog.className = "dialog";
            dialog.innerHTML = `
                <div class="dialog-body">
                    ${leadingHtml || `<div class="dialog-title">${escapeHtml(title)}</div>`}
                    <div class="dialog-message">${escapeHtml(message)}</div>
                    <div class="dialog-actions">
                        ${choices.map((choice, index) => `<button type="button" data-choice="${index}" class="${choice.primary ? "primary" : choice.secondary ? "secondary" : ""}">${escapeHtml(choice.label)}</button>`).join("")}
                    </div>
                </div>`;
            mountModal(dialog);
            dialog.querySelector(".dialog-actions").addEventListener("click", event => {
                const button = event.target.closest("[data-choice]");
                if (!button) {
                    return;
                }
                closeModal();
                resolve(choices[parseInt(button.dataset.choice, 10)].value);
            });
        });
    }

    function mountModal(content) {
        dom.modalRoot.innerHTML = "";
        dom.modalRoot.classList.add("active");
        const backdrop = document.createElement("div");
        backdrop.className = "modal-backdrop";
        backdrop.appendChild(content);
        dom.modalRoot.appendChild(backdrop);
        return backdrop;
    }

    function closeModal() {
        dom.modalRoot.classList.remove("active");
        dom.modalRoot.innerHTML = "";
    }

    function validateAllocation(project) {
        const warnings = [];
        for (const tent of project.tents) {
            warnings.push(...validateTent(tent, project.people.filter(p => p.tentId === tent.id), project.foeLinks));
        }
        const unallocated = project.people.filter(p => !p.tentId);
        if (unallocated.length) {
            warnings.push({
                id: createId(),
                message: `Unallocated people: ${unallocated.length}`,
                type: "UnallocatedPeople",
                affectedPersonIds: unallocated.map(p => p.id)
            });
        }
        return warnings;
    }

    function validateTent(tent, people, foeLinks) {
        const warnings = [];
        if (!people.length) {
            return warnings;
        }
        const campers = people.filter(p => p.personType === "Camper");
        const adults = people.filter(p => p.personType === "Adult");
        const youngLeaders = people.filter(p => p.personType === "YoungLeader");
        if (new Set(campers.map(p => p.gender)).size > 1) {
            warnings.push({
                id: createId(),
                message: `Mixed-gender camper tent: ${tent.name}`,
                type: "MixedGenderCampers",
                affectedTentId: tent.id,
                affectedPersonIds: campers.map(p => p.id)
            });
        }
        if (campers.length && adults.length) {
            warnings.push({
                id: createId(),
                message: `Camper mixed with adult: ${tent.name}`,
                type: "CamperWithAdult",
                affectedTentId: tent.id,
                affectedPersonIds: people.map(p => p.id)
            });
        }
        if (campers.length && youngLeaders.length) {
            warnings.push({
                id: createId(),
                message: `Camper mixed with young leader: ${tent.name}`,
                type: "CamperWithYoungLeader",
                affectedTentId: tent.id,
                affectedPersonIds: people.map(p => p.id)
            });
        }
        if (adults.length && youngLeaders.length && adults.length < 2) {
            warnings.push({
                id: createId(),
                message: `Young leader with fewer than two adults: ${tent.name}`,
                type: "YoungLeaderWithInsufficientAdults",
                affectedTentId: tent.id,
                affectedPersonIds: people.map(p => p.id)
            });
        }
        const personIds = new Set(people.map(p => p.id));
        for (const foe of foeLinks) {
            if (personIds.has(foe.personAId) && personIds.has(foe.personBId)) {
                const a = people.find(p => p.id === foe.personAId)?.name || "Unknown";
                const b = people.find(p => p.id === foe.personBId)?.name || "Unknown";
                warnings.push({
                    id: createId(),
                    message: `Foe conflict in ${tent.name}: ${a} and ${b} don't get along`,
                    type: "FoeConflict",
                    affectedTentId: tent.id,
                    affectedPersonIds: [foe.personAId, foe.personBId]
                });
            }
        }
        return warnings;
    }

    function getFriendGroups(project) {
        const peopleIds = new Set(project.people.map(p => p.id));
        const namesById = Object.fromEntries(project.people.map(p => [p.id, p.name]));
        const adjacency = Object.fromEntries([...peopleIds].map(id => [id, new Set()]));
        for (const link of project.friendLinks) {
            if (link.personAId === link.personBId || !peopleIds.has(link.personAId) || !peopleIds.has(link.personBId)) {
                continue;
            }
            adjacency[link.personAId].add(link.personBId);
            adjacency[link.personBId].add(link.personAId);
        }
        const visited = new Set();
        const groups = [];
        for (const person of [...project.people].sort(compareByName)) {
            if (visited.has(person.id) || !adjacency[person.id]?.size) {
                continue;
            }
            const group = [];
            const stack = [person.id];
            visited.add(person.id);
            while (stack.length) {
                const current = stack.pop();
                group.push(current);
                const nextIds = [...adjacency[current]].sort((a, b) => (namesById[a] || a).localeCompare(namesById[b] || b));
                for (const next of nextIds) {
                    if (!visited.has(next)) {
                        visited.add(next);
                        stack.push(next);
                    }
                }
            }
            if (group.length > 1) {
                groups.push(group);
            }
        }
        return groups;
    }

    function getFriendGroupLabels(project) {
        const labels = {};
        const namesById = Object.fromEntries(project.people.map(p => [p.id, p.name]));
        const groups = getFriendGroups(project).sort((a, b) =>
            minGroupName(a, namesById).localeCompare(minGroupName(b, namesById)));
        groups.forEach((group, index) => {
            for (const personId of group) {
                labels[personId] = `G${index + 1}`;
            }
        });
        return labels;
    }

    function getPersonGroup(personId) {
        const group = getFriendGroups(state.project).find(ids => ids.includes(personId)) || [personId];
        const idSet = new Set(group);
        return state.project.people.filter(p => idSet.has(p.id)).sort(compareByName);
    }

    function importCsvFromText(csvText) {
        const result = {
            people: [],
            warnings: [],
            dataRowCount: 0,
            skippedRowCount: 0,
            defaultedGenderCount: 0,
            defaultedPersonTypeCount: 0
        };
        if (!csvText.trim()) {
            result.warnings.push("The CSV file did not contain any rows.");
            return result;
        }
        const rows = parseCsvRows(csvText).filter(row => row.some(field => field.trim()));
        if (!rows.length) {
            result.warnings.push("The CSV file did not contain any rows.");
            return result;
        }
        const hasHeader = looksLikeNameHeader(rows[0]);
        const mapping = hasHeader ? buildHeaderMapping(rows[0]) : { nameIndex: 0 };
        for (let index = hasHeader ? 1 : 0; index < rows.length; index++) {
            const rowNumber = index + 1;
            const row = rows[index];
            result.dataRowCount++;
            const name = getCsvName(row, mapping);
            if (!name.trim()) {
                result.skippedRowCount++;
                result.warnings.push(`Row ${rowNumber}: skipped because the name is blank.`);
                continue;
            }
            const genderRead = readCsvGender(row, mapping, hasHeader, rowNumber, result);
            const personTypeRead = readCsvPersonType(row, mapping, hasHeader, rowNumber, result);
            if (genderRead.defaulted) result.defaultedGenderCount++;
            if (personTypeRead.defaulted) result.defaultedPersonTypeCount++;
            result.people.push(newPerson(cleanCsvName(name), genderRead.value, personTypeRead.value));
        }
        if (!result.people.length && !result.warnings.length) {
            result.warnings.push("No people were found in the CSV file.");
        }
        return result;
    }

    function parseCsvRows(csvText) {
        const rows = [];
        let row = [];
        let field = "";
        let inQuotes = false;
        for (let i = 0; i < csvText.length; i++) {
            const ch = csvText[i];
            if (inQuotes) {
                if (ch === "\"") {
                    if (csvText[i + 1] === "\"") {
                        field += "\"";
                        i++;
                    } else {
                        inQuotes = false;
                    }
                } else {
                    field += ch;
                }
                continue;
            }
            if (ch === "\"") {
                if (!field.length) inQuotes = true;
                else field += ch;
            } else if (ch === ",") {
                row.push(field.trim());
                field = "";
            } else if (ch === "\r" || ch === "\n") {
                if (ch === "\r" && csvText[i + 1] === "\n") i++;
                row.push(field.trim());
                rows.push(row);
                row = [];
                field = "";
            } else {
                field += ch;
            }
        }
        if (field.length || row.length) {
            row.push(field.trim());
            rows.push(row);
        }
        return rows;
    }

    function buildHeaderMapping(headerRow) {
        const mapping = {};
        headerRow.forEach((raw, index) => {
            const header = normalizeHeader(raw);
            if (["name", "fullname", "person", "camper", "campername", "member", "membername", "scout", "scoutname", "displayname", "preferredname", "fulllegalname"].includes(header)) mapping.nameIndex ??= index;
            else if (["firstname", "forename", "first", "givenname", "given", "preferredfirstname"].includes(header)) mapping.firstNameIndex ??= index;
            else if (["lastname", "surname", "secondname", "familyname", "last", "family"].includes(header)) mapping.lastNameIndex ??= index;
            else if (["gender", "sex", "genderidentity"].includes(header)) mapping.genderIndex ??= index;
            else if (["persontype", "type", "role", "category", "campertype", "membertype", "persongroup", "personrole", "memberrole"].includes(header)) mapping.personTypeIndex ??= index;
        });
        return mapping;
    }

    function looksLikeNameHeader(row) {
        return row.map(normalizeHeader).some(header => ["name", "fullname", "person", "camper", "campername", "member", "membername", "scout", "scoutname", "displayname", "preferredname", "fulllegalname", "firstname", "forename", "first", "givenname", "given", "preferredfirstname", "lastname", "surname", "secondname", "familyname", "last", "family"].includes(header));
    }

    function getCsvName(row, mapping) {
        const full = getCsvField(row, mapping.nameIndex);
        if (full) return full;
        return [getCsvField(row, mapping.firstNameIndex), getCsvField(row, mapping.lastNameIndex)].filter(Boolean).join(" ");
    }

    function readCsvGender(row, mapping, hasHeader, rowNumber, result) {
        if (hasHeader) {
            const value = getCsvField(row, mapping.genderIndex);
            if (!value) return { value: "Male", defaulted: true };
            const parsed = tryParseGender(value);
            if (parsed) return { value: parsed, defaulted: false };
            result.warnings.push(`Row ${rowNumber}: gender '${value}' was not recognised; used Male.`);
            return { value: "Male", defaulted: true };
        }
        for (const value of row.slice(1)) {
            const parsed = tryParseGender(value);
            if (parsed) return { value: parsed, defaulted: false };
        }
        return { value: "Male", defaulted: true };
    }

    function readCsvPersonType(row, mapping, hasHeader, rowNumber, result) {
        if (hasHeader) {
            const value = getCsvField(row, mapping.personTypeIndex);
            if (!value) return { value: "Camper", defaulted: true };
            const parsed = tryParsePersonType(value);
            if (parsed) return { value: parsed, defaulted: false };
            result.warnings.push(`Row ${rowNumber}: person type '${value}' was not recognised; used Camper.`);
            return { value: "Camper", defaulted: true };
        }
        for (const value of row.slice(1)) {
            const parsed = tryParsePersonType(value);
            if (parsed) return { value: parsed, defaulted: false };
        }
        return { value: "Camper", defaulted: true };
    }

    function buildCsvImportMessage(result, heading) {
        const parts = [heading, "", `Rows read: ${result.dataRowCount}`, `Rows skipped: ${result.skippedRowCount}`];
        if (result.defaultedGenderCount > 0 || result.defaultedPersonTypeCount > 0) {
            parts.push("", "Defaults used:");
            if (result.defaultedGenderCount > 0) parts.push(`- Gender defaulted to Male for ${result.defaultedGenderCount} people.`);
            if (result.defaultedPersonTypeCount > 0) parts.push(`- Person type defaulted to Camper for ${result.defaultedPersonTypeCount} people.`);
        }
        if (result.warnings.length > 0) {
            parts.push("", "Notes:");
            parts.push(...result.warnings.slice(0, 12).map(w => `- ${w}`));
            if (result.warnings.length > 12) parts.push(`- Plus ${result.warnings.length - 12} more.`);
        }
        return parts.join("\n");
    }

    function createTablePdf(project, warnings) {
        const pdf = new PdfDocument(595, 842);
        let page = pdf.addPage();
        let y = 36;
        page.text(36, y, `${project.name} - Tent allocation plan`, 18, true, PdfColor.Green);
        y += 24;
        page.text(36, y, `Date: ${formatLongDate(project.campDate)}`, 11, false, PdfColor.DarkGray);
        y += 28;
        const headers = ["Tent name", "Tent type", "People allocated", "Summary", "Warnings"];
        const widths = [82, 105, 145, 115, 76];
        y = ensurePdfSpace(pdf, () => page = pdf.addPage(), y, 34, 842);
        drawPdfRow(page, y, headers, widths, 28, PdfColor.HeaderGreen, PdfColor.White, true);
        y += 28;
        let rowIndex = 0;
        for (const tent of [...project.tents].sort(compareByName)) {
            const people = project.people.filter(p => p.tentId === tent.id).sort(compareByName);
            const tentWarnings = warnings.filter(w => w.affectedTentId === tent.id);
            const values = [
                tent.name,
                getTentTypeName(tent),
                people.length ? people.map(p => p.name).join(", ") : "None",
                getTentSummary(people),
                tentWarnings.length ? tentWarnings.map(w => simplifyWarning(w.message, tent.name)).join("; ") : "None"
            ];
            const lineCounts = values.map((value, i) => wrapText(value, widths[i] - 10, 9).length);
            const height = Math.max(28, (Math.max(...lineCounts) * 11) + 10);
            y = ensurePdfSpace(pdf, () => page = pdf.addPage(), y, height, 842);
            const background = tentWarnings.length ? PdfColor.WarningPink : rowIndex % 2 === 0 ? PdfColor.RowShade : PdfColor.White;
            drawPdfRow(page, y, values, widths, height, background, PdfColor.Black, false);
            y += height;
            rowIndex++;
        }
        y += 18;
        y = ensurePdfSpace(pdf, () => page = pdf.addPage(), y, 45, 842);
        page.text(36, y, "Unallocated people:", 13, true, PdfColor.Red);
        y += 18;
        const unallocated = project.people.filter(p => !p.tentId).sort(compareByName);
        if (!unallocated.length) {
            page.text(48, y, "All people allocated", 10, false, PdfColor.Black);
        } else {
            for (const person of unallocated) {
                y = ensurePdfSpace(pdf, () => page = pdf.addPage(), y, 16, 842);
                page.text(48, y, `${person.name} - ${person.gender} - ${getPersonTypeDisplayName(person.personType)}`, 10, false, PdfColor.Black);
                y += 14;
            }
        }
        return pdf.save();
    }

    function drawPdfRow(page, y, values, widths, height, background, textColor, bold) {
        let x = 36;
        for (let i = 0; i < values.length; i++) {
            page.rect(x, y, widths[i], height, background, PdfColor.GridLine);
            const lines = wrapText(values[i], widths[i] - 10, bold ? 10 : 9);
            let textY = y + 8;
            for (const line of lines) {
                if (textY + 8 > y + height) break;
                page.text(x + 5, textY, line, bold ? 10 : 9, bold, textColor);
                textY += 11;
            }
            x += widths[i];
        }
    }

    function createTentTagsPdf(project) {
        const pdf = new PdfDocument(595, 842);
        let page = pdf.addPage();
        const margin = 36;
        const tagWidth = 595 - (2 * margin);
        const tagHeight = (842 - (2 * margin)) / 3;
        const middleX = margin + (tagWidth / 2);
        let count = 0;
        for (const tent of [...project.tents].sort(compareByName)) {
            if (count > 0 && count % 3 === 0) {
                page = pdf.addPage();
            }
            const tagIndex = count % 3;
            const yTop = margin + (tagIndex * tagHeight);
            const yBottom = yTop + tagHeight;
            page.rect(margin, yTop, tagWidth, tagHeight, PdfColor.White, PdfColor.Black);
            page.line(middleX, yTop, middleX, yBottom, PdfColor.GridLine, 0.5);
            const people = project.people.filter(p => p.tentId === tent.id).sort(compareByName);
            const titleLineHeight = 20;
            const personLineHeight = 14;
            const gap = people.length ? 10 : 0;
            const textBlockHeight = titleLineHeight + gap + (people.length * personLineHeight);
            let textTop = yTop + Math.max(18, (tagHeight - textBlockHeight) / 2);
            page.text(margin + 15, textTop, tent.name, 16, true, PdfColor.Black);
            let py = textTop + titleLineHeight + gap;
            people.forEach((person, index) => {
                page.text(margin + 20, py, `${index + 1}. ${person.name}`, 11, false, PdfColor.Black);
                py += personLineHeight;
            });
            page.ellipse(middleX + (tagWidth / 4), yTop + (tagHeight / 2), 20, PdfColor.White, PdfColor.Black);
            count++;
        }
        return pdf.save();
    }

    function createLayoutPdf(project) {
        const pdf = new PdfDocument(842, 595);
        let page = pdf.addPage();
        page.text(28, 28, "Camp Tent Allocation Plan", 16, true, PdfColor.DarkText);
        page.text(28, 50, `Camp: ${project.name || "Unnamed camp"}`, 9, false, PdfColor.DarkText);
        const unallocatedCount = project.people.filter(p => !p.tentId).length;
        let summary = `Sleeping tents: ${project.tents.length}    Allocated people: ${project.people.filter(p => p.tentId).length}`;
        if (unallocatedCount > 0) summary += `    Unallocated people: ${unallocatedCount}`;
        page.text(28, 64, summary, 9, false, PdfColor.DarkText);
        const source = getSourceBounds(project);
        const destination = { x: 28, y: 82, width: 786, height: unallocatedCount ? 350 : 455 };
        const transform = buildLayoutTransform(source, destination);
        for (const tent of [...project.tents].sort((a, b) => (a.y - b.y) || (a.x - b.x))) {
            const box = mapBox(transform, { x: tent.x, y: tent.y, width: getTentCardWidth(tent), height: getTentCardHeight(tent) });
            drawLayoutTent(page, box, tent, project.people.filter(p => p.tentId === tent.id).sort(compareByName));
        }
        for (const item of [...project.siteItems].sort((a, b) => (a.y - b.y) || (a.x - b.x))) {
            const box = mapBox(transform, { x: item.x, y: item.y, width: getSiteItemCardWidth(item), height: getSiteItemCardHeight(item) });
            drawLayoutSiteItem(page, box, item);
        }
        if (unallocatedCount > 0) {
            let y = 448;
            page.text(28, y, "Unallocated People", 11, true, PdfColor.DarkText);
            y += 15;
            for (const person of project.people.filter(p => !p.tentId).sort(compareByName)) {
                if (y > 555) {
                    page = pdf.addPage();
                    page.text(28, 28, "Camp Tent Allocation Plan", 16, true, PdfColor.DarkText);
                    y = 82;
                }
                page.text(36, y, `- ${getUnallocatedPersonDisplayName(person)}`, 9, false, PdfColor.DarkText);
                y += 11;
            }
        }
        return pdf.save();
    }

    function drawLayoutTent(page, box, tent, people) {
        const centerX = box.x + (box.width / 2);
        if (tent.accommodationType === "BunkRoom") {
            page.polygon([
                [box.x + 5, box.y + Math.min(22, box.height * 0.22)],
                [centerX, box.y + 5],
                [box.x + box.width - 5, box.y + Math.min(22, box.height * 0.22)]
            ], PdfColor.White, PdfColor.DarkText);
            page.rect(box.x + 6, box.y + Math.min(22, box.height * 0.22), box.width - 12, box.height - 25, PdfColor.White, PdfColor.DarkText);
        } else {
            page.polygon([[centerX, box.y + 4], [box.x + 3, box.y + box.height - 3], [box.x + box.width - 3, box.y + box.height - 3]], PdfColor.White, PdfColor.DarkText);
        }
        const titleLines = wrapText(tent.name || "Unnamed tent", Math.max(24, box.width * 0.42), 9);
        const peopleLines = people.length ? people.map(p => getLayoutPersonDisplayName(p)) : ["Empty"];
        let y = box.y + Math.max(10, box.height * 0.28);
        for (const line of titleLines.slice(0, 2)) {
            page.centerText(centerX, y, line, 10, true, PdfColor.DarkText);
            y += 11;
        }
        y += 2;
        for (const line of peopleLines.slice(0, Math.max(1, Math.floor((box.height - 48) / 11)))) {
            page.centerText(centerX, y, line, 9, false, PdfColor.DarkText);
            y += 11;
        }
        page.centerText(centerX, box.y + box.height - 16, getSleepingPlaceSummary(tent, people.length), 9, false, PdfColor.DarkText);
    }

    function drawLayoutSiteItem(page, box, item) {
        const cx = box.x + box.width / 2;
        if (item.itemType === "Fire") {
            page.line(box.x + box.width * 0.28, box.y + box.height - 10, box.x + box.width * 0.70, box.y + box.height - 22, PdfColor.DarkText, 2.2);
            page.line(box.x + box.width * 0.30, box.y + box.height - 22, box.x + box.width * 0.72, box.y + box.height - 10, PdfColor.DarkText, 2.2);
            page.polygon([[cx, box.y + 7], [box.x + box.width * 0.36, box.y + box.height - 20], [box.x + box.width * 0.48, box.y + box.height - 16], [box.x + box.width * 0.58, box.y + box.height - 16], [box.x + box.width * 0.66, box.y + box.height - 24]], PdfColor.White, PdfColor.DarkText);
        } else if (item.itemType === "FlagPole") {
            const poleX = box.x + box.width * 0.38;
            page.line(poleX, box.y + 4, poleX, box.y + box.height - 5, PdfColor.DarkText, 1.4);
            page.rect(poleX + 1, box.y + 4, box.width * 0.34, Math.min(18, box.height * 0.28), PdfColor.White, PdfColor.DarkText);
        } else {
            page.polygon([[cx, box.y + 5], [box.x + box.width * 0.18, box.y + box.height - 24], [box.x + box.width * 0.82, box.y + box.height - 24]], PdfColor.White, PdfColor.DarkText);
            page.line(cx, box.y + 9, cx, box.y + box.height - 24, PdfColor.DarkText, 0.8);
        }
        page.centerText(cx, box.y + box.height - 11, item.name || "Unnamed item", 9, true, PdfColor.DarkText);
    }

    class PdfDocument {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.pages = [];
        }
        addPage() {
            const page = new PdfPage(this.width, this.height);
            this.pages.push(page);
            return page;
        }
        save() {
            const objects = ["<< /Type /Catalog /Pages 2 0 R >>", "", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"];
            const pageIds = [];
            for (const page of this.pages) {
                const pageId = objects.length + 1;
                const contentId = objects.length + 2;
                pageIds.push(pageId);
                objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${fmt(this.width)} ${fmt(this.height)}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`);
                const content = page.content;
                objects.push(`<< /Length ${asciiByteCount(content)} >>\nstream\n${content}\nendstream`);
            }
            objects[1] = `<< /Type /Pages /Kids [${pageIds.map(id => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;
            let pdf = "%PDF-1.4\n";
            const offsets = [0];
            for (let i = 0; i < objects.length; i++) {
                offsets.push(asciiByteCount(pdf));
                pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
            }
            const xref = asciiByteCount(pdf);
            pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
            for (const offset of offsets.slice(1)) {
                pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
            }
            pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
            return new TextEncoder().encode(pdf);
        }
    }

    class PdfPage {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.content = "";
        }
        rect(x, yTop, width, height, fill, stroke) {
            const y = this.height - yTop - height;
            this.content += `${pdfColor(fill, "rg")} ${pdfColor(stroke, "RG")} 0.5 w ${fmt(x)} ${fmt(y)} ${fmt(width)} ${fmt(height)} re B\n`;
        }
        line(x1, y1, x2, y2, color, thickness = 1) {
            this.content += `${pdfColor(color, "RG")} ${fmt(thickness)} w ${fmt(x1)} ${fmt(this.height - y1)} m ${fmt(x2)} ${fmt(this.height - y2)} l S\n`;
        }
        polygon(points, fill, stroke) {
            if (points.length < 3) return;
            let line = `${pdfColor(fill, "rg")} ${pdfColor(stroke, "RG")} 0.7 w ${fmt(points[0][0])} ${fmt(this.height - points[0][1])} m `;
            for (const point of points.slice(1)) {
                line += `${fmt(point[0])} ${fmt(this.height - point[1])} l `;
            }
            this.content += `${line}h B\n`;
        }
        ellipse(cx, cy, radius, fill, stroke) {
            const y = this.height - cy;
            const k = 0.552284749831;
            const rk = radius * k;
            this.content += `${pdfColor(fill, "rg")} ${pdfColor(stroke, "RG")} 0.7 w\n`;
            this.content += `${fmt(cx + radius)} ${fmt(y)} m\n`;
            this.content += `${fmt(cx + radius)} ${fmt(y + rk)} ${fmt(cx + rk)} ${fmt(y + radius)} ${fmt(cx)} ${fmt(y + radius)} c\n`;
            this.content += `${fmt(cx - rk)} ${fmt(y + radius)} ${fmt(cx - radius)} ${fmt(y + rk)} ${fmt(cx - radius)} ${fmt(y)} c\n`;
            this.content += `${fmt(cx - radius)} ${fmt(y - rk)} ${fmt(cx - rk)} ${fmt(y - radius)} ${fmt(cx)} ${fmt(y - radius)} c\n`;
            this.content += `${fmt(cx + rk)} ${fmt(y - radius)} ${fmt(cx + radius)} ${fmt(y - rk)} ${fmt(cx + radius)} ${fmt(y)} c B\n`;
        }
        text(x, yTop, text, fontSize, bold, color) {
            this.content += `${pdfColor(color, "rg")} BT ${bold ? "/F2" : "/F1"} ${fmt(fontSize)} Tf 1 0 0 1 ${fmt(x)} ${fmt(this.height - yTop - fontSize)} Tm (${pdfEscape(text)}) Tj ET\n`;
        }
        centerText(centerX, yTop, text, fontSize, bold, color) {
            this.text(centerX - estimateTextWidth(text, fontSize, bold) / 2, yTop, text, fontSize, bold, color);
        }
    }

    const PdfColor = {
        Black: [0, 0, 0],
        White: [1, 1, 1],
        Green: [0.18, 0.49, 0.2],
        HeaderGreen: [0.27, 0.51, 0.31],
        DarkGray: [0.35, 0.35, 0.35],
        GridLine: [0.75, 0.75, 0.75],
        RowShade: [0.95, 0.97, 0.93],
        WarningPink: [1, 0.92, 0.92],
        Red: [0.72, 0.12, 0.12],
        DarkText: [0.12, 0.12, 0.12],
        MidGray: [0.45, 0.45, 0.45]
    };

    function ensurePdfSpace(pdf, addPage, y, neededHeight, pageHeight) {
        if (y + neededHeight <= pageHeight - 36) {
            return y;
        }
        addPage();
        return 36;
    }

    function pdfColor(color, op) {
        return `${fmt(color[0])} ${fmt(color[1])} ${fmt(color[2])} ${op}`;
    }

    function pdfEscape(value) {
        let result = "";
        for (const ch of String(value ?? "")) {
            const code = ch.charCodeAt(0);
            if (ch === "\\") result += "\\\\";
            else if (ch === "(") result += "\\(";
            else if (ch === ")") result += "\\)";
            else if (code >= 32 && code <= 126) result += ch;
            else result += "?";
        }
        return result;
    }

    function fmt(value) {
        return Number(value).toFixed(3).replace(/\.?0+$/, "");
    }

    function asciiByteCount(value) {
        return value.length;
    }

    function estimateTextWidth(text, fontSize, bold) {
        let units = 0;
        for (const ch of String(text)) {
            if (ch === " ") units += 0.278;
            else if ("ijlI.,:;'".includes(ch)) units += 0.278;
            else if ("ftr!".includes(ch)) units += 0.333;
            else if ("MWmw".includes(ch)) units += 0.778;
            else if (/[A-Z]/.test(ch)) units += 0.667;
            else if (/[0-9]/.test(ch)) units += 0.556;
            else if (ch === "-") units += 0.333;
            else units += 0.556;
        }
        return units * fontSize * (bold ? 1.03 : 1.0);
    }

    function wrapText(text, width, fontSize) {
        const maxChars = Math.max(5, Math.floor(width / (fontSize * 0.52)));
        const words = String(text || " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
        const lines = [];
        let current = "";
        for (const word of words) {
            if (word.length > maxChars) {
                if (current) {
                    lines.push(current);
                    current = "";
                }
                for (let i = 0; i < word.length; i += maxChars) {
                    lines.push(word.slice(i, i + maxChars));
                }
                continue;
            }
            const candidate = current ? `${current} ${word}` : word;
            if (candidate.length > maxChars) {
                lines.push(current);
                current = word;
            } else {
                current = candidate;
            }
        }
        if (current) lines.push(current);
        return lines.length ? lines : [""];
    }

    function tentIcon(color) {
        const dark = darkenColor(color, 0.45);
        const shade = darkenColor(color, 0.18);
        return `<svg width="170" height="96" viewBox="0 0 170 96" aria-hidden="true">
            <ellipse cx="85" cy="84" rx="48" ry="6" fill="rgba(0,0,0,.22)"/>
            <polygon points="85,16 33,84 137,84" fill="${escapeAttribute(color)}" stroke="${escapeAttribute(dark)}" stroke-width="2.2"/>
            <polygon points="85,16 85,84 137,84" fill="${escapeAttribute(shade)}" stroke="${escapeAttribute(dark)}" stroke-width="1"/>
            <line x1="85" y1="26" x2="85" y2="83" stroke="#000" stroke-width="1.3" stroke-linecap="round"/>
        </svg>`;
    }

    function bunkRoomIcon(color) {
        return `<svg width="170" height="96" viewBox="0 0 170 96" aria-hidden="true">
            <ellipse cx="85" cy="84" rx="48" ry="7" fill="rgba(0,0,0,.18)"/>
            <rect x="44" y="24" width="82" height="66" rx="6" fill="#f2f8ef" stroke="#4f463a" stroke-width="2"/>
            <polygon points="42,24 85,10 128,24" fill="${escapeAttribute(color)}" stroke="#4f463a" stroke-width="1.5"/>
            <line x1="59" y1="41" x2="59" y2="77" stroke="#8d5e34" stroke-width="3"/>
            <line x1="111" y1="41" x2="111" y2="77" stroke="#8d5e34" stroke-width="3"/>
            <rect x="59" y="45" width="52" height="16" rx="3" fill="#fff" stroke="#8d5e34" stroke-width="2"/>
            <rect x="74" y="48" width="34" height="10" rx="3" fill="${escapeAttribute(color)}"/>
            <ellipse cx="67" cy="53" rx="6" ry="5" fill="#f5f5f5" stroke="#d3d3d3"/>
            <rect x="59" y="65" width="52" height="16" rx="3" fill="#fff" stroke="#8d5e34" stroke-width="2"/>
            <rect x="74" y="68" width="34" height="10" rx="3" fill="${escapeAttribute(color)}"/>
            <ellipse cx="67" cy="73" rx="6" ry="5" fill="#f5f5f5" stroke="#d3d3d3"/>
            <line x1="98" y1="47" x2="98" y2="79" stroke="#8d5e34" stroke-width="2"/>
            <line x1="106" y1="47" x2="106" y2="79" stroke="#8d5e34" stroke-width="2"/>
            <line x1="98" y1="56" x2="106" y2="56" stroke="#8d5e34" stroke-width="1.4"/>
            <line x1="98" y1="66" x2="106" y2="66" stroke="#8d5e34" stroke-width="1.4"/>
        </svg>`;
    }

    function personIcon(person) {
        const color = person.gender === "Female" ? "#ec407a" : person.gender === "Other" ? "#f57c00" : "#4169e1";
        const outline = darkenColor(color, 0.35);
        const hat = person.personType === "Adult"
            ? `<rect x="37" y="2" width="18" height="6" rx="2" fill="#ffb74d" stroke="saddlebrown" stroke-width=".8"/><line x1="33" y1="8" x2="59" y2="8" stroke="saddlebrown" stroke-width="2" stroke-linecap="round"/>`
            : person.personType === "YoungLeader"
                ? `<rect x="38" y="2" width="17" height="8" rx="5" fill="#00897b" stroke="#2f4f4f" stroke-width=".8"/><polygon points="51,7 63,8 52,11" fill="#00897b" stroke="#2f4f4f" stroke-width=".8"/>`
                : camperTypeMark(person.camperType);
        return `<svg width="92" height="46" viewBox="0 0 92 46" aria-hidden="true">
            ${hat}
            <circle cx="46" cy="14" r="6" fill="${color}" stroke="${outline}" stroke-width="1"/>
            <line x1="46" y1="21" x2="46" y2="32" stroke="${color}" stroke-width="${person.personType === "Camper" ? "2.6" : "3.1"}" stroke-linecap="round"/>
            <line x1="34" y1="25" x2="58" y2="25" stroke="${color}" stroke-width="2.4" stroke-linecap="round"/>
            <line x1="46" y1="32" x2="37" y2="43" stroke="${color}" stroke-width="2.4" stroke-linecap="round"/>
            <line x1="46" y1="32" x2="55" y2="43" stroke="${color}" stroke-width="2.4" stroke-linecap="round"/>
        </svg>`;
    }

    function camperTypeMark(type) {
        if (type === "Beaver") {
            return `<g transform="translate(11 10) scale(.52)"><ellipse cx="24" cy="23" rx="21" ry="15" fill="#8b532a" stroke="#4c2e18" stroke-width="1.4"/><circle cx="5" cy="11" r="5" fill="#8b532a" stroke="#4c2e18"/><circle cx="36" cy="11" r="5" fill="#8b532a" stroke="#4c2e18"/><ellipse cx="20" cy="28" rx="11" ry="6.5" fill="#d2965c" stroke="#4c2e18"/><circle cx="21" cy="22" r="2.5"/><circle cx="15" cy="20" r="1.8"/><circle cx="29" cy="20" r="1.8"/><rect x="18" y="34" width="5" height="7" rx="1" fill="#fff"/><rect x="23" y="34" width="5" height="7" rx="1" fill="#fff"/></g>`;
        }
        if (type === "Cub") {
            return `<g transform="translate(13 12) rotate(-18 16 16) scale(.76)"><ellipse cx="15.5" cy="21" rx="7.5" ry="7" fill="#ffc425" stroke="#a77b00"/><circle cx="4" cy="10" r="3.5" fill="#ffc425" stroke="#a77b00"/><circle cx="11" cy="6" r="3.5" fill="#ffc425" stroke="#a77b00"/><circle cx="19" cy="6" r="3.5" fill="#ffc425" stroke="#a77b00"/><circle cx="26" cy="10" r="3.5" fill="#ffc425" stroke="#a77b00"/></g>`;
        }
        if (type === "Explorer") {
            return `<g transform="translate(13 14) scale(.62)"><polygon points="3,33 18,5 33,33" fill="#5a2c82" stroke="#32124f" stroke-width="1.5"/><polygon points="18,5 12,17 18,14 24,17" fill="#fff"/></g>`;
        }
        if (type === "Scout") {
            return `<g transform="translate(18 14) scale(.25)" fill="none" stroke="#6a1b9a" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14.4 23.2 C13.6 16.8 7.2 12.8 7.2 6.4 C7.2 .8 12 -3.2 17.6 -8 C23.2 -3.2 28 .8 28 6.4 C28 12.8 21.6 16.8 20.8 23.2"/><path d="M11.2 23.2 C9.6 16 6.4 9.6 1.6 8 C-4 6.4 -8.8 9.6 -9.6 16"/><path d="M24 23.2 C25.6 16 28.8 9.6 33.6 8 C39.2 6.4 44 9.6 44.8 16"/><rect x="1.6" y="25.6" width="32" height="2.8" rx=".8" fill="#6a1b9a"/><path d="M14.4 31.2 C13.6 36 12 40 8.8 43.2 C11.2 48 14.4 50.4 17.6 52 C20.8 50.4 24 48 26.4 43.2 C23.2 40 21.6 36 20.8 31.2"/></g>`;
        }
        return "";
    }

    function personBadge(person) {
        let text = "Camper";
        let color = "#2e7d32";
        let foreground = "#ffffff";
        if (person.personType === "Adult") {
            text = "Adult";
            color = "#455a64";
        } else if (person.personType === "YoungLeader") {
            text = "YL";
            color = "#00897b";
        } else if (person.camperType === "Beaver") {
            text = "Beaver";
            color = "#009fda";
        } else if (person.camperType === "Cub") {
            text = "Cub";
            color = "#ffc425";
            foreground = "#000000";
        } else if (person.camperType === "Scout") {
            text = "Scout";
            color = "#007934";
        } else if (person.camperType === "Explorer") {
            text = "Explorer";
            color = "#5a2c82";
        }
        return `<div class="person-badge" style="background:${color};color:${foreground};">${escapeHtml(text)}</div>`;
    }

    function siteItemIcon(item) {
        switch (item.itemType) {
            case "MessTent":
                return `<svg width="92" height="62" viewBox="0 0 92 62"><polygon points="46,8 16,45 76,45" fill="#ffe0b2" stroke="saddlebrown" stroke-width="2"/><line x1="46" y1="14" x2="46" y2="45" stroke="saddlebrown" stroke-width="1.6"/><rect x="27" y="40" width="38" height="10" rx="2" fill="sienna" stroke="#000"/><circle cx="37" cy="46" r="4" fill="#fff" stroke="gray"/><circle cx="57" cy="46" r="4" fill="#fff" stroke="gray"/></svg>`;
            case "StorageTent":
                return `<svg width="92" height="62" viewBox="0 0 92 62"><polygon points="46,9 17,47 75,47" fill="#81c784" stroke="darkgreen" stroke-width="2"/><line x1="46" y1="16" x2="46" y2="47" stroke="darkgreen" stroke-width="1.6"/><rect x="29" y="38" width="13" height="12" fill="tan" stroke="saddlebrown"/><rect x="44" y="38" width="13" height="12" fill="tan" stroke="saddlebrown"/><rect x="36" y="28" width="13" height="12" fill="tan" stroke="saddlebrown"/></svg>`;
            case "FlagPole":
                return `<svg width="92" height="62" viewBox="0 0 92 62"><rect x="34" y="8" width="5" height="48" rx="2" fill="saddlebrown" stroke="#000"/><clipPath id="flagClip"><rect x="39" y="10" width="32" height="20"/></clipPath><g clip-path="url(#flagClip)"><rect x="39" y="10" width="32" height="20" fill="#012169"/><line x1="37" y1="9" x2="73" y2="31" stroke="#fff" stroke-width="5"/><line x1="73" y1="9" x2="37" y2="31" stroke="#fff" stroke-width="5"/><line x1="37" y1="9" x2="73" y2="31" stroke="red" stroke-width="2.2"/><line x1="73" y1="9" x2="37" y2="31" stroke="red" stroke-width="2.2"/><rect x="39" y="17" width="32" height="6" fill="#fff"/><rect x="52" y="10" width="6" height="20" fill="#fff"/><rect x="39" y="18.5" width="32" height="3" fill="red"/><rect x="53.5" y="10" width="3" height="20" fill="red"/></g><rect x="39" y="10" width="32" height="20" fill="none" stroke="#000"/><ellipse cx="37" cy="58" rx="14" ry="4" fill="rgba(0,0,0,.3)"/></svg>`;
            case "Fire":
                return `<svg width="92" height="62" viewBox="0 0 92 62"><line x1="29" y1="53" x2="62" y2="43" stroke="saddlebrown" stroke-width="5"/><line x1="30" y1="43" x2="63" y2="53" stroke="saddlebrown" stroke-width="5"/><path d="M46 11 C33 25 37 35 42 43 C30 36 28 48 39 55 C48 61 62 55 64 43 C66 33 55 27 54 18 C51 24 49 28 46 31 C49 22 48 16 46 11 Z" fill="orangered" stroke="darkred" stroke-width="1.4"/><path d="M47 30 C41 38 43 47 48 51 C54 47 56 39 50 33 C49 37 47 39 45 41 C46 36 47 33 47 30 Z" fill="gold" stroke="orange"/></svg>`;
            case "KitchenTent":
                return `<svg width="92" height="62" viewBox="0 0 92 62"><polygon points="46,8 16,46 76,46" fill="#ffe082" stroke="darkgoldenrod" stroke-width="2"/><line x1="46" y1="15" x2="46" y2="46" stroke="darkgoldenrod" stroke-width="1.6"/><rect x="34" y="39" width="24" height="12" rx="2" fill="dimgray" stroke="#000"/><line x1="39" y1="36" x2="39" y2="42" stroke="orangered" stroke-width="2"/><line x1="46" y1="34" x2="46" y2="42" stroke="orangered" stroke-width="2"/><line x1="53" y1="36" x2="53" y2="42" stroke="orangered" stroke-width="2"/></svg>`;
            case "EventShelter":
                return `<svg width="92" height="62" viewBox="0 0 92 62"><polygon points="18,24 28,10 64,10 74,24" fill="#90caf9" stroke="steelblue" stroke-width="2"/><line x1="22" y1="24" x2="22" y2="52" stroke="steelblue" stroke-width="2"/><line x1="70" y1="24" x2="70" y2="52" stroke="steelblue" stroke-width="2"/><line x1="30" y1="24" x2="30" y2="52" stroke="steelblue" stroke-width="1.5"/><line x1="62" y1="24" x2="62" y2="52" stroke="steelblue" stroke-width="1.5"/><line x1="18" y1="52" x2="74" y2="52" stroke="steelblue" stroke-width="2"/></svg>`;
            default:
                return "";
        }
    }

    function optionHtml(values, labels, selected) {
        return values.map((value, index) => `<option value="${escapeAttribute(value)}"${value === selected ? " selected" : ""}>${escapeHtml(labels[index])}</option>`).join("");
    }

    function sizeOptionHtml(options, selected) {
        const closest = options.reduce((best, option) => Math.abs(option.value - selected) < Math.abs(best.value - selected) ? option : best, options[0]);
        return options.map(option => `<option value="${option.value}"${option === closest ? " selected" : ""}>${escapeHtml(option.label)}</option>`).join("");
    }

    function removeInvalidTentAssignments() {
        const tentIds = new Set(state.project.tents.map(t => t.id));
        for (const person of state.project.people) {
            if (person.tentId && !tentIds.has(person.tentId)) {
                person.tentId = null;
            }
        }
        for (const id of [...state.selectedTentIds]) {
            if (!tentIds.has(id)) {
                state.selectedTentIds.delete(id);
            }
        }
    }

    function compactLegacyDefaultTentLayout() {
        if (state.project.tents.length <= DefaultTentColumns || !tentsMatchLegacyDefaultLayout()) {
            return;
        }
        state.project.tents.forEach((tent, index) => {
            const position = getDefaultTentPosition(index);
            tent.x = position.x;
            tent.y = position.y;
        });
        if (!state.isDirty) {
            state.isDirty = true;
        }
    }

    function tentsMatchLegacyDefaultLayout() {
        for (let i = 0; i < state.project.tents.length; i++) {
            const legacyX = 80 + (i % LegacyDefaultTentColumns * LegacyTentPitchHorizontalSpacing);
            const legacyY = 80 + (Math.floor(i / LegacyDefaultTentColumns) * LegacyTentPitchVerticalSpacing);
            if (!nearlyEqual(state.project.tents[i].x, legacyX) || !nearlyEqual(state.project.tents[i].y, legacyY)) {
                return false;
            }
        }
        return true;
    }

    function arrangeAllAllocatedPeopleByTent() {
        for (const tent of state.project.tents) {
            const people = state.project.people.filter(p => p.tentId === tent.id).sort(compareByName);
            placePeopleInTent(people, tent);
        }
    }

    function placePeopleInTent(people, tent) {
        people.forEach((person, index) => {
            const slot = buildOccupantSlot(tent, index, people.length);
            person.x = slot.x;
            person.y = slot.y;
        });
    }

    function buildOccupantSlot(tent, slot, peopleCount) {
        const row = Math.floor(slot / OccupantColumns);
        const column = slot % OccupantColumns;
        let peopleInRow = Math.min(OccupantColumns, Math.max(0, peopleCount - (row * OccupantColumns)));
        if (peopleInRow === 0) peopleInRow = OccupantColumns;
        const totalWidth = (peopleInRow * PersonCardWidth) + ((peopleInRow - 1) * OccupantGap);
        const startX = tent.x + ((getTentCardWidth(tent) - totalWidth) / 2);
        return {
            x: Math.max(0, startX + (column * (PersonCardWidth + OccupantGap))),
            y: tent.y + getTentCardHeight(tent) + OccupantGap + (row * (PersonCardHeight + OccupantGap))
        };
    }

    function findAllocationTargetAt(point) {
        const tent = findTentAt(point);
        if (tent) return tent;
        const targetPerson = [...state.project.people].reverse().find(p => p.tentId &&
            point.x >= p.x && point.x <= p.x + PersonCardWidth &&
            point.y >= p.y && point.y <= p.y + PersonCardHeight);
        return targetPerson?.tentId ? findTent(targetPerson.tentId) : null;
    }

    function findTentAt(point) {
        return [...state.project.tents].reverse().find(t =>
            point.x >= t.x && point.x <= t.x + getTentCardWidth(t) &&
            point.y >= t.y && point.y <= t.y + getTentCardHeight(t));
    }

    function getPlanningContentRight() {
        return Math.max(
            0,
            ...state.project.tents.map(t => t.x + getTentCardWidth(t)),
            ...state.project.people.filter(p => p.tentId).map(p => p.x + PersonCardWidth),
            ...state.project.siteItems.map(s => s.x + getSiteItemCardWidth(s))
        );
    }

    function getPlanningContentBottom() {
        return Math.max(
            0,
            ...state.project.tents.map(t => t.y + getTentCardHeight(t)),
            ...state.project.people.filter(p => p.tentId).map(p => p.y + PersonCardHeight),
            ...state.project.siteItems.map(s => s.y + getSiteItemCardHeight(s))
        );
    }

    function getDefaultTentPosition(index) {
        return {
            x: DefaultTentStartX + (index % DefaultTentColumns * TentPitchHorizontalSpacing),
            y: DefaultTentStartY + (Math.floor(index / DefaultTentColumns) * TentPitchVerticalSpacing)
        };
    }

    function getDefaultSiteItemPosition(index) {
        return {
            x: DefaultTentStartX + (index % DefaultTentColumns * (SiteItemCardWidth + 20)),
            y: DefaultTentStartY + (Math.floor(state.project.tents.length / DefaultTentColumns) * TentPitchVerticalSpacing) + (Math.floor(index / DefaultTentColumns) * (SiteItemCardHeight + 20)) + 50
        };
    }

    function toggleTentSelection(tentId) {
        if (!findTent(tentId)) {
            return;
        }
        if (state.selectedTentIds.has(tentId)) {
            state.selectedTentIds.delete(tentId);
        } else {
            state.selectedTentIds.add(tentId);
        }
        refreshUI();
    }

    function findTent(id) {
        return state.project.tents.find(t => t.id === id);
    }

    function findPerson(id) {
        return state.project.people.find(p => p.id === id);
    }

    function findSiteItem(id) {
        return state.project.siteItems.find(s => s.id === id);
    }

    function hasDirectFriendLink(a, b) {
        const key = buildLinkKey(a, b);
        return state.project.friendLinks.some(link => buildLinkKey(link.personAId, link.personBId) === key);
    }

    function hasDirectFoeLink(a, b) {
        const key = buildLinkKey(a, b);
        return state.project.foeLinks.some(link => buildLinkKey(link.personAId, link.personBId) === key);
    }

    function getFriendLinkName(link) {
        return `${findPerson(link.personAId)?.name || "Missing person"} - ${findPerson(link.personBId)?.name || "Missing person"}`;
    }

    function getFoeLinkName(link) {
        return `${findPerson(link.personAId)?.name || "Missing person"} \u2260 ${findPerson(link.personBId)?.name || "Missing person"}`;
    }

    function getUniqueTentName(baseName) {
        const existing = new Set(state.project.tents.map(t => t.name.toLowerCase()));
        if (!existing.has(baseName.toLowerCase())) {
            return baseName;
        }
        for (let i = 2; ; i++) {
            const name = `${baseName} ${i}`;
            if (!existing.has(name.toLowerCase())) {
                return name;
            }
        }
    }

    function syncAllocationsFromPeople(project) {
        project.allocations = project.people.sort(compareByName).map(person => ({ personId: person.id, tentId: person.tentId || null }));
    }

    function applyAllocationsIfPresent(project) {
        if (!project.allocations?.length) {
            return;
        }
        const peopleById = Object.fromEntries(project.people.map(p => [p.id, p]));
        const validTentIds = new Set(project.tents.map(t => t.id));
        for (const allocation of project.allocations) {
            const person = peopleById[allocation.personId];
            if (!person) continue;
            person.tentId = allocation.tentId && validTentIds.has(allocation.tentId) ? allocation.tentId : null;
        }
    }

    function syncFriendGroupsFromLinks(project) {
        const existing = new Map(array(project.friendGroups).map(group => [array(group.personIds).slice().sort().join("|"), group.id]));
        project.friendGroups = getFriendGroups(project).map(group => {
            const personIds = [...group].sort();
            const key = personIds.join("|");
            return { id: existing.get(key) || `friend-group-${hashString(key)}`, personIds };
        });
    }

    function getDefaultTentColour(tentType) {
        return {
            GreenPatrolTent: "#4CAF50",
            BlueDomeTent: "#2196F3",
            OrangeHikeTent: "#FF9800",
            PurpleLeaderTent: "#9C27B0",
            GreyOtherTent: "#9E9E9E"
        }[tentType] || "#C8C8C8";
    }

    function getDefaultSiteItemColour(itemType) {
        return {
            MessTent: "#FFFFFF",
            StorageTent: "#66BB6A",
            FlagPole: "#757575",
            Fire: "#FF5722",
            KitchenTent: "#FFD54F",
            EventShelter: "#90CAF9"
        }[itemType] || "#C8C8C8";
    }

    function getDefaultSiteItemScale(itemType) {
        return { MessTent: 1.45, KitchenTent: 1.25, EventShelter: 1.55 }[itemType] || 1.0;
    }

    function getTentTypeName(tent) {
        return TentTypeNames[TentType.indexOf(tent.tentType)] || "Unknown";
    }

    function getTentSummary(people) {
        if (!people.length) {
            return "Empty";
        }
        const parts = [];
        addSummaryPart(parts, people, "Male", "Camper", "male camper");
        addSummaryPart(parts, people, "Female", "Camper", "female camper");
        addSummaryPart(parts, people, "Other", "Camper", "other-gender camper");
        addSummaryPart(parts, people, "Male", "Adult", "male adult");
        addSummaryPart(parts, people, "Female", "Adult", "female adult");
        addSummaryPart(parts, people, "Other", "Adult", "other-gender adult");
        addSummaryPart(parts, people, "Male", "YoungLeader", "male young leader");
        addSummaryPart(parts, people, "Female", "YoungLeader", "female young leader");
        addSummaryPart(parts, people, "Other", "YoungLeader", "other-gender young leader");
        return parts.join(", ");
    }

    function addSummaryPart(parts, people, gender, type, label) {
        const count = people.filter(p => p.gender === gender && p.personType === type).length;
        if (count > 0) {
            parts.push(`${count} ${label}${count === 1 ? "" : "s"}`);
        }
    }

    function getPersonTypeDisplayName(type) {
        return { Camper: "Camper", Adult: "Adult", YoungLeader: "Young Leader" }[type] || "Unknown";
    }

    function getCamperTypeDisplayName(type) {
        return type || "Standard";
    }

    function getLayoutPersonDisplayName(person) {
        return person.personType === "Camper" && person.camperType !== "Standard"
            ? `${person.name} (${getCamperTypeDisplayName(person.camperType)})`
            : person.name;
    }

    function getUnallocatedPersonDisplayName(person) {
        return person.personType === "Camper"
            ? `${person.name} - ${getCamperTypeDisplayName(person.camperType)} camper`
            : `${person.name} - ${getPersonTypeDisplayName(person.personType)}`;
    }

    function getSleepingPlaceSummary(tent, peopleCount) {
        const countText = `${peopleCount} ${peopleCount === 1 ? "person" : "people"}`;
        if (tent.accommodationType === "BunkRoom") {
            return `${getTentTypeName(tent).replace(/ tent$/i, "")} bunk room - ${countText}`;
        }
        return `${getTentTypeName(tent)} - ${countText}`;
    }

    function simplifyWarning(message, tentName) {
        return String(message).replace(new RegExp(`: ${escapeRegExp(tentName)}`, "i"), "");
    }

    function getDefaultPdfFileName(project) {
        return `${sanitizeFileNamePart(project.name)}_Tent_Allocation_Plan`;
    }

    function getDefaultLayoutPdfFileName(project) {
        const date = toDateInputValue(project.campDate);
        const campName = sanitizeFileNamePart(project.name, "");
        return campName ? `TentAllocation_${campName}_${date}` : `TentAllocation_${date}`;
    }

    function getSourceBounds(project) {
        const boxes = [
            ...project.tents.map(t => ({ x: t.x, y: t.y, width: getTentCardWidth(t), height: getTentCardHeight(t) })),
            ...project.siteItems.map(s => ({ x: s.x, y: s.y, width: getSiteItemCardWidth(s), height: getSiteItemCardHeight(s) }))
        ];
        if (!boxes.length) return { x: 0, y: 0, width: 1, height: 1 };
        const left = Math.min(...boxes.map(b => b.x));
        const top = Math.min(...boxes.map(b => b.y));
        const right = Math.max(...boxes.map(b => b.x + b.width));
        const bottom = Math.max(...boxes.map(b => b.y + b.height));
        return { x: left, y: top, width: Math.max(1, right - left), height: Math.max(1, bottom - top) };
    }

    function buildLayoutTransform(source, destination) {
        const scale = Math.min(destination.width / source.width, destination.height / source.height);
        const usedWidth = source.width * scale;
        const usedHeight = source.height * scale;
        return {
            source,
            scale,
            offsetX: destination.x + ((destination.width - usedWidth) / 2),
            offsetY: destination.y + ((destination.height - usedHeight) / 2)
        };
    }

    function mapBox(transform, box) {
        return {
            x: transform.offsetX + ((box.x - transform.source.x) * transform.scale),
            y: transform.offsetY + ((box.y - transform.source.y) * transform.scale),
            width: box.width * transform.scale,
            height: box.height * transform.scale
        };
    }

    function downloadText(filename, contentType, content) {
        downloadBlob(filename, new Blob([content], { type: contentType }));
    }

    function downloadBytes(filename, contentType, bytes) {
        downloadBlob(filename, new Blob([bytes], { type: contentType }));
    }

    function downloadBlob(filename, blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 0);
    }

    function getTentCardWidth(tent) {
        return TentCardWidth * normalizeScale(tent.sizeScale);
    }

    function getTentCardHeight(tent) {
        return TentCardHeight * normalizeScale(tent.sizeScale);
    }

    function getSiteItemCardWidth(item) {
        return SiteItemCardWidth * normalizeScale(item.sizeScale);
    }

    function getSiteItemCardHeight(item) {
        return SiteItemCardHeight * normalizeScale(item.sizeScale);
    }

    function normalizeScale(scale) {
        return clamp(Number(scale) || 1, 0.7, 1.8);
    }

    function snapToGrid(value) {
        return Math.round(value / GridSnapSize) * GridSnapSize;
    }

    function normalizeCoordinate(value) {
        const n = Number(value) || 0;
        return clamp(Number.isFinite(n) ? n : 0, 0, 100000);
    }

    function normalizeDate(value, addDays) {
        const date = value ? new Date(value) : new Date();
        if (Number.isNaN(date.getTime())) {
            const fallback = new Date();
            fallback.setDate(fallback.getDate() + addDays);
            return fallback.toISOString();
        }
        return date.toISOString();
    }

    function toDateInputValue(value) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    function fromDateInputValue(value) {
        return new Date(`${value}T00:00:00`).toISOString();
    }

    function formatShortDate(value) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "";
        return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
    }

    function formatLongDate(value) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "";
        return new Intl.DateTimeFormat("en-GB", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
        }).format(date);
    }

    function compareByName(a, b) {
        return (a.name || "").localeCompare(b.name || "");
    }

    function normalizeEnum(value, values, fallback) {
        if (typeof value === "number" && values[value]) return values[value];
        if (typeof value === "string") {
            const exact = values.find(v => v.toLowerCase() === value.toLowerCase());
            if (exact) return exact;
        }
        return fallback;
    }

    function ensureId(id) {
        return id && String(id).trim() ? String(id) : createId();
    }

    function createId() {
        if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
        return "id-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    }

    function array(value) {
        return Array.isArray(value) ? value : [];
    }

    function cleanName(value, fallback) {
        const clean = cleanString(value);
        return clean || fallback;
    }

    function cleanString(value) {
        return String(value ?? "").trim();
    }

    function buildLinkKey(a, b) {
        return a < b ? `${a}|${b}` : `${b}|${a}`;
    }

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    function nearlyEqual(a, b) {
        return Math.abs(a - b) < 0.1;
    }

    function isHexColour(value) {
        return /^#[0-9a-f]{6}$/i.test(String(value || ""));
    }

    function darkenColor(hex, factor) {
        const color = isHexColour(hex) ? hex : "#c8c8c8";
        const r = Math.max(0, parseInt(color.slice(1, 3), 16) - parseInt(color.slice(1, 3), 16) * factor);
        const g = Math.max(0, parseInt(color.slice(3, 5), 16) - parseInt(color.slice(3, 5), 16) * factor);
        const b = Math.max(0, parseInt(color.slice(5, 7), 16) - parseInt(color.slice(5, 7), 16) * factor);
        return `#${[r, g, b].map(v => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
    }

    function escapeHtml(value) {
        return String(value ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[ch]));
    }

    function escapeAttribute(value) {
        return escapeHtml(value);
    }

    function escapeRegExp(value) {
        return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function stripExtension(fileName) {
        return String(fileName).replace(/\.[^.]+$/, "");
    }

    function sanitizeFileNamePart(value, fallback = "Camp") {
        const clean = String(value ?? fallback).replace(/[<>:"/\\|?*\x00-\x1f]/g, "_").trim();
        return clean || fallback;
    }

    function normalizeHeader(value) {
        return String(value || "").trim().replace(/^\uFEFF/, "").replace(/[^a-z0-9]/gi, "").toLowerCase();
    }

    function getCsvField(row, index) {
        return Number.isInteger(index) && index >= 0 && index < row.length ? row[index].trim() : "";
    }

    function tryParseGender(value) {
        switch (normalizeHeader(value)) {
            case "m":
            case "male":
            case "boy":
            case "boys":
            case "man":
                return "Male";
            case "f":
            case "female":
            case "girl":
            case "girls":
            case "woman":
                return "Female";
            case "o":
            case "other":
            case "x":
            case "nonbinary":
            case "nonbinarygender":
            case "nonbinaryperson":
                return "Other";
            default:
                return null;
        }
    }

    function tryParsePersonType(value) {
        switch (normalizeHeader(value)) {
            case "camper":
            case "campers":
            case "scout":
            case "scouts":
            case "child":
            case "youngperson":
            case "youngpeople":
            case "youth":
                return "Camper";
            case "adult":
            case "adults":
            case "leader":
            case "leaders":
            case "adultleader":
            case "scouter":
            case "helper":
                return "Adult";
            case "yl":
            case "youngleader":
            case "youngleaders":
            case "explorer":
            case "explorers":
            case "youngleaderhelper":
                return "YoungLeader";
            default:
                return null;
        }
    }

    function cleanCsvName(value) {
        const name = String(value).split(/\s+/).filter(Boolean).join(" ");
        const letters = [...name].filter(ch => /[a-z]/i.test(ch));
        if (!letters.length) return name;
        const allUpper = letters.every(ch => ch === ch.toUpperCase());
        const allLower = letters.every(ch => ch === ch.toLowerCase());
        if (!allUpper && !allLower) return name;
        return name.toLowerCase().replace(/\b\w/g, ch => ch.toUpperCase());
    }

    function debounce(fn, delay) {
        let id = null;
        return (...args) => {
            clearTimeout(id);
            id = setTimeout(() => fn(...args), delay);
        };
    }

    function minGroupName(group, namesById) {
        return group.map(id => namesById[id] || id).sort((a, b) => a.localeCompare(b))[0] || "";
    }

    function hashString(value) {
        let hash = 0;
        for (let i = 0; i < value.length; i++) {
            hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
        }
        return Math.abs(hash).toString(36);
    }
})();
