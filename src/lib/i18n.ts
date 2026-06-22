// src/lib/i18n.ts

export type SupportedLanguage = 'en-us' | 'de-de' | 'fr-fr';

export const translations = {
  'en-us': {
    nav: {
      directory: 'Directory',
      search: 'Search',
      compare: 'Compare Sizing',
      compliance: 'Compliance Guide',
      browseDir: 'Browse Directory',
      searchPortal: 'Search Portal',
      admin: 'Admin Console'
    },
    footer: {
      copyright: '© 2026 EcoRebates. All rights reserved.',
      directory: 'Directory',
      search: 'Search',
      compare: 'Compare',
      compliance: 'Compliance',
      admin: 'Admin',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service'
    },
    common: {
      back: 'Back to Directory',
      calculate: 'Calculate ROI',
      loading: 'Loading...'
    },
    search: {
      title: 'Alternative Energy Policy Search',
      subtitle: 'Query all regional utility grants, DSIRE active policy rules, and federal tax credits globally.',
      placeholder: 'Search by city, state, utility agency, or rebate program name...',
      noResults: 'No active rebate programs found',
      noResultsDesc: 'Try refining your keyword query or expanding the technology filters.',
      loadingMsg: 'Searching policies & databases...',
      categoryLabel: 'Category:',
      countryLabel: 'Country:',
      allCountries: 'All Countries',
      allCategories: 'All'
    },
    compare: {
      title: 'Compare Sizing & Policy ROI',
      subtitle: 'Compare alternative energy utility rates, solar resource coefficients, and rebate payback timelines side by side.'
    },
    compliance: {
      title: 'Global Compliance & Grid Interconnection Guide',
      subtitle: 'Analyze grid interconnection codes, net-metering thresholds, and battery permit regulations across international territories.',
      faqTitle: 'Frequently Asked Questions (Clean Energy Policy)',
      faqItems: [
        {
          q: 'How do I claim the 30% Federal Clean Energy Credit?',
          a: 'You claim it by filing IRS Form 5695 (Residential Energy Credits) along with your annual tax return (Form 1040). You will calculate 30% of your total solar, battery, or heat pump project costs and apply it to reduce your federal income taxes.'
        },
        {
          q: 'Is the 30% solar tax credit refundable?',
          a: 'No, it is a non-refundable tax credit, meaning it cannot reduce your tax liability below zero to give you a cash refund check. However, any unused credits can be carried forward to next year’s taxes, and this roll-over can continue indefinitely.'
        },
        {
          q: 'Does the clean energy credit apply to battery storage systems?',
          a: 'Yes! Under Section 25D, battery storage systems with a capacity of 3 kWh or larger qualify for the 30% federal tax credit, regardless of whether they are charged by solar panels or directly from the power grid.'
        },
        {
          q: 'How do local utility rebates affect the federal tax credit?',
          a: 'Utility rebates are generally treated as purchase price reductions. You must subtract the utility rebate amount from your total project cost before calculating the 30% federal tax credit. State tax credits, however, do not reduce your federal tax credit basis.'
        },
        {
          q: 'What installation costs are covered by the tax credit?',
          a: 'Eligible costs include solar PV panels, inverter systems, mounting hardware, storage batteries (3 kWh+), heat pump equipment, electrical panel upgrades required for the installation, and all assembly and labor costs. General roofing repairs do not qualify.'
        }
      ]
    },
    directory: {
      title: 'Browse Alternative Energy Rebates',
      subtitle: 'Select your country to discover regional tax credits, local utility incentives, and solar sizing calculators.',
      hubsIndexed: 'active regional hubs indexed',
      statesTitle: 'States / Regions',
      citiesTitle: 'Cities'
    },
    calculator: {
      monthlyBill: 'Average Monthly Bill',
      roofArea: 'Usable Roof Area',
      batteryCapacity: 'Battery Capacity',
      batteryOption: 'Include Battery Storage',
      paybackPeriod: 'Estimated Payback Period',
      annualGeneration: 'Annual Solar Generation',
      carbonOffset: 'Annual Carbon Offset',
      netCost: 'Net System Cost',
      financingModel: 'Financing Model',
      purchase: 'Direct Purchase',
      lease: 'Solar Lease',
      ppa: 'Power Purchase Agreement (PPA)',
      ppaRate: 'PPA Energy Rate',
      monthlyLease: 'Monthly Lease Cost',
      firstYearRoi: 'First Year ROI',
      years: 'years',
      tons: 'tons CO2/yr',
      loading: 'Calculating localized sizing curves...',
      federalIncentive: 'Federal Tax Credit',
      stateRebate: 'State Solar Rebate',
      utilityRebate: 'Local Utility Rebate',
      equivalentForest: 'Forest acres saved',
      equivalentCoal: 'Tons of coal unburned',
      equivalentCars: 'Cars taken off the road',
      gridRate: 'Grid Rate',
      sunHours: 'Peak Sun Hours',
      gridEmissions: 'Grid Emissions',
      costPerWatt: 'Cost per Watt',
      activeRebatesTitle: 'Active Local Rebates Applied',
      localAveragesTitle: 'Local Energy Resource Profiles',
      roiTitle: 'Sizing & ROI Projection Analysis',
      simulationTitle: 'Interactive Sizing Flow Simulation'
    },
    admin: {
      title: 'Admin Dashboard',
      loginTitle: 'Administrator Authentication',
      username: 'Email Address',
      password: 'Password',
      loginBtn: 'Sign In',
      logoutBtn: 'Sign Out',
      liveMode: 'Live Supabase DB Mode',
      mockMode: 'Offline Mock Sandbox Mode',
      addCityTitle: 'Add New Regional Hub',
      countryCode: 'Country Code (e.g. us, uk, de)',
      stateProvince: 'State / Province',
      city: 'City Name',
      postalCode: 'Postal Code / ZIP',
      gridRate: 'Grid Rate ($/kWh)',
      sunHours: 'Annual Sun Hours (hours)',
      gridEmissions: 'Emissions (kg CO2/kWh)',
      costPerWatt: 'Install Cost ($/W)',
      addCityBtn: 'Add Region',
      manageRebatesTitle: 'Manage Active Rebate Specifications',
      authorityName: 'Authority / Program Name',
      techCategory: 'Technology Category',
      incentiveValue: 'Incentive Value',
      incentiveType: 'Incentive Type',
      maxLimit: 'Max Limit (Optional)',
      isActive: 'Active',
      actions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      createRebateBtn: 'Create New Rebate',
      save: 'Save',
      cancel: 'Cancel',
      region: 'Region / City',
      successAddCity: 'City successfully registered!',
      successAddRebate: 'Rebate program successfully registered!',
      successDelete: 'Record deleted successfully!',
      loginError: 'Invalid credentials. Try admin@ecorebates.org / admin123'
    }
  },
  'de-de': {
    nav: {
      directory: 'Verzeichnis',
      search: 'Suche',
      compare: 'Größenvergleich',
      compliance: 'Richtlinien',
      browseDir: 'Verzeichnis Durchsuchen',
      searchPortal: 'Suchportal',
      admin: 'Admin-Konsole'
    },
    footer: {
      copyright: '© 2026 EcoRebates. Alle Rechte vorbehalten.',
      directory: 'Verzeichnis',
      search: 'Suche',
      compare: 'Vergleich',
      compliance: 'Richtlinien',
      admin: 'Admin',
      privacy: 'Datenschutzerklärung',
      terms: 'Nutzungsbedingungen'
    },
    common: {
      back: 'Zurück zum Verzeichnis',
      calculate: 'ROI Berechnen',
      loading: 'Wird geladen...'
    },
    search: {
      title: 'Suche nach umweltfreundlichen Richtlinien',
      subtitle: 'Fragen Sie alle regionalen Versorgungszuschüsse, aktiven DSIRE-Richtlinien und bundesstaatlichen Steuergutschriften weltweit ab.',
      placeholder: 'Suchen Sie nach Stadt, Bundesland, Energieversorger oder Rabattprogramm...',
      noResults: 'Keine aktiven Rabattprogramme gefunden',
      noResultsDesc: 'Versuchen Sie, Ihre Stichwortsuche zu verfeinern oder die Technologiefilter zu erweitern.',
      loadingMsg: 'Richtlinien und Datenbanken werden durchsucht...',
      categoryLabel: 'Kategorie:',
      countryLabel: 'Land:',
      allCountries: 'Alle Länder',
      allCategories: 'Alle'
    },
    compare: {
      title: 'Größen- und ROI-Vergleich',
      subtitle: 'Vergleichen Sie alternative Stromtarife, Solarressourcen-Koeffizienten und Rabatt-Amortisationszeiten nebeneinander.'
    },
    compliance: {
      title: 'Globaler Leitfaden für Netzkopplung & Compliance',
      subtitle: 'Analysieren Sie Netzeinspeisungscodes, Net-Metering-Schwellenwerte und Batterie-Genehmigungsvorschriften in internationalen Gebieten.',
      faqTitle: 'Häufig gestellte Fragen (Richtlinien für saubere Energie)',
      faqItems: [
        {
          q: 'Wie beantrage ich die Bundessteuergutschrift von 30 %?',
          a: 'Sie beantragen dies durch Ausfüllen des IRS-Formulars 5695 (Residential Energy Credits) zusammen mit Ihrer jährlichen Einkommensteuererklärung (Formular 1040). Sie berechnen 30 % der gesamten Solar-, Batterie- oder Wärmepumpenprojektkosten und mindern damit Ihre Steuerschuld.'
        },
        {
          q: 'Ist die Solarsteuergutschrift erstattungsfähig?',
          a: 'Nein, es handelt sich um eine nicht erstattungsfähige Steuergutschrift. Das bedeutet, sie kann Ihre Steuerschuld nicht unter Null senken, um Ihnen eine Barauszahlung zu bescheren. Ungenutzte Guthaben können jedoch unbegrenzt auf die folgenden Steuerjahre übertragen werden.'
        },
        {
          q: 'Gilt die saubere Energie-Steuergutschrift auch für Batteriespeicher?',
          a: 'Ja! Gemäß Section 25D qualifizieren sich Batteriespeichersysteme mit einer Kapazität von 3 kWh oder mehr für die 30%ige Bundessteuergutschrift, unabhängig davon, ob sie durch Solarmodule oder direkt aus dem Stromnetz geladen werden.'
        },
        {
          q: 'Wie wirken sich Rabatte von Versorgungsunternehmen auf die Steuergutschrift aus?',
          a: 'Rabatte von Energieversorgern werden in der Regel als Minderung des Kaufpreises behandelt. Sie müssen den Rabattbetrag von Ihren Gesamtprojektkosten abziehen, bevor Sie die 30%ige Bundessteuergutschrift berechnen. Landessteuergutschriften mindern diese Basis nicht.'
        },
        {
          q: 'Welche Installationskosten werden von der Steuergutschrift abgedeckt?',
          a: 'Förderfähig sind PV-Module, Wechselrichter, Halterungen, Speicherbatterien (ab 3 kWh), Wärmepumpen, erforderliche Modernisierungen der Hauselektrik für die Installation sowie alle Montage- und Arbeitskosten. Reine Dachsanierungen sind ausgeschlossen.'
        }
      ]
    },
    directory: {
      title: 'Alternative Energierabatte Durchsuchen',
      subtitle: 'Wählen Sie Ihr Land aus, um regionale Steuergutschriften, lokale Versorgungsanreize und Solar-Kalkulatoren zu entdecken.',
      hubsIndexed: 'aktive regionale Zentren indiziert',
      statesTitle: 'Staaten / Regionen',
      citiesTitle: 'Städte'
    },
    calculator: {
      monthlyBill: 'Durchschnittliche monatliche Stromrechnung',
      roofArea: 'Nutzbare Dachfläche',
      batteryCapacity: 'Batteriekapazität',
      batteryOption: 'Batteriespeicher einbeziehen',
      paybackPeriod: 'Geschätzte Amortisationszeit',
      annualGeneration: 'Jährliche Solarstromerzeugung',
      carbonOffset: 'Jährliche CO2-Einsparung',
      netCost: 'Netto-Systemkosten',
      financingModel: 'Finanzierungsmodell',
      purchase: 'Direktkauf',
      lease: 'Solar-Leasing',
      ppa: 'Stromabnahmevertrag (PPA)',
      ppaRate: 'PPA-Stromtarif',
      monthlyLease: 'Monatliche Leasinggebühr',
      firstYearRoi: 'ROI im ersten Jahr',
      years: 'Jahre',
      tons: 'Tonnen CO2/Jahr',
      loading: 'Lokalisierte Größenkurven werden berechnet...',
      federalIncentive: 'Bundessteuergutschrift',
      stateRebate: 'Landes-Solarförderung',
      utilityRebate: 'Lokaler Versorgerzuschuss',
      equivalentForest: 'Waldfläche gerettet (Morgen)',
      equivalentCoal: 'Tonnen unverbrannte Kohle',
      equivalentCars: 'Autos stillgelegt',
      gridRate: 'Netztarif',
      sunHours: 'Spitzensonnenstunden',
      gridEmissions: 'Netzemissionen',
      costPerWatt: 'Kosten pro Watt',
      activeRebatesTitle: 'Aktive angewendete lokale Rabatte',
      localAveragesTitle: 'Lokale Energieressourcen-Profile',
      roiTitle: 'Größen- & ROI-Projektionsanalyse',
      simulationTitle: 'Interaktive Größenfluss-Simulation'
    },
    admin: {
      title: 'Admin-Dashboard',
      loginTitle: 'Administrator-Authentifizierung',
      username: 'E-Mail-Adresse',
      password: 'Passwort',
      loginBtn: 'Einloggen',
      logoutBtn: 'Ausloggen',
      liveMode: 'Live Supabase DB-Modus',
      mockMode: 'Offline-Mock-Sandbox-Modus',
      addCityTitle: 'Neues regionales Zentrum hinzufügen',
      countryCode: 'Ländercode (z. B. us, uk, de)',
      stateProvince: 'Bundesland / Region',
      city: 'Stadtname',
      postalCode: 'Postleitzahl (PLZ)',
      gridRate: 'Netztarif ($/kWh)',
      sunHours: 'Jährliche Sonnenstunden (Std)',
      gridEmissions: 'Emissionen (kg CO2/kWh)',
      costPerWatt: 'Installationskosten ($/W)',
      addCityBtn: 'Region hinzufügen',
      manageRebatesTitle: 'Aktive Rabattspezifikationen verwalten',
      authorityName: 'Behörde / Programmname',
      techCategory: 'Technologiekategorie',
      incentiveValue: 'Förderwert',
      incentiveType: 'Förderungsart',
      maxLimit: 'Max. Grenze (optional)',
      isActive: 'Aktiv',
      actions: 'Aktionen',
      edit: 'Bearbeiten',
      delete: 'Löschen',
      createRebateBtn: 'Neuen Rabatt erstellen',
      save: 'Speichern',
      cancel: 'Abbrechen',
      region: 'Region / Stadt',
      successAddCity: 'Stadt erfolgreich registriert!',
      successAddRebate: 'Rabattprogramm erfolgreich registriert!',
      successDelete: 'Datensatz erfolgreich gelöscht!',
      loginError: 'Ungültige Anmeldedaten. Versuchen Sie admin@ecorebates.org / admin123'
    }
  },
  'fr-fr': {
    nav: {
      directory: 'Annuaire',
      search: 'Recherche',
      compare: 'Comparer ROI',
      compliance: 'Conformité',
      browseDir: 'Parcourir l\'annuaire',
      searchPortal: 'Portail de recherche',
      admin: 'Console Admin'
    },
    footer: {
      copyright: '© 2026 EcoRebates. Tous droits réservés.',
      directory: 'Annuaire',
      search: 'Recherche',
      compare: 'Comparer',
      compliance: 'Conformité',
      admin: 'Admin',
      privacy: 'Politique de confidentialité',
      terms: 'Conditions d\'utilisation'
    },
    common: {
      back: 'Retour à l\'annuaire',
      calculate: 'Calculer le ROI',
      loading: 'Chargement en cours...'
    },
    search: {
      title: 'Recherche de politiques d\'énergie verte',
      subtitle: 'Interrogez les subventions locales, les règles de politique active DSIRE et les crédits d\'impôt fédéraux à l\'échelle mondiale.',
      placeholder: 'Rechercher par ville, État, agence de services publics ou nom de programme...',
      noResults: 'Aucun programme de rabais actif trouvé',
      noResultsDesc: 'Essayez de reformuler votre mot-clé ou d\'élargir les filtres technologiques.',
      loadingMsg: 'Recherche dans les politiques et bases de données...',
      categoryLabel: 'Catégorie:',
      countryLabel: 'Pays:',
      allCountries: 'Tous les pays',
      allCategories: 'Tous'
    },
    compare: {
      title: 'Comparer les dimensions et le ROI des politiques',
      subtitle: 'Comparez côte à côte les tarifs des services publics d\'énergie alternative, les coefficients de ressources solaires et les délais d\'amortissement.'
    },
    compliance: {
      title: 'Guide de conformité mondiale et d\'interconnexion au réseau',
      subtitle: 'Analysez les codes d\'interconnexion au réseau, les seuils de facturation nette et les réglementations sur les permis de batterie dans les territoires internationaux.',
      faqTitle: 'Foire Aux Questions (Politique d\'énergie propre)',
      faqItems: [
        {
          q: 'Comment réclamer le crédit d\'impôt fédéral de 30 % ?',
          a: 'Vous le réclamez en remplissant le formulaire IRS 5695 (Residential Energy Credits) et en le joignant à votre déclaration de revenus annuelle (formulaire 1040). Vous calculerez 30 % des coûts totaux de votre projet solaire, batterie ou pompe à chaleur.'
        },
        {
          q: 'Le crédit d\'impôt solaire de 30 % est-il remboursable ?',
          a: 'Non, c\'est un crédit d\'impôt non remboursable, ce qui signifie qu\'il ne peut pas réduire votre impôt en dessous de zéro pour vous donner un chèque. Cependant, tout crédit inutilisé peut être reporté indéfiniment sur les années fiscales suivantes.'
        },
        {
          q: 'Le crédit d\'impôt s\'applique-t-il aux systèmes de stockage par batterie ?',
          a: 'Oui ! En vertu de la section 25D, les systèmes de stockage par batterie d\'une capacité de 3 kWh ou plus sont éligibles au crédit d\'impôt de 30 %, qu\'ils soient chargés par des panneaux solaires ou directement depuis le réseau électrique.'
        },
        {
          q: 'Comment les subventions locales affectent-elles le crédit d\'impôt fédéral ?',
          a: 'Les rabais des services publics sont traités comme des réductions de prix. Vous devez soustraire ce montant du coût total de votre projet avant de calculer le crédit d\'impôt fédéral de 30 %. Les crédits d\'impôt locaux de l\'État ne réduisent pas cette base.'
        },
        {
          q: 'Quels coûts d\'installation sont couverts par le crédit d\'impôt ?',
          a: 'Les coûts éligibles incluent les panneaux solaires, onduleurs, matériel de montage, batteries de stockage (3 kWh+), pompes à chaleur, mises à niveau électriques requises pour l\'installation, et toute la main-d\'œuvre. Les réparations de toiture ordinaires ne sont pas éligibles.'
        }
      ]
    },
    directory: {
      title: 'Parcourir les rabais d\'énergie alternative',
      subtitle: 'Sélectionnez votre pays pour découvrir les crédits d\'impôt régionaux, les incitations locales et les simulateurs solaires.',
      hubsIndexed: 'centres régionaux actifs indexés',
      statesTitle: 'États / Régions',
      citiesTitle: 'Villes'
    },
    calculator: {
      monthlyBill: 'Facture d\'électricité mensuelle moyenne',
      roofArea: 'Surface de toit utilisable',
      batteryCapacity: 'Capacité de la batterie',
      batteryOption: 'Inclure le stockage sur batterie',
      paybackPeriod: 'Période d\'amortissement estimée',
      annualGeneration: 'Production solaire annuelle',
      carbonOffset: 'Émissions de CO2 évitées par an',
      netCost: 'Coût net du système',
      financingModel: 'Modèle de financement',
      purchase: 'Achat direct',
      lease: 'Location solaire',
      ppa: 'Contrat d\'achat d\'électricité (PPA)',
      ppaRate: 'Tarif de l\'électricité PPA',
      monthlyLease: 'Coût mensuel de location',
      firstYearRoi: 'ROI la première année',
      years: 'ans',
      tons: 'tonnes de CO2/an',
      loading: 'Calcul des courbes de dimensionnement...',
      federalIncentive: 'Crédit d\'impôt fédéral',
      stateRebate: 'Subvention solaire de l\'État',
      utilityRebate: 'Aide des services publics locaux',
      equivalentForest: 'Acres de forêt préservées',
      equivalentCoal: 'Tonnes de charbon non brûlées',
      equivalentCars: 'Voitures retirées de la circulation',
      gridRate: 'Tarif du réseau',
      sunHours: 'Heures de pointe de soleil',
      gridEmissions: 'Émissions du réseau',
      costPerWatt: 'Coût par watt',
      activeRebatesTitle: 'Subventions locales actives appliquées',
      localAveragesTitle: 'Profils des ressources énergétiques locales',
      roiTitle: 'Analyse des projections de dimensionnement & ROI',
      simulationTitle: 'Simulation interactive des flux de dimensionnement'
    },
    admin: {
      title: 'Tableau de bord administrateur',
      loginTitle: 'Authentification de l\'administrateur',
      username: 'Adresse e-mail',
      password: 'Mot de passe',
      loginBtn: 'Se connecter',
      logoutBtn: 'Se déconnecter',
      liveMode: 'Mode Live Supabase DB',
      mockMode: 'Mode Sandbox Mock hors ligne',
      addCityTitle: 'Ajouter un nouveau centre régional',
      countryCode: 'Code pays (ex. us, uk, de)',
      stateProvince: 'État / Province',
      city: 'Nom de la ville',
      postalCode: 'Code postal',
      gridRate: 'Tarif réseau ($/kWh)',
      sunHours: 'Heures d\'ensoleillement annuelles (heures)',
      gridEmissions: 'Émissions (kg CO2/kWh)',
      costPerWatt: 'Coût d\'installation ($/W)',
      addCityBtn: 'Ajouter la région',
      manageRebatesTitle: 'Gérer les spécifications des rabais actifs',
      authorityName: 'Autorité / Nom du programme',
      techCategory: 'Catégorie de technologie',
      incentiveValue: 'Valeur de l\'incitation',
      incentiveType: 'Type d\'incitation',
      maxLimit: 'Limite maximale (Optionnel)',
      isActive: 'Actif',
      actions: 'Actions',
      edit: 'Modifier',
      delete: 'Supprimer',
      createRebateBtn: 'Créer un nouveau rabattement',
      save: 'Enregistrer',
      cancel: 'Annuler',
      region: 'Région / Ville',
      successAddCity: 'Ville enregistrée avec succès !',
      successAddRebate: 'Programme de rabais enregistré avec succès !',
      successDelete: 'Enregistrement supprimé avec succès !',
      loginError: 'Identifiants invalides. Essayez admin@ecorebates.org / admin123'
    }
  }
} as const;

export function useTranslations(lang: string) {
  const currentLang = (lang && lang.toLowerCase() in translations) ? (lang.toLowerCase() as SupportedLanguage) : 'en-us';
  return translations[currentLang];
}
