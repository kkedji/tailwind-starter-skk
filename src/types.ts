

export type Genre = 'Homme' | 'Femme';
export type SituationFamiliale = 'Célibataire' | 'Marié' | 'Divorcé' | 'Veuf/Veuve';
export type Habitation = 'Locataire' | 'Propriétaire avec Crédit' | 'propriétaire sans crédit' | 'Maison familiale' | 'Logement de fonctions' | 'Autres';
export type NiveauEtudes = 'Aucun' | 'Primaire' | 'Secondaire' | 'Niveau Bac' | 'Bac+2' | 'Bac+5' | 'Bac+ et plus';
export type TypeBien = 'Appartement' | 'Maison' | 'Immeuble' | 'Villa' | 'Terrain Agricole' | 'Terrain à batir' | 'Entreprise' | 'Action en Bourse' | 'Location Commercial' | 'DAT/BDC' | 'Matériel Roulant' | 'Autres';
export type FormeJuridiqueEntreprise = 'ENTREPRISE INDIVIDUELLE' | 'SARLAU' | 'SARL (Société à Responsabilité Limitée)' | 'SA (Société Anonyme)' | 'STE EN COMMANDITE ACTION (Société en Commandite par Actions)' | 'SOCIETE DE FAIT' | 'SOCIETE IMMOBILIERE' | 'SOCIETES CIVILES' | 'STE EN NOM COLLECTIF (Société en Nom Collectif)' | 'STE EN PARTICIPATION (Société en Participation)' | 'STE EN COMMANDITE SIMPLE CONSORT (Société en Commandite Simple/Consortium)' | 'NON CLASSÉES';
export type TypeBienEntreprise = 'Terrain' | 'Constructions' | 'Usine' | 'Entrepôt' | 'Immeuble' | 'Appartement' | 'Local commercial' | 'Fond de commerce' | 'Matériel de production' | 'Matériel de transport' | 'Matériel informatique' | 'Matériel de bureau' | 'Autres';

export type DossierStatus =
  | 'NOUVEAU' // Being edited by collector
  | 'EN_ANALYSE' // Submitted to analyst
  | 'RETOUR_COLLECTE' // Sent back to collector by analyst
  | 'EN_VALIDATION_DIRECTEUR' // Submitted to director
  | 'RETOUR_ANALYSE' // Sent back to analyst by director
  | 'EN_VALIDATION_COMITE' // Submitted to committee
  | 'VALIDE' // Approved by committee
  | 'REJETE'; // Rejected

export const statusLabelMapping: Record<DossierStatus, string> = {
    NOUVEAU: "Nouveau (Collecte)",
    EN_ANALYSE: "En Analyse",
    RETOUR_COLLECTE: "Retourné au Collecteur",
    EN_VALIDATION_DIRECTEUR: "Validation Directeur",
    RETOUR_ANALYSE: "Retourné à l'Analyste",
    EN_VALIDATION_COMITE: "Validation Comité",
    VALIDE: "Validé",
    REJETE: "Rejeté",
};


export interface AuditEntry {
  date: string;
  user: string;
  action: string;
  details?: string;
}

export interface RelationBancaire {
  id: string;
  banque: string;
  numeroCompte: string;
  ouvertureCompte: string;
  solde: number;
  mouvementsN1: number;
  mouvementsN: number;
  incidents: number;
}

export interface Entrepreneur {
  nom: string;
  prenom: string;
  telephone: string;
  genre: Genre;
  cni: string;
  dateNaissance: string;
  age: string;
  situationFamiliale: SituationFamiliale;
  nbPersACharge: number;
  adresse: string;
  habitation: Habitation;
  niveauEtudes: NiveauEtudes;
  autresEtudes: string;
  specialite: string;
  experienceProGlobale: string;
  experienceProSecteur: string;
  experienceProDetaillee: string;
  environnementFamilial: string;
  competencesManagement: string;
  relationsBancaires: RelationBancaire[];
  totalSurfacePatrimoniale: number;
}

export interface HistoriqueCredit {
  id: string;
  nomEntrepreneur: string;
  banque: string;
  dateOctroi: string;
  objetType: string;
  montant: number;
  dureeMois: number;
  mtEcheance: number;
  encours: number;
  impayes: number;
  renseignements: string;
}

export interface AutreAffaire {
  id: string;
  denomination: string;
  capital: number;
  partEntrepreneur: number;
  nomPrenom: string;
  activite: string;
  chiffreAffaires: number;
  banque: string;
}

export interface SurfacePatrimonialeItem {
  id: string;
  entrepreneur: string;
  part: number;
  bien: TypeBien;
  reference: string;
  consistance: string;
  valVenale: number;
  capitalRestantDu: number;
}


// --- Entreprise Page Types ---

export interface EvolutionCapital {
    id: string;
    date: string;
    capital: number;
    formeJuridique: string;
    entrepreneur1: string;
    k1: number;
    entrepreneur2: string;
    k2: number;
    entrepreneur3: string;
    k3: number;
}

export interface Dirigeant {
    id: string;
    nomPrenom: string;
    fonction: string;
    formationExperience: string;
    telephone: string;
}

export interface AutreAffaireEntreprise {
    id: string;
    denomination: string;
    capital: number;
    k: number;
    activite: string;
    caht: number;
    banque: string;
}

export interface MoyenEconomique {
    id: string;
    bienUtilise: TypeBienEntreprise;
    quantiteConsistance: string;
    valeurCptle: number;
    valeurEstimee: number;
}

export interface MoyenHumainPersonnel {
    nb: number;
    cadre: number;
    maitrise: number;
    ouvrier: number;
    total: number;
}

export interface MoyenHumain {
    administratif: MoyenHumainPersonnel;
    production: MoyenHumainPersonnel;
    commercial: MoyenHumainPersonnel;
    total: {
        masseSalariale12Mois: number;
        cotisationCNSS12Mois: number;
        nbreSalariesDeclares: number;
        dtNbSalariesClients: number;
        previsionCreationEmploi: string;
    };
}

export interface OrganisationManagement {
    preparationReleve: string;
    organisationServices: string;
    comptabilite: string;
    gestionRH: string;
    utilisationInformatique: string;
}

export interface EntrepriseData {
    denominationSociale: string;
    secteurActivite: string;
    siegeSocial: string;
    ville: string;
    locauxExploitation: string;
    emailSite: string;
    telephone: string;
    dateCreation: string;
    dateDebutActivite: string;
    formeJuridique: FormeJuridiqueEntreprise;
    capitalSocial: number;
    nPatente: string;
    nRegistreCommerce: string;
    nifu: string;
    nAffiliationCNSS: string;
    evolutionCapital: EvolutionCapital[];
    dirigeants: Dirigeant[];
    autresAffaires: AutreAffaireEntreprise[];
    moyensEconomiques: MoyenEconomique[];
    moyensHumains: MoyenHumain;
    organisationManagement: OrganisationManagement;
    syntheseEntreprise: string;
}

// --- Activité & Marché Page Types ---
export interface ProduitService {
    id: string;
    produitService: string;
    total: number;
    negocePct: number;
    productionPct: number;
    localePct: number;
    exportPct: number;
    quantites: number;
    unitesMesure: string;
}

export interface ClientPrincipal {
    id: string;
    denomination: string;
    rc: string;
    ville: string;
    ventesPct: number;
}

export interface FournisseurPrincipal {
    id: string;
    denomination: string;
    ville: string;
    achatsPct: number;
}

export interface ActiviteMarcheData {
    produitsServices: ProduitService[];
    clients: ClientPrincipal[];
    fournisseurs: FournisseurPrincipal[];
    caracteristiquesMarche: {
        tailleConcurrence: string;
        sensibiliteClimat: string;
        positionnement: string;
    };
    politiqueVentes: {
        diversificationPTF: string;
        veilleConcurrentielle: string;
        determinationObjectifs: string;
    };
    gestionProduction: {
        organisation: string;
        gestionRisques: string;
        gestionStocks: string;
    };
    politiqueAchats: {
        diversificationFournisseurs: string;
        negociationPrix: string;
        gestionAleas: string;
    };
    synthese: string;
}

// --- Historique Bancaire Page Types ---
export interface CompteInterne {
    id: string;
    beneficiaireCompte: string;
    numeroCompte: string;
    dateOuverture: string;
    mvtsConfiesN1: number;
    mvtsConfies12Mois: number;
    soldeMoyenN1: number;
    soldeMoyen12Mois: number;
    joursDebiteursN1: number;
    joursDebiteurs12Mois: number;
    joursDepassementN1: number;
    joursDepassement12Mois: number;
    joursCrediteursN1: number;
    joursCrediteurs12Mois: number;
}

export interface CompteExterne {
    id: string;
    banque: string;
    nomBeneficiaire: string;
    dateEntreeRelation: string;
    mvtsConfiesN1: number;
    mvtsConfies12Mois: number;
    soldeMoyenN1: number;
    soldeMoyen12Mois: number;
    joursDebiteursN1: number;
    joursDebiteurs12Mois: number;
    joursDepassementN1: number;
    joursDepassement12Mois: number;
    joursCrediteursN1: number;
    joursCrediteurs12Mois: number;
}

export interface HistoriqueBancaireData {
    dateEntreeRelation: string;
    comptesInternes: CompteInterne[];
    comptesExternes: CompteExterne[];
    cahtN: number;
    cattcReel: number;
    commentaires: string;
    partMvtsN1Pct?: number;
    partMvts12MPct?: number;
}

// --- Trésorerie Page Types ---
export interface TresorerieRowData {
    values: number[];
    moyenneRaisonnee: number;
    commentaire: string;
}

export interface DynamicTresorerieRow {
    id: string;
    label: string;
    data: TresorerieRowData;
}

export interface TresorerieData {
    soldeDate: string;
    soldeInitial: number;
    rows: {
        ventesJustifiees: TresorerieRowData;
        ventesAutreCompte: TresorerieRowData;
        ventesCompteConfrere: TresorerieRowData;
        ventesAutres: DynamicTresorerieRow[];
        autresRecettes: DynamicTresorerieRow[];

        achatsJustifies: TresorerieRowData;
        achatsAutreCompte: TresorerieRowData;
        achatsCompteConfrere: TresorerieRowData;
        achatsAutres: DynamicTresorerieRow[];

        autresDepenses: DynamicTresorerieRow[];

        salaireDirigeant: TresorerieRowData;
        salaires: TresorerieRowData;
        autresSalaires: DynamicTresorerieRow[];
        cnss: TresorerieRowData;
        impotsRevenu: TresorerieRowData;

        loyer: TresorerieRowData;
        electricite: TresorerieRowData;
        transport: TresorerieRowData;
        deplacements: TresorerieRowData;
        servicesExterieurs: TresorerieRowData;
        telephone: TresorerieRowData;
        autresCharges: DynamicTresorerieRow[];

        impotsTaxes: TresorerieRowData;
        fraisDouanes: TresorerieRowData;
        fraisFinanciers: TresorerieRowData;
        tvaAPayer: TresorerieRowData;

        emprunts: TresorerieRowData;
        augmentationCapital: TresorerieRowData;
        apportCC: TresorerieRowData;
        autresRessources: DynamicTresorerieRow[];

        rembEmprunts: TresorerieRowData;
        dividendes: DynamicTresorerieRow[];

        revenusMenage: TresorerieRowData;
        depensesMenage: TresorerieRowData;
    };
    justificationVentes: string;
    justificationAchats: string;
    justificationAutresFlux: string;
}

// --- Garanties Page Types ---
export interface GarantieRow {
  id: string;
  lignesCredit: string;
  garantiesDetenues: string;
  rangOuPct: string;
  reference: string;
  consistance: string;
  valeurOrigine: number;
  valeurActuelleEstimee: number;
  encoursCredit: number;
  valorisationBanque: number; // this is %
}

export interface ConditionSpecialeRow {
  id: string;
  condition: string;
}

export interface GarantiesData {
  tauxDeCouverture?: number;
  tauxCouvertureMinimum: number;
  garanties: GarantieRow[];
  conditionsSpeciales: ConditionSpecialeRow[];
  synthese: string;
}


// --- Ratios Page Types ---
export interface RatiosData {
  controles: {
    datesExercicesSaisis: { annee1: string; annee2: string };
    equilibreBilan: { annee1: string; annee2: string };
    nombreDeMois: { annee1: number; annee2: number };
  };
  dates: { annee1: string; annee2: string };
  structureSolvabilite: {
    fpTotalBilan: { annee1: string; annee2: string };
    fpDettesFinancieres: { annee1: string; annee2: string };
    empruntsCapitauxPermanents: { annee1: string; annee2: string };
    actifNetComptable: { annee1: number; annee2: number };
    fondsRoulementNetGlobal: { annee1: number; annee2: number };
    besoinFondsRoulement: { annee1: number; annee2: number };
    tresorerie: { annee1: number; annee2: number };
  };
  delais: {
    clients: { annee1: string; annee2: string };
    stocks: { annee1: string; annee2: string };
    fournisseurs: { annee1: string; annee2: string };
  };
  rentabilitePerformance: {
    chargesPersonnel: { annee1: string; annee2: string };
    rentabiliteExploitation: { annee1: string; annee2: string };
    chargesFinancieres: { annee1: string; annee2: string };
    resultatNet: { annee1: string; annee2: string };
  };
  syntheseFinanciere: string;
  commentaires: {
    structureTresorerie: string;
    performanceRentabilite: string;
  };
}

// --- Echeancier Page Types ---
export interface EcheancierRow {
  mois: number;
  capitalRestantDu: number;
  rembtCapital: number;
  rembtInteret: number;
  echeance: number;
}

export interface EcheancierData {
  montantPrete: number;
  duree: number;
  tauxAnnuel: number;
  schedule: EcheancierRow[];
}

// --- Synthese Page Types ---
export interface SyntheseData {
  dateImpression: string;
  chargeClientele: string;
  directeurAgence: string;
  responsableEngagements: string;
  comite: string;
}

// --- Calculs Optionnels Page Types ---
export interface AnalyseVentesRow {
    id: string;
    nomProduit: string;
    quantite: number;
    prixVenteUnitaire: number;
    tva: number;
}

export interface AnalyseAchatsRow {
    id: string;
    nomProduit: string;
    quantite: number;
    prixAchatUnitaire: number;
    tva: number;
    fournisseur: string;
}

export interface AnalyseMargesRow {
    id: string;
    nomProduit: string;
    quantite: number;
    prixAchatUnitaire: number;
    prixVenteUnitaire: number;
}

export interface CalculsOptionnelsData {
    ventes: AnalyseVentesRow[];
    achats: AnalyseAchatsRow[];
    marges: AnalyseMargesRow[];
}

// --- Compte de Résultat Page Types ---
export interface CompteDeResultatValue {
    exerciceN: number;
    exerciceN1: number;
}

export type CompteDeResultatKeys = 
 'RA' | 'RB' | 'RC' | 'RD' | 'RE' | 'RH' | 'RI' | 'RJ' | 'RK' | 'RL' | 'RP' | 'RQ' | 'RS' |
 'SA' | 'SC' | 'SD' | 'SK' | 'SL' | 'SM' | 'SQ' | 'SR' | 
 'TA' | 'TC' | 'TD' | 'TE' | 'TF' | 'TH' | 'TS' | 'TT' |
 'UA' | 'UC' | 'UD' | 'UE' | 'UK' | 'UL' | 'UM' | 'UN' | 'UJ';

export type CompteDeResultatData = {
    dates: {
        exerciceN: string;
        exerciceN1: string;
    };
    nbMois: {
        exerciceN: number;
        exerciceN1: number;
    };
    values: Record<CompteDeResultatKeys, CompteDeResultatValue>;
};


// --- Bilan Page Types ---
export interface BilanActifValue {
    brut: number;
    amortProv: number;
    brutN1: number;
    amortProvN1: number;
}

export interface BilanPassifValue {
    net: number;
    netN1: number;
}

export type BilanActifKeys = 'AB' | 'AC' | 'AE' | 'AF' | 'AG' | 'AH' | 'AJ' | 'AK' | 'AL' | 'AM' | 'AN' | 'AP' | 'AR' | 'AS' | 'AW' | 'BA' | 'BC' | 'BD' | 'BE' | 'BF' | 'BH' | 'BI' | 'BJ' | 'BQ' | 'BR' | 'BS' | 'BU';
export type BilanPassifKeys = 'CA' | 'CB' | 'CC' | 'CD' | 'CE' | 'CF' | 'CG' | 'CH' | 'CK' | 'CL' | 'CM' | 'DA' | 'DB' | 'DC' | 'DD' | 'DE' | 'DH' | 'DI' | 'DJ' | 'DK' | 'DL' | 'DM' | 'DN' | 'DQ' | 'DR' | 'DS' | 'DU';

export type BilanData = {
    ok1: string;
    ok2: string;
    exerciceN: string;
    exerciceN1: string;
    actif: Record<BilanActifKeys, BilanActifValue>;
    passif: Record<BilanPassifKeys, BilanPassifValue>;
};

// --- Analysis Types ---

export interface AnalyseFacteur {
  selection: number; // index of the selected option
  score: number;
}

export type AnalyseSection = Record<string, AnalyseFacteur>;

export interface AnalyseData {
    entrepreneur: AnalyseSection;
    entreprise: AnalyseSection;
    activite: AnalyseSection;
    cashFlow: AnalyseSection;
    historique: AnalyseSection;
}

export interface ScoringData {
    scores: {
        entrepreneur: number;
        entreprise: number;
        activite: number;
        historique: number;
        cashFlow: number;
    };
    weightedScores: {
        entrepreneur: number;
        entreprise: number;
        activite: number;
        historique: number;
        cashFlow: number;
    };
    totalScore: number;
    decision: string;
    motifs: string;
}


// --- Main Data Structure ---

export interface CreditApplicationData {
  id: string;
  status: DossierStatus;
  history: AuditEntry[];
  
  analysis: AnalyseData;
  scoring: ScoringData;

  affaire: string;
  dossier: string;
  dateDepot: string;
  sequenceDossier: string;
  datePremiereVisite: string;
  dateValidationPreComite: string;
  dateDerniereVisite: string;
  dossierCorrect: string;
  numeroClient: string;
  codeAgence: string;
  
  denominationSociale: string;
  agentBancaireNom: string;
  profil: string;
  matricule: string;
  nomDirigeant: string;
  numeroCompte: string;
  formeJuridique: string;
  homme: boolean;
  femme: boolean;
  capitalSocial: string;
  dateEntreeRelation: string;
  activiteDescription: string;
  registreCommerce: string;
  secteurActivite: string;
  siegeSocial: string;
  activitePrincipale: string;
  localite: string;
  dateCreationEntreprise: string;

  syntheseDemande: string;

  creditsEnCours: CreditEnCours[];
  nouveauxCredits: NouveauCredit[];

  decisionNouveauxCredits: DecisionCredit[];
  
  notationInterneDate: string;
  notationInterneAffaire: string;
  notationInterneGroupe: string;
  notationInterneRetenue: string;
  
  rentabiliteDate: string;
  rentabilitePnb: string;
  rentabiliteCommentaire: string;
  
  cipIncidentsRegularisesMontant: string;
  cipIncidentsRegularisesNombre: string;
  cipIncidentsNonRegularisesMontant: string;
  cipIncidentsNonRegularisesNombre: string;
  
  creditBureauDateConsultation: string;
  creditBureauAutresEtab: string;
  creditBureauEngagementsSains: string;
  creditBureauEngagementsDefaut: string;
  creditBureauImpayes: string;
  creditBureauContentieux: string;
  creditBureauCommentaire: string;
  
  indicateursDateN: string;
  indicateursDateN1: string;
  indicateursCAHTN: string;
  indicateursCAHTN1: string;
  indicateursResultatNetN: string;
  indicateursResultatNetN1: string;
  indicateursMvtConfieN1: string;
  indicateursMvtConfie12Mois: string;

  ratiosFpDettesN: string;
  ratiosFpDettesN1: string;
  ratiosActifNetN: string;
  ratiosActifNetN1: string;
  ratiosResultatNetCAN: string;
  ratiosResultatNetCAN1: string;

  cashFlowTotalCalculee: string;
  cashFlowTotalRaisonnee: string;
  cashFlowEcheancesCalculee: string;
  cashFlowEcheancesRaisonnee: string;
  cashFlowEngagementsCalculee: string;
  cashFlowEngagementsRaisonnee: string;
  
  creditMaximumDuree: number;
  creditMaximumPlafond: number;
  
  ratingCommercial: number;
  
  progressiviteCredit1: number;
  progressiviteCredit2: number;
  progressiviteCredit3: number;
  progressiviteCredit4: number;

  progressivitePlafond1: number;
  progressivitePlafond2: number;
  progressivitePlafond3: number;
  progressivitePlafond4: number;

  // Data for Entrepreneurs page
  dateOuvertureDossier: string;
  entrepreneurs: [Entrepreneur, Entrepreneur];
  historiqueCredits: HistoriqueCredit[];
  autresAffaires: AutreAffaire[];
  surfacePatrimoniale: SurfacePatrimonialeItem[];
  syntheseEntrepreneur: string;

  // Data for Entreprise page
  entreprise: EntrepriseData;

  // Data for Activite & Marche page
  activiteMarche: ActiviteMarcheData;
  
  // Data for Garanties page
  garanties: GarantiesData;

  // Data for Compte de Résultat page
  compteDeResultat: CompteDeResultatData;
  
  // Data for Bilan page
  bilan: BilanData;
  bilanDateN?: string;
  bilanDateN1?: string;

  // Data for Historique Bancaire page
  historiqueBancaire: HistoriqueBancaireData;

  // Data for Trésorerie page
  tresorerie: TresorerieData;
  
  // Data for Ratios page
  ratios: RatiosData;

  // Data for Echeancier page
  echeancier: EcheancierData;

  // Data for Synthese page
  synthese: SyntheseData;

  // Data for Calculs Optionnels page
  calculsOptionnels: CalculsOptionnelsData;
}

export interface CreditEnCours {
  id: string;
  nature: string;
  montantAutorise: number;
  montantEncours: number;
  montantImpaye: number;
  dureeMois: number;
  dateFin: string;
  tauxAccorde: number;
  rema: string;
  commentaires: string;
  controleRema: string;
}

export interface NouveauCredit {
  id: string;
  nature: string;
  montantDemande: number;
  montantPropose: number;
  dureeMois: number;
  dateFin: string;
  echeanceFrequence: string;
  echeancePeriode: string;
  tauxGrille: string;
  tauxAccorde: string;
  commentaires: string;
  col1: number;
  col2: number;
}

export interface DecisionCredit {
    id: string;
    natureProposee: string;
    decision: string;
    natureAccordee: string;
    montant: number;
    commentaires: string;
}
