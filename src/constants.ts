export const sequenceDossierOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

export const agenceOptions = Array.from({ length: 100 }, (_, i) => `AG${(i + 1).toString().padStart(3, '0')}`);

export const natureCreditOptions = [
  "CT-Crédit d'exploitation amortissable",
  "CT-Facilité de caisse",
  "CT-Découvert",
  "CT-Crédit campagne",
  "CT-Préfinancement Marché Public",
  "CT-Avance sur Marché Public",
  "CT-Avance sur Marché Public/FINEA",
  "CT-Avance sur Marché nanti",
  "CT-Aval d'effet",
  "CT-Cautions fiscales",
  "CT-Cautions définitives",
  "CT-Cautions provisoires",
  "CT-Cautions restitutions acomptes",
  "CT-Cautions retenue de garantie",
  "CT-Escompte de papier commercial",
  "CT-Crédit immédiat",
  "INV-Investissement Pro",
  "INV-Fonds de commerce PRO",
  "INV-Crédit-bail",
  "EXP-Crédit documentaire import/export",
  "EXP-Avance Sur droit de douane",
  "EXP-Cautions douanières : Obligation cautionnée, admission temporaire, acquit à caution et crédit d'enlèvement",
  "EXP-Avances sur créances nées à l'étranger",
  "EXP-Remise documentaire",
];

export const secteurActiviteCAEOptions = [
  "1-AGRICULTURE.CHASSE.ANNEXE",
  "2-SYLVICULTURE EXPLOIT.FORESTIERE",
  "3-PECHE AQUACULTURE",
  "4-EXTRACTION.HOUILLE.LIGNITE.TOURB",
  "5-EXTRACTION.HYDROCARBURE.SCE.ANX",
  "6-EXTRACTION.MINERAI METALLIQUES",
  "7-AUTRES INDUSTRIES EXTRACTIVES",
  "8-INDUSTRIES ALIMENTAIRES",
  "9-INDUSTRIE DU TABAC",
  "10-INDUSTRE TEXTILE",
  "11-INDUSTRIE.HABILLEMENT.FOURRURES",
  "12-INDUSTRIE.CUIRE.CHAUSSURE",
  "13-INDUSTRIE CHIMIQUE",
  "14-INDUSTRIE.CAOUTCHOU ET PLASTIQUE",
  "15-METALLURGIE",
  "16-TRAVAIL DES METAUX",
  "17-FABRICATION.MACHINE ET EQUIPEMNT",
  "18-FABRICA.MACHIN.MATER.INFORMATION",
  "19-FABRIC.MACHIN.APPAREIL ELECTRIQU",
  "20-FABRIC.EQUIPMT.RADIO.TELECOMM",
  "21-FABRIC.INSTR.MEDICX.OPTIO.HORLOG",
  "22-INDUSTRIE AUTOMOBILES",
  "23-FABRIC.AUTRE.MATERIEL.TRANSPORT",
  "24-TRAVAIL.BOIS.FABRIC.ARTICLE.BOIS",
  "25-INDUSTRIE DU PAPIER ET DU CARTON",
  "26-EDITION IMPRIMERIE REPRODUCTION",
  "27-COKEFAC.RAFFIN.INDUS.NUCLEAIRE",
  "28-FABRIC.PRODUITS MINER.NON METALQ",
  "29-FABRIC.MEUBLES INDUSTRIE DIVERSE",
  "30-RECUPERATION ET RECYCLAGE",
  "31-PRODUCT.DISTRIB.ELEC.GAZ.CHALEUR",
  "32-CAPTAGE TRAITMT DISTRIBUTION.EAU",
  "33-CONSTRUCTION",
  "34-COMMERCE REPARATION AUTOMOBILE",
  "35-COMMERCE.GROS & INTERMED.CCE",
  "36-CCE.DETAIL REPARA.ARTIC.DOMEST",
  "37-HOTELS ET RESTAURANTS",
  "38-TRANSPORTS TERRESTRES",
  "39-TRANSPORTS PAR EAU",
  "40-TRANSPORTS AERIEN",
  "41-SCE AUXILIAIRES DES TRANSPORTS",
  "42-POSTES ET TELECOMMUNICATION",
  "43-INTERMEDIATION FINANCIERE",
  "44-ASSURANCES",
  "45-AUXILIAIRE FINANCIERASSURANCE",
  "47-ACTIVITES IMMOBILIERES",
  "48-LOCATION SANS OPERATEURS",
  "49-ACTIVITES INFORMATIQUES",
  "50-RECHERCHE ET DEVELOPPEMENT",
  "51-SERVICES FOURNIS AUX ENTREPRISES",
  "52-EDUCATION",
  "53-SANTE ET ACTION SOCIALE",
  "54-ASSAINISST VOIRIE GESTION DECHET",
  "56-ACTIV.RECREATIVES CULTURE SPORT",
  "57-SERVICES PERSONNELS",
  "58-SERVICES DOMESTIQUES",
  "59-ACTIVITE EXTRA TERRITORIALES",
  "61-ARTISANAT ART PROFESS.LIBERALE",
  "62-JUSTICE ET CONTENTIEUX"
];

export const activitePrincipaleOptions = [
    "1-AVOCAT, MAGISTRAT AUTRES PROFESSIONS JURIDIQUES",
    "2-MEDECIN, PHARMACIEN & ASSIMILE",
    "4-ARCHITECTE",
    "5-INGENIEUR",
    "9-ASSUREUR",
    "10-ARTISTE, ORGANISATEUR DE SPECTACLES",
    "16-HOTELIER, RESTAURATEUR, VOYAGISTE",
    "17-TRANSITAIRE",
    "20-NOTAIRE",
    "21-ADOUL",
    "22-CONSEILLER FINANCIER",
    "110-AGRICULTEUR",
    "120-PECHEUR, MARIN",
    "130-ARMATEUR",
    "210-EMPLOYE / OUVRIER TOUT SECTEUR",
    "220-CADRE TOUT SECTEUR",
    "230-EMPLOYE / OUVRIER DE COLLECTIVITE LOCALE, D’ENTREPRISE PUBLIQUE OU SEMI PUBLIQUE",
    "240-CADRE DE COLLECTIVITE LOCALE, D’ENTREPRISE PUBLIQUE OU SEMI PUBLIQUE",
    "250-ENSEIGNANT DU PRIVE",
    "260-JOURNALISTE, PROFESSIONS DE L’INFORMATION",
    "300-ARTISAN",
    "400-FONCTIONNAIRE",
    "410-DIRECTEUR, CADRE SUP",
    "430-MILITAIRE",
    "500-COMMERCANT",
    "600-SALARIE",
    "700-TRAVAILLEUR INDEPENDANT A REVENU MODESTE",
    "900-AUTRE PROFESSION",
    "999-SANS PROFESSION",
];

export const remaOptions = [
  "Renouvellement",
  "Extension et/ou Changement de Conditions",
  "Maintien",
  "Annulation ligne",
];

export const decisionOptions = [
  "Rejet",
  "Ajournement",
  "Remboursement",
  "Annulation",
];

export const periodeOptions = [
  "Mensuel",
  "Trimestriel",
  "Quadrimestriel",
  "Semestriel",
  "Annuel",
  "Infini",
];

// Constants for Entrepreneurs page
export const genreOptions = ['Homme', 'Femme'];
export const situationFamilialeOptions = ['Célibataire', 'Marié', 'Divorcé', 'Veuf/Veuve'];
export const habitationOptions = [
  'Locataire', 
  'Propriétaire avec Crédit', 
  'propriétaire sans crédit', 
  'Maison familiale', 
  'Logement de fonctions', 
  'Autres'
];
export const niveauEtudesOptions = [
  'Aucun', 
  'Primaire', 
  'Secondaire', 
  'Niveau Bac', 
  'Bac+2', 
  'Bac+5', 
  'Bac+ et plus'
];
export const typeBienOptions = [
  'Appartement', 
  'Maison', 
  'Immeuble', 
  'Villa', 
  'Terrain Agricole', 
  'Terrain à batir', 
  'Entreprise', 
  'Action en Bourse', 
  'Location Commercial', 
  'DAT/BDC', 
  'Matériel Roulant', 
  'Autres'
];

// Constants for Entreprise page
export const formeJuridiqueOptions = [
  'ENTREPRISE INDIVIDUELLE',
  'SARLAU',
  'SARL (Société à Responsabilité Limitée)',
  'SA (Société Anonyme)',
  'STE EN COMMANDITE ACTION (Société en Commandite par Actions)',
  'SOCIETE DE FAIT',
  'SOCIETE IMMOBILIERE',
  'SOCIETES CIVILES',
  'STE EN NOM COLLECTIF (Société en Nom Collectif)',
  'STE EN PARTICIPATION (Société en Participation)',
  'STE EN COMMANDITE SIMPLE CONSORT (Société en Commandite Simple/Consortium)',
  'NON CLASSÉES'
];

export const biensUtilisesOptions = [
  'Terrain',
  'Constructions',
  'Usine',
  'Entrepôt',
  'Immeuble',
  'Appartement',
  'Local commercial',
  'Fond de commerce',
  'Matériel de production',
  'Matériel de transport',
  'Matériel informatique',
  'Matériel de bureau',
  'Autres'
];

export const garantieDetenueOptions = [
    "Hypothèque",
    "Hypothèque à inscription différée",
    "Hypothèque maritime (navires/aéronefs)",
    "Promesse d’hypothèque",
    "Nantissement de fonds de commerce",
    "Promesse de nantissement de fonds de commerce",
    "Nantissement d’actions",
    "Nantissement de bon de caisse",
    "Nantissement de compte à terme",
    "Nantissement de marché public",
    "Matériel et outillage (gage sur équipements)",
    "Engagement notarié",
    "Caution bancaire",
    "Caution personnelle",
    "Caution gagiste (avec gage)",
    "Billet à ordre (effet de commerce)",
    "Délégation d’assurance décès/invalidité",
    "Garantie d’État",
    "CCG, Fonds de garantie (organisme public)",
    "Assurance Multirisques Pro",
    "Assurance Incendie",
];