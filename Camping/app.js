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
        camperTypeSquirrel: "Squirrel",
        camperTypeBeaver: "Beaver",
        camperTypeCub: "Cub",
        camperTypeScout: "Scout",
        camperTypeExplorer: "Explorer",
        accommodationTent: "Tent",
        accommodationBunkRoom: "Bunk room",
        accommodationCaravanMotorhome: "Caravan/motorhome",
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
    const CAMPER_TYPES = [TERMS.camperTypeStandard, TERMS.camperTypeSquirrel, TERMS.camperTypeBeaver, TERMS.camperTypeCub, TERMS.camperTypeScout, TERMS.camperTypeExplorer];
    const ACCOMMODATION_TYPES = [TERMS.accommodationTent, TERMS.accommodationBunkRoom, TERMS.accommodationCaravanMotorhome];
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
    const TENT_TYPES = ["Patrol tent", "Dome tent", "Hike tent", "Leader tent", "Bunk room", "Caravan/motorhome", "Other tent"];
    const SITE_ITEM_TYPES = ["Mess tent", "Storage tent", "Kitchen tent", "Event shelter", "Flag pole", "Fire"];
    const PLAN_BOUNDARIES = [TERMS.planBoundaryArrive, TERMS.planBoundaryWakeUp, TERMS.planBoundaryLightsOut, TERMS.planBoundaryGoHome];
    const BUDGET_PERSON_CAMPER = "Camper";
    const BUDGET_PERSON_YOUNG_LEADER = "Young Leader";
    const BUDGET_PERSON_ADULT = "Adult";
    const BUDGET_PERSON_TYPES = [BUDGET_PERSON_CAMPER, BUDGET_PERSON_YOUNG_LEADER, BUDGET_PERSON_ADULT];
    const BUDGET_CAMPER_TYPES = [TERMS.camperTypeSquirrel, TERMS.camperTypeBeaver, TERMS.camperTypeCub, TERMS.camperTypeScout, TERMS.camperTypeExplorer, TERMS.camperTypeStandard];
    const BUDGET_CONTRIBUTION_STANDARD = "Standard";
    const BUDGET_CONTRIBUTION_EXCLUDED = "Excluded";
    const BUDGET_CONTRIBUTION_EXACT = "Exact amount";
    const BUDGET_CONTRIBUTION_FOOD_ONLY = "Food only";
    const BUDGET_CONTRIBUTION_DAY_VISITOR_RATE = "Day visitor rate";
    const BUDGET_CONTRIBUTION_RULES = [BUDGET_CONTRIBUTION_STANDARD, BUDGET_CONTRIBUTION_EXCLUDED, BUDGET_CONTRIBUTION_EXACT, BUDGET_CONTRIBUTION_FOOD_ONLY, BUDGET_CONTRIBUTION_DAY_VISITOR_RATE];
    const BUDGET_LEADERS_PAY_STANDARD = "Leaders pay Standard";
    const BUDGET_LEADERS_PAY_NOTHING = "Leaders pay nothing";
    const BUDGET_LEADERS_PAY_FOOD_ONLY = "Leaders pay food only";
    const BUDGET_LEADERS_PAY_EXACT = "Leaders pay an exact amount";
    const BUDGET_LEADER_RULES = [BUDGET_LEADERS_PAY_STANDARD, BUDGET_LEADERS_PAY_NOTHING, BUDGET_LEADERS_PAY_FOOD_ONLY, BUDGET_LEADERS_PAY_EXACT];
    const BUDGET_YOUNG_LEADERS_AS_CAMPERS = "Young Leaders pay as campers";
    const BUDGET_YOUNG_LEADERS_AS_LEADERS = "Young Leaders pay as leaders";
    const BUDGET_YOUNG_LEADERS_PAY_STANDARD = "Young Leaders pay Standard";
    const BUDGET_YOUNG_LEADERS_PAY_NOTHING = "Young Leaders pay nothing";
    const BUDGET_YOUNG_LEADERS_PAY_FOOD_ONLY = "Young Leaders pay food only";
    const BUDGET_YOUNG_LEADERS_PAY_EXACT = "Young Leaders pay an exact amount";
    const BUDGET_YOUNG_LEADER_RULES = [BUDGET_YOUNG_LEADERS_AS_CAMPERS, BUDGET_YOUNG_LEADERS_AS_LEADERS, BUDGET_YOUNG_LEADERS_PAY_STANDARD, BUDGET_YOUNG_LEADERS_PAY_NOTHING, BUDGET_YOUNG_LEADERS_PAY_FOOD_ONLY, BUDGET_YOUNG_LEADERS_PAY_EXACT];
    const BUDGET_DAY_VISITORS_PAY_NOTHING = "Day visitors pay nothing";
    const BUDGET_DAY_VISITORS_PAY_DAY_RATE = "Day visitors pay day rate";
    const BUDGET_DAY_VISITORS_PAY_FOOD_ONLY = "Day visitors pay food only";
    const BUDGET_DAY_VISITORS_PAY_EXACT = "Day visitors pay an exact amount";
    const BUDGET_DAY_VISITORS_PAY_STANDARD = "Day visitors pay Standard";
    const BUDGET_DAY_VISITOR_RULES = [BUDGET_DAY_VISITORS_PAY_NOTHING, BUDGET_DAY_VISITORS_PAY_DAY_RATE, BUDGET_DAY_VISITORS_PAY_FOOD_ONLY, BUDGET_DAY_VISITORS_PAY_EXACT, BUDGET_DAY_VISITORS_PAY_STANDARD];
    const BUDGET_COST_FIXED = "Fixed total cost";
    const BUDGET_COST_QUANTITY = "Quantity x unit cost";
    const BUDGET_COST_PER_PERSON = "Per person";
    const BUDGET_COST_PER_CAMPER = "Per camper";
    const BUDGET_COST_PER_NIGHT = "Per night";
    const BUDGET_COST_PER_DAY = "Per day";
    const BUDGET_COST_METHODS = [BUDGET_COST_FIXED, BUDGET_COST_QUANTITY, BUDGET_COST_PER_PERSON, BUDGET_COST_PER_CAMPER, BUDGET_COST_PER_NIGHT, BUDGET_COST_PER_DAY];
    const BUDGET_IMPORTED_ACTIVITY_MARKER = "Imported from this camp plan.";
    const BUDGET_CURRENCY_OPTIONS = [
        ["£", "£"],
        ["$", "$"],
        ["€", "€"],
        ["¥", "¥"],
        ["A$", "A$"],
        ["C$", "C$"],
        ["CHF", "CHF"],
        ["kr", "kr"],
        ["", "None"]
    ];

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


    // Item 5: real SVG pictograms for each section — previously single uppercase
    // letters that read as unfinished placeholders next to the otherwise
    // considered visual design of the rest of the app.
    // All icons share the same style: 24×24 viewBox, stroke-based line icons,
    // 1.8px stroke-width, round caps, currentColor so they inherit active/inactive tint.
    const SECTION_ICONS = {
        "overview": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>`,
        "personnel": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="8" r="3"/><path d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="8" r="2.5"/><path d="M22 20c0-2.8-2.2-5-5-5"/></svg>`,
        "tent-allocation": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3L3 18h18L12 3z"/><path d="M12 3l4 15"/><path d="M12 3L8 18"/><path d="M6 18h12"/></svg>`,
        "chores": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12l2 2 4-4"/></svg>`,
        "menu": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/><circle cx="19" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="19" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg>`,
        "plan": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h1M12 14h1M16 14h1M8 18h1M12 18h1"/></svg>`,
        "group-kit": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16v13a1 1 0 01-1 1H5a1 1 0 01-1-1V7z"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/><path d="M9 12h6M12 9v6"/></svg>`,
        "participant-kit": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 20h2a2 2 0 002-2V9l-5-5H6a2 2 0 00-2 2v12a2 2 0 002 2h2"/><path d="M14 3v5h5"/><circle cx="12" cy="15" r="3"/><path d="M12 12v1"/></svg>`,
        "shopping-list": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/></svg>`,
        "budget": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h10M7 13h4M15 13h2M7 17h2M12 17h5"/></svg>`,
        "exports": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`
    };

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
        ["budget", "Budget", "Costs & charges", "B"],
        ["exports", "Exports", "Print & share", "E"]
    ].map(([id, title, subtitle, icon]) => ({ id, title, subtitle, icon, shortTitle: title.replace("Kit List (group)", "Group Kit").replace("Kit List (Participant)", "My Kit").replace("Shopping List", "Shopping").replace("The Plan", "Plan").replace("Tent Allocation", "Tents").replace("Personnel", "People").replace("Exports", "Export") }));

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
        choresTab: "assign",
        navCollapsed: false,
        dirty: false,
        fileName: "camp.scoutcamp",
        undo: [],
        redo: [],
        filters: {},
        sort: { people: "group", groupKit: "name", participantKit: "name", budgetPeople: "name", budgetPeopleDir: "asc" },
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
            applyingRemote: false,
            lastRemoteAt: 0,
            pendingPush: false,
            uploadInFlight: false,
            uploadQueued: false,
            lastSnapshot: "",
            lastSyncedAt: 0,
            etag: null,
            badgeTimer: null
        },
        pendingFiles: new Map()
    };

    // ── Language / translation ────────────────────────────────────────────────

    const LANG_DICTS = {
        es: {
            "Overview": "Resumen",
            "Personnel": "Personal",
            "Tent Allocation": "Asignación de tiendas",
            "Chores": "Tareas",
            "Menu": "Menú",
            "The Plan": "El Plan",
            "Kit List (group)": "Lista de equipo (grupo)",
            "Kit List (Participant)": "Lista de equipo (participante)",
            "Shopping List": "Lista de compras",
            "Budget": "Presupuesto",
            "Exports": "Exportaciones",
            "Camp details": "Detalles del campamento",
            "People & teams": "Personas y equipos",
            "Sleeping plan": "Plan de alojamiento",
            "Rota jobs": "Tareas de turno",
            "Meals & diets": "Comidas y dietas",
            "Daily timeline": "Cronograma diario",
            "Stores kit": "Equipamiento general",
            "Personal kit": "Equipamiento personal",
            "Buying lists": "Listas de compra",
            "Costs & charges": "Costes y cuotas",
            "Print & share": "Imprimir y compartir",
            "Add person": "Añadir persona",
            "Add team": "Añadir equipo",
            "Add tent": "Añadir tienda",
            "Add item": "Añadir artículo",
            "Add meal": "Añadir comida",
            "Save": "Guardar",
            "Cancel": "Cancelar",
            "Remove": "Eliminar",
            "Edit": "Editar",
            "Name": "Nombre",
            "Notes": "Notas",
            "Date": "Fecha",
            "Ready": "Listo",
            "Unsaved changes": "Cambios sin guardar",
            "No location set": "Sin ubicación",
            "people": "personas",
            "tents": "tiendas",
            "meals": "comidas",
            "group kit": "equipo grupal",
            "participant kit": "equipo personal",
            "Breakfast": "Desayuno",
            "Dinner": "Almuerzo",
            "Tea": "Cena",
            "Extra": "Extra",
            "Camper": "Campista",
            "Young Leader": "Joven Líder",
            "Adult": "Adulto",
            "Male": "Masculino",
            "Female": "Femenino",
            "Other": "Otro",
            "Not set": "No definido"
        },
        fr: {
            "Overview": "Vue d'ensemble",
            "Personnel": "Personnel",
            "Tent Allocation": "Attribution des tentes",
            "Chores": "Corvées",
            "Menu": "Menu",
            "The Plan": "Le Programme",
            "Kit List (group)": "Liste d'équipement (groupe)",
            "Kit List (Participant)": "Liste d'équipement (participant)",
            "Shopping List": "Liste de courses",
            "Budget": "Budget",
            "Exports": "Exportations",
            "Camp details": "Détails du camp",
            "People & teams": "Personnes et équipes",
            "Sleeping plan": "Plan de couchage",
            "Rota jobs": "Tâches de permanence",
            "Meals & diets": "Repas et régimes",
            "Daily timeline": "Programme journalier",
            "Stores kit": "Matériel collectif",
            "Personal kit": "Matériel personnel",
            "Buying lists": "Listes d'achats",
            "Costs & charges": "Coûts et tarifs",
            "Print & share": "Imprimer et partager",
            "Add person": "Ajouter une personne",
            "Add team": "Ajouter une équipe",
            "Add tent": "Ajouter une tente",
            "Add item": "Ajouter un article",
            "Add meal": "Ajouter un repas",
            "Save": "Enregistrer",
            "Cancel": "Annuler",
            "Remove": "Supprimer",
            "Edit": "Modifier",
            "Name": "Nom",
            "Notes": "Notes",
            "Date": "Date",
            "Ready": "Prêt",
            "Unsaved changes": "Modifications non enregistrées",
            "No location set": "Aucun lieu défini",
            "people": "personnes",
            "tents": "tentes",
            "meals": "repas",
            "group kit": "équipement collectif",
            "participant kit": "équipement personnel",
            "Breakfast": "Petit-déjeuner",
            "Dinner": "Déjeuner",
            "Tea": "Dîner",
            "Extra": "Supplément",
            "Camper": "Campeur",
            "Young Leader": "Jeune Responsable",
            "Adult": "Adulte",
            "Male": "Masculin",
            "Female": "Féminin",
            "Other": "Autre",
            "Not set": "Non défini"
        }
    };

    function L(key) {
        const lang = State.project?.languageCode;
        if (!lang || lang === TERMS.languageEnglish) return key;
        return LANG_DICTS[lang]?.[key] ?? key;
    }

    // ─────────────────────────────────────────────────────────────────────────

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
            shoppingLists: [],
            budget: createBudgetState()
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
        // Item 20: PDF export page size preference
        project.paperSize = ["a4", "letter"].includes(project.paperSize) ? project.paperSize : "a4";
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
        project.budget = normalizeBudget(project.budget);

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
        syncBudgetPeople(project);
        normalizeBudgetCosts(project);
        updateBudgetCalculatedCosts(project);
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
                : clean(tent.type).toLowerCase().includes("caravan") || clean(tent.type).toLowerCase().includes("motorhome") ? TERMS.accommodationCaravanMotorhome
                : clean(tent.type).toLowerCase().includes("bunk") ? TERMS.accommodationBunkRoom : TERMS.accommodationTent;
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
                item.checked = Boolean(item.checked);
            });
        });
    }

    function createBudgetState(data = {}) {
        const settings = normalizeBudgetSettings(data.settings || {});
        return {
            ...data,
            settings,
            people: list(data.people).map(budgetPerson),
            costItems: list(data.costItems).map(budgetCostItem),
            importedSourceSummary: clean(data.importedSourceSummary)
        };
    }

    function normalizeBudget(value) {
        return createBudgetState(value && typeof value === "object" ? value : {});
    }

    function normalizeBudgetSettings(settings = {}) {
        return {
            ...settings,
            leaderRule: mapBudgetLeaderRule(settings.leaderRule),
            youngLeaderRule: mapBudgetYoungLeaderRule(settings.youngLeaderRule),
            dayVisitorRule: mapBudgetDayVisitorRule(settings.dayVisitorRule),
            proposedStandardCharge: nonNegative(settings.proposedStandardCharge),
            foodOnlyAmount: nonNegative(settings.foodOnlyAmount),
            leaderContributionAmount: nonNegative(settings.leaderContributionAmount),
            youngLeaderContributionAmount: nonNegative(settings.youngLeaderContributionAmount),
            dayVisitorDayRate: nonNegative(settings.dayVisitorDayRate),
            dayVisitorCustomContributionAmount: nonNegative(settings.dayVisitorCustomContributionAmount),
            currencySymbol: normalizeBudgetCurrency(settings.currencySymbol),
            foodCostPerPersonPerDay: nonNegative(settings.foodCostPerPersonPerDay),
            foodDays: Math.max(0, Math.round(number(settings.foodDays, 3))),
            foodPeopleBasis: "All people",
            notes: clean(settings.notes)
        };
    }

    function budgetPerson(data = {}) {
        return {
            ...data,
            id: clean(data.id, uid()),
            personId: clean(data.personId),
            name: clean(data.name, "Unnamed person"),
            personType: mapBudgetPersonType(data.personType),
            camperType: mapBudgetCamperType(data.camperType),
            isDayVisitor: Boolean(data.isDayVisitor),
            contributionRule: mapBudgetContributionRule(data.contributionRule),
            contributionAmount: nonNegative(data.contributionAmount),
            notes: clean(data.notes)
        };
    }

    function budgetCostItem(data = {}) {
        const method = mapBudgetCostMethod(data.calculationMethod);
        const cost = nonNegative(data.cost ?? data.estimatedCost);
        return {
            ...data,
            id: clean(data.id, uid()),
            description: clean(data.description, "Budget cost"),
            calculationMethod: method,
            quantity: method === BUDGET_COST_FIXED ? 1 : Math.max(0.0001, number(data.quantity, 1)),
            unitCost: method === BUDGET_COST_FIXED ? cost : nonNegative(data.unitCost),
            cost,
            notes: clean(data.notes)
        };
    }

    function normalizeBudgetCosts(project) {
        const ids = new Set();
        project.budget.costItems = project.budget.costItems.map(item => {
            const normalized = budgetCostItem(item);
            normalized.id = uniqueId(normalized.id, ids);
            return normalized;
        });
    }

    function syncBudgetPeople(project) {
        project.budget = normalizeBudget(project.budget);
        const existingByPerson = new Map(project.budget.people.filter(p => p.personId).map(p => [p.personId, p]));
        const usedIds = new Set();
        const synced = orderedProjectPeople(project).map(personItem => {
            const existing = existingByPerson.get(personItem.id) || {};
            const result = budgetPerson({
                ...existing,
                personId: personItem.id,
                name: clean(personItem.name, "Unnamed person"),
                personType: mapProjectPersonToBudgetType(personItem),
                camperType: mapBudgetCamperType(personItem.camperType),
                isDayVisitor: Boolean(personItem.isDayVisitor)
            });
            result.id = uniqueId(result.id, usedIds);
            return result;
        });
        project.budget.people = synced;
    }

    function orderedProjectPeople(project) {
        const group = personItem => {
            if (personItem.personType === TERMS.personTypeYoungPerson) {
                return ["Squirrel", "Beaver", "Cub", "Scout", "Explorer", "Standard"].indexOf(personItem.camperType) + 1 || 6;
            }
            if (personItem.personType === TERMS.personTypeYoungLeader) return 20;
            return 30;
        };
        return [...project.people].sort((a, b) => group(a) - group(b) || localeSort(a.name, b.name));
    }

    function pushBudgetPeopleToProject(project = State.project) {
        const peopleById = new Map(project.people.map(personItem => [personItem.id, personItem]));
        project.budget.people.forEach(budgetRow => {
            const personItem = peopleById.get(budgetRow.personId);
            if (!personItem) return;
            if (clean(budgetRow.name)) personItem.name = clean(budgetRow.name);
            personItem.personType = budgetRow.personType === BUDGET_PERSON_ADULT
                ? TERMS.personTypeAdult
                : budgetRow.personType === BUDGET_PERSON_YOUNG_LEADER
                    ? TERMS.personTypeYoungLeader
                    : TERMS.personTypeYoungPerson;
            personItem.camperType = CAMPER_TYPES.includes(budgetRow.camperType) ? budgetRow.camperType : TERMS.camperTypeStandard;
            personItem.isDayVisitor = Boolean(budgetRow.isDayVisitor);
        });
    }

    function nonNegative(value) {
        return Math.max(0, number(value, 0));
    }

    function normalizeBudgetCurrency(symbol) {
        const cleaned = symbol == null ? "£" : String(symbol).trim();
        return BUDGET_CURRENCY_OPTIONS.some(option => option[0] === cleaned) ? cleaned : "£";
    }

    function budgetCurrencyLabel(symbol) {
        const normalized = normalizeBudgetCurrency(symbol);
        return BUDGET_CURRENCY_OPTIONS.find(option => option[0] === normalized)?.[1] || "£";
    }

    function formatBudgetMoney(value, project = State.project) {
        const symbol = normalizeBudgetCurrency(project?.budget?.settings?.currencySymbol);
        const sign = number(value, 0) < 0 ? "-" : "";
        const amount = Math.abs(number(value, 0)).toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        if (!symbol) return sign + amount;
        const spacer = /^[A-Za-z]+$/.test(symbol) ? " " : "";
        return `${sign}${symbol}${spacer}${amount}`;
    }

    function mapBudgetPersonType(value) {
        const text = clean(value).toLowerCase();
        if (text.includes("adult") || text === "leader") return BUDGET_PERSON_ADULT;
        if (text.includes("young") && text.includes("leader")) return BUDGET_PERSON_YOUNG_LEADER;
        return BUDGET_PERSON_CAMPER;
    }

    function mapProjectPersonToBudgetType(personItem) {
        if (personItem.personType === TERMS.personTypeAdult) return BUDGET_PERSON_ADULT;
        if (personItem.personType === TERMS.personTypeYoungLeader) return BUDGET_PERSON_YOUNG_LEADER;
        return BUDGET_PERSON_CAMPER;
    }

    function mapBudgetCamperType(value) {
        const mapped = mapCamperType(value);
        return BUDGET_CAMPER_TYPES.includes(mapped) ? mapped : TERMS.camperTypeStandard;
    }

    function mapBudgetContributionRule(value) {
        const cleaned = clean(value);
        if (BUDGET_CONTRIBUTION_RULES.includes(cleaned)) return cleaned;
        if (["Custom fixed amount", "Percentage of Standard", "Percentage of Standard charge"].includes(cleaned)) return BUDGET_CONTRIBUTION_EXACT;
        return BUDGET_CONTRIBUTION_STANDARD;
    }

    function mapBudgetLeaderRule(value) {
        const cleaned = clean(value);
        if (cleaned === "Leaders pay a contribution") return BUDGET_LEADERS_PAY_EXACT;
        return BUDGET_LEADER_RULES.includes(cleaned) ? cleaned : BUDGET_LEADERS_PAY_STANDARD;
    }

    function mapBudgetYoungLeaderRule(value) {
        const cleaned = clean(value);
        if (cleaned === "Young Leaders pay a contribution") return BUDGET_YOUNG_LEADERS_PAY_EXACT;
        return BUDGET_YOUNG_LEADER_RULES.includes(cleaned) ? cleaned : BUDGET_YOUNG_LEADERS_AS_CAMPERS;
    }

    function mapBudgetDayVisitorRule(value) {
        const cleaned = clean(value);
        if (cleaned === "Day visitors pay custom contribution") return BUDGET_DAY_VISITORS_PAY_EXACT;
        return BUDGET_DAY_VISITOR_RULES.includes(cleaned) ? cleaned : BUDGET_DAY_VISITORS_PAY_NOTHING;
    }

    function mapBudgetCostMethod(value) {
        const cleaned = clean(value);
        if ([BUDGET_COST_FIXED, "Manual custom amount"].includes(cleaned)) return BUDGET_COST_FIXED;
        if ([BUDGET_COST_QUANTITY, "Per group/team", "Per activity group"].includes(cleaned)) return BUDGET_COST_QUANTITY;
        if ([BUDGET_COST_PER_PERSON, "Per paying person", "Per Standard-paying person", "Per person per day", "Per person per night"].includes(cleaned)) return BUDGET_COST_PER_PERSON;
        if ([BUDGET_COST_PER_CAMPER, "Per camper per night"].includes(cleaned)) return BUDGET_COST_PER_CAMPER;
        if (cleaned === BUDGET_COST_PER_NIGHT) return BUDGET_COST_PER_NIGHT;
        if (cleaned === BUDGET_COST_PER_DAY) return BUDGET_COST_PER_DAY;
        return BUDGET_COST_FIXED;
    }

    function budgetCounts(project = State.project) {
        const people = project.budget.people;
        return {
            campers: people.filter(p => p.personType === BUDGET_PERSON_CAMPER && !p.isDayVisitor).length,
            youngLeaders: people.filter(p => p.personType === BUDGET_PERSON_YOUNG_LEADER && !p.isDayVisitor).length,
            adults: people.filter(p => p.personType === BUDGET_PERSON_ADULT && !p.isDayVisitor).length,
            dayVisitors: people.filter(p => p.isDayVisitor).length,
            get totalPeople() { return this.campers + this.youngLeaders + this.adults + this.dayVisitors; }
        };
    }

    function budgetDurationDays(project = State.project) {
        return Math.max(1, Math.round((parseDate(project.endDate) - parseDate(project.startDate)) / 86400000) + 1);
    }

    function budgetDurationNights(project = State.project) {
        return Math.max(0, budgetDurationDays(project) - 1);
    }

    function budgetFoodTotal(project = State.project) {
        const counts = budgetCounts(project);
        return project.budget.settings.foodCostPerPersonPerDay * counts.totalPeople * Math.max(0, project.budget.settings.foodDays);
    }

    function isImportedBudgetActivityCost(item) {
        return clean(item.notes).toLowerCase().includes(BUDGET_IMPORTED_ACTIVITY_MARKER.toLowerCase())
            || clean(item.description).toLowerCase().startsWith("activity:");
    }

    function calculateBudgetCostItem(project, item, counts = budgetCounts(project), standardPayingPeople = 0) {
        switch (item.calculationMethod) {
            case BUDGET_COST_FIXED:
                return nonNegative(item.cost);
            case BUDGET_COST_QUANTITY:
                return nonNegative(item.quantity) * nonNegative(item.unitCost);
            case BUDGET_COST_PER_PERSON:
                return counts.totalPeople * nonNegative(item.unitCost);
            case BUDGET_COST_PER_CAMPER:
                return counts.campers * nonNegative(item.unitCost);
            case BUDGET_COST_PER_NIGHT:
                return budgetDurationNights(project) * nonNegative(item.unitCost);
            case BUDGET_COST_PER_DAY:
                return budgetDurationDays(project) * nonNegative(item.unitCost);
            default:
                return nonNegative(item.cost);
        }
    }

    function effectiveBudgetContributionRule(settings, personRow) {
        if (personRow.contributionRule !== BUDGET_CONTRIBUTION_STANDARD) {
            return personRow.contributionRule;
        }
        if (personRow.isDayVisitor) return effectiveBudgetDayVisitorRule(settings);
        if (personRow.personType === BUDGET_PERSON_ADULT) return effectiveBudgetLeaderRule(settings);
        if (personRow.personType === BUDGET_PERSON_YOUNG_LEADER) return effectiveBudgetYoungLeaderRule(settings);
        return BUDGET_CONTRIBUTION_STANDARD;
    }

    function effectiveBudgetLeaderRule(settings) {
        if (settings.leaderRule === BUDGET_LEADERS_PAY_NOTHING) return BUDGET_CONTRIBUTION_EXCLUDED;
        if (settings.leaderRule === BUDGET_LEADERS_PAY_FOOD_ONLY) return BUDGET_CONTRIBUTION_FOOD_ONLY;
        if (settings.leaderRule === BUDGET_LEADERS_PAY_EXACT) return BUDGET_LEADERS_PAY_EXACT;
        return BUDGET_CONTRIBUTION_STANDARD;
    }

    function effectiveBudgetYoungLeaderRule(settings) {
        if (settings.youngLeaderRule === BUDGET_YOUNG_LEADERS_AS_LEADERS) return effectiveBudgetLeaderRule(settings);
        if (settings.youngLeaderRule === BUDGET_YOUNG_LEADERS_PAY_NOTHING) return BUDGET_CONTRIBUTION_EXCLUDED;
        if (settings.youngLeaderRule === BUDGET_YOUNG_LEADERS_PAY_FOOD_ONLY) return BUDGET_CONTRIBUTION_FOOD_ONLY;
        if (settings.youngLeaderRule === BUDGET_YOUNG_LEADERS_PAY_EXACT) return BUDGET_YOUNG_LEADERS_PAY_EXACT;
        return BUDGET_CONTRIBUTION_STANDARD;
    }

    function effectiveBudgetDayVisitorRule(settings) {
        if (settings.dayVisitorRule === BUDGET_DAY_VISITORS_PAY_DAY_RATE) return BUDGET_CONTRIBUTION_DAY_VISITOR_RATE;
        if (settings.dayVisitorRule === BUDGET_DAY_VISITORS_PAY_FOOD_ONLY) return BUDGET_CONTRIBUTION_FOOD_ONLY;
        if (settings.dayVisitorRule === BUDGET_DAY_VISITORS_PAY_EXACT) return BUDGET_DAY_VISITORS_PAY_EXACT;
        if (settings.dayVisitorRule === BUDGET_DAY_VISITORS_PAY_STANDARD) return BUDGET_CONTRIBUTION_STANDARD;
        return BUDGET_CONTRIBUTION_EXCLUDED;
    }

    function budgetContributionProfile(project = State.project) {
        const settings = project.budget.settings;
        const profile = { fixedContributionIncome: 0, standardChargeCoefficient: 0, standardPayingPeople: 0, payingPeople: 0 };
        const add = (rule, exactAmount) => {
            if (rule === BUDGET_CONTRIBUTION_STANDARD) {
                profile.standardChargeCoefficient += 1;
                profile.standardPayingPeople += 1;
                profile.payingPeople += 1;
            } else if (rule === BUDGET_CONTRIBUTION_EXACT) {
                profile.fixedContributionIncome += nonNegative(exactAmount);
                if (nonNegative(exactAmount) > 0) profile.payingPeople += 1;
            } else if (rule === BUDGET_CONTRIBUTION_FOOD_ONLY) {
                profile.fixedContributionIncome += settings.foodOnlyAmount;
                if (settings.foodOnlyAmount > 0) profile.payingPeople += 1;
            } else if (rule === BUDGET_CONTRIBUTION_DAY_VISITOR_RATE) {
                profile.fixedContributionIncome += settings.dayVisitorDayRate;
                if (settings.dayVisitorDayRate > 0) profile.payingPeople += 1;
            } else if (rule === BUDGET_LEADERS_PAY_EXACT) {
                profile.fixedContributionIncome += settings.leaderContributionAmount;
                if (settings.leaderContributionAmount > 0) profile.payingPeople += 1;
            } else if (rule === BUDGET_YOUNG_LEADERS_PAY_EXACT) {
                profile.fixedContributionIncome += settings.youngLeaderContributionAmount;
                if (settings.youngLeaderContributionAmount > 0) profile.payingPeople += 1;
            } else if (rule === BUDGET_DAY_VISITORS_PAY_EXACT) {
                profile.fixedContributionIncome += settings.dayVisitorCustomContributionAmount;
                if (settings.dayVisitorCustomContributionAmount > 0) profile.payingPeople += 1;
            }
        };
        project.budget.people.forEach(personRow => add(effectiveBudgetContributionRule(settings, personRow), personRow.contributionAmount));
        return profile;
    }

    function roundUpToNearestFive(value) {
        return value <= 0 ? 0 : Math.ceil(value / 5) * 5;
    }

    function calculateBudgetSnapshot(project = State.project) {
        const counts = budgetCounts(project);
        const profile = budgetContributionProfile(project);
        const costRows = project.budget.costItems.map(item => ({
            item,
            amount: calculateBudgetCostItem(project, item, counts, profile.standardPayingPeople)
        }));
        const foodCost = budgetFoodTotal(project);
        const activityCost = costRows.filter(row => isImportedBudgetActivityCost(row.item)).reduce((sum, row) => sum + row.amount, 0);
        const otherCost = costRows.filter(row => !isImportedBudgetActivityCost(row.item)).reduce((sum, row) => sum + row.amount, 0);
        const totalEstimatedCost = foodCost + activityCost + otherCost;
        const requiredIncome = totalEstimatedCost;
        const coefficient = profile.standardChargeCoefficient <= 0 ? 0 : profile.standardChargeCoefficient;
        const minimumBreakEvenStandardCharge = coefficient <= 0 ? 0 : Math.max(0, (requiredIncome - profile.fixedContributionIncome) / coefficient);
        const recommendedRoundedStandardCharge = roundUpToNearestFive(minimumBreakEvenStandardCharge);
        const proposedStandardCharge = project.budget.settings.proposedStandardCharge > 0 ? project.budget.settings.proposedStandardCharge : recommendedRoundedStandardCharge;
        const totalIncomeAtProposedCharge = profile.fixedContributionIncome + profile.standardChargeCoefficient * proposedStandardCharge;
        const standardIncome = profile.standardPayingPeople * proposedStandardCharge;
        return {
            counts,
            costRows,
            foodCost,
            activityCost,
            otherCost,
            totalEstimatedCost,
            requiredIncome,
            fixedContributionIncome: profile.fixedContributionIncome,
            nonStandardContributionIncome: totalIncomeAtProposedCharge - standardIncome,
            remainingToRecoverFromStandardPayers: Math.max(0, requiredIncome - profile.fixedContributionIncome),
            standardPayingPeople: profile.standardPayingPeople,
            payingPeople: profile.payingPeople,
            minimumBreakEvenStandardCharge,
            recommendedRoundedStandardCharge,
            proposedStandardCharge,
            totalIncomeAtProposedCharge,
            predictedSurplusShortfall: totalIncomeAtProposedCharge - requiredIncome,
            surplusShortfallAtRecommendedCharge: profile.fixedContributionIncome + profile.standardChargeCoefficient * recommendedRoundedStandardCharge - requiredIncome
        };
    }

    function updateBudgetCalculatedCosts(project = State.project) {
        if (!project?.budget) return;
        const snapshot = calculateBudgetSnapshot(project);
        project.budget.costItems.forEach(item => {
            if (item.calculationMethod === BUDGET_COST_FIXED) {
                item.quantity = 1;
                item.unitCost = item.cost;
            } else {
                item.cost = calculateBudgetCostItem(project, item, snapshot.counts, snapshot.standardPayingPeople);
            }
        });
    }

    function budgetWarnings(project = State.project) {
        const warnings = [];
        const snapshot = calculateBudgetSnapshot(project);
        const settings = project.budget.settings;
        if (!project.people.length) warnings.push("No people have been added yet.");
        if (!project.budget.costItems.length && settings.foodCostPerPersonPerDay <= 0) warnings.push("No costs or food budget have been entered yet.");
        if (parseDate(project.endDate) < parseDate(project.startDate)) warnings.push("End date is before start date.");
        project.budget.costItems.filter(cost => !clean(cost.description)).forEach(() => warnings.push("A cost line has no description."));
        project.budget.costItems.filter(isImportedBudgetActivityCost).forEach(cost => {
            const value = calculateBudgetCostItem(project, cost, snapshot.counts, snapshot.standardPayingPeople);
            if (value <= 0) warnings.push(`Plan activity '${clean(cost.description).replace(/^Activity:\s*/i, "")}' has no cost yet. Leave it at 0 only if it is free.`);
        });
        if (snapshot.predictedSurplusShortfall < 0) warnings.push("Total income is below the total required budget.");
        if (snapshot.standardPayingPeople <= 0) warnings.push("No Standard-paying people exist.");
        if (settings.dayVisitorRule === BUDGET_DAY_VISITORS_PAY_DAY_RATE && settings.dayVisitorDayRate <= 0) warnings.push("Day visitor day rate is selected but no amount is set.");
        if (settings.dayVisitorRule === BUDGET_DAY_VISITORS_PAY_EXACT && settings.dayVisitorCustomContributionAmount <= 0) warnings.push("Day visitors exact amount is selected but no amount is set.");
        if (settings.leaderRule === BUDGET_LEADERS_PAY_EXACT && settings.leaderContributionAmount <= 0) warnings.push("Leaders exact amount is selected but no amount is set.");
        if (settings.youngLeaderRule === BUDGET_YOUNG_LEADERS_PAY_EXACT && settings.youngLeaderContributionAmount <= 0) warnings.push("Young Leaders exact amount is selected but no amount is set.");
        const usesFoodOnly = settings.leaderRule === BUDGET_LEADERS_PAY_FOOD_ONLY
            || settings.youngLeaderRule === BUDGET_YOUNG_LEADERS_PAY_FOOD_ONLY
            || settings.dayVisitorRule === BUDGET_DAY_VISITORS_PAY_FOOD_ONLY
            || project.budget.people.some(personRow => personRow.contributionRule === BUDGET_CONTRIBUTION_FOOD_ONLY);
        if (usesFoodOnly && settings.foodOnlyAmount <= 0) warnings.push("Food only is selected somewhere but no food-only amount is set.");
        return warnings;
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
        if (text.includes("squirrel") || text === "0") return TERMS.camperTypeSquirrel;
        if (text.includes("beaver") || text === "1") return TERMS.camperTypeBeaver;
        if (text.includes("cub") || text === "2") return TERMS.camperTypeCub;
        if (text.includes("scout") || text === "3") return TERMS.camperTypeScout;
        if (text.includes("explorer") || text === "4") return TERMS.camperTypeExplorer;
        return TERMS.camperTypeStandard;
    }

    function mapTentType(tentType, accommodationType) {
        const accommodation = clean(accommodationType).toLowerCase();
        const type = clean(tentType).toLowerCase();
        if (accommodation.includes("caravan") || accommodation.includes("motorhome") || type.includes("caravan") || type.includes("motorhome")) return "Caravan/motorhome";
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

    function fadeColourToWhite(value, amount) {
        const hex = isHexColour(value) ? value : "#4CAF50";
        const clamped = clamp(number(amount, 0), 0, 1);
        const parts = [1, 3, 5].map(index => parseInt(hex.slice(index, index + 2), 16));
        const faded = parts.map(part => Math.round(part + (255 - part) * clamped));
        return `#${faded.map(part => part.toString(16).padStart(2, "0")).join("")}`;
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
        markDirty(label || "Updated.", options);
        render();
    }

    function markDirty(message, options = {}) {
        if (!State.collab.applyingRemote) {
            State.dirty = true;
        }
        saveDraft();
        setStatus(message || "Updated.");
        // Item 2: discrete add/remove actions (as opposed to continuous field
        // edits like typing in a name box) get a toast as well as the statusbar
        // update — these are exactly the actions where confirmation that
        // something actually happened matters most, and the quiet statusbar text
        // is easy to miss, especially on mobile right above the bottom nav bar.
        // Field-edit mutations use different generic labels ("Updated camp
        // details.", "Updated item.") so they're naturally excluded by this
        // pattern and won't spam a toast on every keystroke.
        // skipToast lets a caller that already shows its own toast (e.g. an
        // Undo-enabled removal) avoid a duplicate plain toast right after it.
        if (!State.collab.applyingRemote && !options.skipToast && /^(Added|Removed)\b/.test(message || "")) {
            toast(message);
        }
        scheduleCollaborationUpload();
    }

    function saveDraft() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(State.project));
            localStorage.setItem(DRAFT_KEY, State.fileName || "camp.scoutcamp");
            if (State._storageBlocked) {
                State._storageBlocked = false;
                setStatus("Local saving is working again.");
            }
        } catch (error) {
            // Item 24: Safari private browsing (and full storage) throws here on every edit.
            // Without this guard the error is silent and future saves keep failing invisibly.
            if (!State._storageBlocked) {
                State._storageBlocked = true;
                console.error("localStorage save failed:", error);
                setStatus("Warning: changes can't be saved on this device (private browsing or storage full). Export a backup before closing.");
            }
        }
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
                return ["Squirrel", "Beaver", "Cub", "Scout", "Explorer", "Standard"].indexOf(person.camperType) + 1 || 6;
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
        // Item 24/25: guard startup against blocked/corrupted storage so the app
        // always boots to a usable (if blank) project rather than a white screen
        let stored = null;
        let draftName = null;
        try {
            stored = localStorage.getItem(STORAGE_KEY);
            draftName = localStorage.getItem(DRAFT_KEY);
        } catch (error) {
            console.error("localStorage unavailable at startup:", error);
            State._storageBlocked = true;
        }
        try {
            State.project = stored ? normalizeProject(JSON.parse(stored)) : normalizeProject(createProject());
        } catch (error) {
            console.error("Saved project data was corrupted, starting a fresh project:", error);
            State.project = normalizeProject(createProject());
        }
        State.fileName = draftName || `${safeFileName(State.project.campName)}.scoutcamp`;
        bindGlobalEvents();
        bindGlobalErrorHandlers();
        bindOrientationHandling();
        bindConnectivityHandling();
        render();
        setStatus(State._storageBlocked ? "Ready (saving is unavailable on this device)." : "Ready.");
    }

    // Item 25: catch anything outside the known runAction/collab try-catch paths
    // so the user sees a message instead of a silent white-screen freeze
    function bindGlobalErrorHandlers() {
        window.addEventListener("error", event => {
            console.error("Unhandled error:", event.error || event.message);
            setStatus("Something went wrong. Your data is safe — try reloading if the app seems stuck.");
        });
        window.addEventListener("unhandledrejection", event => {
            console.error("Unhandled promise rejection:", event.reason);
            setStatus("Something went wrong with a background task. Your data is safe.");
        });
    }

    // Item 4: pause collaboration polling while offline, resume and immediately
    // resync (push any pending edit, then poll) the moment connectivity returns
    function bindConnectivityHandling() {
        window.addEventListener("offline", () => {
            if (State.collab.active) setStatus("Offline — your changes are saved locally and will sync when reconnected.");
        });
        window.addEventListener("online", () => {
            if (!State.collab.active) return;
            setStatus("Back online — syncing…");
            if (State.collab.pendingPush) pushCollaboration();
            pollCollaboration();
        });
    }

    // Item 30: re-check layout-sensitive state on rotation/resize rather than only
    // relying on CSS — matchMedia-driven JS logic (swipe thresholds, nav mode) can
    // otherwise go stale immediately after a tablet is rotated mid-session.
    function bindOrientationHandling() {
        let resizeTimer = null;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // Closing an open mobile/tablet nav on rotation avoids a half-open drawer
                // ending up mismatched with the new layout's breakpoint.
                const isMobileOrTablet = matchMedia("(max-width: 960px)").matches;
                if (!isMobileOrTablet) {
                    $("#sideNav")?.classList.remove("open");
                    $("#navOverlay")?.classList.remove("visible");
                }
                renderBottomNav();
                if (State.currentSection === "exports") {
                    renderMain();
                }
            }, 150);
        });
    }

    function isDesktopMode() {
        return !matchMedia("(max-width: 960px)").matches;
    }

    function bindGlobalEvents() {
        function openNav() {
            $("#sideNav").classList.add("open");
            $("#navOverlay").classList.add("visible");
        }
        function closeNav() {
            $("#sideNav").classList.remove("open");
            $("#navOverlay").classList.remove("visible");
        }

        // Item 4: Ctrl+Z / Cmd+Z to undo, Ctrl+Y or Ctrl+Shift+Z / Cmd+Shift+Z to
        // redo — these are the universal shortcuts and previously did nothing at
        // all, despite undo/redo being available (just buried in the Edit menu)
        document.addEventListener("keydown", event => {
            const ctrlOrCmd = event.ctrlKey || event.metaKey;
            if (!ctrlOrCmd) return;
            // Don't hijack the shortcut while focus is in a text field where the
            // browser's own undo (e.g. for a textarea) should take priority
            const tag = document.activeElement?.tagName;
            const isTextInput = tag === "INPUT" || tag === "TEXTAREA";
            if (isTextInput) return;
            if (event.key.toLowerCase() === "z" && !event.shiftKey) {
                event.preventDefault();
                undo();
            } else if (event.key.toLowerCase() === "y" || (event.key.toLowerCase() === "z" && event.shiftKey)) {
                event.preventDefault();
                redo();
            }
        });
        function toggleNav() {
            const mobile = matchMedia("(max-width: 960px)").matches;
            if (mobile) {
                const isOpen = $("#sideNav").classList.contains("open");
                isOpen ? closeNav() : openNav();
            } else {
                State.navCollapsed = !State.navCollapsed;
                renderNav();
            }
        }
        // Topbar hamburger (tablet)
        $("#navToggle").addEventListener("click", toggleNav);
        // Inner nav collapse button (desktop)
        $("#sideNav").addEventListener("click", event => {
            if (event.target.closest("#navToggleInner")) toggleNav();
        });
        // Overlay tap closes nav
        $("#navOverlay").addEventListener("click", closeNav);
        // Item 8: inner drawer close button
        $("#sideNav").addEventListener("click", e => {
            if (e.target.closest("#navDrawerClose")) closeNav();
        });

        // Item 9: left-edge swipe → previous section, right-edge swipe → next section
        (function bindSwipe() {
            let startX = 0, startY = 0, startT = 0;
            const EDGE = 32; // px from edge to start swipe
            document.addEventListener("touchstart", e => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                startT = Date.now();
            }, { passive: true });
            document.addEventListener("touchend", e => {
                if (e.target.closest(".tent-layout,.modal,.bottom-nav,.topbar,.side-nav")) return;
                const dx = e.changedTouches[0].clientX - startX;
                const dy = e.changedTouches[0].clientY - startY;
                const dt = Date.now() - startT;
                if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx) * 0.8 || dt > 500) return;
                const idx = SECTIONS.findIndex(s => s.id === State.currentSection);
                if (dx < 0 && idx < SECTIONS.length - 1) switchSection(SECTIONS[idx + 1].id);
                if (dx > 0 && idx > 0) switchSection(SECTIONS[idx - 1].id);
            }, { passive: true });
        })();

        document.addEventListener("click", event => {
            const menuButton = event.target.closest("[data-menu]");
            if (menuButton) {
                showMenu(menuButton.dataset.menu);
                return;
            }
            const action = event.target.closest("[data-action]");
            if (action) {
                event.preventDefault();
                const isExport = /^export[A-Z]/.test(action.dataset.action);
                if (isExport) {
                    // Item 31: visual loading state while PDF/CSV/RTF generates
                    const originalText = action.textContent;
                    action.disabled = true;
                    action.dataset.originalText = originalText;
                    action.textContent = "Generating…";
                    action.classList.add("is-loading");
                    runAction(action.dataset.action, action.dataset, action)
                        .catch(showError)
                        .finally(() => {
                            action.disabled = false;
                            action.textContent = action.dataset.originalText;
                            action.classList.remove("is-loading");
                        });
                } else {
                    runAction(action.dataset.action, action.dataset, action).catch(showError);
                }
            }
        });

        // Item 13: chores tabs now go through the standard switchChoresTab
        // dispatch action (same pattern as Menu's switchMenuTab) instead of a
        // bespoke DOM-manipulation handler — this also fixes a real bug where
        // the active tab silently reset to "Assign" on every re-render because
        // the previous version never stored which tab was selected in State.

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

        // Debounce timers
        let _shoppingDebounce = null;
        let _filterDebounce = null;

        document.addEventListener("input", event => {
            const target = event.target;
            if (target.matches("[data-filter-live]")) {
                // Item 30: debounce filter re-render so typing doesn't cause a full
                // innerHTML replace (and focus loss) on every keystroke
                State.filters[target.dataset.filterLive] = target.value;
                clearTimeout(_filterDebounce);
                const selStart = target.selectionStart, selEnd = target.selectionEnd, name = target.dataset.filterLive;
                _filterDebounce = setTimeout(() => {
                    renderMain();
                    // Restore focus + cursor position on the same filter input after re-render
                    const restored = document.querySelector(`[data-filter-live="${name}"]`);
                    if (restored) {
                        restored.focus();
                        try { restored.setSelectionRange(selStart, selEnd); } catch(_) {}
                    }
                }, 180);
            } else if (target.matches('[data-update-kind="shopping"]')) {
                // Debounce: wait 600ms after last keystroke before mutating + pushing collab
                clearTimeout(_shoppingDebounce);
                _shoppingDebounce = setTimeout(() => updateInline(target), 600);
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
        renderBottomNav();
        renderShell();
        renderMain();
    }

    function renderNav() {
        const nav = $("#sideNav");
        nav.classList.toggle("collapsed", State.navCollapsed);
        // Keep the toggle row at the top, replace everything after it
        const toggleRow = nav.querySelector(".nav-toggle-row");
        nav.innerHTML = "";
        if (toggleRow) nav.appendChild(toggleRow);
        const frag = document.createElement("div");
        // Item 8: close button visible inside drawer on tablet
        frag.innerHTML = `<div class="nav-drawer-close" style="display:none">
            <button class="icon-button" id="navDrawerClose" type="button" aria-label="Close navigation">✕</button>
        </div>` + SECTIONS.map(section => `
            <button class="nav-item ${section.id === State.currentSection ? "active" : ""}" data-action="switchSection" data-section="${section.id}" type="button">
                <span class="nav-icon">${SECTION_ICONS[section.id] || h(section.icon)}</span>
                <span class="nav-copy">
                    <span class="nav-title">${h(L(section.title))}</span>
                    <span class="nav-subtitle">${h(L(section.subtitle))}</span>
                </span>
            </button>
        `).join("");
        while (frag.firstChild) nav.appendChild(frag.firstChild);
    }

    function renderBottomNav() {
        const el = $("#bottomNav");
        if (!el) return;
        el.innerHTML = SECTIONS.map(section => `
            <button class="bottom-nav-item ${section.id === State.currentSection ? "active" : ""}"
                    data-action="switchSection" data-section="${section.id}" type="button">
                <span class="bnav-icon">${SECTION_ICONS[section.id] || h(section.icon)}</span>
                <span class="bnav-label">${h(L(section.shortTitle || section.title))}</span>
            </button>
        `).join("");
        // Item 7: rAF ensures layout is complete before scrolling
        requestAnimationFrame(() => {
            const activeBtn = el.querySelector(".bottom-nav-item.active");
            if (activeBtn) activeBtn.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
        });
    }

    function renderShell() {
        const project = State.project;
        // Item 6: replace the cram-everything-in pill with a compact set of
        // labelled chips that's actually scannable at a glance on a widescreen
        const warnings = [...buildTentWarnings(project), ...buildMenuWarnings(project)];
        $("#summaryPill").innerHTML = [
            `<span class="spill-name">${h(project.campName)}</span>`,
            `<span class="spill-chip">${h(dateRange(project))}</span>`,
            project.location ? `<span class="spill-chip">${h(project.location)}</span>` : "",
            `<span class="spill-chip">${project.people.length} people</span>`,
            `<span class="spill-chip">${project.tents.length} tents</span>`,
            `<span class="spill-chip">${activeMenuItems(project)} meals</span>`,
            warnings.length ? `<span class="spill-chip spill-warn">⚠ ${warnings.length} warning${warnings.length > 1 ? "s" : ""}</span>` : ""
        ].filter(Boolean).join("");
        $("#dirtyBadge").textContent = State.dirty ? "Unsaved changes" : "Ready";
        const badge = $("#collabBadge");
        badge.classList.toggle("hidden", !State.collab.active);
        if (State.collab.active) {
            // Items 6/8: show pending-sync state so a silently-overridden edit is
            // never silent — the user can see whether their last change has
            // actually reached the server yet
            if (State.collab.pendingPush) {
                badge.textContent = `⏳ Collaborating: ${State.collab.code} — syncing…`;
                badge.classList.add("collab-pending");
            } else {
                const syncedAgo = State.collab.lastSyncedAt ? timeAgoShort(Date.now() - State.collab.lastSyncedAt) : "";
                badge.textContent = `✓ Collaborating: ${State.collab.code}${syncedAgo ? " — synced " + syncedAgo : ""}`;
                badge.classList.remove("collab-pending");
            }
        } else {
            badge.textContent = "";
        }
        renderTopbarStrip();
    }

    function renderTopbarStrip() {
        const menuItems = [
            { label: "File", menu: "file" },
            { label: "Edit", menu: "edit" },
            { label: L(SECTION_TITLES[State.currentSection] || "Section"), menu: "section" },
            { label: "Export", menu: "export" },
            { label: "Help", menu: "help" }
        ];
        const commands = sectionCommands(State.currentSection);
        const menuHtml = menuItems.map(m =>
            `<button data-menu="${attr(m.menu)}" type="button">${h(m.label)}</button>`
        ).join("");
        // Item 4: visible Undo/Redo buttons — previously these only existed
        // buried inside the Edit menu with no keyboard shortcut, despite being
        // one of the most-reached-for recovery actions after a mistake
        const undoDisabled = !State.undo.length ? " disabled" : "";
        const redoDisabled = !State.redo.length ? " disabled" : "";
        const undoRedoHtml = `
            <button class="icon-button-flat" data-action="undo" type="button" title="Undo (Ctrl+Z)" aria-label="Undo"${undoDisabled}>↶</button>
            <button class="icon-button-flat" data-action="redo" type="button" title="Redo (Ctrl+Y)" aria-label="Redo"${redoDisabled}>↷</button>`;
        const divider = commands.length ? '<div class="strip-divider" aria-hidden="true"></div>' : "";
        const cmdHtml = commands.map(c => {
            const style = c.style ? ` ${c.style}` : "";
            const data = Object.entries(c.data || {}).map(([k, v]) => ` data-${k}="${attr(v)}"`).join("");
            return `<button class="cmd-btn${style}" data-action="${attr(c.action)}"${data} type="button">${h(c.label)}</button>`;
        }).join("");
        $("#topbarStrip").innerHTML = menuHtml + undoRedoHtml + divider + cmdHtml;
    }

    function renderCommandStrip() {
        // Commands are now rendered inside renderTopbarStrip; this is kept for compatibility.
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
            case "budget":
                return [
                    { label: "Add cost", action: "addBudgetCost" },
                    { label: "Edit selected", action: "editSelectedBudgetCost", style: "secondary" },
                    { label: "Remove selected", action: "removeSelectedBudgetCost", style: "danger" },
                    { label: "Add plan activities", action: "addPlanActivitiesToBudget", style: "amber" },
                    { label: "Load sample", action: "loadSampleBudget", style: "teal" },
                    { label: "Use recommended", action: "useRecommendedBudgetCharge", style: "secondary" },
                    { label: "Budget PDF", action: "exportBudgetPdf", style: "slate" }
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
                afterRenderShopping();
                break;
            case "budget":
                main.innerHTML = renderBudget();
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
                <table class="compact-table people-table">
                    <thead><tr><th>Name</th><th>Type</th><th>Teams</th><th>Tent</th><th class="col-dietary">Dietary</th><th class="col-medical">Medical</th><th></th></tr></thead>
                    <tbody>
                    ${people.map(person => `
                        <tr>
                            <td data-label="Name"><strong>${h(person.name)}</strong><br><span class="muted">${h(person.gender)}${person.isDayVisitor ? " | Day visitor" : ""}</span></td>
                            <td data-label="Type">${h(personTypeDisplay(person))}<br><span class="muted">${h(person.camperType)}</span></td>
                            <td data-label="Teams">${h(teamsForPerson(person.id).map(team => team.name).join(", "))}</td>
                            <td data-label="Tent">${h(tentName(person.tentId) || "Unallocated")}</td>
                            <td class="col-dietary" data-label="Dietary">${h(person.dietaryNotes || "—")}</td>
                            <td class="col-medical" data-label="Medical">${h(person.medicalNotes || "—")}</td>
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
                        ${unallocated.length ? `<div class="person-card-list">${unallocated.map(person => renderUnallocatedPerson(person, friendLabels)).join("")}</div>` : `<div class="empty">✓ Everyone has a tent — all people are allocated.</div>`}
                    </div>
                </section>
                <section class="panel">
                    <div class="panel-header"><strong>Warnings</strong><button class="small-button secondary" data-action="manageLinks" type="button">Friend & foe links</button></div>
                    <div class="panel-body">${warnings.length ? `<div class="warning-list">${warnings.map(warning => `<div class="warning">${h(warning)}</div>`).join("")}</div>` : `<div class="empty">✓ No tent warnings — all tents look good.</div>`}</div>
                </section>
            </div>
            <div class="toolbar" style="margin-top:12px">
                <button data-action="addTent" type="button">Add Tent</button>
                <button class="secondary" data-action="addSiteItem" type="button">Add Site Item</button>
                <button class="secondary" data-action="arrangeTents" type="button">Arrange</button>
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
        const isBunk = isBunkTent(tent);
        const isCaravan = isCaravanMotorhome(tent);
        return `
            <div class="canvas-card tent-card ${isBunk ? "bunk-card" : ""} ${hasWarnings ? "warning-border" : ""}" data-canvas-kind="tent" data-id="${attr(tent.id)}" style="left:${tent.x}px;top:${tent.y}px;width:${width}px;height:${height}px;border-color:${attr(tent.colour)}">
                <button class="canvas-action-button" data-action="openTentActions" data-id="${attr(tent.id)}" aria-label="Actions for ${attr(tent.name)}" type="button">...</button>
                <div class="canvas-visual">${renderTentVisual(tent, isBunk, isCaravan)}</div>
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
                <circle cx="46" cy="14" r="6" fill="${attr(gender)}" stroke="${attr(outline)}" stroke-width="1"></circle>
                ${person.personType === TERMS.personTypeAdult ? renderAdultHat() : ""}
                ${person.personType === TERMS.personTypeYoungLeader ? renderYoungLeaderCap() : ""}
                <line x1="46" y1="21" x2="46" y2="32" stroke="${attr(gender)}" stroke-width="${youngPerson ? "2.6" : "3.1"}" stroke-linecap="round"></line>
                <line x1="34" y1="25" x2="58" y2="25" stroke="${attr(gender)}" stroke-width="2.4" stroke-linecap="round"></line>
                <line x1="46" y1="32" x2="37" y2="43" stroke="${attr(gender)}" stroke-width="2.4" stroke-linecap="round"></line>
                <line x1="46" y1="32" x2="55" y2="43" stroke="${attr(gender)}" stroke-width="2.4" stroke-linecap="round"></line>
            </svg>`;
    }

    function renderCamperTypeMark(camperType) {
        if (camperType === TERMS.camperTypeSquirrel) {
            return `
                <g transform="translate(14 12) scale(0.78)">
                    <path d="M20 39 C10 33 7 23 11 15 C14 10 26 10 29 15 C33 23 30 33 20 39 Z" fill="#e67e22" stroke="#533213" stroke-width="1.4" stroke-linejoin="round"></path>
                    <path d="M8 16 C10 8 30 8 32 16 C26 19 14 19 8 16 Z" fill="#794a1c" stroke="#533213" stroke-width="1.3" stroke-linejoin="round"></path>
                    <rect x="16.5" y="3" width="7" height="8" rx="2" fill="#794a1c" stroke="#533213" stroke-width="1"></rect>
                    <line x1="13" y1="17" x2="18" y2="11" stroke="#533213" stroke-width="1" stroke-linecap="round"></line>
                    <line x1="20" y1="18" x2="20" y2="10" stroke="#533213" stroke-width="1" stroke-linecap="round"></line>
                    <line x1="27" y1="17" x2="22" y2="11" stroke="#533213" stroke-width="1" stroke-linecap="round"></line>
                </g>`;
        }
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
            <rect x="37" y="6" width="18" height="6" rx="2" fill="#ffb74d" stroke="#8b4513" stroke-width="0.8"></rect>
            <line x1="33" y1="12" x2="59" y2="12" stroke="#8b4513" stroke-width="2" stroke-linecap="round"></line>`;
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
        if (person.camperType === TERMS.camperTypeSquirrel) return { label: "Squirrel", background: "#e64a19", foreground: "#ffffff" };
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

    function renderTentVisual(tent, isBunk, isCaravan) {
        const colour = isHexColour(tent.colour) ? tent.colour : "#4CAF50";
        const stroke = darkenColour(colour, 0.45);
        if (isBunk) return renderBunkRoomSvg(colour);
        if (isCaravan) return renderCaravanMotorhomeSvg(colour, stroke);
        const front = fadeColourToWhite(colour, 0.72);
        return `
            <svg class="tent-graphic" viewBox="0 0 170 96" aria-hidden="true" focusable="false">
                <ellipse cx="85" cy="84" rx="48" ry="6" fill="#000000" opacity="0.22"></ellipse>
                <polygon points="33,80 85,8 137,80" fill="${attr(colour)}" stroke="${attr(stroke)}" stroke-width="2.2"></polygon>
                <polygon points="53,74 85,14 117,74" fill="${attr(front)}" stroke="${attr(stroke)}" stroke-width="1.2"></polygon>
                <line x1="85" y1="14" x2="40" y2="77" stroke="${attr(stroke)}" stroke-width="1.1" stroke-linecap="round"></line>
                <line x1="85" y1="14" x2="130" y2="77" stroke="${attr(stroke)}" stroke-width="1.1" stroke-linecap="round"></line>
                <line x1="85" y1="11" x2="85" y2="74" stroke="${attr(stroke)}" stroke-width="1.2" stroke-linecap="round"></line>
                <polygon points="33,80 40,77 54,80" fill="${attr(colour)}" stroke="${attr(stroke)}" stroke-width="1"></polygon>
                <polygon points="137,80 130,77 116,80" fill="${attr(colour)}" stroke="${attr(stroke)}" stroke-width="1"></polygon>
                <line x1="33" y1="80" x2="137" y2="80" stroke="${attr(stroke)}" stroke-width="2" stroke-linecap="round"></line>
                <line x1="85" y1="8" x2="85" y2="12" stroke="${attr(stroke)}" stroke-width="2" stroke-linecap="round"></line>
            </svg>`;
    }

    function renderCaravanMotorhomeSvg(colour, stroke) {
        return `
            <svg class="tent-graphic" viewBox="0 0 170 96" aria-hidden="true" focusable="false">
                <rect x="29" y="78" width="112" height="12" rx="6" fill="#000000" opacity="0.16"></rect>
                <rect x="33" y="30" width="104" height="46" rx="10" fill="${attr(fadeColourToWhite(colour, 0.68))}" stroke="${attr(stroke)}" stroke-width="2"></rect>
                <rect x="36" y="57" width="44" height="10" rx="4" fill="${attr(colour)}" opacity="0.92"></rect>
                <rect x="46" y="39" width="22" height="15" rx="3" fill="#e2f4ff" stroke="${attr(stroke)}" stroke-width="1"></rect>
                <rect x="76" y="39" width="27" height="15" rx="3" fill="#e2f4ff" stroke="${attr(stroke)}" stroke-width="1"></rect>
                <rect x="109" y="43" width="16" height="31" rx="3" fill="#ffffff" stroke="${attr(stroke)}" stroke-width="1"></rect>
                <circle cx="54" cy="76" r="8" fill="#555555" stroke="#000000" stroke-width="1"></circle>
                <circle cx="54" cy="76" r="3.5" fill="#d0d0d0"></circle>
                <circle cx="120" cy="76" r="8" fill="#555555" stroke="#000000" stroke-width="1"></circle>
                <circle cx="120" cy="76" r="3.5" fill="#d0d0d0"></circle>
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

        // Item 12: show scroll hint on phone
        if (matchMedia("(max-width: 600px)").matches) {
            const existingHint = canvas.querySelector(".canvas-scroll-hint");
            if (!existingHint) {
                const hint = document.createElement("div");
                hint.className = "canvas-scroll-hint";
                hint.innerHTML = "← scroll →";
                hint.style.cssText = "position:sticky;left:calc(100% - 80px);top:8px;display:inline-block;z-index:4;margin:0;pointer-events:none";
                canvas.prepend(hint);
                setTimeout(() => hint.remove(), 2500);
            }
        }

        // Item 11: on phone, auto-arrange cards if all at default (0,0) position
        const isPhone = matchMedia("(max-width: 600px)").matches;
        if (isPhone) {
            const cards = $all("[data-canvas-kind='tent']", canvas);
            const allAtOrigin = [...cards].every(c => (parseInt(c.style.left,10)||0) < 10 && (parseInt(c.style.top,10)||0) < 10);
            if (allAtOrigin && cards.length > 1) {
                // Auto-arrange in a grid
                cards.forEach((card, i) => {
                    const col = i % 2;
                    const row = Math.floor(i / 2);
                    card.style.left = `${col * 180 + 8}px`;
                    card.style.top  = `${row * 160 + 8}px`;
                });
            }
        }

        // Items 10/13: unified pointer+touch drag (works on iOS Safari)
        $all("[data-canvas-kind]", canvas).forEach(card => {
            // Helper: get coords from either pointer or touch event
            function getCoords(event) {
                const touch = event.touches?.[0] || event.changedTouches?.[0];
                return touch
                    ? { clientX: touch.clientX, clientY: touch.clientY }
                    : { clientX: event.clientX, clientY: event.clientY };
            }

            function startDrag(event) {
                if (event.target.closest("button")) return;
                const { clientX, clientY } = getCoords(event);
                const rect = card.getBoundingClientRect();
                const canvasRect = canvas.getBoundingClientRect();
                State.dragging = {
                    kind: card.dataset.canvasKind,
                    id: card.dataset.id,
                    offsetX: clientX - rect.left,
                    offsetY: clientY - rect.top,
                    canvasLeft: canvasRect.left + canvas.scrollLeft,
                    canvasTop:  canvasRect.top  + canvas.scrollTop
                };
                // Use pointer capture when available (desktop/Android)
                if (event.pointerId !== undefined) {
                    try { card.setPointerCapture(event.pointerId); } catch(_) {}
                }
                event.preventDefault();
            }

            function moveDrag(event) {
                if (!State.dragging || State.dragging.id !== card.dataset.id) return;
                const { clientX, clientY } = getCoords(event);
                const x = Math.max(0, clientX - State.dragging.canvasLeft - State.dragging.offsetX);
                const y = Math.max(0, clientY - State.dragging.canvasTop  - State.dragging.offsetY);
                card.style.left = `${Math.round(x / 16) * 16}px`;
                card.style.top  = `${Math.round(y / 16) * 16}px`;
                event.preventDefault();
            }

            function endDrag(event) {
                if (!State.dragging || State.dragging.id !== card.dataset.id) return;
                const x = parseInt(card.style.left, 10) || 0;
                const y = parseInt(card.style.top,  10) || 0;
                const drag = State.dragging;
                State.dragging = null;
                if (event.pointerId !== undefined) {
                    try { card.releasePointerCapture(event.pointerId); } catch(_) {}
                }
                mutate("Moved layout item.", () => {
                    const collection = drag.kind === "tent"
                        ? State.project.tents
                        : drag.kind === "person"
                            ? State.project.people
                            : State.project.siteItems;
                    const item = collection.find(e => e.id === drag.id);
                    if (item) { item.x = x; item.y = y; }
                });
            }

            // Pointer events (desktop + Android Chrome)
            card.addEventListener("pointerdown", startDrag);
            card.addEventListener("pointermove", moveDrag);
            card.addEventListener("pointerup",   endDrag);
            card.addEventListener("pointercancel", endDrag);

            // Touch events fallback (iOS Safari)
            card.addEventListener("touchstart", startDrag, { passive: false });
            card.addEventListener("touchmove",  moveDrag,  { passive: false });
            card.addEventListener("touchend",   endDrag,   { passive: false });
        });
    }

    // Item 24: swipe-to-delete for shopping items on touch devices
    function afterRenderShopping() {
        $all(".shopping-item").forEach(row => {
            let startX = 0, currentX = 0, dragging = false;
            row.addEventListener("touchstart", e => {
                startX = e.touches[0].clientX;
                dragging = true;
                row.style.transition = "none";
            }, { passive: true });
            row.addEventListener("touchmove", e => {
                if (!dragging) return;
                currentX = e.touches[0].clientX - startX;
                if (currentX < 0) {
                    row.style.transform = `translateX(${Math.max(currentX, -88)}px)`;
                }
            }, { passive: true });
            row.addEventListener("touchend", () => {
                dragging = false;
                row.style.transition = "transform 0.18s ease";
                if (currentX < -56) {
                    // Trigger the remove button inside this row
                    row.style.transform = "translateX(-100%)";
                    setTimeout(() => row.querySelector(".shopping-remove")?.click(), 160);
                } else {
                    row.style.transform = "translateX(0)";
                }
                currentX = 0;
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
            <!-- Item 13: standard tabs pattern, consistent with Menu section -->
            <div class="chores-tabs-bar tabs" style="display:none">
                <button class="${State.choresTab === "assign" ? "active" : ""}" data-action="switchChoresTab" data-tab="assign" type="button">Assign</button>
                <button class="${State.choresTab === "items" ? "active" : ""}" data-action="switchChoresTab" data-tab="items" type="button">Rota items</button>
                <button class="${State.choresTab === "rota" ? "active" : ""}" data-action="switchChoresTab" data-tab="rota" type="button">Allocations</button>
            </div>
            <div class="grid three chores-top-grid">
                <section class="panel ${State.choresTab === "assign" ? "chores-tab-active" : ""}">
                    <div class="panel-header"><strong>Assign</strong></div>
                    <div class="panel-body">
                        <input placeholder="Filter teams, tents and people" value="${attr(assignFilter)}" data-filter-live="choreAssign">
                        <div class="pill-list" style="margin-top:10px">${assignees.map(item => `<span class="pill">${h(item.name)} <small>${h(item.detail)}</small></span>`).join("") || `<div class="empty">Add people and tents first, then chores can be assigned to them here.</div>`}</div>
                    </div>
                </section>
                <section class="panel ${State.choresTab === "items" ? "chores-tab-active" : ""}">
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
                <section class="panel ${State.choresTab === "rota" ? "chores-tab-active" : ""}">
                    <div class="panel-header"><strong>Manual allocation</strong></div>
                    <div class="panel-body">
                        <div class="toolbar">
                            <button data-action="addAllocation" type="button">Add Allocation</button>
                            <button class="secondary" data-action="modifyChoreSlots" type="button">Modify slots</button>
                            <button class="teal" data-action="generateRota" type="button">Generate simple rota</button>
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
                `).join("") : `<div class="empty">No chores allocated for this day yet — use the Assign panel on the left to add some.</div>`}
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
                    <td data-label="Date">${h(displayDate(item.date))}</td>
                    <td data-label="Slot">${h(item.slot)}</td>
                    <td data-label="Food"><input data-update-kind="meal" data-id="${attr(item.id)}" data-field="meal" value="${attr(item.meal)}"></td>
                    <td data-label="Pudding"><input data-update-kind="meal" data-id="${attr(item.id)}" data-field="pudding" value="${attr(item.pudding)}"></td>
                    <td data-label="Dietary"><input data-update-kind="meal" data-id="${attr(item.id)}" data-field="dietaryNotes" value="${attr(item.dietaryNotes)}"></td>
                    <td data-label="Notes"><input data-update-kind="meal" data-id="${attr(item.id)}" data-field="notes" value="${attr(item.notes)}"></td>
                    <td class="row-actions"><button class="small-button danger" data-action="removeMeal" data-id="${attr(item.id)}" type="button">Remove</button></td>
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
                            return `<div class="slot-card"><div class="slot-title">${h(slot)}</div>${items.length ? items.map(item => `<div class="item-card"><strong>${h(item.meal || "No food recorded")}</strong>${item.pudding ? `<span>Pudding: ${h(item.pudding)}</span>` : ""}</div>`).join("") : `<div class="empty">Not planned yet</div>`}</div>`;
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
                    <div class="panel-body">${warnings.length ? `<div class="warning-list">${warnings.map(warning => `<div class="warning">${h(warning)}</div>`).join("")}</div>` : `<div class="empty">✓ No menu warnings — all meals look good.</div>`}</div>
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
                <button class="secondary" data-action="addConcurrentPlanItem" type="button">Add concurrent activity</button>
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
                    <div class="item-card plan-item-card">
                        <div class="plan-item-time">${h(planTime(item.startMinute))} – ${h(planTime(item.endMinute))}</div>
                        <div class="plan-item-title">${h(item.title)}</div>
                        <div class="plan-item-meta">${h(planAudienceText(item))}${item.isConcurrent ? " · Concurrent" : ""}${item.notes ? " · " + h(item.notes) : ""}</div>
                        <div class="plan-item-actions">
                            <button class="small-button secondary" data-action="editPlanItem" data-id="${attr(item.id)}" type="button">Edit</button>
                            <button class="small-button secondary" data-action="editPlanTime" data-id="${attr(item.id)}" type="button">Edit time</button>
                            ${item.boundaryKind ? "" : `<button class="small-button danger" data-action="removePlanItem" data-id="${attr(item.id)}" type="button">Remove</button>`}
                        </div>
                    </div>
                `).join("") : `<div class="empty">Nothing planned for this day yet — use Add plan item above to add activities, travel or rest.</div>`}
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
                ${participant ? "" : `<button class="amber" data-action="kitTemplates" type="button">Templates</button><button class="secondary" data-action="moreKitActions" type="button">More kit actions</button>`}
                <button class="slate" data-action="${participant ? "exportParticipantKitPdf" : "exportGroupKitPdf"}" type="button">PDF</button>
            </div>
            ${filtered.length ? kitTable(filtered, participant) : `<div class="empty">${participant ? "No participant kit recorded yet. Use Add item to start, or Standard items for a common pre-built list." : "No group kit recorded yet. Use Add item to start, or Load template for a pre-built list."}</div>`}
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
                            <td class="col-name"><strong>${h(item.name)}</strong>${participant ? "" : `<br><small>${h(item.category || item.owner)}</small>`}</td>
                            <td class="col-qty">${qtyControl(item.id, participant ? "participantKit" : "groupKit", item.quantity)}</td>
                            ${participant ? "" : `<td class="col-status"><select data-update-kind="kit" data-id="${attr(item.id)}" data-field="status">${KIT_STATUSES.map(status => `<option ${item.status === status ? "selected" : ""}>${h(status)}</option>`).join("")}</select></td>`}
                            <td class="col-notes"><input data-update-kind="kit" data-id="${attr(item.id)}" data-field="notes" value="${attr(item.notes)}"></td>
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
        const checkedCount = listItem.items.filter(i => i.checked).length;
        const total = listItem.items.length;
        return `
            <section class="day-card shopping-card">
                <div class="shopping-card-header">
                    <h3 class="shopping-card-title">${h(listItem.name)}</h3>
                    ${total ? `<span class="shopping-progress">${checkedCount}/${total}</span>` : ""}
                    <div class="shopping-card-actions">
                        <button class="small-button secondary" data-action="addShoppingItem" data-id="${attr(listItem.id)}" type="button">+ Add</button>
                        <button class="small-button secondary" data-action="renameShoppingList" data-id="${attr(listItem.id)}" type="button">Rename</button>
                        <button class="small-button danger" data-action="removeShoppingList" data-id="${attr(listItem.id)}" type="button">✕</button>
                    </div>
                </div>
                <div class="shopping-items">
                    ${listItem.items.length ? listItem.items.map(item => `
                        <div class="shopping-item ${item.checked ? "shopping-item-checked" : ""}">
                            <button class="shopping-check ${item.checked ? "checked" : ""}"
                                data-action="toggleShoppingItem"
                                data-list-id="${attr(listItem.id)}"
                                data-id="${attr(item.id)}"
                                aria-label="${item.checked ? "Uncheck" : "Check"} ${h(item.name)}"
                                type="button">
                                ${item.checked ? "✓" : ""}
                            </button>
                            <input class="shopping-name-input"
                                data-update-kind="shopping"
                                data-list-id="${attr(listItem.id)}"
                                data-id="${attr(item.id)}"
                                data-field="name"
                                value="${attr(item.name)}"
                                placeholder="Item name"
                                autocomplete="off">
                            <div class="shopping-qty">
                                ${qtyControl(item.id, "shopping", item.quantity)}
                            </div>
                            <button class="shopping-remove small-button danger"
                                data-action="removeShoppingItem"
                                data-list-id="${attr(listItem.id)}"
                                data-id="${attr(item.id)}"
                                aria-label="Remove ${h(item.name)}"
                                type="button">✕</button>
                        </div>
                    `).join("") : `<div class="empty">No items in this list yet — use + Add item below to start.</div>`}
                </div>
            </section>`;
    }

    function renderBudget() {
        const project = State.project;
        const budget = project.budget;
        const settings = budget.settings;
        const snapshot = calculateBudgetSnapshot(project);
        const warnings = budgetWarnings(project);
        const balanceClass = snapshot.predictedSurplusShortfall < 0 ? "budget-negative" : "budget-positive";
        const currency = budgetCurrencyLabel(settings.currencySymbol);
        return `
            ${sectionHeader("Budget", "Costs, contribution rules and final camp charges. People and dates come from the current camp project.")}
            <div class="budget-stack">
                <section class="card budget-hero">
                    <div class="budget-hero-title">
                        <span class="budget-icon">${SECTION_ICONS.budget}</span>
                        <div>
                            <h2>Budget</h2>
                            <p>Uses the current camp dates and Personnel list. Add or edit people in Personnel, or update shared person details below.</p>
                        </div>
                    </div>
                    <div class="summary-grid">
                        ${budgetSummaryTile("Total cost", formatBudgetMoney(snapshot.totalEstimatedCost))}
                        ${budgetSummaryTile("Recommended", formatBudgetMoney(snapshot.recommendedRoundedStandardCharge))}
                        ${budgetSummaryTile("Standard charge", formatBudgetMoney(snapshot.proposedStandardCharge))}
                        ${budgetSummaryTile("Balance", formatBudgetMoney(snapshot.predictedSurplusShortfall), balanceClass)}
                    </div>
                </section>

                <section class="card">
                    <h3>Contribution rules</h3>
                    <div class="grid three">
                        ${budgetSelectField("Adults/leaders", "leaderRule", BUDGET_LEADER_RULES, settings.leaderRule)}
                        ${budgetSelectField("Young Leaders", "youngLeaderRule", BUDGET_YOUNG_LEADER_RULES, settings.youngLeaderRule)}
                        ${budgetSelectField("Day visitors", "dayVisitorRule", BUDGET_DAY_VISITOR_RULES, settings.dayVisitorRule)}
                    </div>
                    <div class="budget-rule-amounts">
                        ${settings.leaderRule === BUDGET_LEADERS_PAY_EXACT ? budgetNumberField(`Leader exact amount${currency === "None" ? "" : ` (${currency})`}`, "leaderContributionAmount", settings.leaderContributionAmount) : ""}
                        ${settings.youngLeaderRule === BUDGET_YOUNG_LEADERS_PAY_EXACT ? budgetNumberField(`Young Leader exact amount${currency === "None" ? "" : ` (${currency})`}`, "youngLeaderContributionAmount", settings.youngLeaderContributionAmount) : ""}
                        ${settings.dayVisitorRule === BUDGET_DAY_VISITORS_PAY_DAY_RATE ? budgetNumberField(`Day visitor day rate${currency === "None" ? "" : ` (${currency})`}`, "dayVisitorDayRate", settings.dayVisitorDayRate) : ""}
                        ${settings.dayVisitorRule === BUDGET_DAY_VISITORS_PAY_EXACT ? budgetNumberField(`Day visitor exact amount${currency === "None" ? "" : ` (${currency})`}`, "dayVisitorCustomContributionAmount", settings.dayVisitorCustomContributionAmount) : ""}
                        ${usesBudgetFoodOnly(project) ? budgetNumberField(`Food-only amount${currency === "None" ? "" : ` (${currency})`}`, "foodOnlyAmount", settings.foodOnlyAmount) : ""}
                    </div>
                </section>

                <section class="card">
                    <h3>People and contributions</h3>
                    <p class="muted">Editing shared person details here also updates Personnel. Contribution rules and notes stay with the budget.</p>
                    ${renderBudgetPeopleTable()}
                </section>

                <section class="card">
                    <h3>Food settings</h3>
                    <div class="budget-food-grid">
                        ${budgetNumberField(`Food per person per day${currency === "None" ? "" : ` (${currency})`}`, "foodCostPerPersonPerDay", settings.foodCostPerPersonPerDay)}
                        <label>Food days<input data-update-kind="budget-setting" data-field="foodDays" type="number" min="0" step="1" value="${attr(settings.foodDays)}"></label>
                        <div class="budget-stat">
                            <span>Food people</span>
                            <strong>${snapshot.counts.totalPeople} ${snapshot.counts.totalPeople === 1 ? "person" : "people"}</strong>
                        </div>
                        <div class="budget-stat">
                            <span>Automatic food total</span>
                            <strong>${formatBudgetMoney(snapshot.foodCost)}</strong>
                        </div>
                    </div>
                </section>

                <section class="card">
                    <div class="budget-card-head">
                        <h3>Cost lines</h3>
                        <div class="row-actions">
                            <button class="small-button" data-action="addBudgetCost" type="button">Add cost</button>
                            <button class="small-button secondary" data-action="editSelectedBudgetCost" type="button">Edit selected cost</button>
                            <button class="small-button danger" data-action="removeSelectedBudgetCost" type="button">Remove selected</button>
                            <button class="small-button amber" data-action="addPlanActivitiesToBudget" type="button">Add plan activities</button>
                            <button class="small-button teal" data-action="loadSampleBudget" type="button">Load sample budget</button>
                        </div>
                    </div>
                    ${renderBudgetCostTable(snapshot)}
                </section>

                <section class="card">
                    <h3>Final charge</h3>
                    <div class="budget-final-top">
                        ${budgetNumberField(`Standard charge${currency === "None" ? "" : ` (${currency})`}`, "proposedStandardCharge", settings.proposedStandardCharge)}
                        <button data-action="useRecommendedBudgetCharge" type="button">Use recommended charge</button>
                        <div class="budget-stat">
                            <span>Recommended charge</span>
                            <strong>${formatBudgetMoney(snapshot.recommendedRoundedStandardCharge)}</strong>
                        </div>
                        <div class="budget-stat">
                            <span>Balance</span>
                            <strong class="${balanceClass}">${formatBudgetMoney(snapshot.predictedSurplusShortfall)}</strong>
                        </div>
                    </div>
                    <div class="grid three budget-breakdown">
                        ${budgetBreakdownBox("Outgoings", [
                            ["Food", formatBudgetMoney(snapshot.foodCost)],
                            ["Activities", formatBudgetMoney(snapshot.activityCost)],
                            ["Other costs", formatBudgetMoney(snapshot.otherCost)],
                            ["Total outgoings", formatBudgetMoney(snapshot.totalEstimatedCost), true]
                        ])}
                        ${budgetBreakdownBox("Income", [
                            ["Standard charges", formatBudgetMoney(snapshot.proposedStandardCharge * snapshot.standardPayingPeople)],
                            ["Exact/fixed contributions", formatBudgetMoney(snapshot.fixedContributionIncome)],
                            ["Total income", formatBudgetMoney(snapshot.totalIncomeAtProposedCharge), true]
                        ])}
                        ${budgetBreakdownBox("Result", [
                            ["Required income", formatBudgetMoney(snapshot.requiredIncome)],
                            ["Balance", formatBudgetMoney(snapshot.predictedSurplusShortfall), true, balanceClass]
                        ])}
                    </div>
                    <div class="toolbar">
                        <button class="teal" data-action="changeBudgetSymbol" type="button">Change symbol</button>
                        <button class="slate" data-action="exportBudgetPdf" type="button">Export PDF</button>
                        <button class="teal" data-action="exportBudgetCsv" type="button">Export CSV</button>
                    </div>
                </section>

                <section class="card">
                    <h3>Checks</h3>
                    <div class="warning-list">
                        ${warnings.length ? warnings.map(warning => `<div class="warning">${h(warning)}</div>`).join("") : `<div class="empty">No warnings.</div>`}
                    </div>
                    ${budget.importedSourceSummary ? `<p class="muted">${h(budget.importedSourceSummary)}</p>` : ""}
                </section>
            </div>
        `;
    }

    function budgetSummaryTile(label, value, className = "") {
        return `<div class="summary-tile"><span>${h(label)}</span><strong class="summary-number ${className}">${h(value)}</strong></div>`;
    }

    function budgetSelectField(label, field, options, value) {
        return `<label>${h(label)}<select data-update-kind="budget-setting" data-field="${attr(field)}">${options.map(option => `<option value="${attr(option)}" ${option === value ? "selected" : ""}>${h(option)}</option>`).join("")}</select></label>`;
    }

    function budgetNumberField(label, field, value) {
        return `<label>${h(label)}<input data-update-kind="budget-setting" data-field="${attr(field)}" type="number" min="0" step="0.01" value="${attr(number(value, 0))}"></label>`;
    }

    function usesBudgetFoodOnly(project = State.project) {
        const settings = project.budget.settings;
        return settings.leaderRule === BUDGET_LEADERS_PAY_FOOD_ONLY
            || settings.youngLeaderRule === BUDGET_YOUNG_LEADERS_PAY_FOOD_ONLY
            || settings.dayVisitorRule === BUDGET_DAY_VISITORS_PAY_FOOD_ONLY
            || project.budget.people.some(personRow => personRow.contributionRule === BUDGET_CONTRIBUTION_FOOD_ONLY);
    }

    function renderBudgetPeopleTable() {
        const people = budgetPeopleSorted();
        if (!people.length) {
            return `<div class="empty">No people have been added yet. Add people in Personnel and they will appear here automatically.</div>`;
        }
        const header = (label, field) => `<button class="table-sort" data-action="sortBudgetPeople" data-field="${attr(field)}" type="button">${h(label)}${State.sort.budgetPeople === field ? (State.sort.budgetPeopleDir === "desc" ? " ↓" : " ↑") : ""}</button>`;
        return `
            <div class="table-wrap budget-table-wrap">
                <table class="compact-table budget-people-table">
                    <thead>
                        <tr>
                            <th>${header("Name", "name")}</th>
                            <th>${header("Type", "personType")}</th>
                            <th>${header("Camper type", "camperType")}</th>
                            <th>${header("Day visitor", "isDayVisitor")}</th>
                            <th>${header("Contribution rule", "contributionRule")}</th>
                            <th>${header("Exact amount", "contributionAmount")}</th>
                            <th>${header("Notes", "notes")}</th>
                        </tr>
                    </thead>
                    <tbody>${people.map(personRow => `
                        <tr>
                            <td><input data-update-kind="budget-person" data-id="${attr(personRow.id)}" data-field="name" value="${attr(personRow.name)}"></td>
                            <td><select data-update-kind="budget-person" data-id="${attr(personRow.id)}" data-field="personType">${BUDGET_PERSON_TYPES.map(type => `<option value="${attr(type)}" ${personRow.personType === type ? "selected" : ""}>${h(type)}</option>`).join("")}</select></td>
                            <td><select data-update-kind="budget-person" data-id="${attr(personRow.id)}" data-field="camperType">${BUDGET_CAMPER_TYPES.map(type => `<option value="${attr(type)}" ${personRow.camperType === type ? "selected" : ""}>${h(type)}</option>`).join("")}</select></td>
                            <td class="center-cell"><input data-update-kind="budget-person" data-id="${attr(personRow.id)}" data-field="isDayVisitor" type="checkbox" ${personRow.isDayVisitor ? "checked" : ""}></td>
                            <td><select data-update-kind="budget-person" data-id="${attr(personRow.id)}" data-field="contributionRule">${BUDGET_CONTRIBUTION_RULES.map(rule => `<option value="${attr(rule)}" ${personRow.contributionRule === rule ? "selected" : ""}>${h(rule)}</option>`).join("")}</select></td>
                            <td><input data-update-kind="budget-person" data-id="${attr(personRow.id)}" data-field="contributionAmount" type="number" min="0" step="0.01" value="${attr(personRow.contributionAmount)}" ${personRow.contributionRule === BUDGET_CONTRIBUTION_EXACT ? "" : "disabled"}></td>
                            <td><input data-update-kind="budget-person" data-id="${attr(personRow.id)}" data-field="notes" value="${attr(personRow.notes)}"></td>
                        </tr>`).join("")}</tbody>
                </table>
            </div>`;
    }

    function budgetPeopleSorted() {
        const field = State.sort.budgetPeople || "name";
        const direction = State.sort.budgetPeopleDir === "desc" ? -1 : 1;
        return [...State.project.budget.people].sort((a, b) => {
            const av = field === "isDayVisitor" ? Number(Boolean(a[field])) : a[field];
            const bv = field === "isDayVisitor" ? Number(Boolean(b[field])) : b[field];
            return direction * localeSort(av, bv);
        });
    }

    function renderBudgetCostTable(snapshot) {
        if (!State.project.budget.costItems.length) {
            return `<div class="empty">No cost lines yet. Add site fees, activity costs, transport, equipment hire or food settings to build the final charge.</div>`;
        }
        return `
            <div class="table-wrap budget-table-wrap">
                <table class="compact-table">
                    <thead><tr><th>Description</th><th>Calculation</th><th>Cost</th><th>Notes</th><th></th></tr></thead>
                    <tbody>${State.project.budget.costItems.map(item => {
                        const calculated = calculateBudgetCostItem(State.project, item, snapshot.counts, snapshot.standardPayingPeople);
                        const selected = State.selected.budgetCostId === item.id;
                        return `
                            <tr class="${selected ? "selected-row" : ""}">
                                <td><input data-update-kind="budget-cost" data-id="${attr(item.id)}" data-field="description" value="${attr(item.description)}"></td>
                                <td><select data-update-kind="budget-cost" data-id="${attr(item.id)}" data-field="calculationMethod">${BUDGET_COST_METHODS.map(method => `<option value="${attr(method)}" ${item.calculationMethod === method ? "selected" : ""}>${h(method)}</option>`).join("")}</select></td>
                                <td><input data-update-kind="budget-cost" data-id="${attr(item.id)}" data-field="cost" type="number" min="0" step="0.01" value="${attr(Number(calculated.toFixed(2)))}" ${item.calculationMethod === BUDGET_COST_FIXED ? "" : "readonly"}></td>
                                <td><input data-update-kind="budget-cost" data-id="${attr(item.id)}" data-field="notes" value="${attr(item.notes)}"></td>
                                <td class="row-actions">
                                    <button class="small-button secondary" data-action="selectBudgetCost" data-id="${attr(item.id)}" type="button">${selected ? "Selected" : "Select"}</button>
                                    <button class="small-button secondary" data-action="editBudgetCost" data-id="${attr(item.id)}" type="button">Edit</button>
                                    <button class="small-button danger" data-action="removeBudgetCost" data-id="${attr(item.id)}" type="button">Remove</button>
                                </td>
                            </tr>`;
                    }).join("")}</tbody>
                </table>
            </div>`;
    }

    function budgetBreakdownBox(title, rows) {
        return `
            <div class="budget-breakdown-box">
                <h4>${h(title)}</h4>
                ${rows.map(([label, value, bold, className]) => `
                    <div class="budget-kv ${bold ? "bold" : ""}">
                        <span>${h(label)}</span>
                        <strong class="${className || ""}">${h(value)}</strong>
                    </div>`).join("")}
            </div>`;
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
        const desktopOpen = isDesktopMode();
        const exportOpen = defaultOpen => defaultOpen || desktopOpen ? " open" : "";
        return `
            ${sectionHeader("Exports", "Create PDFs, CSV data, RTF files, and section files without replacing unrelated camp data.")}
            <div class="card" style="margin-bottom:12px">
                <label style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
                    <span style="font-weight:800;color:var(--green-900)">PDF page size</span>
                    <select data-project-field="paperSize" style="max-width:200px">
                        <option value="a4" ${State.project.paperSize === "a4" ? "selected" : ""}>A4</option>
                        <option value="letter" ${State.project.paperSize === "letter" ? "selected" : ""}>US Letter</option>
                    </select>
                </label>
            </div>
            <div class="grid two export-grid">
                <details class="panel export-panel-details"${exportOpen(true)}>
                    <summary>Complete camp pack</summary>
                    <div class="export-panel-body panel-body">
                        <p>One PDF for the whole camp, including overview, personnel, tent allocation, plan, menu, kit, shopping, budget and chores.</p>
                        <button data-action="exportCampPackPdf" type="button">Export camp pack PDF</button>
                    </div>
                </details>
                <details class="panel export-panel-details"${exportOpen(true)}>
                    <summary>Data export</summary>
                    <div class="export-panel-body panel-body">
                        <p>Creates a ZIP containing people-and-tents.csv, menu.csv, kit-list.csv, chores.csv and budget.csv.</p>
                        <button class="teal" data-action="exportCsvZip" type="button">Export CSV ZIP</button>
                    </div>
                </details>
                <details class="panel export-panel-details"${exportOpen(false)}>
                    <summary>Planning PDFs</summary>
                    <div class="export-panel-body panel-body row-actions">
                        <button data-action="exportMenuPdf" type="button">Menu PDF</button>
                        <button data-action="exportKitchenMenuPdf" type="button">Kitchen menu PDF</button>
                        <button data-action="exportMenuRtf" type="button">Menu RTF</button>
                        <button data-action="exportPlanPdf" type="button">The Plan PDF</button>
                        <button data-action="exportChoresPdf" type="button">Chores PDF</button>
                        <button data-action="exportShoppingPdf" type="button">Shopping lists PDF</button>
                        <button data-action="exportShoppingRtf" type="button">Shopping lists RTF</button>
                    </div>
                </details>
                <details class="panel export-panel-details"${exportOpen(false)}>
                    <summary>Kit list PDFs</summary>
                    <div class="export-panel-body panel-body row-actions">
                        <button data-action="exportKitPdf" type="button">All kit PDF</button>
                        <button data-action="exportGroupKitPdf" type="button">Group kit PDF</button>
                        <button data-action="exportParticipantKitPdf" type="button">Participant kit PDF</button>
                    </div>
                </details>
                <details class="panel export-panel-details"${exportOpen(false)}>
                    <summary>Tent allocation</summary>
                    <div class="export-panel-body panel-body row-actions">
                        <button data-action="exportTentTablePdf" type="button">Tent table PDF</button>
                        <button data-action="exportTentTagsPdf" type="button">Tent tags PDF</button>
                        <button data-action="exportTentLayoutPdf" type="button">Tent layout PDF</button>
                        <button data-action="makeTentTable" type="button">Preview table</button>
                    </div>
                </details>
                <details class="panel export-panel-details"${exportOpen(false)}>
                    <summary>Budget</summary>
                    <div class="export-panel-body panel-body row-actions">
                        <button data-action="exportBudgetPdf" type="button">Budget PDF</button>
                        <button class="teal" data-action="exportBudgetCsv" type="button">Budget CSV</button>
                    </div>
                </details>
                <details class="panel export-panel-details"${exportOpen(false)}>
                    <summary>Section data files</summary>
                    <div class="export-panel-body panel-body grid two">${sectionRows}</div>
                </details>
            </div>
        `;
    }

    async function runAction(action, data = {}) {
        const map = {
            switchSection: () => switchSection(data.section),
            switchMenuTab: () => { State.menuTab = data.tab; renderMain(); },
            switchChoresTab: () => { State.choresTab = data.tab; renderMain(); },
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
            toggleShoppingItem: () => {
                const list = State.project.shoppingLists.find(l => l.id === data.listId);
                if (!list) return;
                const item = list.items.find(i => i.id === data.id);
                if (item) mutate(item.checked ? "Unchecked item." : "Checked item.", () => { item.checked = !item.checked; });
            },
            addBudgetCost: () => editBudgetCost(),
            editBudgetCost: () => editBudgetCost(data.id),
            selectBudgetCost: () => selectBudgetCost(data.id),
            editSelectedBudgetCost,
            removeBudgetCost: () => removeBudgetCost(data.id),
            removeSelectedBudgetCost,
            useRecommendedBudgetCharge,
            changeBudgetSymbol,
            addPlanActivitiesToBudget,
            loadSampleBudget,
            sortBudgetPeople: () => sortBudgetPeople(data.field),
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
            exportBudgetPdf,
            exportBudgetCsv,
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
                ["Budget PDF", "exportBudgetPdf"],
                ["Budget CSV", "exportBudgetCsv"],
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
            } else if (kind === "budget-setting") {
                updateBudgetSettingField(field, target.type === "checkbox" ? target.checked : target.value);
            } else if (kind === "budget-person") {
                updateBudgetPersonField(id, field, target.type === "checkbox" ? target.checked : target.value);
            } else if (kind === "budget-cost") {
                updateBudgetCostField(id, field, target.value);
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
            <section class="card"><h3>Friend links</h3>${linkRows(State.project.friendLinks).map(row => `<div class="pill">${h(row)}</div>`).join("") || `<div class="empty">No friend requests yet — add links to keep these people together in a tent.</div>`}<div class="toolbar"><button data-local-action="addFriendLink" type="button">Add link</button><button class="danger" data-local-action="removeFriendLink" type="button">Remove link</button></div></section>
            <section class="card"><h3>Foe links</h3>${linkRows(State.project.foeLinks).map(row => `<div class="pill">${h(row)}</div>`).join("") || `<div class="empty">No separation requests yet — add links to keep people apart.</div>`}<div class="toolbar"><button data-local-action="addFoeLink" type="button">Add link</button><button class="danger" data-local-action="removeFoeLink" type="button">Remove link</button></div></section>
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
            listItem?.items.push({ id: uid(), name: "", quantity: 1, checked: false });
        });
    }

    function removeShoppingItem(listId, itemId) {
        const listItem = State.project.shoppingLists.find(item => item.id === listId);
        const item = listItem?.items.find(i => i.id === itemId);
        if (!item) return;
        const itemIndex = listItem.items.indexOf(item);
        mutate("Removed shopping item.", () => {
            listItem.items = listItem.items.filter(i => i.id !== itemId);
        }, { skipToast: true });
        // Item 1: shopping items can be deleted via a fast swipe gesture, so a
        // blocking "are you sure?" dialog would defeat the point — instead, give
        // a genuine few-second window to undo the removal
        toast(`Removed "${item.name || "item"}".`, {
            onUndo: () => {
                mutate("Restored shopping item.", () => {
                    listItem.items.splice(Math.min(itemIndex, listItem.items.length), 0, item);
                });
            }
        });
    }

    function uniqueShoppingListName() {
        const names = new Set(State.project.shoppingLists.map(item => item.name.toLowerCase()));
        let index = State.project.shoppingLists.length + 1;
        let name = `Shopping list ${index}`;
        while (names.has(name.toLowerCase())) name = `Shopping list ${++index}`;
        return name;
    }

    function updateBudgetSettingField(field, value) {
        const settings = State.project.budget.settings;
        const numeric = new Set([
            "proposedStandardCharge",
            "foodOnlyAmount",
            "leaderContributionAmount",
            "youngLeaderContributionAmount",
            "dayVisitorDayRate",
            "dayVisitorCustomContributionAmount",
            "foodCostPerPersonPerDay"
        ]);
        if (field === "leaderRule") settings.leaderRule = mapBudgetLeaderRule(value);
        else if (field === "youngLeaderRule") settings.youngLeaderRule = mapBudgetYoungLeaderRule(value);
        else if (field === "dayVisitorRule") settings.dayVisitorRule = mapBudgetDayVisitorRule(value);
        else if (field === "currencySymbol") settings.currencySymbol = normalizeBudgetCurrency(value);
        else if (field === "foodDays") settings.foodDays = Math.max(0, Math.round(number(value, settings.foodDays)));
        else if (field === "notes") settings.notes = clean(value);
        else if (numeric.has(field)) settings[field] = nonNegative(value);
        updateBudgetCalculatedCosts(State.project);
    }

    function updateBudgetPersonField(id, field, value) {
        const item = State.project.budget.people.find(row => row.id === id);
        if (!item) return;
        if (field === "personType") item.personType = mapBudgetPersonType(value);
        else if (field === "camperType") item.camperType = mapBudgetCamperType(value);
        else if (field === "isDayVisitor") item.isDayVisitor = Boolean(value);
        else if (field === "contributionRule") item.contributionRule = mapBudgetContributionRule(value);
        else if (field === "contributionAmount") item.contributionAmount = nonNegative(value);
        else if (field === "notes") item.notes = clean(value);
        else if (field === "name") item.name = clean(value, item.name);
        pushBudgetPeopleToProject(State.project);
        updateBudgetCalculatedCosts(State.project);
    }

    function updateBudgetCostField(id, field, value) {
        const item = State.project.budget.costItems.find(row => row.id === id);
        if (!item) return;
        if (field === "calculationMethod") {
            item.calculationMethod = mapBudgetCostMethod(value);
            if (item.calculationMethod === BUDGET_COST_FIXED) {
                item.quantity = 1;
                item.unitCost = item.cost;
            }
        } else if (field === "cost") {
            if (item.calculationMethod === BUDGET_COST_FIXED) {
                item.cost = nonNegative(value);
                item.quantity = 1;
                item.unitCost = item.cost;
            }
        } else if (field === "description") {
            item.description = clean(value, "Budget cost");
        } else if (field === "notes") {
            item.notes = clean(value);
        }
        updateBudgetCalculatedCosts(State.project);
    }

    function selectBudgetCost(id) {
        State.selected.budgetCostId = id;
        renderMain();
    }

    async function editBudgetCost(id) {
        const existing = State.project.budget.costItems.find(item => item.id === id);
        const initial = existing ? { ...existing } : budgetCostItem({ description: "", calculationMethod: BUDGET_COST_FIXED, quantity: 1, unitCost: 0, cost: 0 });
        const result = await promptFields(existing ? "Edit budget cost" : "Add budget cost", [
            { name: "description", label: "Description", value: initial.description === "Budget cost" ? "" : initial.description, required: true },
            { name: "calculationMethod", label: "Calculation", type: "select", options: BUDGET_COST_METHODS, value: initial.calculationMethod },
            { name: "quantity", label: "Quantity", type: "number", step: "0.01", value: initial.quantity },
            { name: "unitCost", label: "Unit cost", type: "number", step: "0.01", value: initial.unitCost },
            { name: "cost", label: "Fixed total cost", type: "number", step: "0.01", value: initial.cost },
            { name: "notes", label: "Notes", type: "textarea", value: initial.notes, full: true }
        ], { wide: true, okText: existing ? "Save cost" : "Add cost" });
        if (!result) return;
        mutate(existing ? "Updated budget cost." : "Added budget cost.", () => {
            const method = mapBudgetCostMethod(result.calculationMethod);
            const target = existing || budgetCostItem();
            Object.assign(target, {
                description: clean(result.description, "Budget cost"),
                calculationMethod: method,
                quantity: method === BUDGET_COST_FIXED ? 1 : Math.max(0.0001, number(result.quantity, 1)),
                unitCost: method === BUDGET_COST_FIXED ? nonNegative(result.cost) : nonNegative(result.unitCost),
                cost: nonNegative(method === BUDGET_COST_FIXED ? result.cost : result.cost),
                notes: clean(result.notes)
            });
            if (!existing) State.project.budget.costItems.push(target);
            State.selected.budgetCostId = target.id;
            updateBudgetCalculatedCosts(State.project);
        });
    }

    async function editSelectedBudgetCost() {
        const selected = State.selected.budgetCostId && State.project.budget.costItems.find(item => item.id === State.selected.budgetCostId);
        if (!selected) {
            await alertBox("Budget", "Select a budget cost to edit.");
            return;
        }
        await editBudgetCost(selected.id);
    }

    async function removeBudgetCost(id) {
        const item = State.project.budget.costItems.find(row => row.id === id);
        if (!item || !(await confirmBox("Remove budget cost", `Remove ${item.description}?`))) return;
        mutate("Removed budget cost.", () => {
            State.project.budget.costItems = State.project.budget.costItems.filter(row => row.id !== id);
            if (State.selected.budgetCostId === id) State.selected.budgetCostId = "";
            updateBudgetCalculatedCosts(State.project);
        });
    }

    async function removeSelectedBudgetCost() {
        const selected = State.selected.budgetCostId && State.project.budget.costItems.find(item => item.id === State.selected.budgetCostId);
        if (!selected) {
            await alertBox("Budget", "Select a budget cost to remove.");
            return;
        }
        await removeBudgetCost(selected.id);
    }

    function useRecommendedBudgetCharge() {
        const snapshot = calculateBudgetSnapshot(State.project);
        mutate("Standard charge set to recommended charge.", () => {
            State.project.budget.settings.proposedStandardCharge = snapshot.recommendedRoundedStandardCharge;
            updateBudgetCalculatedCosts(State.project);
        });
    }

    async function changeBudgetSymbol() {
        const current = State.project.budget.settings.currencySymbol;
        const result = await promptFields("Change money symbol", [
            { name: "currencySymbol", label: "Money symbol", type: "select", options: BUDGET_CURRENCY_OPTIONS.map(option => option[0]), labels: Object.fromEntries(BUDGET_CURRENCY_OPTIONS), value: current }
        ]);
        if (!result) return;
        mutate(`Money symbol changed to ${budgetCurrencyLabel(result.currencySymbol)}.`, () => {
            State.project.budget.settings.currencySymbol = normalizeBudgetCurrency(result.currencySymbol);
        });
    }

    function addPlanActivitiesToBudget() {
        let added = 0;
        mutate("Added plan activities to the budget.", () => {
            const existingKeys = new Set(State.project.budget.costItems.filter(isImportedBudgetActivityCost).map(item => budgetActivityKey(item.description, extractBudgetActivityDate(item.notes) || State.project.startDate)));
            State.project.planItems
                .filter(item => !clean(item.boundaryKind) && clean(item.title))
                .sort((a, b) => localeSort(a.date, b.date) || a.startMinute - b.startMinute || localeSort(a.title, b.title))
                .forEach(item => {
                    const key = budgetActivityKey(item.title, item.date);
                    if (existingKeys.has(key)) return;
                    existingKeys.add(key);
                    State.project.budget.costItems.push(budgetCostItem({
                        description: `Activity: ${item.title.trim()}`,
                        calculationMethod: BUDGET_COST_FIXED,
                        quantity: 1,
                        unitCost: 0,
                        cost: 0,
                        notes: `${BUDGET_IMPORTED_ACTIVITY_MARKER} ${item.date}. Add a cost here if this activity costs money.${item.notes ? " " + item.notes.trim() : ""}`
                    }));
                    added++;
                });
            State.project.budget.importedSourceSummary = added === 0
                ? "No new plan activities needed budget cost lines."
                : `Added ${added} plan activit${added === 1 ? "y" : "ies"} as editable budget cost lines.`;
            updateBudgetCalculatedCosts(State.project);
        });
        setStatus(State.project.budget.importedSourceSummary);
    }

    function budgetActivityKey(title, date) {
        return `${isoDate(date)}|${clean(title).replace(/^Activity:\s*/i, "").toLowerCase().split(/\s+/).join(" ")}`;
    }

    function extractBudgetActivityDate(notes) {
        const match = /\b\d{4}-\d{2}-\d{2}\b/.exec(clean(notes));
        return match ? match[0] : "";
    }

    async function loadSampleBudget() {
        if (!(await confirmBox("Load sample budget", "Load sample budget settings and cost lines? This replaces budget cost lines and budget contribution settings, but it does not change camp details or Personnel."))) return;
        mutate("Loaded sample budget.", () => {
            State.project.budget.settings = normalizeBudgetSettings({
                leaderRule: BUDGET_LEADERS_PAY_EXACT,
                youngLeaderRule: BUDGET_YOUNG_LEADERS_PAY_FOOD_ONLY,
                dayVisitorRule: BUDGET_DAY_VISITORS_PAY_DAY_RATE,
                proposedStandardCharge: 55,
                foodOnlyAmount: 15,
                leaderContributionAmount: 20,
                dayVisitorDayRate: 12.5,
                currencySymbol: "£",
                foodCostPerPersonPerDay: 4.25,
                foodDays: budgetDurationDays(State.project),
                notes: "Sample budget settings. People still come from Personnel."
            });
            State.project.budget.costItems = [
                sampleBudgetCost("Site hire", BUDGET_COST_FIXED, 1, 180, 180, "Fixed total cost example."),
                sampleBudgetCost("Badges", BUDGET_COST_QUANTITY, 12, 1.25, 15, "Quantity x unit example."),
                sampleBudgetCost("Craft materials", BUDGET_COST_PER_PERSON, 1, 2.5, 0, "Calculated from total people."),
                sampleBudgetCost("Necker activity pack", BUDGET_COST_PER_CAMPER, 1, 3, 0, "Calculated from campers only."),
                sampleBudgetCost("Generator hire", BUDGET_COST_PER_NIGHT, 1, 18, 0, "Calculated from camp nights."),
                sampleBudgetCost("Toilet cleaning", BUDGET_COST_PER_DAY, 1, 10, 0, "Calculated from camp days."),
                sampleBudgetCost("Activity: Archery", BUDGET_COST_FIXED, 1, 45, 45, `${BUDGET_IMPORTED_ACTIVITY_MARKER} Sample paid activity.`),
                sampleBudgetCost("Activity: Campfire", BUDGET_COST_FIXED, 1, 0, 0, `${BUDGET_IMPORTED_ACTIVITY_MARKER} Sample free activity.`)
            ];
            State.project.budget.people.forEach(personRow => {
                personRow.contributionRule = BUDGET_CONTRIBUTION_STANDARD;
                personRow.contributionAmount = 0;
                personRow.notes = "";
            });
            const people = [...State.project.budget.people].sort((a, b) => budgetPersonSortGroup(a) - budgetPersonSortGroup(b) || localeSort(a.name, b.name));
            if (people[1]) Object.assign(people[1], { contributionRule: BUDGET_CONTRIBUTION_EXACT, contributionAmount: 30, notes: "Sample exact amount contribution." });
            if (people[2]) Object.assign(people[2], { contributionRule: BUDGET_CONTRIBUTION_FOOD_ONLY, notes: "Sample food-only contribution." });
            if (people[3]) Object.assign(people[3], { contributionRule: BUDGET_CONTRIBUTION_EXCLUDED, notes: "Sample excluded person." });
            State.project.budget.importedSourceSummary = "Loaded sample budget settings and cost lines. Personnel was not changed.";
            updateBudgetCalculatedCosts(State.project);
        });
    }

    function sampleBudgetCost(description, calculationMethod, quantity, unitCost, cost, notes) {
        return budgetCostItem({ description, calculationMethod, quantity, unitCost, cost, notes });
    }

    function budgetPersonSortGroup(personRow) {
        if (personRow.personType === BUDGET_PERSON_ADULT) return 3;
        if (personRow.personType === BUDGET_PERSON_YOUNG_LEADER) return 2;
        return 1;
    }

    function sortBudgetPeople(field) {
        if (State.sort.budgetPeople === field) {
            State.sort.budgetPeopleDir = State.sort.budgetPeopleDir === "desc" ? "asc" : "desc";
        } else {
            State.sort.budgetPeople = field;
            State.sort.budgetPeopleDir = "asc";
        }
        renderMain();
    }

    function showModal(title, body, actions = [], options = {}) {
        const host = $("#modalHost");
        // Item 33: remember what had focus so we can restore it on close
        State._modalReturnFocus = document.activeElement;
        host.classList.remove("hidden");
        const bodyNode = typeof body === "string" ? document.createElement("div") : body;
        if (typeof body === "string") bodyNode.innerHTML = body;
        host.innerHTML = `
            <div class="modal ${options.wide ? "wide" : ""}" role="dialog" aria-modal="true" aria-label="${attr(title)}" tabindex="-1">
                <div class="modal-header"><h2>${h(title)}</h2></div>
                <div class="modal-body"></div>
                <div class="modal-actions"></div>
            </div>`;
        $(".modal-body", host).appendChild(bodyNode);
        const actionRow = $(".modal-actions", host);
        const buttons = actions.length ? actions : [{ label: "OK", value: "ok" }];

        const modalEl = $(".modal", host);

        // Item 33: focus trap — keep Tab cycling inside the modal
        function focusableEls() {
            return [...modalEl.querySelectorAll(
                'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )];
        }
        function trapKeydown(event) {
            if (event.key === "Escape") {
                event.preventDefault();
                closeModal();
                return;
            }
            if (event.key !== "Tab") return;
            const items = focusableEls();
            if (!items.length) return;
            const first = items[0], last = items[items.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
        host.addEventListener("keydown", trapKeydown);
        host._trapKeydown = trapKeydown;

        return new Promise(resolve => {
            buttons.forEach(action => {
                const button = document.createElement("button");
                button.type = "button";
                button.textContent = action.label;
                if (action.className) button.className = action.className;
                button.addEventListener("click", () => {
                    const value = action.value ?? action.label;
                    // Item 3: let the caller (e.g. promptFields) supply a validation
                    // hook that runs before the modal closes — without this, a
                    // "required" field could be submitted blank with no warning,
                    // since the HTML required attribute alone was never actually
                    // checked anywhere.
                    if (options.validate && !options.validate(value, bodyNode)) return;
                    closeModal();
                    resolve(value);
                });
                actionRow.appendChild(button);
            });

            // Item 33: move focus into the modal once it's painted
            requestAnimationFrame(() => {
                const items = focusableEls();
                (items[0] || modalEl).focus();
            });
        });
    }

    function closeModal() {
        const host = $("#modalHost");
        if (host._trapKeydown) {
            host.removeEventListener("keydown", host._trapKeydown);
            host._trapKeydown = null;
        }
        host.classList.add("hidden");
        host.innerHTML = "";
        // Item 33: restore focus to whatever opened the modal
        if (State._modalReturnFocus && document.contains(State._modalReturnFocus)) {
            State._modalReturnFocus.focus();
        }
        State._modalReturnFocus = null;
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

        // Item 3: actually enforce `required` fields instead of leaving the HTML
        // attribute purely decorative — block the OK action and show which
        // field(s) are missing rather than silently letting the dialog close
        function validateRequiredFields(actionValue) {
            if (actionValue !== "ok") return true; // Cancel always allowed through
            let firstInvalid = null;
            fields.forEach(field => {
                if (!field.required) return;
                const input = body.querySelector(`[name="${cssEscape(field.name)}"]`);
                if (!input) return;
                const empty = field.type === "multi"
                    ? !$all(`[name="${cssEscape(field.name)}"]:checked`, body).length
                    : field.type === "checkbox"
                        ? false // a required checkbox doesn't have a meaningful "empty" state here
                        : !String(input.value || "").trim();
                input.closest("label")?.classList.toggle("field-invalid", empty);
                if (empty && !firstInvalid) firstInvalid = input;
            });
            if (firstInvalid) {
                firstInvalid.focus();
                return false;
            }
            return true;
        }

        const value = await showModal(title, body, [
            { label: options.okText || "OK", value: "ok" },
            { label: "Cancel", value: "cancel", className: "secondary" }
        ], { wide: options.wide, validate: validateRequiredFields });
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

    function toast(message, options = {}) {
        const node = document.createElement("div");
        node.className = "toast";
        if (options.onUndo) {
            // Item 1: a quick "Undo" affordance for fast/swipe-triggered deletes —
            // protects against accidental removal without interrupting the gesture
            // with a blocking confirm dialog
            node.classList.add("toast-with-action");
            const text = document.createElement("span");
            text.textContent = message;
            const undoBtn = document.createElement("button");
            undoBtn.type = "button";
            undoBtn.className = "toast-undo";
            undoBtn.textContent = "Undo";
            undoBtn.addEventListener("click", () => {
                clearTimeout(removeTimer);
                node.remove();
                options.onUndo();
            });
            node.appendChild(text);
            node.appendChild(undoBtn);
        } else {
            node.textContent = message;
        }
        $("#toastHost").appendChild(node);
        const removeTimer = setTimeout(() => node.remove(), options.onUndo ? 5000 : 3200);
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
        link.rel = "noopener";
        // Item 26: Safari (especially iOS) requires the anchor to be attached to the
        // document for the download attribute to be honoured reliably; without this
        // some versions open the file inline instead of downloading it.
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 4000);
        setStatus(`Saved ${fileName}.`);
    }

    function printHtml(title, html) {
        if (window.Android?.printHtml) {
            window.Android.printHtml(title, textToBase64(html));
            return;
        }
        // Item 27: window.open must happen synchronously with the user gesture or
        // popup blockers (especially iOS Safari) silently swallow it. Guard against
        // a blocked popup with a clear message instead of a confusing silent failure.
        const win = window.open("", "_blank");
        if (!win) {
            toast("Couldn't open the print window — check your browser's popup blocker for this site.");
            return;
        }
        win.document.write(html);
        win.document.close();
        // Give the new document a moment to lay out images/fonts before printing
        win.focus();
        setTimeout(() => { try { win.print(); } catch (_) {} }, 80);
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
            ].join("\n"),
            "budget.csv": buildBudgetCsv()
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
            budget: { budget: p.budget },
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
            case "budget":
                p.budget = normalizeBudget(d.budget);
                syncBudgetPeople(p);
                normalizeBudgetCosts(p);
                updateBudgetCalculatedCosts(p);
                break;
        }
    }

    async function exportCampPackPdf() {
        const lines = [];
        const sections = [addExportOverview, addExportPeople, addExportTents, addExportPlan,
                           (l) => addExportMenu(l, false), addExportShopping,
                           addExportBudget, (l) => addExportKit(l, null), addExportChores];
        // Item 13/17: each top-level section starts on its own fresh page so the
        // auto-generated table of contents page numbers line up with where a
        // reader actually lands when they flip to that page
        sections.forEach((fn, index) => {
            if (index > 0) lines.push({ text: "", pageBreak: true });
            fn(lines);
        });
        await savePdf("camp-pack.pdf", "Camp pack", lines);
    }

    async function exportMenuPdf() {
        const pdf = new ScoutPdf("Camp menu", State.project, { toc: false });
        const warnings = buildMenuWarnings(State.project);
        if (warnings.length) pdf.addWarningBox(warnings.join("  |  "));
        pdf.addTwoColumnSections(enumerateDates(State.project.startDate, State.project.endDate).map(menuDayPdfSection));
        await saveBytesFile(`${safeFileName(State.project.campName)}-${datedFileName("menu.pdf")}`, "application/pdf", pdf.bytes());
    }

    async function exportKitchenMenuPdf() {
        const pdf = new ScoutPdf("Kitchen menu", State.project, { toc: false });
        addKitchenMenuPdf(pdf);
        await saveBytesFile(`${safeFileName(State.project.campName)}-${datedFileName("kitchen-menu.pdf")}`, "application/pdf", pdf.bytes());
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

    // Item 18: standalone Chore Rota uses the improved day blocks with sessions as
    // columns, matching the desktop export.
    async function exportChoresPdf() {
        const pdf = new ScoutPdf("Chore rota", State.project, { toc: false });
        enumerateDates(State.project.startDate, State.project.endDate).forEach((date, index) => {
            if (index > 0) pdf.y += 4;
            addChoreRotaDay(pdf, date);
        });
        await saveBytesFile(`${safeFileName(State.project.campName)}-${datedFileName("chores.pdf")}`, "application/pdf", pdf.bytes());
    }

    async function exportPlanPdf() {
        const pdf = new ScoutPdf("The Plan", State.project, { toc: false });
        pdf.addTwoColumnSections(enumerateDates(State.project.startDate, State.project.endDate).map(planDayPdfSection));
        await saveBytesFile(`${safeFileName(State.project.campName)}-${datedFileName("the-plan.pdf")}`, "application/pdf", pdf.bytes());
    }

    async function exportShoppingPdf() {
        const pdf = new ScoutPdf("Shopping lists", State.project, { toc: false });
        addShoppingListPdfTables(pdf, State.project.shoppingLists || []);
        await saveBytesFile(`${safeFileName(State.project.campName)}-${datedFileName("shopping-lists.pdf")}`, "application/pdf", pdf.bytes());
    }

    async function exportBudgetPdf() {
        const lines = [];
        addExportBudget(lines);
        await savePdf("budget.pdf", "Budget", lines);
    }

    async function exportBudgetCsv() {
        await saveTextFile(`${safeFileName(State.project.campName)}-${datedFileName("budget.csv")}`, "text/csv", buildBudgetCsv());
    }

    // Desktop-style landscape allocation table.
    async function exportTentTablePdf() {
        const pdf = new ScoutPdf("Tent allocation table", State.project, { orientation: "landscape", toc: false });
        pdf.addSectionBanner("Tent allocation table");

        const warnings = buildTentWarnings(State.project);
        const showWarnings = State.project.tents.some(tent => tentSpecificWarnings(tent, warnings).length);
        if (showWarnings) pdf.addWarningBox(warnings.join("  |  "));
        const rows = State.project.tents.map(tent => {
            const occupants = orderedPeople().filter(p => p.tentId === tent.id);
            const names = occupants.map(p => p.name).join(", ") || "—";
            const row = [
                tent.name,
                tentTypeLabel(tent),
                names,
                tentOccupantSummary(occupants) || "—"
            ];
            if (showWarnings) row.push(tentSpecificWarnings(tent, warnings).join("; ") || "—");
            return row;
        });

        const columns = showWarnings
            ? [
                { label: "Tent name", width: 0.16 },
                { label: "Type", width: 0.14 },
                { label: "People allocated", width: 0.34 },
                { label: "Occupants", width: 0.20 },
                { label: "Warnings" }
            ]
            : [
                { label: "Tent name", width: 0.18 },
                { label: "Type", width: 0.16 },
                { label: "People allocated", width: 0.42 },
                { label: "Occupants" }
            ];
        pdf.addWrappedTable(columns, rows, { minRowHeight: 28, maxLines: 4 });

        const unallocated = orderedPeople().filter(p => !p.tentId);
        if (unallocated.length) {
            pdf.addSubHeading("Unallocated people", "red");
            pdf.addText(unallocated.map(p => p.name).join(", "), { color: "red" });
        }

        await saveBytesFile(`${safeFileName(State.project.campName)}-${datedFileName("tent-table.pdf")}`, "application/pdf", pdf.bytes());
    }

    // Desktop-style cut-out tags: three per page, left details, right black marker.
    async function exportTentTagsPdf() {
        const pdf = new ScoutPdf("Tent tags", State.project, { plain: true, toc: false });
        if (!State.project.tents.length) {
            pdf.y = 72;
            pdf.addText("No tents have been added yet.");
        } else {
            pdf.addTentTags(State.project.tents.map(tent => ({ tent, occupants: orderedPeople().filter(p => p.tentId === tent.id) })));
        }
        await saveBytesFile(`${safeFileName(State.project.campName)}-${datedFileName("tent-tags.pdf")}`, "application/pdf", pdf.bytes());
    }

    // Item 10: a literal to-scale site map mirroring the in-app canvas — tents and
    // site items drawn as positioned rectangles with a legend, not raw coordinates
    // as text, so the printout actually functions as a map you can navigate by.
    async function exportTentLayoutPdf() {
        const pdf = new ScoutPdf("Tent layout", State.project, { toc: false });
        pdf.addSectionBanner("Site map");

        const allItems = [
            ...State.project.tents.map(t => ({
                x: t.x || 0, y: t.y || 0, w: 170 * number(t.sizeScale, 1), h: 145 * number(t.sizeScale, 1),
                label: t.name, kind: "tent", colour: t.colour, isBunk: isBunkTent(t), isCaravan: isCaravanMotorhome(t),
                occupants: orderedPeople().filter(p => p.tentId === t.id)
            })),
            ...State.project.siteItems.map(s => ({
                x: s.x || 0, y: s.y || 0, w: 92 * number(s.sizeScale, 1), h: 90 * number(s.sizeScale, 1),
                label: s.name, kind: "site", colour: s.colour
            }))
        ];

        if (!allItems.length) {
            pdf.addText("No tents or site items have been placed on the layout yet.");
        } else {
            const canvasWidth  = Math.max(900, ...allItems.map(i => i.x + i.w + 40));
            const canvasHeight = Math.max(600, ...allItems.map(i => i.y + i.h + 40));
            pdf.addSiteMap(allItems, canvasWidth, canvasHeight);
        }

        pdf.addSubHeading("Tent occupants");
        State.project.tents.forEach(tent => {
            const people = orderedPeople().filter(p => p.tentId === tent.id).map(p => p.name).join(", ") || "None";
            pdf.addText(`${tent.name}: ${people}`);
        });

        await saveBytesFile(`${safeFileName(State.project.campName)}-${datedFileName("tent-layout.pdf")}`, "application/pdf", pdf.bytes());
    }

    function menuDayPdfSection(date) {
        const lines = [];
        const note = State.project.menuDayNotes.find(n => n.date === date);
        if (note?.notes) lines.push(`Day note: ${note.notes}`);
        activeMealSlots(State.project, date).forEach(slot => {
            const items = State.project.menuItems
                .filter(item => item.date === date && item.slot === slot && hasMenuContent(item))
                .sort((a, b) => localeSort(a.meal, b.meal) || localeSort(a.pudding, b.pudding));
            if (!items.length) {
                lines.push(`${slot}: not planned`);
                return;
            }
            items.forEach(item => {
                const parts = [
                    item.meal || "No food recorded",
                    item.pudding ? `Pudding: ${item.pudding}` : "",
                    item.dietaryNotes ? `Dietary: ${item.dietaryNotes}` : "",
                    item.notes
                ].filter(Boolean);
                lines.push(`${slot}: ${parts.join(" | ")}`);
            });
        });
        return { title: displayDate(date, true), lines };
    }

    function planDayPdfSection(date) {
        return { title: displayDate(date, true), lines: planLinesForDate(date) };
    }

    function planLinesForDate(date) {
        const groups = new Map();
        State.project.planItems
            .filter(item => item.date === date)
            .forEach(item => {
                const key = `${item.startMinute}-${item.endMinute}`;
                if (!groups.has(key)) groups.set(key, []);
                groups.get(key).push(item);
            });
        const lines = [];
        [...groups.entries()]
            .map(([key, items]) => ({ key, items, start: items[0]?.startMinute || 0, end: items[0]?.endMinute || 0 }))
            .sort((a, b) => a.start - b.start || a.end - b.end)
            .forEach(group => {
                const items = group.items.slice().sort((a, b) => localeSort(planAudienceText(a), planAudienceText(b)) || localeSort(a.title, b.title));
                const range = `${planTime(group.start)}-${planTime(group.end)}`;
                if (items.length === 1) {
                    const item = items[0];
                    const details = [planAudienceText(item), item.notes].filter(Boolean).join(" | ");
                    lines.push(`${range} - ${item.title}${details ? " - " + details : ""}`);
                } else {
                    lines.push(`${range} - Parallel activities (all run at the same time)`);
                    items.forEach(item => lines.push(`${planAudienceText(item)} - ${item.title}${item.notes ? " | " + item.notes : ""}`));
                }
            });
        return lines.length ? lines : ["No plan items."];
    }

    function choreDayPdfSection(date) {
        const lines = [];
        State.project.choreSessions.forEach(session => {
            const allocations = State.project.choreAllocations
                .filter(allocation => allocation.date === date && allocation.session === session)
                .sort((a, b) => number(a.sortOrder) - number(b.sortOrder) || localeSort(choreName(a.choreItemId), choreName(b.choreItemId)) || localeSort(choreAllocationAssigneeNames(a), choreAllocationAssigneeNames(b)));
            if (!allocations.length) {
                lines.push(`${session}: no allocations`);
                return;
            }
            allocations.forEach(allocation => {
                lines.push(`${session}: ${choreName(allocation.choreItemId)} - ${choreAllocationAssigneeNames(allocation)}${allocation.notes ? " | " + allocation.notes : ""}`);
            });
        });
        return { title: displayDate(date, true), lines };
    }

    function addKitchenMenuPdf(pdf) {
        const warnings = buildMenuWarnings(State.project);
        if (warnings.length) pdf.addWarningBox(warnings.join("  |  "));
        const dietary = State.project.people.filter(person => clean(person.dietaryNotes));
        if (dietary.length) {
            pdf.addSectionBanner("People with dietary notes");
            dietary
                .slice()
                .sort((a, b) => localeSort(a.name, b.name))
                .forEach(person => pdf.addWarningBox(`${person.name}: ${person.dietaryNotes}`));
        }
        enumerateDates(State.project.startDate, State.project.endDate).forEach(date => addKitchenMenuDay(pdf, date));
    }

    function addKitchenMenuDay(pdf, date) {
        pdf.addSectionBanner(displayDate(date, true));
        const note = State.project.menuDayNotes.find(n => n.date === date);
        if (note?.notes) pdf.addText(`Day note: ${note.notes}`, { bold: true });
        activeMealSlots(State.project, date).forEach(slot => {
            const items = State.project.menuItems
                .filter(item => item.date === date && item.slot === slot && hasMenuContent(item))
                .sort((a, b) => localeSort(a.meal, b.meal));
            if (!items.length) {
                addKitchenDetailBlock(pdf, slot, { meal: "Not planned", pudding: "", dietaryNotes: "", notes: "" });
            } else {
                items.forEach(item => addKitchenDetailBlock(pdf, slot, item));
            }
        });
    }

    function addKitchenDetailBlock(pdf, slot, item) {
        const leftWidth = 84;
        const rightWidth = pdf.textWidth() - leftWidth - 8;
        const lines = [];
        lines.push(item.meal || "No food recorded");
        if (item.pudding) lines.push(`Pudding: ${item.pudding}`);
        if (item.dietaryNotes) lines.push(`Dietary: ${item.dietaryNotes}`);
        if (item.notes) lines.push(`Notes: ${item.notes}`);
        const wrappedCount = lines.reduce((sum, line) => sum + wrapText(line, Math.floor(rightWidth / 4.5)).length, 0);
        const height = Math.max(28, wrappedCount * 11 + 12);
        pdf.reserveBlock(height + 4);
        const y = pdf.y;
        pdf._line(pdf.ML, y, pdf.W - pdf.MR, y, "green-light", 0.7);
        pdf._text(slot, pdf.ML, y + 16, 9, true, "green-dark");
        let ty = y + 14;
        lines.forEach((line, index) => {
            wrapText(line, Math.floor(rightWidth / 4.5)).forEach(wrapped => {
                pdf._text(wrapped, pdf.ML + leftWidth + 8, ty, 8.6, index === 0, line.startsWith("Dietary:") ? "red" : "black");
                ty += 11;
            });
        });
        pdf.y += height + 4;
    }

    function addChoreRotaDay(pdf, date) {
        const sessions = State.project.choreSessions.length ? State.project.choreSessions : ["Morning", "Afternoon", "Evening"];
        pdf.addSubHeading(displayDate(date, true));
        const row = sessions.map(session => {
            const allocations = State.project.choreAllocations
                .filter(allocation => allocation.date === date && allocation.session === session)
                .sort((a, b) => number(a.sortOrder) - number(b.sortOrder) || localeSort(choreName(a.choreItemId), choreName(b.choreItemId)));
            if (!allocations.length) return "No allocations";
            return allocations.map(allocation => `${choreName(allocation.choreItemId)} - ${choreAllocationAssigneeNames(allocation)}${allocation.notes ? " | " + allocation.notes : ""}`).join("\n");
        });
        pdf.addWrappedTable(sessions.map(session => ({ label: session })), [row], { minRowHeight: 46, fontSize: 8.2, maxLines: 10 });
    }

    function addShoppingListPdfTables(pdf, lists) {
        const shoppingLists = lists || [];
        if (!shoppingLists.length) {
            pdf.addText("No shopping lists have been added.");
            return;
        }
        shoppingLists.forEach(listItem => {
            const items = (listItem.items || []).filter(item => clean(item.name)).sort((a, b) => localeSort(a.name, b.name));
            pdf.addSubHeading(listItem.name || "Shopping list");
            if (!items.length) {
                pdf.addText("No items in this list.");
                return;
            }
            pdf.addWrappedTable(
                [
                    { label: "", width: 0.08 },
                    { label: "Item", width: 0.72 },
                    { label: "Quantity" }
                ],
                items.map(item => ["", item.name, formatQty(item.quantity)]),
                { minRowHeight: 22, fontSize: 8.8 }
            );
        });
    }

    function isBunkTent(tent) {
        return tent.accommodationType === TERMS.accommodationBunkRoom || clean(tent.type).toLowerCase().includes("bunk");
    }

    function isCaravanMotorhome(tent) {
        const accommodation = clean(tent.accommodationType).toLowerCase();
        const type = clean(tent.type).toLowerCase();
        return accommodation.includes("caravan")
            || accommodation.includes("motorhome")
            || type.includes("caravan")
            || type.includes("motorhome");
    }

    function tentTypeLabel(tent) {
        const accommodation = isBunkTent(tent)
            ? "bunk room"
            : isCaravanMotorhome(tent)
                ? "caravan/motorhome"
                : "tent";
        return `${tentColourName(tent.colour)} ${accommodation}`;
    }

    function tentColourName(value) {
        const key = (isHexColour(value) ? value : "#4CAF50").toUpperCase();
        return {
            "#D7C8A2": "Beige",
            "#212121": "Black",
            "#2196F3": "Blue",
            "#795548": "Brown",
            "#4CAF50": "Green",
            "#00A86B": "Jade",
            "#FF9800": "Orange",
            "#FF8FD2": "Pink",
            "#9C27B0": "Purple",
            "#D32F2F": "Red",
            "#FFFFFF": "White",
            "#FDD835": "Yellow"
        }[key] || "Green";
    }

    function tentOccupantSummary(people) {
        const parts = [];
        addTentSummaryPart(parts, people, TERMS.genderMale, TERMS.personTypeYoungPerson, "male camper");
        addTentSummaryPart(parts, people, TERMS.genderFemale, TERMS.personTypeYoungPerson, "female camper");
        addTentSummaryPart(parts, people, TERMS.genderOther, TERMS.personTypeYoungPerson, "other-gender camper");
        addTentSummaryPart(parts, people, TERMS.genderMale, TERMS.personTypeAdult, "male adult");
        addTentSummaryPart(parts, people, TERMS.genderFemale, TERMS.personTypeAdult, "female adult");
        addTentSummaryPart(parts, people, TERMS.genderOther, TERMS.personTypeAdult, "other-gender adult");
        addTentSummaryPart(parts, people, TERMS.genderMale, TERMS.personTypeYoungLeader, "male young leader");
        addTentSummaryPart(parts, people, TERMS.genderFemale, TERMS.personTypeYoungLeader, "female young leader");
        addTentSummaryPart(parts, people, TERMS.genderOther, TERMS.personTypeYoungLeader, "other-gender young leader");
        const dayVisitors = people.filter(person => person.isDayVisitor).length;
        if (dayVisitors) parts.push(`${dayVisitors} day visitor${dayVisitors === 1 ? "" : "s"}`);
        return parts.join(", ");
    }

    function addTentSummaryPart(parts, people, gender, type, label) {
        const count = people.filter(person => person.gender === gender && person.personType === type).length;
        if (count) parts.push(`${count} ${label}${count === 1 ? "" : "s"}`);
    }

    function tentSpecificWarnings(tent, warnings) {
        const lowerName = clean(tent.name).toLowerCase();
        return warnings
            .filter(warning => clean(warning).toLowerCase().includes(lowerName))
            .map(warning => clean(warning).toLowerCase().startsWith(lowerName)
                ? clean(warning).slice(clean(tent.name).length).trim().replace(/^has\s+/i, "")
                : warning);
    }

    function addExportOverview(lines) {
        lines.push({ text: "Overview", size: 15 });
        lines.push({ text: `Camp: ${State.project.campName}`, bold: true, size: 10 });
        lines.push({ text: `Dates: ${dateRange(State.project)}` });
        lines.push({ text: `Location: ${State.project.location || "Not set"}` });
        lines.push({ text: `People: ${participantCount()}  ·  Tents: ${State.project.tents.length}  ·  Meals: ${activeMenuItems()}  ·  Group kit: ${groupKit().length}  ·  Participant kit: ${participantKit().length}` });
        // Item 14: link a printed copy back to the live, editable version — most
        // useful when handing a paper pack to another adult helping on-site
        if (State.collab.active) {
            lines.push({ text: `Live collaboration code: ${State.collab.code}  (open Camp Planner → Join collaboration to see live updates)`, bold: true });
        }
        lines.push({ text: `Exported: ${new Date().toLocaleString("en-GB")}` });
        if (State.project.notes) {
            lines.push({ text: "Notes", heading: true });
            lines.push({ text: State.project.notes });
        }
        const warnings = [...buildTentWarnings(State.project), ...buildMenuWarnings(State.project)];
        if (warnings.length) {
            lines.push({ text: "Warnings", heading: true, color: "red" });
            warnings.forEach(w => lines.push({ text: `⚠ ${w}`, color: "red" }));
        }
    }

    function addExportPeople(lines) {
        lines.push({ text: "Personnel", size: 15 });
        if (!State.project.people.length) {
            lines.push({ text: "No people have been added." });
            return;
        }
        // Group by type
        const byType = {};
        orderedPeople().forEach(person => {
            const role = personRoleText(person);
            (byType[role] = byType[role] || []).push(person);
        });
        lines.push({
            twoColumnSections: true,
            sections: Object.entries(byType).map(([role, people]) => ({
                title: role,
                lines: people.map(person => {
                const tent = tentName(person.tentId) || "No tent";
                const diet = person.dietaryNotes ? `  Diet: ${person.dietaryNotes}` : "";
                const med  = person.medicalNotes  ? `  Medical: ${person.medicalNotes}` : "";
                    return `${person.name}  (${person.gender !== "Not set" ? person.gender + ", " : ""}${tent})${diet}${med}`;
                })
            }))
        });
        if (State.project.choreTeams.length) {
            lines.push({ text: "Teams", heading: true });
            lines.push({
                twoColumnSections: true,
                sections: State.project.choreTeams.map(team => ({
                    title: team.name,
                    lines: [peopleForTeam(team.id).map(p => p.name).join(", ") || "No members"]
                }))
            });
        }
    }

    function addExportTents(lines) {
        lines.push({ text: "Tent Allocation", size: 15 });
        if (!State.project.tents.length) {
            lines.push({ text: "No tents added." });
            return;
        }
        lines.push({ twoColumnSections: true, sections: State.project.tents.map(tent => {
            const occupants = orderedPeople().filter(p => p.tentId === tent.id);
            return {
                title: tent.name,
                lines: [
                    tentTypeLabel(tent),
                    ...(occupants.length
                        ? occupants.map((p, i) => `${i + 1}. ${p.name} (${personRoleText(p)})`)
                        : ["No occupants allocated."])
                ]
            };
        }) });
        const unallocated = orderedPeople().filter(p => !p.tentId);
        if (unallocated.length) {
            lines.push({ text: "Unallocated people", heading: true, color: "red" });
            unallocated.forEach(p => lines.push({ text: p.name, color: "red" }));
        }
        if (State.project.siteItems.length) {
            lines.push({ text: "Site items", heading: true });
            State.project.siteItems.forEach(item => lines.push({ text: `${item.name}  (${item.type})` }));
        }
    }

    function addExportMenu(lines, kitchen) {
        lines.push({ text: kitchen ? "Kitchen Menu" : "Camp Menu", size: 15 });
        const dietary = State.project.people.filter(p => p.dietaryNotes);
        if (dietary.length) {
            // Item 16: a kitchen printout is exactly where missing an allergy note
            // has real consequences — give it a bordered, tinted box, not just red text
            const summary = "Dietary requirements: " + dietary.map(p => `${p.name} — ${p.dietaryNotes}`).join("  |  ");
            lines.push({ text: summary, warningBox: true });
        }
        if (!kitchen) {
            lines.push({ twoColumnSections: true, sections: enumerateDates(State.project.startDate, State.project.endDate).map(menuDayPdfSection) });
            return;
        }
        enumerateDates(State.project.startDate, State.project.endDate).forEach((date, index) => {
            if (index > 0) lines.push({ text: "", pageBreak: true });
            lines.push({ text: displayDate(date, true), heading: true });
            const note = State.project.menuDayNotes.find(n => n.date === date);
            if (note?.notes) lines.push({ text: `Day note: ${note.notes}` });
            activeMealSlots(State.project, date).forEach(slot => {
                const items = State.project.menuItems.filter(i => i.date === date && i.slot === slot && hasMenuContent(i));
                if (!items.length) {
                    lines.push({ text: `  ${slot}: Not planned yet` });
                } else {
                    items.forEach(item => {
                        lines.push({ text: `  ${slot}: ${item.meal || "No food recorded"}${item.pudding ? "  ·  Pudding: " + item.pudding : ""}` });
                        if (item.dietaryNotes) lines.push({ text: `    ⚠ Dietary: ${item.dietaryNotes}`, color: "red" });
                        if (item.notes) lines.push({ text: `    Notes: ${item.notes}` });
                    });
                }
            });
        });
    }

    function addExportPlan(lines) {
        lines.push({ text: "The Plan", size: 15 });
        lines.push({ twoColumnSections: true, sections: enumerateDates(State.project.startDate, State.project.endDate).map(planDayPdfSection) });
    }

    function addExportKit(lines, participant) {
        const items = participant === null ? State.project.kitItems : participant ? participantKit() : groupKit();
        lines.push({ text: participant === null ? "Kit List" : participant ? "Participant Kit" : "Group Kit", size: 15 });
        if (!items.length) {
            lines.push({ text: "No kit items recorded." });
            return;
        }
        // Group by category
        const cats = {};
        items.forEach(item => { (cats[item.category || "General"] = cats[item.category || "General"] || []).push(item); });
        lines.push({
            twoColumnSections: true,
            sections: Object.entries(cats).map(([cat, catItems]) => ({
                title: cat,
                lines: catItems.map(item => {
                const status = participant ? "" : `  [${item.status}]`;
                const qty = item.quantity !== undefined ? `  Qty: ${formatQty(item.quantity)}` : "";
                const notes = item.notes ? `  – ${item.notes}` : "";
                    return `[ ] ${item.name}${qty}${status}${notes}`;
                })
            }))
        });
    }

    function addExportChores(lines) {
        lines.push({ text: "Chore Rota", size: 15 });
        lines.push({ twoColumnSections: true, sections: enumerateDates(State.project.startDate, State.project.endDate).map(choreDayPdfSection) });
    }

    function addExportShopping(lines) {
        lines.push({ text: "Shopping Lists", size: 15 });
        if (!State.project.shoppingLists?.length) {
            lines.push({ text: "No shopping lists have been added." });
            return;
        }
        State.project.shoppingLists.forEach(listItem => {
            lines.push({ text: listItem.name, heading: true });
            const shopItems = listItem.items?.filter(i => i.name) || [];
            if (!shopItems.length) {
                lines.push({ text: "  No items in this list." });
            } else {
                lines.push({
                    table: true,
                    columns: [
                        { label: "", width: 0.08 },
                        { label: "Item", width: 0.72 },
                        { label: "Quantity" }
                    ],
                    rows: shopItems
                        .slice()
                        .sort((a, b) => localeSort(a.name, b.name))
                        .map(item => ["", item.name, formatQty(item.quantity)]),
                    options: { minRowHeight: 22, fontSize: 8.8 }
                });
            }
        });
    }

    function addExportBudget(lines) {
        const project = State.project;
        const snapshot = calculateBudgetSnapshot(project);
        lines.push({ text: "Budget", size: 15 });
        lines.push({ text: `Total cost: ${formatBudgetMoney(snapshot.totalEstimatedCost)}  ·  Recommended: ${formatBudgetMoney(snapshot.recommendedRoundedStandardCharge)}  ·  Standard charge: ${formatBudgetMoney(snapshot.proposedStandardCharge)}  ·  Balance: ${formatBudgetMoney(snapshot.predictedSurplusShortfall)}`, bold: true });
        lines.push({ text: "Camp details", heading: true });
        [
            ["Camp", project.campName],
            ["Location", project.location || "Not set"],
            ["Dates", dateRange(project)],
            ["Generated", new Date().toLocaleString("en-GB")]
        ].forEach(([label, value]) => lines.push({ text: `${label}: ${value}` }));

        lines.push({ text: "People included", heading: true });
        [
            ["Campers", snapshot.counts.campers],
            ["Young Leaders", snapshot.counts.youngLeaders],
            ["Adults/leaders", snapshot.counts.adults],
            ["Day visitors", snapshot.counts.dayVisitors],
            ["Standard payers", snapshot.standardPayingPeople]
        ].forEach(([label, value]) => lines.push({ text: `${label}: ${value}` }));

        lines.push({ text: "Charging rules", heading: true });
        lines.push({ text: `Leaders: ${budgetRuleWithAmount(project.budget.settings.leaderRule, project.budget.settings.leaderContributionAmount)}` });
        lines.push({ text: `Young Leaders: ${budgetRuleWithAmount(project.budget.settings.youngLeaderRule, project.budget.settings.youngLeaderContributionAmount)}` });
        lines.push({ text: `Day visitors: ${budgetDayVisitorRuleWithAmount(project)}` });
        lines.push({ text: `Food: ${formatBudgetMoney(project.budget.settings.foodCostPerPersonPerDay)} per person per day for ${project.budget.settings.foodDays} days. People counted: ${snapshot.counts.totalPeople}. Total: ${formatBudgetMoney(snapshot.foodCost)}` });

        const activityRows = snapshot.costRows.filter(row => isImportedBudgetActivityCost(row.item)).sort((a, b) => budgetCostSort(a.item.description, b.item.description));
        const otherRows = snapshot.costRows.filter(row => !isImportedBudgetActivityCost(row.item)).sort((a, b) => budgetCostSort(a.item.description, b.item.description));
        addBudgetCostExportRows(lines, "Activities", activityRows);
        addBudgetCostExportRows(lines, "Other costs", otherRows);

        lines.push({ text: "Final charge", heading: true });
        lines.push({ text: `Outgoings: Food ${formatBudgetMoney(snapshot.foodCost)} | Activities ${formatBudgetMoney(snapshot.activityCost)} | Other ${formatBudgetMoney(snapshot.otherCost)} | Total ${formatBudgetMoney(snapshot.totalEstimatedCost)}` });
        lines.push({ text: `Income: Standard charges ${formatBudgetMoney(snapshot.proposedStandardCharge * snapshot.standardPayingPeople)} | Exact/fixed contributions ${formatBudgetMoney(snapshot.fixedContributionIncome)} | Total ${formatBudgetMoney(snapshot.totalIncomeAtProposedCharge)}` });
        lines.push({ text: `Required income: ${formatBudgetMoney(snapshot.requiredIncome)} | Balance: ${formatBudgetMoney(snapshot.predictedSurplusShortfall)}`, bold: true, color: snapshot.predictedSurplusShortfall < 0 ? "red" : undefined });

        if (project.budget.people.length) {
            lines.push({ text: "People and contribution rules", heading: true });
            [...project.budget.people]
                .sort((a, b) => localeSort(a.personType, b.personType) || localeSort(a.camperType, b.camperType) || localeSort(a.name, b.name))
                .forEach(personRow => {
                    const type = personRow.isDayVisitor ? `${personRow.personType} day visitor` : personRow.personType;
                    const exact = personRow.contributionAmount > 0 ? `  ·  Exact: ${formatBudgetMoney(personRow.contributionAmount)}` : "";
                    const notes = personRow.notes ? `  ·  ${personRow.notes}` : "";
                    lines.push({ text: `${personRow.name}: ${type}  ·  ${personRow.contributionRule}${exact}${notes}` });
                });
        }

        const warnings = budgetWarnings(project);
        if (warnings.length) {
            lines.push({ text: "Checks", heading: true, color: "red" });
            warnings.forEach(warning => lines.push({ text: warning, color: "red" }));
        }
    }

    function addBudgetCostExportRows(lines, title, rows) {
        if (!rows.length) return;
        lines.push({ text: title, heading: true });
        rows.forEach(row => {
            const method = row.item.calculationMethod.replace(" cost", "");
            lines.push({ text: `${row.item.description}  ·  ${method}  ·  ${formatBudgetMoney(row.amount)}${row.item.notes ? "  ·  " + row.item.notes : ""}` });
        });
        lines.push({ text: `Total ${title.toLowerCase()}: ${formatBudgetMoney(rows.reduce((sum, row) => sum + row.amount, 0))}`, bold: true });
    }

    function budgetRuleWithAmount(rule, amount) {
        const cleaned = clean(rule)
            .replace("Leaders pay ", "")
            .replace("Young Leaders pay ", "")
            .replace("Day visitors pay ", "");
        return amount > 0 ? `${cleaned} (${formatBudgetMoney(amount)})` : cleaned;
    }

    function budgetDayVisitorRuleWithAmount(project) {
        const settings = project.budget.settings;
        const amount = settings.dayVisitorRule === BUDGET_DAY_VISITORS_PAY_DAY_RATE
            ? settings.dayVisitorDayRate
            : settings.dayVisitorRule === BUDGET_DAY_VISITORS_PAY_EXACT
                ? settings.dayVisitorCustomContributionAmount
                : 0;
        return budgetRuleWithAmount(settings.dayVisitorRule, amount);
    }

    function budgetCostSort(a, b) {
        return budgetCostSortKey(a).localeCompare(budgetCostSortKey(b)) || localeSort(a, b);
    }

    function budgetCostSortKey(item) {
        const text = clean(item).toLowerCase();
        if (text.includes("site") || text.includes("camp")) return "1";
        if (text.includes("transport") || text.includes("coach") || text.includes("bus")) return "2";
        if (text.includes("equipment") || text.includes("material") || text.includes("craft")) return "3";
        if (text.includes("badge") || text.includes("admin")) return "4";
        return "9";
    }

    function buildBudgetCsv() {
        const project = State.project;
        const snapshot = calculateBudgetSnapshot(project);
        const rows = ["Section,Field,Value"];
        budgetSummaryRows(project, snapshot).forEach(row => rows.push(["Summary", row[0], row[1]].map(csv).join(",")));
        rows.push("");
        rows.push("People,Name,Type,Camper type,Day visitor,Contribution rule,Exact amount,Notes");
        project.budget.people.slice().sort((a, b) => localeSort(a.name, b.name)).forEach(personRow => {
            rows.push(["People", personRow.name, personRow.personType, personRow.camperType, personRow.isDayVisitor ? "Yes" : "No", personRow.contributionRule, number(personRow.contributionAmount).toFixed(2), personRow.notes].map(csv).join(","));
        });
        rows.push("");
        rows.push("Costs,Description,Calculation method,Quantity,Unit cost,Cost,Notes");
        project.budget.costItems.slice().sort((a, b) => localeSort(a.description, b.description)).forEach(item => {
            const amount = calculateBudgetCostItem(project, item, snapshot.counts, snapshot.standardPayingPeople);
            rows.push(["Costs", item.description, item.calculationMethod, number(item.quantity).toFixed(2), number(item.unitCost).toFixed(2), number(amount).toFixed(2), item.notes].map(csv).join(","));
        });
        return rows.join("\n");
    }

    function budgetSummaryRows(project, snapshot) {
        const rows = [
            ["Camp name", project.campName],
            ["Location", project.location],
            ["Dates", dateRange(project)],
            ["Currency symbol", budgetCurrencyLabel(project.budget.settings.currencySymbol)],
            ["Total people", snapshot.counts.totalPeople],
            ["Campers", snapshot.counts.campers],
            ["Young Leaders", snapshot.counts.youngLeaders],
            ["Adults/leaders", snapshot.counts.adults],
            ["Day visitors", snapshot.counts.dayVisitors],
            ["Standard-paying people", snapshot.standardPayingPeople],
            ["Food cost", snapshot.foodCost.toFixed(2)],
            ["Activity costs", snapshot.activityCost.toFixed(2)],
            ["Other costs", snapshot.otherCost.toFixed(2)],
            ["Total costs", snapshot.totalEstimatedCost.toFixed(2)],
            ["Required income", snapshot.requiredIncome.toFixed(2)],
            ["Fixed/exact contribution income", snapshot.fixedContributionIncome.toFixed(2)],
            ["Remaining amount to recover from Standard payers", snapshot.remainingToRecoverFromStandardPayers.toFixed(2)],
            ["Minimum break-even charge", snapshot.minimumBreakEvenStandardCharge.toFixed(2)],
            ["Recommended rounded Standard charge", snapshot.recommendedRoundedStandardCharge.toFixed(2)],
            ["Standard charge", snapshot.proposedStandardCharge.toFixed(2)],
            ["Predicted surplus/shortfall", snapshot.predictedSurplusShortfall.toFixed(2)],
            ["Leader rule", project.budget.settings.leaderRule],
            ["Young Leader rule", project.budget.settings.youngLeaderRule],
            ["Day visitor rule", project.budget.settings.dayVisitorRule],
            ["Food cost per person per day", project.budget.settings.foodCostPerPersonPerDay.toFixed(2)],
            ["Food days", project.budget.settings.foodDays],
            ["Food people counted", snapshot.counts.totalPeople]
        ];
        if (project.budget.importedSourceSummary) rows.push(["Plan activity sync", project.budget.importedSourceSummary]);
        return rows;
    }

    // Item 19: stamp export filenames with the export date so re-exporting during
    // planning produces a new file instead of silently overwriting the last one,
    // leaving no way to tell which printed/shared copy is current
    function exportDateStamp() {
        const d = new Date();
        const pad = n => String(n).padStart(2, "0");
        return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
    }

    function datedFileName(fileName) {
        const dot = fileName.lastIndexOf(".");
        const base = dot === -1 ? fileName : fileName.slice(0, dot);
        const ext  = dot === -1 ? "" : fileName.slice(dot);
        return `${base}-${exportDateStamp()}${ext}`;
    }

    async function savePdf(fileName, title, lines) {
        const pdf = new ScoutPdf(title, State.project);
        lines.forEach(line => {
            if (line.pageBreak) {
                pdf._addNewPage();
            } else if (line.twoColumnSections) {
                pdf.addTwoColumnSections(line.sections || []);
            } else if (line.table) {
                pdf.addWrappedTable(line.columns || [], line.rows || [], line.options || {});
            } else if (line.section) {
                pdf.addSectionBanner(line.text);
            } else if (line.size >= 15) {
                pdf.addSectionBanner(line.text);
            } else if (line.warningBox) {
                // Item 16: dietary/medical/allergy notes get a highlighted box
                pdf.addWarningBox(line.text);
            } else if (line.checklist) {
                // Item 15: real drawn checkbox instead of a Unicode glyph
                pdf.addChecklistItem(line.text, line);
            } else if (line.size >= 12 || line.heading) {
                pdf.addSubHeading(line.text, line.color);
            } else {
                pdf.addText(line.text, line);
            }
        });
        await saveBytesFile(`${safeFileName(State.project.campName)}-${datedFileName(fileName)}`, "application/pdf", pdf.bytes());
    }

    // Full-featured themed PDF builder
    // Item 20: page sizes in points (1/72 inch) — A4 is the long-standing default,
    // Letter is selectable for US-based groups via project.paperSize
    const PDF_PAGE_SIZES = {
        a4:     { w: 595, h: 842 },
        letter: { w: 612, h: 792 }
    };

    class ScoutPdf {
        constructor(title, project, options = {}) {
            const size = PDF_PAGE_SIZES[project.paperSize] || PDF_PAGE_SIZES.a4;
            const landscape = options.orientation === "landscape";
            this.W = landscape ? size.h : size.w;
            this.H = landscape ? size.w : size.h;
            this.ML = 42;   // margin left
            this.MR = 42;   // margin right
            this.MT = 42;   // margin top
            this.MB = 48;   // margin bottom (footer space)
            this.title = title;
            this.project = project;
            this.plain = Boolean(options.plain);
            this.tocEnabled = options.toc !== false && !this.plain;
            this.pageObjs = [];     // text draw calls per page
            this.rects    = [];     // filled rect draw calls per page
            this.lines    = [];     // stroked line draw calls per page (Item 11: real table grids)
            this.polys    = [];     // filled/stroked polygon draw calls per page
            this.circles  = [];     // filled/stroked circle draw calls per page
            this.currentPage = -1;
            this.y = this.MT;
            this.tocEntries = [];   // Item 13: {text, page} for an auto-generated table of contents
            this._addNewPage();
            if (!this.plain) this._drawCoverBand();
        }

        _drawCoverBand() {
            // Cover / title header band on every page
            this._rect(0, 0, this.W, 54, "green-dark", 0);
            this._text(this.project.campName, this.ML, 22, 18, true, "white", 0);
            const subtitle = `${this.title}  ·  ${dateRange(this.project)}${this.project.location ? "  ·  " + this.project.location : ""}`;
            this._text(subtitle, this.ML, 38, 9, false, "white", 0);
            this._rect(0, 54, this.W, 3, "green-light", 0);
        }

        textWidth() { return this.W - this.ML - this.MR; }

        _addNewPage() {
            this.currentPage++;
            this.pageObjs.push([]);
            this.rects.push([]);
            this.lines.push([]);
            this.polys.push([]);
            this.circles.push([]);
            this.y = this.MT;
            if (this.plain) {
                this.y = this.MT;
                return;
            }
            if (this.currentPage > 0) this._drawCoverBandSmall();
            // Footer stripe — page number added at bytes() time once total is known
            this._rect(0, this.H - 30, this.W, 30, "green-dark");
            this._text("Scout Camp Planner", this.ML, this.H - 14, 8, false, "white");
            this.y = this.currentPage === 0 ? 68 : this.MT;
        }

        _drawCoverBandSmall() {
            // Slimmer repeated header band on continuation pages so context (which
            // document this is) survives flipping to any page in isolation —
            // Item 12/17 support: headings always carry forward across page breaks.
            this._rect(0, 0, this.W, 26, "green-dark");
            this._text(`${this.project.campName} — ${this.title}`, this.ML, 17, 9, true, "white");
            this.y = 38;
        }

        _page() { return this.pageObjs[this.currentPage]; }
        _pageRects() { return this.rects[this.currentPage]; }
        _pageLines() { return this.lines[this.currentPage]; }
        _pagePolys() { return this.polys[this.currentPage]; }
        _pageCircles() { return this.circles[this.currentPage]; }

        _needSpace(h) {
            if (this.y + h > this.H - this.MB) {
                this._addNewPage();
            }
        }

        // Item 12: reserve a block of vertical space as a unit — if it won't fit on
        // the current page, start a fresh page first so the block never splits
        // (e.g. a tent's name + occupant list, or one day's chore rota table)
        reserveBlock(height) {
            if (this.y + height > this.H - this.MB) {
                this._addNewPage();
            }
        }

        _rect(x, y, w, h, colorKey, page) {
            const arr = page === undefined ? this._pageRects() : this.rects[page];
            arr.push({ x, y, w, h, colorKey });
        }

        // Item 11: stroked line primitive — enables real ruled table grids
        _line(x1, y1, x2, y2, colorKey, widthPt) {
            this._pageLines().push({ x1, y1, x2, y2, colorKey: colorKey || "line-grey", widthPt: widthPt || 0.75 });
        }

        _poly(points, fillKey, strokeKey, widthPt) {
            if (!points || points.length < 3) return;
            this._pagePolys().push({ points, fillKey: fillKey || "white", strokeKey: strokeKey || "line-dark", widthPt: widthPt || 0.75 });
        }

        _circle(cx, cy, radius, fillKey, strokeKey, widthPt) {
            this._pageCircles().push({ cx, cy, radius, fillKey: fillKey || "black", strokeKey: strokeKey || fillKey || "black", widthPt: widthPt || 0.8 });
        }

        _text(text, x, y, size, bold, colorKey, page) {
            const arr = page === undefined ? this._page() : this.pageObjs[page];
            arr.push({ x, y, text: pdfEscape(String(text ?? "")), size, bold: Boolean(bold), colorKey: colorKey || "black" });
        }

        addSectionBanner(text) {
            this._needSpace(26);
            if (this.y > this.MT + 8) this.y += 4;
            this.tocEntries.push({ text, page: this.currentPage });
            this._rect(this.ML - 8, this.y - 14, this.W - this.ML - this.MR + 16, 22, "green-mid");
            this._text(text, this.ML, this.y, 11, true, "white");
            this.y += 14;
            this._rect(this.ML - 8, this.y, this.W - this.ML - this.MR + 16, 1, "green-light");
            this.y += 9;
        }

        addSubHeading(text, colorHint) {
            this._needSpace(20);
            this.y += 4;
            const col = colorHint === "red" ? "red" : "green-dark";
            this._text(text, this.ML, this.y, 10, true, col);
            this.y += 14;
        }

        addText(text, options = {}) {
            const size = options.size || 9;
            const col  = options.color === "red" ? "red" : "black";
            const chars = Math.max(20, Math.floor(this.textWidth() / (size * 0.50)));
            const wrapped = wrapText(String(text ?? ""), chars);
            for (const line of wrapped) {
                this._needSpace(size + 5);
                this._text(line, this.ML, this.y, size, Boolean(options.bold), col);
                this.y += size + 5;
            }
        }

        addBlankLine() { this.y += 6; }

        /**
         * Item 15: draw an actual vector checkbox square instead of relying on a
         * Unicode glyph (☐) that some PDF-viewer/printer font substitutions render
         * as a missing-glyph box or nothing at all — critical for a document whose
         * whole point is being physically ticked off with a pen.
         */
        addChecklistItem(text, options = {}) {
            const size = options.size || 9;
            this._needSpace(size + 7);
            const boxSize = 8;
            const boxX = this.ML, boxY = this.y - boxSize + 1;
            this._line(boxX, boxY, boxX + boxSize, boxY, "line-dark", 1);
            this._line(boxX, boxY + boxSize, boxX + boxSize, boxY + boxSize, "line-dark", 1);
            this._line(boxX, boxY, boxX, boxY + boxSize, "line-dark", 1);
            this._line(boxX + boxSize, boxY, boxX + boxSize, boxY + boxSize, "line-dark", 1);
            const col = options.color === "red" ? "red" : "black";
            this._text(text, this.ML + boxSize + 6, this.y, size, Boolean(options.bold), col);
            this.y += size + 7;
        }

        /**
         * Item 16: a highlighted warning box (border + tint) for dietary/medical/
         * allergy notes — plain red text is too easy to miss on a busy kitchen
         * printout where missing it has real safety consequences.
         */
        addWarningBox(text) {
            const size = 9;
            const chars = Math.max(20, Math.floor((this.textWidth() - 16) / (size * 0.5)));
            const wrapped = wrapText(String(text ?? ""), chars);
            const boxHeight = wrapped.length * (size + 4) + 10;
            this.reserveBlock(boxHeight + 4);
            this._rect(this.ML, this.y - 2, this.textWidth(), boxHeight, "warning-fill");
            this._line(this.ML, this.y - 2, this.ML, this.y - 2 + boxHeight, "red", 2);
            let ty = this.y + 9;
            wrapped.forEach(line => {
                this._text(line, this.ML + 10, ty, size, true, "red");
                ty += size + 4;
            });
            this.y += boxHeight + 6;
        }

        /**
         * Item 11/18: draw a real ruled table with a header row, column borders,
         * and zebra striping — used for Tent Table, Kit Lists, Chore Rota etc.
         * columns: [{ label, width (fraction of textWidth, optional — defaults to even) }]
         * rows: array of arrays of cell strings (or {text, color} objects)
         */
        addTable(columns, rows, options = {}) {
            const totalWidth = this.textWidth();
            const fixed = columns.filter(c => c.width).reduce((sum, c) => sum + c.width, 0);
            const flexCols = columns.filter(c => !c.width).length;
            const flexWidth = flexCols ? (1 - fixed) / flexCols : 0;
            const widths = columns.map(c => (c.width || flexWidth) * totalWidth);
            const rowHeight = options.rowHeight || 16;
            const headerHeight = 18;

            const drawHeader = () => {
                this._rect(this.ML, this.y, totalWidth, headerHeight, "green-mid");
                let x = this.ML;
                columns.forEach((col, i) => {
                    this._text(col.label, x + 5, this.y + 12, 8, true, "white");
                    x += widths[i];
                });
                this.y += headerHeight;
            };

            this._needSpace(headerHeight + rowHeight);
            drawHeader();

            rows.forEach((row, rowIndex) => {
                if (this.y + rowHeight > this.H - this.MB) {
                    this._addNewPage();
                    drawHeader();
                }
                if (rowIndex % 2 === 1) {
                    this._rect(this.ML, this.y, totalWidth, rowHeight, "row-stripe");
                }
                let x = this.ML;
                row.forEach((cell, i) => {
                    const text = typeof cell === "object" ? cell.text : cell;
                    const color = typeof cell === "object" && cell.color === "red" ? "red" : "black";
                    const chars = Math.max(6, Math.floor((widths[i] - 8) / 4.0));
                    const wrapped = wrapText(String(text ?? "—"), chars);
                    this._text(wrapped[0] || "—", x + 5, this.y + 11, 8, false, color);
                    x += widths[i];
                });
                this._line(this.ML, this.y + rowHeight, this.ML + totalWidth, this.y + rowHeight, "line-grey", 0.5);
                this.y += rowHeight;
            });

            // Outer border + column separators
            const tableTop = this.y - rows.length * rowHeight - headerHeight;
            this._line(this.ML, tableTop, this.ML, this.y, "line-grey", 0.75);
            this._line(this.ML + totalWidth, tableTop, this.ML + totalWidth, this.y, "line-grey", 0.75);
            let xLine = this.ML;
            columns.forEach((col, i) => {
                if (i > 0) this._line(xLine, tableTop, xLine, this.y, "line-grey", 0.5);
                xLine += widths[i];
            });
            this.y += 8;
        }

        addWrappedTable(columns, rows, options = {}) {
            const totalWidth = this.textWidth();
            const fixed = columns.filter(c => c.width).reduce((sum, c) => sum + c.width, 0);
            const flexCols = columns.filter(c => !c.width).length;
            const flexWidth = flexCols ? (1 - fixed) / flexCols : 0;
            const widths = columns.map(c => (c.width || flexWidth) * totalWidth);
            const headerHeight = options.headerHeight || 18;
            const fontSize = options.fontSize || 8;

            const drawHeader = () => {
                this._rect(this.ML, this.y, totalWidth, headerHeight, "green-mid");
                let x = this.ML;
                columns.forEach((col, i) => {
                    this._text(col.label, x + 5, this.y + 12, 8, true, "white");
                    if (i > 0) this._line(x, this.y, x, this.y + headerHeight, "white", 0.35);
                    x += widths[i];
                });
                this.y += headerHeight;
            };

            this._needSpace(headerHeight + 22);
            drawHeader();
            let pageTableTop = this.y - headerHeight;
            rows.forEach((row, rowIndex) => {
                const wrappedCells = row.map((cell, i) => {
                    const text = typeof cell === "object" ? cell.text : cell;
                    const chars = Math.max(7, Math.floor((widths[i] - 10) / (fontSize * 0.48)));
                    const lines = wrapText(String(text ?? "—"), chars);
                    return options.maxLines ? lines.slice(0, options.maxLines) : lines;
                });
                const rowHeight = Math.max(options.minRowHeight || 24, Math.max(...wrappedCells.map(lines => lines.length)) * (fontSize + 3) + 10);
                if (this.y + rowHeight > this.H - this.MB) {
                    this._line(this.ML, pageTableTop, this.ML, this.y, "line-grey", 0.75);
                    this._line(this.ML + totalWidth, pageTableTop, this.ML + totalWidth, this.y, "line-grey", 0.75);
                    this._addNewPage();
                    drawHeader();
                    pageTableTop = this.y - headerHeight;
                }
                if (rowIndex % 2 === 1) this._rect(this.ML, this.y, totalWidth, rowHeight, "row-stripe");
                let x = this.ML;
                wrappedCells.forEach((lines, i) => {
                    const cell = row[i];
                    const color = typeof cell === "object" && cell.color === "red" ? "red" : "black";
                    lines.forEach((line, lineIndex) => this._text(line, x + 5, this.y + 11 + lineIndex * (fontSize + 3), fontSize, false, color));
                    if (i > 0) this._line(x, this.y, x, this.y + rowHeight, "line-grey", 0.45);
                    x += widths[i];
                });
                this._line(this.ML, this.y + rowHeight, this.ML + totalWidth, this.y + rowHeight, "line-grey", 0.5);
                this.y += rowHeight;
            });
            this._line(this.ML, pageTableTop, this.ML, this.y, "line-grey", 0.75);
            this._line(this.ML + totalWidth, pageTableTop, this.ML + totalWidth, this.y, "line-grey", 0.75);
            this.y += 8;
        }

        addTwoColumnSections(sections) {
            const entries = sections.filter(section => clean(section?.title));
            if (!entries.length) return;
            const gap = 10;
            const width = (this.textWidth() - gap) / 2;
            for (let i = 0; i < entries.length; i += 2) {
                const left = entries[i];
                const right = entries[i + 1];
                const height = Math.max(58, this._columnSectionHeight(left, width), right ? this._columnSectionHeight(right, width) : 0);
                this.reserveBlock(Math.min(height + 10, this.H - this.MT - this.MB));
                this._drawColumnSection(this.ML, this.y, width, height, left);
                if (right) this._drawColumnSection(this.ML + width + gap, this.y, width, height, right);
                this.y += height + 10;
            }
        }

        _columnSectionHeight(section, width) {
            const lines = (section.lines || []).filter(line => clean(line)).length ? section.lines : ["No items."];
            return 40 + lines.reduce((sum, line) => sum + wrapText(String(line), Math.max(12, Math.floor((width - 14) / 4.4))).length * 11.4 + 3, 0);
        }

        _drawColumnSection(x, y, width, height, section) {
            this._rect(x, y, width, height, "white");
            this._line(x, y, x + width, y, "line-grey", 0.75);
            this._line(x, y + height, x + width, y + height, "line-grey", 0.75);
            this._line(x, y, x, y + height, "line-grey", 0.75);
            this._line(x + width, y, x + width, y + height, "line-grey", 0.75);
            this._rect(x, y, width, 23, "row-stripe");
            this._text(section.title, x + 7, y + 15.5, 9.5, true, "green-dark");
            let textY = y + 36;
            const lines = (section.lines || []).filter(line => clean(line)).length ? section.lines : ["No items."];
            lines.forEach(line => {
                wrapText(String(line), Math.max(12, Math.floor((width - 14) / 4.4))).forEach(wrapped => {
                    if (textY < y + height - 4) this._text(wrapped, x + 7, textY, 8.4, false, "black");
                    textY += 11.4;
                });
                textY += 3;
            });
        }

        /**
         * Draw a printable tent layout that mirrors the canvas positions while using
         * the newer tent/bunk-room artwork from the desktop planner.
         */
        addSiteMap(items, canvasWidth, canvasHeight) {
            const mapWidth = this.textWidth();
            const availableHeight = this.H - this.y - this.MB - 10;
            const mapHeight = Math.max(260, Math.min(availableHeight, 430, mapWidth * (canvasHeight / canvasWidth || 0.7)));
            if (mapHeight < 260) this._addNewPage();
            const finalHeight = Math.max(260, Math.min(this.H - this.y - this.MB - 10, 430, mapWidth * (canvasHeight / canvasWidth || 0.7)));
            const scale = Math.min(mapWidth / (canvasWidth || 1), finalHeight / (canvasHeight || 1));
            const mapTop = this.y;
            const mapLeft = this.ML;

            this._rect(mapLeft, mapTop, mapWidth, finalHeight, "white");
            this._line(mapLeft, mapTop, mapLeft + mapWidth, mapTop, "line-grey", 0.75);
            this._line(mapLeft, mapTop + finalHeight, mapLeft + mapWidth, mapTop + finalHeight, "line-grey", 0.75);
            this._line(mapLeft, mapTop, mapLeft, mapTop + finalHeight, "line-grey", 0.75);
            this._line(mapLeft + mapWidth, mapTop, mapLeft + mapWidth, mapTop + finalHeight, "line-grey", 0.75);

            items.forEach(item => {
                const x = mapLeft + item.x * scale;
                const y = mapTop + item.y * scale;
                const w = Math.max(36, item.w * scale);
                const h = Math.max(30, item.h * scale);
                if (x > mapLeft + mapWidth || y > mapTop + finalHeight) return;
                if (item.kind === "site") {
                    this._rect(x, y, w, h, "white");
                    this._line(x, y, x + w, y, "line-dark", 0.75);
                    this._line(x, y + h, x + w, y + h, "line-dark", 0.75);
                    this._line(x, y, x, y + h, "line-dark", 0.75);
                    this._line(x + w, y, x + w, y + h, "line-dark", 0.75);
                    this._centeredTextLines(truncateForWidth(item.label, w - 8, 7.4), x + w / 2, y + h / 2 + 3, w - 8, 7.4, true);
                    return;
                }

                const fill = item.colour || "#4CAF50";
                const stroke = darkenColour(fill, 0.45);
                const shapeHeight = Math.max(24, h * 0.58);
                if (item.isBunk) this._drawBunkRoomShape(x, y, w, shapeHeight, fill, stroke);
                else if (item.isCaravan) this._drawCaravanMotorhomeShape(x, y, w, shapeHeight, fill, stroke);
                else this._drawTentShape(x, y, w, shapeHeight, fill, stroke);
                this._centeredTextLines(item.label, x + w / 2, y + shapeHeight - 5, w - 8, 7.4, true);
                this._drawOccupantBoxes(x, y + shapeHeight + 4, w, item.occupants || []);
            });
            this.y = mapTop + finalHeight + 12;
        }

        addTentTags(tentEntries) {
            const pageMargin = 36;
            const gap = 18;
            const tagWidth = this.W - pageMargin * 2;
            const tagHeight = (this.H - pageMargin * 2 - gap * 2) / 3;
            tentEntries.forEach((entry, index) => {
                if (index > 0 && index % 3 === 0) this._addNewPage();
                const row = index % 3;
                this._drawTentTag(entry.tent, entry.occupants, pageMargin, pageMargin + row * (tagHeight + gap), tagWidth, tagHeight);
            });
        }

        _drawTentTag(tent, occupants, x, y, width, height) {
            this._line(x, y, x + width, y, "line-dark", 0.95);
            this._line(x, y + height, x + width, y + height, "line-dark", 0.95);
            this._line(x, y, x, y + height, "line-dark", 0.95);
            this._line(x + width, y, x + width, y + height, "line-dark", 0.95);
            const split = x + width / 2;
            this._line(split, y, split, y + height, "line-dark", 0.75);

            const names = occupants.map(person => person.name).join(", ") || "No occupants";
            const titleLines = wrapText(tent.name || "Tent", Math.max(10, Math.floor((width / 2 - 34) / 8.2))).slice(0, 2);
            const occupantLines = wrapText(names, Math.max(12, Math.floor((width / 2 - 34) / 5.6))).slice(0, 5);
            const totalHeight = titleLines.length * 18 + 8 + occupantLines.length * 11;
            let ty = y + height / 2 - totalHeight / 2 + 14;
            titleLines.forEach(line => {
                this._centeredTextLines(line, x + width / 4, ty, width / 2 - 30, 15, true);
                ty += 18;
            });
            ty += 4;
            occupantLines.forEach(line => {
                this._centeredTextLines(line, x + width / 4, ty, width / 2 - 30, 9.2, false);
                ty += 11;
            });
            this._circle(x + width * 0.75, y + height / 2, 10, "black", "black", 0.8);
        }

        _drawTentShape(x, y, width, height, fill, stroke) {
            const leftBaseX = x + width * 0.08;
            const rightBaseX = x + width * 0.92;
            const peakX = x + width * 0.50;
            const baseY = y + height;
            this._poly([{ x: leftBaseX, y: baseY }, { x: peakX, y }, { x: rightBaseX, y: baseY }], fill, stroke, 1.2);
            this._poly([
                { x: x + width * 0.24, y: y + height * 0.92 },
                { x: peakX, y: y + height * 0.08 },
                { x: x + width * 0.76, y: y + height * 0.92 }
            ], fadeColourToWhite(fill, 0.72), stroke, 0.8);
            this._line(peakX, y + height * 0.08, x + width * 0.18, y + height * 0.96, stroke, 0.7);
            this._line(peakX, y + height * 0.08, x + width * 0.82, y + height * 0.96, stroke, 0.7);
            this._line(peakX, y + height * 0.04, peakX, y + height * 0.92, stroke, 0.8);
            this._poly([{ x: leftBaseX, y: baseY }, { x: x + width * 0.18, y: y + height * 0.96 }, { x: x + width * 0.26, y: baseY }], fill, stroke, 0.7);
            this._poly([{ x: rightBaseX, y: baseY }, { x: x + width * 0.82, y: y + height * 0.96 }, { x: x + width * 0.74, y: baseY }], fill, stroke, 0.7);
            this._line(leftBaseX, baseY, rightBaseX, baseY, stroke, 1.2);
            this._line(peakX, y, peakX, y + height * 0.06, stroke, 1.4);
        }

        _drawBunkRoomShape(x, y, width, height, fill, stroke) {
            const roofHeight = height * 0.34;
            this._poly([
                { x: x + width * 0.08, y: y + roofHeight },
                { x: x + width * 0.50, y },
                { x: x + width * 0.92, y: y + roofHeight }
            ], fill, stroke, 1.0);
            this._rect(x + width * 0.12, y + roofHeight, width * 0.76, height - roofHeight, "white");
            this._line(x + width * 0.12, y + roofHeight, x + width * 0.88, y + roofHeight, stroke, 0.75);
            this._line(x + width * 0.12, y + height, x + width * 0.88, y + height, stroke, 0.75);
            this._line(x + width * 0.12, y + roofHeight, x + width * 0.12, y + height, stroke, 0.75);
            this._line(x + width * 0.88, y + roofHeight, x + width * 0.88, y + height, stroke, 0.75);
            this._rect(x + width * 0.20, y + roofHeight + 8, width * 0.60, Math.max(10, height * 0.22), fill);
        }

        _drawCaravanMotorhomeShape(x, y, width, height, fill, stroke) {
            const bodyY = y + height * 0.23;
            const bodyHeight = height * 0.54;
            this._rect(x + width * 0.12, bodyY, width * 0.76, bodyHeight, fadeColourToWhite(fill, 0.68));
            this._line(x + width * 0.12, bodyY, x + width * 0.88, bodyY, stroke, 0.75);
            this._line(x + width * 0.12, bodyY + bodyHeight, x + width * 0.88, bodyY + bodyHeight, stroke, 0.75);
            this._line(x + width * 0.12, bodyY, x + width * 0.12, bodyY + bodyHeight, stroke, 0.75);
            this._line(x + width * 0.88, bodyY, x + width * 0.88, bodyY + bodyHeight, stroke, 0.75);
            this._rect(x + width * 0.16, bodyY + bodyHeight * 0.24, width * 0.20, bodyHeight * 0.30, "white");
            this._rect(x + width * 0.42, bodyY + bodyHeight * 0.24, width * 0.22, bodyHeight * 0.30, "white");
            this._rect(x + width * 0.66, bodyY + bodyHeight * 0.30, width * 0.12, bodyHeight * 0.56, "white");
            this._rect(x + width * 0.12, bodyY + bodyHeight * 0.64, width * 0.40, Math.max(3, bodyHeight * 0.12), fill);
            this._circle(x + width * 0.30, bodyY + bodyHeight, Math.max(4, width * 0.045), "text", "black", 0.8);
            this._circle(x + width * 0.70, bodyY + bodyHeight, Math.max(4, width * 0.045), "text", "black", 0.8);
        }

        _drawOccupantBoxes(x, y, width, occupants) {
            const boxHeight = 26;
            const gap = 3;
            const names = occupants.length ? occupants.map(person => person.name) : ["Empty"];
            names.slice(0, 8).forEach((name, index) => {
                const boxY = y + index * (boxHeight + gap);
                this._rect(x, boxY, width, boxHeight, "white");
                this._line(x, boxY, x + width, boxY, "line-grey", 0.6);
                this._line(x, boxY + boxHeight, x + width, boxY + boxHeight, "line-grey", 0.6);
                this._line(x, boxY, x, boxY + boxHeight, "line-grey", 0.6);
                this._line(x + width, boxY, x + width, boxY + boxHeight, "line-grey", 0.6);
                this._centeredTextLines(name, x + width / 2, boxY + boxHeight / 2 + 3, width - 8, 7.2, false, 2);
            });
        }

        _centeredTextLines(text, centerX, centerY, width, size, bold, maxLines = 1) {
            const lines = wrapText(String(text ?? ""), Math.max(8, Math.floor(width / (size * 0.52)))).slice(0, maxLines);
            const startY = centerY - ((lines.length - 1) * (size + 2)) / 2;
            lines.forEach((line, index) => {
                const x = centerX - Math.min(width, line.length * size * 0.52) / 2;
                this._text(line, x, startY + index * (size + 2), size, bold, "black");
            });
        }

        _dashedRect(x, y, w, h) {
            const dash = 6, gap = 4;
            const drawDashedLine = (x1, y1, x2, y2) => {
                const len = Math.hypot(x2 - x1, y2 - y1);
                const steps = Math.floor(len / (dash + gap));
                const ux = (x2 - x1) / len, uy = (y2 - y1) / len;
                for (let i = 0; i < steps; i++) {
                    const sx = x1 + ux * i * (dash + gap);
                    const sy = y1 + uy * i * (dash + gap);
                    this._line(sx, sy, sx + ux * dash, sy + uy * dash, "line-dark", 1.2);
                }
            };
            drawDashedLine(x, y, x + w, y);
            drawDashedLine(x, y + h, x + w, y + h);
            drawDashedLine(x, y, x, y + h);
            drawDashedLine(x + w, y, x + w, y + h);
        }

        /**
         * Item 13: insert a table-of-contents page at the very front, listing every
         * section banner added so far with its page number — built from tocEntries
         * collected as addSectionBanner was called, then spliced in before bytes().
         */
        insertTableOfContents() {
            if (!this.tocEnabled || this.tocEntries.length < 2) return; // not worth a ToC for a 1-section doc
            const tocPageObjs = [];
            const tocRects = [];
            const tocLines = [];
            let y = 80;
            tocRects.push({ x: 0, y: 0, w: this.W, h: 54, colorKey: "green-dark" });
            tocPageObjs.push({ x: this.ML, y: 22, text: pdfEscape(this.project.campName), size: 18, bold: true, colorKey: "white" });
            tocPageObjs.push({ x: this.ML, y: 38, text: pdfEscape(`${this.title} — Contents`), size: 9, bold: false, colorKey: "white" });
            tocRects.push({ x: 0, y: 54, w: this.W, h: 3, colorKey: "green-light" });
            this.tocEntries.forEach(entry => {
                tocPageObjs.push({ x: this.ML, y, text: pdfEscape(entry.text), size: 11, bold: true, colorKey: "black" });
                // +2 because the ToC page itself shifts every later page index by one,
                // and humans read page numbers starting at 1 not 0
                tocPageObjs.push({ x: this.W - this.MR - 30, y, text: pdfEscape(String(entry.page + 2)), size: 11, bold: true, colorKey: "green-dark" });
                tocLines.push({ x1: this.ML, y1: y + 4, x2: this.W - this.MR, y2: y + 4, colorKey: "line-grey", widthPt: 0.5 });
                y += 22;
            });
            this.pageObjs.unshift(tocPageObjs);
            this.rects.unshift(tocRects);
            this.lines.unshift(tocLines);
            this.polys.unshift([]);
            this.circles.unshift([]);
            this.currentPage++;
        }

        bytes() {
            this.insertTableOfContents();

            const numPages = this.pageObjs.length;
            const fontReg  = 3 + numPages * 2;
            const fontBold = 4 + numPages * 2;

            const pdfColorStr = (key, stroke) => {
                const suffix = stroke ? "RG" : "rg";
                if (typeof key === "string" && /^#[0-9a-f]{6}$/i.test(key)) {
                    const r = parseInt(key.slice(1, 3), 16) / 255;
                    const g = parseInt(key.slice(3, 5), 16) / 255;
                    const b = parseInt(key.slice(5, 7), 16) / 255;
                    return `${fmt(r)} ${fmt(g)} ${fmt(b)} ${suffix}`;
                }
                if (key === "green-dark")  return `0.122 0.333 0.180 ${suffix}`;
                if (key === "green-mid")   return `0.180 0.450 0.231 ${suffix}`;
                if (key === "green-light") return `0.604 0.800 0.392 ${suffix}`;
                if (key === "white")       return `1 1 1 ${suffix}`;
                if (key === "white-fill")  return `0.97 0.99 0.96 ${suffix}`;
                if (key === "amber-fill")  return `1 1 0.94 ${suffix}`;
                if (key === "grass")       return `0.612 0.800 0.396 ${suffix}`;
                if (key === "red")         return `0.72 0.16 0.16 ${suffix}`;
                if (key === "line-grey")   return `0.7 0.7 0.7 ${suffix}`;
                if (key === "line-dark")   return `0.18 0.33 0.18 ${suffix}`;
                if (key === "row-stripe")  return `0.945 0.965 0.935 ${suffix}`;
                if (key === "warning-fill") return `1 0.95 0.94 ${suffix}`;
                return `0 0 0 ${suffix}`;
            };

            const objects = [];
            const push = (s) => { objects.push(s); return objects.length; };

            push("<< /Type /Catalog /Pages 2 0 R >>");
            push("");   // Pages dict placeholder

            for (let pi = 0; pi < numPages; pi++) {
                const contId = 3 + numPages + pi;
                push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${this.W} ${this.H}] /Resources << /Font << /F1 ${fontReg} 0 R /F2 ${fontBold} 0 R >> >> /Contents ${contId} 0 R >>`);
            }

            for (let pi = 0; pi < numPages; pi++) {
                const rects = this.rects[pi] || [];
                const lines = this.lines[pi] || [];
                const polys = this.polys[pi] || [];
                const circles = this.circles[pi] || [];
                const texts = this.pageObjs[pi] || [];
                const parts = [];
                for (const r of rects) {
                    parts.push(`${pdfColorStr(r.colorKey)} ${fmt(r.x)} ${fmt(this.H - r.y - r.h)} ${fmt(r.w)} ${fmt(r.h)} re f`);
                }
                for (const p of polys) {
                    const first = p.points[0];
                    const path = [
                        `${fmt(first.x)} ${fmt(this.H - first.y)} m`,
                        ...p.points.slice(1).map(point => `${fmt(point.x)} ${fmt(this.H - point.y)} l`),
                        "h B"
                    ].join(" ");
                    parts.push(`${pdfColorStr(p.fillKey)} ${pdfColorStr(p.strokeKey, true)} ${fmt(p.widthPt)} w ${path}`);
                }
                for (const c of circles) {
                    const k = 0.5522847498;
                    const r = c.radius;
                    const bx = c.cx;
                    const by = this.H - c.cy;
                    const cp = r * k;
                    parts.push(`${pdfColorStr(c.fillKey)} ${pdfColorStr(c.strokeKey, true)} ${fmt(c.widthPt)} w ` +
                        `${fmt(bx + r)} ${fmt(by)} m ` +
                        `${fmt(bx + r)} ${fmt(by + cp)} ${fmt(bx + cp)} ${fmt(by + r)} ${fmt(bx)} ${fmt(by + r)} c ` +
                        `${fmt(bx - cp)} ${fmt(by + r)} ${fmt(bx - r)} ${fmt(by + cp)} ${fmt(bx - r)} ${fmt(by)} c ` +
                        `${fmt(bx - r)} ${fmt(by - cp)} ${fmt(bx - cp)} ${fmt(by - r)} ${fmt(bx)} ${fmt(by - r)} c ` +
                        `${fmt(bx + cp)} ${fmt(by - r)} ${fmt(bx + r)} ${fmt(by - cp)} ${fmt(bx + r)} ${fmt(by)} c B`);
                }
                for (const l of lines) {
                    parts.push(`${fmt(l.widthPt)} w ${pdfColorStr(l.colorKey, true)} ${fmt(l.x1)} ${fmt(this.H - l.y1)} m ${fmt(l.x2)} ${fmt(this.H - l.y2)} l S`);
                }
                for (const t of texts) {
                    parts.push(`BT /F${t.bold ? 2 : 1} ${fmt(t.size)} Tf ${pdfColorStr(t.colorKey)} ${fmt(t.x)} ${fmt(this.H - t.y)} Td (${t.text}) Tj ET`);
                }
                // Item 13: page numbers ("Page N of M") on every page footer
                if (!this.plain) {
                    parts.push(`BT /F1 7 Tf 1 1 1 rg ${fmt(this.W - this.MR - 60)} ${fmt(16)} Td (Page ${pi + 1} of ${numPages}) Tj ET`);
                }
                const content = parts.join("\n");
                push(`<< /Length ${asciiBytes(content).length} >>\nstream\n${content}\nendstream`);
            }
            push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
            push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");

            objects[1] = `<< /Type /Pages /Kids [${Array.from({ length: numPages }, (_, i) => `${3 + i} 0 R`).join(" ")}] /Count ${numPages} >>`;

            let out = "%PDF-1.4\n";
            const offsets = [];
            for (let i = 0; i < objects.length; i++) {
                offsets.push(asciiBytes(out).length);
                out += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
            }
            const xref = asciiBytes(out).length;
            out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
            for (const off of offsets) {
                out += `${String(off).padStart(10, "0")} 00000 n \n`;
            }
            out += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
            return asciiBytes(out);
        }

    }

    // Keep SimplePdf as alias for backward compat
    const SimplePdf = ScoutPdf;

    // Item 10: truncate a label to fit a given pixel width at a given font size,
    // appending an ellipsis if it had to cut — used for site-map item labels
    function truncateForWidth(text, widthPt, size) {
        const maxChars = Math.max(3, Math.floor(widthPt / (size * 0.55)));
        const str = String(text ?? "");
        return str.length > maxChars ? str.slice(0, maxChars - 1) + "…" : str;
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
        await saveTextFile(`${safeFileName(State.project.campName)}-${datedFileName("menu.rtf")}`, "application/rtf", buildMenuRtf());
    }

    async function exportShoppingRtf() {
        await saveTextFile(`${safeFileName(State.project.campName)}-${datedFileName("shopping-lists.rtf")}`, "application/rtf", buildShoppingRtf());
    }

    function buildMenuRtf() {
        const lines = [];
        addExportMenu(lines, false);
        addExportMenu(lines, true);
        return buildRtf(`${State.project.campName} - Camp menu`, lines);
    }

    // Item 21: real RTF table (\\trowd/\\cellx grid) for shopping lists instead of
    // the flat text-line format — Word/LibreOffice render this as an actual ruled
    // table with a tickable left column, not a wall of indented text.
    function buildShoppingRtf() {
        const title = `${State.project.campName} - Shopping lists`;
        const header = `{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Segoe UI;}}{\\colortbl;\\red0\\green0\\blue0;\\red46\\green115\\blue59;\\red184\\green45\\blue45;\\red255\\green255\\blue255;}\\paperw11907\\paperh16840\\margl900\\margr900\\margt760\\margb760\n\\pard\\qc\\b\\fs36\\cf2 ${rtfEscape(title)}\\b0\\par\\par\n`;

        const lists = State.project.shoppingLists || [];
        if (!lists.length) {
            return header + `\\pard\\ql\\fs18 No shopping lists have been added.\\par\n}`;
        }

        const colTick = 700, colItem = 7500, colQty = 1700;
        const cellx1 = colTick, cellx2 = cellx1 + colItem, cellx3 = cellx2 + colQty;

        const body = lists.map(listItem => {
            const heading = `\\pard\\ql\\b\\fs26\\cf2 ${rtfEscape(listItem.name)}\\b0\\par\n`;
            const items = (listItem.items || []).filter(i => i.name);
            if (!items.length) {
                return heading + `\\pard\\fs18 No items in this list.\\par\\par\n`;
            }
            const headerRow = `\\trowd\\trgaph60\\cellx${cellx1}\\cellx${cellx2}\\cellx${cellx3}\\pard\\intbl\\b\\fs16  \\cell\\b\\fs16 Item\\cell\\b\\fs16 Qty\\cell\\row\n`;
            const rows = items.map(item =>
                `\\trowd\\trgaph60\\cellx${cellx1}\\cellx${cellx2}\\cellx${cellx3}\\pard\\intbl\\fs18 \u9633\\cell\\fs18 ${rtfEscape(item.name)}\\cell\\fs18 ${rtfEscape(formatQty(item.quantity))}\\cell\\row\n`
            ).join("");
            return heading + headerRow + rows + `\\pard\\par\n`;
        }).join("");

        return header + body + "}";
    }

    function buildRtf(title, lines) {
        const flatLines = flattenExportLinesForRtf(lines);
        return `{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Segoe UI;}}{\\colortbl;\\red0\\green0\\blue0;\\red46\\green115\\blue59;\\red184\\green45\\blue45;}\\paperw11907\\paperh16840\\margl900\\margr900\\margt760\\margb760\n\\pard\\qc\\b\\fs36\\cf2 ${rtfEscape(title)}\\b0\\par\n${flatLines.map(line => `\\pard\\ql\\fs${line.size && line.size >= 15 ? 26 : 18}${line.bold ? "\\b" : ""}\\cf${line.color === "red" ? 3 : line.color === "green" ? 2 : 1} ${rtfEscape(line.text)}${line.bold ? "\\b0" : ""}\\par`).join("\n")}\n}`;
    }

    function flattenExportLinesForRtf(lines) {
        const flat = [];
        lines.forEach(line => {
            if (line.twoColumnSections) {
                (line.sections || []).forEach(section => {
                    flat.push({ text: section.title, bold: true, color: "green" });
                    (section.lines || []).forEach(text => flat.push({ text: `  ${text}` }));
                });
            } else if (line.table) {
                const headings = (line.columns || []).map(column => column.label).filter(Boolean).join(" | ");
                if (headings) flat.push({ text: headings, bold: true });
                (line.rows || []).forEach(row => flat.push({ text: row.join(" | ") }));
            } else if (line.text !== undefined) {
                flat.push(line);
            }
        });
        return flat;
    }

    function rtfEscape(value) {
        return String(value ?? "").replaceAll("\\", "\\\\").replaceAll("{", "\\{").replaceAll("}", "\\}").replace(/\n/g, "\\line ").replace(/[^\x00-\x7f]/g, ch => `\\u${ch.charCodeAt(0)}?`);
    }

    async function exportCsvZip() {
        const files = exportCsvFiles();
        // Item 22: explain what's inside — four generically-named CSVs with no
        // context force whoever opens the ZIP to guess; a short README fixes that
        const readme = [
            `Scout Camp Planner — CSV data export`,
            `Camp: ${State.project.campName}`,
            `Exported: ${new Date().toLocaleString("en-GB")}`,
            ``,
            `Files in this export:`,
            ``,
            `  people-and-tents.csv`,
            `    One row per person: type, gender, patrol/team, tent allocation,`,
            `    dietary notes, medical notes, and general notes.`,
            ``,
            `  menu.csv`,
            `    One row per planned meal slot: date, slot (breakfast/lunch/dinner),`,
            `    the food, pudding, dietary notes, and notes for that meal.`,
            ``,
            `  kit-list.csv`,
            `    One row per kit item: quantity, status, owner, whether it's`,
            `    consumable, and whether it currently needs action.`,
            ``,
            `  chores.csv`,
            `    One row per chore allocation: date, session, the chore, who's`,
            `    assigned, and any notes.`,
            ``,
            `  budget.csv`,
            `    Camp charges, contribution rules, people contribution rows,`,
            `    cost lines, food settings and final budget totals.`,
            ``,
            `Open any of these in Excel, Google Sheets, or Numbers.`
        ].join("\n");
        const allFiles = { "README.txt": readme, ...files };
        const zip = createZip(Object.entries(allFiles).map(([name, text]) => ({ name, bytes: textToBytes(text) })));
        await saveBytesFile(`${safeFileName(State.project.campName)}-${datedFileName("csv-export.zip")}`, "application/zip", zip);
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

    // Item 7: crypto.subtle only exists in secure contexts (HTTPS or localhost).
    // Without this check, hosting/joining on a plain-HTTP deployment (e.g. a router
    // self-hosted page at camp) fails with a cryptic "crypto.subtle is undefined"
    // deep in the call stack instead of a message that explains what to do.
    function requireSecureContextForCollaboration() {
        if (!window.isSecureContext || !window.crypto?.subtle) {
            throw new Error("Collaboration needs a secure connection (HTTPS). This page is being served over a plain, unencrypted connection, so collaboration can't be used here.");
        }
    }

    async function hostCollaboration() {
        requireSecureContextForCollaboration();
        if (State.collab.active) throw new Error("Leave the current collaboration first.");
        const password = await promptText("Host collaboration", "Password for this collaboration");
        if (!password) return;
        const code = await collaborationHost(JSON.stringify(State.project), password);
        if (window.Android?.copyToClipboard) window.Android.copyToClipboard("Collaboration code", code);
        await alertBox("Host collaboration", `Collaboration code: ${code}\n\nThe code has been copied if clipboard access is available.`);
    }

    async function joinCollaboration() {
        requireSecureContextForCollaboration();
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
        if (State.collab.badgeTimer) clearInterval(State.collab.badgeTimer);
        State.collab = { ...State.collab, active: false, code: "", key: null, revision: 0, timer: null, uploadTimer: null, badgeTimer: null, applyingRemote: false, pendingPush: false, uploadInFlight: false, uploadQueued: false, lastSnapshot: "", etag: null, lastSyncedAt: 0 };
        renderShell();
        setStatus("Left collaboration.");
    }

    async function collaborationHost(projectJson, password) {
        projectJson = captureCollaborationSnapshot();
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
                revision: 1,
                encryptionVersion: 1,
                encryptionAlgorithm: "AES-256-GCM",
                kdf: "PBKDF2-SHA256",
                kdfIterations: 250000,
                salt: keyData.salt,
                encryptedProject: await encryptProjectJson(projectJson, keyData.key)
            };
            await firebasePut(code, payload);
            startCollaboration(code, keyData.key, 1);
            State.collab.lastSnapshot = projectJson;
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
        State.collab.lastSnapshot = JSON.stringify(normalizeProject(JSON.parse(json)));
        return json;
    }

    function startCollaboration(code, key, revision) {
        State.collab.active = true;
        State.collab.code = code;
        State.collab.key = key;
        State.collab.revision = revision;
        State.collab.pendingPush = false;
        State.collab.uploadInFlight = false;
        State.collab.uploadQueued = false;
        State.collab.lastRemoteAt = 0;
        State.collab.lastSnapshot = "";
        State.collab.lastSyncedAt = Date.now();
        State.collab.timer = setInterval(pollCollaboration, 4000);
        // Item 8: refresh the "synced Xs ago" badge text independent of any data
        // change, so the displayed time doesn't go stale while nothing else re-renders
        State.collab.badgeTimer = setInterval(() => { if (State.collab.active) renderShell(); }, 15000);
        renderShell();
        setStatus(`Collaborating: ${code}`);
    }

    async function pollCollaboration() {
        if (!State.collab.active) return;
        // Item 4: don't even attempt a network call while offline — avoids a
        // pointless failed fetch every 4 seconds and the resulting error toast spam
        if (typeof navigator !== "undefined" && navigator.onLine === false) return;
        try {
            const payload = await firebaseGet(State.collab.code, { allowMissing: true });
            if (!payload || payload.updatedBy === State.collab.clientId) return;
            if (!payload.revision || payload.revision <= State.collab.revision) return;
            const json = await decryptProjectJson(payload.encryptedProject, State.collab.key);
            const remote = normalizeProject(JSON.parse(json));
            const remoteSnapshot = JSON.stringify(remote);

            // Merge remote into local rather than overwriting wholesale.
            // Shopping lists: keep items from whichever side was edited more recently per item.
            let merged;
            let mergedSnapshot;
            State.collab.applyingRemote = true;
            try {
                merged = normalizeProject(mergeCollabProject(State.project, remote));
                mergedSnapshot = JSON.stringify(merged);
                State.project = merged;
            } finally {
                State.collab.applyingRemote = false;
            }
            State.collab.revision = payload.revision;
            State.collab.lastSnapshot = mergedSnapshot === remoteSnapshot ? captureCollaborationSnapshot() : remoteSnapshot;
            State.collab.lastRemoteAt = Date.now();
            State.dirty = false;
            saveDraft();
            render();
            if (mergedSnapshot !== remoteSnapshot) {
                State.collab.pendingPush = true;
                scheduleCollaborationUpload({ force: true });
            }
            setStatus(`Received collaboration update: ${State.collab.code}.`);
        } catch (error) {
            setStatus(`Collaboration sync problem: ${error.message}`);
        }
    }

    /**
     * Generic per-item union merge for any flat array of objects with an `id` field.
     * - Items only present locally (not yet pushed) are kept.
     * - Items only present remotely (someone else added them) are taken.
     * - Items present on both sides take the remote version (remote is what was
     *   just confirmed-written to the server, so it reflects the most recently
     *   *synced* state — but because we only ever reach this code 2.5s+ after our
     *   own last push, "remote" here never means "stale data older than ours" in
     *   the normal case).
     * - Item 6: any item identical to what we had before this poll is left alone
     *   (no-op) so React-style identity checks elsewhere aren't disturbed.
     * Order: remote order preserved, then any local-only items appended.
     */
    // Item 8: compact "Xs/Xm ago" formatter for the sync-status badge
    function timeAgoShort(ms) {
        const s = Math.floor(ms / 1000);
        if (s < 5) return "just now";
        if (s < 60) return `${s}s ago`;
        const m = Math.floor(s / 60);
        if (m < 60) return `${m}m ago`;
        const h = Math.floor(m / 60);
        return `${h}h ago`;
    }

    function mergeArrayById(localArr, remoteArr) {
        const local  = localArr  || [];
        const remote = remoteArr || [];
        if ([...local, ...remote].some(item => !item || typeof item !== "object" || !("id" in item))) {
            return mergeStringArray(local, remote);
        }

        const localMap  = new Map(local.map(i => [i.id, i]));
        const remoteMap = new Map(remote.map(i => [i.id, i]));
        const allIds = new Set([...localMap.keys(), ...remoteMap.keys()]);

        const merged = [];
        for (const id of allIds) {
            const li = localMap.get(id);
            const ri = remoteMap.get(id);
            if (!ri) merged.push(li);        // local-only add, not yet pushed
            else if (!li) merged.push(ri);   // remote-only add
            else merged.push(ri);            // both have it: remote wins
        }

        const remoteOrder = remote.map(i => i.id);
        const localOnly   = merged.filter(i => !remoteOrder.includes(i.id));
        return remoteOrder.map(id => merged.find(i => i.id === id)).filter(Boolean).concat(localOnly);
    }

    function mergeStringArray(localArr, remoteArr) {
        const merged = [];
        const seen = new Set();
        for (const value of [...(remoteArr || []), ...(localArr || [])]) {
            const text = clean(value);
            if (!text) continue;
            const key = text.toLowerCase();
            if (seen.has(key)) continue;
            seen.add(key);
            merged.push(text);
        }
        return merged;
    }

    function mergeBudget(localBudget, remoteBudget) {
        if (!remoteBudget) return localBudget;
        if (!localBudget) return remoteBudget;
        return {
            ...remoteBudget,
            people: mergeArrayById(localBudget.people || [], remoteBudget.people || []),
            costItems: mergeArrayById(localBudget.costItems || [], remoteBudget.costItems || [])
        };
    }

    /**
     * Merge a remote project snapshot into the local project.
     * Item 1: every id-keyed collection now gets the same per-item union merge that
     * shopping lists previously had exclusively — so editing Personnel, Tents, Kit,
     * Plan, Menu, or Chores while a collaborator's update lands no longer silently
     * discards your in-flight edit.
     * Scalar/whole-project fields (camp name, dates, language, notes, etc.) still
     * take the remote value, since there's no sensible per-field merge for those
     * without a full operational-transform system.
     */
    function mergeCollabProject(local, remote) {
        const merged = { ...remote };

        // Flat id-keyed collections: generic union merge
        const idKeyedCollections = [
            "people", "tents", "siteItems", "friendLinks", "foeLinks",
            "menuDayNotes", "menuItems",
            "kitItems", "groupKitInventory", "participantKitInventory",
            "choreItems", "choreTeams", "choreAllocations",
            "planItems"
        ];
        for (const key of idKeyedCollections) {
            merged[key] = mergeArrayById(local[key], remote[key]);
        }

        // Ordered string collections are part of the desktop project model but do
        // not have item IDs. Keep the confirmed remote order, then append any
        // local-only additions so slot/library edits are not lost or collapsed.
        merged.menuSlots = mergeStringArray(local.menuSlots, remote.menuSlots);
        merged.menuLibraryItems = mergeStringArray(local.menuLibraryItems, remote.menuLibraryItems);
        merged.choreSessions = mergeStringArray(local.choreSessions, remote.choreSessions);

        // Shopping lists: nested merge (lists, then items within each list)
        const localLists  = local.shoppingLists  || [];
        const remoteLists = remote.shoppingLists || [];
        const localListMap  = new Map(localLists.map(l => [l.id, l]));
        const remoteListMap = new Map(remoteLists.map(l => [l.id, l]));

        const mergedLists = remoteLists.map(remoteList => {
            const localList = localListMap.get(remoteList.id);
            if (!localList) return remoteList;
            return { ...remoteList, items: mergeArrayById(localList.items, remoteList.items) };
        });
        for (const localList of localLists) {
            if (!remoteListMap.has(localList.id)) mergedLists.push(localList);
        }
        merged.shoppingLists = mergedLists;
        merged.budget = mergeBudget(local.budget, remote.budget);

        return merged;
    }

    function scheduleCollaborationUpload(options = {}) {
        if (!State.collab.active || State.collab.applyingRemote) return;
        if (State.collab.uploadInFlight) {
            State.collab.uploadQueued = true;
            State.collab.pendingPush = true;
            renderShell();
            return;
        }
        // Suppress echo-back: don't upload for 2.5s after receiving a remote update
        if (!options.force && State.collab.lastRemoteAt && Date.now() - State.collab.lastRemoteAt < 2500) return;
        if (State.collab.uploadTimer) clearTimeout(State.collab.uploadTimer);
        State.collab.uploadTimer = setTimeout(pushCollaboration, 1200);
    }

    async function pushCollaboration(retryCount = 0) {
        if (!State.collab.active || !State.collab.key) return;
        if (State.collab.uploadInFlight) {
            State.collab.uploadQueued = true;
            State.collab.pendingPush = true;
            renderShell();
            return;
        }
        // Item 4: don't even try while offline — the retry path below will pick
        // this back up once the 'online' event fires
        if (typeof navigator !== "undefined" && navigator.onLine === false) {
            State.collab.pendingPush = true;
            renderShell();
            return;
        }
        const now = Date.now();
        const snapshot = captureCollaborationSnapshot();
        if (snapshot === State.collab.lastSnapshot && !State.collab.pendingPush) {
            renderShell();
            return;
        }
        const payload = {
            updatedAt: now,
            updatedBy: State.collab.clientId,
            revision: now,
            encryptedProject: await encryptProjectJson(snapshot, State.collab.key)
        };
        State.collab.uploadInFlight = true;
        State.collab.pendingPush = true;
        renderShell();
        try {
            // Item 2: a conditional write (If-Match against the ETag we last read)
            // makes the "revision" check atomic instead of trusting client clocks.
            // If another device wrote in between our last poll and this push, the
            // server rejects with 412 and we re-poll/merge before retrying — so a
            // genuinely newer remote edit can never be silently clobbered by a push
            // that was based on stale data, regardless of clock skew between devices.
            const etag = await firebasePatchConditional(State.collab.code, payload, State.collab.etag);
            State.collab.revision = now;
            State.collab.etag = etag;
            State.collab.lastSnapshot = snapshot;
            if (captureCollaborationSnapshot() !== snapshot) {
                State.collab.uploadQueued = true;
            }
            State.collab.pendingPush = false;
            State.collab.lastSyncedAt = now;
            renderShell();
        } catch (error) {
            if (error?.isConflict) {
                // Someone else wrote first — pull their change in, merge, then retry our push
                await pollCollaboration();
                if (retryCount < 4) {
                    setTimeout(() => pushCollaboration(retryCount + 1), 400);
                    return;
                }
            }
            // Item 3: a dropped connection at camp shouldn't silently discard the edit.
            // Retry with backoff (5s, 10s, 20s, capped at 30s) up to 6 attempts, then
            // leave pendingPush set so the next successful poll/push cycle or manual
            // retry can pick it up rather than losing the change entirely.
            State.collab.pendingPush = true;
            renderShell();
            if (retryCount < 6) {
                const delay = Math.min(30000, 5000 * Math.pow(2, retryCount));
                setTimeout(() => pushCollaboration(retryCount + 1), delay);
            } else {
                setStatus("Couldn't sync your changes — they're saved locally and will sync once connection is restored.");
            }
        } finally {
            State.collab.uploadInFlight = false;
            if (State.collab.uploadQueued && State.collab.active && !State.collab.applyingRemote) {
                State.collab.uploadQueued = false;
                scheduleCollaborationUpload({ force: true });
            }
        }
    }

    function captureCollaborationSnapshot() {
        const project = normalizeProject(JSON.parse(JSON.stringify(State.project)));
        for (const shoppingList of project.shoppingLists || []) {
            shoppingList.items = (shoppingList.items || []).filter(item => clean(item.name));
        }
        return JSON.stringify(project);
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

    async function firebaseGet(code, { allowMissing = false } = {}) {
        // Item 2: request an ETag back so writers can later make a conditional
        // (If-Match) write against exactly the version they read
        const response = await fetch(`${FIREBASE_ROOT}/${SESSION_ROOT}/${normalizeCode(code)}.json`, {
            headers: { "X-Firebase-ETag": "true" }
        });
        if (!response.ok) throw new Error(`Firebase returned ${response.status}.`);
        const payload = await response.json();
        if (!payload && !allowMissing) throw new Error("That collaboration code was not found.");
        // Item 5: a null payload during routine polling is usually a transient read
        // racing a concurrent write, not a real error — return null and let the
        // caller silently skip this poll cycle instead of surfacing a scary toast.
        if (payload) State.collab.etag = response.headers.get("ETag") || State.collab.etag;
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

    /**
     * Item 2: conditional PATCH using If-Match against a previously-read ETag.
     * Firebase RTDB's REST API returns 412 Precondition Failed if the data has
     * changed since that ETag was issued — this is what makes "is my edit based
     * on the latest data" an atomic, server-verified check rather than a client
     * clock comparison that clock skew or a slow network can get wrong.
     * If we have no ETag yet (first push of a session), falls back to a plain
     * PATCH and just records whatever ETag comes back for next time.
     */
    async function firebasePatchConditional(code, payload, knownEtag) {
        const headers = { "Content-Type": "application/json", "X-Firebase-ETag": "true" };
        if (knownEtag) headers["if-match"] = knownEtag;
        const response = await fetch(`${FIREBASE_ROOT}/${SESSION_ROOT}/${normalizeCode(code)}.json`, {
            method: "PATCH", headers, body: JSON.stringify(payload)
        });
        if (response.status === 412) {
            const err = new Error("Someone else updated this collaboration just before you.");
            err.isConflict = true;
            throw err;
        }
        if (!response.ok) {
            const detail = await response.text().catch(() => "");
            if ((response.status === 401 || response.status === 403) && /Permission denied/i.test(detail)) {
                const err = new Error("Someone else updated this collaboration just before you.");
                err.isConflict = true;
                throw err;
            }
            throw new Error(`Firebase returned ${response.status}.${detail ? " " + detail : ""}`);
        }
        return response.headers.get("ETag") || knownEtag;
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
                render();
        });
        setStatus(`Language set to ${language}.`);
    }
})();
