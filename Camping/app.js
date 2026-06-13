(() => {
    "use strict";

    const STORAGE_KEY = "scoutCampPlanner.android.project.v1";
    const DRAFT_KEY = "scoutCampPlanner.android.draftName.v1";
    const FIREBASE_ROOT = "https://camp-planner-c6cb9-default-rtdb.europe-west1.firebasedatabase.app";
    const SESSION_ROOT = "sessions";
    const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const COLLAB_AAD = "ScoutCampPlanner.FirebaseCollaboration.v1";

    const TERMS = {
        languageEnglish: "en",
        languageSpanish: "es",
        languageFrench: "fr",
        personTypeYoungPerson: "Young person",
        personTypeYoungLeader: "Young leader",
        personTypeAdult: "Adult",
        personTypeDayVisitor: "Day Visitor",
        genderNotSet: "Not set",
        genderMale: "Male",
        genderFemale: "Female",
        genderOther: "Other",
        camperTypeStandard: "Standard",
        camperTypeBeaver: "Beaver",
        camperTypeCub: "Cub",
        camperTypeScout: "Scout",
        camperTypeExplorer: "Explorer",
        accommodationTent: "Tent",
        accommodationBunkRoom: "Bunk room",
        mealBreakfast: "Breakfast",
        mealDinner: "Dinner",
        mealTea: "Tea",
        mealExtra: "Extra",
        kitToCheck: "To check",
        kitReady: "Ready",
        kitPacked: "Packed",
        kitLoaded: "Loaded",
        kitOnSite: "On site",
        kitReturned: "Returned",
        kitNeedsCleaning: "Needs cleaning",
        kitNeedsDrying: "Needs drying",
        kitMissing: "Missing",
        kitDamaged: "Damaged",
        planBoundaryArrive: "Arrive",
        planBoundaryWakeUp: "Wake up",
        planBoundaryLightsOut: "Lights out",
        planBoundaryGoHome: "Go home"
    };

    const PERSON_TYPES = [TERMS.personTypeYoungPerson, TERMS.personTypeYoungLeader, TERMS.personTypeAdult];
    const PERSON_TYPE_LABELS = ["Camper", "Young Leader", "Adult"];
    const GENDERS = [TERMS.genderNotSet, TERMS.genderMale, TERMS.genderFemale, TERMS.genderOther];
    const CAMPER_TYPES = [TERMS.camperTypeStandard, TERMS.camperTypeBeaver, TERMS.camperTypeCub, TERMS.camperTypeScout, TERMS.camperTypeExplorer];
    const ACCOMMODATION_TYPES = [TERMS.accommodationTent, TERMS.accommodationBunkRoom];
    const MEAL_SLOTS = [TERMS.mealBreakfast, TERMS.mealDinner, TERMS.mealTea, TERMS.mealExtra];
    const KIT_STATUSES = [
        TERMS.kitToCheck,
        TERMS.kitReady,
        TERMS.kitPacked,
        TERMS.kitLoaded,
        TERMS.kitOnSite,
        TERMS.kitReturned,
        TERMS.kitNeedsCleaning,
        TERMS.kitNeedsDrying,
        TERMS.kitMissing,
        TERMS.kitDamaged
    ];
    const TENT_TYPES = ["Patrol tent", "Dome tent", "Hike tent", "Leader tent", "Bunk room", "Other tent"];
    const SITE_ITEM_TYPES = ["Mess tent", "Storage tent", "Kitchen tent", "Event shelter", "Flag pole", "Fire"];
    const PLAN_BOUNDARIES = [TERMS.planBoundaryArrive, TERMS.planBoundaryWakeUp, TERMS.planBoundaryLightsOut, TERMS.planBoundaryGoHome];

    const DEFAULT_MENU_LIBRARY = [
        "Porridge and fruit",
        "Bacon rolls",
        "Beans on toast",
        "Jacket potatoes",
        "Soup and rolls",
        "Pasta bolognese",
        "Chicken curry and rice",
        "Vegetable chilli",
        "Sausage casserole",
        "Campfire stew",
        "Fruit crumble",
        "Angel delight",
        "Yoghurt and fruit"
    ];

    const WEEKEND_KIT_DEFAULTS = [
        ["Gas stove", 2, false, true, "Check regulator and hose before camp."],
        ["Gas bottle", 2, true, true, "Confirm bottles are full enough."],
        ["Large cooking pan", 2, false, false, ""],
        ["Chopping board", 3, false, false, "Use separate board for dietary requirements where needed."],
        ["Sharp knife", 3, false, false, ""],
        ["Plates", 24, false, false, "Adjust to match people plus spares."],
        ["Bowls", 24, false, false, "Adjust to match people plus spares."],
        ["Cups", 24, false, false, "Adjust to match people plus spares."],
        ["Cutlery set", 24, false, false, "Adjust to match people plus spares."],
        ["Washing-up bowl", 2, false, false, ""],
        ["Washing-up liquid", 1, true, false, ""],
        ["Tea towel", 6, true, false, ""],
        ["Bin bags", 8, true, false, ""],
        ["Patrol tent", 4, false, true, "Check poles, pegs and bags."],
        ["Spare tent pegs", 1, false, true, ""],
        ["Tent repair tape", 1, true, false, ""],
        ["Event shelter", 1, false, true, ""],
        ["Folding table", 2, false, false, ""],
        ["Water carrier", 2, false, true, ""],
        ["Fire bucket", 2, false, true, ""],
        ["Lantern", 3, false, true, "Check batteries or charge."],
        ["Head torch", 4, false, true, ""],
        ["First aid kit", 1, false, true, "Check stock and expiry dates."],
        ["Medical forms", 1, false, true, ""],
        ["Printed menu", 1, true, false, ""],
        ["Chores rota", 1, true, false, ""],
        ["Kitchen box", 1, false, false, ""],
        ["Cleaning box", 1, false, false, ""]
    ];

    const GROUP_INVENTORY_DEFAULTS = [
        "Gas stove", "Gas bottle", "Chopping board", "Sharp knife", "Plates", "Bowls", "Cups",
        "Washing-up bowl", "Bin bags", "Patrol tent", "Spare tent pegs", "Event shelter",
        "Water carrier", "Fire bucket", "Lantern", "First aid kit", "Medical forms", "Kitchen box"
    ];

    const PARTICIPANT_DEFAULTS = [
        "Rucksack or holdall",
        "Sleeping bag",
        "Roll mat or sleeping mat",
        "Pillow",
        "Waterproof coat",
        "Warm fleece or jumper",
        "T-shirts",
        "Trousers or shorts",
        "Underwear",
        "Socks",
        "Sleepwear",
        "Wash kit",
        "Towel",
        "Water bottle",
        "Torch",
        "Plate, bowl, mug and cutlery",
        "Sun hat",
        "Warm hat and gloves",
        "Spare shoes or trainers",
        "Personal medication"
    ];

    const STANDARD_CHORES = [
        ["Cook breakfast", "Kitchen", "Prepare and serve breakfast."],
        ["Wash up breakfast", "Kitchen", "Wash up and tidy the kitchen area after breakfast."],
        ["Cook dinner", "Kitchen", "Prepare and serve the midday meal."],
        ["Wash up dinner", "Kitchen", "Wash up and tidy the kitchen area after dinner."],
        ["Cook tea", "Kitchen", "Prepare and serve the evening meal."],
        ["Wash up tea", "Kitchen", "Wash up and tidy the kitchen area after tea."],
        ["Water run", "Site", "Refill water carriers and hand-washing water."],
        ["Bins and recycling", "Site", "Empty bins and sort recycling."],
        ["Toilet check", "Site", "Check toilets and hand-washing supplies."],
        ["Site sweep", "Site", "Litter pick and check shared areas."]
    ];

    const SECTIONS = [
        ["overview", "Overview", "Camp details", "O"],
        ["personnel", "Personnel", "People & teams", "P"],
        ["tent-allocation", "Tent Allocation", "Sleeping plan", "T"],
        ["chores", "Chores", "Rota jobs", "C"],
        ["menu", "Menu", "Meals & diets", "M"],
        ["plan", "The Plan", "Daily timeline", "D"],
        ["group-kit", "Kit List (group)", "Stores kit", "G"],
        ["participant-kit", "Kit List (Participant)", "Personal kit", "K"],
        ["shopping-list", "Shopping List", "Buying lists", "S"],
        ["exports", "Exports", "Print & share", "E"]
    ].map(([id, title, subtitle, icon]) => ({ id, title, subtitle, icon }));

    const SECTION_TITLES = Object.fromEntries(SECTIONS.map(section => [section.id, section.title]));
    const TENT_CARD_WIDTH = 170;
    const TENT_CARD_HEIGHT = 145;
    const PERSON_CARD_WIDTH = 92;
    const PERSON_CARD_HEIGHT = 84;
    const SITE_ITEM_CARD_WIDTH = 92;
    const SITE_ITEM_CARD_HEIGHT = 90;
    const OCCUPANT_COLUMNS = 2;
    const OCCUPANT_GAP = 10;

    const State = {
        project: null,
        currentSection: "overview",
        menuTab: "planner",
        navCollapsed: false,
        dirty: false,
        fileName: "camp.scoutcamp",
        undo: [],
        redo: [],
        filters: {},
        sort: { people: "group", groupKit: "name", participantKit: "name" },
        selected: {},
        dragging: null,
        collab: {
            active: false,
            code: "",
            key: null,
            clientId: uid().replaceAll("-", ""),
            revision: 0,
            timer: null,
            uploadTimer: null,
            applyingRemote: false
        },
        pendingFiles: new Map()
    };

    function $(selector, root = document) {
        return root.querySelector(selector);
    }

    function $all(selector, root = document) {
        return [...root.querySelectorAll(selector)];
    }

    function h(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll("\"", "&quot;")
            .replaceAll("'", "&#039;");
    }

    function attr(value) {
        return h(value).replaceAll("`", "&#096;");
    }

    function uid() {
        if (crypto.randomUUID) {
            return crypto.randomUUID();
        }
        const bytes = new Uint8Array(16);
        crypto.getRandomValues(bytes);
        return [...bytes].map(value => value.toString(16).padStart(2, "0")).join("");
    }

    function todayIso() {
        return isoDate(new Date());
    }

    function isoDate(value) {
        const date = value instanceof Date ? value : parseDate(value);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    function parseDate(value) {
        if (value instanceof Date && !Number.isNaN(value.valueOf())) {
            return new Date(value.getFullYear(), value.getMonth(), value.getDate());
        }
        if (typeof value === "string") {
            const clean = value.slice(0, 10);
            const parts = clean.split("-").map(Number);
            if (parts.length === 3 && parts.every(Number.isFinite)) {
                return new Date(parts[0], parts[1] - 1, parts[2]);
            }
            const parsed = new Date(value);
            if (!Number.isNaN(parsed.valueOf())) {
                return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
            }
        }
        return new Date();
    }

    function displayDate(value, long = false) {
        return parseDate(value).toLocaleDateString("en-GB", {
            weekday: long ? "long" : "short",
            day: "numeric",
            month: "short",
            year: long ? "numeric" : undefined
        });
    }

    function dateRange(project = State.project) {
        if (project.startDate === project.endDate) {
            return displayDate(project.startDate, true);
        }
        return `${displayDate(project.startDate, true)} to ${displayDate(project.endDate, true)}`;
    }

    function enumerateDates(start, end) {
        const dates = [];
        for (let date = parseDate(start), limit = parseDate(end); date <= limit; date.setDate(date.getDate() + 1)) {
            dates.push(isoDate(date));
        }
        return dates;
    }

    function clean(value, fallback = "") {
        const result = String(value ?? "").trim();
        return result.length ? result : fallback;
    }

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    function number(value, fallback = 0) {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : fallback;
    }

    function list(value) {
        return Array.isArray(value) ? value : [];
    }

    function distinct(values, key = value => String(value).toLowerCase()) {
        const seen = new Set();
        return values.filter(value => {
            const itemKey = key(value);
            if (seen.has(itemKey)) {
                return false;
            }
            seen.add(itemKey);
            return true;
        });
    }

    function includesText(filter, ...values) {
        const needle = clean(filter).toLowerCase();
        if (!needle) {
            return true;
        }
        return values.some(value => String(value ?? "").toLowerCase().includes(needle));
    }

    function textToBytes(text) {
        return new TextEncoder().encode(text);
    }

    function bytesToText(bytes) {
        return new TextDecoder("utf-8").decode(bytes);
    }

    function bytesToBase64(bytes) {
        let binary = "";
        const chunk = 0x8000;
        for (let index = 0; index < bytes.length; index += chunk) {
            binary += String.fromCharCode(...bytes.subarray(index, index + chunk));
        }
        return btoa(binary);
    }

    function base64ToBytes(base64) {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let index = 0; index < binary.length; index++) {
            bytes[index] = binary.charCodeAt(index);
        }
        return bytes;
    }

    function textToBase64(text) {
        return bytesToBase64(textToBytes(text));
    }

    function base64ToText(base64) {
        return bytesToText(base64ToBytes(base64));
    }

    function createProject() {
        const start = todayIso();
        const endDate = parseDate(start);
        endDate.setDate(endDate.getDate() + 2);
        return {
            schemaVersion: 1,
            id: uid(),
            campName: "New Scout camp",
            location: "",
            startDate: start,
            endDate: isoDate(endDate),
            participantCountOverride: 0,
            notes: "",
            languageCode: TERMS.languageEnglish,
            createdDate: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            people: [],
            tents: [],
            siteItems: [],
            friendLinks: [],
            foeLinks: [],
            menuSlots: [...MEAL_SLOTS],
            menuStartSlot: TERMS.mealBreakfast,
            menuEndSlot: TERMS.mealTea,
            menuDayNotes: [],
            menuLibraryItems: [],
            menuLibrarySeeded: false,
            menuItems: [],
            kitItems: [],
            groupKitInventory: [],
            groupKitInventorySeeded: false,
            participantKitInventory: [],
            participantKitInventorySeeded: false,
            choreItems: [],
            choreTeams: [],
            choreSessions: ["Morning", "Afternoon", "Evening"],
            choreAllocations: [],
            planItems: [],
            shoppingLists: []
        };
    }

    function normalizeProject(project) {
        project.schemaVersion = Math.max(1, number(project.schemaVersion, 1));
        project.id = clean(project.id, uid());
        project.campName = clean(project.campName, "New Scout camp");
        project.location = clean(project.location);
        project.notes = clean(project.notes);
        project.languageCode = [TERMS.languageEnglish, TERMS.languageSpanish, TERMS.languageFrench].includes(project.languageCode)
            ? project.languageCode
            : TERMS.languageEnglish;
        project.startDate = isoDate(project.startDate);
        project.endDate = isoDate(project.endDate);
        if (parseDate(project.endDate) < parseDate(project.startDate)) {
            project.endDate = project.startDate;
        }
        project.participantCountOverride = Math.max(0, number(project.participantCountOverride, 0));
        project.createdDate = project.createdDate || new Date().toISOString();
        project.lastModified = project.lastModified || new Date().toISOString();

        project.people = list(project.people);
        project.tents = list(project.tents);
        project.siteItems = list(project.siteItems);
        project.friendLinks = list(project.friendLinks);
        project.foeLinks = list(project.foeLinks);
        project.menuSlots = list(project.menuSlots);
        project.menuDayNotes = list(project.menuDayNotes);
        project.menuLibraryItems = list(project.menuLibraryItems);
        project.menuItems = list(project.menuItems);
        project.kitItems = list(project.kitItems);
        project.groupKitInventory = list(project.groupKitInventory);
        project.participantKitInventory = list(project.participantKitInventory);
        project.choreItems = list(project.choreItems);
        project.choreTeams = list(project.choreTeams);
        project.choreSessions = list(project.choreSessions);
        project.choreAllocations = list(project.choreAllocations);
        project.planItems = list(project.planItems);
        project.shoppingLists = list(project.shoppingLists);

        normalizePeople(project);
        normalizeTents(project);
        normalizeSiteItems(project);
        normalizeLinks(project.friendLinks, project);
        normalizeLinks(project.foeLinks, project);
        normalizeMenu(project);
        normalizeKit(project);
        normalizeChores(project);
        normalizePlan(project);
        normalizeShopping(project);
        seedInventories(project);
        ensurePlanDefaults(project);
        return project;
    }

    function normalizePeople(project) {
        const ids = new Set();
        project.people.forEach(person => {
            person.id = uniqueId(person.id, ids);
            person.name = clean(person.name, "Unnamed person");
            let type = mapPersonType(person.personType);
            if (type === TERMS.personTypeDayVisitor) {
                person.isDayVisitor = true;
                type = TERMS.personTypeYoungPerson;
            }
            person.personType = PERSON_TYPES.includes(type) ? type : TERMS.personTypeYoungPerson;
            person.gender = GENDERS.includes(person.gender) && person.gender !== TERMS.genderNotSet ? person.gender : mapGender(person.gender);
            person.camperType = CAMPER_TYPES.includes(person.camperType) ? person.camperType : mapCamperType(person.camperType);
            person.isDayVisitor = Boolean(person.isDayVisitor);
            person.patrol = clean(person.patrol);
            person.dietaryNotes = clean(person.dietaryNotes);
            person.medicalNotes = clean(person.medicalNotes);
            person.notes = clean(person.notes);
            person.x = number(person.x, 0);
            person.y = number(person.y, 0);
        });
    }

    function normalizeTents(project) {
        const ids = new Set();
        project.tents.forEach((tent, index) => {
            tent.id = uniqueId(tent.id, ids);
            tent.name = clean(tent.name, "Tent");
            tent.type = TENT_TYPES.includes(tent.type) ? tent.type : mapTentType(tent.type, tent.accommodationType);
            tent.accommodationType = ACCOMMODATION_TYPES.includes(tent.accommodationType)
                ? tent.accommodationType
                : tent.type.toLowerCase().includes("bunk") ? TERMS.accommodationBunkRoom : TERMS.accommodationTent;
            tent.capacity = clamp(Math.round(number(tent.capacity, 4)), 1, 24);
            tent.colour = isHexColour(tent.colour) ? tent.colour : "#4CAF50";
            tent.notes = clean(tent.notes);
            tent.x = number(tent.x, 40 + index * 170);
            tent.y = number(tent.y, 50 + Math.floor(index / 3) * 150);
            tent.sizeScale = clamp(number(tent.sizeScale, 1), 0.7, 1.8);
        });
        const tentIds = new Set(project.tents.map(tent => tent.id));
        project.people.forEach(person => {
            if (person.tentId && !tentIds.has(person.tentId)) {
                person.tentId = null;
            }
        });
    }

    function normalizeSiteItems(project) {
        const ids = new Set();
        project.siteItems.forEach((item, index) => {
            item.id = uniqueId(item.id, ids);
            item.name = clean(item.name, "Site item");
            item.type = SITE_ITEM_TYPES.includes(item.type) ? item.type : mapSiteItemType(item.type);
            item.colour = isHexColour(item.colour) ? item.colour : siteItemColour(item.type);
            item.notes = clean(item.notes);
            item.x = number(item.x, 80 + index * 150);
            item.y = number(item.y, 310);
            item.sizeScale = clamp(number(item.sizeScale, 1), 0.7, 1.8);
        });
    }

    function normalizeLinks(links, project) {
        const personIds = new Set(project.people.map(person => person.id));
        const seen = new Set();
        for (let index = links.length - 1; index >= 0; index--) {
            const link = links[index];
            link.id = clean(link.id, uid());
            link.personAId = clean(link.personAId);
            link.personBId = clean(link.personBId);
            link.notes = clean(link.notes);
            const key = [link.personAId, link.personBId].sort().join("|");
            if (!link.personAId || !link.personBId || link.personAId === link.personBId || !personIds.has(link.personAId) || !personIds.has(link.personBId) || seen.has(key)) {
                links.splice(index, 1);
            } else {
                seen.add(key);
            }
        }
    }

    function normalizeMenu(project) {
        const slots = distinct(project.menuSlots.map(slot => clean(slot)).filter(Boolean), value => value.toLowerCase());
        project.menuSlots = slots.length ? slots : [...MEAL_SLOTS];
        project.menuStartSlot = project.menuSlots.find(slot => slot.toLowerCase() === clean(project.menuStartSlot).toLowerCase()) ?? project.menuSlots[0];
        project.menuEndSlot = project.menuSlots.find(slot => slot.toLowerCase() === clean(project.menuEndSlot).toLowerCase()) ?? project.menuSlots[Math.min(2, project.menuSlots.length - 1)];
        if (project.startDate === project.endDate && mealSlotIndex(project, project.menuEndSlot) < mealSlotIndex(project, project.menuStartSlot)) {
            project.menuEndSlot = project.menuStartSlot;
        }
        if (!project.menuLibrarySeeded) {
            project.menuLibraryItems = distinct([...project.menuLibraryItems, ...DEFAULT_MENU_LIBRARY].filter(Boolean), value => value.toLowerCase()).sort(localeSort);
            project.menuLibrarySeeded = true;
        }
        project.menuItems.forEach(item => {
            item.id = clean(item.id, uid());
            item.date = clampDate(item.date, project);
            item.slot = normalizeMealSlot(project, item.slot);
            item.meal = clean(item.meal);
            item.pudding = clean(item.pudding);
            item.dietaryNotes = clean(item.dietaryNotes);
            item.notes = clean(item.notes);
        });
        const seenNotes = new Set();
        project.menuDayNotes = project.menuDayNotes.filter(note => {
            note.id = clean(note.id, uid());
            note.date = clampDate(note.date, project);
            note.notes = clean(note.notes);
            if (!note.notes || seenNotes.has(note.date)) {
                return false;
            }
            seenNotes.add(note.date);
            return true;
        });
    }

    function normalizeKit(project) {
        const normalizeItem = (item, participant = false) => {
            item.id = clean(item.id, uid());
            item.name = clean(item.name, "Kit item");
            item.category = clean(item.category);
            item.quantity = Math.max(0, number(item.quantity, 1));
            item.status = KIT_STATUSES.includes(item.status) ? item.status : normalizeKitStatus(item.status);
            item.owner = clean(item.owner, participant ? "Participant" : item.owner || "Group stores");
            item.isConsumable = Boolean(item.isConsumable);
            item.needsAction = Boolean(item.needsAction);
            item.notes = clean(item.notes);
        };
        project.kitItems.forEach(item => normalizeItem(item, isParticipantKitItem(item)));
        project.groupKitInventory.forEach(item => normalizeItem(item, false));
        project.participantKitInventory.forEach(item => normalizeItem(item, true));
    }

    function normalizeChores(project) {
        project.choreSessions = distinct(project.choreSessions.map(session => clean(session)).filter(Boolean), value => value.toLowerCase());
        if (!project.choreSessions.length) {
            project.choreSessions = ["Morning", "Afternoon", "Evening"];
        }
        const personIds = new Set(project.people.map(person => person.id));
        const tentIds = new Set(project.tents.map(tent => tent.id));
        const teamIds = new Set();
        project.choreTeams.forEach(team => {
            team.id = clean(team.id, uid());
            team.name = clean(team.name, "Team");
            team.teamType = clean(team.teamType, "Custom");
            team.colour = isHexColour(team.colour) ? team.colour : "#4CAF50";
            team.personIds = distinct(list(team.personIds).filter(id => personIds.has(id)));
            team.notes = clean(team.notes);
            teamIds.add(team.id);
        });
        const choreIds = new Set();
        project.choreItems.forEach(item => {
            item.id = uniqueId(item.id, choreIds);
            item.name = clean(item.name, "Chore");
            item.category = clean(item.category, "Chore");
            item.description = clean(item.description);
        });
        project.choreAllocations.forEach(allocation => {
            allocation.id = clean(allocation.id, uid());
            allocation.date = clampDate(allocation.date, project);
            allocation.session = project.choreSessions.includes(allocation.session) ? allocation.session : project.choreSessions[0];
            allocation.choreItemId = choreIds.has(allocation.choreItemId) ? allocation.choreItemId : "";
            allocation.personIds = distinct(list(allocation.personIds).filter(id => personIds.has(id)));
            allocation.teamIds = distinct(list(allocation.teamIds).filter(id => teamIds.has(id)));
            allocation.tentIds = distinct(list(allocation.tentIds).filter(id => tentIds.has(id)));
            allocation.personId = allocation.personIds[0] || (personIds.has(allocation.personId) ? allocation.personId : "");
            allocation.notes = clean(allocation.notes);
        });
    }

    function normalizePlan(project) {
        const personIds = new Set(project.people.map(person => person.id));
        const tentIds = new Set(project.tents.map(tent => tent.id));
        const teamIds = new Set(project.choreTeams.map(team => team.id));
        project.planItems.forEach(item => {
            item.id = clean(item.id, uid());
            item.date = clampDate(item.date, project);
            item.title = clean(item.title, "Activity");
            item.startMinute = clamp(Math.round(number(item.startMinute, 9 * 60)), 0, 24 * 60 - 1);
            item.endMinute = clamp(Math.round(number(item.endMinute, item.startMinute + 60)), item.startMinute + 1, 24 * 60);
            item.isConcurrent = Boolean(item.isConcurrent);
            item.isAllCamp = item.isAllCamp !== false;
            item.audienceLabel = clean(item.audienceLabel);
            item.teamIds = distinct(list(item.teamIds).filter(id => teamIds.has(id)));
            item.tentIds = distinct(list(item.tentIds).filter(id => tentIds.has(id)));
            item.personIds = distinct(list(item.personIds).filter(id => personIds.has(id)));
            item.boundaryKind = PLAN_BOUNDARIES.includes(item.boundaryKind) ? item.boundaryKind : "";
            item.notes = clean(item.notes);
        });
    }

    function normalizeShopping(project) {
        project.shoppingLists.forEach(listItem => {
            listItem.id = clean(listItem.id, uid());
            listItem.name = clean(listItem.name, "Shopping list");
            listItem.items = list(listItem.items);
            listItem.items.forEach(item => {
                item.id = clean(item.id, uid());
                item.name = clean(item.name);
                item.quantity = Math.max(0, number(item.quantity, 1));
            });
        });
    }

    function seedInventories(project) {
        if (!project.groupKitInventorySeeded) {
            const existing = new Set(project.groupKitInventory.map(item => item.name.toLowerCase()));
            GROUP_INVENTORY_DEFAULTS.forEach(name => {
                if (!existing.has(name.toLowerCase())) {
                    const source = WEEKEND_KIT_DEFAULTS.find(item => item[0] === name);
                    project.groupKitInventory.push(kitItem({
                        name,
                        category: "Group stores",
                        quantity: source ? source[1] : 1,
                        status: TERMS.kitToCheck,
                        owner: "Group stores",
                        isConsumable: source ? source[2] : false,
                        needsAction: source ? source[3] : false,
                        notes: source ? source[4] : ""
                    }));
                }
            });
            project.groupKitInventorySeeded = true;
        }
        if (!project.participantKitInventorySeeded) {
            const existing = new Set(project.participantKitInventory.map(item => item.name.toLowerCase()));
            PARTICIPANT_DEFAULTS.forEach(name => {
                if (!existing.has(name.toLowerCase())) {
                    project.participantKitInventory.push(kitItem({ name, owner: "Participant", status: TERMS.kitReady }));
                }
            });
            project.participantKitInventorySeeded = true;
        }
    }

    function ensurePlanDefaults(project) {
        enumerateDates(project.startDate, project.endDate).forEach((date, index, dates) => {
            ensurePlanBoundary(project, date, TERMS.planBoundaryArrive, index === 0 ? 18 * 60 : 9 * 60, index === 0 ? 18 * 60 + 15 : 9 * 60 + 15);
            ensurePlanBoundary(project, date, TERMS.planBoundaryWakeUp, 7 * 60, 7 * 60 + 15);
            ensurePlanBoundary(project, date, TERMS.planBoundaryLightsOut, 22 * 60, 22 * 60 + 15);
            ensurePlanBoundary(project, date, TERMS.planBoundaryGoHome, index === dates.length - 1 ? 15 * 60 : 20 * 60, index === dates.length - 1 ? 15 * 60 + 15 : 20 * 60 + 15);
        });
    }

    function ensurePlanBoundary(project, date, boundaryKind, startMinute, endMinute) {
        const existing = project.planItems.find(item => item.date === date && item.boundaryKind === boundaryKind);
        if (!existing) {
            project.planItems.push(planItem({
                date,
                title: boundaryKind,
                startMinute,
                endMinute,
                isAllCamp: true,
                boundaryKind
            }));
        }
    }

    function person(data = {}) {
        return {
            id: data.id || uid(),
            name: clean(data.name),
            personType: data.personType || TERMS.personTypeYoungPerson,
            gender: data.gender || TERMS.genderOther,
            camperType: data.camperType || TERMS.camperTypeStandard,
            isDayVisitor: Boolean(data.isDayVisitor),
            patrol: clean(data.patrol),
            dietaryNotes: clean(data.dietaryNotes),
            medicalNotes: clean(data.medicalNotes),
            tentId: data.tentId || null,
            notes: clean(data.notes),
            x: number(data.x, 0),
            y: number(data.y, 0)
        };
    }

    function tent(data = {}) {
        return {
            id: data.id || uid(),
            name: clean(data.name, "Tent"),
            type: data.type || "Patrol tent",
            accommodationType: data.accommodationType || TERMS.accommodationTent,
            capacity: number(data.capacity, 4),
            colour: data.colour || "#4CAF50",
            notes: clean(data.notes),
            x: number(data.x, 40),
            y: number(data.y, 50),
            sizeScale: number(data.sizeScale, 1)
        };
    }

    function siteItem(data = {}) {
        return {
            id: data.id || uid(),
            name: clean(data.name, "Site item"),
            type: data.type || "Mess tent",
            colour: data.colour || siteItemColour(data.type || "Mess tent"),
            notes: clean(data.notes),
            x: number(data.x, 80),
            y: number(data.y, 300),
            sizeScale: number(data.sizeScale, 1)
        };
    }

    function kitItem(data = {}) {
        return {
            id: data.id || uid(),
            name: clean(data.name, "Kit item"),
            category: clean(data.category),
            quantity: Math.max(0, number(data.quantity, 1)),
            status: data.status || TERMS.kitToCheck,
            owner: data.owner || "Group stores",
            isConsumable: Boolean(data.isConsumable),
            needsAction: Boolean(data.needsAction),
            notes: clean(data.notes)
        };
    }

    function choreItem(data = {}) {
        return {
            id: data.id || uid(),
            name: clean(data.name, "Chore"),
            category: clean(data.category, "Chore"),
            description: clean(data.description)
        };
    }

    function choreTeam(data = {}) {
        return {
            id: data.id || uid(),
            name: clean(data.name, "Team"),
            teamType: clean(data.teamType, "Custom"),
            colour: data.colour || "#4CAF50",
            personIds: list(data.personIds),
            notes: clean(data.notes)
        };
    }

    function choreAllocation(data = {}) {
        return {
            id: data.id || uid(),
            date: data.date || State.project.startDate,
            session: data.session || State.project.choreSessions[0],
            choreItemId: data.choreItemId || "",
            personId: data.personId || "",
            personIds: list(data.personIds),
            teamIds: list(data.teamIds),
            tentIds: list(data.tentIds),
            notes: clean(data.notes)
        };
    }

    function mealItem(data = {}) {
        return {
            id: data.id || uid(),
            date: data.date || State.project.startDate,
            slot: data.slot || TERMS.mealBreakfast,
            meal: clean(data.meal),
            pudding: clean(data.pudding),
            dietaryNotes: clean(data.dietaryNotes),
            notes: clean(data.notes)
        };
    }

    function planItem(data = {}) {
        return {
            id: data.id || uid(),
            date: data.date || State.project.startDate,
            title: clean(data.title, "Activity"),
            startMinute: number(data.startMinute, 9 * 60),
            endMinute: number(data.endMinute, 10 * 60),
            isConcurrent: Boolean(data.isConcurrent),
            isAllCamp: data.isAllCamp !== false,
            audienceLabel: clean(data.audienceLabel),
            teamIds: list(data.teamIds),
            tentIds: list(data.tentIds),
            personIds: list(data.personIds),
            boundaryKind: data.boundaryKind || "",
            notes: clean(data.notes)
        };
    }

    function shoppingList(data = {}) {
        return {
            id: data.id || uid(),
            name: clean(data.name, "Shopping list"),
            items: list(data.items)
        };
    }

    function uniqueId(id, ids) {
        let candidate = clean(id, uid());
        while (ids.has(candidate)) {
            candidate = uid();
        }
        ids.add(candidate);
        return candidate;
    }

    function clampDate(value, project) {
        const date = isoDate(value || project.startDate);
        if (parseDate(date) < parseDate(project.startDate) || parseDate(date) > parseDate(project.endDate)) {
            return project.startDate;
        }
        return date;
    }

    function mapPersonType(value) {
        const text = clean(value).toLowerCase();
        if (text === "camper" || text === "young person" || text === "") return TERMS.personTypeYoungPerson;
        if (text.includes("young") && text.includes("leader")) return TERMS.personTypeYoungLeader;
        if (text.includes("visitor")) return TERMS.personTypeDayVisitor;
        if (text.includes("adult") || text.includes("leader")) return TERMS.personTypeAdult;
        return TERMS.personTypeYoungPerson;
    }

    function mapGender(value) {
        const text = clean(value).toLowerCase();
        if (text.includes("female") || text === "1") return TERMS.genderFemale;
        if (text.includes("male") || text === "0") return TERMS.genderMale;
        if (text.includes("not")) return TERMS.genderNotSet;
        return TERMS.genderOther;
    }

    function mapCamperType(value) {
        const text = clean(value).toLowerCase();
        if (text.includes("beaver") || text === "1") return TERMS.camperTypeBeaver;
        if (text.includes("cub") || text === "2") return TERMS.camperTypeCub;
        if (text.includes("scout") || text === "3") return TERMS.camperTypeScout;
        if (text.includes("explorer") || text === "4") return TERMS.camperTypeExplorer;
        return TERMS.camperTypeStandard;
    }

    function mapTentType(tentType, accommodationType) {
        const accommodation = clean(accommodationType).toLowerCase();
        const type = clean(tentType).toLowerCase();
        if (accommodation.includes("bunk") || type.includes("bunk")) return "Bunk room";
        if (type.includes("dome") || type.includes("blue")) return "Dome tent";
        if (type.includes("hike") || type.includes("orange")) return "Hike tent";
        if (type.includes("leader") || type.includes("purple")) return "Leader tent";
        if (type.includes("other") || type.includes("grey")) return "Other tent";
        return "Patrol tent";
    }

    function mapSiteItemType(value) {
        const text = clean(value).toLowerCase();
        if (text.includes("storage")) return "Storage tent";
        if (text.includes("flag")) return "Flag pole";
        if (text.includes("fire")) return "Fire";
        if (text.includes("kitchen")) return "Kitchen tent";
        if (text.includes("shelter")) return "Event shelter";
        return "Mess tent";
    }

    function siteItemColour(type) {
        return {
            "Storage tent": "#66BB6A",
            "Flag pole": "#757575",
            "Fire": "#FF5722",
            "Kitchen tent": "#FFD54F",
            "Event shelter": "#90CAF9",
            "Mess tent": "#FFFFFF"
        }[type] || "#FFFFFF";
    }

    function normalizeKitStatus(value) {
        const text = clean(value).toLowerCase();
        return KIT_STATUSES.find(status => status.toLowerCase() === text) || TERMS.kitToCheck;
    }

    function isHexColour(value) {
        return /^#[0-9a-f]{6}$/i.test(clean(value));
    }

    function darkenColour(value, factor) {
        const hex = isHexColour(value) ? value : "#4CAF50";
        const parts = [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16));
        const darkened = parts.map(part => Math.max(0, Math.round(part - part * factor)));
        return `#${darkened.map(part => part.toString(16).padStart(2, "0")).join("")}`;
    }

    function localeSort(a, b) {
        return String(a).localeCompare(String(b), undefined, { sensitivity: "base" });
    }

    function snapshot() {
        return JSON.stringify(State.project);
    }

    function restoreSnapshot(value) {
        State.project = normalizeProject(JSON.parse(value));
        saveDraft();
        render();
    }

    function mutate(label, operation, options = {}) {
        if (!options.skipUndo) {
            State.undo.push(snapshot());
            if (State.undo.length > 80) {
                State.undo.shift();
            }
            State.redo = [];
        }
        operation();
        normalizeProject(State.project);
        State.project.lastModified = new Date().toISOString();
        markDirty(label || "Updated.");
        render();
    }

    function markDirty(message) {
        if (!State.collab.applyingRemote) {
            State.dirty = true;
        }
        saveDraft();
        setStatus(message || "Updated.");
        scheduleCollaborationUpload();
    }

    function saveDraft() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(State.project));
        localStorage.setItem(DRAFT_KEY, State.fileName || "camp.scoutcamp");
    }

    function setStatus(message) {
        const text = clean(message, "Ready.");
        $("#statusText").textContent = text;
        $("#dirtyBadge").textContent = State.dirty ? "Unsaved changes" : text;
    }

    function participantCount(project = State.project) {
        return project.people.length || project.participantCountOverride || 0;
    }

    function isParticipantKitItem(item) {
        const owner = clean(item.owner).toLowerCase();
        return owner.includes("participant") || owner.includes("personal") || owner.includes("camper") || owner.includes("young person");
    }

    function activeMenuItems(project = State.project) {
        return project.menuItems.filter(item => hasMenuContent(item) && isMenuSlotActive(project, item.date, item.slot)).length;
    }

    function hasMenuContent(item) {
        return Boolean(clean(item.meal) || clean(item.pudding) || clean(item.dietaryNotes) || clean(item.notes));
    }

    function mealSlotIndex(project, slot) {
        return project.menuSlots.findIndex(item => item.toLowerCase() === clean(slot).toLowerCase());
    }

    function normalizeMealSlot(project, slot) {
        const found = project.menuSlots.find(item => item.toLowerCase() === clean(slot).toLowerCase());
        if (found) return found;
        const mapped = mapMealSlot(slot);
        return project.menuSlots.find(item => item.toLowerCase() === mapped.toLowerCase()) || project.menuSlots[0];
    }

    function mapMealSlot(value) {
        const text = clean(value).toLowerCase();
        if (text.includes("breakfast") || text === "0") return TERMS.mealBreakfast;
        if (text.includes("dinner") || text.includes("lunch") || text === "1") return TERMS.mealDinner;
        if (text.includes("tea") || text.includes("supper") || text === "2") return TERMS.mealTea;
        return clean(value, TERMS.mealExtra);
    }

    function activeMealSlots(project, date) {
        if (parseDate(date) < parseDate(project.startDate) || parseDate(date) > parseDate(project.endDate)) {
            return [];
        }
        let start = mealSlotIndex(project, project.menuStartSlot);
        let end = mealSlotIndex(project, project.menuEndSlot);
        if (start < 0) start = 0;
        if (end < 0) end = Math.min(2, project.menuSlots.length - 1);
        if (project.startDate === project.endDate && start > end) end = start;
        return project.menuSlots.filter((slot, index) =>
            (date !== project.startDate || index >= start) && (date !== project.endDate || index <= end));
    }

    function isMenuSlotActive(project, date, slot) {
        return activeMealSlots(project, isoDate(date)).some(active => active.toLowerCase() === clean(slot).toLowerCase());
    }

    function personName(id) {
        return State.project.people.find(person => person.id === id)?.name || "";
    }

    function teamName(id) {
        return State.project.choreTeams.find(team => team.id === id)?.name || "";
    }

    function tentName(id) {
        return State.project.tents.find(tent => tent.id === id)?.name || "";
    }

    function choreName(id) {
        return State.project.choreItems.find(item => item.id === id)?.name || "";
    }

    function personTypeDisplay(personOrType) {
        const type = typeof personOrType === "string" ? personOrType : personOrType.personType;
        if (type === TERMS.personTypeYoungPerson) return "Camper";
        if (type === TERMS.personTypeYoungLeader) return "Young Leader";
        return type || "Camper";
    }

    function personTypeFromDisplay(value) {
        const text = clean(value).toLowerCase();
        if (text === "camper") return TERMS.personTypeYoungPerson;
        if (text.includes("young")) return TERMS.personTypeYoungLeader;
        if (text.includes("adult")) return TERMS.personTypeAdult;
        return TERMS.personTypeYoungPerson;
    }

    function personRoleText(person) {
        const parts = [personTypeDisplay(person)];
        if (person.personType === TERMS.personTypeYoungPerson) parts.push(person.camperType);
        if (person.isDayVisitor) parts.push("Day visitor");
        return parts.filter(Boolean).join(" | ");
    }

    function peopleForTeam(teamId) {
        const team = State.project.choreTeams.find(item => item.id === teamId);
        if (!team) return [];
        const ids = new Set(team.personIds);
        return orderedPeople().filter(person => ids.has(person.id));
    }

    function teamsForPerson(personId) {
        return State.project.choreTeams.filter(team => team.personIds.includes(personId));
    }

    function orderedPeople() {
        const group = person => {
            if (person.personType === TERMS.personTypeYoungPerson) {
                return ["Beaver", "Cub", "Scout", "Explorer", "Standard"].indexOf(person.camperType) + 1 || 5;
            }
            if (person.personType === TERMS.personTypeYoungLeader) return 20;
            return 30;
        };
        return [...State.project.people].sort((a, b) => group(a) - group(b) || localeSort(a.name, b.name));
    }

    function planTime(minute) {
        minute = clamp(Math.round(number(minute)), 0, 24 * 60);
        if (minute === 24 * 60) return "24:00";
        return `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
    }

    function parsePlanTime(value) {
        const match = /^(\d{1,2}):(\d{2})$/.exec(clean(value));
        if (!match) return null;
        const hour = Number(match[1]);
        const minute = Number(match[2]);
        if (hour < 0 || hour > 24 || minute < 0 || minute > 59 || (hour === 24 && minute !== 0)) return null;
        return hour * 60 + minute;
    }

    function timeOptions(includeEndOfDay = true) {
        const values = [];
        for (let minute = 0; minute <= 24 * 60; minute += 15) {
            if (minute === 24 * 60 && !includeEndOfDay) continue;
            values.push(planTime(minute));
        }
        return values;
    }

    function init() {
        const stored = localStorage.getItem(STORAGE_KEY);
        State.project = stored ? normalizeProject(JSON.parse(stored)) : normalizeProject(createProject());
        State.fileName = localStorage.getItem(DRAFT_KEY) || `${safeFileName(State.project.campName)}.scoutcamp`;
        bindGlobalEvents();
        render();
        setStatus("Ready.");
    }

    function bindGlobalEvents() {
        $("#navToggle").addEventListener("click", () => {
            const nav = $("#sideNav");
            if (matchMedia("(max-width: 960px)").matches) {
                nav.classList.toggle("open");
            } else {
                State.navCollapsed = !State.navCollapsed;
                renderNav();
            }
        });

        document.addEventListener("click", event => {
            const menuButton = event.target.closest("[data-menu]");
            if (menuButton) {
                showMenu(menuButton.dataset.menu);
                return;
            }
            const action = event.target.closest("[data-action]");
            if (action) {
                event.preventDefault();
                runAction(action.dataset.action, action.dataset, action).catch(showError);
            }
        });

        document.addEventListener("change", event => {
            const target = event.target;
            if (target.matches("[data-project-field]")) {
                updateProjectField(target.dataset.projectField, target.type === "checkbox" ? target.checked : target.value);
            } else if (target.matches("[data-filter]")) {
                State.filters[target.dataset.filter] = target.value;
                renderMain();
            } else if (target.matches("[data-update-kind]")) {
                updateInline(target);
            }
        });

        document.addEventListener("input", event => {
            const target = event.target;
            if (target.matches("[data-filter-live]")) {
                State.filters[target.dataset.filterLive] = target.value;
                renderMain();
            }
        });

        window.CampAndroidBridge = {
            onFile: (callbackId, name, mime, base64, error) => {
                const pending = State.pendingFiles.get(callbackId);
                if (!pending) return;
                State.pendingFiles.delete(callbackId);
                if (error) {
                    pending.reject(new Error(error));
                } else {
                    pending.resolve({ name, mime, bytes: base64ToBytes(base64), text: base64ToText(base64) });
                }
            },
            onSave: (fileName, location, error) => {
                if (error) {
                    showError(new Error(error));
                    return;
                }
                setStatus(`Saved ${fileName} to ${location}.`);
                toast(`Saved ${fileName}`);
            },
            onPrint: (title, error) => {
                if (error) {
                    showError(new Error(error));
                    return;
                }
                setStatus(`${title} opened in Android print.`);
            }
        };

        window.handleAndroidBack = () => {
            const modal = $("#modalHost");
            if (!modal.classList.contains("hidden")) {
                closeModal();
                return true;
            }
            const nav = $("#sideNav");
            if (nav.classList.contains("open")) {
                nav.classList.remove("open");
                return true;
            }
            return false;
        };
    }

    document.addEventListener("DOMContentLoaded", init);

    window.CampPlanner = {
        createProject,
        normalizeProject,
        buildTentWarnings,
        buildMenuWarnings,
        serializeProject: () => JSON.stringify(State.project),
        exportCsvFiles,
        parseCsv
    };

    function render() {
        renderNav();
        renderShell();
        renderMain();
    }

    function renderNav() {
        const nav = $("#sideNav");
        nav.classList.toggle("collapsed", State.navCollapsed);
        nav.innerHTML = SECTIONS.map(section => `
            <button class="nav-item ${section.id === State.currentSection ? "active" : ""}" data-action="switchSection" data-section="${section.id}" type="button">
                <span class="nav-icon">${h(section.icon)}</span>
                <span class="nav-copy">
                    <span class="nav-title">${h(section.title)}</span>
                    <span class="nav-subtitle">${h(section.subtitle)}</span>
                </span>
            </button>
        `).join("");
    }

    function renderShell() {
        const project = State.project;
        $("#summaryPill").textContent = `${project.campName} | ${dateRange(project)} | ${project.location || "No location set"} | ${project.people.length} people | ${project.tents.length} tents | ${activeMenuItems(project)} meals | ${groupKit().length} group kit | ${participantKit().length} participant kit`;
        $("#sectionMenuButton").textContent = SECTION_TITLES[State.currentSection] || "Section";
        $("#dirtyBadge").textContent = State.dirty ? "Unsaved changes" : "Ready";
        const badge = $("#collabBadge");
        badge.classList.toggle("hidden", !State.collab.active);
        badge.textContent = State.collab.active ? `Collaborating: ${State.collab.code}` : "";
        renderCommandStrip();
    }

    function renderCommandStrip() {
        const commands = sectionCommands(State.currentSection);
        $("#commandStrip").innerHTML = commands.map(commandButton).join("");
    }

    function commandButton(command) {
        const style = command.style ? ` ${command.style}` : "";
        const data = Object.entries(command.data || {}).map(([key, value]) => ` data-${key}="${attr(value)}"`).join("");
        return `<button class="${style.trim()}" data-action="${attr(command.action)}"${data} type="button">${h(command.label)}</button>`;
    }

    function sectionCommands(section) {
        switch (section) {
            case "overview":
                return [
                    { label: "Save", action: "saveProject" },
                    { label: "Camp pack PDF", action: "exportCampPackPdf", style: "slate" }
                ];
            case "personnel":
                return [
                    { label: "Add person", action: "addPerson" },
                    { label: "Bulk add people", action: "bulkAddPeople", style: "teal" },
                    { label: "Import CSV", action: "importPeopleCsv", style: "teal" },
                    { label: "Add team", action: "addTeam", style: "amber" }
                ];
            case "tent-allocation":
                return [
                    { label: "Add tent", action: "addTent" },
                    { label: "Add site item", action: "addSiteItem", style: "amber" },
                    { label: "Links", action: "manageLinks", style: "secondary" },
                    { label: "Arrange", action: "arrangeTents", style: "slate" }
                ];
            case "chores":
                return [
                    { label: "Add rota item", action: "addChoreItem" },
                    { label: "Pick standard", action: "pickStandardChores", style: "teal" },
                    { label: "Modify slots", action: "modifyChoreSlots", style: "secondary" },
                    { label: "Generate rota", action: "generateRota", style: "slate" }
                ];
            case "menu":
                return [
                    { label: "Add meal", action: "addMeal" },
                    { label: "Modify slots", action: "modifyMenuSlots", style: "secondary" },
                    { label: "Library", action: "openMenuLibrary", style: "amber" },
                    { label: "Remove empty", action: "removeEmptyMenuRows", style: "slate" }
                ];
            case "plan":
                return [
                    { label: "Add item", action: "addPlanItem" },
                    { label: "Add concurrent", action: "addConcurrentPlanItem", style: "teal" },
                    { label: "Copy day", action: "copyPlanDay", style: "secondary" },
                    { label: "Plan PDF", action: "exportPlanPdf", style: "slate" }
                ];
            case "group-kit":
                return [
                    { label: "Add item", action: "addGroupKitItem" },
                    { label: "From inventory", action: "addGroupFromInventory", style: "teal" },
                    { label: "Templates", action: "kitTemplates", style: "amber" },
                    { label: "More actions", action: "moreKitActions", style: "slate" }
                ];
            case "participant-kit":
                return [
                    { label: "Add item", action: "addParticipantKitItem" },
                    { label: "Standard items", action: "addStandardParticipantKit", style: "teal" },
                    { label: "Edit standards", action: "manageParticipantInventory", style: "secondary" },
                    { label: "Participant PDF", action: "exportParticipantKitPdf", style: "slate" }
                ];
            case "shopping-list":
                return [
                    { label: "Add list", action: "addShoppingList" },
                    { label: "Shopping PDF", action: "exportShoppingPdf", style: "slate" },
                    { label: "Shopping RTF", action: "exportShoppingRtf", style: "secondary" }
                ];
            case "exports":
                return [
                    { label: "Camp pack PDF", action: "exportCampPackPdf" },
                    { label: "CSV ZIP", action: "exportCsvZip", style: "teal" },
                    { label: "Save section", action: "saveCurrentSection", style: "secondary" }
                ];
            default:
                return [];
        }
    }

    function renderMain() {
        const main = $("#mainContent");
        switch (State.currentSection) {
            case "overview":
                main.innerHTML = renderOverview();
                break;
            case "personnel":
                main.innerHTML = renderPersonnel();
                break;
            case "tent-allocation":
                main.innerHTML = renderTentAllocation();
                afterRenderTentCanvas();
                break;
            case "chores":
                main.innerHTML = renderChores();
                break;
            case "menu":
                main.innerHTML = renderMenu();
                break;
            case "plan":
                main.innerHTML = renderPlan();
                break;
            case "group-kit":
                main.innerHTML = renderKit(false);
                break;
            case "participant-kit":
                main.innerHTML = renderKit(true);
                break;
            case "shopping-list":
                main.innerHTML = renderShopping();
                break;
            case "exports":
                main.innerHTML = renderExports();
                break;
            default:
                main.innerHTML = renderOverview();
                break;
        }
    }

    function sectionHeader(title, subtitle, aside = "") {
        return `
            <div class="section-header">
                <div>
                    <h1>${h(title)}</h1>
                    <p>${h(subtitle)}</p>
                </div>
                ${aside}
            </div>
        `;
    }

    function renderOverview() {
        const project = State.project;
        const warnings = [...buildTentWarnings(project), ...buildMenuWarnings(project)];
        return `
            ${sectionHeader("Overview", "Camp details and live planning checks.")}
            <div class="summary-grid">
                ${summaryTile("People", participantCount(project))}
                ${summaryTile("Tents", project.tents.length)}
                ${summaryTile("Meals planned", activeMenuItems(project))}
                ${summaryTile("Kit items", project.kitItems.length)}
            </div>
            <div class="grid two" style="margin-top:12px">
                <section class="panel">
                    <div class="panel-header"><strong>Camp details</strong></div>
                    <div class="panel-body grid two">
                        <label>Camp name<input data-project-field="campName" value="${attr(project.campName)}"></label>
                        <label>Location<input data-project-field="location" value="${attr(project.location)}"></label>
                        <label>Start date<input type="date" data-project-field="startDate" value="${attr(project.startDate)}"></label>
                        <label>End date<input type="date" data-project-field="endDate" value="${attr(project.endDate)}"></label>
                        <label class="full">Participant count override<input type="number" min="0" data-project-field="participantCountOverride" value="${attr(project.participantCountOverride)}"></label>
                        <label class="full">Notes<textarea data-project-field="notes">${h(project.notes)}</textarea></label>
                    </div>
                </section>
                <section class="panel">
                    <div class="panel-header"><strong>Camp checks</strong><button class="secondary small-button" data-action="exportCampPackPdf" type="button">Export pack</button></div>
                    <div class="panel-body">
                        ${warnings.length ? `<div class="warning-list">${warnings.map(warning => `<div class="warning">${h(warning)}</div>`).join("")}</div>` : `<div class="empty">No camp checks to show. Warnings will appear here when something needs attention.</div>`}
                    </div>
                </section>
            </div>
        `;
    }

    function summaryTile(label, value) {
        return `<div class="summary-tile"><span class="summary-number">${h(value)}</span><strong>${h(label)}</strong></div>`;
    }

    function renderPersonnel() {
        const filter = State.filters.people || "";
        const teamFilter = State.filters.teams || "";
        const people = orderedPeople().filter(person => includesText(
            filter,
            person.name,
            personTypeDisplay(person),
            person.camperType,
            person.isDayVisitor ? "day visitor" : "",
            person.gender,
            teamsForPerson(person.id).map(team => team.name).join(" "),
            tentName(person.tentId),
            person.dietaryNotes,
            person.medicalNotes,
            person.notes
        ));
        const teams = [...State.project.choreTeams]
            .sort((a, b) => localeSort(a.name, b.name))
            .filter(team => includesText(teamFilter, team.name, team.teamType, team.notes, peopleForTeam(team.id).map(person => person.name).join(" ")));
        return `
            ${sectionHeader("Personnel", "Central people and teams used by tents, chores, the plan, and exports.")}
            <div class="grid two">
                <section class="panel">
                    <div class="panel-header"><strong>People</strong><button class="small-button secondary" data-action="downloadPeopleSampleCsv" type="button">Sample CSV</button></div>
                    <div class="panel-body">
                        <div class="toolbar">
                            <input placeholder="Filter people" value="${attr(filter)}" data-filter-live="people">
                            <button data-action="addPerson" type="button">Add person</button>
                            <button class="teal" data-action="bulkAddPeople" type="button">Bulk add</button>
                            <button class="teal" data-action="importPeopleCsv" type="button">Import CSV</button>
                        </div>
                        ${people.length ? peopleTable(people) : `<div class="empty">${filter ? "No people match this filter." : "No people added yet. Use Add person, Bulk add people or Import people CSV."}</div>`}
                    </div>
                </section>
                <section class="panel">
                    <div class="panel-header"><strong>Teams</strong><button class="small-button secondary" data-action="bulkAddTeams" type="button">Bulk add teams</button></div>
                    <div class="panel-body">
                        <div class="toolbar">
                            <input placeholder="Filter teams" value="${attr(teamFilter)}" data-filter-live="teams">
                            <button data-action="addTeam" type="button">Add team</button>
                        </div>
                        ${teams.length ? teamsTable(teams) : `<div class="empty">${teamFilter ? "No teams match this filter." : "No teams yet. Add a team, then add people to it."}</div>`}
                    </div>
                </section>
            </div>
        `;
    }

    function peopleTable(people) {
        return `
            <div class="table-wrap">
                <table class="compact-table">
                    <thead><tr><th>Name</th><th>Type</th><th>Teams</th><th>Tent</th><th>Dietary</th><th>Medical</th><th></th></tr></thead>
                    <tbody>
                    ${people.map(person => `
                        <tr>
                            <td><strong>${h(person.name)}</strong><br><span class="muted">${h(person.gender)}${person.isDayVisitor ? " | Day visitor" : ""}</span></td>
                            <td>${h(personTypeDisplay(person))}<br><span class="muted">${h(person.camperType)}</span></td>
                            <td>${h(teamsForPerson(person.id).map(team => team.name).join(", "))}</td>
                            <td>${h(tentName(person.tentId) || "Unallocated")}</td>
                            <td>${h(person.dietaryNotes)}</td>
                            <td>${h(person.medicalNotes)}</td>
                            <td class="row-actions">
                                <button class="small-button secondary" data-action="editPerson" data-id="${attr(person.id)}" type="button">Edit</button>
                                <button class="small-button secondary" data-action="assignPerson" data-id="${attr(person.id)}" type="button">Assign</button>
                                <button class="small-button danger" data-action="removePerson" data-id="${attr(person.id)}" type="button">Remove</button>
                            </td>
                        </tr>
                    `).join("")}
                    </tbody>
                </table>
            </div>`;
    }

    function teamsTable(teams) {
        return `
            <div class="table-wrap">
                <table class="compact-table">
                    <thead><tr><th>Team</th><th>Type</th><th>Members</th><th></th></tr></thead>
                    <tbody>
                    ${teams.map(team => `
                        <tr>
                            <td><strong>${h(team.name)}</strong><br><span style="display:inline-block;width:24px;height:8px;background:${attr(team.colour)};border:1px solid #999"></span></td>
                            <td>${h(team.teamType)}</td>
                            <td>${h(peopleForTeam(team.id).map(person => person.name).join(", ") || "No members")}</td>
                            <td class="row-actions">
                                <button class="small-button secondary" data-action="editTeam" data-id="${attr(team.id)}" type="button">Edit</button>
                                <button class="small-button secondary" data-action="manageTeamMembers" data-id="${attr(team.id)}" type="button">Members</button>
                                <button class="small-button danger" data-action="removeTeam" data-id="${attr(team.id)}" type="button">Remove</button>
                            </td>
                        </tr>
                    `).join("")}
                    </tbody>
                </table>
            </div>`;
    }

    function renderTentAllocation() {
        const project = State.project;
        const warnings = buildTentWarnings(project);
        const unallocated = orderedPeople().filter(person => !person.tentId);
        const friendLabels = buildFriendGroupLabels();
        const allocatedCards = project.tents
            .flatMap(tent => {
                const members = orderedPeople().filter(person => person.tentId === tent.id).sort((a, b) => localeSort(a.name, b.name));
                return members.map((person, index) => renderCanvasPerson(person, friendLabels, buildOccupantSlot(tent, index, members.length)));
            })
            .join("");
        return `
            ${sectionHeader("Tent Allocation", "Touch-drag tents and site items, then assign people into tents.", `<button data-action="makeTentTable" type="button">Preview table</button>`)}
            <div class="grid three">
                ${summaryTile("Total people", project.people.length)}
                ${summaryTile("Allocated", project.people.length - unallocated.length)}
                ${summaryTile("Warnings", warnings.length)}
            </div>
            <div class="grid two" style="margin-top:12px">
                <section class="panel">
                    <div class="panel-header"><strong>Unallocated Campers</strong><button class="small-button secondary" data-action="clearTentAllocations" type="button">Clear allocations</button></div>
                    <div class="panel-body">
                        ${unallocated.length ? `<div class="person-card-list">${unallocated.map(person => renderUnallocatedPerson(person, friendLabels)).join("")}</div>` : `<div class="empty">All people are allocated.</div>`}
                    </div>
                </section>
                <section class="panel">
                    <div class="panel-header"><strong>Warnings</strong><button class="small-button secondary" data-action="manageLinks" type="button">Friend & foe links</button></div>
                    <div class="panel-body">${warnings.length ? `<div class="warning-list">${warnings.map(warning => `<div class="warning">${h(warning)}</div>`).join("")}</div>` : `<div class="empty">No tent warnings.</div>`}</div>
                </section>
            </div>
            <div class="toolbar" style="margin-top:12px">
                <button data-action="addTent" type="button">Add Tent</button>
                <button class="amber" data-action="addSiteItem" type="button">Add Site Item</button>
                <button class="slate" data-action="arrangeTents" type="button">Arrange</button>
                <button class="secondary" data-action="exportTentLayoutPdf" type="button">Layout PDF</button>
                <button class="secondary" data-action="exportTentTablePdf" type="button">Table PDF</button>
                <button class="secondary" data-action="exportTentTagsPdf" type="button">Tags PDF</button>
            </div>
            <div id="tentCanvas" class="tent-layout" style="height:620px">
                ${project.siteItems.map(item => renderCanvasSiteItem(item)).join("")}
                ${project.tents.map(tent => renderCanvasTent(tent, warnings)).join("")}
                ${allocatedCards}
            </div>
        `;
    }

    function renderCanvasTent(tent, warnings) {
        const members = orderedPeople().filter(person => person.tentId === tent.id);
        const hasWarnings = warnings.some(warning => warning.toLowerCase().includes(tent.name.toLowerCase()));
        const width = Math.round(TENT_CARD_WIDTH * tent.sizeScale);
        const height = Math.round(TENT_CARD_HEIGHT * tent.sizeScale);
        const isBunk = tent.accommodationType === TERMS.accommodationBunkRoom || tent.type.toLowerCase().includes("bunk");
        return `
            <div class="canvas-card tent-card ${isBunk ? "bunk-card" : ""} ${hasWarnings ? "warning-border" : ""}" data-canvas-kind="tent" data-id="${attr(tent.id)}" style="left:${tent.x}px;top:${tent.y}px;width:${width}px;height:${height}px;border-color:${attr(tent.colour)}">
                <button class="canvas-action-button" data-action="openTentActions" data-id="${attr(tent.id)}" aria-label="Actions for ${attr(tent.name)}" type="button">...</button>
                <div class="canvas-visual">${renderTentVisual(tent, isBunk)}</div>
                <strong class="canvas-title">${h(tent.name)}</strong>
                <div class="meta">${members.length} people</div>
            </div>`;
    }

    function renderCanvasSiteItem(item) {
        const width = Math.round(SITE_ITEM_CARD_WIDTH * item.sizeScale);
        const height = Math.round(SITE_ITEM_CARD_HEIGHT * item.sizeScale);
        return `
            <div class="canvas-card site site-card" data-canvas-kind="site" data-id="${attr(item.id)}" style="left:${item.x}px;top:${item.y}px;width:${width}px;height:${height}px;border-color:${attr(item.colour)}">
                <button class="canvas-action-button" data-action="openSiteActions" data-id="${attr(item.id)}" aria-label="Actions for ${attr(item.name)}" type="button">...</button>
                <div class="canvas-visual">${renderSiteItemVisual(item)}</div>
                <strong class="canvas-title">${h(item.name)}</strong>
            </div>`;
    }

    function buildOccupantSlot(tent, slot, peopleCount) {
        const row = Math.floor(slot / OCCUPANT_COLUMNS);
        const column = slot % OCCUPANT_COLUMNS;
        let peopleInRow = Math.min(OCCUPANT_COLUMNS, Math.max(0, peopleCount - row * OCCUPANT_COLUMNS));
        if (!peopleInRow) peopleInRow = OCCUPANT_COLUMNS;
        const tentWidth = TENT_CARD_WIDTH * tent.sizeScale;
        const tentHeight = TENT_CARD_HEIGHT * tent.sizeScale;
        const totalWidth = peopleInRow * PERSON_CARD_WIDTH + (peopleInRow - 1) * OCCUPANT_GAP;
        const startX = tent.x + (tentWidth - totalWidth) / 2;
        return {
            x: Math.max(0, Math.round(startX + column * (PERSON_CARD_WIDTH + OCCUPANT_GAP))),
            y: Math.max(0, Math.round(tent.y + tentHeight + OCCUPANT_GAP + row * (PERSON_CARD_HEIGHT + OCCUPANT_GAP)))
        };
    }

    function renderCanvasPerson(person, friendLabels, slot) {
        const hasSavedPosition = number(person.x, 0) > 0 || number(person.y, 0) > 0;
        const x = hasSavedPosition ? number(person.x, slot.x) : slot.x;
        const y = hasSavedPosition ? number(person.y, slot.y) : slot.y;
        const friendLabel = friendLabels[person.id] || "";
        return `
            <div class="person-display-card canvas-person-card ${friendLabel ? "friend-group" : ""}" data-canvas-kind="person" data-id="${attr(person.id)}" title="${attr(personRoleText(person))}" style="left:${Math.round(x)}px;top:${Math.round(y)}px;${personCardVars(person)}">
                ${renderPersonCardContent(person, friendLabel)}
            </div>`;
    }

    function renderUnallocatedPerson(person, friendLabels) {
        const friendLabel = friendLabels[person.id] || "";
        return `
            <button class="person-display-card person-picker-card ${friendLabel ? "friend-group" : ""}" data-action="assignPersonToTent" data-id="${attr(person.id)}" title="${attr(personRoleText(person))}" style="${personCardVars(person)}" type="button">
                ${renderPersonCardContent(person, friendLabel)}
            </button>`;
    }

    function personCardVars(person) {
        const badge = personBadge(person);
        return `--person-accent:${attr(personAccentColour(person))};--badge-bg:${attr(badge.background)};--badge-fg:${attr(badge.foreground)};`;
    }

    function renderPersonCardContent(person, friendLabel) {
        const badge = personBadge(person);
        return `
            ${renderPersonVisual(person)}
            ${person.isDayVisitor ? renderDayVisitorSun() : ""}
            <span class="person-name">${h(person.name)}</span>
            <span class="person-badge">${h(badge.label)}</span>
            ${friendLabel ? `<span class="friend-badge">${h(friendLabel)}</span>` : ""}`;
    }

    function renderPersonVisual(person) {
        const gender = personGenderColour(person);
        const outline = darkenColour(gender, 0.35);
        const youngPerson = person.personType === TERMS.personTypeYoungPerson;
        return `
            <svg class="person-graphic" viewBox="0 0 92 46" aria-hidden="true" focusable="false">
                ${youngPerson ? renderCamperTypeMark(person.camperType) : ""}
                ${person.personType === TERMS.personTypeAdult ? renderAdultHat() : ""}
                ${person.personType === TERMS.personTypeYoungLeader ? renderYoungLeaderCap() : ""}
                <circle cx="46" cy="14" r="6" fill="${attr(gender)}" stroke="${attr(outline)}" stroke-width="1"></circle>
                <line x1="46" y1="21" x2="46" y2="32" stroke="${attr(gender)}" stroke-width="${youngPerson ? "2.6" : "3.1"}" stroke-linecap="round"></line>
                <line x1="34" y1="25" x2="58" y2="25" stroke="${attr(gender)}" stroke-width="2.4" stroke-linecap="round"></line>
                <line x1="46" y1="32" x2="37" y2="43" stroke="${attr(gender)}" stroke-width="2.4" stroke-linecap="round"></line>
                <line x1="46" y1="32" x2="55" y2="43" stroke="${attr(gender)}" stroke-width="2.4" stroke-linecap="round"></line>
            </svg>`;
    }

    function renderCamperTypeMark(camperType) {
        if (camperType === TERMS.camperTypeBeaver) {
            return `
                <g transform="translate(11 10) scale(0.52)">
                    <ellipse cx="24" cy="23" rx="21" ry="15" fill="#8b532a" stroke="#4c2e18" stroke-width="1.4"></ellipse>
                    <ellipse cx="5" cy="11" rx="5" ry="5" fill="#8b532a" stroke="#4c2e18" stroke-width="1.1"></ellipse>
                    <ellipse cx="36" cy="11" rx="5" ry="5" fill="#8b532a" stroke="#4c2e18" stroke-width="1.1"></ellipse>
                    <ellipse cx="20" cy="28.5" rx="11" ry="6.5" fill="#d2965c" stroke="#4c2e18" stroke-width="0.8"></ellipse>
                    <circle cx="21" cy="20" r="2.5" fill="#000"></circle>
                    <circle cx="15.2" cy="17.2" r="1.6" fill="#000"></circle>
                    <circle cx="29.2" cy="17.2" r="1.6" fill="#000"></circle>
                    <rect x="16" y="33" width="5" height="7" rx="1" fill="#fff" stroke="#d3d3d3" stroke-width="0.4"></rect>
                    <rect x="21" y="33" width="5" height="7" rx="1" fill="#fff" stroke="#d3d3d3" stroke-width="0.4"></rect>
                    <line x1="7" y1="25" x2="-1" y2="22" stroke="#4c2e18" stroke-width="0.8" stroke-linecap="round"></line>
                    <line x1="34" y1="25" x2="43" y2="22" stroke="#4c2e18" stroke-width="0.8" stroke-linecap="round"></line>
                </g>`;
        }
        if (camperType === TERMS.camperTypeCub) {
            return `
                <g transform="translate(13 12) rotate(-18 16 16) scale(0.76)">
                    <ellipse cx="15.5" cy="21" rx="7.5" ry="7" fill="#ffc425" stroke="#a98200" stroke-width="1"></ellipse>
                    <ellipse cx="4" cy="10.5" rx="3" ry="3.5" fill="#ffc425" stroke="#a98200" stroke-width="0.8"></ellipse>
                    <ellipse cx="11" cy="6.5" rx="3" ry="3.5" fill="#ffc425" stroke="#a98200" stroke-width="0.8"></ellipse>
                    <ellipse cx="18" cy="6.5" rx="3" ry="3.5" fill="#ffc425" stroke="#a98200" stroke-width="0.8"></ellipse>
                    <ellipse cx="25" cy="10.5" rx="3" ry="3.5" fill="#ffc425" stroke="#a98200" stroke-width="0.8"></ellipse>
                </g>`;
        }
        if (camperType === TERMS.camperTypeExplorer) {
            return `
                <g transform="translate(13 14) scale(0.62)">
                    <polygon points="3,33 18,5 33,33" fill="#5a2c82" stroke="#3e1d5b" stroke-width="1.5"></polygon>
                    <polygon points="18,5 12,17 18,14 24,17" fill="#fff" stroke="#fff" stroke-width="0.6"></polygon>
                    <line x1="3" y1="33" x2="33" y2="33" stroke="#3e1d5b" stroke-width="1.8" stroke-linecap="round"></line>
                </g>`;
        }
        if (camperType === TERMS.camperTypeScout) {
            return `
                <g transform="translate(18 14) scale(0.25)" fill="none" stroke="#6a1b9a" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M24.4 31.2 C23.6 24.8 17.2 20.8 17.2 14.4 C17.2 8.8 22 4.8 27.6 0 C33.2 4.8 38 8.8 38 14.4 C38 20.8 31.6 24.8 30.8 31.2" stroke-width="3.6"></path>
                    <path d="M21.2 31.2 C19.6 24 16.4 17.6 11.6 16 C6 14.4 1.2 17.6 0.4 24" stroke-width="3.6"></path>
                    <path d="M34 31.2 C35.6 24 38.8 17.6 43.6 16 C49.2 14.4 54 17.6 54.8 24" stroke-width="3.6"></path>
                    <rect x="11.6" y="33.6" width="32" height="2.8" rx="0.8" fill="#6a1b9a" stroke="#4a148c" stroke-width="0.25"></rect>
                    <path d="M24.4 39.2 C23.6 44 22 48 18.8 51.2 C21.2 56 24.4 58.4 27.6 60 C30.8 58.4 34 56 36.4 51.2 C33.2 48 31.6 44 30.8 39.2" stroke-width="3.6"></path>
                </g>`;
        }
        return "";
    }

    function renderAdultHat() {
        return `
            <rect x="37" y="2" width="18" height="6" rx="2" fill="#ffb74d" stroke="#8b4513" stroke-width="0.8"></rect>
            <line x1="33" y1="8" x2="59" y2="8" stroke="#8b4513" stroke-width="2" stroke-linecap="round"></line>`;
    }

    function renderYoungLeaderCap() {
        return `
            <rect x="38" y="2" width="17" height="8" rx="4" fill="#00897b" stroke="#2f4f4f" stroke-width="0.8"></rect>
            <polygon points="51,7 63,8 52,11" fill="#00897b" stroke="#2f4f4f" stroke-width="0.8"></polygon>`;
    }

    function renderDayVisitorSun() {
        return `
            <svg class="person-sun" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <g stroke="#bf7200" stroke-width="1.5" stroke-linecap="round">
                    <line x1="12" y1="1.5" x2="12" y2="5"></line>
                    <line x1="12" y1="19" x2="12" y2="22.5"></line>
                    <line x1="1.5" y1="12" x2="5" y2="12"></line>
                    <line x1="19" y1="12" x2="22.5" y2="12"></line>
                    <line x1="4.6" y1="4.6" x2="7.1" y2="7.1"></line>
                    <line x1="16.9" y1="16.9" x2="19.4" y2="19.4"></line>
                    <line x1="19.4" y1="4.6" x2="16.9" y2="7.1"></line>
                    <line x1="7.1" y1="16.9" x2="4.6" y2="19.4"></line>
                </g>
                <circle cx="12" cy="12" r="6" fill="#ffca28" stroke="#bf7200" stroke-width="1.3"></circle>
            </svg>`;
    }

    function personGenderColour(person) {
        if (person.gender === TERMS.genderMale) return "#4169e1";
        if (person.gender === TERMS.genderFemale) return "#ec407a";
        return "#f57c00";
    }

    function personAccentColour(person) {
        if (person.personType === TERMS.personTypeAdult) return "#455a64";
        if (person.personType === TERMS.personTypeYoungLeader) return "#00897b";
        return "#2e7d32";
    }

    function personBadge(person) {
        if (person.personType === TERMS.personTypeAdult) return { label: "Adult", background: "#455a64", foreground: "#ffffff" };
        if (person.personType === TERMS.personTypeYoungLeader) return { label: "YL", background: "#00897b", foreground: "#ffffff" };
        if (person.camperType === TERMS.camperTypeBeaver) return { label: "Beaver", background: "#009fda", foreground: "#ffffff" };
        if (person.camperType === TERMS.camperTypeCub) return { label: "Cub", background: "#ffc425", foreground: "#000000" };
        if (person.camperType === TERMS.camperTypeScout) return { label: "Scout", background: "#007934", foreground: "#ffffff" };
        if (person.camperType === TERMS.camperTypeExplorer) return { label: "Explorer", background: "#5a2c82", foreground: "#ffffff" };
        return { label: "Camper", background: "#2e7d32", foreground: "#ffffff" };
    }

    function buildFriendGroupLabels() {
        const groupSortName = group => group
            .map(id => personName(id))
            .filter(Boolean)
            .sort(localeSort)[0] || "";
        const labels = {};
        getFriendGroups()
            .sort((a, b) => localeSort(groupSortName(a), groupSortName(b)))
            .forEach((group, index) => group.forEach(id => labels[id] = `G${index + 1}`));
        return labels;
    }

    function getFriendGroups() {
        const ids = new Set(State.project.people.map(person => person.id));
        const adjacency = Object.fromEntries([...ids].map(id => [id, new Set()]));
        State.project.friendLinks.forEach(link => {
            if (link.personAId !== link.personBId && ids.has(link.personAId) && ids.has(link.personBId)) {
                adjacency[link.personAId].add(link.personBId);
                adjacency[link.personBId].add(link.personAId);
            }
        });
        const visited = new Set();
        const groups = [];
        orderedPeople().forEach(person => {
            if (visited.has(person.id) || !adjacency[person.id]?.size) return;
            const group = [];
            const stack = [person.id];
            visited.add(person.id);
            while (stack.length) {
                const current = stack.pop();
                group.push(current);
                [...adjacency[current]].sort((a, b) => localeSort(personName(a), personName(b))).forEach(next => {
                    if (!visited.has(next)) {
                        visited.add(next);
                        stack.push(next);
                    }
                });
            }
            if (group.length > 1) groups.push(group);
        });
        return groups;
    }

    function renderTentVisual(tent, isBunk) {
        const colour = isHexColour(tent.colour) ? tent.colour : "#4CAF50";
        const stroke = darkenColour(colour, 0.45);
        if (isBunk) return renderBunkRoomSvg(colour);
        const shade = darkenColour(colour, 0.18);
        return `
            <svg class="tent-graphic" viewBox="0 0 170 96" aria-hidden="true" focusable="false">
                <ellipse cx="85" cy="84" rx="48" ry="6" fill="#000000" opacity="0.22"></ellipse>
                <polygon points="85,10 33,78 137,78" fill="${attr(colour)}" stroke="${attr(stroke)}" stroke-width="2.2"></polygon>
                <polygon points="85,10 85,78 137,78" fill="${attr(shade)}" stroke="${attr(stroke)}" stroke-width="1"></polygon>
                <line x1="85" y1="20" x2="85" y2="77" stroke="#111111" stroke-width="1.3" stroke-linecap="round"></line>
            </svg>`;
    }

    function renderBunkRoomSvg(colour) {
        const frame = "#4f463a";
        const wood = "#8d5e34";
        return `
            <svg class="tent-graphic" viewBox="0 0 170 96" aria-hidden="true" focusable="false">
                <rect x="37" y="78" width="96" height="14" rx="7" fill="#000000" opacity="0.18"></rect>
                <rect x="44" y="18" width="82" height="66" rx="6" fill="#f2f8ef" stroke="${frame}" stroke-width="2"></rect>
                <polygon points="42,18 85,4 128,18" fill="${attr(colour)}" stroke="${frame}" stroke-width="1.5"></polygon>
                ${renderBunkSvg(59, 35, 52, 36, wood, colour)}
            </svg>`;
    }

    function renderBunkSvg(x, y, width, height, frame, blanket) {
        const topBed = y + 4;
        const bottomBed = y + height - 20;
        const ladderX = x + width - 13;
        return `
            <line x1="${x}" y1="${y}" x2="${x}" y2="${y + height}" stroke="${frame}" stroke-width="3" stroke-linecap="round"></line>
            <line x1="${x + width}" y1="${y}" x2="${x + width}" y2="${y + height}" stroke="${frame}" stroke-width="3" stroke-linecap="round"></line>
            ${renderBedSvg(x, topBed, width, 16, frame, blanket)}
            ${renderBedSvg(x, bottomBed, width, 16, frame, blanket)}
            <line x1="${ladderX}" y1="${y + 9}" x2="${ladderX}" y2="${y + height - 9}" stroke="${frame}" stroke-width="2" stroke-linecap="round"></line>
            <line x1="${ladderX + 8}" y1="${y + 9}" x2="${ladderX + 8}" y2="${y + height - 9}" stroke="${frame}" stroke-width="2" stroke-linecap="round"></line>
            <line x1="${ladderX}" y1="${y + 16}" x2="${ladderX + 8}" y2="${y + 16}" stroke="${frame}" stroke-width="1.4" stroke-linecap="round"></line>
            <line x1="${ladderX}" y1="${y + 25}" x2="${ladderX + 8}" y2="${y + 25}" stroke="${frame}" stroke-width="1.4" stroke-linecap="round"></line>`;
    }

    function renderBedSvg(x, y, width, height, frame, blanket) {
        return `
            <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="3" fill="#ffffff" stroke="${frame}" stroke-width="2"></rect>
            <rect x="${x + 15}" y="${y + 3}" width="${width - 17}" height="${height - 5}" rx="3" fill="${attr(blanket)}"></rect>
            <ellipse cx="${x + 9}" cy="${y + height / 2}" rx="6" ry="${(height - 6) / 2}" fill="#f5f5f5" stroke="#d3d3d3" stroke-width="0.8"></ellipse>`;
    }

    function renderSiteItemVisual(item) {
        const type = clean(item.type).toLowerCase();
        if (type.includes("flag")) return renderFlagSvg();
        if (type.includes("fire")) return renderFireSvg();
        if (type.includes("event")) return renderEventShelterSvg();
        if (type.includes("kitchen")) return renderSiteTentSvg("#ffe082", "#b8860b", "kitchen");
        if (type.includes("mess")) return renderSiteTentSvg("#ffe0b2", "#8b4513", "mess");
        return renderSiteTentSvg("#81c784", "#006400", "storage");
    }

    function renderSiteTentSvg(fill, stroke, kind) {
        const extras = kind === "kitchen"
            ? `<rect x="34" y="39" width="24" height="12" rx="2" fill="#696969" stroke="#000" stroke-width="0.8"></rect><line x1="39" y1="36" x2="39" y2="42" stroke="#ff4500" stroke-width="2" stroke-linecap="round"></line><line x1="46" y1="34" x2="46" y2="42" stroke="#ff4500" stroke-width="2" stroke-linecap="round"></line><line x1="53" y1="36" x2="53" y2="42" stroke="#ff4500" stroke-width="2" stroke-linecap="round"></line>`
            : kind === "mess"
                ? `<rect x="27" y="40" width="38" height="10" rx="2" fill="#a0522d" stroke="#000" stroke-width="0.8"></rect><ellipse cx="37" cy="46" rx="4" ry="4" fill="#fff" stroke="#808080" stroke-width="0.6"></ellipse><ellipse cx="57" cy="46" rx="4" ry="4" fill="#fff" stroke="#808080" stroke-width="0.6"></ellipse>`
                : `<rect x="29" y="38" width="13" height="12" fill="#d2b48c" stroke="#8b4513" stroke-width="1"></rect><rect x="44" y="38" width="13" height="12" fill="#d2b48c" stroke="#8b4513" stroke-width="1"></rect><rect x="36" y="28" width="13" height="12" fill="#d2b48c" stroke="#8b4513" stroke-width="1"></rect>`;
        return `
            <svg class="site-graphic" viewBox="0 0 92 62" aria-hidden="true" focusable="false">
                <polygon points="46,8 16,46 76,46" fill="${fill}" stroke="${stroke}" stroke-width="2"></polygon>
                <line x1="46" y1="15" x2="46" y2="46" stroke="${stroke}" stroke-width="1.6" stroke-linecap="round"></line>
                ${extras}
            </svg>`;
    }

    function renderEventShelterSvg() {
        return `
            <svg class="site-graphic" viewBox="0 0 92 62" aria-hidden="true" focusable="false">
                <polygon points="18,24 28,10 64,10 74,24" fill="#90caf9" stroke="#4682b4" stroke-width="2"></polygon>
                <line x1="22" y1="24" x2="22" y2="52" stroke="#4682b4" stroke-width="2" stroke-linecap="round"></line>
                <line x1="70" y1="24" x2="70" y2="52" stroke="#4682b4" stroke-width="2" stroke-linecap="round"></line>
                <line x1="30" y1="24" x2="30" y2="52" stroke="#4682b4" stroke-width="1.5" stroke-linecap="round"></line>
                <line x1="62" y1="24" x2="62" y2="52" stroke="#4682b4" stroke-width="1.5" stroke-linecap="round"></line>
                <line x1="18" y1="52" x2="74" y2="52" stroke="#4682b4" stroke-width="2" stroke-linecap="round"></line>
            </svg>`;
    }

    function renderFireSvg() {
        return `
            <svg class="site-graphic" viewBox="0 0 92 62" aria-hidden="true" focusable="false">
                <line x1="29" y1="53" x2="62" y2="43" stroke="#8b4513" stroke-width="5" stroke-linecap="round"></line>
                <line x1="30" y1="43" x2="63" y2="53" stroke="#8b4513" stroke-width="5" stroke-linecap="round"></line>
                <path d="M46 11 C33 25 37 35 42 43 C30 36 28 48 39 55 C48 61 62 55 64 43 C66 33 55 27 54 18 C51 24 49 28 46 31 C49 22 48 16 46 11 Z" fill="#ff4500" stroke="#8b0000" stroke-width="1.4"></path>
                <path d="M47 30 C41 38 43 47 48 51 C54 47 56 39 50 33 C49 37 47 39 45 41 C46 36 47 33 47 30 Z" fill="#ffd700" stroke="#ffa500" stroke-width="0.8"></path>
            </svg>`;
    }

    function renderFlagSvg() {
        return `
            <svg class="site-graphic" viewBox="0 0 92 62" aria-hidden="true" focusable="false">
                <rect x="34" y="8" width="5" height="48" rx="2" fill="#8b4513" stroke="#000" stroke-width="0.8"></rect>
                <rect x="39" y="10" width="32" height="20" fill="#012169"></rect>
                <line x1="37" y1="9" x2="73" y2="31" stroke="#fff" stroke-width="5"></line>
                <line x1="73" y1="9" x2="37" y2="31" stroke="#fff" stroke-width="5"></line>
                <line x1="37" y1="9" x2="73" y2="31" stroke="#f00" stroke-width="2.2"></line>
                <line x1="73" y1="9" x2="37" y2="31" stroke="#f00" stroke-width="2.2"></line>
                <rect x="39" y="17" width="32" height="6" fill="#fff"></rect>
                <rect x="52" y="10" width="6" height="20" fill="#fff"></rect>
                <rect x="39" y="18.5" width="32" height="3" fill="#f00"></rect>
                <rect x="53.5" y="10" width="3" height="20" fill="#f00"></rect>
                <rect x="39" y="10" width="32" height="20" fill="transparent" stroke="#000" stroke-width="1.1"></rect>
                <ellipse cx="37" cy="58" rx="14" ry="4" fill="#000" opacity="0.29"></ellipse>
            </svg>`;
    }

    function afterRenderTentCanvas() {
        const canvas = $("#tentCanvas");
        if (!canvas) return;
        $all("[data-canvas-kind]", canvas).forEach(card => {
            card.addEventListener("pointerdown", event => {
                if (event.target.closest("button")) return;
                const rect = card.getBoundingClientRect();
                const canvasRect = canvas.getBoundingClientRect();
                State.dragging = {
                    kind: card.dataset.canvasKind,
                    id: card.dataset.id,
                    offsetX: event.clientX - rect.left,
                    offsetY: event.clientY - rect.top,
                    canvasLeft: canvasRect.left + canvas.scrollLeft,
                    canvasTop: canvasRect.top + canvas.scrollTop
                };
                card.setPointerCapture(event.pointerId);
            });
            card.addEventListener("pointermove", event => {
                if (!State.dragging || State.dragging.id !== card.dataset.id) return;
                const x = Math.max(0, event.clientX - State.dragging.canvasLeft - State.dragging.offsetX);
                const y = Math.max(0, event.clientY - State.dragging.canvasTop - State.dragging.offsetY);
                card.style.left = `${Math.round(x / 16) * 16}px`;
                card.style.top = `${Math.round(y / 16) * 16}px`;
            });
            card.addEventListener("pointerup", event => {
                if (!State.dragging || State.dragging.id !== card.dataset.id) return;
                const x = parseInt(card.style.left, 10) || 0;
                const y = parseInt(card.style.top, 10) || 0;
                const drag = State.dragging;
                State.dragging = null;
                card.releasePointerCapture(event.pointerId);
                mutate("Moved layout item.", () => {
                    const collection = drag.kind === "tent"
                        ? State.project.tents
                        : drag.kind === "person"
                            ? State.project.people
                            : State.project.siteItems;
                    const item = collection.find(entry => entry.id === drag.id);
                    if (item) {
                        item.x = x;
                        item.y = y;
                    }
                });
            });
        });
    }

    function renderChores() {
        const filter = State.filters.choreItems || "";
        const assignFilter = State.filters.choreAssign || "";
        const items = [...State.project.choreItems].sort((a, b) => localeSort(a.name, b.name)).filter(item => includesText(filter, item.name, item.category, item.description));
        const assignees = buildChoreAssignees().filter(item => includesText(assignFilter, item.name, item.detail));
        return `
            ${sectionHeader("Chores", "Rota items, sessions, teams, tents and people share the same project state.")}
            <div class="grid three">
                <section class="panel">
                    <div class="panel-header"><strong>Assign</strong></div>
                    <div class="panel-body">
                        <input placeholder="Filter teams, tents and people" value="${attr(assignFilter)}" data-filter-live="choreAssign">
                        <div class="pill-list" style="margin-top:10px">${assignees.map(item => `<span class="pill">${h(item.name)} <small>${h(item.detail)}</small></span>`).join("") || `<div class="empty">No teams, tents or people yet.</div>`}</div>
                    </div>
                </section>
                <section class="panel">
                    <div class="panel-header"><strong>Rota items</strong><button class="small-button secondary" data-action="bulkAddChoreItems" type="button">Bulk add</button></div>
                    <div class="panel-body">
                        <div class="toolbar">
                            <input placeholder="Filter rota items" value="${attr(filter)}" data-filter-live="choreItems">
                            <button data-action="addChoreItem" type="button">Add</button>
                            <button class="teal" data-action="pickStandardChores" type="button">Pick standard</button>
                        </div>
                        ${items.length ? `<div class="table-wrap"><table class="compact-table"><thead><tr><th>Name</th><th>Category</th><th></th></tr></thead><tbody>${items.map(item => `<tr><td><strong>${h(item.name)}</strong><br>${h(item.description)}</td><td>${h(item.category)}</td><td class="row-actions"><button class="small-button secondary" data-action="editChoreItem" data-id="${attr(item.id)}" type="button">Edit</button><button class="small-button danger" data-action="removeChoreItem" data-id="${attr(item.id)}" type="button">Remove</button></td></tr>`).join("")}</tbody></table></div>` : `<div class="empty">No rota items yet. Add a rota item or pick standard items.</div>`}
                    </div>
                </section>
                <section class="panel">
                    <div class="panel-header"><strong>Manual allocation</strong></div>
                    <div class="panel-body">
                        <div class="toolbar">
                            <button data-action="addAllocation" type="button">Add Allocation</button>
                            <button class="secondary" data-action="modifyChoreSlots" type="button">Modify slots</button>
                            <button class="slate" data-action="generateRota" type="button">Generate simple rota</button>
                            <button class="danger" data-action="clearRota" type="button">Clear rota</button>
                        </div>
                        <div class="pill-list">${State.project.choreSessions.map(session => `<span class="pill">${h(session)}</span>`).join("")}</div>
                    </div>
                </section>
            </div>
            <div class="day-grid grass-panel card" style="margin-top:12px">
                ${enumerateDates(State.project.startDate, State.project.endDate).map(date => renderChoreDay(date)).join("")}
            </div>
        `;
    }

    function renderChoreDay(date) {
        return `
            <section class="day-card">
                <h3>${h(displayDate(date, true))}</h3>
                <div class="toolbar" style="padding:10px 10px 0">
                    <button class="small-button secondary" data-action="copyChoreDay" data-date="${attr(date)}" type="button">Copy day</button>
                </div>
                ${State.project.choreSessions.map(session => renderChoreSlot(date, session)).join("")}
            </section>`;
    }

    function renderChoreSlot(date, session) {
        const allocations = State.project.choreAllocations
            .filter(allocation => allocation.date === date && allocation.session === session)
            .sort((a, b) => localeSort(choreName(a.choreItemId), choreName(b.choreItemId)));
        return `
            <div class="slot-card">
                <div class="slot-title">
                    <span>${h(session)}</span>
                    <span>
                        <button class="small-button secondary" data-action="copyChoreSession" data-date="${attr(date)}" data-session="${attr(session)}" type="button">Copy</button>
                        <button class="small-button secondary" data-action="addAllocation" data-date="${attr(date)}" data-session="${attr(session)}" type="button">Add</button>
                    </span>
                </div>
                ${allocations.length ? allocations.map(allocation => `
                    <div class="item-card">
                        <strong>${h(choreName(allocation.choreItemId) || "Unassigned chore")}</strong>
                        <span>${h(choreAllocationAssigneeNames(allocation))}</span>
                        ${allocation.notes ? `<small>${h(allocation.notes)}</small>` : ""}
                        <div class="row-actions">
                            <button class="small-button secondary" data-action="editAllocation" data-id="${attr(allocation.id)}" type="button">Edit</button>
                            <button class="small-button danger" data-action="removeAllocation" data-id="${attr(allocation.id)}" type="button">Remove</button>
                        </div>
                    </div>
                `).join("") : `<div class="empty">No allocations.</div>`}
            </div>`;
    }

    function buildChoreAssignees() {
        return [
            ...State.project.choreTeams.map(team => ({ id: team.id, name: team.name, detail: "Team" })),
            ...State.project.tents.map(tent => ({ id: tent.id, name: tent.name, detail: "Tent" })),
            ...orderedPeople().map(person => ({ id: person.id, name: person.name, detail: personRoleText(person) }))
        ];
    }

    function choreAllocationAssigneeNames(allocation) {
        const names = [
            ...allocation.teamIds.map(teamName),
            ...allocation.tentIds.map(tentName),
            ...allocation.personIds.map(personName)
        ].filter(Boolean);
        if (!names.length && allocation.personId) {
            names.push(personName(allocation.personId));
        }
        return distinct(names).join(", ") || "Unassigned";
    }

    function renderMenu() {
        const tabs = [
            ["planner", "Planner"],
            ["kitchen", "Kitchen"],
            ["public", "Public menu"],
            ["dietary", "Dietary safety"]
        ];
        return `
            ${sectionHeader("Menu", "Build meals across camp dates, keep kitchen detail, and track dietary safety.")}
            <div class="tabs">${tabs.map(([id, label]) => `<button class="${State.menuTab === id ? "active" : ""}" data-action="switchMenuTab" data-tab="${id}" type="button">${h(label)}</button>`).join("")}</div>
            ${State.menuTab === "planner" ? renderMenuPlanner() : ""}
            ${State.menuTab === "kitchen" ? renderMenuKitchen() : ""}
            ${State.menuTab === "public" ? renderPublicMenu() : ""}
            ${State.menuTab === "dietary" ? renderDietarySafety() : ""}
        `;
    }

    function renderMenuPlanner() {
        return `
            <div class="toolbar">
                <button data-action="addMeal" type="button">Add meal</button>
                <button class="secondary" data-action="addMenuDates" type="button">Add missing rows</button>
                <button class="secondary" data-action="defineMenuStartEnd" type="button">Define start/end</button>
                <button class="amber" data-action="openMenuLibrary" type="button">Menu Library</button>
                <button class="secondary" data-action="copyMenuDay" type="button">Copy day</button>
                <button class="slate" data-action="exportMenuPdf" type="button">Menu PDF</button>
                <button class="slate" data-action="exportKitchenMenuPdf" type="button">Kitchen PDF</button>
            </div>
            <div class="day-grid grass-panel card">
                ${enumerateDates(State.project.startDate, State.project.endDate).map(date => renderMenuDay(date)).join("")}
            </div>
        `;
    }

    function renderMenuDay(date) {
        const dayNote = State.project.menuDayNotes.find(note => note.date === date);
        return `
            <section class="day-card">
                <h3>${h(displayDate(date, true))}</h3>
                <div class="toolbar" style="padding:10px 10px 0">
                    <button class="small-button secondary" data-action="editMenuDayNote" data-date="${attr(date)}" type="button">Day note</button>
                    <button class="small-button secondary" data-action="copyMenuDayFrom" data-date="${attr(date)}" type="button">Copy</button>
                </div>
                ${dayNote ? `<div class="card" style="margin:10px">${h(dayNote.notes)}</div>` : ""}
                ${activeMealSlots(State.project, date).map(slot => renderMenuSlot(date, slot)).join("")}
            </section>`;
    }

    function renderMenuSlot(date, slot) {
        const items = State.project.menuItems
            .filter(item => item.date === date && item.slot.toLowerCase() === slot.toLowerCase())
            .sort((a, b) => localeSort(a.meal, b.meal));
        return `
            <div class="slot-card">
                <div class="slot-title">
                    <span>${h(slot)}</span>
                    <span>
                        <button class="small-button secondary" data-action="openMenuLibrary" data-date="${attr(date)}" data-slot="${attr(slot)}" type="button">Library</button>
                        <button class="small-button secondary" data-action="addMeal" data-date="${attr(date)}" data-slot="${attr(slot)}" type="button">Add</button>
                    </span>
                </div>
                ${items.length ? items.map(item => `
                    <div class="item-card">
                        <strong>${h(item.meal || "No food recorded")}</strong>
                        ${item.pudding ? `<span>Pudding: ${h(item.pudding)}</span>` : ""}
                        ${item.dietaryNotes ? `<span class="warning">Dietary: ${h(item.dietaryNotes)}</span>` : ""}
                        ${item.notes ? `<small>${h(item.notes)}</small>` : ""}
                        <div class="row-actions">
                            <button class="small-button secondary" data-action="editMeal" data-id="${attr(item.id)}" type="button">Edit</button>
                            <button class="small-button danger" data-action="removeMeal" data-id="${attr(item.id)}" type="button">Remove</button>
                        </div>
                    </div>
                `).join("") : `<div class="empty">No meals planned yet.</div>`}
            </div>`;
    }

    function renderMenuKitchen() {
        const filter = State.filters.menuKitchen || "";
        const rows = State.project.menuItems
            .filter(item => hasMenuContent(item) && isMenuSlotActive(State.project, item.date, item.slot))
            .filter(item => includesText(filter, displayDate(item.date), item.slot, item.meal, item.pudding, item.dietaryNotes, item.notes))
            .sort((a, b) => parseDate(a.date) - parseDate(b.date) || mealSlotIndex(State.project, a.slot) - mealSlotIndex(State.project, b.slot));
        return `
            <div class="toolbar">
                <input placeholder="Filter menu rows" value="${attr(filter)}" data-filter-live="menuKitchen">
                <button data-action="addMeal" type="button">Add meal</button>
                <button class="secondary" data-action="removeEmptyMenuRows" type="button">Remove empty rows</button>
                <button class="slate" data-action="exportMenuRtf" type="button">Menu RTF</button>
            </div>
            ${rows.length ? `<div class="table-wrap"><table><thead><tr><th>Date</th><th>Slot</th><th>Food</th><th>Pudding</th><th>Dietary notes</th><th>Notes</th><th></th></tr></thead><tbody>${rows.map(item => `
                <tr>
                    <td>${h(displayDate(item.date))}</td>
                    <td>${h(item.slot)}</td>
                    <td><input data-update-kind="meal" data-id="${attr(item.id)}" data-field="meal" value="${attr(item.meal)}"></td>
                    <td><input data-update-kind="meal" data-id="${attr(item.id)}" data-field="pudding" value="${attr(item.pudding)}"></td>
                    <td><input data-update-kind="meal" data-id="${attr(item.id)}" data-field="dietaryNotes" value="${attr(item.dietaryNotes)}"></td>
                    <td><input data-update-kind="meal" data-id="${attr(item.id)}" data-field="notes" value="${attr(item.notes)}"></td>
                    <td><button class="small-button danger" data-action="removeMeal" data-id="${attr(item.id)}" type="button">Remove</button></td>
                </tr>`).join("")}</tbody></table></div>` : `<div class="empty">No meals planned yet. Use Add meal or Add item on the planner.</div>`}
        `;
    }

    function renderPublicMenu() {
        return `
            <div class="toolbar">
                <button class="slate" data-action="exportMenuPdf" type="button">Menu PDF</button>
                <button class="slate" data-action="printPublicMenu" type="button">Android print</button>
            </div>
            <div class="day-grid">
                ${enumerateDates(State.project.startDate, State.project.endDate).map(date => `
                    <section class="day-card">
                        <h3>${h(displayDate(date, true))}</h3>
                        ${activeMealSlots(State.project, date).map(slot => {
                            const items = State.project.menuItems.filter(item => item.date === date && item.slot === slot && hasMenuContent(item));
                            return `<div class="slot-card"><div class="slot-title">${h(slot)}</div>${items.length ? items.map(item => `<div class="item-card"><strong>${h(item.meal || "No food recorded")}</strong>${item.pudding ? `<span>Pudding: ${h(item.pudding)}</span>` : ""}</div>`).join("") : `<div class="empty">Not planned</div>`}</div>`;
                        }).join("")}
                    </section>
                `).join("")}
            </div>`;
    }

    function renderDietarySafety() {
        const warnings = buildMenuWarnings(State.project);
        const people = orderedPeople().filter(person => clean(person.dietaryNotes) || clean(person.medicalNotes));
        return `
            <div class="grid two">
                <section class="panel">
                    <div class="panel-header"><strong>Menu checks</strong></div>
                    <div class="panel-body">${warnings.length ? `<div class="warning-list">${warnings.map(warning => `<div class="warning">${h(warning)}</div>`).join("")}</div>` : `<div class="empty">No menu checks.</div>`}</div>
                </section>
                <section class="panel">
                    <div class="panel-header"><strong>People with dietary notes</strong><button class="small-button secondary" data-action="manageDietaryMedical" type="button">Manage</button></div>
                    <div class="panel-body">${people.length ? `<div class="table-wrap"><table><thead><tr><th>Name</th><th>Dietary notes</th><th>Medical notes</th></tr></thead><tbody>${people.map(person => `<tr><td>${h(person.name)}</td><td>${h(person.dietaryNotes)}</td><td>${h(person.medicalNotes)}</td></tr>`).join("")}</tbody></table></div>` : `<div class="empty">No people have dietary or medical notes.</div>`}</div>
                </section>
            </div>`;
    }

    function renderPlan() {
        return `
            ${sectionHeader("The Plan", "Chronological daily plan with all-camp and concurrent activities.")}
            <div class="toolbar">
                <button data-action="addPlanItem" type="button">Add item</button>
                <button class="teal" data-action="addConcurrentPlanItem" type="button">Add concurrent activity</button>
                <button class="secondary" data-action="copyPlanDay" type="button">Copy plan day</button>
                <button class="slate" data-action="exportPlanPdf" type="button">The Plan PDF</button>
            </div>
            <div class="day-grid">
                ${enumerateDates(State.project.startDate, State.project.endDate).map(date => renderPlanDay(date)).join("")}
            </div>
        `;
    }

    function renderPlanDay(date) {
        const items = State.project.planItems
            .filter(item => item.date === date)
            .sort((a, b) => a.startMinute - b.startMinute || a.endMinute - b.endMinute || localeSort(a.title, b.title));
        return `
            <section class="day-card">
                <h3>${h(displayDate(date, true))}</h3>
                <div class="toolbar" style="padding:10px 10px 0"><button class="small-button secondary" data-action="addPlanItem" data-date="${attr(date)}" type="button">Add</button><button class="small-button secondary" data-action="copyPlanDayFrom" data-date="${attr(date)}" type="button">Copy</button></div>
                <div class="slot-card">
                ${items.length ? items.map(item => `
                    <div class="item-card">
                        <strong>${h(planTime(item.startMinute))}-${h(planTime(item.endMinute))} | ${h(item.title)}</strong>
                        <span>${h(planAudienceText(item))}${item.isConcurrent ? " | Concurrent" : ""}</span>
                        ${item.notes ? `<small>${h(item.notes)}</small>` : ""}
                        <div class="row-actions">
                            <button class="small-button secondary" data-action="editPlanItem" data-id="${attr(item.id)}" type="button">Edit</button>
                            <button class="small-button secondary" data-action="editPlanTime" data-id="${attr(item.id)}" type="button">Edit time</button>
                            ${item.boundaryKind ? "" : `<button class="small-button danger" data-action="removePlanItem" data-id="${attr(item.id)}" type="button">Remove</button>`}
                        </div>
                    </div>
                `).join("") : `<div class="empty">No plan items.</div>`}
                </div>
            </section>`;
    }

    function planAudienceText(item) {
        if (item.isAllCamp) return "All camp";
        const names = [
            ...item.teamIds.map(teamName),
            ...item.tentIds.map(tentName),
            ...item.personIds.map(personName),
            item.audienceLabel
        ].filter(Boolean);
        return distinct(names).join(", ") || "No audience set";
    }

    function renderKit(participant) {
        const items = participant ? participantKit() : groupKit();
        const key = participant ? "participantKit" : "groupKit";
        const filter = State.filters[key] || "";
        const filtered = items
            .filter(item => includesText(filter, item.name, item.status, item.category, item.owner, item.notes))
            .sort((a, b) => localeSort(a.name, b.name));
        const title = participant ? "Kit List (Participant)" : "Kit List (group)";
        return `
            ${sectionHeader(title, participant ? "Personal kit campers should bring." : "Stores and group equipment kit.")}
            <div class="toolbar">
                <input placeholder="${participant ? "Filter participant kit" : "Filter group kit"}" value="${attr(filter)}" data-filter-live="${key}">
                <button data-action="${participant ? "addParticipantKitItem" : "addGroupKitItem"}" type="button">Add item</button>
                <button class="teal" data-action="${participant ? "addStandardParticipantKit" : "addGroupFromInventory"}" type="button">${participant ? "Standard items" : "Add from inventory"}</button>
                <button class="secondary" data-action="${participant ? "manageParticipantInventory" : "manageGroupInventory"}" type="button">${participant ? "Edit standards" : "Edit inventory"}</button>
                ${participant ? "" : `<button class="amber" data-action="kitTemplates" type="button">Templates</button><button class="slate" data-action="moreKitActions" type="button">More kit actions</button>`}
                <button class="slate" data-action="${participant ? "exportParticipantKitPdf" : "exportGroupKitPdf"}" type="button">PDF</button>
            </div>
            ${filtered.length ? kitTable(filtered, participant) : `<div class="empty">${participant ? "No participant kit added yet. Use Add item or Standard items." : "No group kit added yet. Use Add item or Add from inventory."}</div>`}
        `;
    }

    function kitTable(items, participant) {
        return `
            <div class="table-wrap">
                <table>
                    <thead><tr><th>Item</th><th>Qty</th>${participant ? "" : "<th>Status</th>"}<th>Notes</th><th></th></tr></thead>
                    <tbody>
                    ${items.map(item => `
                        <tr>
                            <td><strong>${h(item.name)}</strong>${participant ? "" : `<br><small>${h(item.category || item.owner)}</small>`}</td>
                            <td>${qtyControl(item.id, participant ? "participantKit" : "groupKit", item.quantity)}</td>
                            ${participant ? "" : `<td><select data-update-kind="kit" data-id="${attr(item.id)}" data-field="status">${KIT_STATUSES.map(status => `<option ${item.status === status ? "selected" : ""}>${h(status)}</option>`).join("")}</select></td>`}
                            <td><input data-update-kind="kit" data-id="${attr(item.id)}" data-field="notes" value="${attr(item.notes)}"></td>
                            <td class="row-actions">
                                <button class="small-button secondary" data-action="${participant ? "editParticipantKitItem" : "editGroupKitItem"}" data-id="${attr(item.id)}" type="button">Edit</button>
                                ${participant ? "" : `<button class="small-button secondary" data-action="duplicateGroupKitItem" data-id="${attr(item.id)}" type="button">Duplicate</button>`}
                                <button class="small-button danger" data-action="removeKitItem" data-id="${attr(item.id)}" type="button">Remove</button>
                            </td>
                        </tr>
                    `).join("")}
                    </tbody>
                </table>
            </div>`;
    }

    function qtyControl(id, kind, quantity) {
        return `
            <span class="qty-control">
                <button class="minus" data-action="adjustKitQty" data-id="${attr(id)}" data-delta="-1" type="button">-</button>
                <span class="qty">${h(formatQty(quantity))}</span>
                <button data-action="adjustKitQty" data-id="${attr(id)}" data-delta="1" type="button">+</button>
            </span>`;
    }

    function groupKit() {
        return State.project.kitItems.filter(item => !isParticipantKitItem(item));
    }

    function participantKit() {
        return State.project.kitItems.filter(isParticipantKitItem);
    }

    function formatQty(value) {
        return Number(value).toLocaleString("en-GB", { maximumFractionDigits: 2 });
    }

    function renderShopping() {
        return `
            ${sectionHeader("Shopping List", "Simple buying lists for food and camp supplies.")}
            <div class="toolbar">
                <button data-action="addShoppingList" type="button">Add List</button>
                <button class="slate" data-action="exportShoppingPdf" type="button">Shopping lists PDF</button>
                <button class="secondary" data-action="exportShoppingRtf" type="button">Shopping lists RTF</button>
            </div>
            <div class="day-grid">
                ${State.project.shoppingLists.map(listItem => renderShoppingListCard(listItem)).join("") || `<div class="empty">No shopping lists yet. Add a list to start.</div>`}
            </div>
        `;
    }

    function renderShoppingListCard(listItem) {
        return `
            <section class="day-card">
                <h3>${h(listItem.name)}</h3>
                <div class="toolbar" style="padding:10px 10px 0">
                    <button class="small-button secondary" data-action="addShoppingItem" data-id="${attr(listItem.id)}" type="button">Add item</button>
                    <button class="small-button secondary" data-action="renameShoppingList" data-id="${attr(listItem.id)}" type="button">Rename</button>
                    <button class="small-button danger" data-action="removeShoppingList" data-id="${attr(listItem.id)}" type="button">Remove list</button>
                </div>
                <div class="slot-card">
                    ${listItem.items.length ? listItem.items.map(item => `
                        <div class="item-card">
                            <input data-update-kind="shopping" data-list-id="${attr(listItem.id)}" data-id="${attr(item.id)}" data-field="name" value="${attr(item.name)}" placeholder="Item">
                            ${qtyControl(item.id, "shopping", item.quantity)}
                            <button class="small-button danger" data-action="removeShoppingItem" data-list-id="${attr(listItem.id)}" data-id="${attr(item.id)}" type="button">Remove</button>
                        </div>
                    `).join("") : `<div class="empty">No items.</div>`}
                </div>
            </section>`;
    }

    function renderExports() {
        const sectionRows = [...SECTIONS].map(section => `
            <div class="card">
                <strong>${h(section.title)}</strong>
                <div class="row-actions" style="margin-top:8px">
                    <button class="small-button secondary" data-action="saveSection" data-section="${attr(section.id)}" type="button">Save</button>
                    <button class="small-button secondary" data-action="importSection" data-section="${attr(section.id)}" type="button">Import</button>
                </div>
            </div>`).join("");
        return `
            ${sectionHeader("Exports", "Create PDFs, CSV data, RTF files, and section files without replacing unrelated camp data.")}
            <div class="grid two">
                <section class="panel">
                    <div class="panel-header"><strong>Complete camp pack</strong></div>
                    <div class="panel-body">
                        <p>One PDF for the whole camp, including overview, personnel, tent allocation, plan, menu, kit, shopping and chores.</p>
                        <button data-action="exportCampPackPdf" type="button">Export camp pack PDF</button>
                    </div>
                </section>
                <section class="panel">
                    <div class="panel-header"><strong>Data export</strong></div>
                    <div class="panel-body">
                        <p>Creates a ZIP containing people-and-tents.csv, menu.csv, kit-list.csv, and chores.csv.</p>
                        <button class="teal" data-action="exportCsvZip" type="button">Export CSV ZIP</button>
                    </div>
                </section>
                <section class="panel">
                    <div class="panel-header"><strong>Planning PDFs</strong></div>
                    <div class="panel-body row-actions">
                        <button data-action="exportMenuPdf" type="button">Menu PDF</button>
                        <button data-action="exportKitchenMenuPdf" type="button">Kitchen menu PDF</button>
                        <button data-action="exportMenuRtf" type="button">Menu RTF</button>
                        <button data-action="exportPlanPdf" type="button">The Plan PDF</button>
                        <button data-action="exportChoresPdf" type="button">Chores PDF</button>
                        <button data-action="exportShoppingPdf" type="button">Shopping lists PDF</button>
                        <button data-action="exportShoppingRtf" type="button">Shopping lists RTF</button>
                    </div>
                </section>
                <section class="panel">
                    <div class="panel-header"><strong>Kit list PDFs</strong></div>
                    <div class="panel-body row-actions">
                        <button data-action="exportKitPdf" type="button">All kit PDF</button>
                        <button data-action="exportGroupKitPdf" type="button">Group kit PDF</button>
                        <button data-action="exportParticipantKitPdf" type="button">Participant kit PDF</button>
                    </div>
                </section>
                <section class="panel">
                    <div class="panel-header"><strong>Tent allocation</strong></div>
                    <div class="panel-body row-actions">
                        <button data-action="exportTentTablePdf" type="button">Tent table PDF</button>
                        <button data-action="exportTentTagsPdf" type="button">Tent tags PDF</button>
                        <button data-action="exportTentLayoutPdf" type="button">Tent layout PDF</button>
                        <button data-action="makeTentTable" type="button">Preview table</button>
                    </div>
                </section>
                <section class="panel">
                    <div class="panel-header"><strong>Section data files</strong></div>
                    <div class="panel-body grid two">${sectionRows}</div>
                </section>
            </div>
        `;
    }

    async function runAction(action, data = {}) {
        const map = {
            switchSection: () => switchSection(data.section),
            switchMenuTab: () => { State.menuTab = data.tab; renderMain(); },
            newProject,
            openProject,
            saveProject,
            saveAsProject: saveProject,
            importLegacy,
            importOsm: importLegacy,
            exitApp,
            undo,
            redo,
            addPerson: () => editPerson(),
            editPerson: () => editPerson(data.id),
            removePerson: () => removePerson(data.id),
            assignPerson: () => assignPerson(data.id),
            assignPersonToTent: () => assignPersonToTent(data.id),
            bulkAddPeople,
            importPeopleCsv,
            downloadPeopleSampleCsv,
            addTeam: () => editTeam(),
            editTeam: () => editTeam(data.id),
            removeTeam: () => removeTeam(data.id),
            manageTeamMembers: () => manageTeamMembers(data.id),
            bulkAddTeams,
            addTent: () => editTent(),
            openTentActions: () => openTentActions(data.id),
            editTent: () => editTent(data.id),
            duplicateTent: () => duplicateTent(data.id),
            removeTent: () => removeTent(data.id),
            assignTentMembers: () => assignTentMembers(data.id),
            addSiteItem: () => editSiteItem(),
            openSiteActions: () => openSiteActions(data.id),
            editSiteItem: () => editSiteItem(data.id),
            removeSiteItem: () => removeSiteItem(data.id),
            manageLinks,
            clearTentAllocations,
            arrangeTents,
            makeTentTable,
            addChoreItem: () => editChoreItem(),
            editChoreItem: () => editChoreItem(data.id),
            removeChoreItem: () => removeChoreItem(data.id),
            bulkAddChoreItems,
            pickStandardChores,
            modifyChoreSlots,
            generateRota,
            clearRota,
            addAllocation: () => editAllocation(null, data.date, data.session),
            editAllocation: () => editAllocation(data.id),
            removeAllocation: () => removeAllocation(data.id),
            copyChoreDay: () => copyChoreDay(data.date),
            copyChoreDayFrom: () => copyChoreDay(data.date),
            copyChoreSession: () => copyChoreSession(data.date, data.session),
            addMeal: () => editMeal(null, data.date, data.slot),
            editMeal: () => editMeal(data.id),
            removeMeal: () => removeMeal(data.id),
            addMenuDates,
            defineMenuStartEnd,
            modifyMenuSlots,
            openMenuLibrary: () => openMenuLibrary(data.date, data.slot),
            copyMenuDay: () => copyMenuDay(),
            copyMenuDayFrom: () => copyMenuDay(data.date),
            editMenuDayNote: () => editMenuDayNote(data.date),
            removeEmptyMenuRows,
            manageDietaryMedical,
            printPublicMenu: () => printHtml("Public menu", buildPublicMenuHtml()),
            addPlanItem: () => editPlanItem(null, data.date),
            addConcurrentPlanItem: () => editPlanItem(null, data.date, true),
            editPlanItem: () => editPlanItem(data.id),
            editPlanTime: () => editPlanTime(data.id),
            removePlanItem: () => removePlanItem(data.id),
            copyPlanDay: () => copyPlanDay(),
            copyPlanDayFrom: () => copyPlanDay(data.date),
            addGroupKitItem: () => editKitItem(false),
            editGroupKitItem: () => editKitItem(false, data.id),
            duplicateGroupKitItem: () => duplicateGroupKitItem(data.id),
            addGroupFromInventory,
            manageGroupInventory: () => manageKitInventory(false),
            kitTemplates,
            moreKitActions,
            addParticipantKitItem: () => editKitItem(true),
            editParticipantKitItem: () => editKitItem(true, data.id),
            addStandardParticipantKit,
            manageParticipantInventory: () => manageKitInventory(true),
            removeKitItem: () => removeKitItem(data.id),
            adjustKitQty: () => adjustKitQty(data.id, number(data.delta, 0)),
            addShoppingList,
            renameShoppingList: () => renameShoppingList(data.id),
            removeShoppingList: () => removeShoppingList(data.id),
            addShoppingItem: () => addShoppingItem(data.id),
            removeShoppingItem: () => removeShoppingItem(data.listId, data.id),
            exportCampPackPdf,
            exportMenuPdf,
            exportKitchenMenuPdf,
            exportMenuRtf,
            exportKitPdf,
            exportGroupKitPdf,
            exportParticipantKitPdf,
            exportChoresPdf,
            exportPlanPdf,
            exportShoppingPdf,
            exportShoppingRtf,
            exportTentTablePdf,
            exportTentTagsPdf,
            exportTentLayoutPdf,
            exportCsvZip,
            saveCurrentSection: () => saveSection(State.currentSection),
            saveSection: () => saveSection(data.section),
            importSection: () => importSection(data.section),
            hostCollaboration,
            joinCollaboration,
            leaveCollaboration,
            about,
            setLanguage: () => setLanguage(data.language)
        };
        if (!map[action]) {
            throw new Error(`Action is not implemented: ${action}`);
        }
        await map[action]();
    }

    function switchSection(section) {
        if (!SECTION_TITLES[section]) return;
        State.currentSection = section;
        $("#sideNav").classList.remove("open");
        render();
        $("#mainContent").focus();
    }

    function showMenu(menu) {
        let commands = [];
        if (menu === "file") {
            commands = [
                ["New", "newProject"],
                ["Open...", "openProject"],
                ["Save", "saveProject"],
                ["Save As...", "saveAsProject"],
                ["Host collaboration...", "hostCollaboration"],
                ["Join collaboration...", "joinCollaboration"],
                ["Leave collaboration", "leaveCollaboration"],
                ["Import legacy file...", "importLegacy"],
                ["Import OSM Export...", "importOsm"],
                ["Exit", "exitApp"]
            ];
        } else if (menu === "edit") {
            commands = [
                ["Undo", "undo"],
                ["Redo", "redo"],
                ...sectionCommands(State.currentSection).map(command => [command.label, command.action])
            ];
        } else if (menu === "section") {
            commands = sectionCommands(State.currentSection).map(command => [command.label, command.action]);
        } else if (menu === "export") {
            commands = [
                ["Export camp pack PDF", "exportCampPackPdf"],
                ["Export CSV ZIP", "exportCsvZip"],
                ["Menu PDF", "exportMenuPdf"],
                ["Kitchen menu PDF", "exportKitchenMenuPdf"],
                ["Menu RTF", "exportMenuRtf"],
                ["All kit PDF", "exportKitPdf"],
                ["Group kit PDF", "exportGroupKitPdf"],
                ["Participant kit PDF", "exportParticipantKitPdf"],
                ["Chores PDF", "exportChoresPdf"],
                ["The Plan PDF", "exportPlanPdf"],
                ["Shopping lists PDF", "exportShoppingPdf"],
                ["Shopping lists RTF", "exportShoppingRtf"],
                ["Tent table PDF", "exportTentTablePdf"],
                ["Tent tags PDF", "exportTentTagsPdf"],
                ["Tent layout PDF", "exportTentLayoutPdf"],
                ["Preview tent table", "makeTentTable"]
            ];
        } else if (menu === "help") {
            commands = [
                ["Language: English", "setLanguage", { language: TERMS.languageEnglish }],
                ["Language: Spanish", "setLanguage", { language: TERMS.languageSpanish }],
                ["Language: French", "setLanguage", { language: TERMS.languageFrench }],
                ["About", "about"]
            ];
        }
        const body = document.createElement("div");
        body.className = "grid";
        body.innerHTML = commands.map(([label, action, extra]) => `<button data-action="${attr(action)}" ${extra ? Object.entries(extra).map(([key, value]) => `data-${key}="${attr(value)}"`).join(" ") : ""} type="button">${h(label)}</button>`).join("");
        showModal(menu === "section" ? SECTION_TITLES[State.currentSection] : menu[0].toUpperCase() + menu.slice(1), body, [{ label: "Close", value: "close", className: "secondary" }]);
    }

    function updateProjectField(field, value) {
        mutate("Updated camp details.", () => {
            if (field === "participantCountOverride") {
                State.project[field] = Math.max(0, number(value, 0));
            } else if (field === "startDate" || field === "endDate") {
                State.project[field] = isoDate(value);
            } else {
                State.project[field] = value;
            }
        });
    }

    function updateInline(target) {
        const kind = target.dataset.updateKind;
        const id = target.dataset.id;
        const field = target.dataset.field;
        mutate("Updated item.", () => {
            if (kind === "meal") {
                const item = State.project.menuItems.find(row => row.id === id);
                if (item) item[field] = target.value;
            } else if (kind === "kit") {
                const item = State.project.kitItems.find(row => row.id === id);
                if (item) item[field] = target.value;
            } else if (kind === "shopping") {
                const listItem = State.project.shoppingLists.find(row => row.id === target.dataset.listId);
                const item = listItem?.items.find(row => row.id === id);
                if (item) {
                    item[field] = field === "quantity" ? number(target.value, item.quantity) : target.value;
                }
            }
        });
    }

    async function newProject() {
        if (!(await confirmDiscardIfNeeded())) return;
        State.undo = [];
        State.redo = [];
        State.project = normalizeProject(createProject());
        State.fileName = "camp.scoutcamp";
        State.dirty = false;
        saveDraft();
        render();
        setStatus("Created a new camp project.");
    }

    async function openProject() {
        if (!(await confirmDiscardIfNeeded())) return;
        const file = await requestFile();
        const project = JSON.parse(file.text);
        if (!project || !Array.isArray(project.people)) {
            throw new Error("The selected file does not contain a Scout camp project.");
        }
        State.project = normalizeProject(project);
        State.fileName = file.name || `${safeFileName(State.project.campName)}.scoutcamp`;
        State.dirty = false;
        State.undo = [];
        State.redo = [];
        saveDraft();
        render();
        setStatus(`Opened ${State.fileName}.`);
    }

    async function saveProject() {
        normalizeProject(State.project);
        State.project.lastModified = new Date().toISOString();
        const fileName = State.fileName && State.fileName.endsWith(".scoutcamp") ? State.fileName : `${safeFileName(State.project.campName)}.scoutcamp`;
        await saveTextFile(fileName, "application/json", JSON.stringify(State.project, null, 2));
        State.fileName = fileName;
        State.dirty = false;
        saveDraft();
        renderShell();
    }

    async function importLegacy() {
        const file = await requestFile();
        let imported = 0;
        mutate(`Imported ${file.name}.`, () => {
            imported = importLegacyContent(file.name, file.text, State.project);
        });
        setStatus(`Imported ${imported} item${imported === 1 ? "" : "s"} from ${file.name}.`);
    }

    async function exitApp() {
        if (State.dirty) {
            await alertBox("Unsaved changes", "This camp has changes that have not been saved yet. Use Save before closing the app.");
        } else {
            await alertBox("Ready to close", "Use the Android back button or app switcher to close Camp Planner.");
        }
    }

    function undo() {
        if (!State.undo.length) {
            setStatus("Nothing to undo.");
            return;
        }
        State.redo.push(snapshot());
        restoreSnapshot(State.undo.pop());
        State.dirty = true;
        setStatus("Undo.");
    }

    function redo() {
        if (!State.redo.length) {
            setStatus("Nothing to redo.");
            return;
        }
        State.undo.push(snapshot());
        restoreSnapshot(State.redo.pop());
        State.dirty = true;
        setStatus("Redo.");
    }

    async function confirmDiscardIfNeeded() {
        if (!State.dirty) return true;
        return confirmBox("Unsaved changes", "This camp has changes that have not been saved yet. Continue without saving?");
    }

    async function editPerson(id) {
        const existing = State.project.people.find(item => item.id === id);
        const initial = existing ? { ...existing } : person();
        const selectedTeams = new Set(existing ? teamsForPerson(existing.id).map(team => team.id) : []);
        const result = await promptFields(existing ? "Edit person" : "Add person", [
            { name: "name", label: "Name", value: initial.name, required: true },
            { name: "gender", label: "Gender", type: "select", options: GENDERS, value: initial.gender },
            { name: "personType", label: "Person Type", type: "select", options: PERSON_TYPE_LABELS, value: personTypeDisplay(initial) },
            { name: "camperType", label: "Camper Type", type: "select", options: CAMPER_TYPES, value: initial.camperType },
            { name: "isDayVisitor", label: "Day visitor", type: "checkbox", value: initial.isDayVisitor },
            { name: "dietaryNotes", label: "Food allergies / dietary notes", type: "textarea", value: initial.dietaryNotes, full: true },
            { name: "medicalNotes", label: "Medical / medication notes", type: "textarea", value: initial.medicalNotes, full: true },
            { name: "notes", label: "Notes", type: "textarea", value: initial.notes, full: true },
            { name: "teamIds", label: "Teams", type: "multi", options: State.project.choreTeams.map(team => ({ value: team.id, label: team.name, checked: selectedTeams.has(team.id) })), full: true }
        ], { wide: true });
        if (!result) return;
        if (!clean(result.name)) {
            throw new Error("Enter a name.");
        }
        mutate(existing ? `Updated ${result.name}.` : `Added ${result.name}.`, () => {
            const target = existing || person();
            Object.assign(target, {
                name: result.name,
                gender: result.gender,
                personType: personTypeFromDisplay(result.personType),
                camperType: result.camperType,
                isDayVisitor: Boolean(result.isDayVisitor),
                dietaryNotes: result.dietaryNotes,
                medicalNotes: result.medicalNotes,
                notes: result.notes
            });
            if (!existing) State.project.people.push(target);
            State.project.choreTeams.forEach(team => {
                team.personIds = team.personIds.filter(personId => personId !== target.id);
                if (result.teamIds.includes(team.id)) {
                    team.personIds.push(target.id);
                }
            });
        });
    }

    async function bulkAddPeople() {
        const result = await promptFields("Bulk add people", [
            { name: "people", label: "One person per line. CSV rows with headers are also accepted.", type: "textarea", full: true, value: "" }
        ], { wide: true, okText: "Add People" });
        if (!result || !clean(result.people)) return;
        let count = 0;
        mutate("Added people.", () => {
            count = addPeopleFromText(result.people);
        });
        setStatus(`Added ${count} people.`);
    }

    function addPeopleFromText(text) {
        const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
        if (!lines.length) return 0;
        const rows = parseCsv(lines);
        if (rows.length && Object.keys(rows[0]).some(key => ["name", "firstname", "lastname", "first", "last"].includes(normalizeHeader(key)))) {
            return addPeopleFromCsvRows(rows);
        }
        let count = 0;
        lines.slice(0, 1000).forEach(line => {
            const name = line.split(",")[0].trim();
            if (name) {
                State.project.people.push(person({ name }));
                count++;
            }
        });
        return count;
    }

    async function importPeopleCsv() {
        const file = await requestFile();
        const rows = parseCsv(file.text.split(/\r?\n/));
        let count = 0;
        mutate("Imported people CSV.", () => {
            count = addPeopleFromCsvRows(rows);
        });
        setStatus(`Imported ${count} people.`);
    }

    function addPeopleFromCsvRows(rows) {
        let count = 0;
        rows.forEach(row => {
            const first = firstCsvValue(row, "first name", "firstname", "first", "forename");
            const last = firstCsvValue(row, "last name", "lastname", "last", "surname");
            const name = clean(firstCsvValue(row, "name", "person", "full name") || [first, last].filter(Boolean).join(" "));
            if (!name) return;
            State.project.people.push(person({
                name,
                gender: mapGender(firstCsvValue(row, "gender", "sex")),
                personType: mapPersonType(firstCsvValue(row, "type", "person type", "role")),
                camperType: mapCamperType(firstCsvValue(row, "camper type", "section", "age group")),
                isDayVisitor: parseBool(firstCsvValue(row, "day visitor", "dayvisitor", "visitor")),
                dietaryNotes: firstCsvValue(row, "dietary notes", "dietary", "allergies", "food allergies"),
                medicalNotes: firstCsvValue(row, "medical notes", "medical", "medication"),
                notes: firstCsvValue(row, "notes", "note")
            }));
            count++;
        });
        return count;
    }

    async function downloadPeopleSampleCsv() {
        const rows = [
            "Name,Type,Camper type,Day visitor,Gender,Dietary notes,Medical notes,Notes",
            "Alex Green,Camper,Cub,No,Other,Vegetarian,Inhaler,",
            "Sam Brown,Adult,Standard,No,Male,,,Leader"
        ].join("\n");
        await saveTextFile("sample-people.csv", "text/csv", rows);
    }

    async function editTeam(id) {
        const existing = State.project.choreTeams.find(item => item.id === id);
        const initial = existing ? { ...existing } : choreTeam();
        const result = await promptFields(existing ? "Edit team" : "Add team", [
            { name: "name", label: "Team", value: initial.name, required: true },
            { name: "teamType", label: "Type", value: initial.teamType },
            { name: "colour", label: "Colour", type: "color", value: initial.colour },
            { name: "notes", label: "Notes", type: "textarea", value: initial.notes, full: true }
        ]);
        if (!result) return;
        mutate(existing ? "Updated team." : "Added team.", () => {
            const target = existing || choreTeam();
            Object.assign(target, result);
            if (!existing) State.project.choreTeams.push(target);
        });
    }

    async function manageTeamMembers(id) {
        const team = State.project.choreTeams.find(item => item.id === id);
        if (!team) return;
        const selected = new Set(team.personIds);
        const result = await promptFields(`Members: ${team.name}`, [
            { name: "personIds", label: "People", type: "multi", options: orderedPeople().map(person => ({ value: person.id, label: person.name, checked: selected.has(person.id) })), full: true }
        ], { okText: "Apply" });
        if (!result) return;
        mutate("Updated team members.", () => {
            team.personIds = result.personIds;
        });
    }

    async function bulkAddTeams() {
        const result = await promptFields("Bulk add teams", [
            { name: "teams", label: "One team per line", type: "textarea", full: true }
        ]);
        if (!result) return;
        let count = 0;
        mutate("Added teams.", () => {
            result.teams.split(/\r?\n/).map(clean).filter(Boolean).forEach(name => {
                State.project.choreTeams.push(choreTeam({ name }));
                count++;
            });
        });
        setStatus(`Added ${count} teams.`);
    }

    async function removePerson(id) {
        const target = State.project.people.find(person => person.id === id);
        if (!target || !(await confirmBox("Remove person", `Remove ${target.name} and their references?`))) return;
        mutate(`Removed ${target.name}.`, () => {
            State.project.people = State.project.people.filter(person => person.id !== id);
            removePersonReferences(id);
        });
    }

    async function removeTeam(id) {
        const team = State.project.choreTeams.find(item => item.id === id);
        if (!team || !(await confirmBox("Remove team", `Remove ${team.name}?`))) return;
        mutate("Removed team.", () => {
            State.project.choreTeams = State.project.choreTeams.filter(item => item.id !== id);
            State.project.choreAllocations.forEach(allocation => allocation.teamIds = allocation.teamIds.filter(teamId => teamId !== id));
            State.project.planItems.forEach(item => item.teamIds = item.teamIds.filter(teamId => teamId !== id));
        });
    }

    function removePersonReferences(id) {
        State.project.choreTeams.forEach(team => team.personIds = team.personIds.filter(personId => personId !== id));
        State.project.friendLinks = State.project.friendLinks.filter(link => link.personAId !== id && link.personBId !== id);
        State.project.foeLinks = State.project.foeLinks.filter(link => link.personAId !== id && link.personBId !== id);
        State.project.choreAllocations.forEach(allocation => {
            allocation.personIds = allocation.personIds.filter(personId => personId !== id);
            if (allocation.personId === id) allocation.personId = "";
        });
        State.project.planItems.forEach(item => item.personIds = item.personIds.filter(personId => personId !== id));
    }

    async function assignPerson(id) {
        const personItem = State.project.people.find(person => person.id === id);
        if (!personItem) return;
        const selectedTeams = new Set(teamsForPerson(id).map(team => team.id));
        const result = await promptFields(`Assign ${personItem.name}`, [
            { name: "tentId", label: "Tent", type: "select", options: ["", ...State.project.tents.map(tent => tent.id)], labels: { "": "Unallocated", ...Object.fromEntries(State.project.tents.map(tent => [tent.id, tent.name])) }, value: personItem.tentId || "" },
            { name: "teamIds", label: "Teams", type: "multi", options: State.project.choreTeams.map(team => ({ value: team.id, label: team.name, checked: selectedTeams.has(team.id) })), full: true }
        ]);
        if (!result) return;
        mutate("Assigned person.", () => {
            personItem.tentId = result.tentId || null;
            State.project.choreTeams.forEach(team => {
                team.personIds = team.personIds.filter(personId => personId !== id);
                if (result.teamIds.includes(team.id)) team.personIds.push(id);
            });
        });
    }

    async function assignPersonToTent(id) {
        const personItem = State.project.people.find(person => person.id === id);
        if (!personItem) return;
        const result = await promptFields(`Tent for ${personItem.name}`, [
            { name: "tentId", label: "Tent", type: "select", options: State.project.tents.map(tent => tent.id), labels: Object.fromEntries(State.project.tents.map(tent => [tent.id, tent.name])), value: personItem.tentId || State.project.tents[0]?.id || "" }
        ]);
        if (!result) return;
        mutate("Assigned tent.", () => {
            personItem.tentId = result.tentId || null;
        });
    }

    async function editTent(id) {
        const existing = State.project.tents.find(item => item.id === id);
        const initial = existing ? { ...existing } : tent({ x: 40 + State.project.tents.length * 30, y: 50 + State.project.tents.length * 30 });
        const result = await promptFields(existing ? "Edit tent" : "Add Tent", [
            { name: "name", label: "Name", value: initial.name, required: true },
            { name: "type", label: "Type", type: "select", options: TENT_TYPES, value: initial.type },
            { name: "accommodationType", label: "Accommodation type", type: "select", options: ACCOMMODATION_TYPES, value: initial.accommodationType },
            { name: "capacity", label: "Capacity", type: "number", value: initial.capacity },
            { name: "colour", label: "Colour", type: "color", value: initial.colour },
            { name: "sizeScale", label: "Size scale", type: "number", step: "0.1", value: initial.sizeScale },
            { name: "notes", label: "Notes", type: "textarea", value: initial.notes, full: true }
        ]);
        if (!result) return;
        mutate(existing ? "Updated tent." : "Added tent.", () => {
            const target = existing || tent(initial);
            Object.assign(target, {
                name: result.name,
                type: result.type,
                accommodationType: result.accommodationType,
                capacity: number(result.capacity, 4),
                colour: result.colour,
                sizeScale: number(result.sizeScale, 1),
                notes: result.notes
            });
            if (!existing) State.project.tents.push(target);
        });
    }

    async function openTentActions(id) {
        const target = State.project.tents.find(item => item.id === id);
        if (!target) return;
        const members = State.project.people.filter(person => person.tentId === id);
        const body = document.createElement("div");
        body.innerHTML = `<p class="meta">${h(target.accommodationType)} | ${members.length}/${target.capacity} people</p>`;
        const action = await showModal(target.name, body, [
            { label: "Edit", value: "edit" },
            { label: "Assign people", value: "assign", className: "secondary" },
            { label: "Duplicate", value: "duplicate", className: "secondary" },
            { label: "Remove", value: "remove", className: "danger" },
            { label: "Cancel", value: "cancel", className: "secondary" }
        ]);
        if (action === "edit") {
            await editTent(id);
        } else if (action === "assign") {
            await assignTentMembers(id);
        } else if (action === "duplicate") {
            duplicateTent(id);
        } else if (action === "remove") {
            await removeTent(id);
        }
    }

    function duplicateTent(id) {
        const source = State.project.tents.find(item => item.id === id);
        if (!source) return;
        mutate("Duplicated tent.", () => {
            State.project.tents.push(tent({ ...source, id: uid(), name: uniqueTentName(`${source.name} copy`), x: source.x + 24, y: source.y + 24 }));
        });
    }

    async function removeTent(id) {
        const target = State.project.tents.find(item => item.id === id);
        if (!target || !(await confirmBox("Remove tent", `Remove ${target.name} and clear its assignments?`))) return;
        mutate("Removed tent.", () => {
            State.project.tents = State.project.tents.filter(item => item.id !== id);
            State.project.people.forEach(person => { if (person.tentId === id) person.tentId = null; });
            State.project.choreAllocations.forEach(allocation => allocation.tentIds = allocation.tentIds.filter(tentId => tentId !== id));
            State.project.planItems.forEach(item => item.tentIds = item.tentIds.filter(tentId => tentId !== id));
        });
    }

    async function assignTentMembers(id) {
        const target = State.project.tents.find(item => item.id === id);
        if (!target) return;
        const selected = new Set(State.project.people.filter(person => person.tentId === id).map(person => person.id));
        const result = await promptFields(`Members: ${target.name}`, [
            { name: "personIds", label: "People", type: "multi", options: orderedPeople().map(person => ({ value: person.id, label: `${person.name} (${personRoleText(person)})`, checked: selected.has(person.id) })), full: true }
        ], { okText: "Apply" });
        if (!result) return;
        const selectedIds = new Set(result.personIds);
        mutate("Updated tent members.", () => {
            State.project.people.forEach(person => {
                if (selectedIds.has(person.id)) {
                    person.tentId = id;
                } else if (person.tentId === id) {
                    person.tentId = null;
                }
            });
        });
    }

    async function openSiteActions(id) {
        const target = State.project.siteItems.find(item => item.id === id);
        if (!target) return;
        const body = document.createElement("div");
        body.innerHTML = `<p class="meta">${h(target.type)}</p>`;
        const action = await showModal(target.name, body, [
            { label: "Edit", value: "edit" },
            { label: "Remove", value: "remove", className: "danger" },
            { label: "Cancel", value: "cancel", className: "secondary" }
        ]);
        if (action === "edit") {
            await editSiteItem(id);
        } else if (action === "remove") {
            await removeSiteItem(id);
        }
    }

    async function editSiteItem(id) {
        const existing = State.project.siteItems.find(item => item.id === id);
        const initial = existing ? { ...existing } : siteItem({ x: 80 + State.project.siteItems.length * 30, y: 310 });
        const result = await promptFields(existing ? "Edit site item" : "Add Site Item", [
            { name: "name", label: "Name", value: initial.name, required: true },
            { name: "type", label: "Type", type: "select", options: SITE_ITEM_TYPES, value: initial.type },
            { name: "colour", label: "Colour", type: "color", value: initial.colour },
            { name: "sizeScale", label: "Size scale", type: "number", step: "0.1", value: initial.sizeScale },
            { name: "notes", label: "Notes", type: "textarea", value: initial.notes, full: true }
        ]);
        if (!result) return;
        mutate(existing ? "Updated site item." : "Added site item.", () => {
            const target = existing || siteItem(initial);
            Object.assign(target, result, { sizeScale: number(result.sizeScale, 1) });
            if (!existing) State.project.siteItems.push(target);
        });
    }

    async function removeSiteItem(id) {
        const target = State.project.siteItems.find(item => item.id === id);
        if (!target || !(await confirmBox("Remove site item", `Remove ${target.name}?`))) return;
        mutate("Removed site item.", () => {
            State.project.siteItems = State.project.siteItems.filter(item => item.id !== id);
        });
    }

    async function manageLinks() {
        const linkRows = collection => collection.map(link => `${personName(link.personAId)} - ${personName(link.personBId)}${link.notes ? " | " + link.notes : ""}`);
        const body = document.createElement("div");
        body.className = "grid two";
        body.innerHTML = `
            <section class="card"><h3>Friend links</h3>${linkRows(State.project.friendLinks).map(row => `<div class="pill">${h(row)}</div>`).join("") || `<div class="empty">No friend links.</div>`}<div class="toolbar"><button data-local-action="addFriendLink" type="button">Add link</button><button class="danger" data-local-action="removeFriendLink" type="button">Remove link</button></div></section>
            <section class="card"><h3>Foe links</h3>${linkRows(State.project.foeLinks).map(row => `<div class="pill">${h(row)}</div>`).join("") || `<div class="empty">No foe links.</div>`}<div class="toolbar"><button data-local-action="addFoeLink" type="button">Add link</button><button class="danger" data-local-action="removeFoeLink" type="button">Remove link</button></div></section>
        `;
        showModal("Friend & Foe Links", body, [{ label: "Close", value: "close", className: "secondary" }], { wide: true });
        body.querySelector("[data-local-action='addFriendLink']").addEventListener("click", () => addPersonLink(State.project.friendLinks, "Friend link"));
        body.querySelector("[data-local-action='addFoeLink']").addEventListener("click", () => addPersonLink(State.project.foeLinks, "Foe link"));
        body.querySelector("[data-local-action='removeFriendLink']").addEventListener("click", () => removePersonLink(State.project.friendLinks, "friend"));
        body.querySelector("[data-local-action='removeFoeLink']").addEventListener("click", () => removePersonLink(State.project.foeLinks, "foe"));
    }

    async function addPersonLink(collection, title) {
        const people = orderedPeople();
        const labels = Object.fromEntries(people.map(person => [person.id, person.name]));
        const result = await promptFields(title, [
            { name: "personAId", label: "Person A", type: "select", options: people.map(person => person.id), labels },
            { name: "personBId", label: "Person B", type: "select", options: people.map(person => person.id), labels },
            { name: "notes", label: "Notes", type: "textarea", full: true }
        ]);
        if (!result || result.personAId === result.personBId) return;
        mutate(`Added ${title}.`, () => {
            collection.push({ id: uid(), personAId: result.personAId, personBId: result.personBId, notes: result.notes });
        });
        closeModal();
    }

    async function removePersonLink(collection, label) {
        if (!collection.length) return;
        const options = collection.map(link => link.id);
        const labels = Object.fromEntries(collection.map(link => [link.id, `${personName(link.personAId)} - ${personName(link.personBId)}`]));
        const result = await promptFields(`Remove ${label} link`, [
            { name: "id", label: "Link", type: "select", options, labels }
        ]);
        if (!result) return;
        mutate(`Removed ${label} link.`, () => {
            const index = collection.findIndex(link => link.id === result.id);
            if (index >= 0) collection.splice(index, 1);
        });
        closeModal();
    }

    async function clearTentAllocations() {
        if (!(await confirmBox("Clear allocations", "Remove all people from tents?"))) return;
        mutate("Cleared tent allocations.", () => {
            State.project.people.forEach(person => person.tentId = null);
        });
    }

    function arrangeTents() {
        mutate("Arranged tents and site items.", () => {
            State.project.tents.forEach((tent, index) => {
                tent.x = 32 + (index % 3) * 210;
                tent.y = 32 + Math.floor(index / 3) * 150;
            });
            State.project.siteItems.forEach((item, index) => {
                item.x = 32 + (index % 3) * 190;
                item.y = 360 + Math.floor(index / 3) * 110;
            });
        });
    }

    function uniqueTentName(base) {
        const names = new Set(State.project.tents.map(item => item.name.toLowerCase()));
        let candidate = base;
        let suffix = 2;
        while (names.has(candidate.toLowerCase())) {
            candidate = `${base} ${suffix++}`;
        }
        return candidate;
    }

    async function makeTentTable() {
        const warnings = buildTentWarnings(State.project);
        const body = document.createElement("div");
        body.innerHTML = `<div class="table-wrap">${tentTableHtml(warnings)}</div>`;
        showModal("Tent allocation table", body, [
            { label: "Table PDF", value: "pdf" },
            { label: "Close", value: "close", className: "secondary" }
        ], { wide: true }).then(value => {
            if (value === "pdf") exportTentTablePdf();
        });
    }

    function tentTableHtml(warnings = buildTentWarnings(State.project)) {
        return `<table><thead><tr><th>Tent</th><th>Type</th><th>Capacity</th><th>People</th><th>Warnings</th></tr></thead><tbody>${State.project.tents.map(tent => {
            const members = orderedPeople().filter(person => person.tentId === tent.id);
            const tentWarnings = warnings.filter(warning => warning.toLowerCase().includes(tent.name.toLowerCase()));
            return `<tr><td>${h(tent.name)}</td><td>${h(tent.type)}</td><td>${h(tent.capacity)}</td><td>${h(members.map(person => person.name).join(", "))}</td><td>${h(tentWarnings.join("; ") || "None")}</td></tr>`;
        }).join("")}<tr><td>Unallocated</td><td></td><td></td><td>${h(orderedPeople().filter(person => !person.tentId).map(person => person.name).join(", "))}</td><td></td></tr></tbody></table>`;
    }

    async function editChoreItem(id) {
        const existing = State.project.choreItems.find(item => item.id === id);
        const initial = existing ? { ...existing } : choreItem();
        const result = await promptFields(existing ? "Edit Rota Item" : "Add Rota Item", [
            { name: "name", label: "Name", value: initial.name, required: true },
            { name: "category", label: "Category", value: initial.category },
            { name: "description", label: "Description", type: "textarea", value: initial.description, full: true }
        ]);
        if (!result) return;
        mutate(existing ? "Updated rota item." : "Added rota item.", () => {
            const target = existing || choreItem();
            Object.assign(target, result);
            if (!existing) State.project.choreItems.push(target);
        });
    }

    async function removeChoreItem(id) {
        const item = State.project.choreItems.find(entry => entry.id === id);
        if (!item || !(await confirmBox("Remove rota item", `Remove ${item.name} and its allocations?`))) return;
        mutate("Removed rota item.", () => {
            State.project.choreItems = State.project.choreItems.filter(entry => entry.id !== id);
            State.project.choreAllocations = State.project.choreAllocations.filter(allocation => allocation.choreItemId !== id);
        });
    }

    async function bulkAddChoreItems() {
        const result = await promptFields("Bulk add rota items", [
            { name: "items", label: "One rota item per line", type: "textarea", full: true }
        ]);
        if (!result) return;
        let count = 0;
        mutate("Added rota items.", () => {
            const existing = new Set(State.project.choreItems.map(item => item.name.toLowerCase()));
            result.items.split(/\r?\n/).map(clean).filter(Boolean).forEach(name => {
                if (!existing.has(name.toLowerCase())) {
                    State.project.choreItems.push(choreItem({ name }));
                    existing.add(name.toLowerCase());
                    count++;
                }
            });
        });
        setStatus(`Added ${count} rota items.`);
    }

    async function pickStandardChores() {
        const existing = new Set(State.project.choreItems.map(item => item.name.toLowerCase()));
        const result = await promptFields("Pick standard rota items", [
            { name: "items", label: "Standard chores", type: "multi", options: STANDARD_CHORES.map(item => ({ value: item[0], label: `${item[0]} - ${item[1]}`, checked: !existing.has(item[0].toLowerCase()) })), full: true }
        ], { okText: "Add selected" });
        if (!result) return;
        mutate("Added standard rota items.", () => {
            result.items.forEach(name => {
                const source = STANDARD_CHORES.find(item => item[0] === name);
                if (source && !State.project.choreItems.some(item => item.name.toLowerCase() === name.toLowerCase())) {
                    State.project.choreItems.push(choreItem({ name: source[0], category: source[1], description: source[2] }));
                }
            });
        });
    }

    async function modifyChoreSlots() {
        const result = await promptFields("Modify chore slots", [
            { name: "sessions", label: "One session per line", type: "textarea", value: State.project.choreSessions.join("\n"), full: true }
        ]);
        if (!result) return;
        const sessions = distinct(result.sessions.split(/\r?\n/).map(clean).filter(Boolean), value => value.toLowerCase());
        if (!sessions.length) throw new Error("At least one slot is required.");
        mutate("Updated chore slots.", () => {
            State.project.choreSessions = sessions;
        });
    }

    async function editAllocation(id, date, session) {
        const existing = State.project.choreAllocations.find(item => item.id === id);
        const initial = existing || choreAllocation({ date: date || State.project.startDate, session: session || State.project.choreSessions[0] });
        const labels = Object.fromEntries(State.project.choreItems.map(item => [item.id, item.name]));
        const result = await promptFields(existing ? "Edit allocation" : "Add Allocation", [
            { name: "date", label: "Date", type: "date", value: initial.date },
            { name: "session", label: "Time slot", type: "select", options: State.project.choreSessions, value: initial.session },
            { name: "choreItemId", label: "Rota item", type: "select", options: State.project.choreItems.map(item => item.id), labels, value: initial.choreItemId },
            { name: "teamIds", label: "Teams", type: "multi", options: State.project.choreTeams.map(team => ({ value: team.id, label: team.name, checked: initial.teamIds?.includes(team.id) })), full: true },
            { name: "tentIds", label: "Tents", type: "multi", options: State.project.tents.map(tent => ({ value: tent.id, label: tent.name, checked: initial.tentIds?.includes(tent.id) })), full: true },
            { name: "personIds", label: "People", type: "multi", options: orderedPeople().map(person => ({ value: person.id, label: person.name, checked: initial.personIds?.includes(person.id) || initial.personId === person.id })), full: true },
            { name: "notes", label: "Notes", type: "textarea", value: initial.notes, full: true }
        ], { wide: true });
        if (!result) return;
        mutate(existing ? "Updated allocation." : "Added allocation.", () => {
            const target = existing || choreAllocation();
            Object.assign(target, result, { personId: result.personIds[0] || "" });
            if (!existing) State.project.choreAllocations.push(target);
        });
    }

    async function removeAllocation(id) {
        if (!(await confirmBox("Remove allocation", "Remove this chore allocation?"))) return;
        mutate("Removed allocation.", () => {
            State.project.choreAllocations = State.project.choreAllocations.filter(item => item.id !== id);
        });
    }

    async function generateRota() {
        if (!State.project.people.length) throw new Error("Add people before generating a rota.");
        if (!State.project.choreItems.length) {
            const add = await confirmBox("No rota items", "No rota items exist. Add the standard rota items first?");
            if (add) {
                STANDARD_CHORES.forEach(source => State.project.choreItems.push(choreItem({ name: source[0], category: source[1], description: source[2] })));
            }
        }
        if (State.project.choreAllocations.length && !(await confirmBox("Replace rota", "Replace current chore allocations with a simple round-robin rota?"))) return;
        mutate("Generated simple chore rota.", () => {
            State.project.choreAllocations = [];
            const people = orderedPeople();
            const chores = [...State.project.choreItems].sort((a, b) => localeSort(a.name, b.name));
            let index = 0;
            enumerateDates(State.project.startDate, State.project.endDate).forEach(date => {
                State.project.choreSessions.forEach(session => {
                    chores.forEach(chore => {
                        const assignee = people[index % people.length];
                        State.project.choreAllocations.push(choreAllocation({ date, session, choreItemId: chore.id, personId: assignee.id, personIds: [assignee.id] }));
                        index++;
                    });
                });
            });
        });
    }

    async function clearRota() {
        if (!(await confirmBox("Clear chore rota", "Remove all chore allocations?"))) return;
        mutate("Cleared chore rota.", () => {
            State.project.choreAllocations = [];
        });
    }

    async function copyChoreDay(sourceDate) {
        const dates = enumerateDates(State.project.startDate, State.project.endDate);
        sourceDate ||= await chooseDate("Copy chore day", "Source day", dates);
        if (!sourceDate) return;
        const target = await chooseDate("Copy chore day", "Target day", dates.filter(date => date !== sourceDate));
        if (!target) return;
        mutate("Copied chore day.", () => {
            State.project.choreAllocations = State.project.choreAllocations.filter(allocation => allocation.date !== target);
            State.project.choreAllocations
                .filter(allocation => allocation.date === sourceDate)
                .forEach(allocation => State.project.choreAllocations.push({ ...allocation, id: uid(), date: target, personIds: [...allocation.personIds], teamIds: [...allocation.teamIds], tentIds: [...allocation.tentIds] }));
        });
    }

    async function copyChoreSession(sourceDate, session) {
        if (!(await confirmBox("Copy session", `Copy ${session} on ${displayDate(sourceDate)} to every other day?`))) return;
        mutate("Copied chore session.", () => {
            const source = State.project.choreAllocations.filter(allocation => allocation.date === sourceDate && allocation.session === session);
            enumerateDates(State.project.startDate, State.project.endDate).filter(date => date !== sourceDate).forEach(date => {
                State.project.choreAllocations = State.project.choreAllocations.filter(allocation => !(allocation.date === date && allocation.session === session));
                source.forEach(allocation => State.project.choreAllocations.push({ ...allocation, id: uid(), date, personIds: [...allocation.personIds], teamIds: [...allocation.teamIds], tentIds: [...allocation.tentIds] }));
            });
        });
    }

    async function editMeal(id, date, slot) {
        const existing = State.project.menuItems.find(item => item.id === id);
        const initial = existing || mealItem({ date: date || State.project.startDate, slot: slot || State.project.menuStartSlot });
        const result = await promptFields(existing ? "Edit meal" : "Add meal", [
            { name: "date", label: "Date", type: "date", value: initial.date },
            { name: "slot", label: "Meal slot", type: "select", options: State.project.menuSlots, value: initial.slot },
            { name: "meal", label: "Food", value: initial.meal },
            { name: "pudding", label: "Pudding", value: initial.pudding },
            { name: "dietaryNotes", label: "Dietary notes", type: "textarea", value: initial.dietaryNotes, full: true },
            { name: "notes", label: "Notes", type: "textarea", value: initial.notes, full: true },
            { name: "saveToLibrary", label: "Save meal to menu library", type: "checkbox", value: false }
        ], { wide: true });
        if (!result) return;
        mutate(existing ? "Updated meal." : "Added meal.", () => {
            const target = existing || mealItem();
            Object.assign(target, result);
            delete target.saveToLibrary;
            if (!existing) State.project.menuItems.push(target);
            if (result.saveToLibrary && clean(result.meal) && !State.project.menuLibraryItems.some(item => item.toLowerCase() === result.meal.toLowerCase())) {
                State.project.menuLibraryItems.push(result.meal);
                State.project.menuLibraryItems.sort(localeSort);
            }
        });
    }

    async function removeMeal(id) {
        if (!(await confirmBox("Remove meal", "Remove this menu row?"))) return;
        mutate("Removed meal.", () => {
            State.project.menuItems = State.project.menuItems.filter(item => item.id !== id);
        });
    }

    function addMenuDates() {
        let count = 0;
        mutate("Added missing menu rows.", () => {
            enumerateDates(State.project.startDate, State.project.endDate).forEach(date => {
                activeMealSlots(State.project, date).forEach(slot => {
                    if (!State.project.menuItems.some(item => item.date === date && item.slot.toLowerCase() === slot.toLowerCase())) {
                        State.project.menuItems.push(mealItem({ date, slot }));
                        count++;
                    }
                });
            });
        });
        setStatus(`Added ${count} menu row${count === 1 ? "" : "s"}.`);
    }

    async function defineMenuStartEnd() {
        const result = await promptFields("Define menu start and end", [
            { name: "menuStartSlot", label: "First meal on arrival day", type: "select", options: State.project.menuSlots, value: State.project.menuStartSlot },
            { name: "menuEndSlot", label: "Last meal on departure day", type: "select", options: State.project.menuSlots, value: State.project.menuEndSlot }
        ]);
        if (!result) return;
        mutate("Updated menu start/end.", () => {
            State.project.menuStartSlot = result.menuStartSlot;
            State.project.menuEndSlot = result.menuEndSlot;
        });
    }

    async function modifyMenuSlots() {
        const result = await promptFields("Modify menu slots", [
            { name: "slots", label: "One meal slot per line", type: "textarea", value: State.project.menuSlots.join("\n"), full: true }
        ]);
        if (!result) return;
        const slots = distinct(result.slots.split(/\r?\n/).map(clean).filter(Boolean), value => value.toLowerCase());
        if (!slots.length) throw new Error("At least one slot is required.");
        mutate("Updated menu slots.", () => {
            State.project.menuSlots = slots;
            State.project.menuItems.forEach(item => item.slot = normalizeMealSlot(State.project, item.slot));
        });
    }

    async function openMenuLibrary(date, slot) {
        const body = document.createElement("div");
        const targetDate = date || State.project.startDate;
        const targetSlot = slot || State.project.menuStartSlot;
        const drawLibrary = () => {
            body.innerHTML = `
                <div class="toolbar">
                    <input data-local-name placeholder="Meal or menu item">
                    <button data-local="add" type="button">Add library item</button>
                    <button class="danger" data-local="remove" type="button">Remove selected</button>
                </div>
                <div class="chooser-list">
                    ${State.project.menuLibraryItems.map(item => `<label class="chooser-row"><input type="checkbox" value="${attr(item)}"> ${h(item)}</label>`).join("")}
                </div>`;
        };
        drawLibrary();
        body.addEventListener("click", event => {
            const button = event.target.closest("[data-local]");
            if (!button) return;
            if (button.dataset.local === "add") {
                const item = body.querySelector("[data-local-name]")?.value || "";
                if (clean(item)) {
                    mutate("Added library item.", () => {
                        State.project.menuLibraryItems.push(item);
                        State.project.menuLibraryItems = distinct(State.project.menuLibraryItems, value => value.toLowerCase()).sort(localeSort);
                    });
                    drawLibrary();
                }
            } else if (button.dataset.local === "remove") {
                const selected = new Set($all("input:checked", body).map(input => input.value));
                if (selected.size) {
                    mutate("Removed library item.", () => {
                        State.project.menuLibraryItems = State.project.menuLibraryItems.filter(item => !selected.has(item));
                    });
                    drawLibrary();
                }
            }
        });
        const value = await showModal("Menu Library", body, [
            { label: "Insert selected", value: "insert" },
            { label: "Close", value: "close", className: "secondary" }
        ]);
        const selected = $all("input:checked", body).map(input => input.value);
        if (value === "insert" && selected.length) {
            mutate("Inserted menu library items.", () => {
                selected.forEach(meal => State.project.menuItems.push(mealItem({ date: targetDate, slot: targetSlot, meal })));
            });
        }
    }

    async function copyMenuDay(sourceDate) {
        const dates = enumerateDates(State.project.startDate, State.project.endDate);
        sourceDate ||= await chooseDate("Copy menu day", "Source day", dates);
        if (!sourceDate) return;
        const target = await chooseDate("Copy menu day", "Target day", dates.filter(date => date !== sourceDate));
        if (!target) return;
        const replace = await confirmBox("Copy day", "Replace existing menu rows on the target day?");
        mutate("Copied menu day.", () => {
            if (replace) {
                State.project.menuItems = State.project.menuItems.filter(item => item.date !== target);
            }
            State.project.menuItems
                .filter(item => item.date === sourceDate && hasMenuContent(item))
                .forEach(item => State.project.menuItems.push({ ...item, id: uid(), date: target }));
            const note = State.project.menuDayNotes.find(item => item.date === sourceDate);
            if (note) {
                State.project.menuDayNotes = State.project.menuDayNotes.filter(item => item.date !== target);
                State.project.menuDayNotes.push({ ...note, id: uid(), date: target });
            }
        });
    }

    async function editMenuDayNote(date) {
        const existing = State.project.menuDayNotes.find(note => note.date === date);
        const notes = await promptText("Day note", `Notes for ${displayDate(date, true)}`, existing?.notes || "", true);
        if (notes === null) return;
        mutate("Updated day note.", () => {
            if (existing) {
                existing.notes = notes;
            } else if (clean(notes)) {
                State.project.menuDayNotes.push({ id: uid(), date, notes });
            }
        });
    }

    function removeEmptyMenuRows() {
        let count = 0;
        mutate("Removed empty menu rows.", () => {
            const before = State.project.menuItems.length;
            State.project.menuItems = State.project.menuItems.filter(hasMenuContent);
            count = before - State.project.menuItems.length;
        });
        setStatus(`Removed ${count} empty menu row${count === 1 ? "" : "s"}.`);
    }

    async function manageDietaryMedical() {
        const personId = await chooseOne("Manage dietary and medical notes", "Person", orderedPeople().map(person => [person.id, person.name]));
        if (personId) await editPerson(personId);
    }

    async function editPlanItem(id, date, concurrent = false) {
        const existing = State.project.planItems.find(item => item.id === id);
        const initial = existing || planItem({ date: date || State.project.startDate, isConcurrent: concurrent });
        const result = await promptFields(existing ? "Edit plan item" : concurrent ? "Add concurrent activity" : "Add plan item", [
            { name: "date", label: "Date", type: "date", value: initial.date },
            { name: "title", label: "Activity", value: initial.title, required: true },
            { name: "startTime", label: "Start", type: "select", options: timeOptions(false), value: planTime(initial.startMinute) },
            { name: "endTime", label: "End", type: "select", options: timeOptions(true), value: planTime(initial.endMinute) },
            { name: "isConcurrent", label: "Concurrent activity", type: "checkbox", value: initial.isConcurrent },
            { name: "isAllCamp", label: "All camp", type: "checkbox", value: initial.isAllCamp },
            { name: "audienceLabel", label: "Location / area or audience label", value: initial.audienceLabel },
            { name: "teamIds", label: "Teams", type: "multi", options: State.project.choreTeams.map(team => ({ value: team.id, label: team.name, checked: initial.teamIds?.includes(team.id) })), full: true },
            { name: "tentIds", label: "Tents", type: "multi", options: State.project.tents.map(tent => ({ value: tent.id, label: tent.name, checked: initial.tentIds?.includes(tent.id) })), full: true },
            { name: "personIds", label: "People", type: "multi", options: orderedPeople().map(person => ({ value: person.id, label: person.name, checked: initial.personIds?.includes(person.id) })), full: true },
            { name: "notes", label: "Notes", type: "textarea", value: initial.notes, full: true }
        ], { wide: true });
        if (!result) return;
        const startMinute = parsePlanTime(result.startTime);
        const endMinute = parsePlanTime(result.endTime);
        if (startMinute === null || endMinute === null || endMinute <= startMinute) {
            throw new Error("End time must be after start time.");
        }
        mutate(existing ? "Updated plan item." : "Added plan item.", () => {
            const target = existing || planItem();
            Object.assign(target, {
                date: result.date,
                title: result.title,
                startMinute,
                endMinute,
                isConcurrent: Boolean(result.isConcurrent),
                isAllCamp: Boolean(result.isAllCamp),
                audienceLabel: result.audienceLabel,
                teamIds: result.teamIds,
                tentIds: result.tentIds,
                personIds: result.personIds,
                notes: result.notes
            });
            if (!existing) State.project.planItems.push(target);
        });
    }

    async function editPlanTime(id) {
        const item = State.project.planItems.find(row => row.id === id);
        if (!item) return;
        const result = await promptFields("Edit time", [
            { name: "startTime", label: "Start", type: "select", options: timeOptions(false), value: planTime(item.startMinute) },
            { name: "endTime", label: "End", type: "select", options: timeOptions(true), value: planTime(item.endMinute) }
        ]);
        if (!result) return;
        const start = parsePlanTime(result.startTime);
        const end = parsePlanTime(result.endTime);
        if (start === null || end === null || end <= start) throw new Error("End time must be after start time.");
        mutate("Updated plan time.", () => {
            item.startMinute = start;
            item.endMinute = end;
        });
    }

    async function removePlanItem(id) {
        const item = State.project.planItems.find(row => row.id === id);
        if (!item || item.boundaryKind || !(await confirmBox("Remove plan item", `Remove ${item.title}?`))) return;
        mutate("Removed plan item.", () => {
            State.project.planItems = State.project.planItems.filter(row => row.id !== id);
        });
    }

    async function copyPlanDay(sourceDate) {
        const dates = enumerateDates(State.project.startDate, State.project.endDate);
        sourceDate ||= await chooseDate("Copy plan day", "Source day", dates);
        if (!sourceDate) return;
        const target = await chooseDate("Copy plan day", "Target day", dates.filter(date => date !== sourceDate));
        if (!target) return;
        mutate("Copied plan day.", () => {
            State.project.planItems = State.project.planItems.filter(item => item.date !== target || item.boundaryKind);
            State.project.planItems
                .filter(item => item.date === sourceDate && !item.boundaryKind)
                .forEach(item => State.project.planItems.push({ ...item, id: uid(), date: target, teamIds: [...item.teamIds], tentIds: [...item.tentIds], personIds: [...item.personIds] }));
        });
    }

    async function editKitItem(participant, id) {
        const existing = State.project.kitItems.find(item => item.id === id);
        const initial = existing || kitItem({ owner: participant ? "Participant" : "Group stores", status: participant ? TERMS.kitReady : TERMS.kitToCheck });
        const fields = [
            { name: "name", label: "Item", value: initial.name, required: true },
            { name: "quantity", label: "Quantity", type: "number", step: "0.1", value: initial.quantity },
            { name: "notes", label: "Notes", type: "textarea", value: initial.notes, full: true }
        ];
        if (!participant) {
            fields.splice(2, 0,
                { name: "category", label: "Inventory group / category", value: initial.category },
                { name: "status", label: "Status", type: "select", options: KIT_STATUSES, value: initial.status },
                { name: "isConsumable", label: "Consumable", type: "checkbox", value: initial.isConsumable },
                { name: "needsAction", label: "Needs action", type: "checkbox", value: initial.needsAction });
        }
        const result = await promptFields(existing ? "Edit kit item" : participant ? "Add Participant Kit Item" : "Add Kit Item", fields);
        if (!result) return;
        mutate(existing ? "Updated kit item." : "Added kit item.", () => {
            const target = existing || kitItem();
            Object.assign(target, result, {
                quantity: Math.max(0, number(result.quantity, 1)),
                owner: participant ? "Participant" : "Group stores",
                status: participant ? TERMS.kitReady : result.status || TERMS.kitToCheck
            });
            if (!existing) State.project.kitItems.push(target);
        });
    }

    function duplicateGroupKitItem(id) {
        const source = State.project.kitItems.find(item => item.id === id);
        if (!source) return;
        mutate("Duplicated kit item.", () => {
            State.project.kitItems.push(kitItem({ ...source, id: uid(), name: `${source.name} copy` }));
        });
    }

    async function removeKitItem(id) {
        const item = State.project.kitItems.find(row => row.id === id);
        if (!item || !(await confirmBox("Remove kit item", `Remove ${item.name}?`))) return;
        mutate("Removed kit item.", () => {
            State.project.kitItems = State.project.kitItems.filter(row => row.id !== id);
        });
    }

    function adjustKitQty(id, delta) {
        mutate("Updated quantity.", () => {
            const item = State.project.kitItems.find(row => row.id === id)
                || State.project.shoppingLists.flatMap(listItem => listItem.items).find(row => row.id === id);
            if (item) item.quantity = Math.max(0, number(item.quantity, 0) + delta);
        });
    }

    async function addGroupFromInventory() {
        await addFromInventory(State.project.groupKitInventory, false, "Add from group inventory");
    }

    async function addStandardParticipantKit() {
        await addFromInventory(State.project.participantKitInventory, true, "Standard participant kit");
    }

    async function addFromInventory(inventory, participant, title) {
        const result = await promptFields(title, [
            { name: "items", label: "Items", type: "multi", options: inventory.map(item => ({ value: item.id, label: `${item.name} (${formatQty(item.quantity)})`, checked: false })), full: true }
        ], { okText: "Add selected" });
        if (!result) return;
        mutate("Added inventory items.", () => {
            result.items.forEach(id => {
                const source = inventory.find(item => item.id === id);
                if (source && !State.project.kitItems.some(item => isParticipantKitItem(item) === participant && item.name.toLowerCase() === source.name.toLowerCase())) {
                    State.project.kitItems.push(kitItem({ ...source, id: uid(), owner: participant ? "Participant" : "Group stores", status: participant ? TERMS.kitReady : source.status }));
                }
            });
        });
    }

    async function manageKitInventory(participant) {
        const inventory = participant ? State.project.participantKitInventory : State.project.groupKitInventory;
        const body = document.createElement("div");
        body.innerHTML = `<div class="toolbar"><button data-local="add" type="button">Add reusable item</button></div><div class="table-wrap"><table><thead><tr><th>Item</th><th>Qty</th><th>Notes</th><th></th></tr></thead><tbody>${inventory.map(item => `<tr><td>${h(item.name)}<br><small>${h(item.category)}</small></td><td>${h(formatQty(item.quantity))}</td><td>${h(item.notes)}</td><td><button class="small-button secondary" data-local="edit" data-id="${attr(item.id)}" type="button">Edit</button><button class="small-button danger" data-local="remove" data-id="${attr(item.id)}" type="button">Remove</button></td></tr>`).join("")}</tbody></table></div>`;
        showModal(participant ? "Participant standard items" : "Group kit inventory", body, [{ label: "Close", value: "close", className: "secondary" }], { wide: true });
        body.addEventListener("click", event => {
            const button = event.target.closest("[data-local]");
            if (!button) return;
            if (button.dataset.local === "add") editInventoryItem(participant);
            if (button.dataset.local === "edit") editInventoryItem(participant, button.dataset.id);
            if (button.dataset.local === "remove") {
                mutate("Removed inventory item.", () => {
                    const index = inventory.findIndex(item => item.id === button.dataset.id);
                    if (index >= 0) inventory.splice(index, 1);
                });
                closeModal();
            }
        });
    }

    async function editInventoryItem(participant, id) {
        const inventory = participant ? State.project.participantKitInventory : State.project.groupKitInventory;
        const existing = inventory.find(item => item.id === id);
        const initial = existing || kitItem({ owner: participant ? "Participant" : "Group stores", status: participant ? TERMS.kitReady : TERMS.kitToCheck });
        const result = await promptFields(existing ? "Edit reusable item" : "Add reusable item", [
            { name: "category", label: "Inventory group / category", value: initial.category },
            { name: "name", label: "Item", value: initial.name, required: true },
            { name: "quantity", label: "Quantity", type: "number", step: "0.1", value: initial.quantity },
            { name: "status", label: "Status", type: "select", options: KIT_STATUSES, value: initial.status },
            { name: "isConsumable", label: "Consumable", type: "checkbox", value: initial.isConsumable },
            { name: "needsAction", label: "Needs action", type: "checkbox", value: initial.needsAction },
            { name: "notes", label: "Notes", type: "textarea", value: initial.notes, full: true }
        ]);
        if (!result) return;
        mutate("Updated inventory.", () => {
            const target = existing || kitItem();
            Object.assign(target, result, { quantity: number(result.quantity, 1), owner: participant ? "Participant" : "Group stores" });
            if (!existing) inventory.push(target);
        });
        closeModal();
    }

    async function kitTemplates() {
        const result = await chooseOne("Templates", "Template", [
            ["weekend", "Weekend camp defaults"],
            ["kitchen", "Kitchen starter pack"],
            ["firstaid", "First aid and safety pack"],
            ["wet", "Wet weather pack"]
        ]);
        if (!result) return;
        const names = {
            weekend: WEEKEND_KIT_DEFAULTS.map(item => item[0]),
            kitchen: ["Gas stove", "Gas bottle", "Large cooking pan", "Chopping board", "Sharp knife", "Plates", "Bowls", "Cups", "Cutlery set", "Washing-up bowl", "Washing-up liquid", "Tea towel", "Kitchen box"],
            firstaid: ["First aid kit", "Medical forms", "Fire bucket", "Lantern", "Head torch"],
            wet: ["Event shelter", "Water carrier", "Spare tent pegs", "Tent repair tape", "Cleaning box"]
        }[result];
        mutate("Added kit template.", () => {
            names.forEach(name => {
                if (!groupKit().some(item => item.name.toLowerCase() === name.toLowerCase())) {
                    const source = WEEKEND_KIT_DEFAULTS.find(item => item[0] === name);
                    State.project.kitItems.push(kitItem({ name, quantity: source?.[1] || 1, owner: "Group stores", isConsumable: source?.[2] || false, needsAction: source?.[3] || false, notes: source?.[4] || "" }));
                }
            });
        });
    }

    async function moreKitActions() {
        const choice = await chooseOne("More kit actions", "Action", [
            ["import", "Import CSV"],
            ["inventory", "Add selected to inventory"],
            ["tocheck", "Set all visible to To check"],
            ["packed", "Set all visible to Packed"],
            ["loaded", "Set all visible to Loaded"],
            ["returned", "Set all visible to Returned"],
            ["missing", "Set all visible to Missing"],
            ["damaged", "Set all visible to Damaged"],
            ["cleaning", "Set all visible to Needs cleaning"]
        ]);
        if (!choice) return;
        if (choice === "import") return importKitCsv();
        if (choice === "inventory") return addGroupKitToInventory();
        const statusMap = { tocheck: TERMS.kitToCheck, packed: TERMS.kitPacked, loaded: TERMS.kitLoaded, returned: TERMS.kitReturned, missing: TERMS.kitMissing, damaged: TERMS.kitDamaged, cleaning: TERMS.kitNeedsCleaning };
        mutate("Updated kit statuses.", () => groupKit().forEach(item => item.status = statusMap[choice]));
    }

    async function importKitCsv() {
        const file = await requestFile();
        const rows = parseCsv(file.text.split(/\r?\n/));
        let count = 0;
        mutate("Imported kit CSV.", () => {
            rows.forEach(row => {
                const name = firstCsvValue(row, "item", "name", "kit", "kit item");
                if (!clean(name)) return;
                State.project.kitItems.push(kitItem({
                    name,
                    category: firstCsvValue(row, "category", "section", "type"),
                    quantity: number(firstCsvValue(row, "qty", "quantity", "number"), 1),
                    status: normalizeKitStatus(firstCsvValue(row, "status", "state")),
                    owner: "Group stores",
                    isConsumable: parseBool(firstCsvValue(row, "consumable", "consumed")),
                    needsAction: parseBool(firstCsvValue(row, "action", "needs action", "needsaction")),
                    notes: firstCsvValue(row, "notes", "note")
                }));
                count++;
            });
        });
        setStatus(`Imported ${count} kit items.`);
    }

    function addGroupKitToInventory() {
        mutate("Added kit to inventory.", () => {
            groupKit().forEach(item => {
                if (!State.project.groupKitInventory.some(existing => existing.name.toLowerCase() === item.name.toLowerCase())) {
                    State.project.groupKitInventory.push(kitItem({ ...item, id: uid() }));
                }
            });
        });
    }

    function addShoppingList() {
        mutate("Added shopping list.", () => {
            State.project.shoppingLists.push(shoppingList({ name: uniqueShoppingListName() }));
        });
    }

    async function renameShoppingList(id) {
        const listItem = State.project.shoppingLists.find(item => item.id === id);
        if (!listItem) return;
        const name = await promptText("Rename shopping list", "Name", listItem.name);
        if (!name) return;
        mutate("Renamed shopping list.", () => listItem.name = name);
    }

    async function removeShoppingList(id) {
        const listItem = State.project.shoppingLists.find(item => item.id === id);
        if (!listItem || !(await confirmBox("Remove list", `Remove ${listItem.name}?`))) return;
        mutate("Removed shopping list.", () => {
            State.project.shoppingLists = State.project.shoppingLists.filter(item => item.id !== id);
        });
    }

    function addShoppingItem(listId) {
        mutate("Added shopping item.", () => {
            const listItem = State.project.shoppingLists.find(item => item.id === listId);
            listItem?.items.push({ id: uid(), name: "", quantity: 1 });
        });
    }

    function removeShoppingItem(listId, itemId) {
        mutate("Removed shopping item.", () => {
            const listItem = State.project.shoppingLists.find(item => item.id === listId);
            if (listItem) listItem.items = listItem.items.filter(item => item.id !== itemId);
        });
    }

    function uniqueShoppingListName() {
        const names = new Set(State.project.shoppingLists.map(item => item.name.toLowerCase()));
        let index = State.project.shoppingLists.length + 1;
        let name = `Shopping list ${index}`;
        while (names.has(name.toLowerCase())) name = `Shopping list ${++index}`;
        return name;
    }

    function showModal(title, body, actions = [], options = {}) {
        const host = $("#modalHost");
        host.classList.remove("hidden");
        const bodyNode = typeof body === "string" ? document.createElement("div") : body;
        if (typeof body === "string") bodyNode.innerHTML = body;
        host.innerHTML = `
            <div class="modal ${options.wide ? "wide" : ""}" role="dialog" aria-modal="true" aria-label="${attr(title)}">
                <div class="modal-header"><h2>${h(title)}</h2></div>
                <div class="modal-body"></div>
                <div class="modal-actions"></div>
            </div>`;
        $(".modal-body", host).appendChild(bodyNode);
        const actionRow = $(".modal-actions", host);
        const buttons = actions.length ? actions : [{ label: "OK", value: "ok" }];
        return new Promise(resolve => {
            buttons.forEach(action => {
                const button = document.createElement("button");
                button.type = "button";
                button.textContent = action.label;
                if (action.className) button.className = action.className;
                button.addEventListener("click", () => {
                    const value = action.value ?? action.label;
                    closeModal();
                    resolve(value);
                });
                actionRow.appendChild(button);
            });
        });
    }

    function closeModal() {
        const host = $("#modalHost");
        host.classList.add("hidden");
        host.innerHTML = "";
    }

    async function alertBox(title, message) {
        const body = document.createElement("div");
        body.innerHTML = `<p>${h(message)}</p>`;
        await showModal(title, body, [{ label: "OK", value: true }]);
    }

    async function confirmBox(title, message) {
        const body = document.createElement("div");
        body.innerHTML = `<p>${h(message)}</p>`;
        return (await showModal(title, body, [
            { label: "OK", value: true },
            { label: "Cancel", value: false, className: "secondary" }
        ])) === true;
    }

    async function promptFields(title, fields, options = {}) {
        const body = document.createElement("form");
        body.className = "form-grid";
        body.innerHTML = fields.map(fieldHtml).join("");
        const value = await showModal(title, body, [
            { label: options.okText || "OK", value: "ok" },
            { label: "Cancel", value: "cancel", className: "secondary" }
        ], { wide: options.wide });
        if (value !== "ok") return null;
        const result = {};
        fields.forEach(field => {
            if (field.type === "checkbox") {
                result[field.name] = body.querySelector(`[name="${cssEscape(field.name)}"]`).checked;
            } else if (field.type === "multi") {
                result[field.name] = $all(`[name="${cssEscape(field.name)}"]:checked`, body).map(input => input.value);
            } else {
                result[field.name] = body.querySelector(`[name="${cssEscape(field.name)}"]`)?.value ?? "";
            }
        });
        return result;
    }

    function fieldHtml(field) {
        const full = field.full || field.type === "multi" || field.type === "textarea" ? " full" : "";
        const required = field.required ? " required" : "";
        if (field.type === "textarea") {
            return `<label class="${full}">${h(field.label)}<textarea name="${attr(field.name)}"${required}>${h(field.value || "")}</textarea></label>`;
        }
        if (field.type === "select") {
            const labels = field.labels || {};
            return `<label class="${full}">${h(field.label)}<select name="${attr(field.name)}">${field.options.map(option => `<option value="${attr(option)}" ${String(option) === String(field.value) ? "selected" : ""}>${h(labels[option] || option)}</option>`).join("")}</select></label>`;
        }
        if (field.type === "checkbox") {
            return `<label class="checkbox-row${full}"><input name="${attr(field.name)}" type="checkbox" ${field.value ? "checked" : ""}> ${h(field.label)}</label>`;
        }
        if (field.type === "multi") {
            return `<label class="${full}">${h(field.label)}<span class="chooser-list">${field.options.map(option => `<span class="chooser-row"><input name="${attr(field.name)}" type="checkbox" value="${attr(option.value)}" ${option.checked ? "checked" : ""}> ${h(option.label)}</span>`).join("") || `<span class="empty">No options available.</span>`}</span></label>`;
        }
        return `<label class="${full}">${h(field.label)}<input name="${attr(field.name)}" type="${attr(field.type || "text")}" step="${attr(field.step || "")}" value="${attr(field.value || "")}"${required}></label>`;
    }

    function cssEscape(value) {
        return String(value).replaceAll("\"", "\\\"");
    }

    async function promptText(title, label, initial = "", multiline = false) {
        const result = await promptFields(title, [{ name: "value", label, type: multiline ? "textarea" : "text", value: initial, full: true }]);
        return result ? result.value : null;
    }

    async function chooseOne(title, label, pairs) {
        if (!pairs.length) return null;
        const result = await promptFields(title, [{ name: "value", label, type: "select", options: pairs.map(pair => pair[0]), labels: Object.fromEntries(pairs) }]);
        return result?.value || null;
    }

    async function chooseDate(title, label, dates) {
        return chooseOne(title, label, dates.map(date => [date, displayDate(date, true)]));
    }

    function toast(message) {
        const node = document.createElement("div");
        node.className = "toast";
        node.textContent = message;
        $("#toastHost").appendChild(node);
        setTimeout(() => node.remove(), 3200);
        if (window.Android?.toast) {
            window.Android.toast(message);
        }
    }

    function showError(error) {
        console.error(error);
        const message = error?.message || String(error);
        setStatus(message);
        alertBox("Camp Planner", message);
    }

    function requestFile() {
        if (window.Android?.openFile) {
            const callbackId = uid();
            const promise = new Promise((resolve, reject) => State.pendingFiles.set(callbackId, { resolve, reject }));
            window.Android.openFile(callbackId);
            return promise;
        }
        return new Promise((resolve, reject) => {
            const input = $("#fallbackFileInput");
            input.value = "";
            input.onchange = async () => {
                try {
                    const file = input.files[0];
                    const buffer = await file.arrayBuffer();
                    const bytes = new Uint8Array(buffer);
                    resolve({ name: file.name, mime: file.type, bytes, text: bytesToText(bytes) });
                } catch (error) {
                    reject(error);
                }
            };
            input.click();
        });
    }

    async function saveTextFile(fileName, mimeType, text) {
        await saveBytesFile(fileName, mimeType, textToBytes(text));
    }

    async function saveBytesFile(fileName, mimeType, bytes) {
        if (window.Android?.saveFile) {
            window.Android.saveFile(fileName, mimeType, bytesToBase64(bytes));
            return;
        }
        const blob = new Blob([bytes], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        setStatus(`Saved ${fileName}.`);
    }

    function printHtml(title, html) {
        if (window.Android?.printHtml) {
            window.Android.printHtml(title, textToBase64(html));
            return;
        }
        const win = window.open("", "_blank");
        win.document.write(html);
        win.document.close();
        win.print();
    }

    function safeFileName(value) {
        return clean(value, "camp-planner")
            .replace(/[\\/:*?"<>|\r\n]+/g, "-")
            .replace(/\s+/g, " ")
            .trim();
    }

    function buildTentWarnings(project) {
        const warnings = [];
        project.tents.slice().sort((a, b) => localeSort(a.name, b.name)).forEach(tent => {
            const occupants = project.people.filter(person => person.tentId === tent.id);
            if (tent.capacity > 0 && occupants.length > tent.capacity) {
                warnings.push(`${tent.name} is over capacity (${occupants.length} people, capacity ${tent.capacity}).`);
            }
            const young = occupants.filter(person => person.personType === TERMS.personTypeYoungPerson);
            const adults = occupants.filter(person => person.personType === TERMS.personTypeAdult);
            const youngLeaders = occupants.filter(person => person.personType === TERMS.personTypeYoungLeader);
            const genders = distinct(young.filter(person => [TERMS.genderMale, TERMS.genderFemale].includes(person.gender)).map(person => person.gender));
            if (genders.length > 1) warnings.push(`${tent.name} has mixed-gender young people.`);
            if (young.length && adults.length) warnings.push(`${tent.name} has young people mixed with adults.`);
            if (young.length && youngLeaders.length) warnings.push(`${tent.name} has young people mixed with young leaders.`);
            if (adults.length > 0 && youngLeaders.length && adults.length < 2) warnings.push(`${tent.name} has a young leader with fewer than two adults.`);
        });
        project.foeLinks.forEach(link => {
            const first = project.people.find(person => person.id === link.personAId);
            const second = project.people.find(person => person.id === link.personBId);
            if (first && second && first.tentId && first.tentId === second.tentId) {
                warnings.push(`${first.name} and ${second.name} have a foe link but are both in ${project.tents.find(tent => tent.id === first.tentId)?.name || "the same tent"}.`);
            }
        });
        const unallocated = project.people.filter(person => !person.tentId).length;
        if (unallocated > 0) warnings.push(`${unallocated} people are not allocated to a tent.`);
        return warnings;
    }

    function buildMenuWarnings(project) {
        const warnings = [];
        enumerateDates(project.startDate, project.endDate).forEach(date => {
            activeMealSlots(project, date).filter(slot => slot !== TERMS.mealExtra).forEach(slot => {
                if (!project.menuItems.some(item => item.date === date && item.slot === slot && clean(item.meal))) {
                    warnings.push(`${displayDate(date)}: ${slot.toLowerCase()} is not planned.`);
                }
            });
        });
        const teas = project.menuItems.filter(item => isMenuSlotActive(project, item.date, item.slot) && item.slot === TERMS.mealTea && clean(item.meal));
        const groups = teas.reduce((acc, item) => {
            const key = item.meal.toLowerCase();
            acc[key] = acc[key] || [];
            acc[key].push(item);
            return acc;
        }, {});
        Object.values(groups).filter(group => group.length > 1).forEach(group => warnings.push(`Tea repeats: ${group[0].meal} appears ${group.length} times.`));
        teas.filter(item => !clean(item.pudding)).forEach(item => warnings.push(`${displayDate(item.date)}: tea has no pudding recorded.`));
        if (project.people.some(person => clean(person.dietaryNotes))) {
            project.menuItems.filter(item => isMenuSlotActive(project, item.date, item.slot) && clean(item.meal) && !clean(item.dietaryNotes))
                .forEach(item => warnings.push(`${displayDate(item.date)} ${item.slot.toLowerCase()}: no dietary note recorded.`));
        }
        return warnings;
    }

    function exportCsvFiles() {
        const project = State.project;
        return {
            "people-and-tents.csv": [
                "Name,Type,Camper type,Day visitor,Gender,Patrol,Tent,Dietary notes,Medical notes,Notes",
                ...orderedPeople().map(person => [person.name, personTypeDisplay(person), person.camperType, person.isDayVisitor ? "Yes" : "No", person.gender, person.patrol, tentName(person.tentId), person.dietaryNotes, person.medicalNotes, person.notes].map(csv).join(","))
            ].join("\n"),
            "menu.csv": [
                "Date,Meal slot,Food,Pudding,Dietary notes,Notes",
                ...project.menuItems.filter(item => hasMenuContent(item) && isMenuSlotActive(project, item.date, item.slot)).map(item => [item.date, item.slot, item.meal, item.pudding, item.dietaryNotes, item.notes].map(csv).join(","))
            ].join("\n"),
            "kit-list.csv": [
                "Item,Quantity,Status,Owner,Consumable,Needs action,Notes",
                ...project.kitItems.map(item => [item.name, item.quantity, item.status, item.owner, item.isConsumable ? "Yes" : "No", item.needsAction ? "Yes" : "No", item.notes].map(csv).join(","))
            ].join("\n"),
            "chores.csv": [
                "Date,Session,Chore,Assigned to,Notes",
                ...project.choreAllocations.map(allocation => [allocation.date, allocation.session, choreName(allocation.choreItemId), choreAllocationAssigneeNames(allocation), allocation.notes].map(csv).join(","))
            ].join("\n")
        };
    }

    function csv(value) {
        return `"${String(value ?? "").replaceAll("\"", "\"\"")}"`;
    }

    function parseCsv(lines) {
        lines = lines.filter(line => clean(line));
        if (!lines.length) return [];
        const rows = lines.map(splitCsvLine);
        const headers = rows.shift().map(normalizeHeader);
        return rows.filter(row => row.some(clean)).map(row => Object.fromEntries(headers.map((header, index) => [header, row[index] || ""])));
    }

    function splitCsvLine(line) {
        const result = [];
        let value = "";
        let quoted = false;
        for (let index = 0; index < line.length; index++) {
            const ch = line[index];
            if (ch === "\"" && quoted && line[index + 1] === "\"") {
                value += "\"";
                index++;
            } else if (ch === "\"") {
                quoted = !quoted;
            } else if (ch === "," && !quoted) {
                result.push(value);
                value = "";
            } else {
                value += ch;
            }
        }
        result.push(value);
        return result.map(cell => cell.trim());
    }

    function normalizeHeader(value) {
        return clean(value).toLowerCase().replace(/[^a-z0-9]/g, "");
    }

    function firstCsvValue(row, ...names) {
        for (const name of names) {
            const key = normalizeHeader(name);
            if (row[key]) return row[key];
        }
        return "";
    }

    function parseBool(value) {
        const text = clean(value).toLowerCase();
        return ["yes", "true", "1", "y", "checked"].includes(text);
    }

    function importLegacyContent(fileName, text, project) {
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            const rows = parseCsv(text.split(/\r?\n/));
            return addPeopleFromCsvRows(rows);
        }
        if (data.schemaVersion || Array.isArray(data.people) || Array.isArray(data.tents)) {
            const incoming = normalizeProject(data);
            project.people.push(...incoming.people);
            project.tents.push(...incoming.tents);
            project.siteItems.push(...incoming.siteItems);
            project.menuItems.push(...incoming.menuItems);
            project.kitItems.push(...incoming.kitItems);
            project.choreItems.push(...incoming.choreItems);
            project.choreTeams.push(...incoming.choreTeams);
            project.choreAllocations.push(...incoming.choreAllocations);
            project.planItems.push(...incoming.planItems);
            return incoming.people.length + incoming.tents.length + incoming.menuItems.length + incoming.kitItems.length + incoming.choreItems.length;
        }
        const lower = fileName.toLowerCase();
        let count = 0;
        if (lower.endsWith(".campmenu") || Array.isArray(data.meals) || Array.isArray(data.menuItems)) {
            const meals = data.menuItems || data.meals || [];
            meals.forEach(row => {
                project.menuItems.push(mealItem({ date: row.date || row.day || project.startDate, slot: mapMealSlot(row.slot || row.mealSlot), meal: row.meal || row.food || row.name, pudding: row.pudding, dietaryNotes: row.dietaryNotes, notes: row.notes }));
                count++;
            });
        } else if (lower.endsWith(".bckit") || Array.isArray(data.kit) || Array.isArray(data.items)) {
            const items = data.kitItems || data.kit || data.items || [];
            items.forEach(row => {
                project.kitItems.push(kitItem({ name: row.name || row.item || row.kit, category: row.category || row.type, quantity: row.quantity || row.qty, status: normalizeKitStatus(row.status), owner: row.owner || "Group stores", notes: row.notes }));
                count++;
            });
        } else if (lower.endsWith(".chore") || Array.isArray(data.chores) || Array.isArray(data.allocations)) {
            (data.choreItems || data.chores || []).forEach(row => {
                project.choreItems.push(choreItem({ name: row.name || row.title, category: row.category, description: row.description }));
                count++;
            });
        } else {
            const people = data.people || data.members || data.participants || [];
            people.forEach(row => {
                project.people.push(person({ name: row.name || [row.firstName, row.lastName].filter(Boolean).join(" "), gender: mapGender(row.gender), personType: mapPersonType(row.type), dietaryNotes: row.dietaryNotes || row.allergies, medicalNotes: row.medicalNotes, notes: row.notes }));
                count++;
            });
        }
        return count;
    }

    function buildSectionFile(sectionKey) {
        const p = State.project;
        const data = {
            overview: { campName: p.campName, location: p.location, startDate: p.startDate, endDate: p.endDate, participantCountOverride: p.participantCountOverride, notes: p.notes },
            personnel: { people: p.people, choreTeams: p.choreTeams },
            "tent-allocation": { tents: p.tents, siteItems: p.siteItems, friendLinks: p.friendLinks, foeLinks: p.foeLinks, assignments: p.people.map(person => ({ personId: person.id, tentId: person.tentId })) },
            chores: { choreItems: p.choreItems, choreTeams: p.choreTeams, choreSessions: p.choreSessions, choreAllocations: p.choreAllocations },
            menu: { menuSlots: p.menuSlots, menuStartSlot: p.menuStartSlot, menuEndSlot: p.menuEndSlot, menuDayNotes: p.menuDayNotes, menuLibraryItems: p.menuLibraryItems, menuItems: p.menuItems },
            plan: { planItems: p.planItems },
            "group-kit": { kitItems: groupKit(), groupKitInventory: p.groupKitInventory },
            "participant-kit": { kitItems: participantKit(), participantKitInventory: p.participantKitInventory },
            "shopping-list": { shoppingLists: p.shoppingLists },
            exports: {}
        }[sectionKey];
        return { type: "scout-camp-section", version: 1, sectionKey, sectionLabel: SECTION_TITLES[sectionKey], data };
    }

    async function saveSection(sectionKey) {
        const sectionFile = buildSectionFile(sectionKey);
        await saveTextFile(`${safeFileName(State.project.campName)}-${sectionKey}.scoutsection`, "application/json", JSON.stringify(sectionFile, null, 2));
    }

    async function importSection(sectionKey) {
        const file = await requestFile();
        const sectionFile = JSON.parse(file.text);
        if (sectionFile.type !== "scout-camp-section" || sectionFile.sectionKey !== sectionKey) {
            throw new Error(`Choose a ${SECTION_TITLES[sectionKey]} section file.`);
        }
        mutate(`Imported ${SECTION_TITLES[sectionKey]} section.`, () => applySectionFile(sectionFile));
    }

    function applySectionFile(sectionFile) {
        const d = sectionFile.data || {};
        const p = State.project;
        switch (sectionFile.sectionKey) {
            case "overview":
                Object.assign(p, d);
                break;
            case "personnel":
                p.people = list(d.people);
                p.choreTeams = list(d.choreTeams);
                break;
            case "tent-allocation":
                p.tents = list(d.tents);
                p.siteItems = list(d.siteItems);
                p.friendLinks = list(d.friendLinks);
                p.foeLinks = list(d.foeLinks);
                list(d.assignments).forEach(row => {
                    const person = p.people.find(item => item.id === row.personId);
                    if (person) person.tentId = row.tentId || null;
                });
                break;
            case "chores":
                p.choreItems = list(d.choreItems);
                p.choreTeams = list(d.choreTeams);
                p.choreSessions = list(d.choreSessions);
                p.choreAllocations = list(d.choreAllocations);
                break;
            case "menu":
                Object.assign(p, d);
                break;
            case "plan":
                p.planItems = list(d.planItems);
                break;
            case "group-kit":
                p.kitItems = [...participantKit(), ...list(d.kitItems)];
                p.groupKitInventory = list(d.groupKitInventory);
                break;
            case "participant-kit":
                p.kitItems = [...groupKit(), ...list(d.kitItems)];
                p.participantKitInventory = list(d.participantKitInventory);
                break;
            case "shopping-list":
                p.shoppingLists = list(d.shoppingLists);
                break;
        }
    }

    async function exportCampPackPdf() {
        const lines = [];
        addExportOverview(lines);
        addExportPeople(lines);
        addExportTents(lines);
        addExportPlan(lines);
        addExportMenu(lines, false);
        addExportShopping(lines);
        addExportKit(lines, null);
        addExportChores(lines);
        await savePdf("camp-pack.pdf", "Camp pack", lines);
    }

    async function exportMenuPdf() {
        const lines = [];
        buildMenuWarnings(State.project).forEach(warning => lines.push({ text: warning, color: "red" }));
        addExportMenu(lines, false);
        await savePdf("menu.pdf", "Camp menu", lines);
    }

    async function exportKitchenMenuPdf() {
        const lines = [];
        addExportMenu(lines, true);
        await savePdf("kitchen-menu.pdf", "Kitchen menu", lines);
    }

    async function exportKitPdf() {
        const lines = [];
        addExportKit(lines, null);
        await savePdf("kit-list.pdf", "Kit list", lines);
    }

    async function exportGroupKitPdf() {
        const lines = [];
        addExportKit(lines, false);
        await savePdf("group-kit.pdf", "Group kit", lines);
    }

    async function exportParticipantKitPdf() {
        const lines = [];
        addExportKit(lines, true);
        await savePdf("participant-kit.pdf", "Participant kit", lines);
    }

    async function exportChoresPdf() {
        const lines = [];
        addExportChores(lines);
        await savePdf("chores.pdf", "Chore rota", lines);
    }

    async function exportPlanPdf() {
        const lines = [];
        addExportPlan(lines);
        await savePdf("the-plan.pdf", "The Plan", lines);
    }

    async function exportShoppingPdf() {
        const lines = [];
        addExportShopping(lines);
        await savePdf("shopping-lists.pdf", "Shopping lists", lines);
    }

    async function exportTentTablePdf() {
        const lines = [{ text: "Tent allocation table", size: 15, bold: true }];
        buildTentWarnings(State.project).forEach(warning => lines.push({ text: warning, color: "red" }));
        State.project.tents.forEach(tent => {
            const people = orderedPeople().filter(person => person.tentId === tent.id).map(person => person.name).join(", ") || "None";
            lines.push({ text: `${tent.name} - ${tent.type} | Capacity ${tent.capacity} | ${people}` });
        });
        const unallocated = orderedPeople().filter(person => !person.tentId).map(person => person.name).join(", ");
        if (unallocated) lines.push({ text: `Unallocated: ${unallocated}`, color: "red" });
        await savePdf("tent-table.pdf", "Tent allocation table", lines);
    }

    async function exportTentTagsPdf() {
        const lines = [];
        State.project.tents.forEach(tent => {
            lines.push({ text: tent.name, size: 18, bold: true });
            orderedPeople().filter(person => person.tentId === tent.id).forEach((person, index) => lines.push({ text: `${index + 1}. ${person.name}` }));
            lines.push({ text: " " });
        });
        await savePdf("tent-tags.pdf", "Tent tags", lines);
    }

    async function exportTentLayoutPdf() {
        const lines = [{ text: "Tent allocation layout", size: 15, bold: true }];
        State.project.siteItems.forEach(item => lines.push({ text: `Site item: ${item.name} (${item.type}) at ${Math.round(item.x)},${Math.round(item.y)}` }));
        State.project.tents.forEach(tent => {
            const people = orderedPeople().filter(person => person.tentId === tent.id).map(person => person.name).join(", ") || "None";
            lines.push({ text: `${tent.name} at ${Math.round(tent.x)},${Math.round(tent.y)} - ${people}` });
        });
        await savePdf("tent-layout.pdf", "Tent layout", lines);
    }

    function addExportOverview(lines) {
        lines.push({ text: "Overview", size: 15, bold: true });
        lines.push({ text: `Camp: ${State.project.campName}` });
        lines.push({ text: `Dates: ${dateRange(State.project)}` });
        lines.push({ text: `Location: ${State.project.location || "Not set"}` });
        lines.push({ text: `People: ${participantCount()} | Tents: ${State.project.tents.length} | Meals: ${activeMenuItems()} | Group kit: ${groupKit().length} | Participant kit: ${participantKit().length}` });
        if (State.project.notes) lines.push({ text: `Notes: ${State.project.notes}` });
        [...buildTentWarnings(State.project), ...buildMenuWarnings(State.project)].forEach(warning => lines.push({ text: warning, color: "red" }));
    }

    function addExportPeople(lines) {
        lines.push({ text: "Personnel", size: 15, bold: true });
        if (!State.project.people.length) lines.push({ text: "No people have been added." });
        orderedPeople().forEach(person => {
            lines.push({ text: `${person.name} - ${personRoleText(person)} | ${person.gender} | ${tentName(person.tentId) || "No tent"}${person.dietaryNotes ? " | Food: " + person.dietaryNotes : ""}${person.medicalNotes ? " | Medical: " + person.medicalNotes : ""}` });
        });
        State.project.choreTeams.forEach(team => lines.push({ text: `Team: ${team.name} - ${peopleForTeam(team.id).map(person => person.name).join(", ") || "No members"}` }));
    }

    function addExportTents(lines) {
        lines.push({ text: "Tent Allocation", size: 15, bold: true });
        State.project.tents.forEach(tent => lines.push({ text: `${tent.name} - ${tent.type} | Capacity ${tent.capacity} | ${orderedPeople().filter(person => person.tentId === tent.id).map(person => person.name).join(", ") || "None"}` }));
        State.project.siteItems.forEach(item => lines.push({ text: `Site item: ${item.name} (${item.type})` }));
    }

    function addExportMenu(lines, kitchen) {
        lines.push({ text: kitchen ? "Kitchen menu" : "Camp Menu", size: 15, bold: true });
        const dietary = State.project.people.filter(person => person.dietaryNotes);
        if (kitchen && dietary.length) {
            lines.push({ text: "People with dietary notes", bold: true, color: "red" });
            dietary.forEach(person => lines.push({ text: `${person.name}: ${person.dietaryNotes}` }));
        }
        enumerateDates(State.project.startDate, State.project.endDate).forEach(date => {
            lines.push({ text: displayDate(date, true), bold: true });
            const note = State.project.menuDayNotes.find(item => item.date === date);
            if (note) lines.push({ text: `Day note: ${note.notes}` });
            activeMealSlots(State.project, date).forEach(slot => {
                const items = State.project.menuItems.filter(item => item.date === date && item.slot === slot && hasMenuContent(item));
                if (!items.length) {
                    lines.push({ text: `${slot}: Not planned` });
                } else {
                    items.forEach(item => lines.push({ text: `${slot}: ${item.meal || "No food recorded"}${item.pudding ? " | Pudding: " + item.pudding : ""}${item.dietaryNotes ? " | Dietary: " + item.dietaryNotes : ""}${item.notes ? " | Notes: " + item.notes : ""}` }));
                }
            });
        });
    }

    function addExportPlan(lines) {
        lines.push({ text: "The Plan", size: 15, bold: true });
        enumerateDates(State.project.startDate, State.project.endDate).forEach(date => {
            lines.push({ text: displayDate(date, true), bold: true });
            const items = State.project.planItems.filter(item => item.date === date).sort((a, b) => a.startMinute - b.startMinute || a.endMinute - b.endMinute);
            if (!items.length) lines.push({ text: "No plan items." });
            items.forEach(item => lines.push({ text: `${planTime(item.startMinute)}-${planTime(item.endMinute)} ${item.title} - ${planAudienceText(item)}${item.notes ? " | " + item.notes : ""}` }));
        });
    }

    function addExportKit(lines, participant) {
        const items = participant === null ? State.project.kitItems : participant ? participantKit() : groupKit();
        lines.push({ text: participant === null ? "Kit list" : participant ? "Participant kit" : "Group kit", size: 15, bold: true });
        if (!items.length) lines.push({ text: "No kit items." });
        items.forEach(item => lines.push({ text: `[ ] ${item.name} - Qty ${formatQty(item.quantity)}${participant ? "" : " | " + item.status}${item.notes ? " | " + item.notes : ""}` }));
    }

    function addExportChores(lines) {
        lines.push({ text: "Chores", size: 15, bold: true });
        enumerateDates(State.project.startDate, State.project.endDate).forEach(date => {
            lines.push({ text: displayDate(date, true), bold: true });
            State.project.choreSessions.forEach(session => {
                const allocations = State.project.choreAllocations.filter(allocation => allocation.date === date && allocation.session === session);
                if (!allocations.length) {
                    lines.push({ text: `${session}: no allocations` });
                } else {
                    allocations.forEach(allocation => lines.push({ text: `${session}: ${choreName(allocation.choreItemId)} - ${choreAllocationAssigneeNames(allocation)}${allocation.notes ? " | " + allocation.notes : ""}` }));
                }
            });
        });
    }

    function addExportShopping(lines) {
        lines.push({ text: "Shopping lists", size: 15, bold: true });
        if (!State.project.shoppingLists.length) lines.push({ text: "No shopping lists have been added." });
        State.project.shoppingLists.forEach(listItem => {
            lines.push({ text: listItem.name, bold: true });
            listItem.items.filter(item => item.name).forEach(item => lines.push({ text: `[ ] ${item.name} - Qty ${formatQty(item.quantity)}` }));
        });
    }

    async function savePdf(fileName, title, lines) {
        const pdf = new SimplePdf(title, State.project);
        lines.forEach(line => pdf.addText(line.text, line));
        await saveBytesFile(`${safeFileName(State.project.campName)}-${fileName}`, "application/pdf", pdf.bytes());
    }

    class SimplePdf {
        constructor(title, project) {
            this.width = 595;
            this.height = 842;
            this.margin = 42;
            this.pages = [[]];
            this.y = this.margin;
            this.addText(project.campName, { size: 18, bold: true, color: "green" });
            this.addText(`${title} | ${dateRange(project)}${project.location ? " - " + project.location : ""}`, { size: 10 });
            this.y += 12;
        }
        page() { return this.pages[this.pages.length - 1]; }
        addPage() { this.pages.push([]); this.y = this.margin; }
        addText(text, options = {}) {
            const size = options.size || 9;
            const width = this.width - this.margin * 2;
            wrapText(String(text ?? ""), Math.max(20, Math.floor(width / (size * 0.52)))).forEach(line => {
                if (this.y > this.height - this.margin) this.addPage();
                this.page().push({ x: this.margin, y: this.y, text: line, size, bold: Boolean(options.bold), color: options.color || "black" });
                this.y += size + 6;
            });
            if (options.size >= 15) this.y += 4;
        }
        bytes() {
            const objects = [
                "<< /Type /Catalog /Pages 2 0 R >>",
                `<< /Type /Pages /Kids [${this.pages.map((_, index) => `${3 + index * 2} 0 R`).join(" ")}] /Count ${this.pages.length} >>`
            ];
            this.pages.forEach((page, index) => {
                const pageObjectId = 3 + index * 2;
                const contentObjectId = pageObjectId + 1;
                objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${this.width} ${this.height}] /Resources << /Font << /F1 ${3 + this.pages.length * 2} 0 R /F2 ${4 + this.pages.length * 2} 0 R >> >> /Contents ${contentObjectId} 0 R >>`);
                const content = page.map(item => `BT /F${item.bold ? 2 : 1} ${fmt(item.size)} Tf ${pdfColor(item.color)} ${fmt(item.x)} ${fmt(this.height - item.y)} Td (${pdfEscape(item.text)}) Tj ET`).join("\n");
                objects.push(`<< /Length ${asciiBytes(content).length} >>\nstream\n${content}\nendstream`);
            });
            objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
            objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
            let output = "%PDF-1.4\n";
            const offsets = [0];
            objects.forEach((object, index) => {
                offsets.push(asciiBytes(output).length);
                output += `${index + 1} 0 obj\n${object}\nendobj\n`;
            });
            const xref = asciiBytes(output).length;
            output += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
            offsets.slice(1).forEach(offset => output += `${String(offset).padStart(10, "0")} 00000 n \n`);
            output += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
            return asciiBytes(output);
        }
    }

    function wrapText(text, maxChars) {
        const lines = [];
        text.split(/\r?\n/).forEach(paragraph => {
            let line = "";
            paragraph.split(/\s+/).filter(Boolean).forEach(word => {
                if (!line) line = word;
                else if (line.length + word.length + 1 <= maxChars) line += " " + word;
                else { lines.push(line); line = word; }
            });
            lines.push(line || " ");
        });
        return lines;
    }

    function asciiBytes(text) {
        return Uint8Array.from([...text].map(ch => {
            const code = ch.charCodeAt(0);
            return code >= 32 && code <= 126 || code === 10 || code === 13 ? code : 63;
        }));
    }

    function fmt(value) {
        return Number(value).toFixed(3).replace(/\.?0+$/, "");
    }

    function pdfColor(color) {
        if (color === "green") return "0.18 0.45 0.23 rg";
        if (color === "red") return "0.75 0.16 0.16 rg";
        return "0 0 0 rg";
    }

    function pdfEscape(text) {
        return String(text ?? "").replace(/[^\x20-\x7e]/g, "?").replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
    }

    async function exportMenuRtf() {
        await saveTextFile(`${safeFileName(State.project.campName)}-menu.rtf`, "application/rtf", buildMenuRtf());
    }

    async function exportShoppingRtf() {
        await saveTextFile(`${safeFileName(State.project.campName)}-shopping-lists.rtf`, "application/rtf", buildShoppingRtf());
    }

    function buildMenuRtf() {
        const lines = [];
        addExportMenu(lines, false);
        addExportMenu(lines, true);
        return buildRtf(`${State.project.campName} - Camp menu`, lines);
    }

    function buildShoppingRtf() {
        const lines = [];
        addExportShopping(lines);
        return buildRtf(`${State.project.campName} - Shopping lists`, lines);
    }

    function buildRtf(title, lines) {
        return `{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Segoe UI;}}{\\colortbl;\\red0\\green0\\blue0;\\red46\\green115\\blue59;\\red184\\green45\\blue45;}\\paperw11907\\paperh16840\\margl900\\margr900\\margt760\\margb760\n\\pard\\qc\\b\\fs36\\cf2 ${rtfEscape(title)}\\b0\\par\n${lines.map(line => `\\pard\\ql\\fs${line.size && line.size >= 15 ? 26 : 18}${line.bold ? "\\b" : ""}\\cf${line.color === "red" ? 3 : line.color === "green" ? 2 : 1} ${rtfEscape(line.text)}${line.bold ? "\\b0" : ""}\\par`).join("\n")}\n}`;
    }

    function rtfEscape(value) {
        return String(value ?? "").replaceAll("\\", "\\\\").replaceAll("{", "\\{").replaceAll("}", "\\}").replace(/\n/g, "\\line ").replace(/[^\x00-\x7f]/g, ch => `\\u${ch.charCodeAt(0)}?`);
    }

    async function exportCsvZip() {
        const files = exportCsvFiles();
        const zip = createZip(Object.entries(files).map(([name, text]) => ({ name, bytes: textToBytes(text) })));
        await saveBytesFile(`${safeFileName(State.project.campName)}-csv-export.zip`, "application/zip", zip);
    }

    function createZip(files) {
        const localParts = [];
        const centralParts = [];
        let offset = 0;
        files.forEach(file => {
            const nameBytes = textToBytes(file.name);
            const crc = crc32(file.bytes);
            const local = concatBytes(
                u32(0x04034b50), u16(20), u16(0), u16(0), u16(0), u16(0), u32(crc), u32(file.bytes.length), u32(file.bytes.length), u16(nameBytes.length), u16(0), nameBytes, file.bytes
            );
            localParts.push(local);
            centralParts.push(concatBytes(
                u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0), u32(crc), u32(file.bytes.length), u32(file.bytes.length), u16(nameBytes.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset), nameBytes
            ));
            offset += local.length;
        });
        const central = concatBytes(...centralParts);
        const end = concatBytes(u32(0x06054b50), u16(0), u16(0), u16(files.length), u16(files.length), u32(central.length), u32(offset), u16(0));
        return concatBytes(...localParts, central, end);
    }

    function concatBytes(...parts) {
        const length = parts.reduce((sum, part) => sum + part.length, 0);
        const output = new Uint8Array(length);
        let offset = 0;
        parts.forEach(part => {
            output.set(part, offset);
            offset += part.length;
        });
        return output;
    }

    function u16(value) {
        return Uint8Array.of(value & 255, (value >>> 8) & 255);
    }

    function u32(value) {
        return Uint8Array.of(value & 255, (value >>> 8) & 255, (value >>> 16) & 255, (value >>> 24) & 255);
    }

    const CRC_TABLE = (() => {
        const table = new Uint32Array(256);
        for (let n = 0; n < 256; n++) {
            let c = n;
            for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
            table[n] = c >>> 0;
        }
        return table;
    })();

    function crc32(bytes) {
        let crc = 0xffffffff;
        for (const byte of bytes) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
        return (crc ^ 0xffffffff) >>> 0;
    }

    function buildPublicMenuHtml() {
        return `<!doctype html><html><head><meta charset="utf-8"><style>body{font-family:sans-serif;margin:24px;color:#1e2a20}h1,h2{color:#2e733b}.day{page-break-inside:avoid;border-top:2px solid #2e733b;margin-top:20px}strong{color:#173f25}</style></head><body><h1>${h(State.project.campName)}</h1><p>${h(dateRange(State.project))}</p>${enumerateDates(State.project.startDate, State.project.endDate).map(date => `<div class="day"><h2>${h(displayDate(date,true))}</h2>${activeMealSlots(State.project,date).map(slot => `<h3>${h(slot)}</h3>${State.project.menuItems.filter(item => item.date===date&&item.slot===slot&&hasMenuContent(item)).map(item => `<p><strong>${h(item.meal || "No food recorded")}</strong>${item.pudding ? " | Pudding: " + h(item.pudding) : ""}</p>`).join("") || "<p>Not planned</p>"}`).join("")}</div>`).join("")}</body></html>`;
    }

    async function hostCollaboration() {
        if (State.collab.active) throw new Error("Leave the current collaboration first.");
        const password = await promptText("Host collaboration", "Password for this collaboration");
        if (!password) return;
        const code = await collaborationHost(JSON.stringify(State.project), password);
        if (window.Android?.copyToClipboard) window.Android.copyToClipboard("Collaboration code", code);
        await alertBox("Host collaboration", `Collaboration code: ${code}\n\nThe code has been copied if clipboard access is available.`);
    }

    async function joinCollaboration() {
        if (State.collab.active) throw new Error("Leave the current collaboration first.");
        const result = await promptFields("Join collaboration", [
            { name: "code", label: "Collaboration code" },
            { name: "password", label: "Password" }
        ]);
        if (!result) return;
        if (!(await confirmBox("Join collaboration", "Joining this collaboration will replace your current project with the shared session. Continue?"))) return;
        const json = await collaborationJoin(result.code, result.password);
        State.collab.applyingRemote = true;
        State.project = normalizeProject(JSON.parse(json));
        State.collab.applyingRemote = false;
        State.dirty = false;
        saveDraft();
        render();
        setStatus(`Joined collaboration ${State.collab.code}.`);
    }

    async function leaveCollaboration() {
        if (State.collab.timer) clearInterval(State.collab.timer);
        if (State.collab.uploadTimer) clearTimeout(State.collab.uploadTimer);
        State.collab = { ...State.collab, active: false, code: "", key: null, revision: 0, timer: null, uploadTimer: null, applyingRemote: false };
        renderShell();
        setStatus("Left collaboration.");
    }

    async function collaborationHost(projectJson, password) {
        const keyData = await createCollaborationKey(password);
        for (let attempt = 0; attempt < 20; attempt++) {
            const code = generateCode();
            const exists = await fetch(`${FIREBASE_ROOT}/${SESSION_ROOT}/${code}/revision.json`).then(r => r.json());
            if (exists !== null) continue;
            const now = Date.now();
            const payload = {
                code,
                createdAt: now,
                createdBy: State.collab.clientId,
                updatedAt: now,
                updatedBy: State.collab.clientId,
                revision: now,
                encryptionVersion: 1,
                encryptionAlgorithm: "AES-256-GCM",
                kdf: "PBKDF2-SHA256",
                kdfIterations: 250000,
                salt: keyData.salt,
                encryptedProject: await encryptProjectJson(projectJson, keyData.key)
            };
            await firebasePut(code, payload);
            startCollaboration(code, keyData.key, now);
            return code;
        }
        throw new Error("Could not generate a free collaboration code. Please try again.");
    }

    async function collaborationJoin(code, password) {
        code = normalizeCode(code);
        const payload = await firebaseGet(code);
        const key = await deriveCollaborationKey(password, payload.salt, payload.kdfIterations);
        const json = await decryptProjectJson(payload.encryptedProject, key);
        startCollaboration(code, key, payload.revision || 0);
        return json;
    }

    function startCollaboration(code, key, revision) {
        State.collab.active = true;
        State.collab.code = code;
        State.collab.key = key;
        State.collab.revision = revision;
        State.collab.timer = setInterval(pollCollaboration, 4000);
        renderShell();
        setStatus(`Collaborating: ${code}`);
    }

    async function pollCollaboration() {
        if (!State.collab.active) return;
        try {
            const payload = await firebaseGet(State.collab.code);
            if (!payload || payload.updatedBy === State.collab.clientId || !payload.revision || payload.revision <= State.collab.revision) return;
            const json = await decryptProjectJson(payload.encryptedProject, State.collab.key);
            State.collab.applyingRemote = true;
            State.project = normalizeProject(JSON.parse(json));
            State.collab.applyingRemote = false;
            State.collab.revision = payload.revision;
            State.dirty = false;
            saveDraft();
            render();
            setStatus(`Received collaboration update: ${State.collab.code}.`);
        } catch (error) {
            setStatus(`Collaboration connection problem. ${error.message}`);
        }
    }

    function scheduleCollaborationUpload() {
        if (!State.collab.active || State.collab.applyingRemote) return;
        if (State.collab.uploadTimer) clearTimeout(State.collab.uploadTimer);
        State.collab.uploadTimer = setTimeout(pushCollaboration, 1200);
    }

    async function pushCollaboration() {
        if (!State.collab.active || !State.collab.key) return;
        const now = Date.now();
        const payload = {
            updatedAt: now,
            updatedBy: State.collab.clientId,
            revision: now,
            encryptedProject: await encryptProjectJson(JSON.stringify(State.project), State.collab.key)
        };
        await firebasePatch(State.collab.code, payload);
        State.collab.revision = now;
    }

    async function createCollaborationKey(password) {
        const saltBytes = crypto.getRandomValues(new Uint8Array(32));
        const salt = bytesToBase64(saltBytes);
        return { salt, key: await deriveCollaborationKey(password, salt, 250000) };
    }

    async function deriveCollaborationKey(password, saltBase64, iterations) {
        if (!clean(password)) throw new Error("Enter a collaboration password.");
        const material = await crypto.subtle.importKey("raw", textToBytes(password), "PBKDF2", false, ["deriveKey"]);
        return crypto.subtle.deriveKey({ name: "PBKDF2", salt: base64ToBytes(saltBase64), iterations: iterations || 250000, hash: "SHA-256" }, material, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
    }

    async function encryptProjectJson(projectJson, key) {
        const nonce = crypto.getRandomValues(new Uint8Array(12));
        const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce, additionalData: textToBytes(COLLAB_AAD), tagLength: 128 }, key, textToBytes(projectJson)));
        return {
            version: 1,
            algorithm: "AES-256-GCM",
            nonce: bytesToBase64(nonce),
            tag: bytesToBase64(encrypted.slice(encrypted.length - 16)),
            ciphertext: bytesToBase64(encrypted.slice(0, encrypted.length - 16))
        };
    }

    async function decryptProjectJson(payload, key) {
        if (!payload) throw new Error("Encrypted collaboration data is missing.");
        const cipher = concatBytes(base64ToBytes(payload.ciphertext), base64ToBytes(payload.tag));
        const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: base64ToBytes(payload.nonce), additionalData: textToBytes(COLLAB_AAD), tagLength: 128 }, key, cipher);
        return bytesToText(new Uint8Array(plain));
    }

    function generateCode() {
        const bytes = crypto.getRandomValues(new Uint8Array(6));
        return [...bytes].map(byte => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join("");
    }

    function normalizeCode(code) {
        const normalized = clean(code).replace(/[^A-Za-z0-9]/g, "").toUpperCase();
        if (normalized.length < 4 || normalized.length > 12 || [...normalized].some(ch => !CODE_ALPHABET.includes(ch))) {
            throw new Error("Enter a valid collaboration code.");
        }
        return normalized;
    }

    async function firebaseGet(code) {
        const response = await fetch(`${FIREBASE_ROOT}/${SESSION_ROOT}/${normalizeCode(code)}.json`);
        if (!response.ok) throw new Error(`Firebase returned ${response.status}.`);
        const payload = await response.json();
        if (!payload) throw new Error("That collaboration code was not found.");
        return payload;
    }

    async function firebasePut(code, payload) {
        const response = await fetch(`${FIREBASE_ROOT}/${SESSION_ROOT}/${normalizeCode(code)}.json`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error(`Firebase returned ${response.status}.`);
    }

    async function firebasePatch(code, payload) {
        const response = await fetch(`${FIREBASE_ROOT}/${SESSION_ROOT}/${normalizeCode(code)}.json`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error(`Firebase returned ${response.status}.`);
    }

    function about() {
        const body = document.createElement("div");
        body.innerHTML = `
            <p><strong>Scout Camp Planner / Camp Planner</strong></p>
            <p>Version 060626.</p>
            <p>This Android version keeps the unified camp project, imports, exports, collaboration, people, teams, tents, chores, menu, plan, kit and shopping lists together for phone and tablet use.</p>
            <p>The author is not paid for the program and makes it out of love for making life easier for people. For tips, bugs, feedback and feature requests, visit Bearcamp.co.uk.</p>
            <p><a href="https://bearcamp.co.uk/">Bearcamp.co.uk</a></p>`;
        showModal("About Scout Camp Planner", body, [{ label: "Close", value: "close", className: "secondary" }]);
    }

    function setLanguage(language) {
        mutate("Updated language.", () => {
            State.project.languageCode = language;
        });
        setStatus(`Language set to ${language}.`);
    }
})();
