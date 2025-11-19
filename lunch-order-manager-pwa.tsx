import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, Trash2, BarChart3, Users, ChefHat, Download, Calendar, Lock, Unlock } from 'lucide-react';

const LunchOrderApp = () => {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('lunchOrders');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentLunchDate, setCurrentLunchDate] = useState(() => {
    const saved = localStorage.getItem('currentLunchDate');
    return saved || new Date().toISOString().split('T')[0];
  });

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [showCSVExport, setShowCSVExport] = useState(false);
  const [csvData, setCsvData] = useState('');
  const [editingOrder, setEditingOrder] = useState(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPrintView, setShowPrintView] = useState(false);
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('appLanguage');
    return saved || 'en';
  });

  const translations = {
    en: {
      title: "Order Your Lunch",
      subtitle: "MILLSTONE RESTAURANT (DUBLIN)",
      totalOrders: "Total Orders",
      adminMode: "Admin Mode",
      adminModeActive: "Admin Mode Active",
      orderingFor: "Ordering for:",
      alreadyOrdered: "Already Ordered",
      setLunchDate: "Set Lunch Date (Students will order for this date)",
      currentLunchDate: "Current lunch date:",
      filterByDate: "Filter by Date:",
      allDates: "All Dates",
      orders: "orders",
      newOrder: "New Order",
      showStats: "Show Statistics",
      hideStats: "Hide Statistics",
      exportCSV: "Export CSV",
      printRestaurant: "Print for Restaurant",
      deleteThisDate: "Delete This Date",
      deleteAllOrders: "Delete All Orders",
      createOrder: "Create Your Order",
      editOrder: "Edit Your Order",
      youAreOrdering: "You are ordering for:",
      yourName: "Your Name",
      enterName: "Enter your name",
      orderType: "Order Type",
      mainAndSide: "Main Dish and/or Side",
      mainAndSideDesc: "Choose main, side or both",
      completeDish: "Complete Dish",
      completeDishDesc: "Choose a complete main course",
      chooseMain: "Choose Main Dish (optional)",
      noMainDish: "No main dish",
      chooseSide: "Choose Side (optional)",
      noSide: "No side",
      chooseComplete: "Choose Complete Dish",
      specialNotes: "Special Notes (optional)",
      notesPlaceholder: "E.g.: no garlic, allergies, preferences...",
      confirmOrder: "Confirm Order",
      updateOrder: "Update Order",
      cancel: "Cancel",
      mainDishes: "Main Dishes",
      sides: "Sides",
      completeDishes: "Complete Dishes",
      specialNotesRestaurant: "Special Notes for Restaurant",
      noOrders: "No orders",
      receivedOrders: "Received Orders",
      showingOrdersFor: "Showing orders for",
      noOrdersYet: "No orders yet",
      clickNewOrder: "Click 'New Order' to start!",
      mainDish: "MAIN DISH",
      side: "SIDE",
      completeDishLabel: "COMPLETE DISH",
      notes: "NOTES",
      importantNotes: "IMPORTANT NOTES",
      deleteOrder: "Delete Order?",
      yesDelete: "Yes, Delete",
      orderConfirmed: "Order Confirmed!",
      orderPlaced: "Your order for",
      hasBeenPlaced: "has been placed",
      exportCSVTitle: "Export CSV Data",
      exportCSVDesc: "Copy the data below and paste it into Excel or Google Sheets:",
      copyClipboard: "Copy to Clipboard",
      close: "Close",
      edit: "Edit this order",
      delete: "Delete this order",
      note: "Note:",
      adminLogin: "Admin Login",
      enterPassword: "Enter admin password",
      login: "Login",
      wrongPassword: "Wrong password!",
      logout: "Logout",
      printSummary: "Restaurant Summary",
      printButton: "Print",
      backToApp: "Back to App",
      pressCtrlP: "Press Ctrl+P (or Cmd+P on Mac) to print",
      readyToPrint: "Ready to print!"
    },
    it: {
      title: "Ordina il tuo Pranzo",
      subtitle: "MILLSTONE RESTAURANT (DUBLINO)",
      totalOrders: "Ordini Totali",
      adminMode: "Modalità Admin",
      adminModeActive: "Modalità Admin Attiva",
      orderingFor: "Ordini per:",
      alreadyOrdered: "Già Ordinato",
      setLunchDate: "Imposta Data Pranzo (Gli studenti ordineranno per questa data)",
      currentLunchDate: "Data pranzo corrente:",
      filterByDate: "Filtra per Data:",
      allDates: "Tutte le Date",
      orders: "ordini",
      newOrder: "Nuovo Ordine",
      showStats: "Mostra Statistiche",
      hideStats: "Nascondi Statistiche",
      exportCSV: "Esporta CSV",
      printRestaurant: "Stampa per Ristorante",
      deleteThisDate: "Elimina Questa Data",
      deleteAllOrders: "Elimina Tutti gli Ordini",
      createOrder: "Crea il tuo Ordine",
      editOrder: "Modifica il tuo Ordine",
      youAreOrdering: "Stai ordinando per:",
      yourName: "Il tuo Nome",
      enterName: "Inserisci il tuo nome",
      orderType: "Tipo di Ordine",
      mainAndSide: "Primo e/o Contorno",
      mainAndSideDesc: "Scegli primo, contorno o entrambi",
      completeDish: "Piatto Completo",
      completeDishDesc: "Scegli un piatto principale completo",
      chooseMain: "Scegli il Primo Piatto (opzionale)",
      noMainDish: "Nessun primo piatto",
      chooseSide: "Scegli il Contorno (opzionale)",
      noSide: "Nessun contorno",
      chooseComplete: "Scegli il Piatto Completo",
      specialNotes: "Note Speciali (opzionale)",
      notesPlaceholder: "Es: senza aglio, allergie, preferenze...",
      confirmOrder: "Conferma Ordine",
      updateOrder: "Aggiorna Ordine",
      cancel: "Annulla",
      mainDishes: "Primi Piatti",
      sides: "Contorni",
      completeDishes: "Piatti Completi",
      specialNotesRestaurant: "Note Speciali per il Ristorante",
      noOrders: "Nessun ordine",
      receivedOrders: "Ordini Ricevuti",
      showingOrdersFor: "Mostrando ordini per",
      noOrdersYet: "Nessun ordine ancora",
      clickNewOrder: "Clicca 'Nuovo Ordine' per iniziare!",
      mainDish: "PRIMO PIATTO",
      side: "CONTORNO",
      completeDishLabel: "PIATTO COMPLETO",
      notes: "NOTE",
      importantNotes: "NOTE IMPORTANTI",
      deleteOrder: "Eliminare Ordine?",
      yesDelete: "Sì, Elimina",
      orderConfirmed: "Ordine Confermato!",
      orderPlaced: "Il tuo ordine per",
      hasBeenPlaced: "è stato registrato",
      exportCSVTitle: "Esporta Dati CSV",
      exportCSVDesc: "Copia i dati qui sotto e incollali in Excel o Google Sheets:",
      copyClipboard: "Copia negli Appunti",
      close: "Chiudi",
      edit: "Modifica questo ordine",
      delete: "Elimina questo ordine",
      note: "Nota:",
      adminLogin: "Login Amministratore",
      enterPassword: "Inserisci password admin",
      login: "Accedi",
      wrongPassword: "Password errata!",
      logout: "Esci",
      printSummary: "Riepilogo Ristorante",
      printButton: "Stampa",
      backToApp: "Torna all'App",
      pressCtrlP: "Premi Ctrl+P (o Cmd+P su Mac) per stampare",
      readyToPrint: "Pronto per la stampa!"
    }
  };

  const t = translations[language];
  
  const [currentOrder, setCurrentOrder] = useState({
    name: '',
    orderType: '',
    lunch: '',
    side: '',
    mainCourse: '',
    notes: ''
  });

  useEffect(() => {
    localStorage.setItem('lunchOrders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('currentLunchDate', currentLunchDate);
  }, [currentLunchDate]);

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
  }, [language]);

  const lunchMenu = [
    'CHARGRILLED PIRI PIRI CHICKEN & FRITES',
    'FRESH MUSSELS & FRITES',
    'PRIME IRISH STRIPLOIN SANDWICH & FRITES',
    'BEEF BURGER & FRITES',
    'STEAK & FRITES',
    'GRILLED SALMON & PESTO SALAD',
    'BUFFALO WINGS & FRITES',
    'VEGAN TOFU & BEETROOT SALAD'
  ];

  const lunchMenuIT = [
    'POLLO AL PIRI PIRI ALLA GRIGLIA E PATATINE FRITTE',
    'COZZE FRESCHE E PATATINE FRITTE',
    'SANDWICH DI FILETTO DI MANZO IRLANDESE E PATATINE FRITTE',
    'HAMBURGER DI MANZO E PATATINE FRITTE',
    'BISTECCA E PATATINE FRITTE',
    'SALMONE ALLA GRIGLIA E INSALATA AL PESTO',
    'ALETTE DI POLLO E PATATINE FRITTE',
    'TOFU VEGANO E INSALATA DI BARBABIETOLE'
  ];

  const sidesMenu = [
    'CHUNKY CHIPS',
    'SKINNY CHIPS',
    'BUTTERED MASH',
    'ROASTED ROOT VEGETABLES',
    'MUSHROOM & ONION',
    'MIXED LEAF SALAD',
    'VINE TOMATO & PESTO SALAD'
  ];

  const sidesMenuIT = [
    'PATATINE FRITTE SPESSE',
    'PATATINE FRITTE SOTTILI',
    'PURÈ AL BURRO',
    'VERDURE DI RADICE ARROSTO',
    'FUNGHI E CIPOLLA',
    'INSALATA MISTA',
    'INSALATA DI POMODORI E PESTO'
  ];

  const mainCoursesMenu = [
    'ROASTED IRISH CHICKEN BREAST',
    'FRESH MUSSELS & FRITES',
    'BEEF & GUINNESS STEW',
    'CHARGRILLED PRIME BEEF BURGER & FRITES',
    'CLASSIC FISH & CHIPS',
    'OVEN BAKED IRISH SALMON',
    'SLOW ROASTED WICKLOW LAMB SHANK',
    'PETIT STRIPLOIN & FRITES',
    'VEGAN TOFU STEAK'
  ];

  const mainCoursesMenuIT = [
    'PETTO DI POLLO IRLANDESE ARROSTO',
    'COZZE FRESCHE E PATATINE FRITTE',
    'STUFATO DI MANZO E GUINNESS',
    'HAMBURGER DI MANZO DI PRIMA SCELTA ALLA GRIGLIA E PATATINE FRITTE',
    'CLASSICO FISH & CHIPS',
    'SALMONE IRLANDESE AL FORNO',
    'STINCO DI AGNELLO DI WICKLOW ARROSTO LENTAMENTE',
    'PETIT STRIPLOIN E PATATINE FRITTE',
    'BISTECCA VEGANA DI TOFU'
  ];

  const getCurrentLunchMenu = () => language === 'it' ? lunchMenuIT : lunchMenu;
  const getCurrentSidesMenu = () => language === 'it' ? sidesMenuIT : sidesMenu;
  const getCurrentMainCoursesMenu = () => language === 'it' ? mainCoursesMenuIT : mainCoursesMenu;

  // Dizionario per tradurre note comuni dall'italiano all'inglese
  const translateNoteToEnglish = (note) => {
    if (!note) return '';
    
    const lowerNote = note.toLowerCase().trim();
    
    // Frasi complete (controllare prima delle singole parole)
    const phraseTranslations = {
      // Verbi comuni con "di"
      'evitare di mettere': 'avoid adding',
      'evitare di aggiungere': 'avoid adding',
      'cercare di non mettere': 'try not to add',
      'non mettere': 'do not add',
      'non aggiungere': 'do not add',
      'per favore non mettere': 'please do not add',
      'per favore evitare': 'please avoid',
      'si prega di non mettere': 'please do not add',
      'si prega di evitare': 'please avoid',
      
      // Richieste comuni
      'vorrei senza': 'I would like without',
      'preferirei senza': 'I would prefer without',
      'mi piacerebbe senza': 'I would like without',
      'posso avere senza': 'can I have without',
      'è possibile senza': 'is it possible without',
      'vorrei che fosse': 'I would like it to be',
      'preferirei che fosse': 'I would prefer it to be',
      
      // Rosmarino
      'evita il rosmarino': 'avoid rosemary',
      'evitare il rosmarino': 'avoid rosemary',
      'senza rosmarino': 'no rosemary',
      'niente rosmarino': 'no rosemary',
      
      // Sale
      'evitare di mettere troppo sale': 'avoid too much salt',
      'non mettere troppo sale': 'do not add too much salt',
      'mettere poco sale': 'add less salt',
      'poco sale': 'less salt',
      'senza sale': 'no salt',
      'troppo sale': 'too much salt',
      'sale a parte': 'salt on the side',
      
      // Cotture
      'ben cotto': 'well done',
      'molto cotto': 'very well done',
      'poco cotto': 'rare',
      'al sangue': 'rare',
      'media cottura': 'medium',
      'mediamente cotto': 'medium',
      'cottura media': 'medium cooked',
      
      // Piccante
      'molto piccante': 'very spicy',
      'poco piccante': 'mild spicy',
      'non piccante': 'not spicy',
      'senza piccante': 'no spice',
      'niente piccante': 'no spice',
      
      // Salse e condimenti
      'salsa a parte': 'sauce on the side',
      'condimento a parte': 'dressing on the side',
      'senza salsa': 'no sauce',
      'poca salsa': 'less sauce',
      'molta salsa': 'extra sauce',
      
      // Porzioni
      'porzione grande': 'large portion',
      'porzione piccola': 'small portion',
      'doppia porzione': 'double portion',
      'mezza porzione': 'half portion',
      
      // Allergie e intolleranze
      'intollerante al lattosio': 'lactose intolerant',
      'intollerante al glutine': 'gluten intolerant',
      'allergia al glutine': 'gluten allergy',
      'allergia alle arachidi': 'peanut allergy',
      'allergia ai frutti di mare': 'seafood allergy',
      'sono allergico a': 'I am allergic to',
      'sono intollerante a': 'I am intolerant to',
      'ho un\'allergia': 'I have an allergy',
      
      // Altre frasi comuni
      'se possibile': 'if possible',
      'per favore': 'please',
      'grazie': 'thank you',
      'mi raccomando': 'please note',
      'molto importante': 'very important'
    };
    
    // Singole parole (verbi e altro)
    const wordTranslations = {
      // Verbi comuni
      'evita': 'avoid',
      'evitare': 'avoid',
      'mettere': 'add',
      'metti': 'add',
      'aggiungere': 'add',
      'aggiungi': 'add',
      'togliere': 'remove',
      'togli': 'remove',
      'rimuovere': 'remove',
      'rimuovi': 'remove',
      'sostituire': 'replace',
      'sostituisci': 'replace',
      'cambiare': 'change',
      'cambia': 'change',
      'preparare': 'prepare',
      'prepara': 'prepare',
      'cuocere': 'cook',
      'cuoci': 'cook',
      'grigliare': 'grill',
      'griglia': 'grill',
      'friggere': 'fry',
      'friggi': 'fry',
      'bollire': 'boil',
      'bolli': 'boil',
      'servire': 'serve',
      'servi': 'serve',
      'tagliare': 'cut',
      'taglia': 'cut',
      'scaldare': 'heat',
      'scalda': 'heat',
      
      // Articoli (da rimuovere)
      'il': '',
      'la': '',
      'lo': '',
      'i': '',
      'gli': '',
      'le': '',
      'un': '',
      'una': '',
      'uno': '',
      
      // Preposizioni
      'di': 'of',
      'a': 'to',
      'da': 'from',
      'in': 'in',
      'con': 'with',
      'su': 'on',
      'per': 'for',
      'tra': 'between',
      'fra': 'between',
      
      // Congiunzioni
      'e': 'and',
      'o': 'or',
      'ma': 'but',
      'però': 'but',
      
      // Negazioni
      'senza': 'without',
      'no': 'no',
      'non': 'not',
      'niente': 'nothing',
      'nulla': 'nothing',
      
      // Ingredienti comuni
      'aglio': 'garlic',
      'cipolla': 'onion',
      'cipolle': 'onions',
      'rosmarino': 'rosemary',
      'basilico': 'basil',
      'prezzemolo': 'parsley',
      'origano': 'oregano',
      'peperoncino': 'chili pepper',
      'formaggio': 'cheese',
      'burro': 'butter',
      'olio': 'oil',
      'aceto': 'vinegar',
      'limone': 'lemon',
      'pomodoro': 'tomato',
      'pomodori': 'tomatoes',
      'funghi': 'mushrooms',
      'olive': 'olives',
      'carote': 'carrots',
      'patate': 'potatoes',
      'insalata': 'salad',
      'verdure': 'vegetables',
      'carne': 'meat',
      'pesce': 'fish',
      'pollo': 'chicken',
      'manzo': 'beef',
      'maiale': 'pork',
      'uova': 'eggs',
      'pane': 'bread',
      'pasta': 'pasta',
      'riso': 'rice',
      
      // Allergie e restrizioni
      'glutine': 'gluten',
      'celiaco': 'celiac',
      'celiachia': 'celiac disease',
      'lattosio': 'lactose',
      'allergia': 'allergy',
      'allergico': 'allergic',
      'allergica': 'allergic',
      'intollerante': 'intolerant',
      'intolleranza': 'intolerance',
      
      // Diete
      'vegano': 'vegan',
      'vegana': 'vegan',
      'vegetariano': 'vegetarian',
      'vegetariana': 'vegetarian',
      
      // Sapori e caratteristiche
      'piccante': 'spicy',
      'sale': 'salt',
      'salato': 'salty',
      'pepe': 'pepper',
      'spezie': 'spices',
      'salsa': 'sauce',
      'cotto': 'cooked',
      'cotta': 'cooked',
      'crudo': 'raw',
      'cruda': 'raw',
      'cottura': 'cooking',
      'fresco': 'fresh',
      'fresca': 'fresh',
      'freddo': 'cold',
      'fredda': 'cold',
      'caldo': 'hot',
      'calda': 'hot',
      'tiepido': 'warm',
      'tiepida': 'warm',
      'dolce': 'sweet',
      'amaro': 'bitter',
      'acido': 'sour',
      'ben': 'well',
      'sangue': 'rare',
      'media': 'medium',
      
      // Quantità e misure
      'extra': 'extra',
      'troppo': 'too much',
      'troppa': 'too much',
      'troppi': 'too many',
      'troppe': 'too many',
      'molto': 'very',
      'molta': 'a lot of',
      'molti': 'many',
      'molte': 'many',
      'poco': 'little',
      'poca': 'little',
      'pochi': 'few',
      'poche': 'few',
      'abbastanza': 'enough',
      'porzione': 'portion',
      'grande': 'large',
      'piccola': 'small',
      'piccolo': 'small',
      'doppia': 'double',
      'doppio': 'double',
      'mezza': 'half',
      'mezzo': 'half',
      
      // Altro
      'condimento': 'dressing',
      'parte': 'side',
      'separato': 'separate',
      'separata': 'separate',
      'insieme': 'together',
      'sopra': 'on top',
      'sotto': 'under',
      'dentro': 'inside',
      'fuori': 'outside'
    };

    let translatedNote = lowerNote;
    let hasTranslation = false;

    // Prima: sostituisci le frasi complete
    for (const [italian, english] of Object.entries(phraseTranslations)) {
      if (translatedNote.includes(italian)) {
        translatedNote = translatedNote.replace(new RegExp(italian, 'gi'), english);
        hasTranslation = true;
      }
    }

    // Poi: sostituisci le singole parole rimaste
    for (const [italian, english] of Object.entries(wordTranslations)) {
      if (!english) continue; // Salta articoli da rimuovere
      // Usa word boundary per non tradurre parti di parole
      const regex = new RegExp('\\b' + italian + '\\b', 'gi');
      if (regex.test(translatedNote)) {
        translatedNote = translatedNote.replace(regex, english);
        hasTranslation = true;
      }
    }
    
    // Rimuovi articoli italiani rimasti (quelli con traduzione vuota)
    translatedNote = translatedNote.replace(/\b(il|la|lo|i|gli|le|un|una|uno)\b/gi, '');

    // Se ci sono state traduzioni, sistema la formattazione
    if (hasTranslation) {
      // Rimuovi spazi doppi
      translatedNote = translatedNote.replace(/\s+/g, ' ').trim();
      // Rimuovi virgole doppie
      translatedNote = translatedNote.replace(/,\s*,/g, ',');
      // Capitalizza la prima lettera
      translatedNote = translatedNote.charAt(0).toUpperCase() + translatedNote.slice(1);
      return translatedNote;
    }

    return null; // Nessuna traduzione necessaria
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const locale = language === 'it' ? 'it-IT' : 'en-GB';
    return date.toLocaleDateString(locale, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getWeekdayColor = (dateString) => {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    const colors = {
      0: { bg: 'bg-gray-100', text: 'text-gray-800', badge: 'bg-gray-500' }, // Domenica - Nero/Grigio
      1: { bg: 'bg-orange-100', text: 'text-orange-700', badge: 'bg-orange-500' }, // Lunedì - Arancione
      2: { bg: 'bg-blue-100', text: 'text-blue-700', badge: 'bg-blue-500' }, // Martedì - Blu
      3: { bg: 'bg-green-100', text: 'text-green-700', badge: 'bg-green-500' }, // Mercoledì - Verde
      4: { bg: 'bg-purple-100', text: 'text-purple-700', badge: 'bg-purple-500' }, // Giovedì - Viola
      5: { bg: 'bg-pink-100', text: 'text-pink-700', badge: 'bg-pink-500' }, // Venerdì - Fucsia
      6: { bg: 'bg-gray-100', text: 'text-gray-700', badge: 'bg-gray-500' }, // Sabato - Grigio
    };
    
    return colors[dayOfWeek] || colors[1];
  };

  const allDates = useMemo(() => {
    const dates = [...new Set(orders.map(o => o.lunchDate))];
    return dates.sort().reverse();
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (selectedDateFilter === 'all') return orders;
    return orders.filter(o => o.lunchDate === selectedDateFilter);
  }, [orders, selectedDateFilter]);

  const statistics = useMemo(() => {
    const ordersToAnalyze = selectedDateFilter === 'all' ? orders : filteredOrders;
    const lunchCount = {};
    const sideCount = {};
    const mainCount = {};
    const notesData = [];
    
    ordersToAnalyze.forEach(order => {
      if (order.lunch) {
        lunchCount[order.lunch] = (lunchCount[order.lunch] || 0) + 1;
      }
      if (order.side) {
        sideCount[order.side] = (sideCount[order.side] || 0) + 1;
      }
      if (order.mainCourse) {
        mainCount[order.mainCourse] = (mainCount[order.mainCourse] || 0) + 1;
      }
      
      // Raccogli tutte le note con i relativi piatti
      if (order.notes && order.notes.trim()) {
        const dishName = order.lunch || order.mainCourse || 'Unknown dish';
        notesData.push({
          dish: dishName,
          side: order.side || '',
          notes: order.notes.trim()
        });
      }
    });

    return { lunchCount, sideCount, mainCount, notesData };
  }, [orders, filteredOrders, selectedDateFilter]);

  const handleSubmitOrder = () => {
    if (!currentOrder.name.trim()) {
      return;
    }

    if (!currentOrder.orderType) {
      return;
    }

    if (currentOrder.orderType === 'lunch' && (!currentOrder.lunch && !currentOrder.side)) {
      return;
    }

    if (currentOrder.orderType === 'main' && !currentOrder.mainCourse) {
      return;
    }

    if (editingOrder) {
      // Modifica ordine esistente
      setOrders(orders.map(o => 
        o.id === editingOrder.id 
          ? {
              ...o,
              name: currentOrder.name,
              lunch: currentOrder.orderType === 'lunch' ? currentOrder.lunch : '',
              side: currentOrder.orderType === 'lunch' ? currentOrder.side : '',
              mainCourse: currentOrder.orderType === 'main' ? currentOrder.mainCourse : '',
              notes: currentOrder.notes,
              lunchDate: currentLunchDate
            }
          : o
      ));
      setEditingOrder(null);
    } else {
      // Nuovo ordine
      const newOrder = {
        id: Date.now(),
        name: currentOrder.name,
        lunch: currentOrder.orderType === 'lunch' ? currentOrder.lunch : '',
        side: currentOrder.orderType === 'lunch' ? currentOrder.side : '',
        mainCourse: currentOrder.orderType === 'main' ? currentOrder.mainCourse : '',
        notes: currentOrder.notes,
        lunchDate: currentLunchDate,
        timestamp: new Date().toLocaleString('en-GB')
      };
      setOrders([...orders, newOrder]);
    }

    setCurrentOrder({
      name: '',
      orderType: '',
      lunch: '',
      side: '',
      mainCourse: '',
      notes: ''
    });
    setShowOrderForm(false);
    
    // Mostra banner di successo
    setShowSuccessBanner(true);
    setTimeout(() => setShowSuccessBanner(false), 5000);
  };

  const deleteOrder = (id) => {
    setOrders(prevOrders => prevOrders.filter(o => o.id !== id));
    setOrderToDelete(null);
  };

  const confirmDelete = (order) => {
    setOrderToDelete(order);
  };

  const startNewOrder = () => {
    setShowOrderForm(true);
    setEditingOrder(null);
    setCurrentOrder({
      name: '',
      orderType: '',
      lunch: '',
      side: '',
      mainCourse: '',
      notes: ''
    });
  };

  const startEditOrder = (order) => {
    setEditingOrder(order);
    setShowOrderForm(true);
    setCurrentOrder({
      name: order.name,
      orderType: order.lunch || order.side ? 'lunch' : 'main',
      lunch: order.lunch || '',
      side: order.side || '',
      mainCourse: order.mainCourse || '',
      notes: order.notes || ''
    });
  };

  const exportToCSV = () => {
    const ordersToExport = selectedDateFilter === 'all' ? orders : filteredOrders;
    let csv = 'Lunch Date,Name,Main Dish,Side,Complete Dish,Notes\n';
    ordersToExport.forEach(o => {
      const date = formatDate(o.lunchDate);
      csv += `"${date}","${o.name}","${o.lunch}","${o.side}","${o.mainCourse}","${o.notes}"\n`;
    });
    
    setCsvData(csv);
    setShowCSVExport(true);
  };

  const copyCSVToClipboard = () => {
    navigator.clipboard.writeText(csvData);
  };

  const printRestaurantSummary = () => {
    const ordersToExport = selectedDateFilter === 'all' ? orders : filteredOrders;
    const dateTitle = selectedDateFilter === 'all' 
      ? 'All Dates' 
      : formatDate(selectedDateFilter);
    
    let printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Millstone Restaurant - Order Summary</title>
        <style>
          @page { 
            margin: 8mm;
            size: A4;
          }
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.1;
            color: #333;
            font-size: 9pt;
            margin: 0;
            padding: 0;
          }
          h1 { 
            color: #f97316; 
            border-bottom: 1px solid #f97316;
            padding-bottom: 2pt;
            margin: 0 0 4pt 0;
            font-size: 14pt;
            line-height: 1;
          }
          h2 { 
            color: #1f2937;
            margin: 4pt 0 2pt 0;
            border-left: 2px solid #f97316;
            padding-left: 4pt;
            font-size: 10pt;
            line-height: 1;
          }
          .summary-box {
            background: #f3f4f6;
            padding: 3pt;
            margin: 2pt 0 4pt 0;
            border-radius: 2pt;
            font-size: 8pt;
          }
          .dish-item {
            display: flex;
            justify-content: space-between;
            padding: 2pt 0;
            border-bottom: 1px solid #e5e7eb;
            font-size: 8pt;
            line-height: 1.1;
          }
          .dish-name { 
            font-weight: normal;
          }
          .dish-count { 
            font-weight: bold;
            color: #f97316;
            font-size: 10pt;
          }
          .notes-section {
            background: #fef3c7;
            padding: 3pt;
            margin: 2pt 0;
            border-left: 2px solid #f59e0b;
            border-radius: 2pt;
            font-size: 7pt;
            line-height: 1.2;
          }
          .note-item {
            margin: 2pt 0;
            padding: 2pt;
            background: white;
            border-radius: 2pt;
          }
          .note-dish { 
            font-weight: bold;
            color: #1f2937;
            font-size: 7pt;
          }
          .note-text {
            color: #92400e;
            font-style: italic;
            margin-top: 1pt;
            font-size: 7pt;
          }
          .alert-note {
            background: #fee2e2 !important;
            border-left: 2px solid #dc2626 !important;
          }
          .footer {
            margin-top: 4pt;
            padding-top: 2pt;
            border-top: 1px solid #ccc;
            text-align: center;
            color: #999;
            font-size: 7pt;
          }
        </style>
      </head>
      <body>
        <h1>MILLSTONE RESTAURANT - DUBLIN</h1>
        <div class="summary-box">
          ${dateTitle} - <strong>Total: ${ordersToExport.length}</strong>
        </div>
    `;

    // Main Dishes
    if (Object.keys(statistics.lunchCount).length > 0) {
      printContent += '<h2>Main Dishes</h2>';
      Object.entries(statistics.lunchCount).forEach(([dish, count]) => {
        printContent += `
          <div class="dish-item">
            <span class="dish-name">${dish}</span>
            <span class="dish-count">×${count}</span>
          </div>
        `;
      });
    }

    // Sides
    if (Object.keys(statistics.sideCount).length > 0) {
      printContent += '<h2>Sides</h2>';
      Object.entries(statistics.sideCount).forEach(([dish, count]) => {
        printContent += `
          <div class="dish-item">
            <span class="dish-name">${dish}</span>
            <span class="dish-count">×${count}</span>
          </div>
        `;
      });
    }

    // Complete Dishes
    if (Object.keys(statistics.mainCount).length > 0) {
      printContent += '<h2>Complete Dishes</h2>';
      Object.entries(statistics.mainCount).forEach(([dish, count]) => {
        printContent += `
          <div class="dish-item">
            <span class="dish-name">${dish}</span>
            <span class="dish-count">×${count}</span>
          </div>
        `;
      });
    }

    // Special Notes
    if (statistics.notesData.length > 0) {
      printContent += '<h2>⚠️ Special Notes</h2>';
      statistics.notesData.forEach(item => {
        const isAlert = item.notes.toLowerCase().includes('allerg') || 
                       item.notes.toLowerCase().includes('no ');
        printContent += `
          <div class="notes-section ${isAlert ? 'alert-note' : ''}">
            <div class="note-dish">
              ${item.dish}${item.side ? ' + ' + item.side : ''}
            </div>
            <div class="note-text">Note: ${item.notes}</div>
          </div>
        `;
      });
    }

    printContent += `
        <div class="footer">
          ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })} ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 250);
  };

  const clearAllOrders = () => {
    setOrders([]);
    localStorage.removeItem('lunchOrders');
  };

  const clearOrdersForDate = (date) => {
    setOrders(orders.filter(o => o.lunchDate !== date));
  };

  const handleAdminLogin = () => {
    if (adminPassword === '1234') {
      setIsAdminMode(true);
      setShowAdminLogin(false);
      setAdminPassword('');
    } else {
      alert(t.wrongPassword);
      setAdminPassword('');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminMode(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 md:p-8">
      <style>{`
        @media print {
          body { 
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          * {
            background: transparent !important;
          }
          .print-hide {
            display: none !important;
          }
        }
      `}</style>
      
      {showPrintView ? (
        <div className="max-w-5xl mx-auto bg-white min-h-screen print:p-0">
          <style>{`
            @media print {
              body { 
                margin: 0;
                padding: 0;
                font-size: 9pt;
                line-height: 1.2;
              }
              .no-print { 
                display: none !important; 
              }
              .print-content { 
                padding: 8mm !important;
                max-width: 100% !important;
              }
              @page {
                margin: 8mm;
                size: A4;
              }
              h1 {
                font-size: 14pt !important;
                margin: 0 0 2pt 0 !important;
                line-height: 1.1 !important;
              }
              h2 {
                font-size: 10pt !important;
                margin: 4pt 0 2pt 0 !important;
                padding-bottom: 1pt !important;
                line-height: 1.1 !important;
              }
              .compact-box {
                padding: 3pt !important;
                margin: 2pt 0 !important;
              }
              .dish-item {
                padding: 2pt 4pt !important;
                margin: 1pt 0 !important;
                font-size: 8pt !important;
                line-height: 1.1 !important;
              }
              .note-item {
                padding: 3pt !important;
                margin: 1pt 0 !important;
                font-size: 7pt !important;
                line-height: 1.2 !important;
              }
              .section-break {
                margin-bottom: 4pt !important;
              }
              .compact-title {
                font-size: 10pt !important;
                margin: 3pt 0 1pt 0 !important;
              }
              .dish-count {
                font-size: 10pt !important;
              }
              .header-compact {
                margin-bottom: 3pt !important;
              }
              .subtitle-compact {
                font-size: 9pt !important;
                margin: 0 !important;
              }
              .total-box {
                padding: 2pt !important;
                margin: 2pt 0 3pt 0 !important;
                font-size: 8pt !important;
              }
            }
          `}</style>
          
          <div className="no-print bg-gradient-to-r from-orange-500 to-amber-500 p-4 sticky top-0 z-10 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-white mb-1">{t.printSummary}</h2>
                <p className="text-white text-sm opacity-90 bg-green-600 px-3 py-1 rounded-full inline-block">
                  ✓ {t.readyToPrint}
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-3 items-center">
                <div className="bg-white px-4 py-2 rounded-lg text-center">
                  <p className="text-sm font-semibold text-gray-700 mb-1">{t.pressCtrlP}</p>
                  <div className="flex gap-2 justify-center">
                    <kbd className="px-3 py-1 bg-gray-800 text-white rounded text-sm font-mono">Ctrl</kbd>
                    <span className="text-gray-600">+</span>
                    <kbd className="px-3 py-1 bg-gray-800 text-white rounded text-sm font-mono">P</kbd>
                  </div>
                </div>
                <button
                  onClick={() => setShowPrintView(false)}
                  className="flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-md"
                >
                  ← {t.backToApp}
                </button>
              </div>
            </div>
          </div>

          <div className="print-content p-8">
            <div className="text-center mb-3 header-compact">
              <h1 className="text-xl font-bold text-orange-600 mb-0">MILLSTONE RESTAURANT - DUBLIN</h1>
              <div className="mt-1 text-sm font-semibold text-gray-700 subtitle-compact">
                {selectedDateFilter === 'all' 
                  ? (language === 'en' ? 'All Dates' : 'Tutte le Date')
                  : formatDate(selectedDateFilter)
                }
              </div>
            </div>

            <div className="bg-orange-50 p-2 rounded mb-3 border border-orange-200 total-box">
              <div className="text-center">
                <span className="text-sm font-semibold text-gray-700">
                  {language === 'en' ? 'Total:' : 'Totale:'}
                </span>
                <span className="text-lg font-bold text-orange-600 ml-2">{filteredOrders.length}</span>
              </div>
            </div>

            {Object.keys(statistics.lunchCount).length > 0 && (
              <div className="mb-2 section-break">
                <h2 className="text-base font-bold text-gray-800 mb-1 pb-0 border-b border-orange-500 compact-title">
                  {t.mainDishes}
                </h2>
                <div className="space-y-0">
                  {Object.entries(statistics.lunchCount).map(([dish, count]) => (
                    <div key={dish} className="flex justify-between items-center p-1 bg-gray-50 rounded dish-item">
                      <span className="text-gray-800 text-xs">{dish}</span>
                      <span className="text-sm font-bold text-orange-600 dish-count">×{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {Object.keys(statistics.sideCount).length > 0 && (
              <div className="mb-2 section-break">
                <h2 className="text-base font-bold text-gray-800 mb-1 pb-0 border-b border-green-500 compact-title">
                  {t.sides}
                </h2>
                <div className="space-y-0">
                  {Object.entries(statistics.sideCount).map(([dish, count]) => (
                    <div key={dish} className="flex justify-between items-center p-1 bg-gray-50 rounded dish-item">
                      <span className="text-gray-800 text-xs">{dish}</span>
                      <span className="text-sm font-bold text-green-600 dish-count">×{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {Object.keys(statistics.mainCount).length > 0 && (
              <div className="mb-2 section-break">
                <h2 className="text-base font-bold text-gray-800 mb-1 pb-0 border-b border-blue-500 compact-title">
                  {t.completeDishes}
                </h2>
                <div className="space-y-0">
                  {Object.entries(statistics.mainCount).map(([dish, count]) => (
                    <div key={dish} className="flex justify-between items-center p-1 bg-gray-50 rounded dish-item">
                      <span className="text-gray-800 text-xs">{dish}</span>
                      <span className="text-sm font-bold text-blue-600 dish-count">×{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {statistics.notesData.length > 0 && (
              <div className="mb-2 section-break">
                <h2 className="text-base font-bold text-gray-800 mb-1 pb-0 border-b border-amber-500 compact-title">
                  ⚠️ {t.specialNotesRestaurant}
                </h2>
                <div className="space-y-1">
                  {statistics.notesData.map((item, index) => {
                    const hasAllergyOrRestriction = 
                      item.notes.toLowerCase().includes('allerg') ||
                      item.notes.toLowerCase().includes('no ') ||
                      item.notes.toLowerCase().includes('senza') ||
                      item.notes.toLowerCase().includes('without');
                    
                    const englishTranslation = translateNoteToEnglish(item.notes);
                    
                    return (
                      <div 
                        key={index} 
                        className={`p-1 rounded border-l-2 note-item ${
                          hasAllergyOrRestriction 
                            ? 'bg-red-50 border-red-500' 
                            : 'bg-amber-50 border-amber-500'
                        }`}
                      >
                        <div className="font-bold text-gray-800 text-xs">
                          {item.dish}
                          {item.side && <span className="text-xs text-gray-600"> + {item.side}</span>}
                        </div>
                        <div className={`text-xs ${
                          hasAllergyOrRestriction ? 'text-red-800 font-semibold' : 'text-amber-800'
                        }`}>
                          <div className="italic">
                            {item.notes}
                          </div>
                          {englishTranslation && englishTranslation.toLowerCase() !== item.notes.toLowerCase() && (
                            <div className="mt-0.5 font-semibold text-blue-800 bg-blue-50 px-1 py-0.5 rounded text-xs">
                              🇬🇧 {englishTranslation}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-2 pt-1 border-t border-gray-300 text-center text-gray-500 text-xs">
              <p className="text-xs">
                {new Date().toLocaleDateString(language === 'en' ? 'en-GB' : 'it-IT', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      ) : (
      <div className="max-w-6xl mx-auto print-hide">
        {/* Banner di successo */}
        {showSuccessBanner && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
            <div className="bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <div className="font-bold text-lg">Order Confirmed!</div>
                <div className="text-sm opacity-90">Your order for {formatDate(currentLunchDate)} has been placed</div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Admin Login */}
        {showAdminLogin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{t.adminLogin}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.enterPassword}
                  </label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                    placeholder="****"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                    autoFocus
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleAdminLogin}
                    className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                  >
                    {t.login}
                  </button>
                  <button
                    onClick={() => {
                      setShowAdminLogin(false);
                      setAdminPassword('');
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-400 transition-colors"
                  >
                    {t.cancel}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal CSV Export */}
        {showCSVExport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-3xl w-full shadow-2xl max-h-[80vh] flex flex-col">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{t.exportCSVTitle}</h3>
              <p className="text-sm text-gray-600 mb-4">{t.exportCSVDesc}</p>
              <textarea
                value={csvData}
                readOnly
                className="flex-1 w-full p-4 border-2 border-gray-200 rounded-xl font-mono text-sm mb-4 resize-none"
                onClick={(e) => e.target.select()}
              />
              <div className="flex gap-3">
                <button
                  onClick={copyCSVToClipboard}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                >
                  {t.copyClipboard}
                </button>
                <button
                  onClick={() => setShowCSVExport(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-400 transition-colors"
                >
                  {t.close}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal di conferma eliminazione */}
        {orderToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{t.deleteOrder}</h3>
              <div className="bg-red-50 p-4 rounded-xl mb-4">
                <p className="font-semibold text-gray-800 mb-2">{orderToDelete.name}</p>
                {orderToDelete.lunch && <p className="text-sm text-gray-600">{t.mainDish}: {orderToDelete.lunch}</p>}
                {orderToDelete.side && <p className="text-sm text-gray-600">{t.side}: {orderToDelete.side}</p>}
                {orderToDelete.mainCourse && <p className="text-sm text-gray-600">{t.completeDishLabel}: {orderToDelete.mainCourse}</p>}
                <p className="text-xs text-blue-600 mt-2">{formatDate(orderToDelete.lunchDate)}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => deleteOrder(orderToDelete.id)}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
                >
                  {t.yesDelete}
                </button>
                <button
                  onClick={() => setOrderToDelete(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-400 transition-colors"
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                  <ChefHat className="text-orange-500" size={40} />
                  {t.title}
                </h1>
                <p className="text-gray-600">{t.subtitle}</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setLanguage(language === 'en' ? 'it' : 'en')}
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 hover:border-orange-400 rounded-xl transition-all font-semibold shadow-sm hover:shadow-md"
                >
                  {language === 'en' ? (
                    <>
                      <svg className="w-8 h-6" viewBox="0 0 32 24" xmlns="http://www.w3.org/2000/svg">
                        <rect width="32" height="8" fill="#009246"/>
                        <rect y="8" width="32" height="8" fill="#FFFFFF"/>
                        <rect y="16" width="32" height="8" fill="#CE2B37"/>
                      </svg>
                      <span>Italiano</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-8 h-6" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
                        <clipPath id="s">
                          <path d="M0,0 v30 h60 v-30 z"/>
                        </clipPath>
                        <clipPath id="t">
                          <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>
                        </clipPath>
                        <g clip-path="url(#s)">
                          <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
                          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/>
                          <path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#t)" stroke="#C8102E" stroke-width="4"/>
                          <path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/>
                          <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/>
                        </g>
                      </svg>
                      <span>English</span>
                    </>
                  )}
                </button>
                <div className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4 rounded-2xl text-white shadow-lg">
                  <Users size={28} />
                  <div>
                    <div className="text-3xl font-bold">{filteredOrders.length}</div>
                    <div className="text-xs opacity-90">{t.totalOrders}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <button
                onClick={() => {
                  if (isAdminMode) {
                    handleAdminLogout();
                  } else {
                    setShowAdminLogin(true);
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
                  isAdminMode 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {isAdminMode ? <Unlock size={20} /> : <Lock size={20} />}
                {isAdminMode ? t.adminModeActive + ' - ' + t.logout : t.adminMode}
              </button>

              {isAdminMode && (
                <div className="mt-4 bg-blue-50 p-4 rounded-xl">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar size={18} />
                    {t.setLunchDate}
                  </label>
                  <input
                    type="date"
                    value={currentLunchDate}
                    onChange={(e) => setCurrentLunchDate(e.target.value)}
                    className="w-full md:w-auto px-4 py-3 border-2 border-blue-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg font-semibold"
                  />
                  <div className="mt-2 text-sm text-gray-600">
                    {t.currentLunchDate} <strong>{formatDate(currentLunchDate)}</strong>
                  </div>
                </div>
              )}
            </div>

            {!isAdminMode && (
              <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-green-800">
                    <Calendar size={20} />
                    <div>
                      <div className="text-sm font-semibold">{t.orderingFor}</div>
                      <div className="text-lg font-bold">{formatDate(currentLunchDate)}</div>
                    </div>
                  </div>
                  {orders.some(o => o.lunchDate === currentLunchDate) && (
                    <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2">
                      ✓ {t.alreadyOrdered}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {allDates.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">{t.filterByDate}</label>
            <select
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-lg"
            >
              <option value="all">{t.allDates} ({orders.length} {t.orders})</option>
              {allDates.map(date => (
                <option key={date} value={date}>
                  {formatDate(date)} ({orders.filter(o => o.lunchDate === date).length} {t.orders})
                </option>
              ))}
            </select>
          </div>
        )}

        {!showOrderForm && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={startNewOrder}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-lg font-semibold"
            >
              <ShoppingCart size={24} />
              {t.newOrder}
            </button>
            <button
              onClick={() => setShowStats(!showStats)}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-lg font-semibold"
            >
              <BarChart3 size={24} />
              {showStats ? t.hideStats : t.showStats}
            </button>
          </div>
        )}

        {!showOrderForm && orders.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={exportToCSV}
              className="flex items-center justify-center gap-3 bg-purple-500 text-white px-6 py-4 rounded-xl shadow-md hover:shadow-lg transition-all font-semibold"
            >
              <Download size={20} />
              {t.exportCSV}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Button clicked! Current showPrintView:', showPrintView);
                setShowPrintView(true);
                console.log('setShowPrintView(true) called');
              }}
              className="flex items-center justify-center gap-3 bg-indigo-500 text-white px-6 py-4 rounded-xl shadow-md hover:shadow-lg hover:bg-indigo-600 transition-all font-semibold cursor-pointer"
            >
              🖨️ {t.printRestaurant}
            </button>
            {isAdminMode && selectedDateFilter !== 'all' && (
              <button
                onClick={() => clearOrdersForDate(selectedDateFilter)}
                className="flex items-center justify-center gap-3 bg-orange-500 text-white px-6 py-4 rounded-xl shadow-md hover:shadow-lg transition-all font-semibold"
              >
                <Trash2 size={20} />
                {t.deleteThisDate}
              </button>
            )}
            {isAdminMode && (
              <button
                onClick={clearAllOrders}
                className="flex items-center justify-center gap-3 bg-red-500 text-white px-6 py-4 rounded-xl shadow-md hover:shadow-lg transition-all font-semibold"
              >
                <Trash2 size={20} />
                {t.deleteAllOrders}
              </button>
            )}
          </div>
        )}

        {showOrderForm && (
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 mb-6">
            <div className="bg-green-100 p-4 rounded-xl mb-6 border-2 border-green-300">
              <div className="flex items-center gap-2 text-green-800">
                <Calendar size={20} />
                <div>
                  <div className="text-sm font-semibold">{t.youAreOrdering}</div>
                  <div className="text-xl font-bold">{formatDate(currentLunchDate)}</div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {editingOrder ? t.editOrder : t.createOrder}
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t.yourName} *
                </label>
                <input
                  type="text"
                  value={currentOrder.name}
                  onChange={(e) => setCurrentOrder({...currentOrder, name: e.target.value})}
                  placeholder={t.enterName}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  {t.orderType} *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentOrder({...currentOrder, orderType: 'lunch', mainCourse: ''})}
                    className={`p-6 rounded-xl border-3 transition-all ${
                      currentOrder.orderType === 'lunch'
                        ? 'border-orange-500 bg-orange-50 shadow-lg'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="text-4xl mb-2">🍴</div>
                    <div className="font-bold text-lg">{t.mainAndSide}</div>
                    <div className="text-sm text-gray-600 mt-1">{t.mainAndSideDesc}</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentOrder({...currentOrder, orderType: 'main', lunch: '', side: ''})}
                    className={`p-6 rounded-xl border-3 transition-all ${
                      currentOrder.orderType === 'main'
                        ? 'border-orange-500 bg-orange-50 shadow-lg'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="text-4xl mb-2">🍽️</div>
                    <div className="font-bold text-lg">{t.completeDish}</div>
                    <div className="text-sm text-gray-600 mt-1">{t.completeDishDesc}</div>
                  </button>
                </div>
              </div>

              {currentOrder.orderType === 'lunch' && (
                <div className="space-y-6 bg-orange-50 p-6 rounded-2xl">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      {t.chooseMain}
                    </label>
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => setCurrentOrder({...currentOrder, lunch: ''})}
                        className={`w-full text-left p-4 rounded-xl transition-all ${
                          currentOrder.lunch === ''
                            ? 'bg-gray-300 text-gray-700 shadow-lg'
                            : 'bg-white hover:bg-gray-100'
                        }`}
                      >
                        {t.noMainDish}
                      </button>
                      {getCurrentLunchMenu().map((dish, index) => (
                        <button
                          key={dish}
                          type="button"
                          onClick={() => setCurrentOrder({...currentOrder, lunch: lunchMenu[index]})}
                          className={`w-full text-left p-4 rounded-xl transition-all ${
                            currentOrder.lunch === lunchMenu[index]
                              ? 'bg-orange-500 text-white shadow-lg'
                              : 'bg-white hover:bg-orange-100'
                          }`}
                        >
                          {dish}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      {t.chooseSide}
                    </label>
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => setCurrentOrder({...currentOrder, side: ''})}
                        className={`w-full text-left p-4 rounded-xl transition-all ${
                          currentOrder.side === ''
                            ? 'bg-gray-300 text-gray-700 shadow-lg'
                            : 'bg-white hover:bg-gray-100'
                        }`}
                      >
                        {t.noSide}
                      </button>
                      {getCurrentSidesMenu().map((side, index) => (
                        <button
                          key={side}
                          type="button"
                          onClick={() => setCurrentOrder({...currentOrder, side: sidesMenu[index]})}
                          className={`w-full text-left p-4 rounded-xl transition-all ${
                            currentOrder.side === sidesMenu[index]
                              ? 'bg-green-500 text-white shadow-lg'
                              : 'bg-white hover:bg-green-100'
                          }`}
                        >
                          {side}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentOrder.orderType === 'main' && (
                <div className="bg-blue-50 p-6 rounded-2xl">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t.chooseComplete} *
                  </label>
                  <div className="space-y-2">
                    {getCurrentMainCoursesMenu().map((dish, index) => (
                      <button
                        key={dish}
                        type="button"
                        onClick={() => setCurrentOrder({...currentOrder, mainCourse: mainCoursesMenu[index]})}
                        className={`w-full text-left p-4 rounded-xl transition-all ${
                          currentOrder.mainCourse === mainCoursesMenu[index]
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'bg-white hover:bg-blue-100'
                        }`}
                      >
                        {dish}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t.specialNotes}
                </label>
                <textarea
                  value={currentOrder.notes}
                  onChange={(e) => setCurrentOrder({...currentOrder, notes: e.target.value})}
                  placeholder={t.notesPlaceholder}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                  rows="3"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSubmitOrder}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all"
                >
                  {editingOrder ? '✓ ' + t.updateOrder : t.confirmOrder}
                </button>
                <button
                  onClick={() => {
                    setShowOrderForm(false);
                    setEditingOrder(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-400 transition-all"
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          </div>
        )}

        {showStats && !showOrderForm && (
          <div className="space-y-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{t.mainDishes}</h3>
                <div className="space-y-2">
                  {Object.entries(statistics.lunchCount).length === 0 ? (
                    <p className="text-gray-400 text-sm">{t.noOrders}</p>
                  ) : (
                    Object.entries(statistics.lunchCount).map(([dish, count]) => (
                      <div key={dish} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 truncate flex-1">{dish}</span>
                        <span className="ml-2 bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-bold">{count}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{t.sides}</h3>
                <div className="space-y-2">
                  {Object.entries(statistics.sideCount).length === 0 ? (
                    <p className="text-gray-400 text-sm">{t.noOrders}</p>
                  ) : (
                    Object.entries(statistics.sideCount).map(([dish, count]) => (
                      <div key={dish} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 truncate flex-1">{dish}</span>
                        <span className="ml-2 bg-green-100 text-green-600 px-3 py-1 rounded-full font-bold">{count}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{t.completeDishes}</h3>
                <div className="space-y-2">
                  {Object.entries(statistics.mainCount).length === 0 ? (
                    <p className="text-gray-400 text-sm">{t.noOrders}</p>
                  ) : (
                    Object.entries(statistics.mainCount).map(([dish, count]) => (
                      <div key={dish} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 truncate flex-1">{dish}</span>
                        <span className="ml-2 bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-bold">{count}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Sezione Note Speciali per il Ristorante */}
            {statistics.notesData.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  📝 {t.specialNotesRestaurant}
                </h3>
                <div className="space-y-3">
                  {statistics.notesData.map((item, index) => {
                    const hasAllergyOrRestriction = 
                      item.notes.toLowerCase().includes('allerg') ||
                      item.notes.toLowerCase().includes('no ') ||
                      item.notes.toLowerCase().includes('senza') ||
                      item.notes.toLowerCase().includes('without');
                    
                    const englishTranslation = translateNoteToEnglish(item.notes);
                    
                    return (
                      <div 
                        key={index} 
                        className={`border-l-4 p-4 rounded-r-xl ${
                          hasAllergyOrRestriction 
                            ? 'bg-red-50 border-red-500' 
                            : 'bg-amber-50 border-amber-400'
                        }`}
                      >
                        <div className="font-semibold text-gray-800 mb-1">
                          {item.dish}
                          {item.side && <span className="text-sm text-gray-600"> + {item.side}</span>}
                        </div>
                        <div className={`text-sm ${
                          hasAllergyOrRestriction ? 'text-red-800 font-semibold' : 'text-amber-800'
                        }`}>
                          <div className="italic">
                            {t.note} {item.notes}
                          </div>
                          {englishTranslation && englishTranslation.toLowerCase() !== item.notes.toLowerCase() && (
                            <div className="mt-2 font-semibold text-blue-800 bg-blue-100 px-3 py-2 rounded-lg border-l-4 border-blue-500">
                              🇬🇧 English: {englishTranslation}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {!showOrderForm && filteredOrders.length > 0 && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4">
              <h2 className="text-2xl font-bold text-white">{t.receivedOrders}</h2>
              {selectedDateFilter !== 'all' && (
                <p className="text-white text-sm opacity-90 mt-1">
                  {t.showingOrdersFor} {formatDate(selectedDateFilter)}
                </p>
              )}
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {filteredOrders.map((order, index) => {
                  const hasImportantNotes = order.notes && (
                    order.notes.toLowerCase().includes('allerg') ||
                    order.notes.toLowerCase().includes('no ') ||
                    order.notes.toLowerCase().includes('without')
                  );
                  
                  const dayColors = getWeekdayColor(order.lunchDate);
                  
                  return (
                    <div 
                      key={order.id} 
                      className={`rounded-2xl p-6 shadow-md hover:shadow-lg transition-all ${
                        hasImportantNotes 
                          ? 'bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300' 
                          : 'bg-gradient-to-r from-orange-50 to-amber-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                            hasImportantNotes ? 'bg-red-500' : 'bg-orange-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-bold text-xl text-gray-800">{order.name}</div>
                            <div className={`text-xs font-bold mt-1 px-3 py-1 rounded-full inline-block ${dayColors.bg} ${dayColors.text}`}>
                              {formatDate(order.lunchDate)}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              startEditOrder(order);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                            title={t.edit}
                          >
                            ✏️
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              confirmDelete(order);
                            }}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                            title={t.delete}
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {order.lunch && (
                          <div className="bg-white rounded-lg p-3">
                            <div className="text-xs text-gray-500 font-semibold mb-1">{t.mainDish}</div>
                            <div className="text-gray-800">{order.lunch}</div>
                          </div>
                        )}
                        {order.side && (
                          <div className="bg-white rounded-lg p-3">
                            <div className="text-xs text-gray-500 font-semibold mb-1">{t.side}</div>
                            <div className="text-gray-800">{order.side}</div>
                          </div>
                        )}
                        {order.mainCourse && (
                          <div className="bg-white rounded-lg p-3">
                            <div className="text-xs text-gray-500 font-semibold mb-1">{t.completeDishLabel}</div>
                            <div className="text-gray-800">{order.mainCourse}</div>
                          </div>
                        )}
                        {order.notes && (
                          <div className={`rounded-lg p-3 ${
                            hasImportantNotes ? 'bg-red-100 border-2 border-red-400' : 'bg-amber-100'
                          }`}>
                            <div className={`text-xs font-semibold mb-1 ${
                              hasImportantNotes ? 'text-red-700' : 'text-amber-700'
                            }`}>
                              {hasImportantNotes ? '⚠️ ' + t.importantNotes : t.notes}
                            </div>
                            <div className={hasImportantNotes ? 'text-red-800 font-semibold' : 'text-amber-800'}>
                              {order.notes}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {!showOrderForm && filteredOrders.length === 0 && (
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{t.noOrdersYet}</h3>
            <p className="text-gray-600 mb-6">{t.clickNewOrder}</p>
          </div>
        )}
      </div>
      )}
    </div>
  );
};

export default LunchOrderApp;
